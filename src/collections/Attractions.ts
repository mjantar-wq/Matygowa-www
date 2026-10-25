import type { CollectionConfig } from 'payload'
import { editors, publishedOrLoggedIn } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

export const ATTRACTION_CATEGORIES = [
  { label: 'Szlaki', value: 'trails' },
  { label: 'Narty', value: 'ski' },
  { label: 'Termy', value: 'thermal' },
  { label: 'Z dziećmi', value: 'family' },
  { label: 'Widoki', value: 'views' },
  { label: 'Rower', value: 'bike' },
  { label: 'Kultura i góralszczyzna', value: 'culture' },
]

export const Attractions: CollectionConfig = {
  slug: 'attractions',
  labels: { singular: 'Atrakcja', plural: 'Atrakcje' },
  admin: { useAsTitle: 'name', group: 'Treści', defaultColumns: ['name', 'category', 'distanceKm', 'featured', '_status'] },
  access: { read: publishedOrLoggedIn, create: editors, update: editors, delete: editors },
  versions: { drafts: true, maxPerDoc: 20 },
  defaultSort: 'distanceKm',
  fields: [
    { name: 'name', label: 'Nazwa', type: 'text', required: true, localized: true },
    slugField(),
    // podpis autora i licencji zdjęć z zewnątrz (CC, materiały prasowe) wpisuje się w polu „Podpis” pliku
    { name: 'image', label: 'Zdjęcie', type: 'upload', relationTo: 'media' },
    { name: 'gallery', label: 'Więcej zdjęć (strona Okolica)', type: 'upload', relationTo: 'media', hasMany: true },
    {
      name: 'summary',
      label: 'Krótki opis (strona główna)',
      type: 'textarea',
      localized: true,
      admin: { description: 'Dwa, trzy zdania do sekcji „Blisko wszystkiego” na stronie głównej.' },
    },
    { name: 'description', label: 'Opis rozszerzony (strona Okolica)', type: 'richText', localized: true },
    { name: 'place', label: 'Miejsce', type: 'text', localized: true, admin: { placeholder: 'Tatranská Kotlina, Słowacja' } },
    {
      type: 'row',
      fields: [
        { name: 'distanceKm', label: 'Odległość (km)', type: 'number', min: 0 },
        { name: 'driveMinutes', label: 'Dojazd (min)', type: 'number', min: 0 },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'category', label: 'Kategoria', type: 'select', options: ATTRACTION_CATEGORIES },
        {
          name: 'seasons',
          label: 'Pora roku',
          type: 'select',
          hasMany: true,
          defaultValue: ['winter', 'summer'],
          options: [
            { label: 'Zima', value: 'winter' },
            { label: 'Lato', value: 'summer' },
          ],
        },
      ],
    },
    { name: 'url', label: 'Link', type: 'text' },
    {
      type: 'row',
      fields: [
        // lokalizacja jest opcjonalna: szlaków i lotu balonem nie da się wskazać jednym punktem
        { name: 'lat', label: 'Szerokość geogr.', type: 'number' },
        { name: 'lng', label: 'Długość geogr.', type: 'number' },
      ],
    },
    {
      name: 'mapId',
      label: 'Id na mapie okolicy (G7)',
      type: 'text',
      admin: { position: 'sidebar', placeholder: 'a-kotelnica', description: 'Puste: bez punktu na mapie (np. szlaki, lot balonem).' },
    },
    {
      name: 'featured',
      label: 'Pokaż na stronie głównej',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Strona Okolica pokazuje wszystkie atrakcje; główna tylko zaznaczone, z krótkim opisem.' },
    },
    seoField,
  ],
}
