import type { Block, Field } from 'payload'

/**
 * Bloki sekcji stron (koncepcja: strona główna, sekcja po sekcji). Kolejność i włączanie sekcji
 * ustawia redaktor; układ bloków jest wspólny dla języków, teksty w blokach są tłumaczone.
 * Wygląd każdego bloku: src/blocks/render/*.
 */
const heading: Field = { name: 'heading', label: 'Nagłówek', type: 'text', localized: true }
const eyebrow: Field = { name: 'eyebrow', label: 'Etykieta nad nagłówkiem', type: 'text', localized: true }
const body: Field = { name: 'body', label: 'Tekst', type: 'richText', localized: true }
const image: Field = { name: 'image', label: 'Zdjęcie', type: 'upload', relationTo: 'media' }
const anchor: Field = { name: 'anchor', label: 'Kotwica (#)', type: 'text', admin: { position: 'sidebar' } }

// Scena: tło przypięte pod stroną główną (koncepcja po M1). Wariant wybierają przełączniki lato/zima i dzień/noc;
// brakujący wariant bierze najbliższy (zima-dzień jest podstawą). Pionowe kadry 9x16 dla telefonów.
const SCENE_VARIANTS = [
  ['winterDay', 'Zima, dzień'],
  ['winterNight', 'Zima, noc'],
  ['summerDay', 'Lato, dzień'],
  ['summerNight', 'Lato, noc'],
] as const
const sceneMedia = (suffix: '' | 'Portrait'): Field[] =>
  SCENE_VARIANTS.map(([v, label]) => ({
    name: `${v}${suffix}`,
    label: suffix ? `${label} (pion 9x16)` : label,
    type: 'upload',
    relationTo: 'media',
    admin: { width: '25%' },
  }))
const scene: Field = {
  name: 'scene',
  label: 'Scena w tle (zdjęcie lub film)',
  type: 'group',
  admin: { description: 'Tło, które przenika się, gdy sekcja jest na środku ekranu. Puste warianty biorą najbliższy, a pusta scena zostawia poprzednią.' },
  fields: [
    { type: 'row', fields: sceneMedia('') },
    { type: 'row', fields: sceneMedia('Portrait') },
  ],
}
const textVariants: Field = {
  name: 'textVariants',
  label: 'Warianty tekstu (lato, noc)',
  type: 'array',
  maxRows: 3,
  admin: { initCollapsed: true, description: 'Podstawowy tekst sekcji to zima, dzień. Tu wpisz nagłówek i krótki tekst na inne pory.' },
  fields: [
    {
      name: 'variant',
      label: 'Pora',
      type: 'select',
      required: true,
      options: SCENE_VARIANTS.filter(([v]) => v !== 'winterDay').map(([value, label]) => ({ value, label })),
    },
    { name: 'heading', label: 'Nagłówek', type: 'text', localized: true },
    { name: 'text', label: 'Tekst', type: 'textarea', localized: true },
  ],
}

const block = (slug: string, label: string, fields: Field[]): Block => ({
  slug,
  labels: { singular: label, plural: label },
  fields: [...fields, scene, textVariants, anchor],
})

export const HeroBlock = block('hero', 'Hero (film i hasło)', [
  { name: 'headline', label: 'Hasło', type: 'text', localized: true, required: true },
  { name: 'subline', label: 'Podtytuł', type: 'text', localized: true },
  { ...image, label: 'Kadr startowy (wyświetlany od razu)' },
  { name: 'video', label: 'Film w pętli (15–20 s)', type: 'upload', relationTo: 'media' },
  { name: 'showBookingBar', label: 'Pasek rezerwacji', type: 'checkbox', defaultValue: true },
])

export const IntroBlock = block('intro', 'Wstęp z liczbami', [
  eyebrow,
  heading,
  body,
  {
    name: 'stats',
    label: 'Liczby',
    type: 'array',
    maxRows: 6,
    fields: [
      { name: 'value', label: 'Wartość', type: 'text', required: true },
      { name: 'label', label: 'Opis', type: 'text', localized: true, required: true },
    ],
  },
])

export const PeaksPanoramaBlock = block('peaksPanorama', 'Panorama szczytów', [
  eyebrow,
  heading,
  body,
  { ...image, label: 'Panorama (szeroki kadr)' },
  { name: 'showMap', label: 'Drugi widok: mapa osady', type: 'checkbox', defaultValue: true },
  { name: 'map', label: 'Mapa osady', type: 'upload', relationTo: 'media' },
])

export const DayBlock = block('dayInSettlement', 'Dzień w osadzie', [
  eyebrow,
  heading,
  {
    name: 'scenes',
    label: 'Sceny',
    type: 'array',
    maxRows: 4,
    fields: [
      {
        name: 'time',
        label: 'Pora',
        type: 'select',
        required: true,
        options: [
          { label: 'Świt', value: 'dawn' },
          { label: 'Dzień', value: 'day' },
          { label: 'Zmierzch', value: 'dusk' },
          { label: 'Noc', value: 'night' },
        ],
      },
      { name: 'title', label: 'Tytuł', type: 'text', localized: true },
      { name: 'text', label: 'Tekst (zima)', type: 'textarea', localized: true },
      { name: 'summerText', label: 'Tekst (lato)', type: 'textarea', localized: true },
      image,
    ],
  },
])

