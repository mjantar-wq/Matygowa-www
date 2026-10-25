import type { Metadata } from 'next'
import { CmsPage, getPage } from '@/components/CmsPage'
import { Media } from '@/components/Media'
import { Placeholder } from '@/components/Placeholder'
import { RichText } from '@/components/RichText'
import { bookingUrl, engineSettings } from '@/lib/booking'
import { findMany } from '@/lib/cms'
import { getPromotions, promoSeason } from '@/lib/icecoldres'
import { buildMetadata, pageContext, type LocaleParams } from '@/lib/page'
import type { Offer } from '@/payload-types'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const ctx = await pageContext(params)
  const page = await getPage('offers', ctx)
  return buildMetadata(ctx.locale, 'offers', { title: page?.title ?? ctx.t.nav.offers, description: page?.intro, seo: page?.seo })
}

/** Oferty to promocje z cennika IceColdRes (Michał, 25.10.2026); z panelu tylko zdjęcie i dłuższy opis po ID promocji. */
export default async function OffersPage({ params }: LocaleParams) {
  const ctx = await pageContext(params)
  const [promotions, offers] = await Promise.all([getPromotions(), findMany<Offer>('offers', ctx.locale, { sort: 'order' })])
  const pl = ctx.locale === 'pl'
  const engine = engineSettings(ctx.settings)
  return (
    <CmsPage route="offers" ctx={ctx}>
      <section className="mo-section mo-container">
        <p className="mo-label">{ctx.settings?.priceSlogan || ctx.t.booking.lowestPrice}</p>
        <div className="mo-cards">
          {promotions.map((p) => {
            const extra = offers.find((o) => o.icecoldresPromotionId === p.id)
            return (
              <article key={p.id} className="mo-card mo-card--poziom" data-sezon-promo={promoSeason(p.season)}>
                <div className="mo-card__media"><Media media={extra?.image} /></div>
                <p className="mo-card__eyebrow"><span className="mo-badge">{ctx.t.offers.onlyHere}</span></p>
                <h2 className="mo-h3 mo-card__title">{pl ? p.badge : p.en.badge || p.badge}</h2>
                <p className="mo-body-s mo-card__text">{pl ? p.description : p.en.description || p.description}</p>
                {/* dłuższy opis z panelu (Treści → Oferty) do tej promocji */}
                {extra?.content ? (
                  <div className="mo-body-s mo-prose">
                    <RichText data={extra.content} />
                  </div>
                ) : null}
                <p className="mo-card__meta">
                  <a href={bookingUrl(engine, ctx.locale, { offer: extra?.icecoldresOfferId || undefined })} data-track="offers" className="mo-btn mo-btn--obrys mo-btn--maly">
                    {ctx.t.booking.book}
                  </a>
                </p>
              </article>
            )
          })}
        </div>
        {!promotions.length ? <Placeholder label={ctx.t.offers.empty} /> : null}
      </section>
    </CmsPage>
  )
}
