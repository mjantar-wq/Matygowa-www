'use client'

import { useRef, type ReactNode } from 'react'

/** Przycisk otwierający okienko (natywny <dialog>, ten sam wygląd co okienka atrakcji). Bez JS link prowadzi do `href`. */
export function GuideDialog({ href, label, closeLabel, children }: { href: string; label: string; closeLabel: string; children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null)
  return (
    <>
      <a
        href={href}
        className="mo-btn mo-btn--glowny"
        aria-haspopup="dialog"
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
          e.preventDefault()
          dialog.current?.showModal()
        }}
      >
        {label}
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
