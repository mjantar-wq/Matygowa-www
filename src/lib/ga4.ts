/**
 * Statystyki z GA4 (Google Analytics Data API) do panelu: /panel/statystyki.
 * GTM nie przechowuje danych, tylko wysyła zdarzenia (page_view, booking_click, contact_click, booking_search) do GA4, więc liczby czytamy stamtąd.
 * Konfiguracja (docs/pomiar.md): GA4_PROPERTY_ID (vars, sam numer usługi) i GA4_SERVICE_ACCOUNT_JSON (sekret Workera, klucz konta usługi
 * z rolą „Przeglądający” w usłudze GA4). Bez nich panel pokazuje instrukcję zamiast liczb.
 */

const SCOPE = 'https://www.googleapis.com/auth/analytics.readonly'
const TOKEN_URL = 'https://oauth2.googleapis.com/token'

type ServiceAccount = { client_email: string; private_key: string }

export type Ga4Config = { propertyId: string; account: ServiceAccount }

/** Dlaczego statystyki są wyłączone: brak zmiennej, brak sekretu albo sekret, którego nie da się odczytać jako klucz konta usługi. */
export type Ga4Problem = 'no_property' | 'no_key' | 'bad_key'

function parseAccount(raw: string): ServiceAccount | null {
  let text = raw.trim()
  // sekret wklejony jako base64 albo w cudzysłowie (np. po skopiowaniu z terminala)
  if (!text.startsWith('{')) {
    try {
      text = atob(text.replace(/^"|"$/g, ''))
    } catch {
      /* zostaje oryginał */
    }
  }
  let email: string | undefined
  let key: string | undefined
  try {
    const account = JSON.parse(text) as ServiceAccount
    email = account.client_email
    key = account.private_key
  } catch {
    // pole „Value” w Cloudflare potrafi wstawić surowe znaki nowej linii w środku tekstu, czego JSON.parse nie przyjmuje:
    // wyciągamy dwa potrzebne pola wprost z tekstu
    email = /"client_email"\s*:\s*"([^"]+)"/.exec(text)?.[1]
    key = /"private_key"\s*:\s*"([^"]+)"/.exec(text)?.[1]
  }
  if (!email || !key) return null
  // klucz ma być w PEM z prawdziwymi znakami nowej linii (w JSON-ie zapisane jako \n)
  return { client_email: email, private_key: key.replace(/\\n/g, '\n') }
}

/** Co wiemy o zapisanym sekrecie, bez ujawniania treści: do komunikatu w panelu. */
export function ga4KeyHint(): string {
  const raw = process.env.GA4_SERVICE_ACCOUNT_JSON ?? ''
  return `długość ${raw.length} znaków, zaczyna się od „${raw.trim().slice(0, 1)}”, kończy na „${raw.trim().slice(-1)}”, zawiera client_email: ${raw.includes('client_email') ? 'tak' : 'nie'}, private_key: ${raw.includes('private_key') ? 'tak' : 'nie'}`
}

export function ga4Setup(): { config: Ga4Config } | { problem: Ga4Problem } {
  const propertyId = process.env.GA4_PROPERTY_ID?.trim().replace(/^properties\//, '')
  const raw = process.env.GA4_SERVICE_ACCOUNT_JSON
  if (!propertyId) return { problem: 'no_property' }
  if (!raw?.trim()) return { problem: 'no_key' }
  const account = parseAccount(raw)
  return account ? { config: { propertyId, account } } : { problem: 'bad_key' }
}

export function ga4Config(): Ga4Config | null {
  const setup = ga4Setup()
  return 'config' in setup ? setup.config : null
}

const b64url = (data: ArrayBuffer | string) => {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : new Uint8Array(data)
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function signJwt(account: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const head = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const body = b64url(JSON.stringify({ iss: account.client_email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }))
  const pem = account.private_key.replace(/-----(BEGIN|END) PRIVATE KEY-----/g, '').replace(/\s+/g, '')
  const der = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0))
  const key = await crypto.subtle.importKey('pkcs8', der, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(`${head}.${body}`))
  return `${head}.${body}.${b64url(sig)}`
}

let cached: { token: string; exp: number } | null = null

async function accessToken(account: ServiceAccount): Promise<string> {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: await signJwt(account) }),
  })
  if (!res.ok) throw new Error(`Google OAuth ${res.status}: ${(await res.text()).slice(0, 200)}`)
  const json = (await res.json()) as { access_token: string; expires_in: number }
  cached = { token: json.access_token, exp: Date.now() + json.expires_in * 1000 }
  return json.access_token
}

