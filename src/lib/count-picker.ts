/** Najwięcej osób razem w wyszukiwaniu (Michał, 26.10.2026), jak MAX_GUESTS w IceColdRes. */
export const MAX_GUESTS = 30

/** Lista liczby osób: na początku 14 pozycji, przewijanie do końca dokłada kolejne (jak w IceColdRes). */
export const FIRST_ITEMS = 14

/**
 * Ile liczb pokazać od `min`: co najmniej 14 (albo `grown`, gdy lista urosła przy przewijaniu) i tyle, żeby było
 * widać wybraną liczbę (`upTo`), najwyżej do `max`.
 */
export function listLength(min: number, max: number, grown: number, upTo: number): number {
  return Math.max(0, Math.min(max - min + 1, Math.max(FIRST_ITEMS, grown, upTo - min + 1)))
}

/** Wpisana liczba w zakresie albo null. */
export function parseCount(text: string, min: number, max: number): number | null {
  const t = text.trim()
  if (!/^\d{1,3}$/.test(t)) return null
  const n = Number(t)
  return n >= min && n <= max ? n : null
}
