/**
 * Kalendarz dostępności w przeglądarce: z dni IceColdRes (wolne sztuki, sprzedaż, zakazy przyjazdu
 * i wyjazdu, min. pobyt) liczy, które przyjazdy i wyjazdy da się wybrać. Ostateczna odpowiedź to zawsze
 * wyszukiwanie w IceColdRes, więc dni spoza pobranego zakresu traktujemy jako możliwe.
 */

export interface DayInfo {
  free: number
  open: boolean
  cta: boolean
  ctd: boolean
  minStay: number
  maxStay: number | null
  /** cena „od” za noc przy przyjeździe tego dnia (grosze) */
  price: number | null
  /** plakietka promocji strony obejmującej ten dzień */
  promo: string | null
}

export interface CalendarType {
  code: string
  days: DayInfo[]
}

export interface CalendarData {
  from: string
  today: string
  types: CalendarType[]
}

export const addDays = (date: string, n: number) => {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000)

const weekday = (d: string) => new Date(`${d}T00:00:00Z`).getUTCDay()

export interface PromoRules {
  bookableNow: boolean
  unitTypeIds: string[] | null
  stayFrom: string | null
  stayTo: string | null
  arrivalDays?: number[] | null
  excludedWeekdays?: number[] | null
  excludedPeriods?: { from: string; to: string }[] | null
}

/** Promocja strony obejmująca przyjazd tego dnia (min. noce i wyprzedzenie sprawdza dopiero wyszukiwanie). */
export function promoOn(p: PromoRules, date: string, unitTypeId: string) {
  if (!p.bookableNow) return false
  if (p.unitTypeIds && !p.unitTypeIds.includes(unitTypeId)) return false
  if ((p.stayFrom && date < p.stayFrom) || (p.stayTo && date > p.stayTo)) return false
  if (p.arrivalDays?.length && !p.arrivalDays.includes(weekday(date))) return false
  if (p.excludedWeekdays?.includes(weekday(date))) return false
  return !p.excludedPeriods?.some((x) => date >= x.from && date <= x.to)
}

const pick = (data: CalendarData, code?: string) => (code ? data.types.filter((t) => t.code === code) : data.types)
const dayOf = (data: CalendarData, t: CalendarType, date: string) => t.days[daysBetween(data.from, date)]

/** Przyjazd: choć jeden dom (albo wybrany) wolny, w sprzedaży i bez zakazu przyjazdu. Cena: najniższa z takich domów. */
export function arrivalInfo(data: CalendarData, date: string, code?: string): { ok: boolean; price: number | null; promo: string | null; known: boolean } {
  if (date < data.today) return { ok: false, price: null, promo: null, known: true }
  const days = pick(data, code)
    .map((t) => dayOf(data, t, date))
    .filter((d): d is DayInfo => Boolean(d))
  if (!days.length) return { ok: true, price: null, promo: null, known: false }
  // przyjazd ma sens tylko, gdy dom jest wolny co najmniej przez minimalny pobyt
  const fits = (t: CalendarType) => {
    const d = dayOf(data, t, date)
    if (!d || d.free < 1 || !d.open || d.cta) return false
    return Array.from({ length: d.minStay }, (_, i) => dayOf(data, t, addDays(date, i))).every((n) => !n || n.free > 0)
  }
  const ok = pick(data, code).filter(fits).map((t) => dayOf(data, t, date)!)
  const prices = ok.map((d) => d.price).filter((p): p is number => p !== null)
  return { ok: ok.length > 0, price: prices.length ? Math.min(...prices) : null, promo: ok.find((d) => d.promo)?.promo ?? null, known: true }
}

/** Wyjazd: ten sam dom wolny przez wszystkie noce, pobyt w granicach min./maks. dnia przyjazdu, bez zakazu wyjazdu. */
export function departureOk(data: CalendarData, arrival: string, departure: string, code?: string) {
  const nights = daysBetween(arrival, departure)
  if (nights < 1) return false
  return pick(data, code).some((t) => {
    const first = dayOf(data, t, arrival)
    if (!first) return true
    if (nights < first.minStay || (first.maxStay !== null && nights > first.maxStay)) return false
    for (let i = 0; i < nights; i++) {
      const d = dayOf(data, t, addDays(arrival, i))
      if (d && d.free < 1) return false
    }
    const last = dayOf(data, t, departure)
    return !last?.ctd
  })
}

/** Dni miesiąca w siatce od poniedziałku; null to puste pola przed pierwszym dniem. */
export function monthGrid(month: string): (string | null)[] {
  const first = `${month}-01`
  const lead = (new Date(`${first}T00:00:00Z`).getUTCDay() + 6) % 7
  const next = addDays(first, 32).slice(0, 7)
  const len = daysBetween(first, `${next}-01`)
  return [...Array<null>(lead).fill(null), ...Array.from({ length: len }, (_, i) => addDays(first, i))]
}

export const nextMonth = (month: string, n = 1) => {
  const [y, m] = month.split('-').map(Number)
  const d = new Date(Date.UTC(y!, m! - 1 + n, 1))
  return d.toISOString().slice(0, 7)
}