type Row = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] }
type Report = { rows?: Row[]; totals?: Row[] }

const range = (days: number) => [{ startDate: `${days}daysAgo`, endDate: 'today' }]
const eventFilter = (...names: string[]) => ({
  filter: { fieldName: 'eventName', inListFilter: { values: names } },
})

export type Stats = {
  days: number
  totals: { users: number; sessions: number; views: number; bookingClicks: number; contactClicks: number; searches: number }
  daily: { date: string; sessions: number }[]
  channels: { name: string; sessions: number }[]
  pages: { path: string; views: number }[]
  bookingLocations: { name: string; count: number }[]
  contacts: { name: string; count: number }[]
}

const num = (r: Row | undefined, i: number) => Number(r?.metricValues?.[i]?.value ?? 0)
const dim = (r: Row, i = 0) => r.dimensionValues?.[i]?.value ?? ''

/** Jedno zapytanie zbiorcze (batchRunReports) o liczby za ostatnie `days` dni. */
export async function fetchStats(cfg: Ga4Config, days: number): Promise<Stats> {
  const token = await accessToken(cfg.account)
  const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(cfg.propertyId)}:batchRunReports`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [
        // 0: sumy
        { dateRanges: range(days), metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }] },
        // 1: zdarzenia wg nazwy (przejścia do rezerwacji, kontakt, wyszukiwania)
        {
          dateRanges: range(days),
          dimensions: [{ name: 'eventName' }],
          metrics: [{ name: 'eventCount' }],
          dimensionFilter: eventFilter('booking_click', 'contact_click', 'booking_search'),
        },
        // 2: dzień po dniu
        {
          dateRanges: range(days),
          dimensions: [{ name: 'date' }],
          metrics: [{ name: 'sessions' }],
          orderBys: [{ dimension: { dimensionName: 'date' } }],
        },
        // 3: źródła ruchu
        {
          dateRanges: range(days),
          dimensions: [{ name: 'sessionDefaultChannelGroup' }],
          metrics: [{ name: 'sessions' }],
          orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
          limit: 8,
        },
        // 4: najczęściej oglądane strony
        {
          dateRanges: range(days),
          dimensions: [{ name: 'pagePath' }],
          metrics: [{ name: 'screenPageViews' }],
          orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
          limit: 10,
        },
      ],
    }),
  })
  if (!res.ok) throw new Error(`GA4 ${res.status}: ${(await res.text()).slice(0, 300)}`)
  const reports = ((await res.json()) as { reports?: Report[] }).reports ?? []

  const events = new Map((reports[1]?.rows ?? []).map((r) => [dim(r), num(r, 0)]))
  const t = reports[0]?.rows?.[0]

  // podział według parametrów zdarzeń: osobne zapytanie, bo wymiary niestandardowe trzeba zarejestrować w GA4 (docs/pomiar.md)
  const [bookingLocations, contacts] = await Promise.all([
    customBreakdown(cfg, token, days, 'booking_location', 'booking_click'),
    customBreakdown(cfg, token, days, 'contact_method', 'contact_click'),
  ])

  return {
    days,
    totals: {
      users: num(t, 0),
      sessions: num(t, 1),
      views: num(t, 2),
      bookingClicks: events.get('booking_click') ?? 0,
      contactClicks: events.get('contact_click') ?? 0,
      searches: events.get('booking_search') ?? 0,
    },
    daily: (reports[2]?.rows ?? []).map((r) => ({ date: dim(r), sessions: num(r, 0) })),
    channels: (reports[3]?.rows ?? []).map((r) => ({ name: dim(r), sessions: num(r, 0) })),
    pages: (reports[4]?.rows ?? []).map((r) => ({ path: dim(r), views: num(r, 0) })),
    bookingLocations,
    contacts,
  }
}

async function customBreakdown(cfg: Ga4Config, token: string, days: number, param: string, event: string) {
  try {
    const res = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${encodeURIComponent(cfg.propertyId)}:runReport`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dateRanges: range(days),
        dimensions: [{ name: `customEvent:${param}` }],
        metrics: [{ name: 'eventCount' }],
        dimensionFilter: eventFilter(event),
        orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
        limit: 10,
      }),
    })
    // 400: wymiar niestandardowy jeszcze niezarejestrowany w GA4, to nie jest błąd całej strony
    if (!res.ok) return []
    return (((await res.json()) as Report).rows ?? []).map((r) => ({ name: dim(r), count: num(r, 0) }))
  } catch {
    return []
  }
}
