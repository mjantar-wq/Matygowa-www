/** Cztery nastroje strony: pora dnia × pora roku (wartości atrybutów data-pora i data-sezon na <html>). */
export const AMBIENCES = [
  ['dzien', 'zima'],
  ['dzien', 'lato'],
  ['noc', 'zima'],
  ['noc', 'lato'],
] as const

type Variant = { pora?: string | null; sezon?: string | null }

/**
 * Dla każdego nastroju wybiera najlepszy wariant: dokładny, potem ta sama pora dnia (inna pora roku),
 * na końcu pierwszy (domyślny). Zwraca dla każdego wariantu listę nastrojów, np. ["noc-zima"].
 */
export function assignSlots(variants: Variant[]): string[][] {
  const out = variants.map(() => [] as string[])
  if (!variants.length) return out
  for (const [pora, sezon] of AMBIENCES) {
    const score = (v: Variant) => (v.pora === pora ? 2 : v.pora ? -4 : 0) + (v.sezon === sezon ? 1 : v.sezon ? -1 : 0)
    let best = 0
    variants.forEach((v, i) => {
      if (score(v) > score(variants[best])) best = i
    })
    out[best].push(`${pora}-${sezon}`)
  }
  return out
}

/**
 * Domyślny nastrój dla chwili `now`: lato w kalendarzową wiosnę i lato (21.03–22.09), zima jesienią i zimą; noc między zmierzchem a świtem nad osadą
 * (49,34° N, 20,05° E; pół godziny po zachodzie i przed wschodem słońca). Funkcja nie korzysta z niczego
 * spoza siebie, bo jej treść trafia też do skryptu przed malowaniem.
 */
export function defaultAmbience(now: number): { pora: 'dzien' | 'noc'; sezon: 'zima' | 'lato' } {
  const date = new Date(now)
  const monthDay = (date.getUTCMonth() + 1) * 100 + date.getUTCDate()
  const start = Date.UTC(date.getUTCFullYear(), 0, 0)
  const day = Math.floor((now - start) / 86400000)
  const rad = Math.PI / 180
  const lat = 49.34 * rad
  const decl = -23.44 * rad * Math.cos(((2 * Math.PI) / 365) * (day + 10))
  const cosH = (Math.sin(-0.833 * rad) - Math.sin(lat) * Math.sin(decl)) / (Math.cos(lat) * Math.cos(decl))
  const halfDay = Math.acos(Math.max(-1, Math.min(1, cosH))) / rad / 15
  const noon = 12 - 20.05 / 15
  const hour = date.getUTCHours() + date.getUTCMinutes() / 60
  const night = hour < noon - halfDay - 0.5 || hour > noon + halfDay + 0.5
  return { pora: night ? 'noc' : 'dzien', sezon: monthDay >= 321 && monthDay <= 922 ? 'lato' : 'zima' }
}

/**
 * Skrypt wstawiany przed treścią: ustawia nastrój wyłącznie według bieżącej daty i godziny nad osadą.
 * Ręczny wybór gościa (przełączniki w nagłówku) działa tylko do przeładowania strony i nie jest nigdzie zapisywany,
 * więc każda wizyta i każde odświeżenie zaczyna od nastroju zgodnego z zegarem. Usuwa też klucze zapisane przez
 * wcześniejszą wersję, która trzymała wybór w sessionStorage i potrafiła na stałe utrzymać zimową noc w dzień.
 * Działa przed pierwszym malowaniem, więc strona nie mruga.
 */
export const AMBIENCE_INIT_SCRIPT = `try{var d=document.documentElement,a=(${defaultAmbience.toString()})(Date.now());d.dataset.pora=a.pora;d.dataset.sezon=a.sezon;try{sessionStorage.removeItem('mo-pora');sessionStorage.removeItem('mo-sezon')}catch(e){}}catch(e){}`
