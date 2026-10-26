import type { CollectionConfig, GlobalConfig } from 'payload'
import { bumpContentVersion } from '@/edge/version'

/**
 * Po zapisie albo usunięciu w panelu (i przy imporcie treści) strony z bufora (src/edge/pages.ts) składają się od nowa.
 * Kubeł R2 z kontekstu Cloudflare w payload.config.ts: w Workerze ten sam, w poleceniach Payload zdalny albo lokalny.
 */
export function contentVersionHooks(bucket: R2Bucket) {
  const bump = async () => {
    try {
      await bumpContentVersion(bucket)
    } catch (err) {
      console.error(JSON.stringify({ level: 'error', msg: 'content_version_bump_failed', err: String(err) }))
    }
  }
  const after = async <T,>({ doc }: { doc: T }) => (await bump(), doc)
  return {
    collection: (c: CollectionConfig): CollectionConfig => ({
      ...c,
      hooks: { ...c.hooks, afterChange: [...(c.hooks?.afterChange ?? []), after], afterDelete: [...(c.hooks?.afterDelete ?? []), after] },
    }),
    global: (g: GlobalConfig): GlobalConfig => ({ ...g, hooks: { ...g.hooks, afterChange: [...(g.hooks?.afterChange ?? []), after] } }),
  }
}
