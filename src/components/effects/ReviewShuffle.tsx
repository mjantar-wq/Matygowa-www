'use client'

import { useEffect, useRef } from 'react'

/**
 * Losuje opinie przy każdym wejściu: z listy tuż przed tym znacznikiem pokazuje `count` opinii, po równo
 * z każdego źródła (Google i Booking pół na pół, braki dopełnia reszta), na przemian. Serwer wysyła wszystkie,
 * a pierwsze `count` są widoczne, więc bez JS strona też ma komplet.
 */
export function ReviewShuffle({ count = 10 }: { count?: number }) {
  const mark = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const list = mark.current?.previousElementSibling as HTMLElement | null | undefined
    if (!list) return
    const items = [...list.children] as HTMLElement[]
    const shuffle = <T,>(a: T[]) => {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
      }
      return a
    }
    const groups = new Map<string, HTMLElement[]>()
    for (const li of shuffle(items)) groups.set(li.dataset.source ?? 'other', [...(groups.get(li.dataset.source ?? 'other') ?? []), li])
    const picked: HTMLElement[] = []
    for (let i = 0; picked.length < Math.min(count, items.length); i++) for (const g of groups.values()) if (g[i] && picked.length < count) picked.push(g[i])
    for (const li of items) li.hidden = !picked.includes(li)
    for (const li of picked) list.appendChild(li)
  }, [count])
  return <span ref={mark} hidden />
}
