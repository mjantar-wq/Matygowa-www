// Worker strony: obsługa żądań z OpenNext plus zadania zaplanowane (crons w wrangler.jsonc).
// eslint-disable-next-line @typescript-eslint/ban-ts-comment -- przy typecheck przed budowaniem pliku nie ma, po budowaniu jest
// @ts-ignore: plik powstaje dopiero przy budowaniu (opennextjs-cloudflare build)
import { default as handler } from './.open-next/worker.js'
import { CRON_TOKEN } from './src/lib/cron'

export default {
  fetch: handler.fetch,

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
