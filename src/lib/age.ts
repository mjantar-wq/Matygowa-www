import type { Locale } from '@/i18n/locales'

/** Wiek dziecka z poprawną odmianą: PL 0 → „poniżej roku”, 1 → „1 rok”, 2-4 → „lata”, reszta „lat”; EN „year/years”. */
export function ageLabel(n: number, locale: Locale): string {
  if (locale !== 'pl') return n === 0 ? 'under 1 year' : n === 1 ? '1 year' : `${n} years`
  if (n === 0) return 'poniżej roku'
  if (n === 1) return '1 rok'
  return n % 10 >= 2 && n % 10 <= 4 && (n < 12 || n > 14) ? `${n} lata` : `${n} lat`
}
