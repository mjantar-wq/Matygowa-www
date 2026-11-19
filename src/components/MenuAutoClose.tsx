'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Zamyka rozwijane menu (popover) na telefonie po wyborze pozycji: także linków do kotwic
 * na tej samej stronie i przełącznika języka. Na desktopie menu nie jest popoverem, więc nic nie robi.
 */
export function MenuAutoClose({ id }: { id: string }): null {
  const pathname = usePathname()

  const close = (): void => {
    const nav = document.getElementById(id)
    if (nav?.matches(':popover-open')) nav.hidePopover()
  }

  useEffect(() => {
    const nav = document.getElementById(id)
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest('a[href]')) close()
    }
    nav?.addEventListener('click', onClick)
    // przełącznik języka leży poza <nav>, ale też ma zamykać menu
    const lang = document.querySelector('.mo-lang')
    lang?.addEventListener('click', onClick as EventListener)
    return () => {
      nav?.removeEventListener('click', onClick)
      lang?.removeEventListener('click', onClick as EventListener)
    }
  }, [id])

  // nawigacja klienta (zmiana adresu) także zamyka menu
  useEffect(() => close(), [pathname]) // eslint-disable-line react-hooks/exhaustive-deps
  return null
}
