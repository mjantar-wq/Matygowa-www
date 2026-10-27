import 'server-only'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDictionary } from '@/i18n/dictionaries'
import { DEFAULT_LOCALE, ENABLED_LOCALES, LOCALES, isLocale, type Locale } from '@/i18n/locales'
import { href, type RouteKey } from '@/i18n/routes'
import { cleared } from '@/components/Media'
import { getSettings } from './cms'
import { requestLocale } from './terms'
import type { Media } from '@/payload-types'

export type LocaleParams = { params: Promise<{ locale: string }> }
export type SlugParams = { params: Promise<{ locale: string; slug: string }> }

/** Wspólny początek każdej podstrony: język z adresu, słownik i ustawienia z panelu. */
export async function pageContext(params: Promise<{ locale: string }>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  requestLocale().locale = locale
  return { locale, t: getDictionary(locale), settings: await getSettings(locale) }
}

export type PageContext = Awaited<ReturnType<typeof pageContext>>

type Seo = { title?: string | null; description?: string | null; image?: Media | string | number | null } | null | undefined
type Image = Media | string | number | null | undefined

/** Adres strony (produkcja ustawia NEXT_PUBLIC_SITE_URL w wrangler.jsonc). */
export const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? 'https://matygowa.audiowizard.pl'

/** Obraz z biblioteki, który można pokazać poza stroną (bez filmów i zdjęć czekających na zgodę na produkcji). */
export const imageUrl = (image: Image) => (image && typeof image === 'object' && image.url && !image.mimeType?.startsWith('video/') && cleared(image) ? image.url : undefined)

/** Domyślny obraz do udostępnień (1200×630, kadr osady o świcie), gdy ani strona, ani Ustawienia go nie mają. */
export const DEFAULT_OG_IMAGE = '/og.jpg'

/**
 * Metadane z hreflang dla wszystkich włączonych języków (x-default: polski) i obrazem do udostępnień (koncepcja F6).
 * Tytuł z nazwą osady (np. z content/seo-pages.json) nie dostaje jej drugi raz z szablonu w layoucie;
 * strona bez tytułu i opisu dziedziczy domyślne z Ustawień strony.
 */
export async function buildMetadata(locale: Locale, route: RouteKey, opts: { title?: string | null; description?: string | null; seo?: Seo; slug?: string; image?: Image }): Promise<Metadata> {
  const settings = await getSettings(locale)
  const siteName = getDictionary(locale).siteName
  const title = opts.seo?.title || opts.title || undefined
  const description = opts.seo?.description || opts.description || settings?.seoDescription || undefined
  const url = href(locale, route, opts.slug)
  const image = imageUrl(opts.seo?.image) ?? imageUrl(opts.image) ?? imageUrl(settings?.seoImage) ?? DEFAULT_OG_IMAGE
  const fullTitle = title && !title.includes(siteName) ? `${title} · ${siteName}` : title || settings?.seoTitle || siteName
  return {
    ...(title ? { title: title.includes(siteName) ? { absolute: title } : title } : {}),
    ...(description ? { description } : {}),
    alternates: {
      canonical: url,
      languages: { ...Object.fromEntries(ENABLED_LOCALES.map((l) => [l, href(l, route, opts.slug)])), 'x-default': href(DEFAULT_LOCALE, route, opts.slug) },
    },
    openGraph: {
      type: route === 'news' && opts.slug ? 'article' : 'website',
      siteName,
      locale: LOCALES[locale].intl.replace('-', '_'),
      url,
      title: fullTitle,
      ...(description ? { description } : {}),
      images: [image === DEFAULT_OG_IMAGE ? { url: image, width: 1200, height: 630 } : image],
    },
    twitter: { card: 'summary_large_image' },
  }
}
