import { createElement } from 'react'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getDictionary } from '@/i18n/dictionaries'
import type { EngineSettings } from '@/lib/booking'

// ramka kalendarza IceColdRes zastąpiona przyciskami, które wołają onPick jak komunikat z ramki
vi.mock('@/components/EngineCalendar', () => ({
  EngineCalendar: ({ onPick }: { onPick: (a: string, d: string) => void }) =>
    createElement(
      'div',
      null,
      createElement('button', { type: 'button', onClick: () => onPick('2027-01-10', '') }, 'przyjazd 10'),
      createElement('button', { type: 'button', onClick: () => onPick('2027-01-10', '2027-01-13') }, 'wyjazd 13'),
      createElement('button', { type: 'button', onClick: () => onPick('2027-02-01', '') }, 'nowy przyjazd 1.02'),
    ),
}))

const { BookingBar } = await import('@/components/BookingBar')

// jsdom nie ma przewijania, matchMedia ani IntersectionObserver
Element.prototype.scrollIntoView = () => {}
window.scrollBy = () => {}
window.matchMedia = ((query: string) => ({ matches: false, media: query })) as unknown as typeof window.matchMedia
globalThis.IntersectionObserver = class {
  observe() {}
  disconnect() {}
} as unknown as typeof IntersectionObserver

const engine = { bookingEngine: 'icecoldres', slug: 'booking', icecoldresUrl: 'https://booking.example' } as EngineSettings

describe('pasek rezerwacji: zmiana terminu po wyszukiwaniu (Michał, 23.11.2026)', () => {
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('nowy przyjazd po wynikach nie wywraca strony, a wyniki zostają przy swoim terminie i swoich linkach', async () => {
    const dict = getDictionary('pl')
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        Response.json({
          nights: 3,
          results: [{ code: 'HAW', name: 'Domek Hawrań', nameEn: null, free: 1, reason: null, unit: null, offers: [{ offerId: 'o1', name: 'Standard', total: 300000, badge: null, badgeEn: null }] }],
        }),
      ),
    )
    render(createElement(BookingBar, { locale: 'pl', t: dict.booking, fx: dict.effects, engine }))

    fireEvent.click(screen.getAllByRole('button', { name: new RegExp(dict.booking.arrival) })[0]!)
    fireEvent.click(screen.getByText('przyjazd 10'))
    fireEvent.click(screen.getByText('wyjazd 13'))
    const guests = screen.getByRole('combobox', { name: dict.booking.guests })
    fireEvent.change(guests, { target: { value: '4' } })
    fireEvent.keyDown(guests, { key: 'Enter' })
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: dict.booking.check }))
    })
    const heading = () => screen.getByRole('heading', { level: 3 }).textContent
    expect(heading()).toContain('10 sty')
    expect(heading()).toContain('13 sty')

    // przyjazd z nowego terminu: wyjazd w pasku jest pusty; wcześniej nagłówek wyników formatował pustą datę i rzucał RangeError
    fireEvent.click(screen.getAllByRole('button', { name: new RegExp(dict.booking.arrival) })[0]!)
    fireEvent.click(screen.getByText('nowy przyjazd 1.02'))
    expect(heading()).toContain('10 sty')
    expect(heading()).toContain('13 sty')
    const book = new URL(screen.getByRole('link', { name: dict.booking.book }).getAttribute('href')!)
    expect(book.searchParams.get('arrival')).toBe('2027-01-10')
    expect(book.searchParams.get('departure')).toBe('2027-01-13')
    expect(book.searchParams.get('unit')).toBe('HAW')
    expect(book.searchParams.get('offer')).toBe('o1')
  })
})
