import base from '../../content/structured-data.json'
import { getSettings } from '@/lib/cms'
import type { Locale } from '@/i18n/locales'

/** JSON-LD LodgingBusiness na stronie głównej: baza z content/, kontakt z Ustawień strony. Bez godzin otwarcia (decyzja Michała). */
export async function StructuredData({ locale }: { locale: Locale }) {
  const settings = await getSettings(locale)
  const { _note, ...data } = base as typeof base & { _note?: string }
  const site = process.env.NEXT_PUBLIC_SITE_URL
  const json = {
    ...data,
    url: site ? `${site}/` : data.url,
    telephone: settings?.phone?.replace(/\s/g, '') || data.telephone,
    email: settings?.email || data.email,
  }
  // „<” w danych nie może zamknąć znacznika script
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, '\\u003c') }} />
}
