import { describe, expect, it } from 'vitest'
import { href, localeRedirects, localeRewrites, parsePath } from '@/i18n/routes'
import { bookingUrl, formatPrice } from '@/lib/booking'

describe('adresy', () => {
  it('polski bez prefiksu, angielski pod /en/', () => {
    expect(href('pl', 'home')).toBe('/')
    expect(href('pl', 'houses', 'hawran')).toBe('/domy/hawran')
    expect(href('en', 'houses', 'hawran')).toBe('/en/houses/hawran')
    expect(href('en', 'home')).toBe('/en')
  })

  it('przepisuje polskie segmenty na wewnętrzne ścieżki', () => {
    const rules = localeRewrites(['pl', 'en'])
    expect(rules).toContainEqual({ source: '/', destination: '/pl' })
    expect(rules).toContainEqual({ source: '/domy/:slug', destination: '/pl/houses/:slug' })
    // angielski segment = klucz, więc bez reguły; inny segment dostaje regułę
    expect(rules.some((r) => r.source.startsWith('/en/houses'))).toBe(false)
    expect(rules).toContainEqual({ source: '/en/sauna-and-hot-tub', destination: '/en/rituals' })
  })

  it('wewnętrzne /pl/… przekierowuje na adres kanoniczny', () => {
    const rules = localeRedirects(['pl', 'en'])
    expect(rules).toContainEqual({ source: '/pl', destination: '/', permanent: true })
    expect(rules).toContainEqual({ source: '/pl/houses/:slug', destination: '/domy/:slug', permanent: true })
  })

  it('dokumenty z krótkim adresem jak na obecnej stronie', () => {
    expect(href('pl', 'documents', 'regulamin')).toBe('/regulamin')
    expect(href('en', 'documents', 'prywatnosc')).toBe('/en/privacy')
    expect(href('pl', 'documents', 'cookies')).toBe('/dokumenty/cookies')
    expect(localeRewrites(['pl', 'en'])).toContainEqual({ source: '/en/terms', destination: '/en/documents/regulamin' })
    expect(localeRedirects(['pl', 'en'])).toContainEqual({ source: '/dokumenty/regulamin', destination: '/regulamin', permanent: true })
    expect(parsePath('/en/terms', ['pl', 'en'])).toEqual({ locale: 'en', route: 'documents', slug: 'regulamin' })
  })

  it('odczytuje podstronę z adresu (przełącznik języka)', () => {
    expect(parsePath('/domy/hawran', ['pl', 'en'])).toEqual({ locale: 'pl', route: 'houses', slug: 'hawran' })
    expect(parsePath('/en/news', ['pl', 'en'])).toEqual({ locale: 'en', route: 'news', slug: undefined })
    expect(parsePath('/en', ['pl', 'en'])).toEqual({ locale: 'en', route: 'home' })
    expect(parsePath('/nie-ma', ['pl', 'en'])).toBeNull()
  })
})

describe('silnik rezerwacji', () => {
  it('IceColdRes dostaje daty, osoby, dom i utm', () => {
    const url = bookingUrl({ bookingEngine: 'icecoldres', icecoldresUrl: 'https://booking.example' }, 'en', { arrival: '2027-01-15', departure: '2027-01-18', adults: 4, children: 1, unit: 'hawran' }, { utm_source: 'ig' })
    expect(url).toBe('https://booking.example/en/booking?arrival=2027-01-15&departure=2027-01-18&adults=4&children=1&unit=hawran&utm_source=ig')
  })

  it('do czasu przełączenia prowadzi do Hotres', () => {
    expect(bookingUrl({ bookingEngine: 'hotres' }, 'pl')).toBe('https://booking.hotres.pl/v4_step1?oid=5244&lang=pl')
    expect(bookingUrl(null, 'en')).toContain('lang=en')
  })

  it('ceny w groszach', () => {
    expect(formatPrice(129900, 'pl')).toMatch(/^1\s?299\szł$/)
  })
})
