'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Pozycja listy na stronie Okolica: kafelek otwiera okienko z opisem rozszerzonym i zdjęciami (natywny <dialog>).
 * Bez JS kafelek prowadzi do strony atrakcji. Adres #slug otwiera okienko od razu, więc da się je podlinkować.
 */
export function AttractionPopup({ slug, href, label, closeLabel, card, children }: { slug: string; href: string; label: string; closeLabel: string; card: ReactNode; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null)

  const open = () => {
    dialog.current?.showModal()
    history.replaceState(null, '', `#${slug}`)
  }

  useEffect(() => {
    if (location.hash === `#${slug}`) dialog.current?.showModal()
  }, [slug])

  return (
    <li>
      <a
        href={href}
        className="mo-card mo-card--poziom"
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
          e.preventDefault()
          open()
        }}
      >
        {card}
      </a>
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
