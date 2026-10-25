import type { CollectionConfig } from 'payload'
import { editors, publishedOrLoggedIn } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

/**
 * Zdjęcie do promocji z IceColdRes (Michał, 25.10.2026: oferty i ich opisy pochodzą tylko z promocji w cenniku
 * IceColdRes). Łączone po ID promocji; oferta bez pasującej, aktywnej promocji nie jest pokazywana.
 */
export const Offers: CollectionConfig = {
  slug: 'offers',
  labels: { singular: 'Oferta', plural: 'Oferty' },
  admin: {
    useAsTitle: 'title',
    group: 'Treści',
    defaultColumns: ['title', 'icecoldresPromotionId', '_status'],
    description: 'Oferty na stronie to promocje z cennika IceColdRes: tytuł, opisy (także dłuższy), daty i sezon ustawiasz w IceColdRes. Tu wybierasz promocję z listy i dodajesz do niej zdjęcie.',
  },
  access: { read: publishedOrLoggedIn, create: editors, update: editors, delete: editors },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 20 },
  defaultSort: 'order',
  fields: [
    { name: 'title', label: 'Tytuł', type: 'text', required: true, localized: true },
    slugField(),
    { name: 'order', label: 'Kolejność', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'image', label: 'Zdjęcie', type: 'upload', relationTo: 'media', admin: { description: 'Bez zdjęcia strona pokaże zdjęcie jednego z domków.' } },
    {
      type: 'row',
      fields: [
        {
          name: 'icecoldresPromotionId',
          label: 'Promocja w IceColdRes',
          type: 'text',
          admin: {
            description: 'Lista promocji z cennika IceColdRes. Bez wybranej promocji oferta nie pojawi się na stronie.',
            components: { Field: '/components/admin/PromotionField#PromotionField' },
          },
        },
        { name: 'icecoldresOfferId', label: 'ID oferty w IceColdRes', type: 'text' },
      ],
    },
    seoField,
  ],
}
