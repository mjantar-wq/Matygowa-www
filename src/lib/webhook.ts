/** Podpis webhooka IceColdRes: t=<unix>,v1=<hex HMAC-SHA256(secret, t + "." + body)>, ważny 5 minut. */
const MAX_AGE = 300

async function hmac(secret: string, data: string) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(data)))
  return Array.from(sig, (b) => b.toString(16).padStart(2, '0')).join('')
}

/** Porównanie w stałym czasie (długość podpisu jest jawna). */
function same(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function verify(header: string | null, body: string, secret: string, now = Math.floor(Date.now() / 1000)) {
  const parts = Object.fromEntries((header ?? '').split(',').map((p) => p.trim().split('=') as [string, string]))
  const t = Number(parts.t)
  if (!parts.v1 || !Number.isInteger(t) || Math.abs(now - t) > MAX_AGE) return false
  return same(parts.v1.toLowerCase(), await hmac(secret, `${parts.t}.${body}`))
}


/** Nagłówek X-IceColdRes-Signature dla zapytań strony do IceColdRes (ten sam schemat co webhook, sekret SITE_API_SECRET). */
export async function sign(body: string, secret: string, now = Math.floor(Date.now() / 1000)) {
  return `t=${now},v1=${await hmac(secret, `${now}.${body}`)}`
}
