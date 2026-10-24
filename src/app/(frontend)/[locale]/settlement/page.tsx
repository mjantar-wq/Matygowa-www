import type { Metadata } from 'next'
import { CmsPage, getPage } from '@/components/CmsPage'
import { buildMetadata, pageContext, type LocaleParams } from '@/lib/page'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const ctx = await pageContext(params)
  const page = await getPage('settlement', ctx)
  return buildMetadata(ctx.locale, 'settlement', { title: page?.title ?? ctx.t.nav.settlement, description: page?.intro, seo: page?.seo })
}

export default async function SettlementPage({ params }: LocaleParams) {
  return <CmsPage route="settlement" ctx={await pageContext(params)} />
}
