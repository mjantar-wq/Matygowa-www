import type { Metadata } from 'next'
import { AttractionEntry, sortAttractions } from '@/components/Attraction'
import { CmsPage, getPage } from '@/components/CmsPage'
import { findMany } from '@/lib/cms'
import { buildMetadata, pageContext, type LocaleParams } from '@/lib/page'
import type { Attraction } from '@/payload-types'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const ctx = await pageContext(params)
  const page = await getPage('surroundings', ctx)
  return buildMetadata(ctx.locale, 'surroundings', { title: page?.title ?? ctx.t.nav.surroundings, description: page?.intro, seo: page?.seo })
}

/**
 * Okolica: te same atrakcje co w sekcji „Blisko wszystkiego” na głównej (jedna kolekcja w panelu),
 * tu z opisem rozszerzonym i zdjęciami; pod nimi atrakcje bez odpowiednika na głównej (np. szlaki, lot balonem).
 */
export default async function SurroundingsPage({ params }: LocaleParams) {
  const ctx = await pageContext(params)
  const attractions = sortAttractions(await findMany<Attraction>('attractions', ctx.locale, { depth: 1 }))
  const main = attractions.filter((a) => a.featured)
  const more = attractions.filter((a) => !a.featured)
  return (
    <CmsPage route="surroundings" ctx={ctx}>
      {attractions.length ? (
        <section className="mo-section mo-container mo-atrakcje">
          {(main.length ? main : more).map((a) => <AttractionEntry key={a.id} a={a} ctx={ctx} link />)}
          {main.length && more.length ? (
            <>
              <h2 className="mo-h2 mo-atrakcje__wiecej">{ctx.t.attractions.more}</h2>
              {more.map((a) => <AttractionEntry key={a.id} a={a} ctx={ctx} link />)}
            </>
          ) : null}
        </section>
      ) : null}
    </CmsPage>
  )
}
