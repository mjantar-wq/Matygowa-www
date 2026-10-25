import type { HeroImage, HeroSlide } from '@/components/effects/HeroStage'
import type { Media, Page } from '@/payload-types'
import { assignSlots } from './ambience'

/**
 * Sceny strony głównej (koncepcja po M1: opowieść na stałym tle). Pod treścią leży przypięta warstwa,
 * która przenika się do sceny rozdziału albo kroku na środku ekranu. Scena ma do czterech wariantów
 * (dzień / noc × zima / lato); brakujący bierze najbliższy (assignSlots).
 */
type Block = NonNullable<Page['layout']>[number]
type Of<T extends Block['blockType']> = Extract<Block, { blockType: T }>
type MediaRef = Media | number | string | null | undefined
type Variant = { pora?: string | null; sezon?: string | null; image?: MediaRef; video?: MediaRef; videoPortrait?: MediaRef }

export type Scene = { id: string; kind: 'media' | 'panorama' | 'map'; slides?: HeroSlide[] }

export const sceneId = (blockId: string | null | undefined, step?: number) => `s-${blockId ?? 'x'}${step == null ? '' : `-${step}`}`

const asImage = (m?: MediaRef): HeroImage | null =>
  m && typeof m === 'object' && m.url ? { url: m.url, alt: m.alt, width: m.width, height: m.height, focusX: m.focusX, focusY: m.focusY } : null

/**
 * Warianty → kadry z przypisanymi nastrojami; pomija warianty bez kadru.
 * Filmy na razie pomijamy: zastępcze ujęcia drżały i źle się zapętlały, więc kadr dostaje wolny ruch kamery
 * w CSS. Gdy będzie prawdziwe, stabilne ujęcie z płynną pętlą, wystarczy przywrócić tu `video` i `videoPortrait`.
 */
export function slidesOf(variants: Variant[]): HeroSlide[] {
  const usable = variants.filter((v) => asImage(v.image))
  const slots = assignSlots(usable)
  return usable
    .map((v, i): HeroSlide => ({ image: asImage(v.image), slots: slots[i] }))
    .filter((s) => s.slots.length)
}

export function heroSlides(block: Of<'hero'>, fallback: Variant[] = []): HeroSlide[] {
  const own = slidesOf([{ image: block.image, video: block.video, videoPortrait: block.videoPortrait }, ...(block.variants ?? [])])
  return own.length ? own : slidesOf(fallback)
}

/** Zdjęcia z biblioteki po początku nazwy pliku; zdjęcie z sesji (_foto) wygrywa z wizualizacją (_cgi). */
export function libraryPicker(media: Media[]) {
  return (prefix: string, ext: 'image' | 'video' = 'image') => {
    const hits = media.filter((m) => m.filename?.startsWith(prefix) && (ext === 'video' ? m.mimeType?.startsWith('video/') : m.mimeType?.startsWith('image/')))
    return hits.find((m) => m.filename?.includes('_foto')) ?? hits[0] ?? null
  }
}

/** Domyślne sceny wg tabeli z koncepcji, dopóki rozdział nie ma własnych w panelu. */
function defaults(pick: ReturnType<typeof libraryPicker>) {
  const v = (prefix: string, extra: Partial<Variant> = {}): Variant => ({ image: pick(prefix), video: pick(prefix, 'video'), ...extra })
  return {
    hero: [v('K2_hero_osada_swit_16x9', { videoPortrait: pick('K2_hero_osada_swit_9x16', 'video') }), v('K2_hero_osada_noc_16x9', { pora: 'noc' }), v('K2_hero_osada_lato_16x9', { sezon: 'lato' })],
    day: {
      dawn: [v('T1_swit_gran')],
      day: [v('K3_dron_przelot'), v('K2_hero_osada_lato_16x9', { sezon: 'lato' })],
      dusk: [v('K4_osada_zmierzch')],
      night: [v('T3_noc_gwiazdy'), v('K2_hero_osada_noc_16x9', { sezon: 'zima' })],
    } as Record<string, Variant[]>,
    rooms: ['W1_', 'W2_', 'W3_', 'W5_'].map((p) => [v(p)]),
    bania: [v('B1_bania_alpenglow'), v('B1_bania_lato', { sezon: 'lato' }), v('B2_bania_noc_3x2', { pora: 'noc' })],
    testimonials: [v('K8_punkt_widokowy'), v('T3_noc_gwiazdy', { pora: 'noc' })],
    offersNews: [v('K6_dom_orbita'), v('K2_hero_osada_noc_16x9', { pora: 'noc' })],
    bookingInvite: [v('T1_swit_gran'), v('T3_noc_gwiazdy', { pora: 'noc' })],
  }
}

/** Scena dla każdego rozdziału i kroku, w tej samej kolejności co treść. */
export function buildScenes(blocks: NonNullable<Page['layout']>, media: Media[]): Scene[] {
  const d = defaults(libraryPicker(media))
  const out: Scene[] = []
  const add = (id: string, kind: Scene['kind'], variants: Variant[] = []) => out.push({ id, kind, slides: kind === 'media' ? slidesOf(variants) : undefined })
  // Własne sceny z panelu (pole `scene` w bloku i w krokach) mają pierwszeństwo przed domyślnymi.
  const own = (x: unknown): Variant[] => ((x as { scene?: Variant[] | null })?.scene ?? []) as Variant[]
  for (const b of blocks) {
    switch (b.blockType) {
      case 'hero':
        out.push({ id: sceneId(b.id), kind: 'media', slides: own(b).length ? slidesOf(own(b)) : heroSlides(b, d.hero) })
        break
      case 'peaksPanorama':
        add(sceneId(b.id), 'panorama')
        break
      case 'story': {
        // zapowiedź bani dostaje też jej nocny i letni kadr
        const name = typeof b.image === 'object' ? (b.image?.filename ?? '') : ''
        add(sceneId(b.id), 'media', [...own(b), { image: b.image }, ...(name.startsWith('B') ? d.bania : [])])
        break
      }
      case 'testimonials':
      case 'offersNews':
      case 'bookingInvite':
        add(sceneId(b.id), 'media', [...own(b), ...d[b.blockType]])
        break
      case 'dayInSettlement':
        b.scenes?.forEach((s, i) => add(sceneId(b.id, i), 'media', [...own(s), { image: s.image }, ...(d.day[s.time] ?? [])]))
        break
      case 'houseInside':
        add(sceneId(b.id), 'media', [...own(b), ...d.rooms[0]])
        b.rooms?.forEach((r, i) => add(sceneId(b.id, i), 'media', [...own(r), { image: r.image }, ...(d.rooms[i] ?? [])]))
        break
      case 'rituals':
        add(sceneId(b.id), 'media', [...own(b), ...d.bania])
        b.steps?.forEach((s, i) => add(sceneId(b.id, i), 'media', [...own(s), { image: s.image }, ...d.bania]))
        break
      case 'seasons':
        add(sceneId(b.id), 'media', [
          ...own(b),
          { sezon: 'zima', image: b.winter?.image },
          { sezon: 'lato', image: b.summer?.image },
        ])
        break
      case 'surroundings':
        add(sceneId(b.id), 'map')
        break
      default:
      // wstęp i pozostałe bloki zostają na scenie poprzedniego rozdziału
    }
  }
  return out.filter((s) => s.kind !== 'media' || s.slides?.length)
}
