import type { Setting } from '@/payload-types'

/**
 * Trasa do osady: „Link do mapy” z Ustawień (pinezka ustawiona przez redaktora), a bez niego trasa
 * w Mapach Google do adresu. Bez osadzania mapy: żadnych cookies ani skryptów z zewnątrz przed zgodą.
 */
export function directionsUrl(settings?: Pick<Setting, 'mapUrl' | 'address'> | null) {
  if (settings?.mapUrl) return settings.mapUrl
  if (!settings?.address) return null
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(settings.address.replace(/\s*\n\s*/g, ', '))}`
}
