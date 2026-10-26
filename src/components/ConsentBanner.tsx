'use client'

import Link from 'next/link'
import { useEffect, useId, useState, useSyncExternalStore } from 'react'
import type { Dictionary } from '@/i18n/dictionaries'
import { CONSENT_COOKIE, CONSENT_MAX_AGE, CONSENT_VERSION, OPEN_CONSENT_EVENT, consentSignals, parseConsent } from '@/lib/consent'

type Props = { t: Dictionary['consent']; policyHref: string }

/** Domena nadrzędna (np. .matygowaosada.pl), żeby wybór działał też w silniku rezerwacji. */
function cookieDomain() {
  const host = window.location.hostname
  if (host === 'localhost' || /^[\d.]+$/.test(host) || !host.includes('.')) return ''
  return `; domain=.${host.split('.').slice(-2).join('.')}`
}

const dataLayer = () => ((window as Window & { dataLayer?: unknown[] }).dataLayer ??= [])
/** Jak gtag() z Consent Mode: do dataLayer trafia obiekt arguments, nie tablica. */
function gtag(..._args: unknown[]): void {
  dataLayer().push(arguments) // eslint-disable-line prefer-rest-params
}

const SAVED_EVENT = 'mo:zgody-zapisane'
/** Wybór z tej wizyty, gdy przeglądarka nie zapisała ciasteczka (blokada cookies): baner i tak się zamyka. */
let unsaved = ''
const readRaw = () => document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`))?.[1] ?? unsaved
const subscribe = (cb: () => void) => {
  window.addEventListener(SAVED_EVENT, cb)
  return () => window.removeEventListener(SAVED_EVENT, cb)
}

/**
 * Baner zgód (RODO, Consent Mode v2): „Akceptuję” i „Tylko niezbędne” są równorzędne, bez zaznaczonych
 * z góry pól. Ponowne otwarcie: link „Ustawienia cookies” w stopce (zdarzenie OPEN_CONSENT_EVENT).
 */
export function ConsentBanner({ t, policyHref }: Props) {
  // na serwerze null: baner pojawia się dopiero w przeglądarce, po odczycie ciasteczka
  const raw = useSyncExternalStore<string | null>(subscribe, readRaw, () => null)
  const saved = raw === null ? null : parseConsent(raw)
  const [reopened, setReopened] = useState(false)
  const [details, setDetails] = useState(false)
  const [draft, setDraft] = useState<{ analytics: boolean; marketing: boolean } | null>(null)
  const { analytics, marketing } = draft ?? saved ?? { analytics: false, marketing: false }
  const titleId = useId()

  useEffect(() => {
    const reopen = () => {
      setDetails(true)
      setReopened(true)
    }
    window.addEventListener(OPEN_CONSENT_EVENT, reopen)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen)
  }, [])

  function save(choice: { analytics: boolean; marketing: boolean }) {
    const value = encodeURIComponent(JSON.stringify({ v: CONSENT_VERSION, ...choice, ts: new Date().toISOString() }))
    // „secure” tylko przez https: przez http przeglądarka odrzuciłaby całe ciasteczko
    const secure = window.location.protocol === 'https:' ? '; secure' : ''
    document.cookie = `${CONSENT_COOKIE}=${value}; max-age=${CONSENT_MAX_AGE}; path=/; samesite=lax${secure}${cookieDomain()}`
    unsaved = value
    gtag('consent', 'update', consentSignals(choice))
    dataLayer().push({ event: 'consent_update', consent_analytics: choice.analytics, consent_marketing: choice.marketing })
    window.dispatchEvent(new Event(SAVED_EVENT))
    setReopened(false)
    setDetails(false)
    setDraft(null)
  }

  if (raw === null || (saved && !reopened)) return null
  return (
    <section className="mo-consent" role="dialog" aria-labelledby={titleId} aria-live="polite">
      <p className="mo-h3" id={titleId}>{t.title}</p>
      <p>
        {t.body} <Link href={policyHref}>{t.policy}</Link>
      </p>
      {details ? (
        <fieldset className="mo-consent__options">
          <label><input type="checkbox" checked disabled /> <span><strong>{t.necessary}</strong> {t.necessaryNote}</span></label>
          <label><input type="checkbox" checked={analytics} onChange={(e) => setDraft({ analytics: e.target.checked, marketing })} /> <span><strong>{t.analytics}</strong> {t.analyticsNote}</span></label>
          <label><input type="checkbox" checked={marketing} onChange={(e) => setDraft({ analytics, marketing: e.target.checked })} /> <span><strong>{t.marketing}</strong> {t.marketingNote}</span></label>
        </fieldset>
      ) : null}
      <div className="mo-consent__actions">
        <button type="button" className="mo-btn mo-btn--glowny mo-btn--maly" onClick={() => save({ analytics: true, marketing: true })}>{t.acceptAll}</button>
        <button type="button" className="mo-btn mo-btn--glowny mo-btn--maly" onClick={() => save({ analytics: false, marketing: false })}>{t.rejectAll}</button>
        {details ? (
          <button type="button" className="mo-btn mo-btn--glowny mo-btn--maly" onClick={() => save({ analytics, marketing })}>{t.save}</button>
        ) : (
          <button type="button" className="mo-btn mo-btn--glowny mo-btn--maly" onClick={() => setDetails(true)}>{t.settings}</button>
        )}
      </div>
    </section>
  )
}

/** Link w stopce: otwiera baner z ustawieniami. */
export function ConsentSettingsLink({ label }: { label: string }) {
  return (
    <button type="button" className="mo-linklike" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}>
      {label}
    </button>
  )
}
