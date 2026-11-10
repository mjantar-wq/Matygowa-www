import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * Atrakcja „Lot balonem” dostaje link „Strona obiektu” (https://lotybalonem.com/zakopane).
 * Ustawiamy go tylko tam, gdzie pole jest puste, żeby nie nadpisać linku wpisanego w panelu.
 * Dotyczy opublikowanej atrakcji i jej najnowszej wersji. Zamiast pełnego importu treści.
 */
const URL = 'https://lotybalonem.com/zakopane'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`UPDATE \`attractions\` SET \`url\` = ${URL}, \`updated_at\` = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE \`slug\` = 'balony' AND (\`url\` IS NULL OR \`url\` = '');`)
  await db.run(sql`UPDATE \`_attractions_v\` SET \`version_url\` = ${URL}, \`version_updated_at\` = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE \`latest\` = 1 AND \`version_slug\` = 'balony' AND (\`version_url\` IS NULL OR \`version_url\` = '');`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`UPDATE \`attractions\` SET \`url\` = NULL WHERE \`slug\` = 'balony' AND \`url\` = ${URL};`)
  await db.run(sql`UPDATE \`_attractions_v\` SET \`version_url\` = NULL WHERE \`version_slug\` = 'balony' AND \`version_url\` = ${URL};`)
}
