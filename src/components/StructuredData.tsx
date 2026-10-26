import base from '../../content/structured-data.json'
import { cleared } from '@/components/Media'
import { getSettings } from '@/lib/cms'
import { getProperty } from '@/lib/icecoldres'
import { DEFAULT_OG_IMAGE } from '@/lib/page'
import { href } from '@/i18n/routes'
import type { Locale } from '@/i18n/locales'
import type { Media, News, Unit } from '@/payload-types'

const site = () => process.env.NEXT_PUBLIC_SITE_URL ?? 'https://matygowa.audiowizard.pl'

/** Pełny adres (dane strukturalne nie przyjmują ścieżek względnych). */
export const absolute = (path: string) => (/^https?:\/\//.test(path) ? path : `${site()}${path}`)

const imageOf = (media?: Media | number | string | null) => (media && typeof media === 'object' && media.url && !media.mimeType?.startsWith('video/') && cleared(media) ? absolute(media.url) : undefined)

/** Znacznik JSON-LD; „<” w danych nie może zamknąć znacznika script. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}

/** JSON-LD LodgingBusiness na stronie głównej: baza z content/, kontakt z Ustawień strony. Bez godzin otwarcia (decyzja Michała). */
export async function StructuredData({ locale }: { locale: Locale }) {
  const [settings, property] = await Promise.all([getSettings(locale), getProperty()])
  const { _note, ...data } = base as typeof base & { _note?: string }
  return (
    <JsonLd
      data={{
        ...data,
        '@id': `${site()}/#osada`,
        url: `${site()}/`,
        image: imageOf(settings?.seoImage) ?? absolute(DEFAULT_OG_IMAGE),
        telephone: settings?.phone?.replace(/\s/g, '') || data.telephone,
        email: settings?.email || data.email,
        checkinTime: property?.property.checkInTime ?? '16:00',
        checkoutTime: property?.property.checkOutTime ?? '11:00',
      }}
    />
  )
}

/** Dom albo apartament jako VacationRental w osadzie (koncepcja F6). */
export function UnitStructuredData({ unit, locale }: { unit: Unit; locale: Locale }) {
  const images = [unit.hero, ...(unit.gallery ?? [])].map(imageOf).filter(Boolean)
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'VacationRental',
        name: unit.name,
        description: unit.tagline || undefined,
        url: absolute(href(locale, 'houses', unit.slug)),
        image: images.length ? images : undefined,
        containedInPlace: { '@type': 'LodgingBusiness', '@id': `${site()}/#osada`, name: base.name, address: { ...base.address } },
        address: { ...base.address },
        containsPlace: {
          '@type': 'Accommodation',
          additionalType: unit.kind === 'apartment' ? 'Apartment' : 'House',
          occupancy: unit.maxGuests ? { '@type': 'QuantitativeValue', maxValue: unit.maxGuests } : undefined,
          numberOfBedrooms: unit.bedrooms || undefined,
          numberOfBathroomsTotal: unit.bathrooms || undefined,
          floorSize: unit.area ? { '@type': 'QuantitativeValue', value: unit.area, unitCode: 'MTK' } : undefined,
          amenityFeature: base.amenityFeature,
        },
      }}
    />
  )
}

/** Wpis z Aktualności jako NewsArticle. */
export function NewsStructuredData({ post, locale }: { post: News; locale: Locale }) {
  const image = imageOf(post.cover)
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: post.title,
        description: post.excerpt || undefined,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        inLanguage: locale,
        url: absolute(href(locale, 'news', post.slug)),
        image: image ? [image] : undefined,
        publisher: { '@type': 'Organization', '@id': `${site()}/#osada`, name: base.name },
      }}
    />
  )
}

type LexicalNode = { type?: string; text?: string; children?: LexicalNode[] }

/** Zwykły tekst z treści Lexical (akapity rozdzielone spacją), np. do odpowiedzi w FAQPage. */
export function plainText(node?: LexicalNode | { root?: LexicalNode } | null): string {
  if (!node) return ''
  if ('root' in node) return plainText(node.root)
  const n = node as LexicalNode
  if (typeof n.text === 'string') return n.text
  return (n.children ?? []).map(plainText).join(n.type === 'root' ? ' ' : '').replace(/\s+/g, ' ').trim()
}

/** Pytania i odpowiedzi z bloku FAQ (przewodnik gościa) jako FAQPage. */
export function FaqStructuredData({ items }: { items: { question: string; answer: string }[] }) {
  const entries = items.filter((i) => i.question && i.answer)
  if (!entries.length) return null
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: entries.map((i) => ({ '@type': 'Question', name: i.question, acceptedAnswer: { '@type': 'Answer', text: i.answer } })),
      }}
    />
  )
}
