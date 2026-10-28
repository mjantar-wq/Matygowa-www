import type { CollectionConfig } from 'payload'
import { editors, publishedOrLoggedIn } from '../access'
import { seoField } from '../fields/seo'
import { slugField } from '../fields/slug'

/**
 * Domy i apartamenty („Dziesięć szczytów, jeden widok”). Nazwy są danymi, nie kodem (apartamenty
 * mają nazwy wstępne). Fakty, ceny i udogodnienia pochodzą z IceColdRes po polu icecoldresCode.
 */
export const Units: CollectionConfig = {
  slug: 'units',
  labels: { singular: 'Domek lub apartament', plural: 'Domki i apartamenty' },
  admin: { useAsTitle: 'name', group: 'Treści', defaultColumns: ['name', 'kind', 'status', 'order', '_status'] },
  access: { read: publishedOrLoggedIn, create: editors, update: editors, delete: editors },
  versions: { drafts: true, maxPerDoc: 50 },
  defaultSort: 'order',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', label: 'Nazwa (szczyt)', type: 'text', required: true, localized: true, admin: { width: '50%' } },
        {
          name: 'kind',
          label: 'Rodzaj',
          type: 'select',
          required: true,
          defaultValue: 'house',
          options: [
            { label: 'Domek', value: 'house' },
            { label: 'Apartament', value: 'apartment' },
          ],
          admin: { width: '25%' },
        },
        {
          name: 'status',
          label: 'Na stronie',
          type: 'select',
          required: true,
          defaultValue: 'bookable',
          options: [
            { label: 'W sprzedaży', value: 'bookable' },
            { label: 'Wkrótce (bez rezerwacji)', value: 'comingSoon' },
          ],
          admin: { width: '25%' },
        },
      ],
    },
    slugField(),
    { name: 'order', label: 'Kolejność', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    {
      name: 'icecoldresCode',
      label: 'Kod typu w IceColdRes',
      type: 'text',
      admin: { position: 'sidebar', description: 'Pole „code” typu kwatery w IceColdRes; zwykle równe adresowi.' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Opowieść',
          fields: [
            { name: 'tagline', label: 'Jedno zdanie', type: 'text', localized: true },
            { name: 'story', label: 'Opowieść o domu', type: 'richText', localized: true },
            { name: 'hero', label: 'Zdjęcie główne (widok z domu)', type: 'upload', relationTo: 'media' },
            { name: 'gallery', label: 'Seria zdjęć', type: 'upload', relationTo: 'media', hasMany: true },
            { name: 'plans', label: 'Plan pięter', type: 'upload', relationTo: 'media', hasMany: true },
          ],
        },
        {
          label: 'Szczyt',
          fields: [
            {
              name: 'peak',
              type: 'group',
              label: false,
              fields: [
                { name: 'name', label: 'Nazwa szczytu', type: 'text', localized: true, admin: { placeholder: 'Świnica' } },
                {
                  name: 'nameCases',
                  type: 'group',
                  label: 'Odmiana nazwy (po polsku, do zdań typu „z widokiem na Świnicę”)',
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        { name: 'gen', label: 'Dopełniacz (nie ma…)', type: 'text', admin: { placeholder: 'Świnicy' } },
                        { name: 'acc', label: 'Biernik (widok na…)', type: 'text', admin: { placeholder: 'Świnicę' } },
                        { name: 'loc', label: 'Miejscownik (o…)', type: 'text', admin: { placeholder: 'Świnicy' } },
                        { name: 'inst', label: 'Narzędnik (pod…)', type: 'text', admin: { placeholder: 'Świnicą' } },
                      ],
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'elevation', label: 'Wysokość (m n.p.m.)', type: 'number', min: 0 },
                    { name: 'range', label: 'Pasmo', type: 'text', localized: true, admin: { placeholder: 'Tatry Bielskie' } },
                  ],
                },
                { name: 'story', label: 'Historia szczytu (3–5 zdań, legenda albo ciekawostka)', type: 'richText', localized: true },
                {
                  type: 'row',
                  fields: [
                    { name: 'panoramaX', label: 'Pozycja na panoramie X (%)', type: 'number', min: 0, max: 100 },
                    { name: 'panoramaY', label: 'Pozycja na panoramie Y (%)', type: 'number', min: 0, max: 100 },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Fakty',
          description: 'Wyświetlane, dopóki IceColdRes nie poda ich sam.',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'area', label: 'Powierzchnia (m²)', type: 'number' },
                { name: 'bedrooms', label: 'Sypialnie', type: 'number' },
                { name: 'maxGuests', label: 'Maks. osób', type: 'number' },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'bathrooms', label: 'Łazienki', type: 'number' },
                { name: 'separateWc', label: 'Osobne WC', type: 'checkbox' },
                { name: 'ensuiteUpstairs', label: 'Łazienka przy sypialni na piętrze', type: 'checkbox' },
              ],
            },
            {
              name: 'livingRoom',
              label: 'Salon',
              type: 'select',
              options: [
                { label: 'Na parterze', value: 'ground' },
                { label: 'Na piętrze', value: 'upper' },
              ],
            },
            {
              name: 'beds',
              label: 'Łóżka',
              type: 'textarea',
              localized: true,
              admin: { description: 'Rodzaje łóżek w sypialniach i w salonie, jednym lub dwoma zdaniami.' },
            },
          ],
        },
      ],
    },
    seoField,
  ],
}
