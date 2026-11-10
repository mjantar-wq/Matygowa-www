/** Serwis z adresu profilu (albo z podpisu w Ustawieniach), dla którego mamy logo. */
export function socialKind(url: string, label = ''): 'facebook' | 'instagram' | null {
  let host = ''
  try {
    host = new URL(url).hostname.replace(/^www\.|^m\./, '')
  } catch {
    // zły adres: zostaje podpis
  }
  if (/^(facebook\.com|fb\.com|fb\.me)$/.test(host) || /^facebook$/i.test(label)) return 'facebook'
  if (/^(instagram\.com|instagr\.am)$/.test(host) || /^instagram$/i.test(label)) return 'instagram'
  return null
}

/** Jednobarwne logo (currentColor), żeby pasowało do tekstu i przycisków w każdej porze dnia i w trybie wysokiego kontrastu. */
export function SocialIcon({ kind, size = 24 }: { kind: 'facebook' | 'instagram'; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" focusable="false">
      {kind === 'facebook' ? (
        <path transform="translate(12 12) scale(0.9) translate(-12 -14)" d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v9h4v-9h3l.5-4h-3.5V8.8c0-.5.3-.8.5-.8Z" />
      ) : (
        <>
          <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="17.4" cy="6.6" r="1.3" />
        </>
      )}
    </svg>
  )
}
