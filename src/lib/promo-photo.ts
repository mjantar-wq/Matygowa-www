/**
 * Zdjęcie główne promocji z IceColdRes (`photo` w odpowiedzi /promotions, punkt 32 kontraktu) jako gotowe atrybuty <img>.
 * Bez pola, z pustą listą szerokości albo z uszkodzonymi danymi zwraca null, a karta bierze wtedy zdjęcie domku z galerii.
 */
import type { PublicPhoto } from './icecoldres'

/** Opis zdjęcia: mapa język → tekst z zapasem po polsku (albo zwykły tekst); pusty to null. */
export function photoAlt(alt: PublicPhoto['alt'], locale: string): string | null {
  const pick = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null)
  if (typeof alt === 'string') return pick(alt)
  if (!alt || typeof alt !== 'object') return null
  return pick(alt[locale]) ?? pick(alt.pl)
}

export interface PromoPhoto {
  src: string
  srcSet: string | undefined
  width: number | undefined
  height: number | undefined
  alt: string
  /** object-position z punktu ostrości (IceColdRes podaje ułamek 0–1) */
  position: string
  placeholder: string | null
}

const clamp = (n: number | null | undefined) => (typeof n === 'number' && Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0.5)

export function promoPhoto(photo: PublicPhoto | null | undefined, alt: string, locale = 'pl'): PromoPhoto | null {
  if (!photo || typeof photo.src !== 'string' || !photo.src) return null
  const widths = [...new Set((photo.widths ?? []).filter((w) => Number.isFinite(w) && w > 0))].sort((a, b) => a - b)
  if (!widths.length) return null
  const ext = photo.format === 'jpeg' || photo.format === 'jpg' ? 'jpg' : 'webp'
  const base = photo.src.replace(/\/+$/, '')
  const file = (w: number) => `${base}/${w}.${ext}`
  // domyślny plik ok. 1200 px (karta), a przeglądarka dobiera z srcset resztę
  const main = widths.find((w) => w >= 1200) ?? widths.at(-1)!
  const aspect = photo.width && photo.height ? photo.height / photo.width : null
  return {
    src: file(main),
    srcSet: widths.length > 1 ? widths.map((w) => `${file(w)} ${w}w`).join(', ') : undefined,
    width: aspect ? main : undefined,
    height: aspect ? Math.round(main * aspect) : undefined,
    alt: photoAlt(photo.alt, locale) ?? alt,
    position: `${clamp(photo.focusX) * 100}% ${clamp(photo.focusY) * 100}%`,
    placeholder: photo.placeholder?.startsWith('data:image/') ? photo.placeholder : null,
  }
}
