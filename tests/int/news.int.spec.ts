import { describe, expect, it } from 'vitest'
import { excerptRepeatsBody } from '@/lib/news'

const doc = (...paragraphs: string[]) => ({
  root: { type: 'root', children: paragraphs.map((t) => ({ type: 'paragraph', children: [{ type: 'text', text: t }] })) },
})

describe('excerptRepeatsBody', () => {
  it('wykrywa zajawkę będącą kopią początku treści', () => {
    expect(excerptRepeatsBody('Witojcie na nowej stronie.', doc('Witojcie na nowej stronie.'))).toBe(true)
    expect(excerptRepeatsBody('Witojcie  na nowej stronie.', doc('Witojcie na nowej stronie.', 'Drugi akapit.'))).toBe(true)
  })
  it('zostawia zajawkę, która jest osobnym tekstem', () => {
    expect(excerptRepeatsBody('Krótko o ofercie.', doc('Pełny opis oferty.'))).toBe(false)
  })
  it('pusta zajawka albo treść nie liczy się jako powtórzenie', () => {
    expect(excerptRepeatsBody('', doc('Tekst'))).toBe(false)
    expect(excerptRepeatsBody('Tekst', null)).toBe(false)
  })
})
