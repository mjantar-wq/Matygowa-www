import type { Metadata } from 'next'
import { CmsPage, getPage } from '@/components/CmsPage'
import { buildMetadata, pageContext, type LocaleParams } from '@/lib/page'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const ctx = await pageContext(params)
  const page = await getPage('rituals', ctx)
  return buildMetadata(ctx.locale, 'rituals', { title: page?.title ?? ctx.t.nav.rituals, description: page?.intro, seo: page?.seo })
}

export default async function RitualsPage({ params }: LocaleParams) {
  return <CmsPage route="rituals" ctx={await pageContext(params)} />
}
