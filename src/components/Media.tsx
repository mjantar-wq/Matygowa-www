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

/** Adres tekstu licencji Creative Commons z nazwy, np. „CC BY-SA 4.0” → creativecommons.org/licenses/by-sa/4.0/. */
export function licenseUrl(license?: string | null): string | undefined {
  const m = license?.trim().match(/^CC\s+(BY(?:-(?:SA|NC|ND))*)\s+(\d\.\d)$/i)
  return m ? `https://creativecommons.org/licenses/${m[1]!.toLowerCase()}/${m[2]}/` : undefined
}

/** Podpis cudzego zdjęcia (autor, licencja, źródło z linkiem) z pola „Autor i licencja”; bez autora nic nie pokazuje. */
export function MediaCredit({ media }: { media?: MediaDoc | string | number | null }) {
  const c = media && typeof media === 'object' ? media.credit : null
  if (!c?.author) return null
  const lic = licenseUrl(c.license)
  return (
    <figcaption className="mo-credit">
      {c.author}
      {c.license ? <> · {lic ? <a href={lic} rel="license noopener" target="_blank">{c.license}</a> : c.license}</> : null}
      {c.url ? <> · <a href={c.url} rel="noopener" target="_blank">{c.source || 'źródło'}</a></> : c.source ? <> · {c.source}</> : null}
    </figcaption>
  )
}
