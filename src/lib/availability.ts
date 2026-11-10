/**
 * Daty pobytu. Kalendarz dostępności strona bierze z IceColdRes (ramka `…/kalendarz`, components/EngineCalendar.tsx),
 * więc zasady przyjazdów, wyjazdów i minimalnego pobytu są tylko tam (Michał, 2.11.2026: jeden kalendarz z jednym kodem).
 */

export const addDays = (date: string, n: number) => {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** Dzień wyjazdu po ostatniej nocy z IceColdRes (stayTo, excludedPeriods[].to): gościom „do” to dzień wymeldowania (Michał, 27.10.2026). */
export const departureAfter = (lastNight: string) => addDays(lastNight, 1)

export const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000)
