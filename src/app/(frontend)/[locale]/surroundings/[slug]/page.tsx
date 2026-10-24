import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { findBySlug } from '@/lib/cms'
import { buildMetadata, pageContext, type SlugParams } from '@/lib/page'
import type { Attraction } from '@/payload-types'

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const ctx = await pageContext(params)
  const { slug } = await params
  const a = await findBySlug<Attraction>('attractions', slug, ctx.locale)
  return buildMetadata(ctx.locale, 'surroundings', { slug, title: a?.name, description: a?.summary, seo: a?.seo })
}

export default async function AttractionPage({ params }: SlugParams) {
  const ctx = await pageContext(params)
  const { slug } = await params
  const a = await findBySlug<Attraction>('attractions', slug, ctx.locale)
  if (!a) notFound()
  return (
    <article className="mo-section mo-container" style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <p className="mo-label">{ctx.t.nav.surroundings}{a.distanceKm != null ? ` · ${ctx.t.attractions.distance(a.distanceKm)}` : ''}</p>
      <h1 className="mo-h1">{a.name}</h1>
      <Media media={a.image} priority />
      <RichText data={a.description} />
      {a.url ? <p><a href={a.url} rel="noopener">{a.url}</a></p> : null}
    </article>
  )
}
