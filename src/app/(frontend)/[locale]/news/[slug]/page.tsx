import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Media } from '@/components/Media'
import { RichText } from '@/components/RichText'
import { LOCALES } from '@/i18n/locales'
import { findBySlug } from '@/lib/cms'
import { buildMetadata, pageContext, type SlugParams } from '@/lib/page'
import type { News } from '@/payload-types'

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const ctx = await pageContext(params)
  const { slug } = await params
  const n = await findBySlug<News>('news', slug, ctx.locale)
  return buildMetadata(ctx.locale, 'news', { slug, title: n?.title, description: n?.excerpt, seo: n?.seo })
}

export default async function NewsPostPage({ params }: SlugParams) {
  const ctx = await pageContext(params)
  const { slug } = await params
  const n = await findBySlug<News>('news', slug, ctx.locale)
  if (!n) notFound()
  const date = new Intl.DateTimeFormat(LOCALES[ctx.locale].intl, { dateStyle: 'long' })
  return (
    <article className="mo-section mo-container" style={{ display: 'grid', gap: 'var(--space-5)' }}>
      <p className="mo-label"><time dateTime={n.publishedAt}>{date.format(new Date(n.publishedAt))}</time></p>
      <h1 className="mo-h1">{n.title}</h1>
      {n.excerpt ? <p className="mo-lede">{n.excerpt}</p> : null}
      <Media media={n.cover} priority />
      <RichText data={n.content} />
    </article>
  )
}
