import type { Metadata } from 'next'
import { CmsPage, getPage } from '@/components/CmsPage'
import { Media } from '@/components/Media'
import { Placeholder } from '@/components/Placeholder'
import { RichText } from '@/components/RichText'
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
  return (
    <CmsPage route="offers" ctx={ctx}>
      <section className="mo-section mo-container">
        <p className="mo-eyebrow" style={{ marginBlockEnd: 'var(--space-5)' }}>{ctx.settings?.priceSlogan || ctx.t.booking.lowestPrice}</p>
        <div className="mo-cards">
          {promotions.map((p) => {
            const extra = offers.find((o) => o.icecoldresPromotionId === p.id)
            return (
              <article key={p.id} className="mo-card">
                <div className="mo-card__media"><Media media={extra?.image} /></div>
                <p className="mo-eyebrow">{ctx.t.offers.onlyHere}</p>
                <h2 className="mo-h3">{pl ? p.badge : p.en.badge || p.badge}</h2>
                <p>{pl ? p.description : p.en.description || p.description}</p>
              </article>
            )
          })}
          {offers
            .filter((o) => !o.icecoldresPromotionId || !promotions.some((p) => p.id === o.icecoldresPromotionId))
            .map((o) => (
              <article key={o.id} className="mo-card">
                <div className="mo-card__media"><Media media={o.image} /></div>
                <h2 className="mo-h3">{o.title}</h2>
                <p>{o.summary}</p>
                <RichText data={o.content} />
              </article>
            ))}
        </div>
        {!promotions.length && !offers.length ? <Placeholder label={ctx.t.offers.empty} /> : null}
      </section>
    </CmsPage>
  )
}
