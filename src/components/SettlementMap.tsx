import Link from 'next/link'
import { href } from '@/i18n/routes'
import type { PageContext } from '@/lib/page'
import type { Unit } from '@/payload-types'
import { SvgHotspots } from './effects/SvgHotspots'

/**
 * Mapa osady (ilustracja G1): sześć domów i bliźniak z czterema apartamentami, który otwiera się
 * wiosną 2027. Budynki otwierają dymki; nocą i zimą rysunek zmienia kolory razem z tokenami.
 */
export function SettlementMap({ units, ctx }: { units: Unit[]; ctx: PageContext }) {
  const t = ctx.t.effects
  const houses = units.filter((u) => u.kind === 'house')
  const apartments = units.filter((u) => u.kind === 'apartment')
  const buildings = [
    ...houses.map((u) => ({ svgId: `b-dom-${u.slug.replace(/^dom-/, '')}`, popoverId: `mapa-${u.slug}`, label: u.name, units: [u], soon: u.status === 'comingSoon' })),
    // bliźniak z apartamentami: każdy lokal ma na rysunku własną strefę b-apt-<slug> (góra: Czerwone Wierchy, Kominiarski Wierch; dół: Giewont, Ciemniak)
    ...apartments.map((u) => ({ svgId: `b-apt-${u.slug}`, popoverId: `mapa-${u.slug}`, label: u.name, units: [u], soon: u.status === 'comingSoon' })),
  ]
  return (
    <figure className="mo-map" aria-label={t.map}>
      <SvgHotspots src="/ilustracje/G1_mapa_osady.svg" className="mo-map__stage" targets={buildings.map(({ svgId, popoverId, label }) => ({ svgId, popoverId, label }))} />
      {buildings.map((b, i) => (
        <div key={b.svgId} id={b.popoverId} popover="auto" className="mo-tip mo-popover">
          <p className="mo-label">{`${t.building} ${i + 1}`}</p>
          <h3 className="mo-h3">{b.label}</h3>
          {b.soon ? <p className="mo-badge">{t.opening}</p> : b.units[0]?.tagline ? <p>{b.units[0].tagline}</p> : null}
          <ul className="mo-popover__links">
            {b.units.map((u) => (
              <li key={u.id}>
                <Link href={href(ctx.locale, 'houses', u.slug)} className="mo-link">
                  {b.units.length > 1 ? u.name : t.seeHouse}
                </Link>
              </li>
            ))}
          </ul>
          <button type="button" className="mo-popover__close" popoverTarget={b.popoverId} popoverTargetAction="hide" aria-label={t.close}>
            ×
          </button>
        </div>
      ))}
    </figure>
  )
}
