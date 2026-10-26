import type { MetadataRoute } from 'next'

/** Produkcja (SITE_INDEXABLE=true) wpuszcza wyszukiwarki i podaje mapę witryny; strona testowa jest zamknięta. */
export default function robots(): MetadataRoute.Robots {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://matygowa.audiowizard.pl'
  if (process.env.SITE_INDEXABLE !== 'true') return { rules: { userAgent: '*', disallow: '/' } }
  return { rules: { userAgent: '*', allow: '/', disallow: ['/panel', '/api/'] }, sitemap: `${site}/sitemap.xml`, host: site }
}
