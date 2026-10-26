import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import type { RouteKey } from '@/i18n/routes'
import { findBySlug, findMany, isDraft } from '@/lib/cms'
import { buildScenes } from '@/lib/scenes'
import { engineSettings } from '@/lib/booking'
import { BookingBar } from './BookingBar'
import { BookingDock } from './effects/BookingDock'
import { SceneStage } from './effects/SceneStage'
import type { PageContext } from '@/lib/page'
import type { Media, Page } from '@/payload-types'
import { Placeholder } from './Placeholder'

export const getPage = (slug: string, ctx: PageContext) => findBySlug<Page>('pages', slug, ctx.locale)

/**
 * Strona złożona z bloków z panelu. Bez wpisu w panelu pokazuje tytuł z menu i zastępnik
 * (albo `fallback`, np. domyślny układ strony głównej), żeby szkielet był kompletny od pierwszego dnia.
 */
export async function CmsPage({ route, slug, ctx, fallback, children, required, immersive }: { route: RouteKey; slug?: string; ctx: PageContext; fallback?: Page['layout']; children?: React.ReactNode; required?: boolean; immersive?: boolean }) {
  const page = await getPage(slug ?? route, ctx)
  if (!page && required) notFound()
  const blocks = page?.layout?.length ? page.layout : fallback
  const hasHero = blocks?.[0]?.blockType === 'hero'
  if (immersive && blocks?.length) {
    // Strona główna: opowieść na stałym tle (koncepcja po M1)
    const media = await findMany<Media>('media', ctx.locale, { limit: 300, depth: 0 })
    return (
      <div className="mo-opowiesc" data-tlo="media">
        <SceneStage scenes={buildScenes(blocks, media)} />
        <RenderBlocks blocks={blocks} ctx={ctx} immersive />
        {children}
        <BookingDock label={ctx.t.booking.check} close={ctx.t.effects.close}>
          <BookingBar locale={ctx.locale} t={ctx.t.booking} fx={ctx.t.effects} engine={engineSettings(ctx.settings)} slogan={ctx.settings?.priceSlogan} />
        </BookingDock>
      </div>
    )
  }
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
          {/* wskazówka dla redaktora tylko w podglądzie z panelu, gość widzi sam napis */}
          <Placeholder label={ctx.t.placeholder} note={(await isDraft()) ? `Panel → Strony i sekcje → adres „${slug ?? route}”` : undefined} />
        </div>
      ) : null}
    </>
  )
}
