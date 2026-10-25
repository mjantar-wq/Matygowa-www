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

/** Galeria: bloki z panelu, a bez bloku „Seria zdjęć” wszystkie prawdziwe zdjęcia z biblioteki przypisane do serii (bez CGI, wg Michała). */
export default async function GalleryPage({ params }: LocaleParams) {
  const ctx = await pageContext(params)
  const page = await getPage('gallery', ctx)
  const hasGallery = page?.layout?.some((b) => b.blockType === 'gallery')
  const media = hasGallery ? [] : await findMany<Media>('media', ctx.locale, { where: { and: [{ series: { exists: true } }, { isPlaceholder: { not_equals: true } }] }, limit: 120, sort: 'filename' })
  return (
    <CmsPage route="gallery" ctx={ctx}>
      {media.length ? (
        <section className="mo-section mo-container">
          <PhotoGallery media={media} ctx={ctx} />
        </section>
      ) : null}
    </CmsPage>
  )
}
