// Bufor gotowych stron dla gości (HTML i dane nawigacji RSC). Bez niego każde wejście składało stronę od zera:
// kilkadziesiąt zapytań do D1 i kilka sekund czekania na pierwszy bajt (pomiar 26.10.2026).
//
// Dwa poziomy: pamięć podręczna Cloudflare w danym centrum (najszybsza) i kopia w R2, wspólna dla wszystkich centrów,
// więc pierwszy gość w Warszawie korzysta ze strony złożonej wcześniej we Frankfurcie. Klucz zawiera wersję treści
// (src/edge/version.ts, podbijaną po zapisie w panelu) i wersję wdrożenia, więc zmiana treści albo kodu od razu
// daje nową stronę. Strona starsza niż FRESH_MS idzie do gościa od razu, a nowa składa się w tle.
// Panel, API, podgląd wersji roboczych i zalogowani redaktorzy idą zawsze prosto do Next.

import { cmsErrorSince, contentVersion } from './version'

type Env = CloudflareEnv
/** Pamięć podręczna centrum Cloudflare (typy DOM nie znają caches.default z Workers). */
const edgeCache = () => (caches as unknown as { default: Cache }).default
type Handler = (req: Request, env: Env, ctx: ExecutionContext) => Promise<Response>

/** Po tym czasie strona z bufora odświeża się w tle (ceny i dostępność z IceColdRes, opinie z Google). */
export const FRESH_MS = 5 * 60_000
/** Jak długo bufor trzyma stronę; starsza niż FRESH_MS i tak jest od razu odświeżana. */
const KEEP_S = 7 * 86_400

const SKIP_PATH = /^\/(panel|admin|api|_next|cdn-cgi|ilustracje)(\/|$)/
const SKIP_COOKIE = /(?:^|;\s*)(?:payload-token|__prerender_bypass|__next_preview_data)=/
/** Nagłówki nawigacji RSC, od których zależy odpowiedź (Next liczy z nich też parametr _rsc). */
const RSC_HEADERS = ['rsc', 'next-router-prefetch', 'next-router-state-tree', 'next-router-segment-prefetch', 'next-url']
/** Parametry kampanii nie zmieniają strony (zapamiętuje je skrypt w przeglądarce), więc nie rozbijają bufora. */
const TRACKING = /^(utm_\w+|gclid|gbraid|wbraid|fbclid|msclkid|_gl)$/
const DROP_HEADERS = ['set-cookie', 'cache-control', 'vary', 'content-length', 'content-encoding', 'transfer-encoding', 'x-bufor', 'x-bufor-czas']

export function cacheablePage(req: Request): boolean {
  if (req.method !== 'GET') return false
  const { pathname, protocol } = new URL(req.url)
  // adres http dostaje od Next przekierowanie na https (next.config.ts), więc nie może trafić na bufor
  if (protocol !== 'https:' || req.headers.get('x-forwarded-proto') === 'http') return false
  if (SKIP_PATH.test(pathname) || /\.[a-z0-9]+$/i.test(pathname)) return false
  return !SKIP_COOKIE.test(req.headers.get('cookie') ?? '')
}

async function sha1(text: string) {
  const hash = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(text))
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** Klucz bufora: adres bez parametrów kampanii + nagłówki RSC + wersja treści i wdrożenia. */
export async function pageKey(req: Request, version: string, deploy: string) {
  const url = new URL(req.url)
  const params = [...url.searchParams].filter(([k]) => !TRACKING.test(k)).sort(([a], [b]) => a.localeCompare(b))
  const rsc = RSC_HEADERS.map((h) => `${h}:${req.headers.get(h) ?? ''}`).join('\n')
  const id = await sha1(`${url.pathname}?${new URLSearchParams(params)}\n${rsc}`)
  // w R2 tylko pełne strony pod czystym adresem: dowolne parametry i nawigacje RSC nie mnożą plików bez końca
  const shared = !params.length && !req.headers.has('rsc')
  return { cache: `https://bufor.matygowa/${deploy}/${version}/${id}`, r2: shared ? `_bufor/strony/${id}` : null }
}

