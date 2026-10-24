import { consentBootScript, gtmScript } from '@/lib/consent'

/**
 * Consent Mode v2 i Google Tag Manager. Identyfikator kontenera z panelu (Ustawienia → Pomiar i zgody);
 * bez niego strona nie ładuje żadnego skryptu pomiarowego. GA4 i piksel Meta są tagami w GTM.
 */
export function Analytics({ gtmId }: { gtmId?: string | null }) {
  const id = gtmId?.trim().toUpperCase()
  if (!id || !/^GTM-[A-Z0-9]+$/.test(id)) return null
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: consentBootScript() }} />
      <script dangerouslySetInnerHTML={{ __html: gtmScript(id) }} />
    </>
  )
}
