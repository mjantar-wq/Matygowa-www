type Node = { text?: unknown; children?: unknown }

const plain = (node: unknown): string => {
  const n = node as Node
  if (typeof n?.text === 'string') return n.text
  return Array.isArray(n?.children) ? n.children.map(plain).join(' ') : ''
}
const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase()

/**
 * Zajawka aktualności jest kopią pierwszego akapitu treści (import ustawia ją jako pierwszą linię tekstu), więc wyświetlona
 * nad treścią powtarzała ten sam tekst dwa razy (audyt 12.11.2026). Zwraca true, gdy treść zaczyna się od tej zajawki.
 */
export function excerptRepeatsBody(excerpt: string | null | undefined, content: unknown): boolean {
  const lead = norm(excerpt ?? '')
  if (!lead) return false
  return norm(plain((content as { root?: unknown } | null | undefined)?.root)).startsWith(lead)
}
