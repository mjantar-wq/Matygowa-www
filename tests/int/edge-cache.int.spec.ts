import { describe, expect, it } from 'vitest'
import { cacheablePage, pageKey } from '@/edge/pages'
import { srcSet } from '@/lib/images'

const req = (url: string, headers: Record<string, string> = {}, method = 'GET') => new Request(url, { headers, method })

describe('bufor stron dla gości', () => {
  it('buforuje strony, ale nie panel, API, pliki ani podgląd redaktora', () => {
    expect(cacheablePage(req('https://matygowa.audiowizard.pl/'))).toBe(true)
    expect(cacheablePage(req('https://matygowa.audiowizard.pl/domy/hawran?utm_source=fb'))).toBe(true)
    expect(cacheablePage(req('https://matygowa.audiowizard.pl/', { cookie: 'mo-zgody=1' }))).toBe(true)
    expect(cacheablePage(req('https://matygowa.audiowizard.pl/panel'))).toBe(false)
    expect(cacheablePage(req('https://matygowa.audiowizard.pl/api/booking/search'))).toBe(false)
    expect(cacheablePage(req('https://matygowa.audiowizard.pl/robots.txt'))).toBe(false)
    expect(cacheablePage(req('https://matygowa.audiowizard.pl/', {}, 'POST'))).toBe(false)
    expect(cacheablePage(req('http://matygowa.audiowizard.pl/'))).toBe(false)
    expect(cacheablePage(req('https://matygowa.audiowizard.pl/', { cookie: 'a=1; payload-token=x' }))).toBe(false)
    expect(cacheablePage(req('https://matygowa.audiowizard.pl/', { cookie: '__prerender_bypass=x' }))).toBe(false)
  })

  it('parametry kampanii nie zmieniają klucza, nawigacja RSC i wersja treści tak', async () => {
    const base = await pageKey(req('https://matygowa.audiowizard.pl/'), 'v1', 'd1')
    expect((await pageKey(req('https://matygowa.audiowizard.pl/?utm_source=fb&gclid=1'), 'v1', 'd1')).cache).toBe(base.cache)
    expect((await pageKey(req('https://matygowa.audiowizard.pl/', { rsc: '1' }), 'v1', 'd1')).cache).not.toBe(base.cache)
    expect((await pageKey(req('https://matygowa.audiowizard.pl/'), 'v2', 'd1')).cache).not.toBe(base.cache)
    expect((await pageKey(req('https://matygowa.audiowizard.pl/'), 'v1', 'd2')).cache).not.toBe(base.cache)
    // kopia w R2 tylko dla pełnych stron pod czystym adresem
    expect(base.r2).toMatch(/^_bufor\/strony\//)
    expect((await pageKey(req('https://matygowa.audiowizard.pl/', { rsc: '1' }), 'v1', 'd1')).r2).toBeNull()
    expect((await pageKey(req('https://matygowa.audiowizard.pl/?x=1'), 'v1', 'd1')).r2).toBeNull()
  })
})

describe('mniejsze kopie zdjęć (srcset)', () => {
  it('daje kopie węższe od oryginału i sam oryginał na końcu', () => {
    expect(srcSet('/api/media/file/K12_hero.webp', 2048)).toBe(
      '/api/media/file/K12_hero.webp?w=480 480w, /api/media/file/K12_hero.webp?w=828 828w, /api/media/file/K12_hero.webp?w=1200 1200w, /api/media/file/K12_hero.webp?w=1600 1600w, /api/media/file/K12_hero.webp 2048w',
    )
    expect(srcSet('/api/media/file/sredni.jpg', 1000)).toBe('/api/media/file/sredni.jpg?w=480 480w, /api/media/file/sredni.jpg?w=828 828w, /api/media/file/sredni.jpg 1000w')
  })
  it('bez kopii dla SVG, filmów, małych plików i adresów spoza biblioteki', () => {
    expect(srcSet('/api/media/file/mapa.svg', 2000)).toBeUndefined()
    expect(srcSet('/api/media/file/film.mp4', 1920)).toBeUndefined()
    expect(srcSet('/api/media/file/ikona.png', 400)).toBeUndefined()
    expect(srcSet('/ilustracje/G2.png', 2000)).toBeUndefined()
    expect(srcSet('/api/media/file/a.webp', null)).toBeUndefined()
  })
})
