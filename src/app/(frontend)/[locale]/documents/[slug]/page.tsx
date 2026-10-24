import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CmsPage, getPage } from '@/components/CmsPage'
import { buildMetadata, pageContext, type SlugParams } from '@/lib/page'

export async function generateMetadata({ params }: SlugParams): Promise<Metadata> {
  const ctx = await pageContext(params)
  const { slug } = await params
  const page = await getPage(slug, ctx)
  return buildMetadata(ctx.locale, 'documents', { slug, title: page?.title, seo: page?.seo })
}

/** Regulamin, polityka prywatności, cookies (wspólne z silnikiem IceColdRes). */
export default async function DocumentPage({ params }: SlugParams) {
  const { slug } = await params
  const ctx = await pageContext(params)
  // strony menu (home, rituals…) nie mogą mieć drugiego adresu pod /dokumenty/
  if ((await getPage(slug, ctx))?.kind !== 'document') notFound()
  return <CmsPage route="documents" slug={slug} ctx={ctx} />
}
