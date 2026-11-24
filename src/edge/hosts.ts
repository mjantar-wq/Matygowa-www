/**
 * Adresy strony: produkcja (matygowaosada.pl) i testowy matygowa.audiowizard.pl.
 * Decyzje podejmuje Worker w czasie żądania (zmienne z wrangler.jsonc), a nie budowanie,
 * więc ten sam pakiet obsługuje obie nazwy i nie trzeba go budować osobno.
 */
export const PRODUCTION_HOST = 'matygowaosada.pl'
const WWW_HOST = `www.${PRODUCTION_HOST}`

/** www.matygowaosada.pl → https://matygowaosada.pl (301, ścieżka i parametry zostają). */
export function wwwRedirect(request: Request): Response | null {
  const url = new URL(request.url)
  if (url.hostname !== WWW_HOST) return null
  return Response.redirect(`https://${PRODUCTION_HOST}${url.pathname}${url.search}`, 301)
}

/** Strona może być w wyszukiwarkach tylko pod adresem produkcyjnym i przy SITE_INDEXABLE=true. */
export function indexableHost(request: Request, env: object): boolean {
  return (env as { SITE_INDEXABLE?: string }).SITE_INDEXABLE === 'true' && new URL(request.url).hostname === PRODUCTION_HOST
}

/** Adres testowy: robots.txt zamyka całą stronę (produkcyjny robots.txt składa Next). */
export function closedRobots(request: Request, env: object): Response | null {
  if (new URL(request.url).pathname !== '/robots.txt' || indexableHost(request, env)) return null
  return new Response('User-agent: *\nDisallow: /\n', { headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex, nofollow' } })
}

/** Odpowiedź dla nieindeksowanego adresu dostaje nagłówek noindex. */
export function withRobotsHeader(request: Request, env: object, res: Response): Response {
  if (indexableHost(request, env) || res.status === 101 || res.headers.has('x-robots-tag')) return res
  const out = new Response(res.body, res)
  out.headers.set('x-robots-tag', 'noindex, nofollow')
  return out
}
