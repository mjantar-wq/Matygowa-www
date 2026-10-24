import type { Metadata } from 'next'
import { BookLink } from '@/components/BookLink'
import { CmsPage, getPage } from '@/components/CmsPage'
import { Media } from '@/components/Media'
import { Placeholder } from '@/components/Placeholder'
import { RichText } from '@/components/RichText'
import { engineSettings } from '@/lib/booking'
import { findMany } from '@/lib/cms'
import { getPromotions } from '@/lib/icecoldres'
import { buildMetadata, pageContext, type LocaleParams } from '@/lib/page'
import type { Offer } from '@/payload-types'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const ctx = await pageContext(params)
  const page = await getPage('offers', ctx)
  return buildMetadata(ctx.locale, 'offers', { title: page?.title ?? ctx.t.nav.offers, description: page?.intro, seo: page?.seo })
}

/** Promocje z IceColdRes (tylko na stronie) i opisowe oferty sezonowe z panelu. */
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
              <article key={p.id} className="mo-card mo-card--poziom">
                <div className="mo-card__media"><Media media={extra?.image} /></div>
                <p className="mo-card__eyebrow"><span className="mo-badge">{ctx.t.offers.onlyHere}</span></p>
                <h2 className="mo-h3 mo-card__title">{pl ? p.badge : p.en.badge || p.badge}</h2>
                <p className="mo-body-s mo-card__text">{pl ? p.description : p.en.description || p.description}</p>
                <p className="mo-card__meta">
                  <BookLink engine={engine} locale={ctx.locale} query={{ offer: extra?.icecoldresOfferId || undefined }} className="mo-btn mo-btn--obrys mo-btn--maly">
                    {ctx.t.booking.book}
                  </BookLink>
                </p>
              </article>
            )
          })}
          {offers
            .filter((o) => !o.icecoldresPromotionId || !promotions.some((p) => p.id === o.icecoldresPromotionId))
            .map((o) => (
              <article key={o.id} className="mo-card mo-card--poziom">
                <div className="mo-card__media"><Media media={o.image} /></div>
                <p className="mo-card__eyebrow"><span className="mo-label">{ctx.t.nav.offers}</span></p>
                <h2 className="mo-h3 mo-card__title">{o.title}</h2>
                <div className="mo-body-s mo-card__text">{o.summary}</div>
                <div className="mo-card__meta mo-prose">
                  <RichText data={o.content} />
                  {o.icecoldresOfferId ? (
                    <BookLink engine={engine} locale={ctx.locale} query={{ offer: o.icecoldresOfferId }} className="mo-btn mo-btn--obrys mo-btn--maly">
                      {ctx.t.booking.book}
                    </BookLink>
                  ) : null}
                </div>
              </article>
            ))}
        </div>
        {!promotions.length && !offers.length ? <Placeholder label={ctx.t.offers.empty} /> : null}
      </section>
    </CmsPage>
  )
}
