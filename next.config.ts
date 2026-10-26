import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import { ENABLED_LOCALES } from './src/i18n/locales'
import { localeRedirects, localeRewrites } from './src/i18n/routes'
import legacyRedirects from './content/redirects.json'

// Next.js obcina końcowy ukośnik, zanim porówna reguły, więc adresy z WordPressa zapisujemy bez niego
const noSlash = (p: string) => (p.length > 1 ? p.replace(/\/$/, '') : p)

// Środowisko testowe (matygowa.audiowizard.pl) nie może trafić do wyszukiwarek; produkcja ustawi SITE_INDEXABLE=true.
const indexable = process.env.SITE_INDEXABLE === 'true'

const nextConfig: NextConfig = {
  // przy budowaniu każdy proces Next uruchamia lokalny workerd z tą samą bazą .wrangler/state;
  // kilka naraz kończyło się „database is locked: SQLITE_BUSY” (wdrożenie po #29), więc jeden proces
  experimental: { cpus: 1 },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  // Packages with Cloudflare Workers (workerd) specific code
  // Read more: https://opennext.js.org/cloudflare/howtos/workerd
  serverExternalPackages: ['jose', 'pg-cloudflare'],

  // Polskie adresy bez prefiksu i tłumaczone segmenty (/domy/hawran → /pl/houses/hawran), src/i18n/routes.ts
  async rewrites() {
    return { beforeFiles: localeRewrites(ENABLED_LOCALES), afterFiles: [], fallback: [] }
  },
  async redirects() {
    // panel treści jest pod /panel (domyślny /admin Payloada zostaje tylko jako przekierowanie)
    return [
      { source: '/admin/:path*', destination: '/panel/:path*', permanent: false },
      // stare adresy obecnej strony (content/redirects.json, wątek treści)
      ...legacyRedirects.map((r) => ({ source: noSlash(r.from), destination: noSlash(r.to), permanent: r.status === 301 })),
      ...localeRedirects(ENABLED_LOCALES),
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          ...(indexable ? [] : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]),
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
        ],
      },
      // panelu nie da się osadzić w ramce (clickjacking)
      { source: '/panel/:path*', headers: [{ key: 'Content-Security-Policy', value: "frame-ancestors 'self'" }] },
    ]
  },

  webpack: (webpackConfig, { isServer, dev }) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // Pliki JS przeglądarki bez nawiasów z nazw katalogów tras ((frontend), [locale]): część proxy i antywirusów
    // przepisuje je na %28…%29, a Workers Static Assets odsyła wtedy 307 w pętli i strona nie hydratuje się.
    if (!isServer && !dev) {
      const output = webpackConfig.output
      const safe = (template: unknown) => (pathData: { chunk?: { name?: string | null } }, assetInfo: unknown) => {
        const resolved = typeof template === 'function' ? template(pathData, assetInfo) : template
        const name = pathData.chunk?.name
        return name && /[[\]()]/.test(name) ? String(resolved).replace('[name]', name.replace(/[[\]()]/g, '_')) : resolved
      }
      output.filename = safe(output.filename)
      output.chunkFilename = safe(output.chunkFilename)
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
