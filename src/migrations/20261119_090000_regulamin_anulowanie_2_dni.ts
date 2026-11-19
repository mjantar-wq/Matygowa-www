import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'
import { touchPages } from '../lib/touch-pages'

/**
 * Regulamin (19.11.2026, Michał): prawo anulowania rezerwacji po braku dopłaty od drugiego dnia po terminie zamiast po 3 dniach (§ 2 ust. 4),
 * a data „Obowiązuje od” to 19.11.2026. Żywe dane z panelu: podmieniamy tylko dotychczasowe, dokładne fragmenty,
 * więc regulamin poprawiony ręcznie w panelu zostaje. Dotyczy treści opublikowanej i wersji.
 */
const BODY: [from: string, to: string][] = [
  [
    'Wynajmujący ma prawo anulować rezerwację po upływie co najmniej 3 dni od tego terminu',
    'Wynajmujący ma prawo anulować rezerwację od drugiego dnia po tym terminie',
  ],
  [
    'the Landlord may cancel the booking once at least 3 days have passed after that deadline',
    'the Landlord may cancel the booking from the second day after that deadline',
  ],
]
const INTRO: [locale: string, from: string, to: string][] = [
  ['pl', 'Obowiązuje od: 18.11.2026 r.', 'Obowiązuje od: 19.11.2026 r.'],
  ['en', 'Effective from: 18 November 2026.', 'Effective from: 19 November 2026.'],
]
const q = (v: string) => `'${v.replace(/'/g, "''")}'`

async function swap(db: MigrateUpArgs['db'], body: typeof BODY, intro: typeof INTRO) {
  for (const [from, to] of body) {
    await db.run(sql.raw(`UPDATE \`pages_blocks_rich_text_locales\` SET \`body\` = replace(\`body\`, ${q(from)}, ${q(to)}) WHERE instr(\`body\`, ${q(from)}) > 0`))
    await db.run(sql.raw(`UPDATE \`_pages_v_blocks_rich_text_locales\` SET \`body\` = replace(\`body\`, ${q(from)}, ${q(to)}) WHERE instr(\`body\`, ${q(from)}) > 0`))
  }
  for (const [locale, from, to] of intro) {
    await db.run(sql.raw(`UPDATE \`pages_locales\` SET \`intro\` = ${q(to)} WHERE _locale = ${q(locale)} AND \`intro\` = ${q(from)} AND _parent_id IN (SELECT id FROM \`pages\` WHERE slug = 'regulamin')`))
    await db.run(sql.raw(`UPDATE \`_pages_v_locales\` SET \`version_intro\` = ${q(to)} WHERE _locale = ${q(locale)} AND \`version_intro\` = ${q(from)} AND _parent_id IN (SELECT id FROM \`_pages_v\` WHERE version_slug = 'regulamin')`))
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await swap(db, BODY, INTRO)
  await touchPages(db)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await swap(db, BODY.map(([f, t]) => [t, f]), INTRO.map(([l, f, t]) => [l, t, f]))
  await touchPages(db)
}
