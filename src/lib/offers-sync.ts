import type { Payload } from 'payload'
import { getAllPromotions } from './icecoldres'

/**
 * Zgrywa listę ofert w panelu z promocjami IceColdRes: dodaje brakujące (widoczne na stronie), odświeża nazwy,
 * usuwa te, których już nie ma. Przełącznik „Pokazuj na stronie” zostaje bez zmian.
 */
export async function syncOffers(payload: Payload): Promise<{ created: number; removed: number } | null> {
  const { promotions } = await getAllPromotions()
  // IceColdRes nie odpowiada albo nie ma promocji: nic nie ruszamy
  if (!promotions.length) return null
  const existing = await payload.find({ collection: 'offers', limit: 0, pagination: false, depth: 0, overrideAccess: true })
  const byPromo = new Map(existing.docs.map((o) => [o.icecoldresPromotionId, o]))
  let created = 0
  let removed = 0
  for (const [order, p] of promotions.entries()) {
    const title = p.name || p.badge || p.id
    const doc = byPromo.get(p.id)
    if (!doc) {
      await payload.create({ collection: 'offers', locale: 'pl', overrideAccess: true, data: { title, slug: p.id, order, published: true, icecoldresPromotionId: p.id } })
      created++
    } else if (doc.title !== title || doc.order !== order) {
      await payload.update({ collection: 'offers', id: doc.id, locale: 'pl', overrideAccess: true, data: { title, order } })
    }
  }
  const ids = new Set(promotions.map((p) => p.id))
  for (const o of existing.docs) {
    if (o.icecoldresPromotionId && ids.has(o.icecoldresPromotionId)) continue
    await payload.delete({ collection: 'offers', id: o.id, overrideAccess: true })
    removed++
  }
  return { created, removed }
}
