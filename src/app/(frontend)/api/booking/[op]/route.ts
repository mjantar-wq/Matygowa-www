import { addDays, daysBetween, promoOn, type CalendarData } from '@/lib/availability'
import { getCalendar, getPromotions, getProperty, promoInSeason, searchStay } from '@/lib/icecoldres'
import { getUnitTiles } from '@/lib/unit-tiles'
import { DEFAULT_LOCALE, isLocale } from '@/i18n/locales'

/**
 * Pośrednik strony do publicznego API IceColdRes dla paska rezerwacji w przeglądarce (kontrakt:
 * docs/integracja-strony.md w IceColdRes). Odpowiedzi są buforowane 45 s, a domy przychodzą
 * od razu z kodem (`code` = slug domu w panelu), więc przeglądarka nie zna identyfikatorów IceColdRes.
 *
 * GET /api/booking/calendar?from=RRRR-MM-DD&days=1..93&season=lato|zima
 * GET /api/booking/search?arrival=&departure=&adults=&children=&ages=4,9&lang=pl&season=lato|zima
 *   (każdy dom z opisem do kafelka: zdjęcia, metraż, wyposażenie)
 * `season` to pora roku z przełącznika strony: promocje innego sezonu nie dają plakietek (rabat w cenie zostaje).
 */
const DATE = /^\d{4}-\d{2}-\d{2}$/
const CACHE = { 'Cache-Control': 'public, max-age=30, s-maxage=45' }
const bad = (error: string) => Response.json({ error }, { status: 400 })
const unavailable = () => Response.json({ error: 'unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })

function int(v: string | null, min: number, max: number, fallback?: number) {
  if (v === null || v === '') return fallback ?? null
  const n = Number(v)
  return Number.isInteger(n) && n >= min && n <= max ? n : null
}

async function calendar(url: URL) {
  const from = url.searchParams.get('from') ?? ''
  const days = int(url.searchParams.get('days'), 1, 93, 62)
  if (!DATE.test(from) || days === null) return bad('invalid_input')
  const [cal, promotions, property] = await Promise.all([getCalendar(from, days), getPromotions(), getProperty()])
  if (!cal || !property) return unavailable()
  const lang = url.searchParams.get('lang') === 'pl' ? 'pl' : 'en'
  const season = url.searchParams.get('season')
  const shown = promotions.filter((p) => promoInSeason(p.season, season))
  const data: CalendarData = {
    from: cal.from,
    today: cal.today,
    types: cal.types.flatMap((t) => {
      const code = property.unitTypes.find((u) => u.id === t.unitTypeId)?.code
      if (!code) return []
      return [
        {
          code,
          days: t.days.map((d, i) => {
            const date = addDays(cal.from, i)
            const promo = shown.find((p) => promoOn(p, date, t.unitTypeId))
            // bez cen za noc, jak w kalendarzu IceColdRes (Michał, 25.10.2026)
            return { ...d, promo: promo ? (lang === 'pl' ? promo.badge : promo.en.badge || promo.badge) : null }
          }),
        },
      ]
    }),
  }
  return Response.json(data, { headers: CACHE })
}

async function search(url: URL) {
  const q = url.searchParams
  const arrival = q.get('arrival') ?? ''
  const departure = q.get('departure') ?? ''
  const adults = int(q.get('adults'), 1, 20)
  const children = int(q.get('children'), 0, 20, 0)
  const ages = (q.get('ages') ?? '').split(',').filter(Boolean).map(Number)
  if (!DATE.test(arrival) || !DATE.test(departure) || departure <= arrival || adults === null || children === null) return bad('invalid_input')
  if (ages.length > children || ages.some((a) => !Number.isInteger(a) || a < 0 || a > 17)) return bad('invalid_input')
  const lang = q.get('lang') ?? ''
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE
  const [results, property] = await Promise.all([searchStay({ arrival, departure, adults, children, ages }), getProperty()])
  if (!results || !property) return unavailable()
  const tiles = await getUnitTiles(locale, property.unitTypes)
  const nights = daysBetween(arrival, departure)
  // domy w kolejności z panelu (kafelki powstają w tej kolejności); nieznane w panelu na końcu
  const rank = (code: string) => {
    const i = Object.keys(tiles).indexOf(code)
    return i < 0 ? Infinity : i
  }
  return Response.json(
    {
      nights,
      results: results.flatMap((r) => {
        const type = property.unitTypes.find((u) => u.id === r.unitTypeId)
        if (!type?.code) return []
        const offers = r.offers
          .filter((o) => o.available && o.total !== undefined)
          .map((o) => {
            const promo = o.items?.find((i) => i.promotion?.display && promoInSeason(i.promotion.display.season, q.get('season')))?.promotion?.display
            return { offerId: o.offerId, name: o.name, total: o.total!, badge: promo?.badge ?? null, badgeEn: promo?.en?.badge ?? null }
          })
          .sort((a, b) => a.total - b.total)
        // pierwszy powód, dla którego dom nie pasuje (np. za dużo osób, za krótki pobyt)
        const reason = r.free < 1 ? 'occupied' : offers.length ? null : (r.offers.flatMap((o) => o.unavailable ?? []).flatMap((u) => u.reasons)[0]?.code ?? 'unknown')
        return [{ code: type.code, name: type.name, nameEn: type.content?.en?.name ?? null, free: r.free, offers: r.free > 0 ? offers : [], reason, unit: tiles[type.code] ?? null }]
      }).sort((a, b) => rank(a.code) - rank(b.code)),
    },
    { headers: CACHE },
  )
}

export async function GET(request: Request, ctx: { params: Promise<{ op: string }> }) {
  const { op } = await ctx.params
  const url = new URL(request.url)
  if (op === 'calendar') return calendar(url)
  if (op === 'search') return search(url)
  return Response.json({ error: 'not_found' }, { status: 404 })
}
