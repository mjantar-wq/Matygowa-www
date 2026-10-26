import { afterEach, describe, expect, it, vi } from 'vitest'
import { arrivalInfo, departureInfo, departureOk, monthGrid, nextMonth, promoOn, type CalendarData, type DayInfo, type PromoRules } from '@/lib/availability'
import { bookingUrl } from '@/lib/booking'
import { promoInSeason, promoSeason } from '@/lib/icecoldres'

vi.mock('server-only', () => ({}))
vi.mock('@/lib/cms', () => ({
  UNIT_ORDER: ['order', 'name'],
  findMany: async () => [
    { slug: 'hawran', name: 'Hawrań', kind: 'house', tagline: 'Widok na Hawrań', hero: { url: '/media/hawran.jpg', alt: 'Hawrań', focusX: 30 }, area: 120, bedrooms: 4, peak: { elevation: 2152 } },
  ],
}))

const day = (o: Partial<DayInfo> = {}): DayInfo => ({ free: 1, open: true, cta: false, ctd: false, minStay: 2, maxStay: null, promo: null, ...o })
// 1–7 grudnia; hawran zajęty 3.12, gerlach wolny, ale 4.12 bez wyjazdów
const data: CalendarData = {
  from: '2026-12-01',
  today: '2026-12-01',
  types: [
    { code: 'hawran', days: [day(), day(), day({ free: 0 }), day(), day(), day(), day()] },
    { code: 'gerlach', days: [day({ minStay: 3 }), day({ cta: true }), day(), day({ ctd: true }), day(), day(), day({ promo: 'Zima −10%' })] },
  ],
}

describe('kalendarz dostępności', () => {
  it('przyjazd: najkrótszy min. pobyt z wolnych domów, zakaz przyjazdu wyklucza dom', () => {
    expect(arrivalInfo(data, '2026-12-01')).toMatchObject({ ok: true, minStay: 2 })
    expect(arrivalInfo(data, '2026-12-02', 'gerlach')).toMatchObject({ ok: false, reason: 'noArrival' })
    expect(arrivalInfo(data, '2026-12-03', 'hawran')).toMatchObject({ ok: false, reason: 'occupied' })
    expect(arrivalInfo(data, '2026-12-02', 'hawran')).toMatchObject({ ok: false, reason: 'minStay', minStay: 2 })
    expect(arrivalInfo(data, '2026-11-30')).toMatchObject({ ok: false, reason: 'past' })
    expect(arrivalInfo(data, '2026-12-02', 'gerlach').ok).toBe(false)
    expect(arrivalInfo(data, '2026-12-03', 'hawran').ok).toBe(false)
    expect(arrivalInfo(data, '2026-12-02', 'hawran').ok).toBe(false) // noc 3.12 zajęta, min. 2 noce
    expect(arrivalInfo(data, '2026-12-07').promo).toBe('Zima −10%')
    expect(arrivalInfo(data, '2026-11-30').ok).toBe(false)
  })

  it('wyjazd: ten sam dom wolny przez wszystkie noce, min. pobyt, zakaz wyjazdu', () => {
    expect(departureOk(data, '2026-12-01', '2026-12-02')).toBe(false) // min. 2 noce
    expect(departureOk(data, '2026-12-01', '2026-12-03')).toBe(true)
    expect(departureOk(data, '2026-12-01', '2026-12-05', 'hawran')).toBe(false) // noc 3.12 zajęta
    expect(departureOk(data, '2026-12-01', '2026-12-04', 'gerlach')).toBe(false) // 4.12 bez wyjazdów
    expect(departureOk(data, '2026-12-01', '2026-12-05', 'gerlach')).toBe(true)
    expect(departureInfo(data, '2026-12-01', '2026-12-02')).toMatchObject({ ok: false, reason: 'minStay', minStay: 2 })
    expect(departureInfo(data, '2026-12-01', '2026-12-04', 'gerlach')).toMatchObject({ ok: false, reason: 'noDeparture' })
  })

  it('siatka miesiąca od poniedziałku', () => {
    const grid = monthGrid('2026-12') // 1.12.2026 to wtorek
    expect(grid[0]).toBeNull()
    expect(grid[1]).toBe('2026-12-01')
    expect(grid.filter(Boolean)).toHaveLength(31)
    expect(nextMonth('2026-12')).toBe('2027-01')
    expect(nextMonth('2027-01', -1)).toBe('2026-12')
  })

  it('promocja strony na dzień przyjazdu', () => {
    const p: PromoRules = { bookableNow: true, unitTypeIds: null, stayFrom: '2026-12-01', stayTo: '2026-12-20', arrivalDays: [5], excludedWeekdays: null, excludedPeriods: null }
    expect(promoOn(p, '2026-12-04', 'x')).toBe(true) // piątek
    expect(promoOn(p, '2026-12-05', 'x')).toBe(false)
    expect(promoOn({ ...p, unitTypeIds: ['y'] }, '2026-12-04', 'x')).toBe(false)
    expect(promoOn({ ...p, bookableNow: false }, '2026-12-04', 'x')).toBe(false)
  })
})

describe('sezon promocji', () => {
  it('lato/zima z IceColdRes na przełącznik strony, bez sezonu zawsze', () => {
    expect(promoSeason('summer')).toBe('lato')
    expect(promoSeason('winter')).toBe('zima')
    expect(promoSeason(null)).toBeUndefined()
    expect(promoInSeason('summer', 'zima')).toBe(false)
    expect(promoInSeason('summer', 'lato')).toBe(true)
    expect(promoInSeason(null, 'zima')).toBe(true)
    expect(promoInSeason('winter', null)).toBe(true)
  })
})

