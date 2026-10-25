'use client'

import { useEffect, useRef, useState } from 'react'
import { motionAllowed, useAmbience, useMotionPaused } from './ambience'

export type HeroImage = { url: string; alt?: string | null; width?: number | null; height?: number | null; focusX?: number | null; focusY?: number | null }
/** Jeden kadr hero; `slots` to nastroje (np. "noc-zima"), w których ten kadr się pokazuje; `nocny` przyciemnia dzienny kadr na noc. */
export type HeroSlide = { image?: HeroImage | null; video?: string | null; videoPortrait?: string | null; slots: string[]; nocny?: boolean }

/**
 * Filmowe wejście: kadr startowy jest od razu (LCP) i powoli dryfuje (CSS); film, jeśli jest, dociąga się po
 * załadowaniu strony i płynnie wchodzi na kadr. Przycisk pauzy (MotionPause w hero) zatrzymuje oba. Bez ruchu
 * (prefers-reduced-motion, oszczędzanie danych) zostaje nieruchomy kadr.
 */
export function HeroStage({ slides, active: shown = true, eager = true }: { slides: HeroSlide[]; active?: boolean; eager?: boolean }) {
  const { pora, sezon } = useAmbience()
  const active = Math.max(0, slides.findIndex((s) => s.slots.includes(`${pora}-${sezon}`)))
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const [ready, setReady] = useState(false)
  const paused = useMotionPaused()
  const [playing, setPlaying] = useState<number | null>(null)

  useEffect(() => {
    if (!motionAllowed()) return
    const start = () => setReady(true)
    if (document.readyState === 'complete') {
      const id = window.setTimeout(start, 300)
      return () => window.clearTimeout(id)
    }
    window.addEventListener('load', start, { once: true })
    return () => window.removeEventListener('load', start)
  }, [])

  useEffect(() => {
    if (!ready) return
    videos.current.forEach((v, i) => {
      if (!v) return
      if (i !== active || paused || !shown) return void v.pause()
      const slide = slides[i]
      const src = (matchMedia('(orientation: portrait)').matches && slide.videoPortrait) || slide.video
      if (!src) return
      if (v.dataset.src !== src) {
        v.dataset.src = src
        v.src = src
      }
      v.play().catch(() => {})
    })
  }, [ready, active, paused, slides, shown])

  return (
    <>
      {slides.map((s, i) => {
        const position = `${s.image?.focusX ?? 50}% ${s.image?.focusY ?? 50}%`
        return (
          <div key={i} className={`mo-hero__slide ${s.slots.map((x) => `is-${x}`).join(' ')}${s.nocny ? ' is-nocny' : ''}`} data-playing={playing === i || undefined} data-paused={paused || !shown || undefined}>
            {s.image?.url ? (
              // eslint-disable-next-line @next/next/no-img-element -- kadr startowy, rozmiary robi Cloudflare
              <img
                src={s.image.url}
                alt={s.image.alt ?? ''}
                width={s.image.width ?? undefined}
                height={s.image.height ?? undefined}
                loading={eager && i === 0 ? 'eager' : 'lazy'}
                fetchPriority={eager && i === 0 ? 'high' : undefined}
                decoding="async"
                style={{ objectPosition: position }}
              />
            ) : (
              <div className="mo-placeholder" aria-hidden="true" />
            )}
            {s.video ? (
              <video
                ref={(el) => {
                  videos.current[i] = el
                }}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
                tabIndex={-1}
                style={{ objectPosition: position }}
                onPlaying={() => setPlaying(i)}
              />
            ) : null}
          </div>
        )
      })}
    </>
  )
}
