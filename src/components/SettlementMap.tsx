import Link from 'next/link'
import { href } from '@/i18n/routes'
import type { PageContext } from '@/lib/page'
import type { Media as MediaDoc, Unit } from '@/payload-types'
import { Lightbox } from './effects/Lightbox'
import { SvgHotspots } from './effects/SvgHotspots'
import { RichText } from './RichText'

/**
 * Mapa osady (ilustracja G1): sześć domów i bliźniak z czterema apartamentami, który otwiera się
 * wiosną 2027. Klik w budynek prowadzi na jego kartę, przyciski pod mapą otwierają okno z opisem i zdjęciami;
 * nocą i zimą rysunek zmienia kolory razem z tokenami.
 */
export function SettlementMap({ units, ctx }: { units: Unit[]; ctx: PageContext }) {
  const t = ctx.t.effects
  const tb = ctx.t.booking
  const houses = units.filter((u) => u.kind === 'house')
  const apartments = units.filter((u) => u.kind === 'apartment')
  const buildings = [
    ...houses.map((u) => ({ svgId: `b-dom-${u.slug.replace(/^dom-/, '')}`, popoverId: `mapa-${u.slug}`, unit: u })),
    // bliźniak z apartamentami: każdy lokal ma na rysunku własną strefę b-apt-<slug> (jedna połowa: Czerwone Wierchy nad Giewontem, druga: Kominiarski Wierch nad Ciemniakiem, jak piętro i parter)
    ...apartments.map((u) => ({ svgId: `b-apt-${u.slug}`, popoverId: `mapa-${u.slug}`, unit: u })),
  ]
  // Klik w budynek na rysunku prowadzi od razu na kartę; przycisk z nazwą pod mapą otwiera okno z opisem.
  const targets = buildings.map(({ svgId, popoverId, unit }) => ({ svgId, popoverId, label: unit.name, href: href(ctx.locale, 'houses', unit.slug), modal: true }))
  return (
    <figure className="mo-map" aria-label={t.map}>
      <SvgHotspots src="/ilustracje/G1_mapa_osady.svg" className="mo-map__stage" targets={targets} />
      {buildings.map(({ popoverId, unit: u }, i) => {
        const photos = [u.hero, ...(u.gallery ?? [])]
          .filter((m): m is MediaDoc => !!m && typeof m === 'object' && !!m.url && !m.mimeType?.startsWith('video/'))
          .filter((m, j, all) => all.findIndex((x) => x.url === m.url) === j)
          .slice(0, 7)
          .map((m) => ({ url: m.url!, alt: m.alt, width: m.width, height: m.height, focusX: m.focusX, focusY: m.focusY }))
        const facts = [
          [tb.facts.area, u.area ? `${u.area} m²` : null],
          [tb.facts.guests, u.maxGuests],
          [tb.facts.bedrooms, u.bedrooms],
          [tb.facts.bathrooms, u.bathrooms],
        ].filter(([, v]) => v)
        return (
          <dialog key={popoverId} id={popoverId} className="mo-unit-dialog mo-map-dialog" aria-label={u.name}>
            <div className="mo-unit-dialog__inner">
              <form method="dialog" className="mo-unit-dialog__close-form">
                <button className="mo-unit-dialog__close" aria-label={t.close}>
                  ×
                </button>
              </form>
              {photos.length ? (
                <div className="mo-unit-dialog__photos">
                  <Lightbox items={photos} t={t} />
                </div>
              ) : null}
              <div className="mo-unit-dialog__text">
                <p className="mo-card__eyebrow">
                  <span className="mo-label">{`${t.building} ${i + 1} · ${tb.kind[u.kind]}`}</span>
                  {u.peak?.elevation ? <span className="mo-figure">{ctx.t.house.elevation(u.peak.elevation)}</span> : null}
                </p>
                <h3 className="mo-unit-dialog__name">{u.name}</h3>
                {u.status === 'comingSoon' ? <p className="mo-badge">{t.opening}</p> : null}
                {u.tagline ? <p className="mo-unit-dialog__lede">{u.tagline}</p> : null}
                {facts.length ? (
                  <dl className="mo-tile__facts">
                    {facts.map(([k, v]) => (
                      <div key={String(k)}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
                {u.story ? <RichText data={u.story} /> : null}
                <p>
                  <Link href={href(ctx.locale, 'houses', u.slug)} className="mo-btn mo-btn--glowny">
                    {u.kind === 'apartment' ? t.seeApartment : t.seeHouse}
                  </Link>
                </p>
              </div>
            </div>
          </dialog>
        )
      })}
    </figure>
  )
}
