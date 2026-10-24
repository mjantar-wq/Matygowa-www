import type { TextField } from 'payload'

/** Stały klucz wpisu w adresie (np. „hawran”): małe litery, cyfry i myślniki, bez polskich znaków. */
export const slugField = (overrides: Partial<TextField> = {}): TextField => ({
  name: 'slug',
  label: 'Adres (slug)',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: { position: 'sidebar', description: 'Np. „hawran”. Zmiana adresu wymaga przekierowania ze starego.' },
  validate: (value: unknown) =>
    typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
      ? true
      : 'Tylko małe litery bez polskich znaków, cyfry i myślniki, np. czerwone-wierchy',
  ...overrides,
} as TextField)
