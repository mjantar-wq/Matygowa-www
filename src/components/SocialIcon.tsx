/** Serwis z adresu profilu, dla którego mamy logo. */
export function socialKind(url: string): 'facebook' | 'instagram' | null {
  let host = ''
  try {
    host = new URL(url).hostname
  } catch {
    return null
  }
  return /(^|\.)facebook\.com$/.test(host)
    ? 'facebook'
    : /(^|\.)instagram\.com$/.test(host)
      ? 'instagram'
      : null
}

/** Jednobarwne logo serwisu społecznościowego w kolorze tekstu (currentColor). */
export function SocialIcon({ kind }: { kind: 'facebook' | 'instagram' }) {
  if (kind === 'facebook')
    return (
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="12" r="11" fill="currentColor" />
        <path
          d="M13.4 23v-8.2h2.7l.4-3.2h-3.1V9.6c0-.9.3-1.5 1.6-1.5h1.7V5.2a22 22 0 0 0-2.4-.1c-2.4 0-4 1.4-4 4.1v2.4H7.6v3.2h2.7V23z"
          fill="var(--color-tlo-2)"
        />
      </svg>
    )
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.3" />
      <circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  )
}
