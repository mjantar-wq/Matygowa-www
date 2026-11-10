/**
 * Mniejsze kopie zdjęć z biblioteki: /api/media/file/<nazwa>?w=<szerokość> (src/edge/media.ts robi je raz i trzyma w R2).
 * Przeglądarka sama wybiera z srcset kopię na swój ekran, więc telefon nie pobiera kadru 2048 px.
 */
export const WIDTHS = [480, 828, 1200, 1600, 2048] as const

/** Pełny ekran (tło, hero) i domyślnie: połowa szerokości od 1024 px (karty, zdjęcia obok tekstu). */
export const SIZES_FULL = '100vw'
export const SIZES_DEFAULT = '(min-width: 1024px) 50vw, 100vw'

export function srcSet(url: string | null | undefined, width: number | null | undefined) {
  if (!url || !width || !url.startsWith('/api/media/file/') || url.includes('?') || !/\.(jpe?g|png|webp|avif)$/i.test(url)) return undefined
  const smaller = WIDTHS.filter((w) => w < width * 0.9)
  if (!smaller.length) return undefined
  // Największy wariant to ten sam rozmiar co oryginał, ale w AVIF/WebP z Workera: oryginalny WebP 1600 px ważył ok. 200 KB,
  // kopia AVIF w tych samych wymiarach ok. połowę mniej (ekrany retina i duże monitory). Oryginały spoza listy szerokości
  // (np. 3000 px) zostają bez zmian, żeby nie obniżyć jakości.
  const list = smaller.map((w) => `${url}?w=${w} ${w}w`)
  // Oryginał między 1600 a 2048 px (np. zdjęcie z telefonu 1884 px, ok. 2 MB JPEG) nie jest kopią z listy, więc bez tego
  // retina pobierałaby ciężki JPEG; największy wariant z listy (1600 px, WebP/AVIF) wystarcza.
  if (width > WIDTHS[WIDTHS.length - 2] && width < WIDTHS[WIDTHS.length - 1]) return list.join(', ')
  const top = (WIDTHS as readonly number[]).includes(width) ? `${url}?w=${width}` : url
  return [...list, `${top} ${width}w`].join(', ')
}
