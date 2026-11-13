'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ENABLED_LOCALES, LOCALES, type Locale } from '@/i18n/locales'
import { href, parsePath } from '@/i18n/routes'

/** Flagi jako SVG (emoji flag nie renderuje Windows). Dekoracyjne: nazwę języka niesie tekst. */
function Flag({ locale }: { locale: Locale }) {
  const common = { className: 'mo-lang__flag', viewBox: '0 0 24 16', width: 24, height: 16, 'aria-hidden': true, focusable: false } as const
  if (locale === 'en') {
    return (
      <svg {...common}>
        <rect width="24" height="16" fill="#012169" />
        <path d="M0 0l24 16M24 0L0 16" stroke="#fff" strokeWidth="3.2" />
        <path d="M0 0l24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1.2" />
        <path d="M12 0v16M0 8h24" stroke="#fff" strokeWidth="5.2" />
        <path d="M12 0v16M0 8h24" stroke="#C8102E" strokeWidth="3" />
      </svg>
    )
  }
  if (locale === 'pl') {
    return (
      <svg {...common}>
        <rect width="24" height="8" fill="#fff" />
        <rect y="8" width="24" height="8" fill="#DC143C" />
      </svg>
    )
  }
  return null
}

/** Przełącznik języka: lista rozwijana z flagami, zachowuje bieżącą podstronę (koncepcja F3). */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname()
  const current = parsePath(pathname, ENABLED_LOCALES)
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        button.current?.focus()
      }
    }
    const onFocusOut = (e: FocusEvent) => {
      if (e.relatedTarget && !root.current?.contains(e.relatedTarget as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    const el = root.current
    el?.addEventListener('focusout', onFocusOut)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
      el?.removeEventListener('focusout', onFocusOut)
    }
  }, [open])

  return (
    <div ref={root} className="mo-lang">
      <button
        ref={button}
        type="button"
        className="mo-lang__btn"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={`${label}: ${LOCALES[locale].label}`}
        onClick={() => setOpen((v) => !v)}
      >
        <Flag locale={locale} />
        <span className="mo-lang__code" aria-hidden="true">{locale.toUpperCase()}</span>
        <svg className="mo-lang__arrow" viewBox="0 0 10 6" width="10" height="6" aria-hidden="true" focusable="false">
          <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <ul id={listId} className="mo-lang__list" hidden={!open}>
        {ENABLED_LOCALES.map((l) => (
          <li key={l}>
            <a
              href={current ? href(l, current.route, current.slug) : href(l, 'home')}
              hrefLang={l}
              lang={l}
              aria-current={l === locale ? 'true' : undefined}
              onClick={() => setOpen(false)}
            >
              <Flag locale={l} />
              <span>{LOCALES[l].label}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
