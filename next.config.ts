import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import { ENABLED_LOCALES } from './src/i18n/locales'
import { localeRedirects, localeRewrites } from './src/i18n/routes'

// Środowisko testowe (matygowa.audiowizard.pl) nie może trafić do wyszukiwarek; produkcja ustawi SITE_INDEXABLE=true.
const indexable = process.env.SITE_INDEXABLE === 'true'

const nextConfig: NextConfig = {
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
    return [{ source: '/admin/:path*', destination: '/panel/:path*', permanent: false }, ...localeRedirects(ENABLED_LOCALES)]
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

  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
