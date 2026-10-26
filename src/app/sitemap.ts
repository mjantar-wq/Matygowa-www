import type { MetadataRoute } from 'next'
import { ENABLED_LOCALES } from '@/i18n/locales'
import { href, ROUTES, type RouteKey } from '@/i18n/routes'
import { findMany } from '@/lib/cms'
import { siteUrl as site } from '@/lib/page'
import type { Attraction, News, Page, Unit } from '@/payload-types'

// treści z panelu: budowana przy każdym żądaniu, nie przy wdrożeniu (baza z budowania jest pusta)
export const dynamic = 'force-dynamic'

/** Wszystkie podstrony z ROUTES; dokumenty (bez strony zbiorczej), domy, aktualności i atrakcje dochodzą z panelu. */
const STATIC = (Object.keys(ROUTES) as RouteKey[]).filter((r) => r !== 'documents')

/** Mapa witryny XML z wersjami językowymi każdej podstrony (koncepcja F6). */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pl = ENABLED_LOCALES[0]!
  const [units, news, attractions, pages] = await Promise.all([
    findMany<Unit>('units', pl, { depth: 0, sort: 'order' }),
    findMany<News>('news', pl, { depth: 0, where: { publishedAt: { less_than_equal: new Date().toISOString() } } }),
    findMany<Attraction>('attractions', pl, { depth: 0 }),
    findMany<Page>('pages', pl, { depth: 0, where: { kind: { equals: 'document' } } }),
  ])
  const entry = (route: RouteKey, slug?: string, updatedAt?: string | null): MetadataRoute.Sitemap[number] => ({
    url: site() + href(pl, route, slug),
    lastModified: updatedAt ? new Date(updatedAt) : undefined,
    alternates: { languages: Object.fromEntries(ENABLED_LOCALES.map((l) => [l, site() + href(l, route, slug)])) },
  })
  return [
    ...STATIC.map((route) => entry(route)),
    ...units.map((u) => entry('houses', u.slug, u.updatedAt)),
    ...news.map((n) => entry('news', n.slug, n.updatedAt)),
    ...attractions.filter((a) => a.slug).map((a) => entry('surroundings', a.slug!, a.updatedAt)),
    ...pages.map((p) => entry('documents', p.slug, p.updatedAt)),
  ]
}
