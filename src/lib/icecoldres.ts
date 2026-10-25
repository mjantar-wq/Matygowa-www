import 'server-only'

/**
 * Klient publicznego API IceColdRes (kontrakt: docs/integracja-strony.md w repozytorium IceColdRes).
 * Zapytania idą z serwera strony, więc IceColdRes nie musi otwierać CORS. Kwoty w groszach (PLN).
 * IceColdRes jest jedynym źródłem prawdy o cenach i dostępności: strona nic nie liczy, tylko pokazuje.
 * Błąd lub brak API nie może zepsuć strony: funkcje zwracają null, a widok chowa ceny.
 */
const API = process.env.ICECOLDRES_API_URL ?? 'https://icecoldres.audiowizard.pl'
export const ICECOLDRES_SLUG = process.env.ICECOLDRES_SLUG ?? 'booking'

export interface PublicUnitType {
  id: string
  code?: string
  name: string
  content?: { en?: { name?: string } }
  kind: string
  stdOccupancy: number
  maxOccupancy: number
  maxChildren: number
  amenities: string[]
  amenitiesEn: string[]
  photos: { id: string; src: string }[]
}

export interface PublicProperty {
  // checkInTime/checkOutTime: potrzeba strony zgłoszona IceColdRes (godziny z ustawień obiektu), do tego czasu domyślne 16:00 i 11:00
  property: { name: string; currency: string; today: string; checkInTime?: string; checkOutTime?: string }
  unitTypes: PublicUnitType[]
  bookingsEnabled: boolean
  eur: number | null
}

export interface PriceFrom {
  unitTypeId: string
  code: string
  lowest: { nightly: number; arrival: string; nights: number; offerId: string } | null
}

export interface Promotion {
  id: string
  badge: string
  description: string
  en: { badge?: string; description?: string }
  stayFrom: string | null
  stayTo: string | null
  bookFrom: string | null
  bookTo: string | null
  bookableNow: boolean
  unitTypeIds: string[] | null
  arrivalDays?: number[] | null
  excludedWeekdays?: number[] | null
  excludedPeriods?: { from: string; to: string }[] | null
}

export interface Service {
  id: string
  name: string
  en: { name?: string }
  durationMinutes: number | null
  price: number
  includedPerDay: number
  unitTypeIds: string[] | null
}

/** Tematy webhooka „treść zmieniona” (kontrakt: sekcja Webhook); każde zapytanie ma tag tematów, z których korzysta. */
export const TOPICS = ['property', 'unitTypes', 'photos', 'services', 'pricing'] as const
export type Topic = (typeof TOPICS)[number]
export const topicTag = (t: Topic) => `icecoldres:${t}`

async function get<T>(path: string, revalidate: number, topics: Topic[] = []): Promise<T | null> {
  try {
    const res = await fetch(`${API}/api/public/${ICECOLDRES_SLUG}${path}`, {
      next: { revalidate, tags: ['icecoldres', ...topics.map(topicTag)] },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export const getProperty = () => get<PublicProperty>('', 300, ['property', 'unitTypes', 'photos', 'pricing'])

export async function getPricesFrom(): Promise<PriceFrom[]> {
  const today = new Date().toISOString().slice(0, 10)
  const data = await get<{ types: PriceFrom[] }>(`/prices-from?from=${today}&days=1`, 600, ['pricing'])
  return data?.types ?? []
}

export async function getPromotions(): Promise<Promotion[]> {
  const data = await get<{ promotions: Promotion[] }>('/promotions', 300, ['pricing'])
  return data?.promotions ?? []
}

export async function getServices(): Promise<Service[]> {
  return (await get<Service[]>('/services', 3600, ['services'])) ?? []
}

/** Wynik wyszukiwania dla jednego domu (GET /search): wolne sztuki i cena każdej oferty strony. */
export interface SearchOffer {
  offerId: string
  name: string
  available: boolean
  total?: number
  deposit?: number
  items?: { nights: number; total: number; promotion: { id: string; display: { badge?: string; en?: { badge?: string | null } } | null } | null }[]
  unavailable?: { index: number; reasons: { code: string }[] }[]
}
export interface SearchResult {
  unitTypeId: string
  free: number
  offers: SearchOffer[]
}

export interface StayQuery {
  arrival: string
  departure: string
  adults: number
  children: number
  ages: number[]
}

/** Dostępność i ceny zmieniają się z każdą rezerwacją, więc bufor tylko 45 s (kontrakt: 30–60 s). */
const LIVE = 45

export async function searchStay(q: StayQuery): Promise<SearchResult[] | null> {
  const params = new URLSearchParams({ arrival: q.arrival, departure: q.departure, adults: String(q.adults), childCount: String(q.children) })
  if (q.ages.length) params.set('children', q.ages.join(','))
  const data = await get<{ results: SearchResult[] }>(`/search?${params}`, LIVE)
  return data?.results ?? null
}

export interface CalendarDay {
  free: number
  open: boolean
  cta: boolean
  ctd: boolean
  minStay: number
  maxStay: number | null
}

export async function getCalendar(from: string, days: number) {
  return get<{ from: string; today: string; types: { unitTypeId: string; days: CalendarDay[] }[] }>(`/calendar?from=${from}&days=${days}`, LIVE)
}

export async function getPricesFromDays(from: string, days: number) {
  return get<{ from: string; types: (PriceFrom & { days: (number | null)[] })[] }>(`/prices-from?from=${from}&days=${days}`, 600, ['pricing'])
}
