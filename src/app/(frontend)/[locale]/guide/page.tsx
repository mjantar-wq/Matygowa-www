import type { Metadata } from 'next'
import { CmsPage, getPage } from '@/components/CmsPage'
import { buildMetadata, pageContext, type LocaleParams } from '@/lib/page'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const ctx = await pageContext(params)
  const page = await getPage('guide', ctx)
  return buildMetadata(ctx.locale, 'guide', { title: page?.title ?? ctx.t.nav.guide, description: page?.intro, seo: page?.seo })
}

export default async function GuidePage({ params }: LocaleParams) {
  return <CmsPage route="guide" ctx={await pageContext(params)} />
}
