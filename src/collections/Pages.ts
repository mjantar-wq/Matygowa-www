import type { CollectionConfig } from 'payload'
import { editors, publishedOrLoggedIn } from '../access'
import { ALL_BLOCKS } from '../blocks/config'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

/**
 * Strony i sekcje. Strony stałe mają adres równy kluczowi podstrony (home, rituals, settlement, gallery,
 * guide, contact, surroundings, offers, news, houses); dokumenty (regulamin, prywatność, cookies)
 * mają rodzaj „dokument” i własny adres pod /dokumenty/….
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'Strona', plural: 'Strony i sekcje' },
  admin: { useAsTitle: 'title', group: 'Treści', defaultColumns: ['title', 'slug', 'kind', '_status'] },
  access: { read: publishedOrLoggedIn, create: editors, update: editors, delete: editors },
  versions: { drafts: true, maxPerDoc: 50 },
  fields: [
    { name: 'title', label: 'Tytuł', type: 'text', required: true, localized: true },
    slugField({
      admin: {
        position: 'sidebar',
        description: 'Strony stałe: home, houses, rituals, surroundings, offers, news, settlement, gallery, guide, contact. Dokumenty: np. regulamin.',
      },
    }),
    {
      name: 'kind',
      label: 'Rodzaj',
      type: 'select',
      defaultValue: 'section',
      options: [
        { label: 'Strona menu', value: 'section' },
        { label: 'Dokument', value: 'document' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'intro', label: 'Wstęp', type: 'textarea', localized: true },
    { name: 'layout', label: 'Sekcje', type: 'blocks', blocks: ALL_BLOCKS },
    seoField,
  ],
}
