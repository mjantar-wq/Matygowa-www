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

export const AMBIENCE_KEYS = { pora: 'mo-pora', sezon: 'mo-sezon' } as const

/**
 * Domyślny nastrój dla chwili `now`: zima od listopada do marca, noc między zmierzchem a świtem nad osadą
 * (49,34° N, 20,05° E; pół godziny po zachodzie i przed wschodem słońca). Funkcja nie korzysta z niczego
 * spoza siebie, bo jej treść trafia też do skryptu przed malowaniem.
 */
export function defaultAmbience(now: number): { pora: 'dzien' | 'noc'; sezon: 'zima' | 'lato' } {
  const date = new Date(now)
  const month = date.getUTCMonth() + 1
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
  return { pora: night ? 'noc' : 'dzien', sezon: month >= 11 || month <= 3 ? 'zima' : 'lato' }
}

/**
 * Skrypt wstawiany przed treścią: ustawia nastrój według pory roku i dnia, chyba że gość w tej wizycie
 * wybrał inaczej (wybór trzymamy w sessionStorage, więc kolejna wizyta zaczyna się od pory zgodnej z zegarem).
 * Działa przed pierwszym malowaniem, więc strona nie mruga.
 */
export const AMBIENCE_INIT_SCRIPT = `try{var d=document.documentElement,a=(${defaultAmbience.toString()})(Date.now()),p=sessionStorage.getItem('${AMBIENCE_KEYS.pora}'),s=sessionStorage.getItem('${AMBIENCE_KEYS.sezon}');d.dataset.pora=p==='noc'||p==='dzien'?p:a.pora;d.dataset.sezon=s==='zima'||s==='lato'?s:a.sezon}catch(e){}`
