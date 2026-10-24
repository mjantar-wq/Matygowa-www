import type { Media as MediaDoc } from '@/payload-types'

type Props = { media?: MediaDoc | string | number | null; className?: string; priority?: boolean; sizes?: string; fallback?: string }

/**
 * Zdjęcie albo film z biblioteki. Bez pliku pokazuje zastępnik, żeby szkielet był kompletny.
 * Punkt ostrości z panelu ustawia kadrowanie (object-position) na telefonie.
 */
export function Media({ media, className, priority, fallback }: Props) {
  if (!media || typeof media !== 'object' || !media.url) {
    return <div className={`mo-placeholder ${className ?? ''}`} aria-hidden="true">{fallback}</div>
  }
  const position = `${media.focusX ?? 50}% ${media.focusY ?? 50}%`
  if (media.mimeType?.startsWith('video/')) {
    return (
      <video className={className} src={media.url} autoPlay muted loop playsInline preload="none" aria-label={media.alt ?? undefined} style={{ objectPosition: position }} />
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- rozmiary AVIF/WebP robi Cloudflare (etap budowy)
    <img
      className={className}
      src={media.url}
      alt={media.alt ?? ''}
      width={media.width ?? undefined}
      height={media.height ?? undefined}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      style={{ objectPosition: position }}
    />
  )
}
