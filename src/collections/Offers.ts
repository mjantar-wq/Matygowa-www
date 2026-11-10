import type { CollectionConfig } from 'payload'
import { anyone, editors } from '../access'

/**
 * Oferty na stronie to promocje z cennika IceColdRes (Michał, 10.11.2026: oferty dodajemy w IceColdRes). Panel pokazuje
 * tylko listę zaimportowanych promocji z przełącznikiem „Pokazuj na stronie” i opcją podmiany zdjęcia. Wpisy zakłada i usuwa synchronizacja
 * (src/lib/offers-sync.ts); tytuł, opisy, daty i sezon ustawia się w IceColdRes.
 */
export const Offers: CollectionConfig = {
  slug: 'offers',
  labels: { singular: 'Oferta', plural: 'Oferty' },
  admin: {
    useAsTitle: 'title',
    group: 'Treści',
    defaultColumns: ['title', 'icecoldresPromotionId', 'published'],
    description: 'Lista ofert zaimportowanych z IceColdRes. Tutaj możesz włączyć albo wyłączyć pokazywanie oferty na stronie i podmienić jej zdjęcie. Treść i nowe oferty ustawiasz w IceColdRes.',
    components: { beforeList: ['/components/admin/OffersSync#OffersSync'] },
  },
  // tylko synchronizacja zakłada i usuwa wpisy (Local API z pominięciem reguł dostępu)
  access: { read: anyone, create: () => false, update: editors, delete: () => false },
  defaultSort: 'order',
  fields: [
    { name: 'title', label: 'Oferta (z IceColdRes)', type: 'text', required: true, localized: true, admin: { readOnly: true } },
    { name: 'published', label: 'Pokazuj na stronie', type: 'checkbox', defaultValue: true },
    {
      name: 'image',
      label: 'Własne zdjęcie',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Opcjonalnie. Zastępuje zdjęcie z IceColdRes; bez niego strona bierze zdjęcie z promocji w IceColdRes, a gdy go nie ma, losowe zdjęcie domku. Synchronizacja nie zmienia tego pola.' },
    },
    { name: 'icecoldresPromotionId', label: 'ID promocji w IceColdRes', type: 'text', unique: true, index: true, admin: { readOnly: true } },
    { name: 'slug', type: 'text', admin: { hidden: true } },
    { name: 'order', type: 'number', defaultValue: 0, admin: { hidden: true } },
  ],
}
