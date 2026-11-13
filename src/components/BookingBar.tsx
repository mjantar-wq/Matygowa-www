'use client'

import { preconnect } from 'react-dom'
import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import type { Locale } from '@/i18n/locales'
import type { Dictionary } from '@/i18n/dictionaries'
import { href } from '@/i18n/routes'
import { ageLabel } from '@/lib/age'
import { daysBetween } from '@/lib/availability'
import { bookingUrl, engineCalendarUrl, type EngineSettings } from '@/lib/booking'
import { campaignParams, nightsBetween, track } from '@/lib/tracking'
import { CountPicker } from './CountPicker'
import { EngineCalendar } from './EngineCalendar'
import { MAX_GUESTS } from '@/lib/count-picker'
import { UnitResults, type Result } from './UnitResults'
import { useAmbience } from './effects/ambience'

const noSubscribe = () => () => {}

/** Tylko napisy (bez funkcji), bo komponent działa w przeglądarce. */
type Props = {
  locale: Locale
  t: Dictionary['booking']
  /** napisy galerii (Lightbox) w oknie wybranego domu */
  fx: Dictionary['effects']
  engine: EngineSettings | null
  unit?: string
  slogan?: string | null
}

type Search =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'done'; nights: number; results: Result[] }

const AGES = Array.from({ length: 18 }, (_, i) => i)

/**
 * Pasek rezerwacji (koncepcja S5): kalendarz dostępności z IceColdRes w ramce (ten sam co na stronie rezerwacji
 * i w rezerwacji telefonicznej, Michał 2.11.2026), osoby i wiek dzieci,
 * wyniki z cenami z IceColdRes na stronie, a „Rezerwuj” otwiera silnik z wypełnionymi danymi, domem,
 * ofertą i utm_*. Z silnikiem Hotres albo bez cen (Ustawienia → Rezerwacje) od razu przechodzi do silnika.
 */
