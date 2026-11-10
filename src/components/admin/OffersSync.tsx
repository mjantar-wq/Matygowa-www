import type { ServerProps } from 'payload'
import { syncOffers } from '@/lib/offers-sync'

/** Przy otwarciu listy ofert w panelu dociąga świeże promocje z IceColdRes. */
export async function OffersSync({ payload }: ServerProps): Promise<null> {
  try {
    await syncOffers(payload)
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', msg: 'offers_sync_failed', err: String(err) }))
  }
  return null
}
