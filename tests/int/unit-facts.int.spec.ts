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

  it('układ domu: poziom salonu i liczba łazienek z odmianą', () => {
    expect(layoutFacts('pl', 'upper', 3)).toEqual(['salon na piętrze', '3 łazienki'])
    expect(layoutFacts('pl', 'ground', 5)).toEqual(['salon na parterze', '5 łazienek'])
    expect(layoutFacts('en', 'ground', 1)).toEqual(['living room on the ground floor', '1 bathroom'])
    expect(layoutFacts('pl', null, null)).toEqual([])
  })
})
