import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * Bielska Jaskinia: nowe zdjęcia z panelu (10.11.2026), angielskie opisy zgodne z tym, co widać na zdjęciach.
 * Żywe dane, tylko pola EN dwóch rekordów mediów (wejście do jaskini, podziemne jeziorko z nawisami nacieków).
 * Podpis EN dostaje to samo źródło co PL (blog), bo dotychczasowy wskazywał na Správę slovenských jaskýň.
 * Zmieniamy wyłącznie dotychczasowe, dokładne wartości, więc tekst poprawiony w panelu zostaje. PL i opinii nie ruszamy.
 * Dwa proste zapytania, bez LIKE ... ESCAPE.
 */
const OLD_ALT_1 = 'Dripstone formations in Belianska Cave'
const OLD_ALT_2 = 'A wall of flowstone in Belianska Cave'
const OLD_CAPTION = 'Photo: Správa slovenských jaskýň · ssj.sk https://www.ssj.sk/sk/jaskyna/2-belianska-jaskyna'
const NEW_CAPTION = 'Photo: karolowamama.blogspot.com/2025/08/jaskinia-bielanska-tatry-sowackie.html'
const NEW_ALT_1 = 'Stone entrance to Belianska Cave under a timber roof with the cave name on it, surrounded by green forest'
const NEW_ALT_2 = 'Still underground pool reflecting pale flowstone walls and stalactites inside Belianska Cave'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql.raw(`UPDATE \`media_locales\` SET
    \`alt\` = CASE \`alt\` WHEN '${OLD_ALT_1}' THEN '${NEW_ALT_1}' WHEN '${OLD_ALT_2}' THEN '${NEW_ALT_2}' ELSE \`alt\` END,
    \`caption\` = CASE \`caption\` WHEN '${OLD_CAPTION}' THEN '${NEW_CAPTION}' ELSE \`caption\` END
    WHERE \`_locale\` = 'en' AND \`_parent_id\` IN (SELECT \`id\` FROM \`media\` WHERE \`filename\` IN ('20250810_100858-2.jpg', '20250810_113601.jpg'))`))
}

export async function down({}: MigrateDownArgs): Promise<void> {
  // bez cofania: stare opisy opisywały inne zdjęcia
}
