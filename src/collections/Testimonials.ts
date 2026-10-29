import type { CollectionConfig } from 'payload'
import { anyone, editors } from '../access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: { singular: 'Opinia', plural: 'Opinie' },
  admin: { useAsTitle: 'author', group: 'Treści', defaultColumns: ['author', 'source', 'rating', 'date'] },
  access: { read: anyone, create: editors, update: editors, delete: editors },
  defaultSort: '-date',
  fields: [
    { name: 'quote', label: 'Cytat', type: 'textarea', required: true, localized: true },
    {
      type: 'row',
      fields: [
        { name: 'author', label: 'Autor', type: 'text', required: true },
        {
          name: 'source',
          label: 'Źródło',
          type: 'select',
          options: [
            { label: 'Google', value: 'google' },
            { label: 'Booking.com', value: 'booking' },
            { label: 'Airbnb', value: 'airbnb' },
            { label: 'Inne', value: 'other' },
          ],
        },
        { name: 'rating', label: 'Ocena', type: 'number', min: 0, max: 10 },
        { name: 'date', label: 'Data', type: 'date' },
      ],
    },
    { name: 'unit', label: 'Domek (opcjonalnie)', type: 'relationship', relationTo: 'units' },
    {
      name: 'externalId',
      label: 'Id w źródle',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Opinie z tym polem pobiera automatycznie dwa razy w tygodniu zadanie z src/lib/reviews.ts. Wpisy ręczne go nie mają.',
      },
    },
  ],
}
