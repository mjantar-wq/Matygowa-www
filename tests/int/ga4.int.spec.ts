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
