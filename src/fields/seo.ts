import type { GroupField } from 'payload'

export const seoField: GroupField = {
  name: 'seo',
  label: 'SEO',
  type: 'group',
  admin: { position: 'sidebar' },
  fields: [
    { name: 'title', label: 'Tytuł w wyszukiwarce', type: 'text', localized: true, maxLength: 70 },
    { name: 'description', label: 'Opis w wyszukiwarce', type: 'textarea', localized: true, maxLength: 160 },
    { name: 'image', label: 'Obraz do udostępniania', type: 'upload', relationTo: 'media' },
  ],
}
