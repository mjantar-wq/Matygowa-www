import Link from 'next/link'
import type { Dictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/i18n/locales'
import { href, type RouteKey } from '@/i18n/routes'
import { LanguageSwitcher } from './LanguageSwitcher'

/** Osiem głównych sekcji menu (koncepcja: Szkielet strony). */
export const MAIN_NAV: RouteKey[] = ['houses', 'rituals', 'surroundings', 'offers', 'news', 'settlement', 'gallery', 'contact']

export function SiteHeader({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <header className="mo-header">
      <div className="mo-container mo-header__inner">
        <Link href={href(locale, 'home')} className="mo-h3" style={{ textDecoration: 'none', color: 'inherit' }}>
          {t.siteName}
        </Link>
        <nav aria-label={t.menu} className="mo-nav">
          {MAIN_NAV.map((key) => (
            <Link key={key} href={href(locale, key)}>
              {t.nav[key]}
            </Link>
          ))}
        </nav>
        <LanguageSwitcher locale={locale} label={t.language} />
      </div>
    </header>
  )
}
