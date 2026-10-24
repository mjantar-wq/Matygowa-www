import { DEFAULT_LOCALE, type Locale } from './locales'

/**
 * Podstrony strony. Klucz to nazwa katalogu w src/app/(frontend)/[locale]/ i jednocześnie
 * angielski segment adresu; pozostałe języki mają własne, tłumaczone segmenty (np. /domy/hawran).
 * next.config.ts zamienia je na wewnętrzne ścieżki (rewrites), więc w kodzie linki budujemy
 * wyłącznie przez href().
 */
export const ROUTES = {
  home: { pl: '', en: '', sk: '', ar: '' },
  houses: { pl: 'domy', en: 'houses', sk: 'domy', ar: 'houses' },
  rituals: { pl: 'sauna-i-bania', en: 'sauna-and-hot-tub', sk: 'sauna-a-kade', ar: 'sauna-and-hot-tub' },
  surroundings: { pl: 'okolica', en: 'surroundings', sk: 'okolie', ar: 'surroundings' },
  offers: { pl: 'oferty', en: 'offers', sk: 'ponuky', ar: 'offers' },
  news: { pl: 'aktualnosci', en: 'news', sk: 'novinky', ar: 'news' },
  settlement: { pl: 'osada', en: 'settlement', sk: 'osada', ar: 'settlement' },
  gallery: { pl: 'galeria', en: 'gallery', sk: 'galeria', ar: 'gallery' },
  guide: { pl: 'przewodnik', en: 'guest-guide', sk: 'sprievodca', ar: 'guest-guide' },
  contact: { pl: 'kontakt', en: 'contact', sk: 'kontakt', ar: 'contact' },
  documents: { pl: 'dokumenty', en: 'documents', sk: 'dokumenty', ar: 'documents' },
} as const satisfies Record<string, Record<Locale, string>>

export type RouteKey = keyof typeof ROUTES

/**
 * Dokumenty z krótkim adresem w głównym katalogu (jak na obecnej stronie: /regulamin, /en/terms).
 * Klucz to slug dokumentu w panelu; pozostałe dokumenty mają adres /dokumenty/{slug}.
 */
export const DOCUMENT_PATHS: Record<string, Partial<Record<Locale, string>>> = {
  regulamin: { pl: 'regulamin', en: 'terms' },
  prywatnosc: { pl: 'prywatnosc', en: 'privacy' },
}

/** Publiczny adres podstrony w danym języku, np. href('pl', 'houses', 'hawran') → /domy/hawran. */
export function href(locale: Locale, route: RouteKey, slug?: string): string {
  const doc = route === 'documents' && slug ? DOCUMENT_PATHS[slug]?.[locale] : undefined
  if (doc) return '/' + [locale === DEFAULT_LOCALE ? '' : locale, doc].filter(Boolean).join('/')
  const segments = [locale === DEFAULT_LOCALE ? '' : locale, ROUTES[route][locale], slug ?? ''].filter(Boolean)
  return '/' + segments.join('/')
}

/**
 * Reguły dla next.config.ts: publiczny adres → wewnętrzna ścieżka /[locale]/[klucz].
 * Polski bez prefiksu; dla innych języków tylko tam, gdzie segment różni się od klucza.
 */
export function localeRewrites(locales: Locale[]) {
  const rules: { source: string; destination: string }[] = []
  for (const locale of locales) {
    const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`
    for (const [key, segments] of Object.entries(ROUTES) as [RouteKey, Record<Locale, string>][]) {
      const segment = segments[locale]
      if (key === 'home') {
        if (locale === DEFAULT_LOCALE) rules.push({ source: '/', destination: `/${locale}` })
        continue
      }
      if (locale !== DEFAULT_LOCALE && segment === key) continue
      rules.push({ source: `${prefix}/${segment}`, destination: `/${locale}/${key}` })
      rules.push({ source: `${prefix}/${segment}/:slug`, destination: `/${locale}/${key}/:slug` })
    }
    for (const [slug, paths] of Object.entries(DOCUMENT_PATHS)) {
      if (paths[locale]) rules.push({ source: `${prefix}/${paths[locale]}`, destination: `/${locale}/documents/${slug}` })
    }
  }
  return rules
}

/**
 * Wewnętrzne ścieżki polskie (/pl/…) i nietłumaczone segmenty nie mogą być drugim adresem tej samej
 * treści (SEO), więc przekierowujemy je na adres kanoniczny.
 */
export function localeRedirects(locales: Locale[]) {
  const rules: { source: string; destination: string; permanent: boolean }[] = [
    { source: `/${DEFAULT_LOCALE}`, destination: '/', permanent: true },
  ]
  for (const locale of locales) {
    for (const [key, segments] of Object.entries(ROUTES) as [RouteKey, Record<Locale, string>][]) {
      if (key === 'home' || segments[locale] === key) continue
      const from = `/${locale}/${key}`
      const to = href(locale, key)
      rules.push({ source: from, destination: to, permanent: true })
      rules.push({ source: `${from}/:slug`, destination: `${to}/:slug`, permanent: true })
    }
    for (const slug of Object.keys(DOCUMENT_PATHS)) {
      const to = href(locale, 'documents', slug)
      for (const from of new Set([`/${locale}/documents/${slug}`, `${locale === DEFAULT_LOCALE ? '' : `/${locale}`}/${ROUTES.documents[locale]}/${slug}`])) {
        if (from !== to) rules.push({ source: from, destination: to, permanent: true })
      }
    }
  }
  return rules
}

/** Odwrotność href(): publiczny adres → podstrona i slug (przełącznik języka). */
export function parsePath(pathname: string, locales: Locale[]): { locale: Locale; route: RouteKey; slug?: string } | null {
  const parts = pathname.split('/').filter(Boolean)
  const locale = parts[0] && (locales as string[]).includes(parts[0]) && parts[0] !== DEFAULT_LOCALE ? (parts.shift() as Locale) : DEFAULT_LOCALE
  if (!parts.length) return { locale, route: 'home' }
  const doc = parts.length === 1 ? Object.keys(DOCUMENT_PATHS).find((d) => DOCUMENT_PATHS[d][locale] === parts[0]) : undefined
  if (doc) return { locale, route: 'documents', slug: doc }
  const route = (Object.keys(ROUTES) as RouteKey[]).find((k) => k !== 'home' && ROUTES[k][locale] === parts[0])
  return route ? { locale, route, slug: parts[1] } : null
}
