import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * Tytuł „Sauna i bania” nad narracją na stronie Rytuały jest ukryty (Michał, 10.11.2026). Nowe pole strony „Ukryj tytuł”
 * (hide_title / version_hide_title) włączamy tylko dla strony `rituals`: opublikowanej i wszystkich jej wersji z panelu,
 * żeby formularz i podgląd szkicu zachowywały się tak samo. Tytuł zostaje w menu, w SEO i w kodzie strony (niewidoczny h1).
 * Nic innego się nie zmienia, teksty z panelu zostają. Opinii gości nie ruszamy.
 */

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages\` ADD \`hide_title\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` ADD \`version_hide_title\` integer DEFAULT false;`)
  await db.run(sql`UPDATE \`pages\` SET \`hide_title\` = 1 WHERE \`slug\` = 'rituals';`)
  await db.run(sql`UPDATE \`_pages_v\` SET \`version_hide_title\` = 1 WHERE \`parent_id\` IN (SELECT id FROM \`pages\` WHERE \`slug\` = 'rituals');`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`hide_title\`;`)
  await db.run(sql`ALTER TABLE \`_pages_v\` DROP COLUMN \`version_hide_title\`;`)
}
