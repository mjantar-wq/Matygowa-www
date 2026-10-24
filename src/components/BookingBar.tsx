'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/i18n/locales'
import type { Dictionary } from '@/i18n/dictionaries'
import { href } from '@/i18n/routes'
import {
  arrivalInfo,
  daysBetween,
  departureOk,
  monthGrid,
  nextMonth,
  type CalendarData,
} from '@/lib/availability'
import { bookingUrl, formatPrice, type EngineSettings } from '@/lib/booking'
import { currentUtm } from '@/lib/utm'

/** Tylko napisy (bez funkcji), bo komponent działa w przeglądarce. */
type Props = {
  locale: Locale
  t: Dictionary['booking']
  engine: EngineSettings | null
  unit?: string
  slogan?: string | null
}

interface Result {
  code: string
  name: string
  nameEn: string | null
  free: number
  offers: {
    offerId: string
    name: string
    total: number
    badge: string | null
    badgeEn: string | null
  }[]
  reason: string | null
}
type Search =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'done'; nights: number; results: Result[] }

const today = () => new Date().toISOString().slice(0, 10)
const AGES = Array.from({ length: 18 }, (_, i) => i)

/**
 * Pasek rezerwacji (koncepcja S5): kalendarz z cenami „od” i plakietkami promocji, osoby i wiek dzieci,
 * wyniki z cenami z IceColdRes na stronie, a „Rezerwuj” otwiera silnik z wypełnionymi danymi, domem,
 * ofertą i utm_*. Z silnikiem Hotres albo bez cen (Ustawienia → Rezerwacje) od razu przechodzi do silnika.
 */
