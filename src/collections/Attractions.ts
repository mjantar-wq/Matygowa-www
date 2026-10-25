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
    { name: 'image', label: 'Zdjęcie', type: 'upload', relationTo: 'media' },
    { name: 'summary', label: 'Krótki opis', type: 'textarea', localized: true },
    { name: 'description', label: 'Opis', type: 'richText', localized: true },
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
        { name: 'lat', label: 'Szerokość geogr.', type: 'number' },
        { name: 'lng', label: 'Długość geogr.', type: 'number' },
      ],
    },
    { name: 'mapId', label: 'Id na mapie okolicy (G7)', type: 'text', admin: { position: 'sidebar', placeholder: 'a-kotelnica', description: 'Puste: a-<adres atrakcji>' } },
    { name: 'featured', label: 'Wyróżniona na stronie głównej', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
    seoField,
  ],
}
