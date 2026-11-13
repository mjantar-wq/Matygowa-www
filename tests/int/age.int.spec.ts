import { describe, expect, it } from 'vitest'
import { ageLabel } from '@/lib/age'

describe('ageLabel', () => {
  it('odmienia wiek po polsku', () => {
    expect([0, 1, 2, 4, 5, 12, 13, 14, 17, 22].map((n) => ageLabel(n, 'pl'))).toEqual(['poniżej roku', '1 rok', '2 lata', '4 lata', '5 lat', '12 lat', '13 lat', '14 lat', '17 lat', '22 lata'])
  })
  it('po angielsku', () => {
    expect([0, 1, 3].map((n) => ageLabel(n, 'en'))).toEqual(['under 1 year', '1 year', '3 years'])
  })
})
