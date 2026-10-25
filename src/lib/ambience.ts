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
 * Skrypt wstawiany przed treścią: ustawia zapamiętany wybór gościa, a bez wyboru noc między 20:00 a 6:00
 * czasu gościa. Działa przed pierwszym malowaniem, więc strona nie mruga.
 */
export const AMBIENCE_INIT_SCRIPT = `try{var d=document.documentElement,p=localStorage.getItem('${AMBIENCE_KEYS.pora}'),s=localStorage.getItem('${AMBIENCE_KEYS.sezon}'),h=new Date().getHours();d.dataset.pora=p==='noc'||p==='dzien'?p:(h>=20||h<6?'noc':'dzien');if(s==='zima'||s==='lato')d.dataset.sezon=s}catch(e){}`

