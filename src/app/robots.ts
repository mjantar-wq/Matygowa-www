import type { MetadataRoute } from 'next'
import { siteUrl } from '@/lib/page'

/** Produkcja (SITE_INDEXABLE=true) wpuszcza wyszukiwarki i podaje mapę witryny; strona testowa jest zamknięta. */
export default function robots(): MetadataRoute.Robots {
  if (process.env.SITE_INDEXABLE !== 'true') return { rules: { userAgent: '*', disallow: '/' } }
  return { rules: { userAgent: '*', allow: '/', disallow: ['/panel', '/api/'] }, sitemap: `${siteUrl()}/sitemap.xml` }
}
