import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AttractionEntry } from '@/components/Attraction'
import { href } from '@/i18n/routes'
import { findBySlug } from '@/lib/cms'
import { buildMetadata, pageContext, type SlugParams } from '@/lib/page'
import type { Attraction } from '@/payload-types'

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const ctx = await pageContext(params)
  const { slug } = await params
  const a = await findBySlug<Attraction>('attractions', slug, ctx.locale)
  return buildMetadata(ctx.locale, 'surroundings', { slug, title: a?.name, description: a?.summary, seo: a?.seo, image: a?.image })
}

export default async function AttractionPage({ params }: SlugParams) {
  const ctx = await pageContext(params)
  const { slug } = await params
  const a = await findBySlug<Attraction>('attractions', slug, ctx.locale)
  if (!a) notFound()
  return (
    <div className="mo-section mo-container mo-atrakcje">
      <p className="mo-label">
        <Link href={href(ctx.locale, 'surroundings')}>{ctx.t.nav.surroundings}</Link>
      </p>
      <AttractionEntry a={a} ctx={ctx} heading="h1" />
    </div>
  )
}
