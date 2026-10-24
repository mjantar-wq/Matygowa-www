import type { Metadata } from 'next'
import { fraunces, inter, rufina } from '@/app/fonts'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { UtmCapture } from '@/components/UtmCapture'
import { dirOf } from '@/i18n/locales'
import { pageContext, type LocaleParams } from '@/lib/page'
import '@/styles/globals.css'

/** Sezon domyślny z daty (koncepcja: Dwie pory roku); przełącznik na stronie zmieni go później. */
function seasonOf(date = new Date()) {
  const m = date.getUTCMonth() + 1
  return m >= 11 || m <= 3 ? 'zima' : 'lato'
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { t, settings } = await pageContext(params)
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://matygowa.audiowizard.pl'),
    title: { default: settings?.seoTitle || t.siteName, template: `%s · ${t.siteName}` },
    description: settings?.seoDescription || undefined,
  }
}

export default async function LocaleLayout({ children, params }: LocaleParams & { children: React.ReactNode }) {
  const ctx = await pageContext(params)
  return (
    <html lang={ctx.locale} dir={dirOf(ctx.locale)} data-sezon={seasonOf()} data-pora="dzien" className={`${fraunces.variable} ${inter.variable} ${rufina.variable}`}>
      <body>
        <a className="mo-skip mo-btn mo-btn--glowny" href="#tresc">{ctx.t.skipToContent}</a>
        <SiteHeader locale={ctx.locale} t={ctx.t} />
        <main id="tresc">{children}</main>
        <UtmCapture />
        <SiteFooter locale={ctx.locale} t={ctx.t} settings={ctx.settings} />
      </body>
    </html>
  )
}
