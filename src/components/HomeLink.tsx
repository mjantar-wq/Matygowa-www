'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { MouseEvent, ReactNode } from 'react'

/**
 * Logo w nagłówku: zawsze prowadzi na górę strony głównej. Na samej stronie głównej
 * (także z kotwicą w adresie) zamiast nawigacji przewija na górę i czyści kotwicę.
 */
export function HomeLink({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  const pathname = usePathname()
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== href || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    if (location.hash) history.replaceState(history.state, '', href)
    const instant = matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: instant ? 'auto' : 'smooth' })
  }
  return (
    <Link href={href} className={className} prefetch={false} scroll onClick={onClick}>
      {children}
    </Link>
  )
}
