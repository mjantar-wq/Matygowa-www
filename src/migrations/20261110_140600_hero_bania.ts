import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'
import { touchPages } from '../lib/touch-pages'

/**
 * Podtytuł hero na stronie głównej: „balia z jacuzzi” → „bania” (PL).
 * Zmieniamy tylko w polskim podtytule i tylko tam, gdzie nadal stoi dokładnie stare sformułowanie
 * (tekst zmieniony w panelu zostaje bez zmian). Dotyczy treści opublikowanej i najnowszej wersji.
 */
const OLD = 'Własna sauna, balia z jacuzzi i cała panorama Tatr.'
// instr zamiast LIKE: D1 odrzuca wzorce LIKE dłuższe niż 50 bajtów (polskie znaki to po 2)
const NEW = 'Własna sauna, bania i cała panorama Tatr.'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`UPDATE \`pages_blocks_hero_locales\` SET \`subline\` = REPLACE(\`subline\`, ${OLD}, ${NEW}) WHERE \`_locale\` = 'pl' AND instr(\`subline\`, ${OLD}) > 0;`)
  await db.run(sql`UPDATE \`_pages_v_blocks_hero_locales\` SET \`subline\` = REPLACE(\`subline\`, ${OLD}, ${NEW}) WHERE \`_locale\` = 'pl' AND instr(\`subline\`, ${OLD}) > 0 AND \`_parent_id\` IN (SELECT h.id FROM \`_pages_v_blocks_hero\` h WHERE h._parent_id IN (SELECT id FROM \`_pages_v\` WHERE \`latest\` = 1));`)
  await touchPages(db)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  void db
}
