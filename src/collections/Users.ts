import type { CollectionConfig } from 'payload'
import { owner, ownerField } from '../access'

/**
 * Konta panelu: właściciel (wszystko, jako jedyny zakłada konta i nadaje role), administrator (wszystko poza kontami)
 * i redaktor (treści bez ustawień i kont), koncepcja F2. Publicznej rejestracji nie ma: zakładanie kont ma tylko właściciel.
 */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Użytkownik', plural: 'Użytkownicy' },
  admin: { useAsTitle: 'email', group: 'Ustawienia' },
  auth: { maxLoginAttempts: 5, lockTime: 15 * 60 * 1000 },
  hooks: {
    // pierwsze konto (ekran „utwórz pierwszego użytkownika”) zostaje właścicielem, kolejne domyślnie redaktorami
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create' && (await req.payload.count({ collection: 'users', req })).totalDocs === 0) data.role = 'owner'
        return data
      },
    ],
  },
  access: {
    // pierwsze konto zakłada ekran „utwórz pierwszego użytkownika”; potem tylko właściciel
    create: owner,
    delete: owner,
    read: ({ req: { user } }) => (user?.role === 'owner' || user?.role === 'admin' ? true : user ? { id: { equals: user.id } } : false),
    // cudzy e-mail i hasło zmienia tylko właściciel, żeby administrator nie mógł przejąć jego konta
    update: ({ req: { user } }) => (user?.role === 'owner' ? true : user ? { id: { equals: user.id } } : false),
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
        { label: 'Właściciel', value: 'owner' },
        { label: 'Administrator', value: 'admin' },
        { label: 'Redaktor', value: 'editor' },
      ],
      access: { create: ownerField, update: ownerField },
      saveToJWT: true,
    },
  ],
}
