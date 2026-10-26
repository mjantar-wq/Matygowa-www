import type { CollectionConfig } from 'payload'
import { anyone, editors } from '../access'

/**
 * Zdjęcia i filmy (R2). Rozmiary AVIF/WebP robi Cloudflare przy wyświetlaniu, bo na Workers nie ma sharp.
 * „Materiał tymczasowy” oznacza obrazy CGI używane do odbioru sesji foto (Michał, 24.10.2026),
 * żeby łatwo znaleźć i podmienić je na finalne.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Plik', plural: 'Galeria i media' },
  admin: {
    group: 'Treści',
    defaultColumns: ['filename', 'alt', 'isPlaceholder', 'rights', 'series', 'updatedAt'],
    listSearchableFields: ['filename', 'alt'],
  },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  upload: {
    // brak sharp w Workers: bez kadrowania w panelu; punkt ostrości zapisujemy ręcznie (focusX/focusY)
    crop: false,
    focalPoint: false,
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
    // pliki z R2 idą przez Worker; bez tego każde wyświetlenie to żądanie do Payload (domyślnie no-store).
    // Payload nadaje nowej wersji pliku nową nazwę, więc 30 dni w przeglądarce i na CDN jest bezpieczne.
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'public, max-age=2592000, stale-while-revalidate=86400')
      return headers
    },
  },
  fields: [
    { name: 'alt', label: 'Tekst alternatywny', type: 'text', required: true, localized: true },
    { name: 'caption', label: 'Podpis', type: 'text', localized: true },
    {
      name: 'isPlaceholder',
      label: 'Materiał tymczasowy (CGI)',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: { position: 'sidebar', description: 'Zaznacz dla obrazów wygenerowanych do czasu sesji zdjęciowej. Lista filtrowana po tym polu pokazuje, co jeszcze trzeba podmienić.' },
    },
    {
      // zdjęcia z zewnątrz: wolna licencja (CC, podpis w polu „Podpis”), zgoda obiektu na piśmie albo zgoda w toku.
      // „Czeka na zgodę” jest widoczne tylko na stronie testowej; na produkcji (SITE_INDEXABLE=true) strona go nie pokazuje.
      name: 'rights',
      label: 'Prawa do zdjęcia',
      type: 'select',
      index: true,
      admin: { position: 'sidebar', description: 'Dla zdjęć spoza własnej sesji. „Czeka na zgodę” nie pokaże się na produkcji.' },
      options: [
        { label: 'Wolna licencja (CC)', value: 'free' },
        { label: 'Zgoda obiektu', value: 'granted' },
        { label: 'Czeka na zgodę', value: 'pending' },
      ],
    },
    {
      name: 'series',
      label: 'Seria',
      type: 'select',
      hasMany: true,
      admin: { position: 'sidebar' },
      options: [
        { label: 'Zima', value: 'winter' },
        { label: 'Lato', value: 'summer' },
        { label: 'Dzień', value: 'day' },
        { label: 'Noc', value: 'night' },
        { label: 'Wnętrza', value: 'interiors' },
        { label: 'Rytuały', value: 'rituals' },
        { label: 'Okolica', value: 'surroundings' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'focusX', label: 'Punkt ostrości X (%)', type: 'number', min: 0, max: 100, defaultValue: 50 },
        { name: 'focusY', label: 'Punkt ostrości Y (%)', type: 'number', min: 0, max: 100, defaultValue: 50 },
      ],
    },
  ],
}
