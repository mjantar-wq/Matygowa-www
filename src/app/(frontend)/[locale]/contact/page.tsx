import type { Metadata } from 'next'
import { CmsPage, getPage } from '@/components/CmsPage'
import { buildMetadata, pageContext, type LocaleParams } from '@/lib/page'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const ctx = await pageContext(params)
  const page = await getPage('contact', ctx)
  return buildMetadata(ctx.locale, 'contact', { title: page?.title ?? ctx.t.nav.contact, description: page?.intro, seo: page?.seo })
}

export default async function ContactPage({ params }: LocaleParams) {
  return <CmsPage route="contact" ctx={await pageContext(params)} />
}
