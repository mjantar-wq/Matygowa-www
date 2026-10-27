import type { Metadata } from 'next'
import { CmsPage, getPage } from '@/components/CmsPage'
import { AttractionPopup as OfferPopup } from '@/components/effects/AttractionPopup'
import { Media } from '@/components/Media'
import { Placeholder } from '@/components/Placeholder'
import { Markdown } from '@/components/Markdown'
import type { Locale } from '@/i18n/locales'
import { bookingUrl, engineSettings, formatPrice } from '@/lib/booking'
import { promoSeason } from '@/lib/icecoldres'
import { buildMetadata, pageContext, type LocaleParams, type PageContext } from '@/lib/page'
import { getPromoCards, promoText, type PromoCard } from '@/lib/promo-cards'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const ctx = await pageContext(params)
  const page = await getPage('offers', ctx)
  return buildMetadata(ctx.locale, 'offers', { title: page?.title ?? ctx.t.nav.offers, description: page?.intro, seo: page?.seo })
}

const fmtDate = (d: string, locale: Locale) =>
  new Intl.DateTimeFormat(locale === 'pl' ? 'pl-PL' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${d}T00:00:00Z`))
const weekdays = (days: number[], locale: Locale) =>
  days.map((d) => new Intl.DateTimeFormat(locale === 'pl' ? 'pl-PL' : 'en-GB', { weekday: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(2024, 0, 7 + d)))).join(', ')

/** Okres, warunki rabatu, płatność i rezygnacja z IceColdRes (Michał, 26.10.2026). */
function OfferTerms({ card, ctx }: { card: PromoCard; ctx: PageContext }) {
  const { promotion: p, offer } = card
  const t = ctx.t.offers
  const l = ctx.locale
  const d = (x: string) => fmtDate(x, l)
  const period = [
    p.stayFrom && p.stayTo ? t.stay(d(p.stayFrom), d(p.stayTo)) : p.stayFrom ? t.stayFrom(d(p.stayFrom)) : p.stayTo ? t.stayTo(d(p.stayTo)) : null,
    p.bookFrom || p.bookTo ? t.booking(p.bookFrom ? d(p.bookFrom) : '…', p.bookTo ? d(p.bookTo) : '…') : null,
  ]
  const conditions = [
    p.discountBp ? t.discount(p.discountBp / 100, p.fromNight && p.fromNight > 1 ? p.fromNight : null) : null,
    p.amountOff ? t.amountOff(formatPrice(p.amountOff, l)) : null,
    p.freeNights ? t.freeNights(p.freeNights) : null,
    p.minNights ? t.minNights(p.minNights) : null,
    p.minLeadDays ? t.minLead(p.minLeadDays) : null,
    p.maxLeadDays ? t.maxLead(p.maxLeadDays) : null,
    p.arrivalDays?.length ? t.arrivalDays(weekdays(p.arrivalDays, l)) : null,
    p.excludedWeekdays?.length ? t.excludedWeekdays(weekdays(p.excludedWeekdays, l)) : null,
    p.excludedPeriods?.length ? t.excludedPeriods(p.excludedPeriods.map((x) => `${d(x.from)} – ${d(x.to)}`).join(', ')) : null,
  ]
  // warunki z liczb IceColdRes, bez czytania wpisanych tekstów (Michał, 26.10.2026); promocję z ofertą i ustawieniami składa IceColdRes
  const terms = (offer && p.terms?.[offer.id]) || offer?.terms
  const payment = [
    terms?.depositBp ? t.deposit(terms.depositBp / 100) : null,
    terms?.balanceDueDaysBeforeArrival ? t.balance(terms.balanceDueDaysBeforeArrival) : null,
    card.onlinePayments ? t.online : null,
  ]
  const cancellation = terms
    ? [
        terms.freeCancellationDays !== null ? t.freeCancel(terms.freeCancellationDays) : null,
        terms.partialRefund ? t.partialRefund(terms.partialRefund.share / 100, terms.partialRefund.days) : null,
        terms.freeCancellationDays === null && !terms.partialRefund ? t.noRefund : null,
      ]
    : []
  const rows: [string, (string | null)[]][] = [
    [t.period, period],
    [t.conditions, conditions],
    [t.payment, payment],
    [t.cancellation, cancellation],
  ]
  const shown = rows.map(([k, v]) => [k, v.filter((x): x is string => !!x)] as const).filter(([, v]) => v.length)
  if (!shown.length) return null
  return (
    <section className="mo-oferta__warunki" aria-label={t.terms}>
      <h3 className="mo-label">{t.terms}</h3>
      <dl>
        {shown.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>
              {v.length > 1 ? (
                <ul>
                  {v.map((x) => <li key={x}>{x}</li>)}
                </ul>
              ) : (
                v[0]
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/** Oferty to promocje z cennika IceColdRes (Michał, 25.10.2026): tytuł, opisy i daty z IceColdRes, z panelu tylko zdjęcie. */
export default async function OffersPage({ params }: LocaleParams) {
  const ctx = await pageContext(params)
  const cards = await getPromoCards(ctx.locale)
  const engine = engineSettings(ctx.settings)
  return (
    <CmsPage route="offers" ctx={ctx}>
      <section className="mo-section mo-container">
        <p className="mo-label">{ctx.settings?.priceSlogan || ctx.t.booking.lowestPrice}</p>
        <ul className="mo-cards" role="list">
          {cards.map((card) => {
            const { promotion: p, image, offerId } = card
            const x = promoText(p, ctx.locale)
            const book = (
              <a href={bookingUrl(engine, ctx.locale, { offer: offerId || undefined })} data-track="offers" className="mo-btn mo-btn--glowny">
                {ctx.t.booking.book}
              </a>
            )
            return (
              // klik w ofertę otwiera okienko z dłuższym opisem i „Rezerwuj” (Michał, 26.10.2026), jak atrakcje na Okolicy
              <OfferPopup
                key={p.id}
                slug={p.id}
                href={`#${p.id}`}
                label={x.title}
                closeLabel={ctx.t.effects.close}
                className="mo-oferta"
                season={promoSeason(p.season)}
                card={
                  <>
                    <div className="mo-card__media"><Media media={image} /></div>
                    <p className="mo-card__eyebrow">
                      <span className="mo-badge">{x.badge ?? ctx.t.offers.onlyHere}</span>
                    </p>
                    <h2 className="mo-h3 mo-card__title">{x.title}</h2>
                    {x.description ? <p className="mo-body-s mo-card__text">{x.description}</p> : <span />}
                    <p className="mo-card__meta">
                      <span className="mo-label">{ctx.t.booking.details}</span>
                      <span className="mo-card__arrow" aria-hidden="true">→</span>
                    </p>
                  </>
                }
              >
                <article className="mo-atrakcja">
                  {image ? (
                    <figure className="mo-zdjecie mo-atrakcja__zdjecie">
                      <Media media={image} />
                    </figure>
                  ) : null}
                  <div className="mo-atrakcja__tekst">
                    <p className="mo-label">{x.badge ?? ctx.t.offers.onlyHere}</p>
                    <h2 className="mo-h2">{x.title}</h2>
                    {x.description ? <p className="mo-prose">{x.description}</p> : null}
                    {x.story ? <Markdown text={x.story} className="mo-prose" /> : null}
                    <OfferTerms card={card} ctx={ctx} />
                    <p>{book}</p>
                  </div>
                </article>
              </OfferPopup>
            )
          })}
        </ul>
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
