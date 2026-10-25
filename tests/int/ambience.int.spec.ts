import { describe, expect, it } from 'vitest'
import { AMBIENCE_INIT_SCRIPT, assignSlots, defaultAmbience } from '@/lib/ambience'

describe('Nastroje hero (assignSlots)', () => {
  it('sam kadr główny obsługuje wszystkie cztery nastroje', () => {
    expect(assignSlots([{}])).toEqual([['dzien-zima', 'dzien-lato', 'noc-zima', 'noc-lato']])
  })

  it('wariant nocny przejmuje noc w obu porach roku, letni tylko letni dzień', () => {
    const slots = assignSlots([{}, { pora: 'noc' }, { sezon: 'lato' }])
    expect(slots).toEqual([['dzien-zima'], ['noc-zima', 'noc-lato'], ['dzien-lato']])
  })

  it('dokładny wariant wygrywa z ogólnym', () => {
    const slots = assignSlots([{}, { pora: 'noc' }, { pora: 'noc', sezon: 'lato' }])
    expect(slots[1]).toEqual(['noc-zima'])
    expect(slots[2]).toEqual(['noc-lato'])
  })
})

describe('Domyślny nastrój (defaultAmbience)', () => {
  const at = (iso: string) => defaultAmbience(Date.parse(iso))
  it('zimą w południe jest dzień, o 17:00 czasu polskiego już noc', () => {
    expect(at('2026-12-21T11:00:00Z')).toEqual({ pora: 'dzien', sezon: 'zima' })
    expect(at('2026-12-21T16:00:00Z')).toEqual({ pora: 'noc', sezon: 'zima' })
  })
  it('latem o 20:30 czasu polskiego jeszcze dzień, o 23:00 noc', () => {
    expect(at('2026-06-21T18:30:00Z')).toEqual({ pora: 'dzien', sezon: 'lato' })
    expect(at('2026-06-21T21:00:00Z')).toEqual({ pora: 'noc', sezon: 'lato' })
  })
  it('skrypt przed malowaniem jest poprawnym JS', () => {
    expect(() => new Function(AMBIENCE_INIT_SCRIPT)).not.toThrow()
  })
})
