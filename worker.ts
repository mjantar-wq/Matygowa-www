// Worker strony: obsługa żądań z OpenNext plus zadania zaplanowane (crons w wrangler.jsonc).
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- przy typecheck przed budowaniem pliku nie ma, po budowaniu jest
// @ts-ignore: plik powstaje dopiero przy budowaniu (opennextjs-cloudflare build)
import { default as handler } from './.open-next/worker.js'
import { MEDIA_PREFIX, serveMedia } from './src/edge/media'
import { cacheablePage, servePage } from './src/edge/pages'
import { CRON_TOKEN } from './src/lib/cron'

export default {
  // zdjęcia prosto z R2 i strony z bufora (src/edge); reszta jak dotąd przez OpenNext
  async fetch(request: Request, env: CloudflareEnv, ctx: ExecutionContext) {
    const { pathname } = new URL(request.url)
    if (pathname.startsWith(MEDIA_PREFIX)) {
      const res = await serveMedia(request, env, ctx)
      if (res) return res
    }
    if (cacheablePage(request)) return servePage(request, env, ctx, handler.fetch)
    return handler.fetch(request, env, ctx)
  },

  async scheduled(_event: ScheduledController, env: CloudflareEnv, ctx: ExecutionContext) {
    // trasę wołamy w tym samym izolacie, więc token z globalThis zna tylko to wywołanie
    const token = crypto.randomUUID()
    ;(globalThis as Record<string, unknown>)[CRON_TOKEN] = token
    try {
      const res: Response = await handler.fetch(
        new Request(
          `${(env as unknown as Record<string, string>).NEXT_PUBLIC_SITE_URL}/api/cron/opinie`,
          { method: 'POST', headers: { 'x-cron-token': token } },
        ),
        env,
        ctx,
      )
      console.log('cron opinie', res.status, await res.text())
    } finally {
      delete (globalThis as Record<string, unknown>)[CRON_TOKEN]
    }
  },
} satisfies ExportedHandler<CloudflareEnv>
