import type { CollectionConfig } from 'payload'
import { owner, ownerField } from '../access'
import { syncAccessEmail } from '../lib/cloudflareAccess'

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
    // e-mail konta trafia do bramki Cloudflare Access na /panel (błąd API nie blokuje zapisu konta)
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        const before = operation === 'create' ? null : previousDoc?.email
        if (before === doc.email) return doc
        await syncAccessEmail(doc.email, before ?? null).catch((err) => req.payload.logger.error({ err }, 'Cloudflare Access: nie dopisano e-maila'))
        return doc
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        await syncAccessEmail(null, doc.email).catch((err) => req.payload.logger.error({ err }, 'Cloudflare Access: nie wykreślono e-maila'))
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
