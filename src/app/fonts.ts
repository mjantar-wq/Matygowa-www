import { Fraunces, Inter, Playfair_Display } from 'next/font/google'
import localFont from 'next/font/local'

// next/font pobiera kroje przy budowaniu i serwuje je z naszej domeny (bez zapytań do Google).
// Stosy --font-display/--font-ui/--font-tabliczka definiuje src/styles/tokens.css na podstawie tych zmiennych.
export const fraunces = Fraunces({ subsets: ['latin', 'latin-ext'], variable: '--font-fraunces', display: 'swap' })
export const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter', display: 'swap' })
// krój tabliczek i podpisów na mapach (Playfair Display zamiast Rufiny: Rufina ma Ł, Ś, Ń większe i cięższe niż reszta liter)
export const playfair = Playfair_Display({ subsets: ['latin', 'latin-ext'], weight: '700', variable: '--font-playfair', display: 'swap' })
// Fraunces ma bardzo krótki ogonek „j” (w nagłówkach wygląda jak „i”, np. „swój”) i załamane u dołu „J” („Jeden widok”),
// więc obie litery bierzemy z Newsreadera (OFL).
// Plik zawiera tylko „J” i „j” (2 KB, osie opsz i wght); bez zastępczego Ariala, żeby reszta liter dalej szła z Fraunces.
export const jotNewsreader = localFont({
  src: './fonts/newsreader-j.woff2',
  variable: '--font-jot',
  weight: '200 800',
  display: 'swap',
  adjustFontFallback: false,
  fallback: [],
  declarations: [{ prop: 'unicode-range', value: 'U+004A, U+006A' }],
})
