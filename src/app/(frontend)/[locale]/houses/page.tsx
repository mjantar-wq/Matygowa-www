import type { Metadata } from 'next'
import { CmsPage, getPage } from '@/components/CmsPage'
import { UnitCard } from '@/components/UnitCard'
import { findMany } from '@/lib/cms'
import { getPricesFrom } from '@/lib/icecoldres'
import { buildMetadata, pageContext, type LocaleParams } from '@/lib/page'
import type { Unit } from '@/payload-types'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const ctx = await pageContext(params)
  const page = await getPage('houses', ctx)
  return buildMetadata(ctx.locale, 'houses', { title: page?.title ?? ctx.t.nav.houses, description: page?.intro, seo: page?.seo })
}

export default async function HousesPage({ params }: LocaleParams) {
  const ctx = await pageContext(params)
  const [units, prices] = await Promise.all([findMany<Unit>('units', ctx.locale, { sort: 'order' }), getPricesFrom()])
  const priceOf = (u: Unit) => prices.find((p) => p.code === (u.icecoldresCode || u.slug))?.lowest?.nightly
  return (
    <CmsPage route="houses" ctx={ctx}>
      {(['house', 'apartment'] as const).map((kind) => {
        const list = units.filter((u) => u.kind === kind)
        return list.length ? (
          <section key={kind} className="mo-section mo-container">
            <h2 className="mo-h2" style={{ marginBlockEnd: 'var(--space-6)' }}>{ctx.t.house.kind[kind]}</h2>
            <div className="mo-cards">
              {list.map((u) => <UnitCard key={u.id} unit={u} ctx={ctx} priceFrom={priceOf(u)} />)}
            </div>
          </section>
        ) : null
      })}
    </CmsPage>
  )
}
