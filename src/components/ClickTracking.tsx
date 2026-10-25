'use client'

import { useEffect } from 'react'
import { campaignParams, track, withCampaign } from '@/lib/tracking'

/**
 * Jedno nasłuchiwanie kliknięć dla całej strony: link do silnika rezerwacji dostaje UTM z sesji
 * i zdarzenie booking_click, telefon, e-mail i WhatsApp zdarzenie contact_click.
 * Linker GA4 (cross-domain) dokleja potem _gl do tego samego linku.
 */
export function ClickTracking({ engineHosts }: { engineHosts: string[] }): null {
  useEffect(() => {
    campaignParams() // zapamiętaj UTM z wejścia, zanim gość przejdzie na inną podstronę
    function onClick(e: MouseEvent): void {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a) return
      const href = a.getAttribute('href') ?? ''
      if (href.startsWith('tel:')) return track('contact_click', { contact_method: 'phone' })
      if (href.startsWith('mailto:')) return track('contact_click', { contact_method: 'email' })
      let url: URL
      try {
        url = new URL(a.href)
      } catch {
        return
      }
      if (url.hostname === 'wa.me' || url.hostname.endsWith('whatsapp.com')) return track('contact_click', { contact_method: 'whatsapp' })
      if (engineHosts.includes(url.hostname)) {
        a.href = withCampaign(a.href, campaignParams())
        track('booking_click', { booking_location: a.dataset.track ?? 'link', unit: url.searchParams.get('unit') ?? undefined })
      }
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [engineHosts])
  return null
}
