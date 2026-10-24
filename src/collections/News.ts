import type { CollectionConfig } from 'payload'
import { editors, publishedOrLoggedIn } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'Aktualność', plural: 'Aktualności' },
  admin: { useAsTitle: 'title', group: 'Treści', defaultColumns: ['title', 'publishedAt', '_status'] },
  access: { read: publishedOrLoggedIn, create: editors, update: editors, delete: editors },
  // planowana publikacja (koncepcja F2)
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 30 },
  defaultSort: '-publishedAt',
  fields: [
    { name: 'title', label: 'Tytuł', type: 'text', required: true, localized: true },
    slugField(),
    { name: 'publishedAt', label: 'Data publikacji', type: 'date', required: true, defaultValue: () => new Date().toISOString(), admin: { position: 'sidebar' } },
    { name: 'eventDate', label: 'Data wydarzenia (opcjonalnie)', type: 'date', admin: { position: 'sidebar' } },
    { name: 'cover', label: 'Zdjęcie', type: 'upload', relationTo: 'media' },
    { name: 'excerpt', label: 'Zajawka', type: 'textarea', localized: true },
    { name: 'content', label: 'Treść', type: 'richText', localized: true },
    seoField,
  ],
}
