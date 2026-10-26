'use client'

import { useEffect, useRef, useState } from 'react'
import { motionAllowed } from './ambience'

const DURATION = 1200

/**
 * Liczba we wstępie narasta od zera, gdy wchodzi w widok (koncepcja: strona główna, sekcja 2).
 * Serwer (i strona bez JS) ma od razu pełną wartość; bez ruchu (ustawienie systemu, oszczędzanie danych) liczba stoi.
 */
export function CountUp({ value }: { value: string }) {
  const match = value.match(/^(\D*?)(\d+(?:[\s\u00a0]\d{3})*)(.*)$/)
  const target = match ? Number(match[2]!.replace(/\s/g, '')) : NaN
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
  // cyfry o stałej szerokości, żeby napis nie drgał w trakcie narastania
  return <span ref={el} style={{ fontVariantNumeric: 'tabular-nums' }}>{`${match[1]}${shown}${match[3]}`}</span>
}
