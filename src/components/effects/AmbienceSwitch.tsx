'use client'

import type { Dictionary } from '@/i18n/dictionaries'
import { setAmbience, useAmbience, type Pora, type Sezon } from './ambience'

/** Dwa przełączniki w nagłówku: Dzień / Noc i Zima / Lato. */
export function AmbienceSwitch({ t }: { t: Dictionary['effects'] }) {
  const { pora, sezon } = useAmbience()
  const pory: [Pora, string][] = [['dzien', t.time.day], ['noc', t.time.night]]
  const sezony: [Sezon, string][] = [['zima', t.season.winter], ['lato', t.season.summer]]
  return (
    <div className="mo-ambience" role="group" aria-label={t.ambience}>
      <div className="mo-toggle" role="group" aria-label={t.time.label}>
        {pory.map(([value, label]) => (
          <button key={value} type="button" aria-pressed={pora === value} onClick={() => setAmbience({ pora: value })}>
            {label}
          </button>
        ))}
      </div>
      <div className="mo-toggle" role="group" aria-label={t.season.label}>
        {sezony.map(([value, label]) => (
          <button key={value} type="button" aria-pressed={sezon === value} onClick={() => setAmbience({ sezon: value })}>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
