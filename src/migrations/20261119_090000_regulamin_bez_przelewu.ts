import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'
import { touchPages } from '../lib/touch-pages'

/**
 * Regulamin bez przelewu tradycyjnego (19.11.2026, Michał: zostają tylko płatności online): usuwamy § 2 ust. 6 z numerem rachunku
 * bankowego, kolejne ustępy przesuwają się o jeden (żaden przepis nie odwołuje się do dawnych ust. 7 i 8 z § 2).
 * Żywe dane z panelu: podmieniamy tylko dotychczasowe, dokładne fragmenty, więc regulamin poprawiony ręcznie w panelu zostaje.
 * Dotyczy treści opublikowanej i wersji.
 */
const TEXTS: [from: string, to: string][] = [
  ['6. Numer rachunku bankowego w PKO Bank Polski do wpłat na opłatę rezerwacyjną i Ceny Najmu: 27 1020 1332 0000 1202 1640 6870.\n7. Najemca nie ma', '6. Najemca nie ma'],
  ['\n8. Prośbę o przedłużenie', '\n7. Prośbę o przedłużenie'],
  ['6. Bank account at PKO Bank Polski for the booking fee and the Rental Price: 27 1020 1332 0000 1202 1640 6870 (IBAN PL27 1020 1332 0000 1202 1640 6870).\n7. Under Article 38(12)', '6. Under Article 38(12)'],
  ['\n8. Requests for an extended stay', '\n7. Requests for an extended stay'],
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
