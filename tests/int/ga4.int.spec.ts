import { afterEach, describe, expect, it } from 'vitest'
import { ga4Config } from '@/lib/ga4'

const KEYS = ['GA4_PROPERTY_ID', 'GA4_SERVICE_ACCOUNT_JSON'] as const
afterEach(() => KEYS.forEach((k) => delete process.env[k]))

describe('ga4Config', () => {
  it('bez zmiennych statystyki są wyłączone', () => {
    expect(ga4Config()).toBeNull()
  })
  it('niepoprawny JSON konta usługi nie wywala panelu', () => {
    process.env.GA4_PROPERTY_ID = '123'
    process.env.GA4_SERVICE_ACCOUNT_JSON = 'nie-json'
    expect(ga4Config()).toBeNull()
  })
  it('przyjmuje numer usługi z prefiksem properties/', () => {
    process.env.GA4_PROPERTY_ID = 'properties/123456'
    process.env.GA4_SERVICE_ACCOUNT_JSON = JSON.stringify({ client_email: 'a@b.iam.gserviceaccount.com', private_key: 'k' })
    expect(ga4Config()?.propertyId).toBe('123456')
  })
})

describe('ga4Config: odporność na sposób wklejenia sekretu', () => {
  const email = 'a@b.iam.gserviceaccount.com'
  const set = (raw: string) => {
    process.env.GA4_PROPERTY_ID = '1'
    process.env.GA4_SERVICE_ACCOUNT_JSON = raw
  }
  it('JSON z surowymi znakami nowej linii w kluczu', () => {
    set(`{"client_email": "${email}",\n"private_key": "-----BEGIN PRIVATE KEY-----\nAAA\n-----END PRIVATE KEY-----\n"}`)
    expect(ga4Config()?.account.client_email).toBe(email)
    expect(ga4Config()?.account.private_key).toContain('\nAAA\n')
  })
  it('JSON w base64', () => {
    set(btoa(JSON.stringify({ client_email: email, private_key: 'k' })))
    expect(ga4Config()?.account.client_email).toBe(email)
  })
  it('sam początek pliku („{”) to nadal błąd', () => {
    set('{')
    expect(ga4Config()).toBeNull()
  })
})

describe('ga4Config: uszkodzony początek i koniec pliku', () => {
  const email = 'a@b.iam.gserviceaccount.com'
  const body = 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASC'.repeat(5)
  it('bez początkowego {" i końcowego } (jak po wklejeniu do Cloudflare)', () => {
    process.env.GA4_PROPERTY_ID = '1'
    process.env.GA4_SERVICE_ACCOUNT_JSON = `type": "service_account", "client_email": "${email}", "private_key": "-----BEGIN PRIVATE KEY-----\\n${body}\\n-----END PRIVATE KEY-----\\n", "universe_domain": "googleapis.com"`
    const cfg = ga4Config()
    expect(cfg?.account.client_email).toBe(email)
    expect(cfg?.account.private_key).toContain(body.slice(0, 64))
    expect(cfg?.account.private_key).not.toContain('\\n')
  })
})
