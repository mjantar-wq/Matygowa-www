import { createElement, useState } from 'react'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { CountPicker } from '@/components/CountPicker'
import { listLength, MAX_GUESTS, parseCount } from '@/lib/count-picker'

// jsdom nie ma przewijania do elementu
Element.prototype.scrollIntoView = () => {}

describe('liczba osób w pasku rezerwacji (Michał, 26.10.2026)', () => {
  afterEach(cleanup)

  it('lista: 14 pozycji na start, więcej po przewinięciu, najwyżej do limitu', () => {
    expect(listLength(1, MAX_GUESTS, 0, 1)).toBe(14)
    expect(listLength(1, MAX_GUESTS, 24, 1)).toBe(24)
    expect(listLength(1, MAX_GUESTS, 0, 20)).toBe(20)
    expect(listLength(1, MAX_GUESTS, 100, 1)).toBe(30)
    expect(parseCount(' 22 ', 1, 30)).toBe(22)
    expect(parseCount('31', 1, 30)).toBeNull()
    expect(parseCount('2a', 1, 30)).toBeNull()
  })

  it('wybór z listy, przewijanie, ręczne wpisanie i komunikat poza zakresem', () => {
    const seen: (number | null)[] = []
    function Bar() {
      const [n, setN] = useState<number | null>(null)
      return createElement(
        'label',
        null,
        'Liczba osób',
        createElement(CountPicker, {
          value: n,
          min: 1,
          max: MAX_GUESTS,
          label: 'Liczba osób',
          rangeMessage: 'Podaj liczbę od {min} do {max}',
          onChange: (v: number | null) => (seen.push(v), setN(v)),
        }),
      )
    }
    render(createElement(Bar))
    const input = screen.getByRole('combobox', { name: 'Liczba osób' })
    fireEvent.focus(input)
    const list = screen.getByRole('listbox', { name: 'Liczba osób' })
    expect(screen.getAllByRole('option')).toHaveLength(14)
    // przewinięcie do końca dokłada kolejne liczby
    Object.defineProperty(list, 'scrollHeight', { value: 500, configurable: true })
    Object.defineProperty(list, 'clientHeight', { value: 240, configurable: true })
    list.scrollTop = 260
    fireEvent.scroll(list)
    expect(screen.getAllByRole('option')).toHaveLength(24)
    fireEvent.click(screen.getByRole('option', { name: '16' }))
    expect(seen.at(-1)).toBe(16)
    expect(input).toHaveProperty('value', '16')
    expect(input.getAttribute('aria-expanded')).toBe('false')
    // ręcznie wpisana liczba
    act(() => {
      fireEvent.change(input, { target: { value: '27' } })
      fireEvent.blur(input)
    })
    expect(seen.at(-1)).toBe(27)
    // ponad 30: wpis zostaje z komunikatem, a liczba osób jest pusta
    act(() => {
      fireEvent.change(input, { target: { value: '31' } })
      fireEvent.blur(input)
    })
    expect(seen.at(-1)).toBeNull()
    expect(input).toHaveProperty('value', '31')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(screen.getByText('Podaj liczbę od 1 do 30')).toBeTruthy()
  })
})
