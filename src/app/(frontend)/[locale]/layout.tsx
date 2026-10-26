import type { Metadata } from 'next'
import { fraunces, inter, jotNewsreader, rufina } from '@/app/fonts'
import { Analytics } from '@/components/Analytics'
import { ClickTracking } from '@/components/ClickTracking'
import { ConsentBanner } from '@/components/ConsentBanner'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { AMBIENCE_INIT_SCRIPT } from '@/lib/ambience'
import { dirOf } from '@/i18n/locales'
import { href } from '@/i18n/routes'
import { engineHosts } from '@/lib/booking'
import { pageContext, siteUrl, type LocaleParams } from '@/lib/page'
import '@/styles/globals.css'

/** Sezon domyślny z daty (koncepcja: Dwie pory roku); zapamiętany wybór gościa nadpisuje go skrypt nastroju. */
function seasonOf(date = new Date()) {
  const m = date.getUTCMonth() + 1
  return m >= 11 || m <= 3 ? 'zima' : 'lato'
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { t, settings } = await pageContext(params)
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: settings?.seoTitle || t.siteName, template: `%s · ${t.siteName}` },
    description: settings?.seoDescription || undefined,
  }
}

export default async function LocaleLayout({ children, params }: LocaleParams & { children: React.ReactNode }) {
  const ctx = await pageContext(params)
  return (
    <html lang={ctx.locale} dir={dirOf(ctx.locale)} data-sezon={seasonOf()} data-pora="dzien" suppressHydrationWarning className={`${fraunces.variable} ${inter.variable} ${rufina.variable} ${jotNewsreader.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: AMBIENCE_INIT_SCRIPT }} />
        <Analytics gtmId={ctx.settings?.gtmId} />
        <a className="mo-skip mo-btn mo-btn--glowny" href="#tresc">{ctx.t.skipToContent}</a>
        <SiteHeader locale={ctx.locale} t={ctx.t} />
        <main id="tresc">{children}</main>
        <SiteFooter locale={ctx.locale} t={ctx.t} settings={ctx.settings} />
        <ConsentBanner t={ctx.t.consent} policyHref={href(ctx.locale, 'documents', 'cookies')} />
        <ClickTracking engineHosts={engineHosts(ctx.settings)} />
      </body>
    </html>
  )
}