export function BookingBar({ locale, t, fx, engine, unit, slogan }: Props) {
  // kilka pasków na stronie (hero, zaproszenie, okno z przycisku): identyfikatory muszą być unikalne
  const uid = useId()
  const calendarId = `${uid}-kalendarz`
  const errorId = `${uid}-brak-osob`
  const live = engine?.bookingEngine === 'icecoldres' && engine.showPrices !== false
  const [arrival, setArrival] = useState('')
  const [departure, setDeparture] = useState('')
  // bez domyślnej liczby osób: gość wybiera ją świadomie (Michał, 25.10.2026)
  const [guests, setGuests] = useState<number | null>(null)
  const [missingAdults, setMissingAdults] = useState(false)
  const adultsRef = useRef<HTMLInputElement>(null)
  const [children, setChildren] = useState(0)
  // liczba osób razem z dziećmi; dorośli to reszta (co najmniej jeden)
  const adults = guests === null ? null : Math.max(1, guests - children)
  const [ages, setAges] = useState<(number | null)[]>([])
  const [open, setOpen] = useState(false)
  // ramka kalendarza powstaje z wyprzedzeniem (pasek na ekranie w bezruchu, najazd, dotyk, fokus) albo najpóźniej
  // przy otwarciu i zostaje (ukryta), żeby kalendarz był gotowy, zanim gość kliknie „Przyjazd”
  const [opened, setOpened] = useState(false)
  if (open && !opened) setOpened(true)
  const [search, setSearch] = useState<Search>({ status: 'idle' })
  const root = useRef<HTMLDivElement>(null)

  // połączenie z IceColdRes (DNS, TLS) otwieramy już przy renderze paska
  if (live) preconnect(new URL(engineCalendarUrl(engine, locale)).origin)

  // rozgrzewka ramki: gdy pasek wejdzie na ekran, w wolnej chwili ładujemy kalendarz (pierwsze otwarcie jest wtedy natychmiastowe)
  useEffect(() => {
    const el = root.current
    if (!live || opened || !el) return
    let idle: number | undefined
    let timer: ReturnType<typeof setTimeout> | undefined
    const warm = () => setOpened(true)
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return
      io.disconnect()
      if ('requestIdleCallback' in window) idle = window.requestIdleCallback(warm, { timeout: 2500 })
      else timer = setTimeout(warm, 800)
    })
    io.observe(el)
    return () => {
      io.disconnect()
      if (idle !== undefined) window.cancelIdleCallback(idle)
      clearTimeout(timer)
    }
  }, [live, opened])
  const plural = new Intl.PluralRules(locale === 'pl' ? 'pl' : 'en')
  const nightsLabel = (n: number) =>
    `${n} ${t.nightForms[plural.select(n) as keyof typeof t.nightForms] ?? t.nightForms.other}`

  // promocje strony mają sezon (lato/zima/oba), więc plakietki w wynikach zależą od przełącznika pory roku
  const { sezon } = useAmbience()

  // otwarty kalendarz ma być cały na ekranie (Michał, 25.10.2026): przewijamy stronę albo okno, w którym stoi pasek
  useEffect(() => {
    if (!open) return
    const frame = requestAnimationFrame(() => {
      const cal = document.getElementById(calendarId)
      if (!cal) return
      const r = cal.getBoundingClientRect()
      const top = parseFloat(getComputedStyle(cal).scrollMarginTop) || 0
      if (r.top >= top && r.bottom <= window.innerHeight) return
      const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      // wyższy od ekranu: od początku kalendarza; niższy: najmniejsze przewinięcie, żeby zmieścił się cały
      cal.scrollIntoView({ block: r.height + top > window.innerHeight ? 'start' : 'nearest', behavior: smooth ? 'smooth' : 'auto' })
    })
    return () => cancelAnimationFrame(frame)
  }, [open, calendarId])

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

  function pickDates(a: string, d: string) {
    setArrival(a)
    setDeparture(d)
    if (a && d) setOpen(false)
  }

  function setChildCount(n: number) {
    setChildren(n)
    setAges((a) => Array.from({ length: n }, (_, i) => a[i] ?? null))
  }

  const query = (extra: { unit?: string; offer?: string } = {}) => ({
    arrival: arrival || undefined,
    departure: departure || undefined,
    adults: adults ?? undefined,
    children,
    ages: ages.filter((a): a is number => a !== null),
    unit: extra.unit ?? unit,
    offer: extra.offer,
  })
  // linki do silnika bez UTM: dokleja je ClickTracking razem ze zdarzeniem booking_click
  const go = (extra?: { unit?: string; offer?: string }) => bookingUrl(engine, locale, query(extra))
  // bez wyników na stronie pasek jest zwykłym formularzem GET do silnika (linker GA4 dokleja _gl)
  const utmJson = useSyncExternalStore(noSubscribe, () => JSON.stringify(campaignParams()), () => '{}')
  const utm = useMemo(() => JSON.parse(utmJson) as Record<string, string>, [utmJson])
  const target = new URL(bookingUrl(engine, locale, query(), utm))

  async function submit(e: React.FormEvent) {
    const nights = nightsBetween(arrival, departure)
    if (adults === null) {
      e.preventDefault()
      setMissingAdults(true)
      adultsRef.current?.focus()
      return
    }
    if (!live) {
      track('booking_click', { booking_location: 'booking_bar', unit, arrival: arrival || undefined, nights, adults, children })
      return
    }
    e.preventDefault()
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
      lang: locale,
      season: sezon,
    })
    if (q.ages.length) params.set('ages', q.ages.join(','))
    try {
      const r = await fetch(`/api/booking/search?${params}`)
      if (!r.ok) throw new Error(String(r.status))
      const data = (await r.json()) as { nights: number; results: Result[]; group?: boolean }
      // grupa, której nie pomieści żaden dom: kilka domów wybiera się na stronie rezerwacji (reguła grup IceColdRes)
      if (data.group) {
        track('booking_click', { booking_location: 'booking_bar', unit, arrival, nights, adults, children })
        window.location.assign(bookingUrl(engine, locale, q, utm))
        return
      }
      // dom, z którego strony gość szuka, na początku listy
      data.results.sort((a, b) => Number(b.code === unit) - Number(a.code === unit))
      setSearch({ status: 'done', ...data })
      track('booking_search', { unit, arrival, nights, adults, children, results: data.results.filter((x) => x.offers.length).length })
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
  const available = search.status === 'done' ? search.results.filter((r) => r.offers.length) : []
  // wszystkie domki odpadły z powodu liczby osób: grupa większa niż największy domek (audyt 12.11.2026)
  const groupTooBig = search.status === 'done' && search.results.length > 0 && search.results.every((r) => r.reason === 'over_capacity')

  return (
    <div
      className="mo-booking-wrap"
      ref={root}
      onPointerEnter={live ? () => setOpened(true) : undefined}
      onTouchStart={live ? () => setOpened(true) : undefined}
      onFocus={live ? () => setOpened(true) : undefined}
    >
      <form
        className="mo-booking"
        method="get"
        action={target.origin + target.pathname}
        onSubmit={submit}
        aria-label={t.check}
      >
        {[...target.searchParams].map(([k, v]) => (
          <input key={k} type="hidden" name={k} value={v} />
        ))}
        <button
          type="button"
          className="mo-field"
          aria-expanded={open}
          aria-controls={calendarId}
          onClick={() => setOpen((o) => !o || !!departure)}
        >
          <span className="mo-label">{t.arrival}</span>
          <span className="mo-field__value">{arrival ? fmt(arrival) : '—'}</span>
        </button>
        <button
          type="button"
          className="mo-field"
          aria-expanded={open}
          aria-controls={calendarId}
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
          <span className="mo-label">{t.guests}</span>
          <CountPicker
            inputRef={adultsRef}
            value={guests}
            min={1}
            max={MAX_GUESTS}
            label={t.guests}
            rangeMessage={t.countRange}
            invalid={missingAdults}
            describedBy={missingAdults ? errorId : undefined}
            onChange={(n) => {
              setGuests(n)
              if (n !== null && children > n - 1) setChildCount(n - 1)
              if (n !== null) setMissingAdults(false)
            }}
          />
        </label>
        <label className="mo-field">
          <span className="mo-label">{t.childrenOf}</span>
          {/* tak samo jak liczba osób (Michał, 26.10.2026): pole puste zamiast 0, które trudno skasować albo nadpisać */}
          <CountPicker
            value={children || null}
            min={0}
            max={(guests ?? MAX_GUESTS) - 1}
            label={t.childrenOf}
            rangeMessage={t.countRange}
            onChange={(n) => setChildCount(n ?? 0)}
          />
        </label>
        <button className="mo-btn mo-btn--glowny" type="submit">
          {t.check}
        </button>
      </form>
      {missingAdults ? (
        <p id={errorId} className="mo-body-s mo-booking-error" role="alert">
          {t.needAdults}
        </p>
      ) : null}

      {children > 0 ? (
        <div className="mo-booking-ages" role="group" aria-labelledby="mo-booking-ages-title">
          <span id="mo-booking-ages-title" className="mo-label mo-booking-ages__title">{t.childAges}</span>
          {ages.map((a, i) => (
            <label key={i} className="mo-field">
              <span className="mo-label">
                {t.child} {children > 1 ? i + 1 : ''}
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
                    {ageLabel(n, locale)}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      ) : null}

      {opened ? (
        <div
          className="mo-calendar mo-calendar--ramka"
          id={calendarId}
          role="dialog"
          aria-label={arrival && !departure ? t.chooseDeparture : t.chooseArrival}
          hidden={!open}
        >
          <EngineCalendar
            src={engineCalendarUrl(engine, locale, { unit, arrival, departure })}
            title={t.chooseArrival}
            arrival={arrival}
            departure={departure}
            onPick={pickDates}
          />
          <div className="mo-calendar__foot">
            <button
              type="button"
              className="mo-btn mo-btn--glowny mo-btn--maly"
              onClick={() => (setArrival(''), setDeparture(''))}
            >
              {t.clear}
            </button>
            <button
              type="button"
              className="mo-btn mo-btn--glowny mo-btn--maly"
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
            <a href={go()} data-track="booking_results" className="mo-link">
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
            <UnitResults
              results={search.results}
              nights={search.nights}
              locale={locale}
              t={t}
              fx={fx}
              book={(code, offer) => go({ unit: code, offer })}
            />
            {groupTooBig ? (
              <p className="mo-body-s">
                {t.groupTooBig}{' '}
                <a href={href(locale, 'contact')} className="mo-link">
                  {t.groupContact}
                </a>
              </p>
            ) : null}
            {!available.length ? (
              <a href={go()} data-track="booking_results" className="mo-link">
                {t.goToEngine}
              </a>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  )
}
