import { Fraunces, Inter, Rufina } from 'next/font/google'

// next/font pobiera kroje przy budowaniu i serwuje je z naszej domeny (bez zapytań do Google).
// Stosy --font-display/--font-ui/--font-tabliczka definiuje src/styles/tokens.css na podstawie tych zmiennych.
export const fraunces = Fraunces({ subsets: ['latin', 'latin-ext'], variable: '--font-fraunces', display: 'swap' })
export const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter', display: 'swap' })
// krój z tabliczek przy drzwiach domów, tylko do nazw domów
export const rufina = Rufina({ subsets: ['latin', 'latin-ext'], weight: '700', variable: '--font-rufina', display: 'swap' })
