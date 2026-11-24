import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'
import { touchPages } from '../lib/touch-pages'

/**
 * Polityka prywatności (24.11.2026, Michał): strona działa już na IceColdRes, więc znika wzmianka „do czasu jego uruchomienia Hotres”
 * (§ 3, system rezerwacji). Żywe dane z panelu: podmieniamy tylko dotychczasowy, dokładny fragment, więc polityka
 * edytowana w panelu zostaje. Dotyczy treści opublikowanej i wersji.
 */
const BODY: [from: string, to: string][] = [
  ['oraz Beds24, a do czasu jego uruchomienia Hotres,', 'oraz Beds24,'],
  ['and Beds24, and Hotres until IceColdRes launches,', 'and Beds24,'],
]
const q = (v: string) => `'${v.replace(/'/g, "''")}'`

async function swap(db: MigrateUpArgs['db'], body: typeof BODY) {
  for (const [from, to] of body) {
    await db.run(sql.raw(`UPDATE \`pages_blocks_rich_text_locales\` SET \`body\` = replace(\`body\`, ${q(from)}, ${q(to)}) WHERE instr(\`body\`, ${q(from)}) > 0`))
    await db.run(sql.raw(`UPDATE \`_pages_v_blocks_rich_text_locales\` SET \`body\` = replace(\`body\`, ${q(from)}, ${q(to)}) WHERE instr(\`body\`, ${q(from)}) > 0`))
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await swap(db, BODY)
  await touchPages(db)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await swap(db, BODY.map(([f, t]) => [t, f]))
  await touchPages(db)
}
