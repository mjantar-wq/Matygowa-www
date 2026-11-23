import type { AdminViewServerProps } from 'payload'
import { Gutter } from '@payloadcms/ui'
import { fetchStats, ga4Config, type Stats } from '@/lib/ga4'

const PERIODS = [7, 28, 90] as const
const nf = new Intl.NumberFormat('pl-PL')

const card: React.CSSProperties = { border: '1px solid var(--theme-elevation-150)', borderRadius: 8, padding: '16px 20px', background: 'var(--theme-elevation-50)' }
const th: React.CSSProperties = { textAlign: 'left', padding: '6px 8px', fontWeight: 600, borderBottom: '1px solid var(--theme-elevation-150)' }
const td: React.CSSProperties = { padding: '6px 8px', borderBottom: '1px solid var(--theme-elevation-100)' }

function Tile({ label, value, hint }: { label: string; value: number; hint?: string }) {
  return (
    <div style={card}>
      <div style={{ fontSize: 13, opacity: 0.7 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 600, lineHeight: 1.3 }}>{nf.format(value)}</div>
      {hint ? <div style={{ fontSize: 12, opacity: 0.6 }}>{hint}</div> : null}
    </div>
  )
}

function Table({ title, head, rows }: { title: string; head: [string, string]; rows: [string, number][] }) {
  return (
    <div style={card}>
      <h3 style={{ margin: '0 0 8px' }}>{title}</h3>
      {rows.length === 0 ? (
        <p style={{ opacity: 0.6, margin: 0 }}>Brak danych w tym okresie.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr>
              <th style={th}>{head[0]}</th>
              <th style={{ ...th, textAlign: 'right' }}>{head[1]}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, n]) => (
              <tr key={name}>
                <td style={td}>{name || '(brak)'}</td>
                <td style={{ ...td, textAlign: 'right' }}>{nf.format(n)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function Chart({ daily }: { daily: Stats['daily'] }) {
  const max = Math.max(1, ...daily.map((d) => d.sessions))
  return (
    <div style={card}>
      <h3 style={{ margin: '0 0 12px' }}>Sesje dzień po dniu</h3>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 120 }} role="img" aria-label="Wykres liczby sesji w kolejnych dniach">
        {daily.map((d) => (
          <div
            key={d.date}
            title={`${d.date.slice(6)}.${d.date.slice(4, 6)}: ${d.sessions}`}
            style={{ flex: 1, height: `${Math.max(2, (d.sessions / max) * 100)}%`, background: 'var(--theme-success-500, #3a7)', borderRadius: '2px 2px 0 0' }}
          />
        ))}
      </div>
    </div>
  )
}

function Setup() {
  return (
    <div style={card}>
      <h3 style={{ margin: '0 0 8px' }}>Statystyki nie są jeszcze połączone z Google Analytics</h3>
      <p>
        GTM sam nie przechowuje danych: wysyła zdarzenia strony do Google Analytics 4, a ten panel czyta z niego liczby. Do połączenia potrzebne są dwie wartości w
        ustawieniach Workera <code>matygowa-www</code> (Cloudflare → Settings → Variables and Secrets):
      </p>
      <ul>
        <li>
          <code>GA4_PROPERTY_ID</code>: numer usługi GA4 (Administracja → Ustawienia usługi → Identyfikator usługi).
        </li>
        <li>
          <code>GA4_SERVICE_ACCOUNT_JSON</code> (typ Secret): cały plik JSON klucza konta usługi Google Cloud z włączonym „Google Analytics Data API”. Adres konta
          usługi trzeba dodać w GA4 (Administracja → Zarządzanie dostępem do usługi) z rolą „Przeglądający”.
        </li>
      </ul>
      <p style={{ margin: 0 }}>Szczegóły: docs/pomiar.md, część „Statystyki w panelu”.</p>
    </div>
  )
}

export async function Statystyki({ searchParams }: AdminViewServerProps) {
  const cfg = ga4Config()
  const requested = Number(Array.isArray(searchParams?.dni) ? searchParams.dni[0] : searchParams?.dni)
  const days = (PERIODS as readonly number[]).includes(requested) ? requested : 28

  let stats: Stats | null = null
  let error: string | null = null
  if (cfg) {
    try {
      stats = await fetchStats(cfg, days)
    } catch (err) {
      console.error(JSON.stringify({ level: 'error', msg: 'ga4_stats_failed', err: String(err) }))
      error = 'Nie udało się pobrać danych z Google Analytics. Sprawdź dostęp konta usługi do usługi GA4 i włączony Data API.'
    }
  }

  return (
    <Gutter>
      <h1>Statystyki strony</h1>
      <p style={{ maxWidth: 760, opacity: 0.8 }}>
        Dane z Google Analytics 4, zbierane przez Google Tag Manager. Liczą tylko gości, którzy zaakceptowali cookies analityczne w banerze, więc rzeczywisty ruch
        jest wyższy. Dane z ostatniego dnia mogą dochodzić z opóźnieniem.
      </p>
      {cfg ? (
        <nav aria-label="Okres" style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
          {PERIODS.map((p) => (
            <a
              key={p}
              href={`?dni=${p}`}
              aria-current={p === days ? 'page' : undefined}
              style={{ padding: '4px 12px', borderRadius: 16, border: '1px solid var(--theme-elevation-300)', textDecoration: 'none', fontWeight: p === days ? 700 : 400, background: p === days ? 'var(--theme-elevation-150)' : 'transparent', color: 'inherit' }}
            >
              {p} dni
            </a>
          ))}
        </nav>
      ) : null}
      {!cfg ? <Setup /> : null}
      {error ? <div style={{ ...card, borderColor: 'var(--theme-error-500, #c33)' }}>{error}</div> : null}
      {stats ? (
        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))' }}>
            <Tile label="Goście" value={stats.totals.users} />
            <Tile label="Sesje" value={stats.totals.sessions} />
            <Tile label="Odsłony stron" value={stats.totals.views} />
            <Tile label="Wyszukiwania terminu" value={stats.totals.searches} hint="booking_search" />
            <Tile label="Przejścia do rezerwacji" value={stats.totals.bookingClicks} hint="booking_click" />
            <Tile label="Kliknięcia w kontakt" value={stats.totals.contactClicks} hint="telefon, e-mail, WhatsApp" />
          </div>
          <Chart daily={stats.daily} />
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            <Table title="Źródła ruchu" head={['Kanał', 'Sesje']} rows={stats.channels.map((c) => [c.name, c.sessions])} />
            <Table title="Najczęściej oglądane strony" head={['Adres', 'Odsłony']} rows={stats.pages.map((p) => [p.path, p.views])} />
            <Table title="Skąd przejścia do rezerwacji" head={['Miejsce', 'Kliknięcia']} rows={stats.bookingLocations.map((b) => [b.name, b.count])} />
            <Table title="Jak goście się kontaktują" head={['Sposób', 'Kliknięcia']} rows={stats.contacts.map((c) => [c.name, c.count])} />
          </div>
        </div>
      ) : null}
    </Gutter>
  )
}
