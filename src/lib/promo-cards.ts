import 'server-only'
import type { Locale } from '@/i18n/locales'
import type { Media, Offer, Unit } from '@/payload-types'
import { findMany, UNIT_ORDER } from './cms'
import { getPromotions, getProperty, type PublicOffer, type Promotion } from './icecoldres'

export interface PromoCard {
  promotion: Promotion
  /** zdjęcie z panelu (Treści → Oferty), a bez niego prawdziwe zdjęcie domku */
  image: Media | null
  /** oferta IceColdRes, na którą prowadzi „Rezerwuj” */
  offerId: string | null
  /** oferta silnika (warunki płatności i rezygnacji): połączona w panelu albo pierwsza */
  offer: PublicOffer | null
  onlinePayments: boolean
}

/** Teksty karty: tytuł to nazwa promocji z IceColdRes (Michał, 26.10.2026), plakietka z rabatem osobno. */
export function promoText(p: Promotion, locale: Locale) {
  const pl = locale === 'pl'
  const title = (pl ? p.name : p.en.name) || (pl ? p.badge : p.en.badge) || p.name || p.badge
  const badge = (pl ? p.badge : p.en.badge || p.badge) || null
  return {
    title,
    badge: badge && badge !== title ? badge : null,
    description: (pl ? p.description : p.en.description || p.description) || null,
    story: (pl ? p.story : p.en.story || p.story) || null,
  }
}

const realPhoto = (m: Media | number | null | undefined): m is Media =>
  !!m && typeof m === 'object' && !!m.url && !m.isPlaceholder && !m.mimeType?.startsWith('video/')

// stały wybór dla danej promocji (bez migania przy każdym odświeżeniu), różny dla kolejnych promocji
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)

/** Karty ofert: aktywne promocje z cennika IceColdRes ze zdjęciem z panelu strony (Michał, 25.10.2026). */
export async function getPromoCards(locale: Locale): Promise<PromoCard[]> {
  const [promotions, offers, units, property] = await Promise.all([
    getPromotions(),
    findMany<Offer>('offers', locale, { sort: 'order' }),
    findMany<Unit>('units', locale, { depth: 1, sort: UNIT_ORDER }),
    getProperty(),
  ])
  const pool = units.flatMap((u) => [u.hero, ...(u.gallery ?? [])]).filter(realPhoto)
  const unique = pool.filter((m, i) => pool.findIndex((x) => x.id === m.id) === i)
  return promotions.map((promotion, i) => {
    const extra = offers.find((o) => o.icecoldresPromotionId === promotion.id)
    // zdjęcie ustawione w panelu ma pierwszeństwo, nawet tymczasowe
    const own = extra?.image && typeof extra.image === 'object' && extra.image.url ? extra.image : null
    const image = own ?? (unique.length ? unique[(hash(promotion.id) + i) % unique.length] : null)
    const offerId = extra?.icecoldresOfferId || null
    const offer = property?.offers?.find((o) => o.id === offerId) ?? property?.offers?.[0] ?? null
    return { promotion, image, offerId, offer, onlinePayments: !!property?.onlinePayments }
  })
}