type PageKey = Awaited<ReturnType<typeof pageKey>>

type Stored = { at: number; version: string; deploy: string; status: number; headers: [string, string][]; body: string }

const storable = (res: Response) => {
  const type = res.headers.get('content-type') ?? ''
  return res.status === 200 && !res.headers.has('set-cookie') && (type.startsWith('text/html') || type.startsWith('text/x-component'))
}

function toResponse(s: Stored, state: string) {
  const headers = new Headers(s.headers)
  headers.set('cache-control', 'private, no-cache, no-store, max-age=0, must-revalidate')
  headers.set('x-bufor', state)
  return new Response(s.body, { status: s.status, headers })
}

function toCache(s: Stored) {
  const headers = new Headers({ 'content-type': 'application/json', 'cache-control': `public, max-age=${KEEP_S}` })
  return new Response(JSON.stringify(s), { headers })
}

const refreshing = new Set<string>()

/** Składa stronę w Next i zapisuje w obu poziomach bufora. Ciasteczek gościa nie przekazujemy: strona ma być wspólna. */
async function render(req: Request, env: Env, ctx: ExecutionContext, handler: Handler, key: PageKey, version: string, deploy: string) {
  const headers = new Headers(req.headers)
  headers.delete('cookie')
  const started = Date.now()
  const res = await handler(new Request(req.url, { method: 'GET', headers }), env, ctx)
  if (!storable(res)) return { res, stored: null }
  const body = await res.text()
  if (cmsErrorSince(started)) return { res: new Response(body, res), stored: null }
  const stored: Stored = {
    at: Date.now(),
    version,
    deploy,
    status: res.status,
    headers: [...res.headers].filter(([k]) => !DROP_HEADERS.includes(k.toLowerCase())),
    body,
  }
  const save = Promise.all([
    edgeCache().put(key.cache, toCache(stored)),
    key.r2 ? env.R2.put(key.r2, JSON.stringify(stored), { httpMetadata: { contentType: 'application/json' } }) : null,
  ]).catch((err) => console.error(JSON.stringify({ level: 'error', msg: 'page_cache_store_failed', err: String(err) })))
  ctx.waitUntil(save)
  return { res, stored }
}

export async function servePage(req: Request, env: Env, ctx: ExecutionContext, handler: Handler): Promise<Response> {
  let version: string
  let deploy: string
  let key: PageKey
  try {
    version = await contentVersion(env.R2)
    deploy = env.CF_VERSION_METADATA?.id ?? 'dev'
    key = await pageKey(req, version, deploy)
  } catch {
    return handler(req, env, ctx)
  }

  let stored: Stored | null = null
  let state = 'HIT'
  try {
    const hit = await edgeCache().match(key.cache)
    if (hit) stored = (await hit.json()) as Stored
    else if (key.r2) {
      const obj = await env.R2.get(key.r2)
      const fromR2 = obj ? ((await obj.json()) as Stored) : null
      // kopia z R2 z inną wersją treści albo kodu (np. sprzed wdrożenia) nie nadaje się do pokazania
      if (fromR2 && fromR2.version === version && fromR2.deploy === deploy) {
        stored = fromR2
        state = 'R2'
        ctx.waitUntil(edgeCache().put(key.cache, toCache(fromR2)))
      }
    }
  } catch {
    stored = null
  }

  if (stored) {
    if (Date.now() - stored.at > FRESH_MS && !refreshing.has(key.cache)) {
      refreshing.add(key.cache)
      state += '-ODSWIEZANIE'
      ctx.waitUntil(
        render(req, env, ctx, handler, key, version, deploy)
          .catch(() => {})
          .finally(() => refreshing.delete(key.cache)),
      )
    }
    return toResponse(stored, state)
  }

  const { res, stored: fresh } = await render(req, env, ctx, handler, key, version, deploy)
  return fresh ? toResponse(fresh, 'MISS') : res
}
