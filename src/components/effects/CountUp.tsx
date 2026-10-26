'use client'

import { useEffect, useRef, useState } from 'react'
import { motionAllowed } from './ambience'

const DURATION = 1200
const SR_ONLY: React.CSSProperties = { position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)', whiteSpace: 'nowrap' }

/**
 * Liczba we wstępie narasta od zera, gdy wchodzi w widok (koncepcja: strona główna, sekcja 2).
 * Serwer (i strona bez JS) ma od razu pełną wartość; bez ruchu (ustawienie systemu, oszczędzanie danych) liczba stoi.
 */
export function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\D*?)(\d+(?:[\s\u00a0]\d{3})*)(.*)$/)
  // ułamki (np. „4,9 ★”) zostają bez animacji, bo kolejne klatki pokazywałyby błędne wartości
  const target = match && !/^[.,]\d/.test(match[3]!) ? Number(match[2]!.replace(/[\s\u00a0]/g, '')) : NaN
  const separator = match?.[2]!.match(/[\s\u00a0]/)?.[0]
  const [shown, setShown] = useState<number | null>(null)
  const el = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = el.current
    if (!node || !Number.isFinite(target) || target < 2 || !motionAllowed()) return
    const start = node.getBoundingClientRect()
    // liczba widoczna już przy wejściu na stronę zostaje bez animacji
    if (start.top < window.innerHeight && start.bottom > 0) return
    setShown(0)
    let frame = 0
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        io.disconnect()
        const t0 = performance.now()
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / DURATION)
          setShown(Math.round(target * (1 - Math.pow(1 - p, 3))))
          if (p < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    io.observe(node)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [target])

  if (!match || shown === null) return <span ref={el}>{value}</span>
  const digits = separator ? String(shown).replace(/\B(?=(\d{3})+(?!\d))/g, separator) : String(shown)
  return (
    <span ref={el}>
      {/* cyfry o stałej szerokości, żeby napis nie drgał; czytnik ekranu dostaje od razu pełną wartość */}
      <span aria-hidden="true" style={{ fontVariantNumeric: 'tabular-nums' }}>{`${match[1]}${digits}${match[3]}`}</span>
      <span style={SR_ONLY}>{value}</span>
    </span>
  )
}
