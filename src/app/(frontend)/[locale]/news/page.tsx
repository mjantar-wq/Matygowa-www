import type { Metadata } from 'next'
import Link from 'next/link'
import { CmsPage, getPage } from '@/components/CmsPage'
import { Media } from '@/components/Media'
import { Placeholder } from '@/components/Placeholder'
import { LOCALES } from '@/i18n/locales'
import { href } from '@/i18n/routes'
import { findMany } from '@/lib/cms'
import { buildMetadata, pageContext, type LocaleParams } from '@/lib/page'
import type { News } from '@/payload-types'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const ctx = await pageContext(params)
  const page = await getPage('news', ctx)
  return buildMetadata(ctx.locale, 'news', { title: page?.title ?? ctx.t.nav.news, description: page?.intro, seo: page?.seo })
}

export default async function NewsPage({ params }: LocaleParams) {
  const ctx = await pageContext(params)
  const posts = await findMany<News>('news', ctx.locale, { sort: '-publishedAt', limit: 50 })
  const date = new Intl.DateTimeFormat(LOCALES[ctx.locale].intl, { dateStyle: 'long' })
  return (
    <CmsPage route="news" ctx={ctx}>
      <section className="mo-section mo-container">
        <div className="mo-cards">
          {posts.map((n) => (
            <Link key={n.id} href={href(ctx.locale, 'news', n.slug)} className="mo-card">
              <div className="mo-card__media"><Media media={n.cover} /></div>
              <p className="mo-card__meta"><time dateTime={n.publishedAt}>{date.format(new Date(n.publishedAt))}</time></p>
              <h2 className="mo-h3">{n.title}</h2>
              <p>{n.excerpt}</p>
            </Link>
          ))}
        </div>
        {!posts.length ? <Placeholder label={ctx.t.news.empty} /> : null}
      </section>
    </CmsPage>
  )
}
