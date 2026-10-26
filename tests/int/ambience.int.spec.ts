import { describe, expect, it } from 'vitest'
import { AMBIENCE_INIT_SCRIPT, assignSlots, defaultAmbience } from '@/lib/ambience'
import { buildScenes } from '@/lib/scenes'
import type { Media, Page } from '@/payload-types'

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
  it('lato od kalendarzowej wiosny do końca lata, zima jesienią i zimą', () => {
    expect(at('2026-03-20T11:00:00Z').sezon).toBe('zima')
    expect(at('2026-03-21T11:00:00Z').sezon).toBe('lato')
    expect(at('2026-09-22T11:00:00Z').sezon).toBe('lato')
    expect(at('2026-09-23T11:00:00Z').sezon).toBe('zima')
    expect(at('2026-10-25T11:00:00Z').sezon).toBe('zima')
  })
  it('skrypt przed malowaniem jest poprawnym JS', () => {
    expect(() => new Function(AMBIENCE_INIT_SCRIPT)).not.toThrow()
  })
})

describe('Sceny Dnia w osadzie (buildScenes)', () => {
  const m = (id: number, filename: string) => ({ id, filename, url: `/m/${filename}`, mimeType: 'image/webp', alt: '' }) as Media
  const lato = m(1, 'K4_osada_zmierzch_16x9_foto.webp')
  const zima = m(2, 'K4_osada_zmierzch_zima_16x9_foto.webp')
  it('zimą zmierzch pokazuje kadr ze śniegiem, latem letni', () => {
    const blocks = [{ blockType: 'dayInSettlement', id: 'd', scenes: [{ time: 'dusk', image: lato }] }] as unknown as NonNullable<Page['layout']>
    const [scene] = buildScenes(blocks, [lato, zima])
    const at = (slot: string) => scene.slides?.find((s) => s.slots.includes(slot))?.image?.url
    expect(at('dzien-zima')).toBe(zima.url)
    expect(at('noc-zima')).toBe(zima.url)
    expect(at('dzien-lato')).toBe(lato.url)
  })
})
