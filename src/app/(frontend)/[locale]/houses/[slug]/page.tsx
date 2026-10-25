import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BookingBar } from '@/components/BookingBar'
import { engineSettings } from '@/lib/booking'
import { Media } from '@/components/Media'
import Link from 'next/link'
import { Placeholder } from '@/components/Placeholder'
import { RichText } from '@/components/RichText'
import { href } from '@/i18n/routes'
import { findBySlug, findMany } from '@/lib/cms'
import { getProperty, getPromotions } from '@/lib/icecoldres'
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
  const [all, property, promotions] = await Promise.all([findMany<Unit>('units', ctx.locale, { sort: 'order' }), getProperty(), getPromotions()])
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
        <div className="mo-hero__media"><Media media={unit.hero} priority /></div>
        <div className="mo-container mo-hero__content">
          {unit.status === 'comingSoon' ? <p className="mo-label" style={{ color: 'inherit' }}>{t.house.comingSoon}</p> : null}
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
        <h2 className="mo-h2">{t.house.peak}: {unit.name}</h2>
        <RichText data={unit.peak?.story} />
        {!unit.peak?.story ? <Placeholder label={t.placeholder} note="Historia szczytu" /> : null}
      </section>

      <section className="mo-section mo-container">
        <h2 className="mo-h2">{t.house.gallery}</h2>
        <div className="mo-cards">
          {unit.gallery?.length ? unit.gallery.map((m) => (typeof m === 'object' ? <Media key={m.id} media={m} /> : null)) : <Placeholder label={t.placeholder} />}
        </div>
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

      {amenities.length ? (
        <section className="mo-section mo-container">
          <h2 className="mo-h2">{t.house.amenities}</h2>
          <ul className="mo-lista">{amenities.map((a) => <li key={a}>{a}</li>)}</ul>
        </section>
      ) : null}

      {unit.status === 'bookable' ? (
        <section className="mo-section mo-container">
          <h2 className="mo-h2">{t.house.availability}</h2>
          {promos.map((p) => (
            <p key={p.id} className="mo-label" style={{ color: 'var(--color-bursztyn-tekst)' }}>
              {ctx.locale === 'pl' ? p.badge : p.en.badge || p.badge}
            </p>
          ))}
          <BookingBar locale={ctx.locale} t={t.booking} engine={engineSettings(ctx.settings)} unit={code} slogan={ctx.settings?.priceSlogan} />
        </section>
      ) : null}

      <section className="mo-section mo-container">
        <h2 className="mo-h2">{t.house.others}</h2>
        <div className="mo-cards">
          {/* wszystkie pozostałe tego samego rodzaju (domy: 5), dopełnione drugim rodzajem do 4 kart */}
          {others
            .filter((u) => u.kind === unit.kind)
            .concat(others.filter((u) => u.kind !== unit.kind))
            .slice(0, Math.max(others.filter((u) => u.kind === unit.kind).length, 4))
            .map((u) => (
              <Link key={u.id} href={href(ctx.locale, 'houses', u.slug)} className="mo-card">
                <div className="mo-card__media"><Media media={u.hero} /></div>
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
