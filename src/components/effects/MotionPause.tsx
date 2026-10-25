'use client'

import { useSyncExternalStore } from 'react'
import type { Dictionary } from '@/i18n/dictionaries'
import { motionAllowed, setMotionPaused, useMotionPaused } from './ambience'

const never = () => () => {}

/** Przycisk pauzy ruchu tła hero (WCAG 2.2.2). Leży w treści hero, nie w warstwie tła, więc zawsze da się go kliknąć. */
export function MotionPause({ t }: { t: Dictionary['effects'] }) {
  const allowed = useSyncExternalStore(never, motionAllowed, () => false)
  const paused = useMotionPaused()
  if (!allowed) return null
  return (
    <button type="button" className="mo-hero__pause mo-btn mo-btn--obrys mo-btn--maly" aria-pressed={paused} onClick={() => setMotionPaused(!paused)}>
      {paused ? t.play : t.pause}
    </button>
  )
}
