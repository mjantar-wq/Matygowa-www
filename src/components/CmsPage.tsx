import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import type { RouteKey } from '@/i18n/routes'
import { findBySlug } from '@/lib/cms'
import type { PageContext } from '@/lib/page'
import type { Page } from '@/payload-types'
import { Placeholder } from './Placeholder'

export const getPage = (slug: string, ctx: PageContext) => findBySlug<Page>('pages', slug, ctx.locale)

/**
 * Strona złożona z bloków z panelu. Bez wpisu w panelu pokazuje tytuł z menu i zastępnik
 * (albo `fallback`, np. domyślny układ strony głównej), żeby szkielet był kompletny od pierwszego dnia.
 */
export async function CmsPage({ route, slug, ctx, fallback, children, required }: { route: RouteKey; slug?: string; ctx: PageContext; fallback?: Page['layout']; children?: React.ReactNode; required?: boolean }) {
  const page = await getPage(slug ?? route, ctx)
  if (!page && required) notFound()
  const blocks = page?.layout?.length ? page.layout : fallback
  const hasHero = blocks?.[0]?.blockType === 'hero'
  return (
    <>
      {!hasHero ? (
        <header className="mo-section mo-container" style={{ paddingBlockEnd: 0 }}>
          <h1 className="mo-h1">{page?.title ?? ctx.t.nav[route]}</h1>
          {page?.intro ? <p className="mo-lede">{page.intro}</p> : null}
        </header>
      ) : null}
      {blocks?.length ? <RenderBlocks blocks={blocks} ctx={ctx} /> : null}
      {children}
      {!blocks?.length && !children ? (
        <div className="mo-section mo-container">
          <Placeholder label={ctx.t.placeholder} note={`Panel → Strony i sekcje → adres „${slug ?? route}”`} />
        </div>
      ) : null}
    </>
  )
}
