/**
 * Pomiar przejścia do rezerwacji (koncepcja F5). UTM z pierwszego wejścia w sesji trafiają do
 * silnika rezerwacji, nawet gdy gość obejrzał po drodze kilka podstron; zdarzenia idą do dataLayer,
 * a GTM wysyła je do GA4 tylko po zgodzie (Consent Mode).
 */
const UTM_KEY = 'mo_utm'
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id']

type DataLayerWindow = Window & { dataLayer?: unknown[] }

export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return
  const w = window as DataLayerWindow
  w.dataLayer = w.dataLayer || []
  w.dataLayer.push({ event, ...params })
}

/** UTM z adresu (zapisane na sesję) albo z wcześniejszego wejścia w tej sesji. */
export function campaignParams(search = typeof window === 'undefined' ? '' : window.location.search): Record<string, string> {
  const fromUrl = Object.fromEntries([...new URLSearchParams(search)].filter(([k, v]) => UTM_PARAMS.includes(k) && v))
  try {
    if (Object.keys(fromUrl).length) sessionStorage.setItem(UTM_KEY, JSON.stringify(fromUrl))
    else return JSON.parse(sessionStorage.getItem(UTM_KEY) ?? '{}')
  } catch {
    // tryb prywatny bez sessionStorage: zostają UTM z bieżącego adresu
  }
  return fromUrl
}

/** Dokleja UTM do adresu silnika, nie nadpisując parametrów, które już są w linku. */
export function withCampaign(url: string, utm: Record<string, string>) {
  const u = new URL(url)
  for (const [k, v] of Object.entries(utm)) if (!u.searchParams.has(k)) u.searchParams.set(k, v)
  return u.toString()
}

export const nightsBetween = (arrival?: string, departure?: string) =>
  arrival && departure ? Math.max(0, Math.round((Date.parse(departure) - Date.parse(arrival)) / 86_400_000)) : undefined
