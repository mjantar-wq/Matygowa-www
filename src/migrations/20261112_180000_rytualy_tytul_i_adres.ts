import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'
import { touchPages } from '../lib/touch-pages'

/**
 * Strona Rytuały (12.11.2026, Michał): adres /rytualy (EN /en/rituals) i tytuł na belce przeglądarki bez „sauna i bania”.
 * Żywe dane z panelu: zmieniamy tylko dotychczasowe, dokładne wartości (tytuł strony, tytuł i opis SEO), więc tekst
 * poprawiony w panelu zostaje. Stare adresy przekierowuje next.config (301). Dotyczy treści opublikowanej i wersji.
 */
const TEXTS: [locale: string, column: 'title' | 'seo_title' | 'seo_description', from: string, to: string][] = [
  ['pl', 'title', 'Sauna i bania', 'Rytuały'],
  ['en', 'title', 'Sauna & hot tub', 'Rituals'],
  ['pl', 'seo_title', 'Sauna i bania pod Tatrami: domowe spa | Matygowa Osada', 'Rytuały pod Tatrami: wieczór w osadzie | Matygowa Osada'],
  ['en', 'seo_title', 'Private sauna and hot tub with Tatra views | Matygowa Osada', 'Rituals under the Tatras: an evening in the settlement | Matygowa Osada'],
  ['pl', 'seo_description', 'Prywatna sauna w każdym domku i bania, czyli balia z jacuzzi, na tarasie z widokiem na Tatry. Domowe spa w górach po nartach i szlaku. Zasady i ceny.', 'Jak kończy się dzień w osadzie: ciepło, mróz, para i cisza. Rytuały gór, góralska tradycja i wieczór pod tatrzańskim niebem.'],
  ['en', 'seo_description', 'A private sauna in every house and a hot tub with jacuzzi on the terrace facing the Tatras. Your own mountain spa after skiing or hiking. Rules and prices.', 'How a day ends in the settlement: warmth, frost, steam and silence. Mountain rituals, highland tradition and an evening under the Tatra sky.'],
]
const q = (v: string) => `'${v.replace(/'/g, "''")}'`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const [locale, col, from, to] of TEXTS) {
    await db.run(sql.raw(`UPDATE \`pages_locales\` SET \`${col}\` = ${q(to)} WHERE _locale = ${q(locale)} AND \`${col}\` = ${q(from)} AND _parent_id IN (SELECT id FROM \`pages\` WHERE slug = 'rituals')`))
    await db.run(sql.raw(`UPDATE \`_pages_v_locales\` SET \`version_${col}\` = ${q(to)} WHERE _locale = ${q(locale)} AND \`version_${col}\` = ${q(from)} AND _parent_id IN (SELECT id FROM \`_pages_v\` WHERE version_slug = 'rituals')`))
  }
  await touchPages(db)
}

export async function down({ db: _db }: MigrateDownArgs): Promise<void> {}
