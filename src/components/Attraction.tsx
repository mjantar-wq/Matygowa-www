import Link from 'next/link'
import { href } from '@/i18n/routes'
import type { PageContext } from '@/lib/page'
import type { Attraction } from '@/payload-types'
import { cleared, Credit, Media } from './Media'
import { PhotoGallery } from './PhotoGallery'
import { RichText } from './RichText'

/** Odległość, dojazd i miejsce w jednej linii, np. „14 km · 20 min samochodem · Palenica Białczańska”. */
export const attractionMeta = (a: Attraction, ctx: PageContext) =>
  [a.distanceKm != null ? ctx.t.attractions.distance(a.distanceKm) : null, a.driveMinutes ? ctx.t.attractions.drive(a.driveMinutes) : null, a.place]
    .filter(Boolean)
    .join(' · ')

/** Kolejność strony Okolica: od najbliższej, atrakcje bez jednego miejsca (szlaki, lot balonem) na końcu. */
export const sortAttractions = (list: Attraction[]) => [...list].sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity))

/**
 * Atrakcja w okienku na stronie Okolica i na jej własnej stronie: zdjęcie z podpisem licencji, opis rozszerzony,
 * dodatkowe zdjęcia i link do obiektu. Na stronie głównej ta sama atrakcja ma tylko krótki opis.
 */
export function AttractionEntry({ a, ctx, heading: H = 'h2', link }: { a: Attraction; ctx: PageContext; heading?: 'h1' | 'h2'; link?: boolean }) {
  const meta = attractionMeta(a, ctx)
  const title = H === 'h1' ? 'mo-h1' : 'mo-h2'
  return (
    <article className="mo-atrakcja">
      {a.image && cleared(a.image) ? (
        <figure className="mo-zdjecie mo-atrakcja__zdjecie">
          <Media media={a.image} priority={H === 'h1'} />
          <Credit media={a.image} />
        </figure>
      ) : null}
      <div className="mo-atrakcja__tekst">
        {meta ? <p className="mo-label">{meta}</p> : null}
        <H className={title}>{link ? <Link href={href(ctx.locale, 'surroundings', a.slug)}>{a.name}</Link> : a.name}</H>
        {a.description ? <RichText data={a.description} /> : a.summary ? <p className="mo-prose">{a.summary}</p> : null}
        {a.url ? (
          <p>
            <a href={a.url} rel="noopener" target="_blank" className="mo-link">{ctx.t.attractions.website}</a>
          </p>
        ) : null}
      </div>
      {a.gallery?.some(cleared) ? (
        <div className="mo-atrakcja__galeria">
          <PhotoGallery media={a.gallery} ctx={ctx} />
          {/* licencje CC wymagają podpisu przy zdjęciu: miniatury mają go w powiększeniu i zbiorczo tutaj */}
          {a.gallery.map((m) => <Credit key={typeof m === 'object' ? m.id : m} media={m} as="p" />)}
        </div>
      ) : null}
    </article>
  )
}
