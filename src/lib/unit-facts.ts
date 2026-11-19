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
  return pl ? `${base} (w tym ${sofaGuests} na rozkładanej sofie w salonie)` : `${base} (incl. ${sofaGuests} on a sofa bed in the living room)`
}

/** Dwie najważniejsze różnice między domkami (audyt 12.11.2026): poziom salonu i liczba łazienek. */
export function layoutFacts(locale: Locale, livingRoom?: 'ground' | 'upper' | null, bathrooms?: number | null): string[] {
  const pl = locale === 'pl'
  return [
    livingRoom ? (pl ? (livingRoom === 'upper' ? 'salon na piętrze' : 'salon na parterze') : livingRoom === 'upper' ? 'living room upstairs' : 'living room on the ground floor') : null,
    bathrooms ? `${bathrooms} ${pl ? (bathrooms > 4 ? 'łazienek' : bathrooms === 1 ? 'łazienka' : 'łazienki') : bathrooms === 1 ? 'bathroom' : 'bathrooms'}` : null,
  ].filter((x): x is string => Boolean(x))
}
