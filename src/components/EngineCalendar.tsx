'use client'

import { useEffect, useRef, useState } from 'react'

const DATE = /^\d{4}-\d{2}-\d{2}$/
const date = (v: unknown) => (typeof v === 'string' && DATE.test(v) ? v : '')

type Props = {
  /** adres ramki z engineCalendarUrl (daty z adresu to tylko start; potem ramka i strona wymieniają się komunikatami) */
  src: string
  title: string
  arrival: string
  departure: string
  /** po każdym wyborze dnia: najpierw sam przyjazd (wyjazd pusty), potem przyjazd z wyjazdem */
  onPick: (arrival: string, departure: string) => void
}

/**
 * Kalendarz dostępności z IceColdRes w ramce (Michał, 2.11.2026: kalendarz na stronie, na stronie rezerwacji,
 * w rezerwacji telefonicznej i w widżetach to jeden komponent z jednym kodem). Protokół ramki:
 * docs/integracja-strony.md w IceColdRes, „Kalendarz do osadzenia”.
 */
export function EngineCalendar({ src, title, arrival, departure, onPick }: Props) {
  const frame = useRef<HTMLIFrameElement>(null)
  // adres tylko z pierwszego renderu: zmiana dat nie przeładowuje ramki, tylko idzie do niej komunikatem
  const [initial] = useState(src)
  const origin = new URL(initial).origin
  const [height, setHeight] = useState(420)
  // daty, które ramka ma u siebie (z adresu albo z ostatniego wyboru)
  const shown = useRef({ arrival, departure })
  const pick = useRef(onPick)
  useEffect(() => {
    pick.current = onPick
  }, [onPick])

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow || e.origin !== origin || !e.data) return
      if (e.data.type === 'icecoldres:calendar-size' && e.data.height > 0) setHeight(Math.min(Math.ceil(e.data.height), 2000))
      if (e.data.type === 'icecoldres:calendar') {
        const a = date(e.data.arrival)
        const d = a ? date(e.data.departure) : ''
        shown.current = { arrival: a, departure: d }
        pick.current(a, d)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [origin])

  // daty ustawione poza kalendarzem (np. „Wyczyść daty”) idą do ramki
  useEffect(() => {
    if (shown.current.arrival === arrival && shown.current.departure === departure) return
    shown.current = { arrival, departure }
    frame.current?.contentWindow?.postMessage({ type: 'icecoldres:calendar-set', arrival, departure }, origin)
  }, [arrival, departure, origin])

  return <iframe ref={frame} className="mo-calendar__ramka" src={initial} title={title} style={{ blockSize: `${height}px` }} />
}
