import type { Metadata } from 'next'
import { CmsPage, getPage } from '@/components/CmsPage'
import { StructuredData } from '@/components/StructuredData'
import { defaultHomeLayout } from '@/lib/defaults'
import { buildMetadata, pageContext, type LocaleParams } from '@/lib/page'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const ctx = await pageContext(params)
  const page = await getPage('home', ctx)
  return buildMetadata(ctx.locale, 'home', { seo: page?.seo })
}

export default async function Home({ params }: LocaleParams) {
  const ctx = await pageContext(params)
  return (
    <>
      <StructuredData locale={ctx.locale} />
      <CmsPage route="home" ctx={ctx} immersive fallback={defaultHomeLayout(ctx.locale)} />
    </>
  )
}
