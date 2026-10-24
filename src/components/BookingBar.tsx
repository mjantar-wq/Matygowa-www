'use client'

import { useState } from 'react'
import type { Locale } from '@/i18n/locales'
import type { Dictionary } from '@/i18n/dictionaries'
import { bookingUrl, type EngineSettings } from '@/lib/booking'

/** Tylko napisy (bez funkcji), bo komponent działa w przeglądarce. */
type Props = { locale: Locale; t: Dictionary['booking']; engine: EngineSettings | null; unit?: string; slogan?: string | null }

/**
 * Pasek rezerwacji: daty i osoby, „Sprawdź termin” otwiera silnik z wypełnionymi danymi.
 * Kalendarz dostępności i wyniki na stronie dojdą w etapie 2 (dane z IceColdRes).
 */
export function BookingBar({ locale, t, engine, unit, slogan }: Props) {
  const today = new Date().toISOString().slice(0, 10)
  const [arrival, setArrival] = useState('')
  const [departure, setDeparture] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const utm = Object.fromEntries([...new URLSearchParams(window.location.search)].filter(([k]) => k.startsWith('utm_')))
    window.location.href = bookingUrl(engine, locale, { arrival, departure, adults, children, unit }, utm)
  }

  return (
    <form className="mo-booking-bar" onSubmit={submit} aria-label={t.check}>
      <label className="mo-field">
        {t.arrival}
        <input type="date" min={today} value={arrival} onChange={(e) => setArrival(e.target.value)} />
      </label>
      <label className="mo-field">
        {t.departure}
        <input type="date" min={arrival || today} value={departure} onChange={(e) => setDeparture(e.target.value)} />
      </label>
      <label className="mo-field">
        {t.adults}
        <input type="number" min={1} max={20} value={adults} onChange={(e) => setAdults(Number(e.target.value))} />
      </label>
      <label className="mo-field">
        {t.children}
        <input type="number" min={0} max={20} value={children} onChange={(e) => setChildren(Number(e.target.value))} />
      </label>
      <button className="mo-button" type="submit">
        {t.check}
      </button>
      <p className="mo-booking-bar__slogan">{slogan || t.lowestPrice}</p>
    </form>
  )
}
