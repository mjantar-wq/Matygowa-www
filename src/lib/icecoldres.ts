import 'server-only'

/**
 * Klient publicznego API IceColdRes (kontrakt: docs/integracja-strony.md w repozytorium IceColdRes).
 * Zapytania idą z serwera strony, więc IceColdRes nie musi otwierać CORS. Kwoty w groszach (PLN).
 * IceColdRes jest jedynym źródłem prawdy o cenach i dostępności: strona nic nie liczy, tylko pokazuje.
 * Błąd lub brak API nie może zepsuć strony: funkcje zwracają null, a widok chowa ceny.
 */
const API = process.env.ICECOLDRES_API_URL ?? 'https://icecoldres.audiowizard.pl'
export const ICECOLDRES_SLUG = process.env.ICECOLDRES_SLUG ?? 'matygowa-osada'

export interface PublicUnitType {
  id: string
  code?: string
  name: string
  kind: string
  stdOccupancy: number
  maxOccupancy: number
  maxChildren: number
  amenities: string[]
  amenitiesEn: string[]
  photos: { id: string; src: string }[]
}

export interface PublicProperty {
  property: { name: string; currency: string; today: string }
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

async function get<T>(path: string, revalidate: number): Promise<T | null> {
  try {
    const res = await fetch(`${API}/api/public/${ICECOLDRES_SLUG}${path}`, {
      next: { revalidate, tags: ['icecoldres'] },
      signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export const getProperty = () => get<PublicProperty>('', 300)

export async function getPricesFrom(): Promise<PriceFrom[]> {
  const today = new Date().toISOString().slice(0, 10)
  const data = await get<{ types: PriceFrom[] }>(`/prices-from?from=${today}&days=1`, 600)
  return data?.types ?? []
}

export async function getPromotions(): Promise<Promotion[]> {
  const data = await get<{ promotions: Promotion[] }>('/promotions', 300)
  return data?.promotions ?? []
}

export async function getServices(): Promise<Service[]> {
  return (await get<Service[]>('/services', 3600)) ?? []
}
