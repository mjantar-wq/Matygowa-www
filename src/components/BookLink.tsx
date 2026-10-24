'use client'

import type { Locale } from '@/i18n/locales'
import { bookingUrl, type BookingQuery, type EngineSettings } from '@/lib/booking'
import { currentUtm } from '@/lib/utm'

/** Link do silnika rezerwacji z utm_* z bieżącej wizyty (dopisywanymi w chwili kliknięcia). */
export function BookLink({ engine, locale, query, className, children }: { engine: EngineSettings | null; locale: Locale; query?: BookingQuery; className?: string; children: React.ReactNode }) {
  return (
    <a
      className={className}
      href={bookingUrl(engine, locale, query)}
      onClick={(e) => {
        e.currentTarget.href = bookingUrl(engine, locale, query, currentUtm())
      }}
    >
      {children}
    </a>
  )
}
