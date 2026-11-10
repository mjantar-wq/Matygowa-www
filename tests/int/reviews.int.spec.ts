import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchGoogle, meetsMinRating, shortAuthor } from '@/lib/reviews'

const review = (
  id: string,
  rating: number,
  lang: string,
  text: string,
  original = text,
  originalLang = 'pl',
) => ({
  name: `places/X/reviews/${id}`,
  rating,
  publishTime: '2026-10-01T10:00:00Z',
  text: { text, languageCode: lang },
  originalText: { text: original, languageCode: originalLang },
  authorAttribution: { displayName: 'Anna Maria Nowak' },
})

describe('opinie z Google', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('skraca nazwisko autora', () => {
    expect(shortAuthor('Anna Maria Nowak')).toBe('Anna N.')
    expect(shortAuthor('Jose')).toBe('Jose')
  })

  it('progi: Google tylko 5/5, Booking od 9/10, reszta bez progu', () => {
    expect(meetsMinRating('google', 5)).toBe(true)
    expect(meetsMinRating('google', 4)).toBe(false)
    expect(meetsMinRating('booking', 9)).toBe(true)
    expect(meetsMinRating('booking', 8.9)).toBe(false)
    expect(meetsMinRating('booking', 10)).toBe(true)
    expect(meetsMinRating('other', 3)).toBe(true)
    expect(meetsMinRating('google', null)).toBe(true)
  })

  it('bez klucza nic nie pobiera', async () => {
    vi.stubEnv('GOOGLE_PLACES_API_KEY', '')
    expect(await fetchGoogle()).toEqual([])
  })

  it('bierze oryginał po polsku i tłumaczenie po angielsku, pomija niskie oceny i puste teksty', async () => {
    vi.stubEnv('GOOGLE_PLACES_API_KEY', 'k')
    vi.stubEnv('GOOGLE_PLACE_ID', 'X')
    const byLang = {
      pl: [
        review('a', 5, 'pl', 'Pięknie'),
        review('b', 3, 'pl', 'Słabo'),
        review('d', 4, 'pl', 'Dobrze'),
        review('c', 5, 'pl', ''),
      ],
      en: [review('a', 5, 'en', 'Beautiful', 'Pięknie')],
    }
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) =>
        Response.json({
          reviews: byLang[new URL(url).searchParams.get('languageCode') as 'pl' | 'en'],
        }),
      ),
    )
    expect(await fetchGoogle()).toEqual([
      {
        externalId: 'google:places/X/reviews/a',
        source: 'google',
        author: 'Anna N.',
        rating: 5,
        date: '2026-10-01T10:00:00Z',
        quote: { pl: 'Pięknie', en: 'Beautiful' },
      },
    ])
  })
})
