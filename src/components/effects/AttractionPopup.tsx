'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Pozycja listy atrakcji (strona Okolica i „Wszędzie blisko” na głównej): klik otwiera okienko z opisem rozszerzonym
 * i zdjęciami (natywny <dialog>). Bez JS link prowadzi do strony atrakcji. Adres #slug otwiera okienko od razu.
 */
export function AttractionPopup({
  slug,
  href,
  label,
  closeLabel,
  card,
  children,
  className,
  linkClassName = 'mo-card mo-card--poziom',
  focus,
  after,
  season,
}: {
  slug: string
  href: string
  label: string
  closeLabel: string
  card: ReactNode
  children: ReactNode
  className?: string
  linkClassName?: string
  /** punkt na mapie sceny (data-scene-focus) */
  focus?: string
  /** treść pod linkiem, np. rozwijany krótki opis na głównej */
  after?: ReactNode
  /** sezon promocji (oferty): przełącznik lato/zima chowa pozycję w CSS */
  season?: 'lato' | 'zima'
}) {
  const dialog = useRef<HTMLDialogElement>(null)

  const open = () => {
    dialog.current?.showModal()
    history.replaceState(null, '', `#${slug}`)
  }

  useEffect(() => {
    if (location.hash === `#${slug}`) dialog.current?.showModal()
  }, [slug])

  return (
    <li className={className} data-scene-focus={focus} data-sezon-promo={season}>
      <a
        href={href}
        className={linkClassName}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
          e.preventDefault()
          open()
        }}
      >
        {card}
      </a>
      {after}
      <dialog
        ref={dialog}
        className="mo-popup"
        aria-label={label}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close()
        }}
        onClose={() => {
          if (location.hash === `#${slug}`) history.replaceState(null, '', location.pathname + location.search)
        }}
      >
        <div className="mo-popup__pasek">
          <button type="button" className="mo-popup__close" onClick={() => dialog.current?.close()} aria-label={closeLabel} autoFocus>
            ×
          </button>
        </div>
        <div className="mo-popup__tresc">{children}</div>
      </dialog>
    </li>
  )
}
