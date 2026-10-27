// Zdjęcia i filmy z biblioteki (/api/media/file/<nazwa>) prosto z R2, bez Payloada i bazy.
// Przez Payload każde zdjęcie czekało ok. 2 s na pierwszy bajt (pomiar 26.10.2026), a strona główna ma ich kilkadziesiąt.
// Media są publiczne (access.read: anyone), więc pomijamy tylko zapytanie o rekord.
//
// ?w=<szerokość> daje mniejszą kopię (Images binding, AVIF albo WebP według przeglądarki), robioną raz i trzymaną
// w R2 pod _rozmiary/. Bez bindingu, po przekroczeniu limitu darmowych przekształceń albo przy błędzie idzie oryginał.

import { WIDTHS } from '../lib/images'

export const MEDIA_PREFIX = '/api/media/file/'

/** Pamięć podręczna centrum Cloudflare (typy DOM nie znają caches.default z Workers). */
const edgeCache = () => (caches as unknown as { default: Cache }).default
const CACHE = 'public, max-age=2592000, stale-while-revalidate=86400'
const RESIZABLE = /^image\/(jpeg|png|webp|avif)$/

type Env = CloudflareEnv

function baseHeaders(obj: R2Object) {
  const headers = new Headers()
  obj.writeHttpMetadata(headers)
  headers.set('etag', obj.httpEtag)
  headers.set('cache-control', CACHE)
  headers.set('accept-ranges', 'bytes')
  headers.set('x-content-type-options', 'nosniff')
  // pliki SVG/XML z biblioteki nie mogą uruchamiać skryptów (jak w Payload: UPLOAD_CONTENT_SECURITY_POLICY)
  if (/xml|svg/.test(headers.get('content-type') ?? '')) headers.set('content-security-policy', "default-src 'none'; style-src 'unsafe-inline'; sandbox")
  return headers
}

/** null: nie umiemy obsłużyć (np. brak pliku w R2), żądanie idzie do Payloada jak dotąd. */
export async function serveMedia(req: Request, env: Env, ctx: ExecutionContext): Promise<Response | null> {
  if (req.method !== 'GET' && req.method !== 'HEAD') return null
  const url = new URL(req.url)
  let name: string
  try {
    name = decodeURIComponent(url.pathname.slice(MEDIA_PREFIX.length))
  } catch {
    return null
  }
  if (!name || name.includes('/') || name.startsWith('_')) return null

  const width = Number(url.searchParams.get('w'))
  const wanted = WIDTHS.includes(width as (typeof WIDTHS)[number]) ? width : 0
  const format = /image\/avif/.test(req.headers.get('accept') ?? '') ? 'avif' : 'webp'
  const range = req.headers.get('range')

  // pamięć podręczna centrum: bez zapytań do R2; zakres bajtów (filmy) obsługuje sama
  const cacheKey = `https://media.matygowa/${encodeURIComponent(name)}${wanted ? `?w=${wanted}&f=${format}` : ''}`
  const hit = await edgeCache().match(new Request(cacheKey, { headers: range ? { range } : {} })).catch((): undefined => undefined)
  if (hit) return withVary(hit, wanted)

  try {
    if (wanted && env.IMAGES) {
      const resized = await resizedCopy(env, ctx, name, wanted, format)
      if (resized) {
        ctx.waitUntil(edgeCache().put(cacheKey, resized.clone()).catch(() => {}))
        return withVary(resized, wanted)
      }
    }

    const obj = await env.R2.get(name, range ? { range: req.headers } : undefined)
    if (!obj) return null
    const headers = baseHeaders(obj)
    if (range && obj.range && 'offset' in obj.range) {
      const offset = obj.range.offset ?? 0
      const length = obj.range.length ?? obj.size - offset
      headers.set('content-range', `bytes ${offset}-${offset + length - 1}/${obj.size}`)
      headers.set('content-length', String(length))
      return new Response(obj.body, { status: 206, headers })
    }
    headers.set('content-length', String(obj.size))
    const res = new Response(req.method === 'HEAD' ? null : obj.body, { headers })
    if (req.method === 'GET' && !range && obj.size < 50 * 1024 * 1024) ctx.waitUntil(edgeCache().put(cacheKey, res.clone()).catch(() => {}))
    return res
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', msg: 'media_edge_failed', name, err: String(err) }))
    return null
  }
}

function withVary(res: Response, resized: number) {
  if (!resized) return res
  const out = new Response(res.body, res)
  out.headers.set('vary', 'Accept')
  return out
}

/** Mniejsza kopia z R2 albo zrobiona teraz (i zapisana w R2 na następne razy). */
async function resizedCopy(env: Env, ctx: ExecutionContext, name: string, width: number, format: 'avif' | 'webp') {
  const original = await env.R2.head(name)
  if (!original || !RESIZABLE.test(original.httpMetadata?.contentType ?? '')) return null
  const key = `_rozmiary/${original.etag}/${width}.${format}/${name}`
  const stored = await env.R2.get(key)
  if (stored) return new Response(stored.body, { headers: copyHeaders(stored.httpMetadata?.contentType ?? `image/${format}`, stored.size) })

  const source = await env.R2.get(name)
  if (!source) return null
  try {
    const result = await env.IMAGES!.input(source.body)
      .transform({ width, fit: 'scale-down' })
      .output({ format: `image/${format}`, quality: format === 'avif' ? 68 : 82 })
    const bytes = await new Response(result.image()).arrayBuffer()
    // kopia większa od oryginału (mały plik, dobrze skompresowany) nic nie daje
    if (bytes.byteLength >= original.size) return null
    const type = result.contentType()
    ctx.waitUntil(env.R2.put(key, bytes, { httpMetadata: { contentType: type } }).catch(() => {}))
    return new Response(bytes, { headers: copyHeaders(type, bytes.byteLength) })
  } catch (err) {
    console.warn(JSON.stringify({ level: 'warn', msg: 'media_resize_failed', name, width, err: String(err) }))
    return null
  }
}

function copyHeaders(type: string, size: number) {
  return new Headers({ 'content-type': type, 'content-length': String(size), 'cache-control': CACHE, 'x-content-type-options': 'nosniff' })
}
