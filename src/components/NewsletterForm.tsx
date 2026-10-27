'use client'

import { useEffect, useRef, useState } from 'react'
import type { Dictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/i18n/locales'
import { campaignParams } from '@/lib/tracking'

type State = 'idle' | 'sending' | 'sent' | 'error' | 'limit'

/**
 * Zapis na newsletter w stopce (koncepcja F4): osobna, dobrowolna zgoda z tekstem z IceColdRes, potem e-mail z potwierdzeniem.
 * Wysyłka idzie przez /api/newsletter (serwer strony podpisuje zapytanie do IceColdRes).
 */
export function NewsletterForm({ locale, t, consent }: { locale: Locale; t: Dictionary['newsletter']; consent: { id: string; text: string; privacyUrl: string } }) {
  const [state, setState] = useState<State>('idle')
  // w stopce najpierw sam przycisk, formularz po kliknięciu (Michał, 26.10.2026)
  const [open, setOpen] = useState(false)
  const done = useRef<HTMLParagraphElement>(null)
  const email = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (open) email.current?.focus()
  }, [open])
  // przycisk znika razem z formularzem: fokus przechodzi na potwierdzenie, żeby nie spadł na początek strony
  useEffect(() => {
    if (state === 'sent') done.current?.focus()
  }, [state])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    // UTM z pierwszej strony wizyty (jak w linkach rezerwacji), nie tylko z bieżącego adresu
    const utm = campaignParams()
    setState('sending')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.get('email'), lang: locale, consentId: consent.id, utm, nl_hp: form.get('nl_hp') }),
      })
      setState(res.status === 202 ? 'sent' : res.status === 429 ? 'limit' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'sent') return <p role="status" ref={done} tabIndex={-1}>{t.sent}</p>

  if (!open)
    return (
      <button type="button" className="mo-btn mo-btn--glowny mo-btn--maly" onClick={() => setOpen(true)} style={{ justifySelf: 'start' }}>
        {t.open}
      </button>
    )

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 'var(--space-3)' }}>
      <p>{t.lead}</p>
      <label htmlFor="nl-email">{t.email}</label>
      <input ref={email} id="nl-email" name="email" type="email" required autoComplete="email" inputMode="email" maxLength={254}
        style={{ font: 'inherit', color: 'var(--color-atrament)', background: 'var(--color-tlo)', border: '1px solid var(--color-linia-mocna)', padding: 'var(--space-3)', minBlockSize: 44 }} />
      {/* pułapka na boty: niewidoczna dla ludzi i czytników ekranu */}
      <input name="nl_hp" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', insetInlineStart: '-10000px', inlineSize: 1, blockSize: 1 }} />
      <label style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
        <input type="checkbox" name="consent" required style={{ marginBlockStart: '0.25em', inlineSize: 18, blockSize: 18, flex: 'none' }} />
        <span>
          {consent.text} <a href={consent.privacyUrl}>{t.privacy}</a>
        </span>
      </label>
      <button type="submit" className="mo-btn mo-btn--glowny mo-btn--maly" disabled={state === 'sending'} style={{ justifySelf: 'start' }}>
        {state === 'sending' ? t.sending : t.submit}
      </button>
      {state === 'error' || state === 'limit' ? <p role="alert">{state === 'limit' ? t.limit : t.error}</p> : null}
    </form>
  )
}
