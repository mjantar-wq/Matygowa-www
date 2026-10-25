import { describe, expect, it } from 'vitest'
import { assignSlots } from '@/lib/ambience'

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
