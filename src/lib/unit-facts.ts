import type { Locale } from '@/i18n/locales'

/**
 * Krótkie opisy domu na kafelkach (lista domków i wyniki „Sprawdź termin”), w jednym miejscu, żeby oba kafelki mówiły to samo.
 */

/**
 * Liczba osób z dopiskiem o sofie (Michał, 19.11.2026): przy domkach 10-osobowych gość od razu widzi, że 2 osoby śpią
 * na rozkładanej sofie w salonie. Liczba osób na sofie przychodzi z IceColdRes (`sofaBedGuests` typu kwatery), przy 0 bez dopisku.
 */
export function guestsFact(locale: Locale, maxGuests: number, sofaGuests?: number | null): string {
  const pl = locale === 'pl'
  const base = pl ? `do ${maxGuests} osób` : `up to ${maxGuests} guests`
  if (!sofaGuests || sofaGuests <= 0) return base
  return pl ? `${base} (w tym ${sofaGuests} na sofie)` : `${base} (incl. ${sofaGuests} on the sofa bed)`
}

export interface LayoutInput {
  bedrooms?: number | null
  bathrooms?: number | null
  /** osobne WC: w domkach zawsze, w apartamentach tylko gdy zaznaczone w panelu */
  wc?: boolean | null
  livingRoom?: 'ground' | 'upper' | null
}

/** Układ domu na belce kafelka i na stronie domku (audyt 12.11.2026; Michał, 19.11.2026): sypialnie, łazienki (+ WC), poziom salonu. */
export function layoutFacts(locale: Locale, { bedrooms, bathrooms, wc, livingRoom }: LayoutInput): string[] {
  const pl = locale === 'pl'
  const bed = bedrooms ? `${bedrooms} ${pl ? (bedrooms === 1 ? 'sypialnia' : bedrooms > 4 ? 'sypialni' : 'sypialnie') : bedrooms === 1 ? 'bedroom' : 'bedrooms'}` : null
  const bath = bathrooms ? `${bathrooms} ${pl ? (bathrooms > 4 ? 'łazienek' : bathrooms === 1 ? 'łazienka' : 'łazienki') : bathrooms === 1 ? 'bathroom' : 'bathrooms'}${wc ? ' + WC' : ''}` : null
  const living = livingRoom ? (pl ? (livingRoom === 'upper' ? 'salon na piętrze' : 'salon na parterze') : livingRoom === 'upper' ? 'living room upstairs' : 'living room on the ground floor') : null
  return [bed, bath, living].filter((x): x is string => Boolean(x))
}
