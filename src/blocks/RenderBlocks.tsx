import { Fragment } from 'react'
import Link from 'next/link'
import { BookingBar } from '@/components/BookingBar'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { PeaksPanorama, peakSvgId } from '@/components/PeaksPanorama'
import { SettlementMap } from '@/components/SettlementMap'
import { PhotoGallery } from '@/components/PhotoGallery'
import { HeroStage } from '@/components/effects/HeroStage'
import { ScrollSteps } from '@/components/effects/ScrollSteps'
import { heroSlides, sceneId } from '@/lib/scenes'
import { href } from '@/i18n/routes'
import { findMany } from '@/lib/cms'
import { engineSettings, formatPrice } from '@/lib/booking'
import { getPromotions, getServices } from '@/lib/icecoldres'
import type { PageContext } from '@/lib/page'
import type { Attraction, News, Offer, Page, Testimonial, Unit } from '@/payload-types'

type Block = NonNullable<Page['layout']>[number]
type Of<T extends Block['blockType']> = Extract<Block, { blockType: T }>
type Props<T extends Block['blockType']> = { block: Of<T>; ctx: PageContext; immersive?: boolean }

function Heading({ eyebrow, heading, level = 2 }: { eyebrow?: string | null; heading?: string | null; level?: 1 | 2 }) {
  const H = level === 1 ? 'h1' : 'h2'
  return (
    <header style={{ display: 'grid', gap: 'var(--space-3)', marginBlockEnd: 'var(--space-6)' }}>
      {eyebrow ? <p className="mo-label">{eyebrow}</p> : null}
      {heading ? <H className={level === 1 ? 'mo-h1' : 'mo-h2'}>{heading}</H> : null}
    </header>
  )
}

function Section({ block, children, className = '', scene = true }: { block: { id?: string | null; anchor?: string | null; blockType: string }; children: React.ReactNode; className?: string; scene?: boolean }) {
  return (
    <section id={block.anchor || undefined} data-block={block.blockType} data-scene={scene ? sceneId(block.id) : undefined} className={`mo-section ${className}`}>
      <div className="mo-container">{children}</div>
    </section>
  )
}

function Hero({ block, ctx, immersive }: Props<'hero'>) {
  const words = (block.headline ?? '').split(' ')
  return (
    <section className="mo-hero" data-block="hero" data-scene={sceneId(block.id)} id={block.anchor || undefined}>
      {immersive ? null : (
        <div className="mo-hero__media">
          <HeroStage slides={heroSlides(block)} t={ctx.t.effects} />
        </div>
      )}
      <div className="mo-container mo-hero__content">
        <h1 className="mo-display-xl mo-hero__title">
          <span className="mo-sr">{block.headline}</span>
          {words.map((w, i) => (
            <Fragment key={i}>
              <span aria-hidden="true" style={{ '--i': i } as React.CSSProperties}>
                {w}
              </span>{' '}
            </Fragment>
          ))}
        </h1>
        {block.subline ? <p className="mo-lede mo-hero__lede">{block.subline}</p> : null}
        {block.showBookingBar !== false ? (
          <div className="mo-hero__booking">
            <BookingBar locale={ctx.locale} t={ctx.t.booking} engine={engineSettings(ctx.settings)} slogan={ctx.settings?.priceSlogan} />
          </div>
        ) : null}
      </div>
    </section>
  )
}

