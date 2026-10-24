import Link from 'next/link'
import { BookingBar } from '@/components/BookingBar'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { PeaksPanorama } from '@/components/PeaksPanorama'
import { href } from '@/i18n/routes'
import { findMany } from '@/lib/cms'
import { engineSettings, formatPrice } from '@/lib/booking'
import { getPromotions, getServices } from '@/lib/icecoldres'
import type { PageContext } from '@/lib/page'
import type { Attraction, News, Page, Testimonial, Unit } from '@/payload-types'

type Block = NonNullable<Page['layout']>[number]
type Of<T extends Block['blockType']> = Extract<Block, { blockType: T }>
type Props<T extends Block['blockType']> = { block: Of<T>; ctx: PageContext }

function Heading({ eyebrow, heading, level = 2 }: { eyebrow?: string | null; heading?: string | null; level?: 1 | 2 }) {
  const H = level === 1 ? 'h1' : 'h2'
  return (
    <header style={{ display: 'grid', gap: 'var(--space-3)', marginBlockEnd: 'var(--space-6)' }}>
      {eyebrow ? <p className="mo-eyebrow">{eyebrow}</p> : null}
      {heading ? <H className={level === 1 ? 'mo-h1' : 'mo-h2'}>{heading}</H> : null}
    </header>
  )
}

function Section({ block, children, className = '' }: { block: { anchor?: string | null; blockType: string }; children: React.ReactNode; className?: string }) {
  return (
    <section id={block.anchor || undefined} data-block={block.blockType} className={`mo-section ${className}`}>
      <div className="mo-container">{children}</div>
    </section>
  )
}

function Hero({ block, ctx }: Props<'hero'>) {
  return (
    <section className="mo-hero" data-block="hero" id={block.anchor || undefined}>
      <div className="mo-hero__media">
        <Media media={block.image} priority />
      </div>
      <div className="mo-container mo-hero__content">
        <h1 className="mo-display">{block.headline}</h1>
        {block.subline ? <p className="mo-lede">{block.subline}</p> : null}
        {block.showBookingBar !== false ? <BookingBar locale={ctx.locale} t={ctx.t.booking} engine={engineSettings(ctx.settings)} slogan={ctx.settings?.priceSlogan} /> : null}
      </div>
    </section>
  )
}

