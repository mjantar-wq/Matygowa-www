'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Dictionary } from '@/i18n/dictionaries'
import { srcSet } from '@/lib/images'

export type LightboxItem = { url: string; alt?: string | null; width?: number | null; height?: number | null; focusX?: number | null; focusY?: number | null; credit?: string | null }

/**
 * Galeria zdjęć z powiększeniem: klik (albo Enter) otwiera zdjęcie na pełnym ekranie, strzałki, przyciski
 * i przesunięcie palcem przechodzą do następnego i poprzedniego, Esc zamyka. Natywny <dialog> pilnuje fokusu.
 */
export function Lightbox({ items, t }: { items: LightboxItem[]; t: Dictionary['effects'] }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const [index, setIndex] = useState(0)
  const touchX = useRef<number | null>(null)
  const count = items.length

  const go = useCallback((step: number) => setIndex((i) => (i + step + count) % count), [count])
  const open = (i: number) => {
    setIndex(i)
    dialog.current?.showModal()
  }

  useEffect(() => {
    const d = dialog.current
    if (!d) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(document.dir === 'rtl' ? -1 : 1)
      if (e.key === 'ArrowLeft') go(document.dir === 'rtl' ? 1 : -1)
    }
    d.addEventListener('keydown', onKey)
    return () => d.removeEventListener('keydown', onKey)
  }, [go])

  // Sąsiednie zdjęcia ładują się z wyprzedzeniem, więc przewijanie jest natychmiastowe.
  useEffect(() => {
    if (!dialog.current?.open) return
    for (const step of [1, -1]) {
      const next = items[(index + step + count) % count]
      if (next) new Image().src = next.url
    }
  }, [index, items, count])

  const current = items[index]
  return (
    <>
      <ul className="mo-gallery">
        {items.map((m, i) => (
          <li key={m.url + i}>
            <button type="button" className="mo-gallery__thumb" onClick={() => open(i)} aria-label={`${t.enlarge}: ${m.alt || i + 1}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- mniejsze kopie robi Worker (src/edge/media.ts) */}
              <img src={m.url} srcSet={srcSet(m.url, m.width)} sizes="(min-width: 1100px) 300px, (min-width: 600px) 45vw, 100vw" alt={m.alt ?? ''} width={m.width ?? undefined} height={m.height ?? undefined} loading="lazy" decoding="async" style={{ objectPosition: `${m.focusX ?? 50}% ${m.focusY ?? 50}%` }} />
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialog}
        className="mo-lightbox"
        aria-label={t.gallery}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close()
        }}
        onTouchStart={(e) => {
          touchX.current = e.touches[0]?.clientX ?? null
        }}
        onTouchEnd={(e) => {
          const start = touchX.current
          const end = e.changedTouches[0]?.clientX
          touchX.current = null
          if (start == null || end == null || Math.abs(end - start) < 40) return
          go(end < start ? 1 : -1)
        }}
      >
        {current ? (
          <figure className="mo-lightbox__figure">
            {/* Zamknięte okno ma display: none, a „lazy” nie pobiera wtedy zdjęcia. Bez tego React dodawał preload
                pierwszego powiększenia każdej galerii i strona główna ściągała je na starcie (ok. 1,5 MB). */}
            {/* eslint-disable-next-line @next/next/no-img-element -- powiększenie: kopia na szerokość ekranu */}
            <img key={current.url} src={current.url} srcSet={srcSet(current.url, current.width)} sizes="100vw" loading="lazy" alt={current.alt ?? ''} width={current.width ?? undefined} height={current.height ?? undefined} />
            <figcaption className="mo-lightbox__caption">
              {current.alt ? <span>{current.alt}</span> : null}
              {current.credit ? <span className="mo-lightbox__credit">{current.credit}</span> : null}
              <span className="mo-lightbox__count" aria-live="polite">
                {index + 1} / {count}
              </span>
            </figcaption>
          </figure>
        ) : null}
        {count > 1 ? (
          <>
            <button type="button" className="mo-lightbox__nav mo-lightbox__nav--prev" onClick={() => go(-1)} aria-label={t.prev}>
              ‹
            </button>
            <button type="button" className="mo-lightbox__nav mo-lightbox__nav--next" onClick={() => go(1)} aria-label={t.next}>
              ›
            </button>
          </>
        ) : null}
        <button type="button" className="mo-lightbox__close" onClick={() => dialog.current?.close()} aria-label={t.close} autoFocus>
          ×
        </button>
      </dialog>
    </>
  )
}
