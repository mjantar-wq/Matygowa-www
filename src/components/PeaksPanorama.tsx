import Link from 'next/link'
import { href } from '@/i18n/routes'
import type { PageContext } from '@/lib/page'
import type { Media as MediaDoc, Unit } from '@/payload-types'
import { Media } from './Media'

/**
 * Panorama dziesięciu szczytów: znaczniki z panelu (pozycja X/Y w %) prowadzą do domów.
 * Szkielet bez ruchu; przesuwanie, paralaksa i dymki dojdą w prototypie (etap 2).
 */
export function PeaksPanorama({ units, image, ctx }: { units: Unit[]; image?: MediaDoc | string | number | null; ctx: PageContext }) {
  return (
    <div className="mo-panorama">
      <Media media={image} fallback={`${ctx.t.placeholder}: panorama Tatr`} />
      {units.map((u, i) => (
        <Link
          key={u.id}
          href={href(ctx.locale, 'houses', u.slug)}
          className="mo-panorama__marker"
          style={{ insetInlineStart: `${u.peak?.panoramaX ?? 5 + i * 9.5}%`, insetBlockStart: `${u.peak?.panoramaY ?? 40}%` }}
        >
          <span>{u.name}</span>
          {u.peak?.elevation ? <span className="mo-muted">{u.peak.elevation} m</span> : null}
        </Link>
      ))}
    </div>
  )
}