export const HouseInsideBlock = block('houseInside', 'Dom od środka', [
  eyebrow,
  heading,
  body,
  {
    name: 'rooms',
    label: 'Pomieszczenia',
    type: 'array',
    fields: [{ name: 'title', label: 'Nazwa', type: 'text', localized: true }, { name: 'text', label: 'Opis', type: 'textarea', localized: true }, image],
  },
  { name: 'plan', label: 'Plan', type: 'upload', relationTo: 'media' },
])

export const RitualsBlock = block('rituals', 'Rytuały (sauna i bania)', [
  eyebrow,
  heading,
  body,
  {
    name: 'steps',
    label: 'Etapy (jedno słowo na etap)',
    type: 'array',
    fields: [{ name: 'word', label: 'Słowo', type: 'text', localized: true }, { name: 'text', label: 'Tekst', type: 'textarea', localized: true }, image],
  },
  { name: 'showPrices', label: 'Ceny z IceColdRes', type: 'checkbox', defaultValue: true },
])

const season: Field[] = [{ name: 'title', label: 'Tytuł', type: 'text', localized: true }, { name: 'text', label: 'Tekst', type: 'textarea', localized: true }, image]
export const SeasonsBlock = block('seasons', 'Zima / Lato', [
  eyebrow,
  heading,
  { name: 'winter', label: 'Zima', type: 'group', fields: season },
  { name: 'summer', label: 'Lato', type: 'group', fields: season },
])

export const SurroundingsBlock = block('surroundings', 'Okolica (mapa i atrakcje)', [
  eyebrow,
  heading,
  body,
  { name: 'map', label: 'Mapa', type: 'upload', relationTo: 'media' },
  { name: 'limit', label: 'Liczba wyróżnionych atrakcji', type: 'number', defaultValue: 6, min: 0, max: 12 },
])

export const StoryBlock = block('story', 'Opowieść (tekst i zdjęcie)', [
  eyebrow,
  heading,
  body,
  image,
  {
    name: 'imagePosition',
    label: 'Zdjęcie',
    type: 'select',
    defaultValue: 'end',
    options: [
      { label: 'Na początku', value: 'start' },
      { label: 'Na końcu', value: 'end' },
      { label: 'W tle', value: 'background' },
    ],
  },
])

export const TestimonialsBlock = block('testimonials', 'Opinie', [
  eyebrow,
  heading,
  { name: 'items', label: 'Opinie (puste = najnowsze)', type: 'relationship', relationTo: 'testimonials', hasMany: true, maxRows: 6 },
])

export const OffersNewsBlock = block('offersNews', 'Oferty i aktualności', [eyebrow, heading])

export const BookingInviteBlock = block('bookingInvite', 'Zaproszenie do rezerwacji', [eyebrow, heading, body])

export const GalleryBlock = block('gallery', 'Seria zdjęć', [
  eyebrow,
  heading,
  { name: 'images', label: 'Zdjęcia', type: 'upload', relationTo: 'media', hasMany: true },
])

export const FaqBlock = block('faq', 'Pytania i odpowiedzi', [
  heading,
  {
    name: 'items',
    label: 'Pytania',
    type: 'array',
    fields: [
      { name: 'question', label: 'Pytanie', type: 'text', localized: true, required: true },
      { name: 'answer', label: 'Odpowiedź', type: 'richText', localized: true },
    ],
  },
])

export const RichTextBlock = block('richText', 'Tekst', [heading, body])

// Gospodarze (osobisty akcent w opisie Osady): bez osób z wypełnionym imieniem sekcja się nie wyświetla
export const HostsBlock = block('hosts', 'Gospodarze', [
  eyebrow,
  heading,
  { name: 'intro', label: 'Wstęp', type: 'textarea', localized: true },
  {
    name: 'people',
    label: 'Osoby',
    type: 'array',
    maxRows: 6,
    fields: [
      { name: 'name', label: 'Imię', type: 'text' },
      { name: 'role', label: 'Rola (np. gospodyni)', type: 'text', localized: true },
      { name: 'photo', label: 'Zdjęcie', type: 'upload', relationTo: 'media' },
      { name: 'text', label: 'Kilka słów', type: 'textarea', localized: true },
    ],
  },
])

export const ALL_BLOCKS = [
  HeroBlock,
  IntroBlock,
  PeaksPanoramaBlock,
  DayBlock,
  HouseInsideBlock,
  RitualsBlock,
  SeasonsBlock,
  SurroundingsBlock,
  StoryBlock,
  TestimonialsBlock,
  OffersNewsBlock,
  BookingInviteBlock,
  GalleryBlock,
  FaqBlock,
  RichTextBlock,
  HostsBlock,
]
