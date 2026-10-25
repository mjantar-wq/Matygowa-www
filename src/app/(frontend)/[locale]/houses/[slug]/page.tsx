import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { BookingBar } from '@/components/BookingBar'
import { engineSettings } from '@/lib/booking'
import { Media } from '@/components/Media'
import { PeaksPanorama } from '@/components/PeaksPanorama'
import { PhotoGallery } from '@/components/PhotoGallery'
import { Placeholder } from '@/components/Placeholder'
import { RichText } from '@/components/RichText'
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
  const type = property?.unitTypes.find((u) => u.code === code)
  const amenities = type ? (ctx.locale === 'pl' ? type.amenities : type.amenitiesEn) : []
  const promos = promotions.filter((p) => !p.unitTypeIds || (type && p.unitTypeIds.includes(type.id)))
  const facts = [
    unit.area ? `${unit.area} m²` : null,
    unit.bedrooms ? `${unit.bedrooms} ${ctx.locale === 'pl' ? 'sypialnie' : 'bedrooms'}` : null,
    unit.maxGuests ? t.house.guests(type?.maxOccupancy ?? unit.maxGuests) : null,
  ].filter(Boolean)

  return (
    <article>
      <section className="mo-hero">
        <div className="mo-hero__media"><Media media={unit.hero} priority /></div>
        <div className="mo-container mo-hero__content">
          <p className="mo-label" style={{ color: 'inherit' }}>
            {t.house.kind[unit.kind]}
            {unit.status === 'comingSoon' ? ` · ${t.house.comingSoon}` : ''}
          </p>
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
        {unit.gallery?.length ? <PhotoGallery media={unit.gallery} ctx={ctx} /> : <Placeholder label={t.placeholder} />}
        {unit.plans?.length ? (
          <>
            <h3 className="mo-h3">{t.house.plan}</h3>
            {unit.plans.map((m) => (typeof m === 'object' ? <Media key={m.id} media={m} /> : null))}
          </>
        ) : null}
      </section>

      {amenities.length ? (
        <section className="mo-section mo-container">
          <h2 className="mo-h2">{t.house.amenities}</h2>
          <ul style={{ columns: '16rem', marginBlockStart: 'var(--space-5)' }}>{amenities.map((a) => <li key={a}>{a}</li>)}</ul>
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
        <PeaksPanorama units={all.filter((u) => u.id !== unit.id)} ctx={ctx} />
      </section>
    </article>
  )
}
