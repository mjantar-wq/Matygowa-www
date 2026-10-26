import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BookingBar } from '@/components/BookingBar'
import { engineSettings } from '@/lib/booking'
import { Media } from '@/components/Media'
import { PeaksPanorama } from '@/components/PeaksPanorama'
import { PhotoGallery } from '@/components/PhotoGallery'
import Link from 'next/link'
import { Placeholder } from '@/components/Placeholder'
import { RichText } from '@/components/RichText'
import { href } from '@/i18n/routes'
import { findBySlug, findMany, UNIT_ORDER } from '@/lib/cms'
import { getProperty, getPromotions, promoSeason } from '@/lib/icecoldres'
import { peakName, peakViewAlt } from '@/lib/peak'
import { buildMetadata, pageContext, type SlugParams } from '@/lib/page'
import type { Unit } from '@/payload-types'

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const ctx = await pageContext(params)
  const { slug } = await params
  const unit = await findBySlug<Unit>('units', slug, ctx.locale)
  return buildMetadata(ctx.locale, 'houses', { slug, title: unit?.name, description: unit?.tagline, seo: unit?.seo })
}

/** Strona domu albo apartamentu (koncepcja: Strona domu albo apartamentu). */
export default async function UnitPage({ params }: SlugParams) {
  const ctx = await pageContext(params)
  const { slug } = await params
  const unit = await findBySlug<Unit>('units', slug, ctx.locale)
  if (!unit) notFound()
  const t = ctx.t
  const code = unit.icecoldresCode || unit.slug
  const [all, property, promotions] = await Promise.all([findMany<Unit>('units', ctx.locale, { sort: UNIT_ORDER }), getProperty(), getPromotions()])
  const others = all.filter((u) => u.id !== unit.id)
  const type = property?.unitTypes.find((u) => u.code === code)
  const amenities = type ? (ctx.locale === 'pl' ? type.amenities : type.amenitiesEn) : []
  const promos = promotions.filter((p) => !p.unitTypeIds || (type && p.unitTypeIds.includes(type.id)))
  const facts = [
    unit.area ? `${unit.area} m²` : null,
    unit.bedrooms ? `${unit.bedrooms} ${ctx.locale === 'pl' ? 'sypialnie' : 'bedrooms'}` : null,
    unit.bathrooms ? `${unit.bathrooms} ${ctx.locale === 'pl' ? (unit.bathrooms > 4 ? 'łazienek' : 'łazienki') : 'bathrooms'}${unit.separateWc ? ' + WC' : ''}` : null,
    unit.livingRoom ? (ctx.locale === 'pl' ? (unit.livingRoom === 'upper' ? 'salon na piętrze' : 'salon na parterze') : unit.livingRoom === 'upper' ? 'living room upstairs' : 'living room on the ground floor') : null,
    unit.maxGuests ? t.house.guests(unit.maxGuests) : null,
  ].filter(Boolean)

  return (
    <article>
      <section className="mo-hero">
        <div className="mo-hero__media"><Media media={unit.hero} priority alt={peakViewAlt(unit, ctx.locale)} /></div>
        <div className="mo-container mo-hero__content">
          {unit.status === 'comingSoon' ? <p className="mo-budowa">{t.house.comingSoon}</p> : null}
          <h1 className="mo-display-xl">{unit.name}</h1>
          {unit.peak?.elevation ? <p className="mo-lede">{t.house.elevation(unit.peak.elevation)}{unit.peak.range ? ` · ${unit.peak.range}` : ''}</p> : null}
        </div>
      </section>

      <section className="mo-section mo-container">
        {facts.length ? <p className="mo-label">{facts.join(' · ')}</p> : null}
        {unit.tagline ? <p className="mo-lede" style={{ marginBlock: 'var(--space-5)' }}>{unit.tagline}</p> : null}
        <RichText data={unit.story} />
        {!unit.story ? <Placeholder label={t.placeholder} note="Opowieść o domu" /> : null}
      </section>

      <section className="mo-section mo-container">
        <h2 className="mo-h2">{t.house.peak}: {peakName(unit, 'nom', ctx.locale) || unit.name}</h2>
        <RichText data={unit.peak?.story} />
        {!unit.peak?.story ? <Placeholder label={t.placeholder} note="Historia szczytu" /> : null}
      </section>

      {/* apartamenty w budowie: bez galerii i rzutów (decyzja Michała) */}
      {unit.status !== 'comingSoon' ? (<>
      <section className="mo-section mo-container">
        <h2 className="mo-h2">{t.house.gallery}</h2>
        {unit.gallery?.length ? <PhotoGallery media={unit.gallery} ctx={ctx} /> : <Placeholder label={t.placeholder} />}
      </section>

      <section className="mo-section mo-container">
        <h2 className="mo-h2">{t.house.plan}</h2>
        <div style={{ display: 'grid', gap: 'var(--rynna)', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', marginBlockStart: 'var(--space-6)' }}>
          {unit.plans?.length
            ? unit.plans.map((m) => (typeof m === 'object' ? <Media key={m.id} media={m} /> : null))
            : planIllustrations(unit).map((src) => (
                // eslint-disable-next-line @next/next/no-img-element -- rzuty G3 (SVG) z public/
                <img key={src} src={src} alt={`${t.house.plan}: ${unit.name}`} loading="lazy" style={{ inlineSize: '100%', blockSize: 'auto' }} />
              ))}
        </div>
      </section>
      </>) : null}

      {amenities.length ? (
        <section className="mo-section mo-container">
          <h2 className="mo-h2">{t.house.amenities}</h2>
          <ul className="mo-lista">{amenities.map((a) => <li key={a}><span>{a}</span></li>)}</ul>
        </section>
      ) : null}

      {unit.status === 'bookable' ? (
        <section className="mo-section mo-container">
          <h2 className="mo-h2">{t.house.availability}</h2>
          {promos.map((p) => (
            <p key={p.id} className="mo-label" style={{ color: 'var(--color-bursztyn-tekst)' }} data-sezon-promo={promoSeason(p.season)}>
              {ctx.locale === 'pl' ? p.badge : p.en.badge || p.badge}
            </p>
          ))}
          <BookingBar locale={ctx.locale} t={t.booking} fx={t.effects} engine={engineSettings(ctx.settings)} unit={code} slogan={ctx.settings?.priceSlogan} />
        </section>
      ) : null}

      <section className="mo-section mo-container">
        <h2 className="mo-h2">{t.house.others}</h2>
        <div className="mo-cards">
          {/* wszystkie pozostałe: najpierw domy, potem apartamenty */}
          {others
            .filter((u) => u.kind === 'house')
            .concat(others.filter((u) => u.kind !== 'house'))
            .map((u) => (
              <Link key={u.id} href={href(ctx.locale, 'houses', u.slug)} className="mo-card">
                <div className="mo-card__media"><Media media={u.hero} alt={peakViewAlt(u, ctx.locale)} /></div>
                <h3 className="mo-h3">{u.name}</h3>
                <p className="mo-card__meta">
                  {t.house.kind[u.kind]}
                  {u.peak?.elevation ? ` · ${t.house.elevation(u.peak.elevation)}` : ''}
                  {u.status === 'comingSoon' ? ` · ${t.house.comingSoon}` : ''}
                </p>
              </Link>
            ))}
        </div>
      </section>
    </article>
  )
}

/** Rzuty G3 z wątku wizualnego (parter i piętro), dopóki w panelu nie ma własnych planów domu. */
function planIllustrations(unit: Unit): string[] {
  const variant = unit.kind === 'apartment' ? 'apartament' : unit.livingRoom === 'upper' ? 'salon-pietro' : 'salon-parter'
  return ['parter', 'pietro'].map((floor) => `/ilustracje/G3_rzut_${variant}_${floor}.svg`)
}
