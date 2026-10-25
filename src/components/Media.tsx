import type { Media as MediaDoc } from '@/payload-types'

type Props = { media?: MediaDoc | string | number | null; className?: string; priority?: boolean; sizes?: string; fallback?: string; alt?: string }

/**
 * Zdjęcie albo film z biblioteki. Bez pliku pokazuje zastępnik, żeby szkielet był kompletny.
 * Punkt ostrości z panelu ustawia kadrowanie (object-position) na telefonie.
 */
export function Media({ media, className, priority, fallback, alt }: Props) {
  if (!media || typeof media !== 'object' || !media.url) {
    return <div className={`mo-placeholder ${className ?? ''}`} aria-hidden="true">{fallback}</div>
  }
  const position = `${media.focusX ?? 50}% ${media.focusY ?? 50}%`
  if (media.mimeType?.startsWith('video/')) {
    return (
      <video className={className} src={media.url} autoPlay muted loop playsInline preload="none" aria-label={media.alt || alt || undefined} style={{ objectPosition: position }} />
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- rozmiary AVIF/WebP robi Cloudflare (etap budowy)
    <img
      className={className}
      src={media.url}
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
  if (!media || typeof media !== 'object' || media.isPlaceholder || !media.caption) return null
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
