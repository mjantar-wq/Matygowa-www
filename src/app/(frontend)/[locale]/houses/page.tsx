import type { Metadata } from 'next'
import { CmsPage, getPage } from '@/components/CmsPage'
import { SettlementMap } from '@/components/SettlementMap'
import { GuidePopup } from '@/components/GuidePopup'
import { UnitCard } from '@/components/UnitCard'
import { findMany, UNIT_ORDER } from '@/lib/cms'
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
  const [units, prices] = await Promise.all([findMany<Unit>('units', ctx.locale, { sort: UNIT_ORDER }), getPricesFrom()])
  // ceny „od” z IceColdRes (najtańsza oferta strony z promocją); wyłącznik w Ustawieniach → Rezerwacje
  const priceOf = (u: Unit) => (ctx.settings?.showPrices === false ? null : prices.find((p) => p.code === (u.icecoldresCode || u.slug))?.lowest?.nightly)
  return (
    <CmsPage route="houses" ctx={ctx}>
      {(['house', 'apartment'] as const).map((kind) => {
        const list = units.filter((u) => u.kind === kind)
        return list.length ? (
          <section key={kind} className="mo-section mo-container">
            <h2 className="mo-h2">{ctx.t.house.groups[kind]}</h2>
            {/* ten sam rozmiar i układ co wyniki „Sprawdź termin”: 3 w rzędzie na komputerze, 1 na telefonie */}
            <div className="mo-tiles-wrap">
              <ul className="mo-tiles">
                {list.map((u) => <UnitCard key={u.id} unit={u} ctx={ctx} priceFrom={priceOf(u)} />)}
              </ul>
            </div>
          </section>
        ) : null
      })}
      {/* ta sama mapa osady co na głównej (wg Michała): klik w budynek otwiera okno domu */}
      <section className="mo-section mo-container">
        <h2 className="mo-h2">{ctx.t.effects.map}</h2>
        <SettlementMap units={units} ctx={ctx} />
        <GuidePopup ctx={ctx} />
      </section>
    </CmsPage>
  )
}
