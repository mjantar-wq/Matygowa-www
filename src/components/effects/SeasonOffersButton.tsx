'use client'

import { setAmbience, type Sezon } from './ambience'

/** Gdy w jednej porze roku nie ma ofert: przycisk przełącza całą stronę na drugą (obok przełącznika w nagłówku). */
export function SeasonOffersButton({ to, label }: { to: Sezon; label: string }) {
  return (
    <button type="button" className="mo-btn mo-btn--glowny" onClick={() => setAmbience({ sezon: to })}>
      {label}
    </button>
  )
}
