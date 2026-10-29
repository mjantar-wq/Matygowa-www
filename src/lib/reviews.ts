import type { Payload } from 'payload'

/**
 * Pobieranie opinii ze źródeł do kolekcji testimonials (dwa razy w tygodniu, zadanie zaplanowane w worker.ts).
 * Upsert po externalId: nowe opinie dochodzą, istniejące dostają aktualny tekst i ocenę.
 * Wpisów ręcznych (bez externalId) nie dotykamy, a pobranej opinii autora, który ma już ręczny wpis z tego źródła, nie dublujemy.
 *
 * Google: Places API (New), Place Details z polem reviews (do 5 opinii „najtrafniejszych”; kolejne uruchomienia z czasem zbierają ich więcej).
 * Konfiguracja: GOOGLE_PLACES_API_KEY (sekret Workera) i GOOGLE_PLACE_ID (vars). Bez nich źródło jest pomijane.
 * Booking: Booking.com nie udostępnia opinii przez publiczne API (tylko partnerom Connectivity), więc na razie wpisuje się je ręcznie w panelu;
 * próg 9/10 działa też dla nich przy wyświetlaniu. Pół na pół z Google losuje ReviewShuffle przy każdym wejściu.
 */
export type FetchedReview = {
  externalId: string
  source: 'google' | 'booking'
  author: string
  rating: number
  date: string
  quote: { pl: string; en?: string }
}

/** Na stronę trafiają tylko opinie z treścią: Google tylko 5 gwiazdek, Booking od 9/10. */
export const MIN_RATING = { google: 5, booking: 9 } as const

/** Czy opinię wolno pokazać. Źródła bez progu (ręczne, inne) i opinie bez oceny przechodzą. */
export function meetsMinRating(source?: string | null, rating?: number | null): boolean {
  const min = MIN_RATING[source as keyof typeof MIN_RATING]
  return min === undefined || rating == null || rating >= min
}

type PlaceReview = {
  name: string
  rating?: number
  publishTime?: string
  text?: { text?: string; languageCode?: string }
  originalText?: { text?: string; languageCode?: string }
  authorAttribution?: { displayName?: string }
}

async function placeReviews(
  placeId: string,
  key: string,
  lang: 'pl' | 'en',
): Promise<PlaceReview[]> {
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=${lang}`,
    {
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'reviews' },
    },
  )
  if (!res.ok) throw new Error(`Google Places ${res.status}: ${(await res.text()).slice(0, 300)}`)
  return ((await res.json()) as { reviews?: PlaceReview[] }).reviews ?? []
}

/** Tekst w danym języku: oryginał, jeśli opinia była w nim napisana, inaczej tłumaczenie Google. */
const textIn = (r: PlaceReview, lang: string) =>
  (r.originalText?.languageCode === lang ? r.originalText.text : r.text?.text)?.trim() ?? ''

/** Z „Jan Kowalski” robi „Jan K.”, tak jak w opiniach wpisanych ręcznie. */
export function shortAuthor(name: string): string {
  const [first, ...rest] = name.trim().split(/\s+/)
  const last = rest.at(-1)
  return last ? `${first} ${last[0]!.toUpperCase()}.` : (first ?? '')
}

export async function fetchGoogle(): Promise<FetchedReview[]> {
  const key = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GOOGLE_PLACE_ID
  if (!key || !placeId) return []
  const [pl, en] = await Promise.all([
    placeReviews(placeId, key, 'pl'),
    placeReviews(placeId, key, 'en'),
  ])
  const enById = new Map(en.map((r) => [r.name, r]))
  return pl
    .filter((r) => (r.rating ?? 0) >= MIN_RATING.google && textIn(r, 'pl'))
    .map((r) => {
      const e = enById.get(r.name)
      return {
        externalId: `google:${r.name}`,
        source: 'google' as const,
        author: shortAuthor(r.authorAttribution?.displayName ?? 'Gość'),
        rating: r.rating!,
        date: r.publishTime ?? new Date().toISOString(),
        quote: { pl: textIn(r, 'pl'), en: e ? textIn(e, 'en') || undefined : undefined },
      }
    })
}

export async function syncReviews(
  payload: Payload,
): Promise<{ created: number; updated: number; skipped: number }> {
  const fetched = (await Promise.allSettled([fetchGoogle()])).flatMap((r) => {
    if (r.status === 'rejected') payload.logger.error({ err: r.reason }, 'Opinie: błąd pobierania')
    return r.status === 'fulfilled' ? r.value : []
  })
  const stats = { created: 0, updated: 0, skipped: 0 }
  for (const r of fetched) {
    const existing = await payload.find({
      collection: 'testimonials',
      where: {
        or: [
          { externalId: { equals: r.externalId } },
          {
            and: [
              { source: { equals: r.source } },
              { author: { equals: r.author } },
              { externalId: { exists: false } },
            ],
          },
        ],
      },
      limit: 1,
      depth: 0,
    })
    const doc = existing.docs[0]
    if (doc && !doc.externalId) {
      stats.skipped++
      continue
    }
    const data = {
      author: r.author,
      source: r.source,
      rating: r.rating,
      date: r.date,
      externalId: r.externalId,
    }
    const saved = doc
      ? await payload.update({
          collection: 'testimonials',
          id: doc.id,
          locale: 'pl',
          data: { ...data, quote: r.quote.pl },
        })
      : await payload.create({
          collection: 'testimonials',
          locale: 'pl',
          data: { ...data, quote: r.quote.pl },
        })
    if (r.quote.en)
      await payload.update({
        collection: 'testimonials',
        id: saved.id,
        locale: 'en',
        data: { quote: r.quote.en },
      })
    stats[doc ? 'updated' : 'created']++
  }
  return stats
}
