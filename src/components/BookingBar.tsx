'use client'

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import type { Locale } from '@/i18n/locales'
import type { Dictionary } from '@/i18n/dictionaries'
import {
  arrivalInfo,
  daysBetween,
  departureInfo,
  monthGrid,
  nextMonth,
  type CalendarData,
  type DayReason,
} from '@/lib/availability'
import { bookingUrl, type EngineSettings } from '@/lib/booking'
import { campaignParams, nightsBetween, track } from '@/lib/tracking'
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

/** Stan dnia w kalendarzu i treść okienka (jak na stronie rezerwacji IceColdRes, Michał, 25.10.2026). */
type DayNote = {
  /** można kliknąć */
  ok: boolean
  /** dzień nie nadaje się na wyjazd, ale można od niego zacząć nowy pobyt */
  soft?: boolean
  promo: string | null
  title: string
  lines: string[]
  tone: 'ok' | 'no' | 'sel'
}

type Search =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'done'; nights: number; results: Result[] }

const today = () => new Date().toISOString().slice(0, 10)
const AGES = Array.from({ length: 18 }, (_, i) => i)
const ADULTS = Array.from({ length: 12 }, (_, i) => i + 1)

/**
 * Pasek rezerwacji (koncepcja S5): kalendarz bez cen, z okienkami o dostępności i min. pobycie jak w IceColdRes
 * oraz plakietkami promocji, osoby i wiek dzieci,
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
  const adultsRef = useRef<HTMLSelectElement>(null)
  const [children, setChildren] = useState(0)
  // liczba osób razem z dziećmi; dorośli to reszta (co najmniej jeden)
  const adults = guests === null ? null : Math.max(1, guests - children)
  const [ages, setAges] = useState<(number | null)[]>([])
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(() => today().slice(0, 7))
  const [chunks, setChunks] = useState<Record<string, CalendarData | null>>({})
  const [search, setSearch] = useState<Search>({ status: 'idle' })
  const root = useRef<HTMLDivElement>(null)
  const calRef = useRef<HTMLDivElement>(null)
  const tipId = `${uid}-okienko`
  const [tip, setTip] = useState<{ date: string; left: number; top: number; arrow: number } | null>(null)
  const plural = new Intl.PluralRules(locale === 'pl' ? 'pl' : 'en')
  const nightsLabel = (n: number) =>
    `${n} ${t.nightForms[plural.select(n) as keyof typeof t.nightForms] ?? t.nightForms.other}`

  // dostępność dwóch widocznych miesięcy (pośrednik strony buforuje ją 45 s)
  // promocje strony mają sezon (lato/zima/oba), więc plakietki w kalendarzu zależą od przełącznika pory roku
  const { sezon } = useAmbience()
  const chunkKey = `${sezon}:${month}`
  const requested = useRef(new Set<string>())
  useEffect(() => {
    if (!live || !open || requested.current.has(chunkKey)) return
    requested.current.add(chunkKey)
    fetch(`/api/booking/calendar?from=${month}-01&days=62&lang=${locale}&season=${sezon}`)
      .then((r): Promise<CalendarData | null> | null => (r.ok ? r.json() : null))
      .catch((): null => null)
      .then((data) => setChunks((c) => ({ ...c, [chunkKey]: data })))
  }, [live, open, month, locale, sezon, chunkKey])
  const seasonChunks = Object.entries(chunks)
    .filter(([k]) => k.startsWith(`${sezon}:`))
    .map(([, c]) => c)

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

  const chunkFor = (date: string) =>
    seasonChunks.find((c): c is CalendarData =>
      Boolean(c && date >= c.from && daysBetween(c.from, date) < (c.types[0]?.days.length ?? 0)),
    )

  const fill = (text: string, n: number) => text.replace('{n}', nightsLabel(n))
  const c = t.cal
  const why = (r: DayReason | undefined, n: number | undefined, departing: boolean): string => {
    if (r === 'past') return c.past
    if (r === 'closed') return c.closed
    if (r === 'noArrival') return c.noArrival
    if (r === 'noDeparture') return c.noDeparture
    if (r === 'maxStay' && n) return fill(c.maxStayFrom, n)
    if (r === 'minStay' && n) return fill(departing ? c.minStayFrom : c.tooShort, n)
    return departing ? c.occupiedStay : c.occupied
  }

  function dayNote(date: string): DayNote {
    // „dziś” obiektu (strefa IceColdRes) może być dniem później niż w przeglądarce
    const first = seasonChunks.find((x) => x)
    if (date < today() || (first && date < first.today))
      return { ok: false, promo: null, title: c.unavailable, lines: [c.past], tone: 'no' }
    const data = chunkFor(date) ?? chunkFor(arrival)
    const arr = data ? arrivalInfo(data, date, unit) : null
    const promo = arr?.promo ?? null
    if (date === arrival) {
      const lines = [arr?.minStay ? fill(c.minStay, arr.minStay) : null, departure ? null : c.pickDeparture]
      return { ok: true, promo, title: c.yourArrival, lines: lines.filter((l): l is string => !!l), tone: 'sel' }
    }
    if (date === departure) return { ok: true, promo, title: c.yourDeparture, lines: [fill(c.stay, daysBetween(arrival, departure))], tone: 'sel' }
    if (arrival && !departure && date > arrival) {
      const dep = data ? departureInfo(data, arrival, date, unit) : { ok: true }
      if (dep.ok) return { ok: true, promo, title: c.departureOk, lines: [fill(c.stay, daysBetween(arrival, date))], tone: 'ok' }
      const n = 'reason' in dep && dep.reason === 'maxStay' ? dep.maxStay : 'minStay' in dep ? dep.minStay : undefined
      const lines = [why('reason' in dep ? dep.reason : undefined, n, true)]
      if (arr?.ok) lines.push(c.startHere)
      return { ok: !!arr?.ok, soft: !!arr?.ok, promo, title: c.departureNo, lines, tone: 'no' }
    }
    if (!arr || !arr.known) return { ok: true, promo, title: '', lines: [], tone: 'ok' }
    if (!arr.ok) return { ok: false, promo: null, title: c.unavailable, lines: [why(arr.reason, arr.minStay, false)], tone: 'no' }
    const lines = [promo, arr.minStay ? fill(c.minStay, arr.minStay) : null, c.pickArrival]
    return { ok: true, promo, title: c.free, lines: lines.filter((l): l is string => !!l), tone: 'ok' }
  }

  const arrivalData = arrival ? chunkFor(arrival) : undefined
  const arrivalMinStay = (arrivalData && arrivalInfo(arrivalData, arrival, unit).minStay) || 1

  // okienko nad dniem: w obrębie kalendarza, strzałka nad środkiem dnia
  function showTip(date: string, el: HTMLElement) {
    const box = calRef.current?.getBoundingClientRect()
    if (!box) return
    const r = el.getBoundingClientRect()
    const center = r.left + r.width / 2 - box.left
    const half = Math.min(140, box.width / 2)
    const left = Math.min(Math.max(center, half), box.width - half)
    setTip({ date, left, top: r.top - box.top, arrow: center - left })
  }

  function pickDay(date: string, note: DayNote) {
    if (!note.ok) return
    if (arrival && !departure && date > arrival && !note.soft) {
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
      const data = (await r.json()) as { nights: number; results: Result[] }
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

  return (
    <div className="mo-booking-wrap" ref={root}>
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
          <select
            ref={adultsRef}
            value={guests ?? ''}
            aria-invalid={missingAdults || undefined}
            aria-describedby={missingAdults ? errorId : undefined}
            onChange={(e) => {
              const n = e.target.value === '' ? null : Number(e.target.value)
              setGuests(n)
              if (n !== null && children > n - 1) setChildCount(n - 1)
              setMissingAdults(false)
            }}
          >
            <option value="">--</option>
            {ADULTS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="mo-field">
          <span className="mo-label">{t.childrenOf}</span>
          <input
            type="number"
            min={0}
            max={guests === null ? 10 : guests - 1}
            value={children}
            onChange={(e) => setChildCount(Math.min(guests === null ? 10 : guests - 1, Math.max(0, Number(e.target.value))))}
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
          ref={calRef}
          className="mo-calendar"
          id={calendarId}
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
            aria-busy={live && !chunks[chunkKey] ? true : undefined}
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
                    const s = dayNote(d)
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
                        data-soft={s.soft || undefined}
                        aria-disabled={!s.ok || undefined}
                        aria-pressed={edge}
                        aria-label={[fmt(d), s.title, ...s.lines].filter(Boolean).join(', ')}
                        aria-describedby={tip?.date === d ? tipId : undefined}
                        onClick={(e) => {
                          pickDay(d, s)
                          showTip(d, e.currentTarget)
                        }}
                        onMouseEnter={(e) => showTip(d, e.currentTarget)}
                        onFocus={(e) => showTip(d, e.currentTarget)}
                        onMouseLeave={() => setTip(null)}
                        onBlur={() => setTip(null)}
                      >
                        <span>{Number(d.slice(8))}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          {(() => {
            const n = tip ? dayNote(tip.date) : null
            return n && (n.title || n.lines.length) ? (
              <div
                id={tipId}
                role="tooltip"
                className="mo-calendar__tip"
                data-tone={n.tone}
                style={{ left: tip!.left, top: tip!.top, ['--strzalka' as string]: `${tip!.arrow}px` }}
              >
                <span className="mo-calendar__tip-date">{fmt(tip!.date)}</span>
                {n.title ? <strong>{n.title}</strong> : null}
                {n.lines.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            ) : null
          })()}
          <p className="mo-body-s mo-calendar__hint">
            {arrival && !departure
              ? fill(c.hintDeparture, arrivalMinStay)
              : c.hintArrival}
          </p>
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
