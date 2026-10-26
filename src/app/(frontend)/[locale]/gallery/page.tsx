import type { Metadata } from 'next'
import { CmsPage, getPage } from '@/components/CmsPage'
import { PhotoGallery } from '@/components/PhotoGallery'
import { findMany } from '@/lib/cms'
import { buildMetadata, pageContext, type LocaleParams } from '@/lib/page'
import type { Media } from '@/payload-types'

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const ctx = await pageContext(params)
  const page = await getPage('gallery', ctx)
  return buildMetadata(ctx.locale, 'gallery', { title: page?.title ?? ctx.t.nav.gallery, description: page?.intro, seo: page?.seo })
}

type Series = 'winter' | 'summer' | 'interiors' | 'rituals' | 'night'

/** Kolejność serii na stronie (koncepcja: galeria jako kuratorowane serie, nie siatka). */
const ORDER: Series[] = ['winter', 'summer', 'interiors', 'rituals', 'night']
/** Zdjęcie w kilku seriach (np. bania nocą) pokazujemy raz, w najbardziej szczegółowej. */
const PRIORITY: Series[] = ['rituals', 'interiors', 'night', 'winter', 'summer']

/**
 * Galeria: bloki z panelu, a bez bloku „Seria zdjęć” prawdziwe zdjęcia z biblioteki (bez CGI, wg Michała)
 * w seriach Zima, Lato, Wnętrza, Sauna i bania, Noc. Okolica ma własną podstronę.
 * Jedno zapytanie na serię z limitem 90: D1 przyjmuje najwyżej 100 parametrów, a Payload pyta o wszystkie id naraz.
 */
export default async function GalleryPage({ params }: LocaleParams) {
  const ctx = await pageContext(params)
  const page = await getPage('gallery', ctx)
  const hasGallery = page?.layout?.some((b) => b.blockType === 'gallery')
  const found = hasGallery
    ? []
    : await Promise.all(
        PRIORITY.map((series) =>
          findMany<Media>('media', ctx.locale, { where: { and: [{ series: { in: [series] } }, { isPlaceholder: { not_equals: true } }] }, limit: 90, sort: 'filename', depth: 0 }),
        ),
      )
  const seen = new Set<Media['id']>()
  const bySeries = new Map<Series, Media[]>()
  PRIORITY.forEach((series, i) => {
    const media = (found[i] ?? []).filter((m) => !m.mimeType?.startsWith('video/') && !seen.has(m.id))
    media.forEach((m) => seen.add(m.id))
    bySeries.set(series, media)
  })
  const sections = ORDER.filter((s) => bySeries.get(s)?.length)
  return (
    <CmsPage route="gallery" ctx={ctx}>
      {sections.length
        ? sections.map((series) => (
            <section key={series} className="mo-section mo-container" aria-labelledby={`seria-${series}`}>
              <h2 id={`seria-${series}`} className="mo-h2" style={{ marginBlockEnd: 'var(--space-6)' }}>{ctx.t.gallery[series]}</h2>
              <PhotoGallery media={bySeries.get(series)} ctx={ctx} />
            </section>
          ))
        : null}
    </CmsPage>
  )
}
