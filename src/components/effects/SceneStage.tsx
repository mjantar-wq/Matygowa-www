'use client'

import { useEffect, useRef, useState } from 'react'
import type { Dictionary } from '@/i18n/dictionaries'
import type { Scene } from '@/lib/scenes'
import { HeroStage } from './HeroStage'

const SVG: Partial<Record<Scene['kind'], string>> = { panorama: '/ilustracje/G2_panorama.svg', map: '/ilustracje/G7_mapa_okolicy.svg' }

/**
 * Przypięta scena pod całą stroną główną. Rozdział albo krok na środku ekranu (atrybut data-scene) wybiera
 * scenę, a data-scene-focus wskazuje element ilustracji (szczyt w panoramie, atrakcję na mapie okolicy).
 * Sceny montują się dopiero, gdy są najwyżej o jedną przed aktywną, więc strona nie ładuje wszystkiego naraz.
 */
export function SceneStage({ scenes, t }: { scenes: Scene[]; t: Dictionary['effects'] }) {
  const [active, setActive] = useState(scenes[0]?.id)
  const [focus, setFocus] = useState<string | undefined>()
  const [reach, setReach] = useState(1)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      // Najgłębszy element z data-scene, który przecina środek ekranu (kroki są po swoich rozdziałach).
      const mid = innerHeight / 2
      let el: HTMLElement | undefined
      for (const n of document.querySelectorAll<HTMLElement>('[data-scene]')) {
        const r = n.getBoundingClientRect()
        if (r.top <= mid && r.bottom >= mid) el = n
      }
      const id = el?.dataset.scene
      if (!id || !scenes.some((s) => s.id === id)) return
      setActive(id)
      setFocus(focusAt(mid))
      setReach((r) => Math.max(r, scenes.findIndex((s) => s.id === id) + 1))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [scenes])

  const activeKind = scenes.find((s) => s.id === active)?.kind
  return (
    <div className="mo-stage" aria-hidden="true" data-kind={activeKind}>
      {scenes.map((s, i) => {
        const on = s.id === active
        if (i > reach && !on) return null
        return (
          <div key={s.id} className="mo-stage__scene" data-kind={s.kind} data-active={on || undefined}>
            {s.kind === 'media' && s.slides ? <HeroStage slides={s.slides} t={t} active={on} eager={i === 0} controls={i === 0} /> : null}
            {SVG[s.kind] ? <InlineSvg src={SVG[s.kind]!} focus={on ? focus : undefined} pan={s.kind === 'panorama'} /> : null}
          </div>
        )
      })}
    </div>
  )
}

/** Element z data-scene-focus (karta domku, atrakcja) na środku ekranu. */
function focusAt(mid: number) {
  for (const n of document.querySelectorAll<HTMLElement>('[data-scene-focus]')) {
    const r = n.getBoundingClientRect()
    if (r.top <= mid && r.bottom >= mid) return n.dataset.sceneFocus
  }
  return undefined
}

/** Ilustracja wstawiona do strony (kolory z tokenów); panorama przesuwa się do wskazanego szczytu. */
function InlineSvg({ src, focus, pan }: { src: string; focus?: string; pan?: boolean }) {
  const host = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(src)
      .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
      .then((text) => {
        if (cancelled || !host.current) return
        host.current.innerHTML = text.replace(/<metadata>[\s\S]*?<\/metadata>/, '')
        host.current.querySelector('svg')?.setAttribute('preserveAspectRatio', pan ? 'xMidYMax meet' : 'xMidYMid meet')
        setReady(true)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [src, pan])

  useEffect(() => {
    const el = host.current
    const svg = el?.querySelector('svg')
    if (!ready || !el || !svg) return
    el.querySelectorAll('.is-lit').forEach((n) => n.classList.remove('is-lit'))
    const target = focus ? svg.querySelector<SVGGraphicsElement>(`#${CSS.escape(focus)}`) : null
    target?.classList.add('is-lit')
    if (!pan) return
    // Środek szczytu względem rysunku → przesunięcie warstwy tak, by szczyt stał na środku ekranu.
    const sr = svg.getBoundingClientRect()
    const tr = target?.getBoundingClientRect()
    const x = tr ? tr.left + tr.width / 2 - sr.left : sr.width / 2
    const shift = Math.min(0, Math.max(innerWidth - sr.width, innerWidth / 2 - x))
    el.style.setProperty('--przesun', `${shift}px`)
  }, [focus, ready, pan])

  return <div ref={host} className="mo-stage__svg" data-pan={pan || undefined} />
}
