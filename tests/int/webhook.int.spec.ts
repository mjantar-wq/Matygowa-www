import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { verify } from '@/lib/webhook'

const secret = 's3cret'
const body = '{"type":"content.changed","properties":["booking"],"topics":["pricing"],"at":"2026-10-25T07:00:00Z"}'
const sign = (t: number, b = body) => `t=${t},v1=${createHmac('sha256', secret).update(`${t}.${b}`).digest('hex')}`

describe('podpis webhooka IceColdRes', () => {
  const now = 1_793_000_000
  it('przyjmuje poprawny i świeży podpis', async () => {
    expect(await verify(sign(now - 10), body, secret, now)).toBe(true)
  })
  it('odrzuca podpis starszy niż 5 minut, zmienioną treść i brak nagłówka', async () => {
    expect(await verify(sign(now - 301), body, secret, now)).toBe(false)
    expect(await verify(sign(now), body.replace('pricing', 'photos'), secret, now)).toBe(false)
    expect(await verify(null, body, secret, now)).toBe(false)
    expect(await verify(sign(now), body, 'inny', now)).toBe(false)
  })
  it('ten sam podpis co IceColdRes (wektor z apps/api/test/site-webhook.test.ts)', async () => {
    const v1 = 'd53e5d70b3a71d018bcdd46dcc93901f36a7d2574dc71f783ca7b7a3483e33d5'
    expect(await verify(`t=1700000000,v1=${v1}`, '{}', 'sekret', 1_700_000_000)).toBe(true)
  })
})
