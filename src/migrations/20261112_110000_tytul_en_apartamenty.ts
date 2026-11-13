import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * Strona główna EN: tytuł i opis SEO wspominają o apartamentach (12.11.2026).
 * Żywe dane, tylko pola EN globala ustawień. Zmieniamy wyłącznie dotychczasowe, dokładne wartości,
 * więc tekst poprawiony w panelu zostaje. PL i opinii nie ruszamy.
 */
const OLD_TITLE = 'Private houses with sauna and hot tub near Zakopane | Matygowa Osada'
const NEW_TITLE = 'Houses & Apartments with Sauna near Zakopane | Matygowa Osada'
const OLD_DESC = 'Private houses and chalets near Zakopane and Bukowina Tatrzańska: your own sauna, hot tub, fireplace and the full Tatra panorama. For ski trips, summer and Christmas.'
const NEW_DESC = 'Private houses and apartments near Zakopane and Bukowina Tatrzańska: your own sauna, hot tub, fireplace and the full Tatra panorama. For ski trips, summer and Christmas.'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql.raw(`UPDATE \`settings_locales\` SET
    \`seo_title\` = CASE \`seo_title\` WHEN '${OLD_TITLE}' THEN '${NEW_TITLE}' ELSE \`seo_title\` END,
    \`seo_description\` = CASE \`seo_description\` WHEN '${OLD_DESC}' THEN '${NEW_DESC}' ELSE \`seo_description\` END
    WHERE \`_locale\` = 'en'`))
}

export async function down({}: MigrateDownArgs): Promise<void> {
  // bez cofania
}
