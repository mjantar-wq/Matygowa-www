'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * `href`: klik w rysunek przenosi od razu pod ten adres (bez dymka).
 * `modal`: element `popoverId` to <dialog> (okno z opisem), otwierany przyciskiem pod rysunkiem.
 */
type Target = { svgId: string; popoverId: string; label: string; href?: string; modal?: boolean }

/**
 * Ilustracja SVG (G1 mapa, G2 panorama) wczytywana dopiero przy zbliżeniu do sekcji i wstawiana do strony,
 * żeby kolory szły z tokenów (dzień / noc, zima / lato). Wskazane grupy (np. #p-hawran, #b-dom-hawran)
 * stają się przyciskami otwierającymi dymki (popover) wyrenderowane na serwerze.
 * `listHidden`: lista przycisków pod rysunkiem jest niewidoczna, ale zostaje dla klawiatury i czytników ekranu.
 */
export function SvgHotspots({ src, targets, className, scrollLabel, listHidden }: { src: string; targets: Target[]; className?: string; scrollLabel?: string; listHidden?: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<'idle' | 'ready' | 'error'>('idle')

  useEffect(() => {
    const el = host.current
    if (!el) return
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch(src)
        if (!res.ok) throw new Error(String(res.status))
        const text = await res.text()
        if (cancelled) return
        el.innerHTML = text.replace(/<metadata>[\s\S]*?<\/metadata>/, '')
        const svg = el.querySelector('svg')
        svg?.setAttribute('aria-hidden', 'true')
        svg?.querySelectorAll('[tabindex],[role]').forEach((n) => {
          n.removeAttribute('tabindex')
          n.removeAttribute('role')
        })
        setState('ready')
      } catch {
        if (!cancelled) setState('error')
      }
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect()
          load()
        }
      },
      { rootMargin: '600px 0px' },
    )
    io.observe(el)
    return () => {
      cancelled = true
      io.disconnect()
    }
  }, [src])

  // Klik w rysunek (myszą, palcem) otwiera dymek; klawiatura i czytnik używają przycisków pod rysunkiem.
  useEffect(() => {
    const el = host.current
    if (state !== 'ready' || !el) return
    const cleanups = targets.map((t) => {
      const node = el.querySelector<SVGGraphicsElement>(`#${CSS.escape(t.svgId)}`)
      if (!node) return () => {}
      node.classList.add('mo-hotspot')
      const open = (): void => {
        if (t.href) return void location.assign(t.href)
        const pop = document.getElementById(t.popoverId)
        if (!pop) return
        if (pop instanceof HTMLDialogElement) return void showDialog(pop)
        pop.showPopover?.()
        place(pop, node)
      }
      node.addEventListener('click', open)
      return () => node.removeEventListener('click', open)
    })
    return () => cleanups.forEach((c) => c())
  }, [state, targets])

  return (
    <div className={className}>
      <div className="mo-svg-scroll" tabIndex={scrollLabel ? 0 : undefined} role={scrollLabel ? 'region' : undefined} aria-label={scrollLabel}>
        <div ref={host} className="mo-svg-host" data-state={state} />
      </div>
      <ul className={listHidden ? 'mo-hotspots mo-sr' : 'mo-hotspots'}>
        {targets.map((t) => (
          <li key={t.svgId}>
            <button
              type="button"
              popoverTarget={t.modal ? undefined : t.popoverId}
              aria-haspopup={t.modal ? 'dialog' : undefined}
              onClick={() => {
                const pop = document.getElementById(t.popoverId)
                if (pop instanceof HTMLDialogElement) return showDialog(pop)
                const node = host.current?.querySelector<SVGGraphicsElement>(`#${CSS.escape(t.svgId)}`)
                if (pop && node) requestAnimationFrame(() => place(pop, node))
              }}
              onMouseEnter={() => host.current?.querySelector(`#${CSS.escape(t.svgId)}`)?.classList.add('is-lit')}
              onMouseLeave={() => host.current?.querySelector(`#${CSS.escape(t.svgId)}`)?.classList.remove('is-lit')}
              onFocus={() => host.current?.querySelector(`#${CSS.escape(t.svgId)}`)?.classList.add('is-lit')}
              onBlur={() => host.current?.querySelector(`#${CSS.escape(t.svgId)}`)?.classList.remove('is-lit')}
            >
              {t.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Okno modalne z opisem; klik w tło je zamyka (przycisk × i Esc działają natywnie). */
function showDialog(d: HTMLDialogElement) {
  if (!d.dataset.ready) {
    d.dataset.ready = '1'
    d.addEventListener('click', (e) => {
      if (e.target === d) d.close()
    })
  }
  d.showModal()
}

/** Na szerokim ekranie dymek staje przy elemencie rysunku; na telefonie zostaje na środku (styl popovera). */
function place(pop: HTMLElement, node: Element) {
  if (!matchMedia('(min-width: 768px)').matches) {
    pop.style.removeProperty('inset')
    return
  }
  const r = node.getBoundingClientRect()
  const w = pop.offsetWidth
  const h = pop.offsetHeight
  const left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), innerWidth - w - 8)
  const below = r.bottom + 12
  const top = below + h < innerHeight - 8 ? below : Math.max(8, r.top - h - 12)
  pop.style.inset = `${top}px auto auto ${left}px`
}
