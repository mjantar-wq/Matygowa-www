import fs from 'fs'
import path from 'path'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'
import { r2Storage } from '@payloadcms/storage-r2'

import { pl } from '@payloadcms/translations/languages/pl'
import { en } from '@payloadcms/translations/languages/en'
import { Attractions } from './collections/Attractions'
import { Media } from './collections/Media'
import { News } from './collections/News'
import { Offers } from './collections/Offers'
import { Pages } from './collections/Pages'
import { Testimonials } from './collections/Testimonials'
import { Units } from './collections/Units'
import { Users } from './collections/Users'
import { Settings } from './globals/Settings'
import { DEFAULT_LOCALE, ENABLED_LOCALES, LOCALES } from './i18n/locales'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const realpath = (value: string) => {
  try {
    return fs.existsSync(value) ? fs.realpathSync(value) : undefined
  } catch {
    return undefined
  }
}

const isCLI = process.argv.some((value) => {
  const resolved = realpath(value)
  if (!resolved) return false
  return (
    resolved.endsWith(path.join('payload', 'bin.js')) ||
    resolved.endsWith(path.join('next', 'dist', 'bin', 'next'))
  )
})
const isProduction = process.env.NODE_ENV === 'production'

const createLog =
  (level: string, fn: typeof console.log) => (objOrMsg: object | string, msg?: string) => {
    if (typeof objOrMsg === 'string') {
      fn(JSON.stringify({ level, msg: objOrMsg }))
    } else {
      fn(JSON.stringify({ level, ...objOrMsg, msg: msg ?? (objOrMsg as { msg?: string }).msg }))
    }
  }

const cloudflareLogger = {
  level: process.env.PAYLOAD_LOG_LEVEL || 'info',
  trace: createLog('trace', console.debug),
  debug: createLog('debug', console.debug),
  info: createLog('info', console.log),
  warn: createLog('warn', console.warn),
  error: createLog('error', console.error),
  fatal: createLog('fatal', console.error),
  silent: () => {},
} as any // Use PayloadLogger type when it's exported

const cloudflare =
  isCLI || !isProduction
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true })

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: { titleSuffix: ' · Matygowa Osada' },
  },
  // panel po polsku (koncepcja F2), angielski do wyboru na koncie
  i18n: { supportedLanguages: { pl, en }, fallbackLanguage: 'pl' },
  localization: {
    locales: ENABLED_LOCALES.map((code) => ({ code, label: LOCALES[code].label, rtl: LOCALES[code].dir === 'rtl' })),
    defaultLocale: DEFAULT_LOCALE,
    fallback: true,
  },
  collections: [Pages, Units, News, Attractions, Offers, Testimonials, Media, Users],
  globals: [Settings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteD1Adapter({
    binding: cloudflare.env.D1,
    // schemat tylko z migracji (src/migrations), także lokalnie: jedna droga zmian w dev, CI i na Cloudflare
    push: false,
  }),
  logger: isProduction ? cloudflareLogger : undefined,
  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
  ],
})

// Adapted from https://github.com/opennextjs/opennextjs-cloudflare/blob/d00b3a13e42e65aad76fba41774815726422cc39/packages/cloudflare/src/api/cloudflare-context.ts#L328C36-L328C46
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        environment: process.env.PAYLOAD_REMOTE_BINDINGS === 'true' ? 'remote' : process.env.CLOUDFLARE_ENV,
        // zdalne D1/R2 tylko na życzenie (migracje przy wdrożeniu); build i CI działają na lokalnych
        remoteBindings: process.env.PAYLOAD_REMOTE_BINDINGS === 'true',
      } satisfies GetPlatformProxyOptions),
  )
}
