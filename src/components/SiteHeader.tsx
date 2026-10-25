import Link from 'next/link'
import type { Dictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/i18n/locales'
import { href, type RouteKey } from '@/i18n/routes'
import { HomeLink } from './HomeLink'
import { LanguageSwitcher } from './LanguageSwitcher'
import { AmbienceSwitch } from './effects/AmbienceSwitch'

/** Osiem głównych sekcji menu (koncepcja: Szkielet strony). */
export const MAIN_NAV: RouteKey[] = ['houses', 'rituals', 'surroundings', 'offers', 'news', 'settlement', 'gallery', 'contact']

export function SiteHeader({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <header className="mo-header">
      <div className="mo-container mo-header__inner">
        <HomeLink href={href(locale, 'home')} className="mo-logo">
          <span className="mo-sr">{t.siteName}</span>
        </HomeLink>
        <button type="button" className="mo-menu-btn mo-btn mo-btn--obrys mo-btn--maly" popoverTarget="menu-glowne">
          {t.menu}
        </button>
        <nav aria-label={t.menu} className="mo-nav" id="menu-glowne" popover="auto">
          {MAIN_NAV.map((key) => (
            <Link key={key} href={href(locale, key)} prefetch={false}>
              {t.nav[key]}
            </Link>
          ))}
          <AmbienceSwitch t={t.effects} />
        </nav>
        <AmbienceSwitch t={t.effects} />
        <LanguageSwitcher locale={locale} label={t.language} />
      </div>
    </header>
  )
}
