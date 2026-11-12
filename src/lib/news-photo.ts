import { getAllPromotions } from './icecoldres'
import { promoPhoto, type PromoPhoto } from './promo-photo'

/**
 * Aktualności, które pokazują zdjęcie promocji z IceColdRes zamiast zdjęcia z biblioteki mediów
 * (Michał, 12.11.2026: „Ferie 2027” ma to samo zdjęcie co promocja „Ferie Zimowe”). Klucz to slug aktualności,
 * wartość to id promocji. Treść i pole „Zdjęcie” w panelu zostają bez zmian; gdy promocja nie ma zdjęcia
 * albo IceColdRes nie odpowiada, strona pokazuje zdjęcie z panelu.
 */
const NEWS_PROMO: Record<string, string> = { 'ferie-2027': 'nowa-promocja-3' }

export async function newsPromoPhoto(slug: string, alt: string, locale: string): Promise<PromoPhoto | null> {
  const promoId = NEWS_PROMO[slug]
  if (!promoId) return null
  const { promotions } = await getAllPromotions()
  return promoPhoto(promotions.find((p) => p.id === promoId)?.photo, alt, locale)
}
