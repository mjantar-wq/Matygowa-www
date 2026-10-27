import Link from 'next/link'
import { Suspense } from 'react'
import type { Dictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/i18n/locales'
import { href } from '@/i18n/routes'
import type { Setting } from '@/payload-types'
import { ConsentSettingsLink } from './ConsentBanner'
import { getNewsletterConsent } from '@/lib/icecoldres'
import { directionsUrl } from '@/lib/maps'
import { NewsletterForm } from './NewsletterForm'
import { SocialIcon, socialKind } from './SocialIcon'

export function SiteFooter({ locale, t, settings }: { locale: Locale; t: Dictionary; settings: Setting | null }) {
  const route = directionsUrl(settings)
  return (
    <footer className="mo-footer">
      <div className="mo-footer__wzor" aria-hidden="true" />
      <div className="mo-container mo-footer__grid">
        <div>
          <p className="mo-label">{t.footer.contact}</p>
          {settings?.phone ? <p><a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a></p> : null}
          {settings?.email ? <p><a href={`mailto:${settings.email}`}>{settings.email}</a></p> : null}
          {settings?.address ? <p style={{ whiteSpace: 'pre-line' }}>{settings.address}</p> : null}
          {route ? <p><a href={route} rel="noopener" target="_blank">{t.footer.directions}</a></p> : null}
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
            {/* jednobarwne logotypy zamiast nazw (Michał, 26.10.2026); serwis bez ikony zostaje podpisem */}
            <ul className="mo-footer__social">
              {settings.social.map((s) => {
                const kind = socialKind(s.url, s.label)
                return (
                  <li key={s.id ?? s.url}>
                    {kind ? (
                      <a className="mo-footer__ikona" href={s.url} rel="noopener" aria-label={kind === 'facebook' ? 'Facebook' : 'Instagram'}>
                        <SocialIcon kind={kind} />
                      </a>
                    ) : (
                      <a href={s.url} rel="noopener">{s.label}</a>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ) : null}
        {/* osobno w Suspense: wolne albo niedostępne IceColdRes nie wstrzymuje renderu strony */}
        <Suspense fallback={null}>
          <Newsletter locale={locale} t={t} />
        </Suspense>
        <p className="mo-muted">© {new Date().getFullYear()} {t.siteName}. {t.footer.rights}.</p>
      </div>
    </footer>
  )
}

/** Bez tekstu zgody z IceColdRes (API niedostępne) formularza nie pokazujemy: zgoda musi mieć wersję. */
async function Newsletter({ locale, t }: { locale: Locale; t: Dictionary }) {
  const consent = await getNewsletterConsent(locale)
  if (!consent) return null
  // link do polityki pochodzi z zewnętrznego API: tylko https, inaczej nasza strona polityki
  const privacyUrl = /^https:\/\//.test(consent.privacyUrl ?? '') ? consent.privacyUrl : href(locale, 'documents', 'prywatnosc')
  return (
    <div>
      <p className="mo-label">{t.newsletter.title}</p>
      <NewsletterForm locale={locale} t={t.newsletter} consent={{ ...consent, privacyUrl }} />
    </div>
  )
}