function Intro({ block }: Props<'intro'>) {
  return (
    <Section block={block} scene={false}>
      <Heading eyebrow={block.eyebrow} heading={block.heading} />
      <RichText data={block.body} />
      {block.stats?.length ? (
        <dl className="mo-stats">
          {block.stats.map((s) => (
            <div key={s.id}>
              <dt className="mo-label">{s.label}</dt>
              <dd className="mo-price">{s.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </Section>
  )
}

async function Panorama({ block, ctx, immersive }: Props<'peaksPanorama'>) {
  const units = await findMany<Unit>('units', ctx.locale, { sort: 'order' })
  return (
    <Section block={block}>
      <Heading eyebrow={block.eyebrow} heading={block.heading} />
      <RichText data={block.body} />
      {immersive ? <PeakCards units={units} ctx={ctx} /> : <PeaksPanorama units={units} image={block.image} ctx={ctx} />}
      {block.showMap ? block.map ? <Media media={block.map} /> : <SettlementMap units={units} ctx={ctx} /> : null}
    </Section>
  )
}

function Day({ block, ctx }: Props<'dayInSettlement'>) {
  return (
    <Section block={block}>
      <Heading eyebrow={block.eyebrow} heading={block.heading} />
      <ol style={{ display: 'grid', gap: 'var(--space-8)', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))' }}>
        {block.scenes?.map((s, i) => (
          <li key={s.id} data-pora={s.time} data-scene={sceneId(block.id, i)} data-step style={{ display: 'grid', gap: 'var(--space-4)', alignContent: 'start' }}>
            <div className="mo-card__media" style={{ aspectRatio: 'var(--proporcja-kadr)' }}><Media media={s.image} fallback={`${ctx.t.placeholder}: ${s.time}`} /></div>
            <h3 className="mo-h3">{s.title}</h3>
            <p className="mo-prose" data-tylko={s.summerText ? 'zima' : undefined}>{s.text}</p>
            {s.summerText ? <p className="mo-prose" data-tylko="lato">{s.summerText}</p> : null}
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
      <div className="mo-cards">
        {block.rooms?.map((r, i) => (
          <article key={r.id} className="mo-card" data-scene={sceneId(block.id, i)} data-step>
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
      {block.steps?.length ? (
        <ScrollSteps
          label={block.heading ?? undefined}
          media={block.steps.map((st) => <Media key={st.id} media={st.image} fallback={st.word ?? undefined} />)}
          steps={block.steps.map((st, i) => (
            <div key={st.id} data-scene={sceneId(block.id, i)}>
              <h3 className="mo-h3 mo-steps__word">{st.word}</h3>
              <p className="mo-prose">{st.text}</p>
            </div>
          ))}
        />
      ) : null}
      {services.length ? (
        <ul>
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
      <div className="mo-cards" style={FIT}>
        {(['winter', 'summer'] as const).map((key) => (
          <article key={key} className="mo-card mo-season" data-sezon={key === 'winter' ? 'zima' : 'lato'}>
            <div className="mo-card__media"><Media media={block[key]?.image} fallback={ctx.t.attractions[key]} /></div>
            <h3 className="mo-h3">{block[key]?.title || ctx.t.attractions[key]}</h3>
            <p>{block[key]?.text}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}

async function Surroundings({ block, ctx, immersive }: Props<'surroundings'>) {
  const attractions = await findMany<Attraction>('attractions', ctx.locale, { where: { featured: { equals: true } }, limit: block.limit ?? 6 })
  return (
    <Section block={block}>
      <Heading eyebrow={block.eyebrow} heading={block.heading} />
      <RichText data={block.body} />
      {immersive ? null : block.map ? (
        <Media media={block.map} />
      ) : (
        // ilustracja G7 z wątku wizualnego, dopóki redakcja nie wgra własnej mapy
        // eslint-disable-next-line @next/next/no-img-element -- SVG z public/
        <img src="/ilustracje/G7_mapa_okolicy.svg" alt={ctx.locale === 'pl' ? 'Mapa okolicy Matygowej Osady' : 'Map of the area around Matygowa Osada'} loading="lazy" style={{ inlineSize: '100%', blockSize: 'auto' }} />
      )}
      <div className="mo-cards">
        {attractions.map((a) => (
          <Link key={a.id} href={href(ctx.locale, 'surroundings', a.slug)} className="mo-card" data-scene-focus={`a-${a.slug}`} data-step>
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
  const [promotions, news, offers] = await Promise.all([
    getPromotions(),
    findMany<News>('news', ctx.locale, { limit: 1, sort: '-publishedAt' }),
    findMany<Offer>('offers', ctx.locale, { sort: 'order' }),
  ])
  return (
    <Section block={block}>
      <Heading eyebrow={block.eyebrow} heading={block.heading} />
      <div className="mo-cards" style={FIT}>
        {promotions.map((p) => (
          <article key={p.id} className="mo-card">
            {/* zdjęcie z oferty w panelu połączonej z promocją, inaczej z pierwszej oferty */}
            <div className="mo-card__media"><Media media={(offers.find((o) => o.icecoldresPromotionId === String(p.id)) ?? offers[0])?.image} /></div>
            <p className="mo-label">{ctx.t.offers.onlyHere}</p>
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
      <p>
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

function Gallery({ block, ctx }: Props<'gallery'>) {
  return (
    <Section block={block}>
      <Heading eyebrow={block.eyebrow} heading={block.heading} />
      <PhotoGallery media={block.images} ctx={ctx} />
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

function Hosts({ block }: Props<'hosts'>) {
  const people = (block.people ?? []).filter((p) => p.name)
  if (!people.length) return null
  return (
    <Section block={block}>
      <Heading eyebrow={block.eyebrow} heading={block.heading} />
      {block.intro ? <p className="mo-lede">{block.intro}</p> : null}
      <div className="mo-cards">
        {people.map((p) => (
          <figure key={p.id} className="mo-card">
            {p.photo ? <Media media={p.photo} /> : null}
            <figcaption>
              <h3 className="mo-h3">{p.name}</h3>
              {p.role ? <p className="mo-card__meta">{p.role}</p> : null}
              {p.text ? <p className="mo-prose">{p.text}</p> : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}

/** Siatka kart, w której 2–3 karty wypełniają cały rząd zamiast zostawiać puste kolumny. */
const FIT: React.CSSProperties = { gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }

/** Rozdział „Dziesięć szczytów” na stałym tle: przy każdej karcie panorama przesuwa się do szczytu domku. */
function PeakCards({ units, ctx }: { units: Unit[]; ctx: PageContext }) {
  return (
    <ol className="mo-peak-cards">
      {units.map((u) => (
        <li key={u.id} data-scene-focus={peakSvgId(u)} data-step>
          <Link href={href(ctx.locale, 'houses', u.slug)} className="mo-card mo-peak-card">
            <div className="mo-card__media"><Media media={u.hero} /></div>
            <p className="mo-label">{[u.peak?.range, u.peak?.elevation ? ctx.t.house.elevation(u.peak.elevation) : null].filter(Boolean).join(' · ')}</p>
            <h3 className="mo-h3">{u.name}</h3>
            {u.status === 'comingSoon' ? <p className="mo-badge">{ctx.t.effects.opening}</p> : u.tagline ? <p>{u.tagline}</p> : null}
          </Link>
        </li>
      ))}
    </ol>
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
  hosts: Hosts,
}

/** `immersive`: strona główna na stałym tle (SceneStage); rozdziały nie pokazują wtedy własnych teł. */
export function RenderBlocks({ blocks, ctx, immersive }: { blocks: Page['layout']; ctx: PageContext; immersive?: boolean }) {
  return blocks?.map((block) => {
    const Render = RENDERERS[block.blockType] as (p: { block: Block; ctx: PageContext; immersive?: boolean }) => React.ReactNode
    return <Render key={block.id} block={block} ctx={ctx} immersive={immersive} />
  })
}

