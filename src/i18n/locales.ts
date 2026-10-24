/**
 * Języki strony. Polski bez prefiksu w adresie, pozostałe pod /en/, /sk/, /ar/…
 * Dodanie języka: wpis tutaj (enabled: true), słownik w ./dictionaries i segmenty adresów w ./routes.
 * Panel treści (Payload) bierze listę z ENABLED_LOCALES, więc pola tłumaczeń pojawią się same.
 */
export const LOCALES = {
  pl: { label: 'Polski', dir: 'ltr', enabled: true, intl: 'pl-PL' },
  en: { label: 'English', dir: 'ltr', enabled: true, intl: 'en-GB' },
  // etap 2 (koncepcja F3): słowacki i arabski; układ gotowy na RTL od początku
  sk: { label: 'Slovenčina', dir: 'ltr', enabled: false, intl: 'sk-SK' },
  ar: { label: 'العربية', dir: 'rtl', enabled: false, intl: 'ar' },
} as const

export type Locale = keyof typeof LOCALES

export const DEFAULT_LOCALE: Locale = 'pl'

export const ENABLED_LOCALES = (Object.keys(LOCALES) as Locale[]).filter((l) => LOCALES[l].enabled)

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (ENABLED_LOCALES as string[]).includes(value)
}

export const dirOf = (locale: Locale) => LOCALES[locale].dir
