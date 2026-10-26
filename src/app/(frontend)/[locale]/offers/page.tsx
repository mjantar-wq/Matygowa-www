import type { Metadata } from 'next'
import { CmsPage, getPage } from '@/components/CmsPage'
import { Media } from '@/components/Media'
import { Placeholder } from '@/components/Placeholder'
import { Markdown } from '@/components/Markdown'
import { bookingUrl, engineSettings } from '@/lib/booking'
import { promoSeason } from '@/lib/icecoldres'
import { buildMetadata, pageContext, type LocaleParams } from '@/lib/page'
import { getPromoCards } from '@/lib/promo-cards'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const ctx = await pageContext(params)
  const page = await getPage('offers', ctx)
  return buildMetadata(ctx.locale, 'offers', { title: page?.title ?? ctx.t.nav.offers, description: page?.intro, seo: page?.seo })
}

/** Oferty to promocje z cennika IceColdRes (Michał, 25.10.2026): tytuł, opisy i daty z IceColdRes, z panelu tylko zdjęcie. */
export default async function OffersPage({ params }: LocaleParams) {
  const ctx = await pageContext(params)
  const cards = await getPromoCards(ctx.locale)
  const pl = ctx.locale === 'pl'
  const engine = engineSettings(ctx.settings)
  return (
    <CmsPage route="offers" ctx={ctx}>
      <section className="mo-section mo-container">
        <p className="mo-label">{ctx.settings?.priceSlogan || ctx.t.booking.lowestPrice}</p>
        <div className="mo-cards">
          {cards.map(({ promotion: p, image, offerId }) => {
            const story = pl ? p.story : p.en.story || p.story
            return (
              <article key={p.id} className="mo-card mo-card--poziom" data-sezon-promo={promoSeason(p.season)}>
                <div className="mo-card__media"><Media media={image} /></div>
                <p className="mo-card__eyebrow"><span className="mo-badge">{ctx.t.offers.onlyHere}</span></p>
                <h2 className="mo-h3 mo-card__title">{pl ? p.badge : p.en.badge || p.badge}</h2>
                <p className="mo-body-s mo-card__text">{pl ? p.description : p.en.description || p.description}</p>
                {story ? <Markdown text={story} className="mo-body-s mo-prose" /> : null}
                <p className="mo-card__meta">
                  <a href={bookingUrl(engine, ctx.locale, { offer: offerId || undefined })} data-track="offers" className="mo-btn mo-btn--glowny mo-btn--maly">
                    {ctx.t.booking.book}
                  </a>
                </p>
              </article>
            )
          })}
        </div>
        {/* pusty sezon: wszystkie promocje są z drugiej pory roku (przełącznik lato/zima chowa je w CSS) */}
        {(['lato', 'zima'] as const).map((sezon) =>
          cards.some((c) => (promoSeason(c.promotion.season) ?? sezon) === sezon) ? null : (
            <div key={sezon} data-sezon-promo={sezon}>
              <Placeholder label={ctx.t.offers.empty} />
            </div>
          ),
        )}
      </section>
    </CmsPage>
  )
}
