import type { Media as MediaDoc } from '@/payload-types'
import { SIZES_DEFAULT, srcSet } from '@/lib/images'

type Props = { media?: MediaDoc | string | number | null; className?: string; priority?: boolean; sizes?: string; fallback?: string; alt?: string }

/**
 * Zdjęcie albo film z biblioteki. Bez pliku pokazuje zastępnik, żeby szkielet był kompletny.
 * Punkt ostrości z panelu ustawia kadrowanie (object-position) na telefonie.
 */
/** Zdjęcie bez zgody właściciela (prawa „Czeka na zgodę”) widać tylko na stronie testowej, nie na produkcji. */
export const cleared = (media?: MediaDoc | string | number | null) => !(typeof media === 'object' && media?.rights === 'pending' && process.env.SITE_INDEXABLE === 'true')

export function Media({ media, className, priority, sizes, fallback, alt }: Props) {
  if (!media || typeof media !== 'object' || !media.url || !cleared(media)) {
    return <div className={`mo-placeholder ${className ?? ''}`} aria-hidden="true">{fallback}</div>
  }
  const position = `${media.focusX ?? 50}% ${media.focusY ?? 50}%`
  if (media.mimeType?.startsWith('video/')) {
    return (
      <video className={className} src={media.url} autoPlay muted loop playsInline preload="none" aria-label={media.alt || alt || undefined} style={{ objectPosition: position }} />
    )
  }
  const set = srcSet(media.url, media.width)
  return (
    // eslint-disable-next-line @next/next/no-img-element -- mniejsze kopie AVIF/WebP robi Worker (src/edge/media.ts)
    <img
      className={className}
      src={media.url}
      srcSet={set}
      sizes={set ? (sizes ?? SIZES_DEFAULT) : undefined}
      alt={media.alt || alt || ''}
      width={media.width ?? undefined}
      height={media.height ?? undefined}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      style={{ objectPosition: position }}
    />
  )
}

/**
 * Podpis autorski pod zdjęciem z licencji CC (podpis z panelu), np. „Fot. Jan Kowalski · CC BY 4.0 · Wikimedia Commons https://…”.
 * Adres na końcu podpisu zamienia ostatni człon w link do źródła. Dla CGI nic nie pokazuje (tam podpis to notatka redakcyjna).
 */
export function Credit({ media, as: Tag = 'figcaption' }: { media?: MediaDoc | string | number | null; as?: 'figcaption' | 'p' }) {
  if (!media || typeof media !== 'object' || media.isPlaceholder || !media.caption || !cleared(media)) return null
  const [, text, url] = media.caption.match(/^(.*?)\s*(https?:\/\/\S+)?$/) ?? []
  const parts = (text ?? '').split(' · ')
  const last = parts.pop()
  return (
    <Tag className="mo-credit">
      {parts.length ? `${parts.join(' · ')} · ` : null}
      {url ? <a href={url} rel="noopener license" target="_blank">{last}</a> : last}
    </Tag>
  )
}
