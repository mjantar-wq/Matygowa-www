import Link from 'next/link'
import { href } from '@/i18n/routes'
import type { PageContext } from '@/lib/page'
import type { Media as MediaDoc, Unit } from '@/payload-types'
import { Media } from './Media'
import { RichText } from './RichText'
import { SvgHotspots } from './effects/SvgHotspots'

/** Id szczytu w ilustracji G2: adres domu bez przedrostka (dom-hawran → p-hawran). */
export const peakSvgId = (u: Unit) => `p-${u.slug.replace(/^(dom|apartament)-/, '')}`

/** Dymek szczytu: legenda albo ciekawostka z panelu i przejście do domu. */
function PeakTip({ u, id, ctx }: { u: Unit; id: string; ctx: PageContext }) {
  const t = ctx.t.effects
  return (
    <div id={id} popover="auto" className="mo-tip mo-popover">
      <p className="mo-label">{[u.peak?.range, u.peak?.elevation ? ctx.t.house.elevation(u.peak.elevation) : null].filter(Boolean).join(' · ')}</p>
      <h3 className="mo-h3">{u.name}</h3>
      {u.peak?.story ? <RichText data={u.peak.story} /> : u.tagline ? <p>{u.tagline}</p> : null}
      {u.status === 'comingSoon' ? <p className="mo-badge">{t.opening}</p> : null}
      <p className="mo-card__meta">
        <Link href={href(ctx.locale, 'houses', u.slug)} className="mo-link">
          {u.kind === 'apartment' ? t.seeApartment : t.seeHouse}
        </Link>
      </p>
      <button type="button" className="mo-popover__close" popoverTarget={id} popoverTargetAction="hide" aria-label={t.close}>
        ×
      </button>
    </div>
  )
}

/**
 * Panorama szczytów. Domyślnie ilustracja G2 (liczona z modelu terenu z punktu osady) z trzema warstwami
 * paralaksy; szczyty otwierają dymki. Zdjęcie z panelu, jeśli jest, zastępuje ilustrację i dostaje znaczniki
 * w pozycjach X/Y z panelu. Poniżej 1024 px panorama przewija się w bok.
 */
export function PeaksPanorama({ units, image, ctx }: { units: Unit[]; image?: MediaDoc | string | number | null; ctx: PageContext }) {
  const t = ctx.t.effects
  const photo = image && typeof image === 'object' && image.url ? image : null
  return (
    <div className="mo-panorama" data-rodzaj={photo ? 'zdjecie' : 'ilustracja'}>
      {photo ? (
        <div className="mo-panorama__scroller" tabIndex={0} role="region" aria-label={t.panoramaHint}>
          <div className="mo-panorama__stage">
            <div className="mo-panorama__layer">
              <Media media={photo} />
            </div>
            {units.map((u, i) => (
              <button
                key={u.id}
                type="button"
                popoverTarget={`szczyt-${u.slug}`}
                className="mo-panorama__marker"
                data-wkrotce={u.status === 'comingSoon' || undefined}
                style={{ insetInlineStart: `${u.peak?.panoramaX ?? 5 + i * 9.5}%`, insetBlockStart: `${u.peak?.panoramaY ?? 40}%`, '--n': i } as React.CSSProperties}
              >
                <span>{u.name}</span>
                {u.peak?.elevation ? <span className="mo-muted">{u.peak.elevation} m</span> : null}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <SvgHotspots
          src="/ilustracje/G2_panorama.svg"
          className="mo-panorama__svg"
          scrollLabel={t.panoramaHint}
          targets={units.map((u) => ({ svgId: peakSvgId(u), popoverId: `szczyt-${u.slug}`, label: u.name }))}
        />
      )}
      <p className="mo-panorama__hint mo-muted" aria-hidden="true">{t.panoramaHint}</p>
      {units.map((u) => (
        <PeakTip key={u.id} u={u} id={`szczyt-${u.slug}`} ctx={ctx} />
      ))}
    </div>
  )
}
