import { getCloudflareContext } from '@opennextjs/cloudflare'
import { revalidateTag } from 'next/cache'
import { bumpContentVersion } from '@/edge/version'
import { TOPICS, topicTag, type Topic } from '@/lib/icecoldres'
import { verify } from '@/lib/webhook'

/**
 * Webhook IceColdRes „treść zmieniona” (kontrakt: docs/integracja-strony.md w IceColdRes, sekcja Webhook).
 * Podpis: X-IceColdRes-Signature: t=<unix>,v1=<hex HMAC-SHA256(SITE_WEBHOOK_SECRET, t + "." + body)>;
 * podpis starszy niż 5 minut odrzucamy. Po zmianie odświeżamy bufory zapytań z tagami tematów.
 */
export async function POST(request: Request) {
  const secret = process.env.SITE_WEBHOOK_SECRET
  if (!secret) return Response.json({ error: 'not_configured' }, { status: 503 })
  const body = await request.text()
  if (!(await verify(request.headers.get('x-icecoldres-signature'), body, secret))) {
    return Response.json({ error: 'invalid_signature' }, { status: 401 })
  }
  let topics: Topic[] = []
  try {
    const event = JSON.parse(body) as { type?: string; topics?: string[] }
    if (event.type !== 'content.changed') return Response.json({ ok: true, ignored: event.type ?? null })
    topics = (event.topics ?? []).filter((t): t is Topic => (TOPICS as readonly string[]).includes(t))
  } catch {
    return Response.json({ error: 'invalid_body' }, { status: 400 })
  }
  // nieznany albo pusty temat: odświeżamy wszystko z IceColdRes
  const tags = topics.length ? topics.map(topicTag) : ['icecoldres']
  for (const tag of tags) revalidateTag(tag, { expire: 0 })
  // gotowe strony w buforze (src/edge/pages.ts) też mają się złożyć od nowa
  await bumpContentVersion((await getCloudflareContext({ async: true })).env.R2).catch(() => {})
  return Response.json({ ok: true, revalidated: tags })
}
