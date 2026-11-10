import type { Metadata } from 'next'
import { AttractionEntry, attractionMeta, attractionSeason, sortAttractions } from '@/components/Attraction'
import { CmsPage, getPage } from '@/components/CmsPage'
import { AttractionPopup } from '@/components/effects/AttractionPopup'
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

/**
 * Okolica: te same atrakcje co w sekcji „Blisko wszystkiego” na głównej (jedna kolekcja w panelu), jedną listą
 * kafelków z krótkim opisem; kafelek otwiera okienko z opisem rozszerzonym i zdjęciami.
 */
export default async function SurroundingsPage({ params }: LocaleParams) {
  const ctx = await pageContext(params)
  const attractions = sortAttractions(await findMany<Attraction>('attractions', ctx.locale, { depth: 1 }))
  return (
    <CmsPage route="surroundings" ctx={ctx}>
      {attractions.length ? (
        <section className="mo-section mo-container">
          <ul className="mo-cards mo-atrakcje" role="list">
            {attractions.map((a) => {
              const meta = attractionMeta(a, ctx)
              return (
                <AttractionPopup
                  key={a.id}
                  slug={a.slug}
                  href={href(ctx.locale, 'surroundings', a.slug)}
                  label={a.name}
                  closeLabel={ctx.t.effects.close}
                  season={attractionSeason(a)}
                  card={
                    <>
                      <div className="mo-card__media">
                        <Media media={a.image} />
                      </div>
                      <h2 className="mo-h3 mo-card__title">{a.name}</h2>
                      {a.summary ? <p className="mo-card__text">{a.summary}</p> : <span />}
                      <span />
                      <p className="mo-card__meta">
                        <span className="mo-label">{meta}</span>
                        <span className="mo-card__arrow" aria-hidden="true">→</span>
                      </p>
                    </>
                  }
                >
                  <AttractionEntry a={a} ctx={ctx} />
                </AttractionPopup>
              )
            })}
          </ul>
        </section>
      ) : null}
    </CmsPage>
  )
}
