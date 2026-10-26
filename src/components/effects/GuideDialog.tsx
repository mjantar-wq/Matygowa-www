'use client'

import { useRef, type ReactNode } from 'react'

/**
 * Przycisk otwierający okienko (natywny <dialog>, ten sam wygląd co okienka atrakcji). Bez JS link prowadzi do `href`.
 * Z `hint` przycisk ma postać książki z parzenicami na okładce (główna, wg Michała 26.10.2026).
 */
export function GuideDialog({ href, label, closeLabel, hint, children }: { href: string; label: string; closeLabel: string; hint?: string; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null)
  return (
    <>
      <a
        href={href}
        className={hint ? 'mo-btn mo-btn--glowny mo-ksiazka' : 'mo-btn mo-btn--glowny'}
        aria-haspopup="dialog"
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
          e.preventDefault()
          dialog.current?.showModal()
        }}
      >
        {hint ? (
          <>
            <span className="mo-ksiazka__tytul">{label}</span>
            <span className="mo-ksiazka__opis">{hint}</span>
          </>
        ) : (
          label
        )}
      </a>
      <dialog
        ref={dialog}
        className="mo-popup"
        aria-label={label}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close()
        }}
      >
        <div className="mo-popup__pasek">
          <button type="button" className="mo-popup__close" onClick={() => dialog.current?.close()} aria-label={closeLabel} autoFocus>
            ×
          </button>
        </div>
        <div className="mo-popup__tresc">{children}</div>
      </dialog>
    </>
  )
}
