import { revalidatePath } from 'next/cache'
import { payload } from '@/lib/cms'
import { syncReviews } from '@/lib/reviews'
import { CRON_TOKEN } from '@/lib/cron'

/**
 * Wywoływane tylko z handlera scheduled w worker.ts (w tym samym izolacie, z jednorazowym tokenem w globalThis),
 * więc z zewnątrz zawsze odpowiada 404.
 */
export async function POST(request: Request) {
  const token = (globalThis as Record<string, unknown>)[CRON_TOKEN]
  if (typeof token !== 'string' || request.headers.get('x-cron-token') !== token)
    return new Response(null, { status: 404 })
  const stats = await syncReviews(await payload())
  if (stats.created || stats.updated) revalidatePath('/', 'layout')
  return Response.json({ ok: true, ...stats })
}
