import type { Locale } from '@/i18n/locales'

export interface BookingQuery {
  arrival?: string
  departure?: string
  adults?: number
  children?: number
  ages?: number[]
  unit?: string
  offer?: string
}

export interface EngineSettings {
  bookingEngine?: 'hotres' | 'icecoldres' | null
  icecoldresUrl?: string | null
  hotresUrl?: string | null
}

const ICECOLDRES_SLUG = process.env.NEXT_PUBLIC_ICECOLDRES_SLUG ?? 'matygowa-osada'

/**
 * Adres silnika rezerwacji z wypełnionymi danymi (kontrakt IceColdRes, pkt 6). Do uruchomienia
 * IceColdRes przyciski prowadzą do Hotres; przełącza administrator w Ustawieniach panelu.
 */
export function bookingUrl(settings: EngineSettings | null, locale: Locale, q: BookingQuery = {}, utm: Record<string, string> = {}) {
  if (settings?.bookingEngine === 'icecoldres') {
    const url = new URL(`/${locale === 'pl' ? 'pl' : 'en'}/${ICECOLDRES_SLUG}`, settings.icecoldresUrl || 'https://icecoldres.audiowizard.pl')
    const params: Record<string, string | undefined> = {
      arrival: q.arrival,
      departure: q.departure,
      adults: q.adults?.toString(),
      children: q.children?.toString(),
      ages: q.ages?.length ? q.ages.join(',') : undefined,
      unit: q.unit,
      offer: q.offer,
      ...utm,
    }
    for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v)
    return url.toString()
  }
  const url = new URL(settings?.hotresUrl || 'https://booking.hotres.pl/v4_step1?oid=5244')
  url.searchParams.set('lang', locale === 'pl' ? 'pl' : 'en')
  return url.toString()
}

/** Kwota w groszach jako tekst, np. 129900 → „1 299 zł”. */
export function formatPrice(grosze: number, locale: Locale) {
  return new Intl.NumberFormat(locale === 'pl' ? 'pl-PL' : 'en-GB', { style: 'currency', currency: 'PLN', maximumFractionDigits: 0 }).format(grosze / 100)
}

/** Do komponentu w przeglądarce trafiają tylko pola silnika, nie całe ustawienia. */
export const engineSettings = (s: EngineSettings | null | undefined): EngineSettings | null =>
  s ? { bookingEngine: s.bookingEngine, icecoldresUrl: s.icecoldresUrl, hotresUrl: s.hotresUrl } : null
