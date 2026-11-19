import { describe, expect, it } from 'vitest'
import { guestsFact, layoutFacts } from '@/lib/unit-facts'

describe('opis domu na kafelku', () => {
  it('przy domkach 10-osobowych od razu widać miejsca na rozkładanej sofie (Michał, 19.11.2026)', () => {
    expect(guestsFact('pl', 10, 2)).toBe('do 10 osób (w tym 2 na rozkładanej sofie w salonie)')
    expect(guestsFact('en', 10, 2)).toBe('up to 10 guests (incl. 2 on a sofa bed in the living room)')
  })

  it('bez sofy (0 albo brak w API) bez dopisku', () => {
    expect(guestsFact('pl', 8, 0)).toBe('do 8 osób')
    expect(guestsFact('pl', 8, undefined)).toBe('do 8 osób')
    expect(guestsFact('en', 8, null)).toBe('up to 8 guests')
  })

  it('układ domu: sypialnie, łazienki (+ WC) i poziom salonu z odmianą', () => {
    expect(layoutFacts('pl', { bedrooms: 4, bathrooms: 3, wc: true, livingRoom: 'upper' })).toEqual(['4 sypialnie', '3 łazienki + WC', 'salon na piętrze'])
    expect(layoutFacts('pl', { bedrooms: 5, bathrooms: 5, livingRoom: 'ground' })).toEqual(['5 sypialni', '5 łazienek', 'salon na parterze'])
    expect(layoutFacts('pl', { bedrooms: 1, bathrooms: 1 })).toEqual(['1 sypialnia', '1 łazienka'])
    expect(layoutFacts('en', { bedrooms: 3, bathrooms: 1, wc: true, livingRoom: 'ground' })).toEqual(['3 bedrooms', '1 bathroom + WC', 'living room on the ground floor'])
    expect(layoutFacts('pl', {})).toEqual([])
  })
})
