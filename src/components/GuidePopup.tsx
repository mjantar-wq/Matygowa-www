import { getPage } from '@/components/CmsPage'
import { plainText } from '@/components/StructuredData'
import { GuideDialog } from '@/components/effects/GuideDialog'
import { href } from '@/i18n/routes'
import { fillText, termVars } from '@/lib/terms'
import type { PageContext } from '@/lib/page'

/**
 * Przycisk „Przewodnik gościa” z okienkiem: pytania i odpowiedzi z bloku FAQ strony Przewodnik (z warunkami
 * z IceColdRes), bez linku na dole do tej samej strony (wg Michała). Przycisk w postaci książki; na dole głównej i pod mapą na stronie Domki (wg Michała).
 */
export async function GuidePopup({ ctx }: { ctx: PageContext }) {
  const [page, vars] = await Promise.all([getPage('guide', ctx), termVars(ctx.locale)])
  const faq = page?.layout?.find((b) => b.blockType === 'faq')
  const items = faq?.blockType === 'faq' ? (faq.items ?? []) : []
  const title = page?.title ?? ctx.t.nav.guide
  const link = href(ctx.locale, 'guide')
  return (
    <div className="mo-guide-popup">
      <GuideDialog href={link} label={title} closeLabel={ctx.t.effects.close} hint={ctx.t.effects.guideHint}>
        <h2 className="mo-h2">{title}</h2>
        {items.map((i) => (
          <details key={i.id} style={{ borderBlockEnd: '1px solid var(--color-linia)', paddingBlock: 'var(--space-4)' }}>
            <summary className="mo-h3">{fillText(i.question ?? '', vars)}</summary>
            <p>{fillText(plainText(i.answer as Parameters<typeof plainText>[0]), vars)}</p>
          </details>
        ))}
      </GuideDialog>
    </div>
  )
}
