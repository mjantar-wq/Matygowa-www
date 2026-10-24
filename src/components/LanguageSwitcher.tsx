'use client'

import { usePathname } from 'next/navigation'
import { ENABLED_LOCALES, LOCALES, type Locale } from '@/i18n/locales'
import { href, parsePath } from '@/i18n/routes'

/** Przełącznik języka zachowuje bieżącą podstronę (koncepcja F3). */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname()
  const current = parsePath(pathname, ENABLED_LOCALES)
  return (
    <nav aria-label={label} className="mo-nav">
      {ENABLED_LOCALES.map((l) => (
        <a key={l} href={current ? href(l, current.route, current.slug) : href(l, 'home')} hrefLang={l} lang={l} aria-current={l === locale ? 'true' : undefined}>
          {l.toUpperCase()}
          <span className="sr-only"> {LOCALES[l].label}</span>
        </a>
      ))}
    </nav>
  )
}