describe('przekazanie do silnika', () => {
  it('pełne parametry: wiek dzieci, oferta, tylko utm_*', () => {
    const url = bookingUrl(
      { bookingEngine: 'icecoldres', icecoldresUrl: 'https://icecoldres.audiowizard.pl', slug: 'booking' },
      'pl',
      { arrival: '2026-12-04', departure: '2026-12-07', adults: 2, children: 2, ages: [4, 9], unit: 'gerlach', offer: 'standard' },
      { utm_source: 'google', utm_campaign: 'zima', gclid: 'x' },
    )
    expect(url).toBe('https://icecoldres.audiowizard.pl/pl/booking?arrival=2026-12-04&departure=2026-12-07&adults=2&children=2&ages=4%2C9&unit=gerlach&offer=standard&utm_source=google&utm_campaign=zima')
  })
})

describe('pośrednik /api/booking', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('wyszukiwanie: domy po kodzie, cena oferty, plakietka promocji i powód niedostępności', async () => {
    const api: Record<string, unknown> = {
      '': { unitTypes: [{ id: 'u1', code: 'hawran', name: 'Hawrań', stdOccupancy: 8, maxOccupancy: 8, amenities: ['sauna'], amenitiesEn: ['sauna'], photos: [] }, { id: 'u2', code: 'gerlach', name: 'Gerlach', content: { en: { name: 'Gerlach cottage' } }, photos: [] }] },
      '/search': {
        // IceColdRes podaje gerlach pierwszy; strona układa domy jak w panelu (hawran jest w panelu, gerlach nie)
        results: [
          { unitTypeId: 'u2', free: 1, offers: [{ offerId: 'standard', name: 'Standard', available: false, unavailable: [{ index: 0, reasons: [{ code: 'over_capacity' }] }] }] },
          { unitTypeId: 'u1', free: 1, offers: [{ offerId: 'standard', name: 'Standard', available: true, total: 300000, items: [{ nights: 3, total: 300000, promotion: { id: 'p', display: { badge: 'Zima', en: { badge: 'Winter' } } } }] }] },
        ],
      },
    }
    const calls: string[] = []
    vi.stubGlobal('fetch', async (input: string) => {
      const path = new URL(input).pathname.replace(/^\/api\/public\/[^/]+/, '')
      calls.push(input)
      return Response.json(api[path])
    })
    const { GET } = await import('@/app/(frontend)/api/booking/[op]/route')
    const res = await GET(new Request('https://x/api/booking/search?arrival=2026-12-04&departure=2026-12-07&adults=2&children=1&ages=4'), { params: Promise.resolve({ op: 'search' }) })
    const body = (await res.json()) as { nights: number; results: unknown[] }
    expect(calls.find((c) => c.includes('/search'))).toContain('childCount=1&children=4')
    expect(res.headers.get('Cache-Control')).toContain('s-maxage=45')
    expect(body.nights).toBe(3)
    expect(body.results[0]).toMatchObject({
      code: 'hawran',
      offers: [{ offerId: 'standard', total: 300000, badge: 'Zima', badgeEn: 'Winter' }],
      reason: null,
      unit: { slug: 'hawran', photos: [{ src: '/media/hawran.jpg', focus: '30% 50%' }], area: 120, elevation: 2152, maxGuests: 8, amenities: ['sauna'] },
    })
    expect(body.results[1]).toMatchObject({ code: 'gerlach', nameEn: 'Gerlach cottage', offers: [], reason: 'over_capacity', unit: null })
  })

  it('odrzuca błędne zapytania', async () => {
    const { GET } = await import('@/app/(frontend)/api/booking/[op]/route')
    const res = await GET(new Request('https://x/api/booking/search?arrival=2026-12-07&departure=2026-12-04&adults=2'), { params: Promise.resolve({ op: 'search' }) })
    expect(res.status).toBe(400)
    // najwyżej 30 osób razem (Michał, 26.10.2026)
    const big = await GET(new Request('https://x/api/booking/search?arrival=2026-12-04&departure=2026-12-07&adults=25&children=6'), { params: Promise.resolve({ op: 'search' }) })
    expect(big.status).toBe(400)
  })

  it('grupa, której nie pomieści żaden dom, idzie do strony rezerwacji (kilka domów)', async () => {
    const api: Record<string, unknown> = {
      '': { unitTypes: [{ id: 'u1', code: 'hawran', name: 'Hawrań', stdOccupancy: 8, maxOccupancy: 10, maxChildren: 6, photos: [] }] },
      '/search': { results: [{ unitTypeId: 'u1', free: 2, offers: [] }] },
    }
    vi.stubGlobal('fetch', async (input: string) => Response.json(api[new URL(input).pathname.replace(/^\/api\/public\/[^/]+/, '')]))
    const { GET } = await import('@/app/(frontend)/api/booking/[op]/route')
    const search = (q: string) => GET(new Request(`https://x/api/booking/search?arrival=2026-12-04&departure=2026-12-07&${q}`), { params: Promise.resolve({ op: 'search' }) })
    expect(await (await search('adults=20&children=4')).json()).toMatchObject({ group: true, results: [] })
    expect(await (await search('adults=3&children=7')).json()).toMatchObject({ group: true })
    expect(await (await search('adults=6&children=4')).json()).not.toHaveProperty('group')
  })
})
