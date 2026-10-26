import 'server-only'
import type { Locale } from '@/i18n/locales'
import type { Media, Unit } from '@/payload-types'
import { findMany } from './cms'
import type { PublicUnitType } from './icecoldres'

export interface TilePhoto {
  src: string
  alt: string
  /** object-position z punktu ostrości w panelu */
  focus: string
}

/** Opis domu do kafelka wyników: zdjęcia i liczby ze strony, wyposażenie i liczba osób z IceColdRes. */
export interface UnitTile {
  slug: string
  kind: 'house' | 'apartment'
  tagline: string | null
  photos: TilePhoto[]
  area: number | null
  bedrooms: number | null
  bathrooms: number | null
  elevation: number | null
  stdGuests: number | null
  maxGuests: number | null
  amenities: string[]
}

const MAX_PHOTOS = 7

function photo(m: Media | number | null | undefined, fallback: string): TilePhoto | null {
  if (!m || typeof m !== 'object' || !m.url || m.mimeType?.startsWith('video/')) return null
  return { src: m.url, alt: m.alt || fallback, focus: `${m.focusX ?? 50}% ${m.focusY ?? 50}%` }
}

// adres zdjęcia IceColdRes to katalog z wariantami; do kafelka wystarczy ok. 1200 px
function icecoldresPhoto(p: PublicUnitType['photos'][number], fallback: string): TilePhoto[] {
  const width = p.widths?.find((w) => w >= 1200) ?? p.widths?.at(-1)
  if (!width) return []
  // punkt ostrości IceColdRes jest ułamkiem 0–1
  return [{ src: `${p.src}/${width}.${p.format === 'jpeg' ? 'jpg' : 'webp'}`, alt: fallback, focus: `${(p.focusX ?? 0.5) * 100}% ${(p.focusY ?? 0.5) * 100}%` }]
}

/** Kafelki po kodzie IceColdRes (`icecoldresCode` albo slug domu). Bez zdjęć na stronie bierzemy zdjęcia z IceColdRes. */
export async function getUnitTiles(locale: Locale, types: PublicUnitType[]): Promise<Record<string, UnitTile>> {
  const units = await findMany<Unit>('units', locale, { depth: 1, sort: 'order' })
  const tiles: Record<string, UnitTile> = {}
  for (const u of units) {
    const code = u.icecoldresCode || u.slug
    const type = types.find((x) => x.code === code)
    const own = [u.hero, ...(u.gallery ?? [])]
      .map((m) => photo(m, u.name))
      .filter((p): p is TilePhoto => p !== null)
      .filter((p, i, all) => all.findIndex((x) => x.src === p.src) === i)
    const photos = own.length ? own : (type?.photos ?? []).flatMap((p) => icecoldresPhoto(p, u.name))
    tiles[code] = {
      slug: u.slug,
      kind: u.kind,
      tagline: u.tagline ?? null,
      photos: photos.slice(0, MAX_PHOTOS),
      area: u.area ?? null,
      bedrooms: u.bedrooms ?? null,
      bathrooms: u.bathrooms ?? null,
      elevation: u.peak?.elevation ?? null,
      stdGuests: type?.stdOccupancy ?? null,
      maxGuests: type?.maxOccupancy ?? u.maxGuests ?? null,
      amenities: (locale === 'pl' ? type?.amenities : type?.amenitiesEn) ?? [],
    }
  }
  return tiles
}
