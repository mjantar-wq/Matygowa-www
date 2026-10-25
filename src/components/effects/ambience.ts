'use client'

import { useSyncExternalStore } from 'react'
import { AMBIENCE_KEYS as KEYS } from '@/lib/ambience'

/** Nastrój strony: pora dnia i pora roku jako atrybuty <html>, na które reagują tokeny kolorów i efekty. */
export type Pora = 'dzien' | 'noc'
export type Sezon = 'zima' | 'lato'
export type Ambience = { pora: Pora; sezon: Sezon }

function read(): Ambience {
  const d = document.documentElement.dataset
  return { pora: d.pora === 'noc' ? 'noc' : 'dzien', sezon: d.sezon === 'lato' ? 'lato' : 'zima' }
}

let snapshot: Ambience | null = null
function getSnapshot() {
  const next = read()
  if (!snapshot || snapshot.pora !== next.pora || snapshot.sezon !== next.sezon) snapshot = next
  return snapshot
}
const SERVER: Ambience = { pora: 'dzien', sezon: 'zima' }

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-pora', 'data-sezon'] })
  return () => mo.disconnect()
}

export function useAmbience() {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER)
}

/** Zmiana nastroju: płynne przejście kolorów (klasa mo-przejscie z tokenów) albo View Transition, jeśli jest. */
export function setAmbience(next: Partial<Ambience>) {
  const root = document.documentElement
  const apply = () => {
    if (next.pora) root.dataset.pora = next.pora
    if (next.sezon) root.dataset.sezon = next.sezon
  }
  try {
    if (next.pora) sessionStorage.setItem(KEYS.pora, next.pora)
    if (next.sezon) sessionStorage.setItem(KEYS.sezon, next.sezon)
  } catch {}
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown }
  if (!calm && doc.startViewTransition) {
    doc.startViewTransition(apply)
    return
  }
  root.classList.add('mo-przejscie')
  apply()
  window.setTimeout(() => root.classList.remove('mo-przejscie'), 1600)
}

/** Pauza ruchu tła (przycisk w hero): data-ruch="stop" na <html>; CSS zatrzymuje dryf kadru, HeroStage film. */
function subscribeMotion(cb: () => void) {
  const mo = new MutationObserver(cb)
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-ruch'] })
  return () => mo.disconnect()
}
export function useMotionPaused() {
  return useSyncExternalStore(subscribeMotion, () => document.documentElement.dataset.ruch === 'stop', () => false)
}
export function setMotionPaused(paused: boolean) {
  if (paused) document.documentElement.dataset.ruch = 'stop'
  else delete document.documentElement.dataset.ruch
}

/** Czy wolno odtwarzać ruch: bez prefers-reduced-motion i bez trybu oszczędzania danych. */
export function motionAllowed() {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
  return !matchMedia('(prefers-reduced-motion: reduce)').matches && !conn?.saveData
}
