import type { PromoCard } from '@/lib/promo-cards'
import { SIZES_DEFAULT } from '@/lib/images'
import { Media } from './Media'

/**
 * Zdjęcie karty oferty: zdjęcie główne wgrane w panelu IceColdRes, a gdy go brak, prawdziwe zdjęcie domku z galerii strony.
 * Bez żadnego zdjęcia zastępnik z Media.
 */
export function PromoMedia({ card, sizes }: { card: Pick<PromoCard, 'photo' | 'image'>; sizes?: string }) {
  const p = card.photo
  if (!p) return <Media media={card.image} sizes={sizes} />
  return (
    // eslint-disable-next-line @next/next/no-img-element -- warianty WebP/JPEG robi IceColdRes (srcset z `widths`)
    <img
      src={p.src}
      srcSet={p.srcSet}
      sizes={p.srcSet ? (sizes ?? SIZES_DEFAULT) : undefined}
      alt={p.alt}
      width={p.width}
      height={p.height}
      loading="lazy"
      decoding="async"
      style={{ objectPosition: p.position, ...(p.placeholder ? { backgroundImage: `url("${p.placeholder}")`, backgroundSize: 'cover' } : null) }}
    />
  )
}