function Intro({ block }: Props<'intro'>) {
  return (
    <Section block={block}>
      <Heading eyebrow={block.eyebrow} heading={block.heading} />
      <RichText data={block.body} />
      {block.stats?.length ? (
        <dl style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-7)', marginBlockStart: 'var(--space-7)' }}>
          {block.stats.map((s) => (
            <div key={s.id}>
              <dt className="mo-muted">{s.label}</dt>
              <dd style={{ fontSize: 'var(--text-figure)', fontFamily: 'var(--font-display)' }}>{s.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </Section>
  )
}

async function Panorama({ block, ctx }: Props<'peaksPanorama'>) {
  const units = await findMany<Unit>('units', ctx.locale, { sort: 'order' })
  return (
    <Section block={block}>
      <Heading eyebrow={block.eyebrow} heading={block.heading} />
      <RichText data={block.body} />
      <PeaksPanorama units={units} image={block.image} ctx={ctx} />
      {block.showMap ? <Media media={block.map} fallback={`${ctx.t.placeholder}: mapa osady`} /> : null}
    </Section>
  )
}

function Day({ block, ctx }: Props<'dayInSettlement'>) {
  return (
    <Section block={block}>
      <Heading eyebrow={block.eyebrow} heading={block.heading} />
      <ol style={{ display: 'grid', gap: 'var(--space-8)' }}>
        {block.scenes?.map((s) => (
          <li key={s.id} data-pora={s.time} style={{ display: 'grid', gap: 'var(--space-4)' }}>
            <Media media={s.image} fallback={`${ctx.t.placeholder}: ${s.time}`} />
            <h3 className="mo-h3">{s.title}</h3>
            <p className="mo-prose">{s.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function HouseInside({ block, ctx }: Props<'houseInside'>) {
  return (
    <Section block={block}>
      <Heading eyebrow={block.eyebrow} heading={block.heading} />
      <RichText data={block.body} />
      <div className="mo-cards" style={{ marginBlockStart: 'var(--space-6)' }}>
        {block.rooms?.map((r) => (
          <article key={r.id} className="mo-card">
            <div className="mo-card__media"><Media media={r.image} /></div>
            <h3 className="mo-h3">{r.title}</h3>
            <p>{r.text}</p>
          </article>
        ))}
      </div>
      {block.plan ? <Media media={block.plan} /> : null}
      {!block.rooms?.length ? <p className="mo-muted">{ctx.t.placeholder}</p> : null}
    </Section>
  )
}

async function Rituals({ block, ctx }: Props<'rituals'>) {
  const services = block.showPrices ? await getServices() : []
  return (
    <Section block={block}>
      <Heading eyebrow={block.eyebrow} heading={block.heading} />
      <RichText data={block.body} />
      <ol className="mo-cards" style={{ marginBlockStart: 'var(--space-6)' }}>
        {block.steps?.map((s) => (
          <li key={s.id} className="mo-card">
            <div className="mo-card__media"><Media media={s.image} /></div>
            <h3 className="mo-h3">{s.word}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>
      {services.length ? (
        <ul style={{ marginBlockStart: 'var(--space-6)' }}>
          {services.map((s) => (
            <li key={s.id}>
              {ctx.locale === 'pl' ? s.name : s.en.name || s.name}: {formatPrice(s.price, ctx.locale)}
            </li>
          ))}
        </ul>
      ) : null}
    </Section>
  )
}

function Seasons({ block, ctx }: Props<'seasons'>) {
  return (
    <Section block={block}>
      <Heading eyebrow={block.eyebrow} heading={block.heading} />
      <div className="mo-cards">
        {(['winter', 'summer'] as const).map((key) => (
          <article key={key} className="mo-card" data-sezon={key === 'winter' ? 'zima' : 'lato'}>
            <div className="mo-card__media"><Media media={block[key]?.image} fallback={ctx.t.attractions[key]} /></div>
            <h3 className="mo-h3">{block[key]?.title || ctx.t.attractions[key]}</h3>
            <p>{block[key]?.text}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}

async function Surroundings({ block, ctx }: Props<'surroundings'>) {
  const attractions = await findMany<Attraction>('attractions', ctx.locale, { where: { featured: { equals: true } }, limit: block.limit ?? 6 })
  return (
    <Section block={block}>
      <Heading eyebrow={block.eyebrow} heading={block.heading} />
      <RichText data={block.body} />
      <Media media={block.map} fallback={`${ctx.t.placeholder}: mapa okolicy`} />
      <div className="mo-cards" style={{ marginBlockStart: 'var(--space-6)' }}>
        {attractions.map((a) => (
          <Link key={a.id} href={href(ctx.locale, 'surroundings', a.slug)} className="mo-card">
            <div className="mo-card__media"><Media media={a.image} /></div>
            <h3 className="mo-h3">{a.name}</h3>
            {a.distanceKm != null ? <p className="mo-card__meta">{ctx.t.attractions.distance(a.distanceKm)}</p> : null}
          </Link>
        ))}
      </div>
    </Section>
  )
}

function Story({ block }: Props<'story'>) {
  const media = <Media media={block.image} />
  return (
    <Section block={block}>
      <div style={{ display: 'grid', gap: 'var(--space-7)', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', alignItems: 'center' }}>
        {block.imagePosition === 'start' ? media : null}
        <div>
          <Heading eyebrow={block.eyebrow} heading={block.heading} />
          <RichText data={block.body} />
        </div>
        {block.imagePosition !== 'start' ? media : null}
      </div>
    </Section>
  )
}

async function Testimonials({ block, ctx }: Props<'testimonials'>) {
  const chosen = (block.items ?? []).filter((x): x is Testimonial => typeof x === 'object')
  const items = chosen.length ? chosen : await findMany<Testimonial>('testimonials', ctx.locale, { limit: 4, sort: '-date' })
  return (
    <Section block={block}>
      <Heading eyebrow={block.eyebrow} heading={block.heading} />
      <div className="mo-cards">
        {items.map((x) => (
          <figure key={x.id} className="mo-card">
            <blockquote className="mo-prose">„{x.quote}”</blockquote>
            <figcaption className="mo-card__meta">
              {x.author}
              {x.source ? ` · ${x.source}` : ''}
              {x.rating ? ` · ${x.rating}` : ''}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}

async function OffersNews({ block, ctx }: Props<'offersNews'>) {
  const [promotions, news] = await Promise.all([getPromotions(), findMany<News>('news', ctx.locale, { limit: 1, sort: '-publishedAt' })])
  return (
    <Section block={block}>
      <Heading eyebrow={block.eyebrow} heading={block.heading} />
      <div className="mo-cards">
        {promotions.map((p) => (
          <article key={p.id} className="mo-card">
            <p className="mo-eyebrow">{ctx.t.offers.onlyHere}</p>
            <h3 className="mo-h3">{ctx.locale === 'pl' ? p.badge : p.en.badge || p.badge}</h3>
            <p>{ctx.locale === 'pl' ? p.description : p.en.description || p.description}</p>
          </article>
        ))}
        {news.map((n) => (
          <Link key={n.id} href={href(ctx.locale, 'news', n.slug)} className="mo-card">
            <div className="mo-card__media"><Media media={n.cover} /></div>
            <h3 className="mo-h3">{n.title}</h3>
            <p>{n.excerpt}</p>
          </Link>
        ))}
      </div>
      <p style={{ marginBlockStart: 'var(--space-5)' }}>
        <Link href={href(ctx.locale, 'offers')}>{ctx.t.nav.offers}</Link> · <Link href={href(ctx.locale, 'news')}>{ctx.t.nav.news}</Link>
      </p>
    </Section>
  )
}

function BookingInvite({ block, ctx }: Props<'bookingInvite'>) {
  return (
    <Section block={block}>
      <Heading eyebrow={block.eyebrow} heading={block.heading} />
      <RichText data={block.body} />
      <BookingBar locale={ctx.locale} t={ctx.t.booking} engine={engineSettings(ctx.settings)} slogan={ctx.settings?.priceSlogan} />
    </Section>
  )
}

function Gallery({ block }: Props<'gallery'>) {
  return (
    <Section block={block}>
      <Heading eyebrow={block.eyebrow} heading={block.heading} />
      <div className="mo-cards">
        {block.images?.map((m) => (typeof m === 'object' ? <Media key={m.id} media={m} /> : null))}
      </div>
    </Section>
  )
}

function Faq({ block }: Props<'faq'>) {
  return (
    <Section block={block}>
      <Heading heading={block.heading} />
      {block.items?.map((i) => (
        <details key={i.id} style={{ borderBlockEnd: '1px solid var(--color-linia)', paddingBlock: 'var(--space-4)' }}>
          <summary className="mo-h3">{i.question}</summary>
          <RichText data={i.answer} />
        </details>
      ))}
    </Section>
  )
}

function Text({ block }: Props<'richText'>) {
  return (
    <Section block={block}>
      <Heading heading={block.heading} />
      <RichText data={block.body} />
    </Section>
  )
}

const RENDERERS: { [K in Block['blockType']]: (p: Props<K>) => React.ReactNode | Promise<React.ReactNode> } = {
  hero: Hero,
  intro: Intro,
  peaksPanorama: Panorama,
  dayInSettlement: Day,
  houseInside: HouseInside,
  rituals: Rituals,
  seasons: Seasons,
  surroundings: Surroundings,
  story: Story,
  testimonials: Testimonials,
  offersNews: OffersNews,
  bookingInvite: BookingInvite,
  gallery: Gallery,
  faq: Faq,
  richText: Text,
}

export function RenderBlocks({ blocks, ctx }: { blocks: Page['layout']; ctx: PageContext }) {
  return blocks?.map((block) => {
    const Render = RENDERERS[block.blockType] as (p: { block: Block; ctx: PageContext }) => React.ReactNode
    return <Render key={block.id} block={block} ctx={ctx} />
  })
}

