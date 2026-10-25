import type { PageContext } from '@/lib/page'
import type { Media as MediaDoc } from '@/payload-types'
import { Lightbox, type LightboxItem } from './effects/Lightbox'

/** Seria zdjęć z biblioteki z powiększeniem i przewijaniem (filmy i puste pozycje są pomijane); podpis licencji z pola „Podpis”. */
export function PhotoGallery({ media, ctx }: { media?: (MediaDoc | number | string)[] | null; ctx: PageContext }) {
  const items: LightboxItem[] = (media ?? [])
    .filter((m): m is MediaDoc => typeof m === 'object' && !!m.url && !m.mimeType?.startsWith('video/'))
    .map((m) => ({ url: m.url!, alt: m.alt, width: m.width, height: m.height, focusX: m.focusX, focusY: m.focusY, credit: m.isPlaceholder ? null : m.caption }))
  if (!items.length) return null
  return <Lightbox items={items} t={ctx.t.effects} />
}
