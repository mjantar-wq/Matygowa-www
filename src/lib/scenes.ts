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
type Variant = { pora?: string | null; sezon?: string | null; image?: MediaRef; video?: MediaRef; videoPortrait?: MediaRef; nocny?: boolean }

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
    .map((v, i): HeroSlide => ({ image: asImage(v.image), slots: slots[i], nocny: v.nocny }))
    .filter((s) => s.slots.length)
}

export function heroSlides(block: Of<'hero'>, fallback: Variant[] = [], extra: Variant[] = []): HeroSlide[] {
  const own = slidesOf([{ image: block.image, video: block.video, videoPortrait: block.videoPortrait }, ...(block.variants ?? []), ...extra])
  return own.length ? own : slidesOf(fallback)
}

/** Zdjęcia z biblioteki po początku nazwy pliku; zdjęcie z sesji (_foto) wygrywa z wizualizacją (_cgi). */
export function libraryPicker(media: Media[]) {
  return (prefix: string, ext: 'image' | 'video' = 'image') => {
    const hits = media.filter((m) => m.filename?.startsWith(prefix) && (ext === 'video' ? m.mimeType?.startsWith('video/') : m.mimeType?.startsWith('image/')))
    return hits.find((m) => m.filename?.includes('_foto')) ?? hits[0] ?? null
  }
}

/**
 * Domyślne sceny wg tabeli z koncepcji, dopóki rozdział nie ma własnych w panelu. Zimowe kadry mają letnie
 * odpowiedniki z sesji letniej (L…, wnętrza W2x–W3x). Letnich nocy nie mamy, więc w nastroju noc-lato pokazujemy
 * letni kadr przyciemniony na noc (`nocny`), a nie zimową noc ze śniegiem.
 */
function defaults(pick: ReturnType<typeof libraryPicker>) {
  const v = (prefix: string, extra: Partial<Variant> = {}): Variant => ({ image: pick(prefix), video: pick(prefix, 'video'), ...extra })
  const lato = (prefix: string): Variant => v(prefix, { sezon: 'lato' })
  const latoNoc = (prefix: string): Variant => v(prefix, { pora: 'noc', sezon: 'lato', nocny: true })
  return {
    hero: [v('K12_'), v('K2_hero_osada_noc_16x9', { pora: 'noc' }), lato('K13_'), latoNoc('K13_')],
    day: {
      dawn: [v('T1_swit_gran'), lato('L28_')],
      day: [v('K3_dron_przelot'), lato('L26_')],
      dusk: [v('K4_osada_zmierzch')],
      // nocny krok opowieści: ten sam przyciemniony letni kadr w obu porach dnia
      night: [v('T3_noc_gwiazdy'), v('K2_hero_osada_noc_16x9', { sezon: 'zima' }), v('L21_', { sezon: 'lato', nocny: true })],
    } as Record<string, Variant[]>,
    rooms: [
      ['W1_', 'W30_'],
      ['W2_', 'W22_'],
      ['W3_', 'W20_'],
      ['W5_', 'W21_'],
    ].map(([zima, l]) => [v(zima), lato(l)]),
    bania: [v('B1_bania_alpenglow'), v('B1_bania_lato', { sezon: 'lato' }), v('B2_bania_noc_3x2', { pora: 'noc' }), latoNoc('B1_bania_lato')],
    nature: [lato('L30_osada'), latoNoc('L30_osada'), v('K2_hero_osada_noc_16x9', { pora: 'noc', sezon: 'zima' })],
    testimonials: [v('K8_punkt_widokowy'), v('T3_noc_gwiazdy', { pora: 'noc' }), latoNoc('K8_punkt_widokowy')],
    offersNews: [v('K6_dom_orbita'), v('K2_hero_osada_noc_16x9', { pora: 'noc' }), lato('L23_'), latoNoc('L23_')],
    bookingInvite: [v('T1_swit_gran'), v('T3_noc_gwiazdy', { pora: 'noc' }), lato('L25_'), latoNoc('L25_')],
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
        // kadry hero z panelu dostają przyciemnioną letnią noc, jeśli same jej nie mają (remis wygrywa wariant z panelu)
        out.push({ id: sceneId(b.id), kind: 'media', slides: own(b).length ? slidesOf(own(b)) : heroSlides(b).length ? heroSlides(b, [], [d.hero[3]]) : slidesOf(d.hero) })
        break
      case 'peaksPanorama':
        add(sceneId(b.id), 'panorama')
        break
      case 'story': {
        // zapowiedź bani dostaje też jej nocny i letni kadr, przyroda (zimowy przelot drona) całą osadę latem
        const name = typeof b.image === 'object' ? (b.image?.filename ?? '') : ''
        add(sceneId(b.id), 'media', [...own(b), { image: b.image }, ...(name.startsWith('B') ? d.bania : name.startsWith('K3_') ? d.nature : [])])
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
        // bez pomieszczeń rozdział ma własną scenę; z nimi tytuł używa sceny pierwszego (RenderBlocks)
        if (!b.rooms?.length) add(sceneId(b.id), 'media', [...own(b), ...d.rooms[0]])
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
