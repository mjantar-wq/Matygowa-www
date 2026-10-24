import type { Metadata } from 'next'
import Link from 'next/link'
import { CmsPage, getPage } from '@/components/CmsPage'
import { Media } from '@/components/Media'
import { href } from '@/i18n/routes'
import { findMany } from '@/lib/cms'
import { buildMetadata, pageContext, type LocaleParams } from '@/lib/page'
import type { Attraction } from '@/payload-types'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const ctx = await pageContext(params)
  const page = await getPage('surroundings', ctx)
  return buildMetadata(ctx.locale, 'surroundings', { title: page?.title ?? ctx.t.nav.surroundings, description: page?.intro, seo: page?.seo })
}

/** Okolica i Atrakcje; filtr zima/lato i kategorie dojdą w etapie budowy. */
export default async function SurroundingsPage({ params }: LocaleParams) {
  const ctx = await pageContext(params)
  const attractions = await findMany<Attraction>('attractions', ctx.locale, { sort: 'distanceKm' })
  return (
    <CmsPage route="surroundings" ctx={ctx}>
      {attractions.length ? (
        <section className="mo-section mo-container">
          <div className="mo-cards">
            {attractions.map((a) => (
              <Link key={a.id} href={href(ctx.locale, 'surroundings', a.slug)} className="mo-card">
                <div className="mo-card__media"><Media media={a.image} /></div>
                <h2 className="mo-h3">{a.name}</h2>
                <p>{a.summary}</p>
                {a.distanceKm != null ? <p className="mo-card__meta">{ctx.t.attractions.distance(a.distanceKm)}</p> : null}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </CmsPage>
  )
}
