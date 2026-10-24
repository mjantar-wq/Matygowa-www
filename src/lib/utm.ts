import { UTM_KEYS } from './booking'

const KEY = 'mo-utm'

/**
 * Parametry kampanii z adresu wejścia na stronę. Gość rzadko rezerwuje na stronie, na którą trafił
 * z reklamy, więc zapamiętujemy je na czas wizyty (sessionStorage) i dokładamy do adresu silnika.
 * Nowe utm_* w adresie zastępują zapamiętane (ostatnie kliknięcie).
 */
export function captureUtm(search: string) {
  const fresh = Object.fromEntries([...new URLSearchParams(search)].filter(([k, v]) => (UTM_KEYS as readonly string[]).includes(k) && v))
  try {
    if (Object.keys(fresh).length) sessionStorage.setItem(KEY, JSON.stringify(fresh))
  } catch {
    // bez dostępu do pamięci sesji zostają utm_* z bieżącego adresu
  }
  return fresh
}

export function currentUtm(): Record<string, string> {
  const fresh = captureUtm(window.location.search)
  if (Object.keys(fresh).length) return fresh
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? '{}') as Record<string, string>
  } catch {
    return {}
  }
}
