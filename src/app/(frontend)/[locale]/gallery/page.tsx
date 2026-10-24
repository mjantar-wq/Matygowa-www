import type { Metadata } from 'next'
import { CmsPage, getPage } from '@/components/CmsPage'
import { buildMetadata, pageContext, type LocaleParams } from '@/lib/page'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const ctx = await pageContext(params)
  const page = await getPage('gallery', ctx)
  return buildMetadata(ctx.locale, 'gallery', { title: page?.title ?? ctx.t.nav.gallery, description: page?.intro, seo: page?.seo })
}

export default async function GalleryPage({ params }: LocaleParams) {
  return <CmsPage route="gallery" ctx={await pageContext(params)} />
}
