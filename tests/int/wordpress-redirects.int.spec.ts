import { describe, expect, it } from 'vitest'
import redirects from '../../content/redirects.json'
import { href } from '../../src/i18n/routes'

// Adresy z mapy witryny dotychczasowego WordPressa (wp-sitemap.xml, 24.11.2026).
const WORDPRESS = [
  '/', '/en/', '/en/about-us/', '/en/contact/', '/en/gallery/', '/en/offer/autumn/', '/en/offer/newyear/', '/en/offer/standard/',
  '/en/offer/winter-holidays/', '/en/offers-and-promotions/', '/en/privacy/', '/en/terms/', '/en/village/cottages/',
  ...['gerlach', 'hawran', 'lodowy', 'lomnica', 'swinica', 'woloszyn'].flatMap((s) => [`/en/village/cottages/${s}/`, `/osada/domki/${s}/`]),
  '/galeria/', '/kontakt/', '/o-nas/', '/oferta-standardowa/', '/oferta/autumn/', '/oferta/newyear/', '/oferta/standard/',
  '/oferta/winter-holidays/', '/oferty-i-promocje/', '/osada/domki/', '/prywatnosc/', '/regulamin/',
]

const norm = (p: string) => (p.length > 1 ? p.replace(/\/$/, '') : p)
const NEW = new Set(
  [
    href('pl', 'home'), href('en', 'home'),
    ...(['pl', 'en'] as const).flatMap((l) => [
      href(l, 'gallery'), href(l, 'contact'), href(l, 'offers'), href(l, 'settlement'), href(l, 'houses'),
      href(l, 'documents', 'regulamin'), href(l, 'documents', 'prywatnosc'),
      ...['gerlach', 'hawran', 'lodowy', 'lomnica', 'swinica', 'woloszyn'].map((s) => href(l, 'houses', s)),
    ]),
  ].map(norm),
)

describe('stare adresy WordPressa', () => {
  it.each(WORDPRESS)('%s kończy na istniejącej stronie (najwyżej jednym przekierowaniem 301)', (path) => {
    const hit = redirects.find((r) => norm(r.from) === norm(path))
    if (hit) {
      expect(hit.status).toBe(301)
      expect(NEW.has(norm(hit.to))).toBe(true)
    } else {
      expect(NEW.has(norm(path))).toBe(true)
    }
  })
})
