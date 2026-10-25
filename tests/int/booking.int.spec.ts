import { afterEach, describe, expect, it, vi } from 'vitest'
import { arrivalInfo, departureOk, monthGrid, nextMonth, promoOn, type CalendarData, type DayInfo, type PromoRules } from '@/lib/availability'
import { bookingUrl } from '@/lib/booking'

vi.mock('server-only', () => ({}))

const day = (o: Partial<DayInfo> = {}): DayInfo => ({ free: 1, open: true, cta: false, ctd: false, minStay: 2, maxStay: null, price: 95000, promo: null, ...o })
// 1–7 grudnia; hawran zajęty 3.12, gerlach wolny, ale 4.12 bez wyjazdów
const data: CalendarData = {
  from: '2026-12-01',
  today: '2026-12-01',
  types: [
    { code: 'hawran', days: [day(), day(), day({ free: 0 }), day(), day(), day(), day()] },
    { code: 'gerlach', days: [day({ price: 120000 }), day({ cta: true }), day(), day({ ctd: true }), day(), day(), day({ promo: 'Zima −10%' })] },
  ],
}

describe('kalendarz dostępności', () => {
  it('przyjazd: najniższa cena z wolnych domów, zakaz przyjazdu wyklucza dom', () => {
    expect(arrivalInfo(data, '2026-12-01')).toMatchObject({ ok: true, price: 95000 })
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
      '': { unitTypes: [{ id: 'u1', code: 'hawran', name: 'Hawrań' }, { id: 'u2', code: 'gerlach', name: 'Gerlach', content: { en: { name: 'Gerlach cottage' } } }] },
      '/search': {
        results: [
          { unitTypeId: 'u1', free: 1, offers: [{ offerId: 'standard', name: 'Standard', available: true, total: 300000, items: [{ nights: 3, total: 300000, promotion: { id: 'p', display: { badge: 'Zima', en: { badge: 'Winter' } } } }] }] },
          { unitTypeId: 'u2', free: 1, offers: [{ offerId: 'standard', name: 'Standard', available: false, unavailable: [{ index: 0, reasons: [{ code: 'over_capacity' }] }] }] },
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
    expect(body.results[0]).toMatchObject({ code: 'hawran', offers: [{ offerId: 'standard', total: 300000, badge: 'Zima', badgeEn: 'Winter' }], reason: null })
    expect(body.results[1]).toMatchObject({ code: 'gerlach', nameEn: 'Gerlach cottage', offers: [], reason: 'over_capacity' })
  })

  it('odrzuca błędne zapytania', async () => {
    const { GET } = await import('@/app/(frontend)/api/booking/[op]/route')
    const res = await GET(new Request('https://x/api/booking/search?arrival=2026-12-07&departure=2026-12-04&adults=2'), { params: Promise.resolve({ op: 'search' }) })
    expect(res.status).toBe(400)
  })
})
