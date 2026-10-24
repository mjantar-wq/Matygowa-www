import 'server-only'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/i18n/dictionaries'
import { ENABLED_LOCALES, isLocale, type Locale } from '@/i18n/locales'
import { href, type RouteKey } from '@/i18n/routes'
import { getSettings } from './cms'
import type { Media } from '@/payload-types'

export type LocaleParams = { params: Promise<{ locale: string }> }
export type SlugParams = { params: Promise<{ locale: string; slug: string }> }

/** Wspólny początek każdej podstrony: język z adresu, słownik i ustawienia z panelu. */
export async function pageContext(params: Promise<{ locale: string }>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return { locale, t: getDictionary(locale), settings: await getSettings(locale) }
}

export type PageContext = Awaited<ReturnType<typeof pageContext>>

type Seo = { title?: string | null; description?: string | null; image?: Media | string | number | null } | null | undefined

/** Metadane z hreflang dla wszystkich włączonych języków (koncepcja F6). */
export function buildMetadata(locale: Locale, route: RouteKey, opts: { title?: string | null; description?: string | null; seo?: Seo; slug?: string }): Metadata {
  const image = opts.seo?.image && typeof opts.seo.image === 'object' ? opts.seo.image.url : undefined
  return {
    title: opts.seo?.title || opts.title || undefined,
    description: opts.seo?.description || opts.description || undefined,
    alternates: {
      canonical: href(locale, route, opts.slug),
      languages: Object.fromEntries(ENABLED_LOCALES.map((l) => [l, href(l, route, opts.slug)])),
    },
    openGraph: image ? { images: [image] } : undefined,
  }
}
