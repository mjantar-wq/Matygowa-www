'use client'

import { useEffect, useRef, useState } from 'react'
import type { Dictionary } from '@/i18n/dictionaries'
import type { Scene } from '@/lib/scenes'
import { HeroStage } from './HeroStage'

const SVG: Partial<Record<Scene['kind'], string>> = { panorama: '/ilustracje/G2_panorama.svg', map: '/ilustracje/G7_mapa_okolicy.svg' }

/**
 * Przypięta scena pod całą stroną główną. Rozdział albo krok na środku ekranu (atrybut data-scene) wybiera
 * scenę, a data-scene-focus wskazuje element ilustracji (szczyt w panoramie, atrakcję na mapie okolicy).
 * Sceny montują się dopiero, gdy są najwyżej o cztery przed aktywną, więc strona nie ładuje wszystkiego naraz.
 */
export function SceneStage({ scenes, t }: { scenes: Scene[]; t: Dictionary['effects'] }) {
  const [active, setActive] = useState(scenes[0]?.id)
  const [focus, setFocus] = useState<Focus | undefined>()
  const [hover, setHover] = useState<string | undefined>()
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
      // W przerwie między krokami rozdziału zostaje scena ostatniego minionego kroku, a nie scena rozdziału,
      // więc tło przechodzi z kroku w krok bez powrotu do zdjęcia domyślnego.
      if (el?.tagName === 'SECTION') {
        for (const n of el.querySelectorAll<HTMLElement>('[data-scene]')) if (n.getBoundingClientRect().top <= mid) el = n
      }
      const id = el?.dataset.scene
      if (!id || !scenes.some((s) => s.id === id)) return
      setActive(id)
      setFocus(focusAt(el!.closest('section') ?? el!, mid))
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

  // Zdjęcia w treści opowieści ładują się z dużym wyprzedzeniem (2,5 ekranu), a nie dopiero tuż przed wejściem
  // na ekran jak przy loading="lazy", żeby przy przewijaniu kart domków były już gotowe.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          ;(e.target as HTMLImageElement).loading = 'eager'
          io.unobserve(e.target)
        }
      },
      { rootMargin: '250% 0px' },
    )
    document.querySelectorAll('.mo-opowiesc img[loading="lazy"]').forEach((img) => io.observe(img))
    return () => io.disconnect()
  }, [])

  // Najechanie albo fokus na karcie z data-scene-focus (atrakcja, domek) wskazuje element ilustracji od razu.
  useEffect(() => {
    const on = (e: Event) => setHover((e.target as Element).closest<HTMLElement>('[data-scene-focus]')?.dataset.sceneFocus)
    for (const type of ['pointerover', 'focusin']) document.addEventListener(type, on)
    return () => {
      for (const type of ['pointerover', 'focusin']) document.removeEventListener(type, on)
    }
  }, [])
  const shown: Focus | undefined = hover ? { a: hover, b: hover, t: 0 } : focus

  const activeKind = scenes.find((s) => s.id === active)?.kind
  // Kolor i cień tekstów opowieści zależą od tła: zdjęcie albo ilustracja (effects.css, data-tlo).
  useEffect(() => {
    const story = document.querySelector<HTMLElement>('.mo-opowiesc')
    if (story && activeKind) story.dataset.tlo = activeKind
  }, [activeKind])
  return (
    <div className="mo-stage" aria-hidden="true" data-kind={activeKind}>
      {scenes.map((s, i) => {
        const on = s.id === active
        if (i > reach + 3 && !on) return null
        return (
          <div key={s.id} className="mo-stage__scene" data-kind={s.kind} data-active={on || undefined}>
            {s.kind === 'media' && s.slides ? <HeroStage slides={s.slides} t={t} active={on} eager={i === 0} controls={i === 0} /> : null}
            {SVG[s.kind] ? <InlineSvg src={SVG[s.kind]!} focus={on ? shown : undefined} pan={s.kind === 'panorama'} /> : null}
          </div>
        )
      })}
    </div>
  )
}

/** Dwa sąsiednie elementy ilustracji (szczyty, atrakcje) i postęp przewijania między ich kartami (0–1). */
type Focus = { a: string; b: string; t: number }

/**
 * Karty z data-scene-focus w rozdziale na środku ekranu → między którymi kartami jest środek ekranu.
 * Panorama przesuwa się płynnie od szczytu do szczytu, zamiast wracać do środka w przerwie między kartami.
 */
function focusAt(section: Element, mid: number): Focus | undefined {
  const cards = [...section.querySelectorAll<HTMLElement>('[data-scene-focus]')].map((n) => {
    const r = n.getBoundingClientRect()
    return { id: n.dataset.sceneFocus!, y: r.top + r.height / 2 }
  })
  if (!cards.length) return undefined
  const next = cards.findIndex((c) => c.y > mid)
  if (next === 0) return { a: cards[0].id, b: cards[0].id, t: 0 }
  if (next === -1) return { a: cards.at(-1)!.id, b: cards.at(-1)!.id, t: 0 }
  const [a, b] = [cards[next - 1], cards[next]]
  return { a: a.id, b: b.id, t: (mid - a.y) / (b.y - a.y) }
}

/** Ilustracja wstawiona do strony (kolory z tokenów); panorama przesuwa się do wskazanego szczytu. */
function InlineSvg({ src, focus, pan }: { src: string; focus?: Focus; pan?: boolean }) {
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
    const find = (id?: string) => (id ? svg.querySelector<SVGGraphicsElement>(`#${CSS.escape(id)}`) : null)
    const lit = find(focus && (focus.t < 0.5 ? focus.a : focus.b))
    if (!lit?.classList.contains('is-lit')) {
      el.querySelectorAll('.is-lit').forEach((n) => n.classList.remove('is-lit'))
      lit?.classList.add('is-lit')
      el.classList.toggle('has-lit', !!lit)
    }
    if (!pan) return
    // Środki obu szczytów względem rysunku, przesunięcie pośrodku wg postępu → szczyt na środku ekranu.
    const sr = svg.getBoundingClientRect()
    const cx = (n: SVGGraphicsElement | null) => {
      const r = n?.getBoundingClientRect()
      return r ? r.left + r.width / 2 - sr.left : sr.width / 2
    }
    const [xa, xb] = [cx(find(focus?.a)), cx(find(focus?.b))]
    const x = xa + (xb - xa) * (focus?.t ?? 0)
    // Szczyt staje na środku wolnej części ekranu, obok kart domków, żeby karta nie zasłaniała swojego szczytu.
    // Przy skrajnych szczytach panorama może odsunąć się od lewej krawędzi (pod kartami).
    const cards = document.querySelector('.mo-peak-cards > [data-step]')?.getBoundingClientRect()
    const anchor = cards && cards.right < innerWidth * 0.7 ? (cards.right + innerWidth) / 2 : innerWidth / 2
    const shift = Math.min(Math.max(0, anchor - innerWidth / 2), Math.max(innerWidth - sr.width, anchor - x))
    el.style.setProperty('--przesun', `${shift}px`)
  }, [focus, ready, pan])

  return <div ref={host} className="mo-stage__svg" data-pan={pan || undefined} />
}
