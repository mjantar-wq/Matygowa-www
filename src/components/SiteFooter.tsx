import Link from 'next/link'
import type { Dictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/i18n/locales'
import { href } from '@/i18n/routes'
import type { Setting } from '@/payload-types'
import { ConsentSettingsLink } from './ConsentBanner'

export function SiteFooter({ locale, t, settings }: { locale: Locale; t: Dictionary; settings: Setting | null }) {
  return (
    <footer className="mo-footer">
      <div className="mo-footer__wzor" aria-hidden="true" />
      <div className="mo-container mo-footer__grid">
        <div>
          <p className="mo-label">{t.footer.contact}</p>
          {settings?.phone ? <p><a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a></p> : null}
          {settings?.email ? <p><a href={`mailto:${settings.email}`}>{settings.email}</a></p> : null}
          {settings?.address ? <p style={{ whiteSpace: 'pre-line' }}>{settings.address}</p> : null}
        </div>
        <nav aria-label={t.menu}>
          <ul>
            {(['guide', 'contact', 'news'] as const).map((key) => (
              <li key={key}><Link href={href(locale, key)} prefetch={false}>{t.nav[key]}</Link></li>
            ))}
            {(['regulamin', 'prywatnosc', 'cookies'] as const).map((slug, i) => (
              <li key={slug}><Link href={href(locale, 'documents', slug)} prefetch={false}>{[t.footer.terms, t.footer.privacy, t.footer.cookies][i]}</Link></li>
            ))}
            <li><ConsentSettingsLink label={t.footer.cookieSettings} /></li>
          </ul>
        </nav>
        {settings?.social?.length ? (
          <div>
            <p className="mo-label">{t.footer.follow}</p>
            <ul>{settings.social.map((s) => <li key={s.id ?? s.url}><a href={s.url} rel="noopener">{s.label}</a></li>)}</ul>
          </div>
        ) : null}
        <p className="mo-muted">© {new Date().getFullYear()} {t.siteName}. {t.footer.rights}.</p>
      </div>
    </footer>
  )
}
