import type { CollectionConfig } from 'payload'
import { admins, adminsField } from '../access'

/** Konta panelu: administrator (wszystko) i redaktor (treści bez ustawień i kont), koncepcja F2. */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Użytkownik', plural: 'Użytkownicy' },
  admin: { useAsTitle: 'email', group: 'Ustawienia' },
  auth: { maxLoginAttempts: 5, lockTime: 15 * 60 * 1000 },
  hooks: {
    // pierwsze konto (ekran „utwórz pierwszego użytkownika”) zostaje administratorem, kolejne domyślnie redaktorami
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create' && (await req.payload.count({ collection: 'users', req })).totalDocs === 0) data.role = 'admin'
        return data
      },
    ],
  },
  access: {
    // pierwsze konto zakłada ekran „utwórz pierwszego użytkownika”; potem tylko administrator
    create: admins,
    delete: admins,
    read: ({ req: { user } }) => (user?.role === 'admin' ? true : user ? { id: { equals: user.id } } : false),
    update: ({ req: { user } }) => (user?.role === 'admin' ? true : user ? { id: { equals: user.id } } : false),
  },
  fields: [
    { name: 'name', label: 'Imię i nazwisko', type: 'text' },
    {
      name: 'role',
      label: 'Rola',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Redaktor', value: 'editor' },
      ],
      access: { update: adminsField },
      saveToJWT: true,
    },
  ],
}
