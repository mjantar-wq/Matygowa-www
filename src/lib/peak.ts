import type { Locale } from '@/i18n/locales'
import type { Unit } from '@/payload-types'

export type PeakCase = 'nom' | 'gen' | 'acc' | 'loc' | 'inst'

/**
 * Nazwa szczytu w przypadku potrzebnym w zdaniu („z widokiem na Świnicę”). Odmiana jest z panelu
 * (zakładka Szczyt); bez niej i po angielsku zostaje mianownik.
 */
export function peakName(unit: Unit, c: PeakCase, locale: Locale): string {
  const nom = unit.peak?.name ?? ''
  if (c === 'nom' || locale !== 'pl') return nom
  return unit.peak?.nameCases?.[c] || nom
}

/** Opis zdjęcia głównego, gdy w bibliotece nie ma własnego. */
export function peakViewAlt(unit: Unit, locale: Locale): string {
  const acc = peakName(unit, 'acc', locale)
  if (!acc) return unit.name
  return locale === 'pl' ? `${unit.name}: widok na ${acc}` : `${unit.name}: view of ${acc}`
}
