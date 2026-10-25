import type { CollectionConfig } from 'payload'
import { editors, publishedOrLoggedIn } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

/**
 * Oferty sezonowe (opisowe). Promocje z rabatem tworzy się raz w cenniku IceColdRes; tu tylko zdjęcie
 * i dłuższy opis, powiązane po identyfikatorze promocji albo oferty.
 */
export const Offers: CollectionConfig = {
  slug: 'offers',
  labels: { singular: 'Oferta', plural: 'Oferty' },
  admin: { useAsTitle: 'title', group: 'Treści', defaultColumns: ['title', 'validFrom', 'validTo', '_status'] },
  access: { read: publishedOrLoggedIn, create: editors, update: editors, delete: editors },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 20 },
  defaultSort: 'order',
  fields: [
    { name: 'title', label: 'Tytuł', type: 'text', required: true, localized: true },
    slugField(),
    { name: 'order', label: 'Kolejność', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'image', label: 'Zdjęcie', type: 'upload', relationTo: 'media' },
    { name: 'summary', label: 'Zajawka', type: 'textarea', localized: true },
    { name: 'content', label: 'Opis', type: 'richText', localized: true },
    {
      type: 'row',
      fields: [
        { name: 'validFrom', label: 'Pobyt od', type: 'date' },
        { name: 'validTo', label: 'Pobyt do', type: 'date' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'icecoldresPromotionId', label: 'ID promocji w IceColdRes', type: 'text' },
        { name: 'icecoldresOfferId', label: 'ID oferty w IceColdRes', type: 'text' },
      ],
    },
    seoField,
  ],
}
