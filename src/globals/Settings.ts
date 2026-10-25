import type { GlobalConfig } from 'payload'
import { admins, anyone } from '../access'

/** Ustawienia strony (tylko administrator). Przełącznik silnika rezerwacji działa bez wdrożenia. */
export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Ustawienia strony',
  admin: { group: 'Ustawienia' },
  access: { read: anyone, update: admins },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Rezerwacje',
          fields: [
            {
              name: 'bookingEngine',
              label: 'Silnik rezerwacji',
              type: 'radio',
              required: true,
              defaultValue: 'hotres',
              options: [
                { label: 'Hotres (do czasu uruchomienia IceColdRes)', value: 'hotres' },
                { label: 'IceColdRes', value: 'icecoldres' },
              ],
            },
            { name: 'icecoldresUrl', label: 'Adres silnika IceColdRes', type: 'text', defaultValue: 'https://icecoldres.audiowizard.pl' },
            { name: 'hotresUrl', label: 'Adres rezerwacji Hotres', type: 'text', defaultValue: 'https://booking.hotres.pl/v4_step1?oid=5244' },
            { name: 'showPrices', label: 'Pokazuj ceny i dostępność z IceColdRes', type: 'checkbox', defaultValue: true },
            { name: 'priceSlogan', label: 'Hasło przy pasku rezerwacji', type: 'text', localized: true },
          ],
        },
        {
          label: 'Kontakt',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'phone', label: 'Telefon', type: 'text' },
                { name: 'email', label: 'E-mail', type: 'email' },
                { name: 'whatsapp', label: 'WhatsApp (numer)', type: 'text' },
              ],
            },
            { name: 'address', label: 'Adres', type: 'textarea' },
            { name: 'mapUrl', label: 'Link do mapy', type: 'text' },
            {
              name: 'social',
              label: 'Media społecznościowe',
              type: 'array',
              fields: [
                { name: 'label', label: 'Nazwa', type: 'text', required: true },
                { name: 'url', label: 'Adres', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          label: 'Pomiar i zgody',
          fields: [
            {
              name: 'gtmId',
              label: 'Identyfikator kontenera Google Tag Manager',
              type: 'text',
              admin: {
                placeholder: 'GTM-XXXXXXX',
                description: 'GA4 i piksel Meta działają jako tagi w GTM, tylko po zgodzie gościa (baner cookies). Puste pole: strona nie ładuje żadnych skryptów pomiarowych. Instrukcja: docs/pomiar.md.',
              },
              validate: (v: string | null | undefined) => !v || /^GTM-[A-Z0-9]+$/.test(v.trim().toUpperCase()) || 'Wpisz identyfikator w postaci GTM-XXXXXXX',
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'seoTitle', label: 'Tytuł domyślny', type: 'text', localized: true },
            { name: 'seoDescription', label: 'Opis domyślny', type: 'textarea', localized: true },
            { name: 'seoImage', label: 'Obraz domyślny', type: 'upload', relationTo: 'media' },
          ],
        },
      ],
    },
  ],
}