export function BookingBar({ locale, t, engine, unit, slogan }: Props) {
  const live = engine?.bookingEngine === 'icecoldres' && engine.showPrices !== false
  const [arrival, setArrival] = useState('')
  const [departure, setDeparture] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [ages, setAges] = useState<(number | null)[]>([])
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(() => today().slice(0, 7))
  const [chunks, setChunks] = useState<Record<string, CalendarData | null>>({})
  const [search, setSearch] = useState<Search>({ status: 'idle' })
  const root = useRef<HTMLDivElement>(null)
  const plural = new Intl.PluralRules(locale === 'pl' ? 'pl' : 'en')
  const nightsLabel = (n: number) =>
    `${n} ${t.nightForms[plural.select(n) as keyof typeof t.nightForms] ?? t.nightForms.other}`

  // dostępność dwóch widocznych miesięcy (pośrednik strony buforuje ją 45 s)
  const requested = useRef(new Set<string>())
  useEffect(() => {
    if (!live || !open || requested.current.has(month)) return
    requested.current.add(month)
    fetch(`/api/booking/calendar?from=${month}-01&days=62&lang=${locale}`)
      .then((r): Promise<CalendarData | null> | null => (r.ok ? r.json() : null))
      .catch((): null => null)
      .then((data) => setChunks((c) => ({ ...c, [month]: data })))
  }, [live, open, month, locale])

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (
        e instanceof KeyboardEvent ? e.key === 'Escape' : !root.current?.contains(e.target as Node)
      )
        setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  const chunkFor = (date: string) =>
    Object.values(chunks).find((c): c is CalendarData =>
      Boolean(c && date >= c.from && daysBetween(c.from, date) < (c.types[0]?.days.length ?? 0)),
    )

  function dayState(date: string): { ok: boolean; price: number | null; promo: string | null } {
    // „dziś” obiektu (strefa IceColdRes) może być dniem później niż w przeglądarce
    const first = Object.values(chunks).find((c) => c)
    if (date < today() || (first && date < first.today))
      return { ok: false, price: null, promo: null }
    const data = chunkFor(date) ?? chunkFor(arrival)
    if (!data) return { ok: true, price: null, promo: null }
    if (arrival && !departure && date > arrival)
      return { ok: departureOk(data, arrival, date, unit), price: null, promo: null }
    return arrivalInfo(data, date, unit)
  }

  function pickDay(date: string) {
    if (arrival && !departure && date > arrival) {
      setDeparture(date)
      setOpen(false)
    } else {
      setArrival(date)
      setDeparture('')
    }
  }

  function setChildCount(n: number) {
    setChildren(n)
    setAges((a) => Array.from({ length: n }, (_, i) => a[i] ?? null))
  }

  const query = (extra: { unit?: string; offer?: string } = {}) => ({
    arrival: arrival || undefined,
    departure: departure || undefined,
    adults,
    children,
    ages: ages.filter((a): a is number => a !== null),
    unit: extra.unit ?? unit,
    offer: extra.offer,
  })
  const go = (extra?: { unit?: string; offer?: string }) =>
    bookingUrl(engine, locale, query(extra), currentUtm())

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!live) {
      window.location.href = go()
      return
    }
    if (!arrival || !departure) {
      setOpen(true)
      return
    }
    setSearch({ status: 'loading' })
    const q = query()
    const params = new URLSearchParams({
      arrival,
      departure,
      adults: String(adults),
      children: String(children),
    })
    if (q.ages.length) params.set('ages', q.ages.join(','))
    try {
      const r = await fetch(`/api/booking/search?${params}`)
      if (!r.ok) throw new Error(String(r.status))
      const data = (await r.json()) as { nights: number; results: Result[] }
      // dom, z którego strony gość szuka, na początku listy
      data.results.sort((a, b) => Number(b.code === unit) - Number(a.code === unit))
      setSearch({ status: 'done', ...data })
    } catch {
      setSearch({ status: 'error' })
    }
  }

  const fmt = (d: string) =>
    new Intl.DateTimeFormat(locale === 'pl' ? 'pl-PL' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      timeZone: 'UTC',
    }).format(new Date(`${d}T00:00:00Z`))
  const monthName = (m: string) =>
    new Intl.DateTimeFormat(locale === 'pl' ? 'pl-PL' : 'en-GB', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(`${m}-01T00:00:00Z`))
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale === 'pl' ? 'pl-PL' : 'en-GB', {
      weekday: 'narrow',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(2024, 0, 1 + i))),
  )
  const available = search.status === 'done' ? search.results.filter((r) => r.offers.length) : []
  const taken = search.status === 'done' ? search.results.filter((r) => !r.offers.length) : []
  const name = (r: Result) => (locale === 'pl' ? r.name : r.nameEn || r.name)

  return (
    <div className="mo-booking-wrap" ref={root}>
      <form className="mo-booking" onSubmit={submit} aria-label={t.check}>
        <button
          type="button"
          className="mo-field"
          aria-expanded={open}
          aria-controls="mo-kalendarz"
          onClick={() => setOpen((o) => !o || !!departure)}
        >
          <span className="mo-label">{t.arrival}</span>
          <span className="mo-field__value">{arrival ? fmt(arrival) : '—'}</span>
        </button>
        <button
          type="button"
          className="mo-field"
          aria-expanded={open}
          aria-controls="mo-kalendarz"
          onClick={() => setOpen(true)}
        >
          <span className="mo-label">{t.departure}</span>
          <span className="mo-field__value">
            {departure
              ? `${fmt(departure)} · ${nightsLabel(daysBetween(arrival, departure))}`
              : '—'}
          </span>
        </button>
        <label className="mo-field">
          <span className="mo-label">{t.adults}</span>
          <input
            type="number"
            min={1}
            max={20}
            value={adults}
            onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
          />
        </label>
        <label className="mo-field">
          <span className="mo-label">{t.children}</span>
          <input
            type="number"
            min={0}
            max={10}
            value={children}
            onChange={(e) => setChildCount(Math.min(10, Math.max(0, Number(e.target.value))))}
          />
        </label>
        <button className="mo-btn mo-btn--glowny" type="submit">
          {t.check}
        </button>
      </form>

      {children > 0 ? (
        <div className="mo-booking-ages">
          {ages.map((a, i) => (
            <label key={i} className="mo-field">
              <span className="mo-label">
                {t.childAge} {children > 1 ? i + 1 : ''}
              </span>
              <select
                value={a ?? ''}
                onChange={(e) =>
                  setAges((all) =>
                    all.map((x, j) =>
                      j === i ? (e.target.value === '' ? null : Number(e.target.value)) : x,
                    ),
                  )
                }
              >
                <option value="">{t.ageUnknown}</option>
                {AGES.map((n) => (
                  <option key={n} value={n}>
                    {n} {t.years}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      ) : null}

      {open ? (
        <div
          className="mo-calendar"
          id="mo-kalendarz"
          role="dialog"
          aria-label={arrival && !departure ? t.chooseDeparture : t.chooseArrival}
        >
          <div className="mo-calendar__head">
            <button
              type="button"
              className="mo-calendar__nav"
              onClick={() => setMonth((m) => nextMonth(m, -1))}
              disabled={month <= today().slice(0, 7)}
              aria-label={t.prevMonth}
            >
              ←
            </button>
            <p className="mo-label">
              {arrival && !departure ? t.chooseDeparture : t.chooseArrival}
            </p>
            <button
              type="button"
              className="mo-calendar__nav"
              onClick={() => setMonth((m) => nextMonth(m))}
              aria-label={t.nextMonth}
            >
              →
            </button>
          </div>
          <div
            className="mo-calendar__months"
            aria-busy={live && !chunks[month] ? true : undefined}
          >
            {[month, nextMonth(month)].map((m) => (
              <div key={m} className="mo-calendar__month">
                <p className="mo-h3 mo-calendar__title">{monthName(m)}</p>
                <div className="mo-calendar__grid" role="grid">
                  {weekdays.map((w, i) => (
                    <span key={i} className="mo-calendar__weekday" aria-hidden="true">
                      {w}
                    </span>
                  ))}
                  {monthGrid(m).map((d, i) => {
                    if (!d) return <span key={i} />
                    const s = dayState(d)
                    const inRange = arrival && departure && d > arrival && d < departure
                    const edge = d === arrival || d === departure
                    return (
                      <button
                        key={d}
                        type="button"
                        className="mo-calendar__day"
                        data-range={inRange || undefined}
                        data-edge={edge || undefined}
                        data-promo={s.promo ? true : undefined}
                        disabled={!s.ok}
                        title={s.promo ?? undefined}
                        aria-pressed={edge}
                        aria-label={`${fmt(d)}${s.price ? `, ${t.from} ${formatPrice(s.price, locale)}` : ''}${s.promo ? `, ${s.promo}` : ''}`}
                        onClick={() => pickDay(d)}
                      >
                        <span>{Number(d.slice(8))}</span>
                        {s.price ? <small>{Math.round(s.price / 100)}</small> : null}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mo-calendar__foot">
            <button
              type="button"
              className="mo-btn mo-btn--maly"
              onClick={() => (setArrival(''), setDeparture(''))}
            >
              {t.clear}
            </button>
            <button
              type="button"
              className="mo-btn mo-btn--obrys mo-btn--maly"
              onClick={() => setOpen(false)}
            >
              {t.done}
            </button>
          </div>
        </div>
      ) : null}

      <p className="mo-label mo-booking-note">{slogan || t.lowestPrice}</p>

      <div className="mo-results" aria-live="polite">
        {search.status === 'loading' ? <p className="mo-body-s">{t.loading}</p> : null}
        {search.status === 'error' ? (
          <p className="mo-body-s">
            {t.error}{' '}
            <a href={go()} className="mo-link">
              {t.goToEngine}
            </a>
          </p>
        ) : null}
        {search.status === 'done' ? (
          <>
            <h3 className="mo-h3">
              {available.length ? t.results : t.noResults} · {fmt(arrival)} – {fmt(departure)},{' '}
              {nightsLabel(search.nights)}
            </h3>
            <ul className="mo-results__list">
              {available.map((r) => (
                <li key={r.code} className="mo-result">
                  <a className="mo-result__name mo-h3" href={href(locale, 'houses', r.code)}>
                    {name(r)}
                  </a>
                  <div className="mo-result__offers">
                    {r.offers.map((o) => {
                      const badge = locale === 'pl' ? o.badge : o.badgeEn || o.badge
                      return (
                        <div key={o.offerId} className="mo-result__offer">
                          <p className="mo-body-s">
                            {badge ? <span className="mo-badge">{badge}</span> : null}
                            {r.offers.length > 1 ? <span> {o.name}</span> : null}
                          </p>
                          <p className="mo-price">
                            {formatPrice(o.total, locale)} <small>{t.total}</small>
                            <small className="mo-result__nightly">
                              {' '}
                              · {formatPrice(Math.round(o.total / search.nights), locale)}{' '}
                              {t.perNight}
                            </small>
                          </p>
                          <a
                            className="mo-btn mo-btn--glowny"
                            href={go({ unit: r.code, offer: o.offerId })}
                            onClick={(e) =>
                              (e.currentTarget.href = go({ unit: r.code, offer: o.offerId }))
                            }
                          >
                            {t.book}
                          </a>
                        </div>
                      )
                    })}
                  </div>
                </li>
              ))}
            </ul>
            {taken.length ? (
              <p className="mo-body-s mo-results__taken">
                {t.others}:{' '}
                {taken
                  .map((r) => `${name(r)} (${t.reasons[r.reason ?? ''] ?? t.unavailable})`)
                  .join(', ')}
              </p>
            ) : null}
            {!available.length ? (
              <a href={go()} className="mo-link">
                {t.goToEngine}
              </a>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  )
}
