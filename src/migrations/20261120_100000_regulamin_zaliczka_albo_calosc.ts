import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'
import { touchPages } from '../lib/touch-pages'

/**
 * Regulamin (20.11.2026, Michał): przy płatności online Najemca wybiera zaliczkę 30% albo całą Cenę Najmu od razu (§ 2 ust. 4).
 * Żywe dane z panelu: dopisujemy zdanie tylko po dotychczasowym, dokładnym zdaniu o zaliczce online,
 * więc regulamin poprawiony ręcznie w panelu zostaje. Dotyczy treści opublikowanej i wersji.
 */
const TEXTS: [from: string, to: string][] = [
  [
    'Zaliczkę płaci się online przy składaniu rezerwacji.',
    'Zaliczkę płaci się online przy składaniu rezerwacji. Najemca może też od razu zapłacić całą Cenę Najmu.',
  ],
  [
    'The deposit is paid online when the booking is made.',
    'The deposit is paid online when the booking is made. The Tenant may also pay the whole Rental Price immediately.',
  ],
]
const q = (v: string) => `'${v.replace(/'/g, "''")}'`

async function swap(db: MigrateUpArgs['db'], pairs: [from: string, to: string][]) {
  for (const [from, to] of pairs) {
    await db.run(sql.raw(`UPDATE \`pages_blocks_rich_text_locales\` SET \`body\` = replace(\`body\`, ${q(from)}, ${q(to)}) WHERE instr(\`body\`, ${q(from)}) > 0`))
    // wersje w panelu: inaczej formularz pokazałby stary tekst i zapis by go przywrócił
    await db.run(sql.raw(`UPDATE \`_pages_v_blocks_rich_text_locales\` SET \`body\` = replace(\`body\`, ${q(from)}, ${q(to)}) WHERE instr(\`body\`, ${q(from)}) > 0`))
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await swap(db, TEXTS)
  await touchPages(db)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await swap(db, TEXTS.map(([from, to]) => [to, from]))
  await touchPages(db)
}
