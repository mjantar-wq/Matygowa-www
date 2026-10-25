'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Opowieść przewijana: na szerokim ekranie zdjęcia stoją w miejscu (sticky) i zmieniają się z krokiem,
 * który jest na środku ekranu; na telefonie każdy krok ma swoje zdjęcie nad tekstem. Bez JS i bez ruchu
 * to zwykła lista kroków.
 */
export function ScrollSteps({ media, steps, label }: { media: React.ReactNode[]; steps: React.ReactNode[]; label?: string }) {
  const [active, setActive] = useState(0)
  const list = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const items = Array.from(list.current?.children ?? []) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step))
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div className="mo-steps">
      <div className="mo-steps__stage" aria-hidden="true">
        {media.map((m, i) => (
          <div key={i} className="mo-steps__frame" data-active={i === active || undefined}>
            {m}
          </div>
        ))}
        <div className="mo-steps__steam" />
      </div>
      <ol ref={list} className="mo-steps__list" aria-label={label}>
        {steps.map((s, i) => (
          <li key={i} data-step={i} data-active={i === active || undefined} className="mo-steps__step">
            <div className="mo-steps__inline">{media[i]}</div>
            {s}
          </li>
        ))}
      </ol>
    </div>
  )
}
