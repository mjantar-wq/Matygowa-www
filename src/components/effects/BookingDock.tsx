'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Przypięty przycisk „Sprawdź termin”: widoczny, gdy żaden pasek rezerwacji na stronie nie jest na ekranie,
 * i otwiera ten sam pasek w natywnym <dialog>. Dzięki temu rezerwacja jest pod ręką na całej długości opowieści,
 * nie tylko w hero i na samym dole.
 */
export function BookingDock({ label, close, children }: { label: string; close: string; children: React.ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const bars = [...document.querySelectorAll<HTMLElement>('.mo-booking-wrap')].filter((el) => !el.closest('.mo-dock'))
    const visible = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target)
        else visible.delete(e.target)
      }
      setShown(visible.size === 0)
    })
    bars.forEach((b) => io.observe(b))
    return () => io.disconnect()
  }, [])

  return (
    <div className="mo-dock" data-shown={shown || undefined}>
      <button type="button" className="mo-btn mo-btn--glowny mo-dock__open" onClick={() => dialog.current?.showModal()} tabIndex={shown ? 0 : -1} aria-hidden={!shown || undefined}>
        {label}
      </button>
      <dialog ref={dialog} className="mo-dock__dialog" aria-label={label} onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}>
        {/* zamykanie poza przewijaną treścią, więc zostaje na miejscu przy długich wynikach */}
        <button type="button" className="mo-dock__close" onClick={() => dialog.current?.close()} aria-label={close}>
          ×
        </button>
        <div className="mo-dock__body">{children}</div>
      </dialog>
    </div>
  )
}
