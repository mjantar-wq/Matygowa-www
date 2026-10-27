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

/** Dzień wyjazdu po ostatniej nocy z IceColdRes (stayTo, excludedPeriods[].to): gościom „do” to dzień wymeldowania (Michał, 27.10.2026). */
export const departureAfter = (lastNight: string) => addDays(lastNight, 1)

export const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000)

const weekday = (d: string) => new Date(`${d}T00:00:00Z`).getUTCDay()

export interface PromoRules {
  bookableNow: boolean
  hasBenefit?: boolean
  unitTypeIds: string[] | null
  stayFrom: string | null
  stayTo: string | null
  arrivalDays?: number[] | null
  excludedWeekdays?: number[] | null
  excludedPeriods?: { from: string; to: string }[] | null
}

/** Promocja strony obejmująca przyjazd tego dnia (min. noce i wyprzedzenie sprawdza dopiero wyszukiwanie). */
export function promoOn(p: PromoRules, date: string, unitTypeId: string) {
  if (!p.bookableNow || p.hasBenefit === false) return false
  if (p.unitTypeIds && !p.unitTypeIds.includes(unitTypeId)) return false
  if ((p.stayFrom && date < p.stayFrom) || (p.stayTo && date > p.stayTo)) return false
  if (p.arrivalDays?.length && !p.arrivalDays.includes(weekday(date))) return false
  if (p.excludedWeekdays?.includes(weekday(date))) return false
  return !p.excludedPeriods?.some((x) => date >= x.from && date <= x.to)
}

const pick = (data: CalendarData, code?: string) => (code ? data.types.filter((t) => t.code === code) : data.types)
const dayOf = (data: CalendarData, t: CalendarType, date: string) => t.days[daysBetween(data.from, date)]

/** Dlaczego dnia nie da się wybrać (okienko w kalendarzu, jak na stronie rezerwacji IceColdRes). */
export type DayReason = 'past' | 'occupied' | 'closed' | 'noArrival' | 'minStay' | 'maxStay' | 'noDeparture'

export interface ArrivalInfo {
  ok: boolean
  promo: string | null
  known: boolean
  reason?: DayReason
  /** najkrótszy minimalny pobyt z domów, w których przyjazd jest możliwy (albo blokuje go tylko min. pobyt) */
  minStay?: number
}

/** Przyjazd: choć jeden dom (albo wybrany) wolny, w sprzedaży, bez zakazu przyjazdu i wolny przez minimalny pobyt. */
export function arrivalInfo(data: CalendarData, date: string, code?: string): ArrivalInfo {
  if (date < data.today) return { ok: false, promo: null, known: true, reason: 'past' }
  const types = pick(data, code).filter((t) => dayOf(data, t, date))
  if (!types.length) return { ok: true, promo: null, known: false }
  // najpierw powód, który dotyczy najbliższego „prawie wolnego” domu: zajęty < bez sprzedaży < bez przyjazdów < za krótko wolny
  const rank: DayReason[] = ['occupied', 'closed', 'noArrival', 'minStay']
  let reason: DayReason = 'occupied'
  const ok: DayInfo[] = []
  const short: number[] = []
  for (const t of types) {
    const d = dayOf(data, t, date)!
    const why: DayReason | null =
      d.free < 1 ? 'occupied'
      : !d.open ? 'closed'
      : d.cta ? 'noArrival'
      : Array.from({ length: d.minStay }, (_, i) => dayOf(data, t, addDays(date, i))).every((n) => !n || n.free > 0) ? null
      : 'minStay'
    if (!why) ok.push(d)
    else {
      if (why === 'minStay') short.push(d.minStay)
      if (rank.indexOf(why) > rank.indexOf(reason)) reason = why
    }
  }
  if (ok.length) return { ok: true, promo: ok.find((d) => d.promo)?.promo ?? null, known: true, minStay: Math.min(...ok.map((d) => d.minStay)) }
  return { ok: false, promo: null, known: true, reason, minStay: short.length ? Math.min(...short) : undefined }
}

export interface DepartureInfo {
  ok: boolean
  reason?: DayReason
  minStay?: number
  maxStay?: number
}

/** Wyjazd: ten sam dom wolny przez wszystkie noce, pobyt w granicach min./maks. dnia przyjazdu, bez zakazu wyjazdu. */
export function departureInfo(data: CalendarData, arrival: string, departure: string, code?: string): DepartureInfo {
  const nights = daysBetween(arrival, departure)
  if (nights < 1) return { ok: false }
  const rank: DayReason[] = ['occupied', 'noDeparture', 'maxStay', 'minStay']
  let reason: DayReason = 'occupied'
  let minStay: number | undefined
  let maxStay: number | undefined
  for (const t of pick(data, code)) {
    const first = dayOf(data, t, arrival)
    if (!first) return { ok: true }
    let why: DayReason | null = null
    if (nights < first.minStay) why = 'minStay'
    else if (first.maxStay !== null && nights > first.maxStay) why = 'maxStay'
    else if (Array.from({ length: nights }, (_, i) => dayOf(data, t, addDays(arrival, i))).some((d) => d && d.free < 1)) why = 'occupied'
    else if (dayOf(data, t, departure)?.ctd) why = 'noDeparture'
    if (!why) return { ok: true }
    if (why === 'minStay') minStay = Math.min(minStay ?? Infinity, first.minStay)
    if (why === 'maxStay') maxStay = Math.max(maxStay ?? 0, first.maxStay ?? 0)
    if (rank.indexOf(why) > rank.indexOf(reason)) reason = why
  }
  return { ok: false, reason, minStay, maxStay }
}

export const departureOk = (data: CalendarData, arrival: string, departure: string, code?: string) => departureInfo(data, arrival, departure, code).ok

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
