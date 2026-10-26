import { subscribeNewsletter } from '@/lib/icecoldres'

/**
 * Formularz zapisu na newsletter w stopce → IceColdRes (zgoda, e-mail z potwierdzeniem, wypisanie po jego stronie).
 * POST { email, lang, consentId, utm?, website? }; `website` to pole-pułapka na boty (puste u ludzi).
 * Odpowiedź 202 nie zdradza, czy adres już jest na liście (tak samo odpowiada IceColdRes).
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const

export async function POST(request: Request) {
  let b: { email?: unknown; lang?: unknown; consentId?: unknown; utm?: Record<string, unknown>; website?: unknown }
  try {
    b = await request.json()
  } catch {
    return Response.json({ error: 'invalid_body' }, { status: 400 })
  }
  if (typeof b.website === 'string' && b.website) return Response.json({ status: 'pending' }, { status: 202 })
  const email = typeof b.email === 'string' ? b.email.trim() : ''
  const consentId = typeof b.consentId === 'string' ? b.consentId : ''
  if (!EMAIL.test(email) || email.length > 254 || !/^[a-z0-9-]{3,50}$/.test(consentId)) return Response.json({ error: 'invalid_input' }, { status: 400 })
  const utm = Object.fromEntries(UTM.flatMap((k) => (typeof b.utm?.[k] === 'string' && b.utm[k] ? [[k, (b.utm[k] as string).slice(0, 100)]] : [])))
  const status = await subscribeNewsletter(
    { email, lang: b.lang === 'pl' ? 'pl' : 'en', consentId, source: 'www-stopka', ...(Object.keys(utm).length ? { utm } : {}) },
    request.headers.get('cf-connecting-ip'),
  )
  if (status === 202) return Response.json({ status: 'pending' }, { status: 202 })
  if (status === 400) return Response.json({ error: 'invalid_input' }, { status: 400 })
  if (status === 429) return Response.json({ error: 'too_many_requests' }, { status: 429 })
  console.error(JSON.stringify({ level: 'error', msg: 'newsletter_failed', status }))
  return Response.json({ error: 'unavailable' }, { status: 503 })
}
