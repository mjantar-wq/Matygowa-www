import 'server-only'
import { cache } from 'react'
import type { Locale } from '@/i18n/locales'
import { getProperty } from './icecoldres'

/**
 * Znaczniki w tekstach z panelu, które strona podmienia danymi z IceColdRes przy wyświetlaniu
 * (warunki z Ustawień → Zaliczki i godziny obiektu zmieniają się w IceColdRes, nie w treściach):
 * {checkin}, {checkout}, {deposit}, {balance}, {freeCancellation}, {terms}.
 * Warunki pochodzą z oferty standardowej strony (albo pierwszej, gdy jej nie ma).
 */
export const TERM_KEYS = ['checkin', 'checkout', 'deposit', 'balance', 'freeCancellation', 'terms'] as const
export type TermVars = Partial<Record<(typeof TERM_KEYS)[number], string>>

interface OfferTerms {
  depositBp: number
  balanceDueDaysBeforeArrival: number | null
  freeCancellationDays: number | null
  text?: { pl?: string; en?: string }
}
type WithTerms = {
  property?: { checkInTime?: string | null; checkOutTime?: string | null }
  offers?: { id: string; terms?: OfferTerms }[]
}

/** Język bieżącego żądania (ustawia go pageContext), żeby RichText nie potrzebował propsa. */
export const requestLocale = cache((): { locale: Locale } => ({ locale: 'pl' }))

export const termVars = cache(async (locale: Locale): Promise<TermVars> => {
  const data = (await getProperty()) as WithTerms | null
  const offer = data?.offers?.find((o) => o.id === 'standard' && o.terms) ?? data?.offers?.find((o) => o.terms)
  const t = offer?.terms
  const vars: TermVars = {
    // domyślne godziny do czasu, gdy IceColdRes je poda
    checkin: data?.property?.checkInTime || '16:00',
    checkout: data?.property?.checkOutTime || '11:00',
  }
  if (t) {
    vars.deposit = `${t.depositBp / 100}%`.replace('.', locale === 'pl' ? ',' : '.')
    if (t.balanceDueDaysBeforeArrival !== null) vars.balance = String(t.balanceDueDaysBeforeArrival)
    if (t.freeCancellationDays !== null) vars.freeCancellation = String(t.freeCancellationDays)
    const text = locale === 'pl' ? t.text?.pl : t.text?.en || t.text?.pl
    if (text) vars.terms = text
  }
  return vars
})

const MARK = new RegExp(`\\{(${TERM_KEYS.join('|')})\\}`, 'g')

// zdanie (do kropki, wykrzyknika, pytajnika albo końca wiersza) z pozostałym znacznikiem
const UNFILLED_SENTENCE = new RegExp(`[^.!?\\n\\s][^.!?\\n]*\\{(?:${TERM_KEYS.join('|')})\\}[^.!?\\n]*[.!?]?[ \\t]*`, 'g')

/**
 * Podmienia znane znaczniki. Zdanie ze znacznikiem bez wartości znika z publicznej strony
 * (np. IceColdRes nie podaje dni bezpłatnej rezygnacji, gdy oferta jej nie ma); w panelu tekst zostaje bez zmian.
 */
export function fillText(text: string, vars: TermVars) {
  const filled = text.replace(MARK, (m, key: keyof TermVars) => vars[key] ?? m)
  return hasMarks(filled) ? filled.replace(UNFILLED_SENTENCE, '').trimEnd() : filled
}

export const hasMarks = (text: string) => new RegExp(MARK.source).test(text)

/** To samo w drzewie Lexical (węzły tekstowe), bez zmiany oryginału. */
export function fillTree<T>(node: T, vars: TermVars): T {
  if (Array.isArray(node)) return node.map((n) => fillTree(n, vars)) as T
  if (!node || typeof node !== 'object') return node
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(node)) out[k] = k === 'text' && typeof v === 'string' ? fillText(v, vars) : fillTree(v, vars)
  return out as T
}

/** Dla zwykłych pól tekstowych z panelu: `await withTerms(unit.tagline, locale)`. */
export async function withTerms(text: string | null | undefined, locale: Locale) {
  if (!text || !hasMarks(text)) return text ?? ''
  return fillText(text, await termVars(locale))
}
