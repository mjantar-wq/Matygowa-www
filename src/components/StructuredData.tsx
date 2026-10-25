import base from '../../content/structured-data.json'
import { getSettings } from '@/lib/cms'
import { getProperty } from '@/lib/icecoldres'
import type { Locale } from '@/i18n/locales'

/** JSON-LD LodgingBusiness na stronie głównej: baza z content/, kontakt z Ustawień strony. Bez godzin otwarcia (decyzja Michała). */
export async function StructuredData({ locale }: { locale: Locale }) {
  const [settings, property] = await Promise.all([getSettings(locale), getProperty()])
  const { _note, ...data } = base as typeof base & { _note?: string }
  const site = process.env.NEXT_PUBLIC_SITE_URL
  const json = {
    ...data,
    url: site ? `${site}/` : data.url,
    telephone: settings?.phone?.replace(/\s/g, '') || data.telephone,
    email: settings?.email || data.email,
    checkinTime: property?.property.checkInFrom ?? '16:00',
    checkoutTime: property?.property.checkOutBy ?? '11:00',
  }
  // „<” w danych nie może zamknąć znacznika script
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, '\\u003c') }} />
}
