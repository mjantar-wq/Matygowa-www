import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * Domek Wołoszyn jest 8-osobowy, nie 10-osobowy (Michał, 10.11.2026). Zmieniamy tylko ten domek:
 * pole „Maks. osób” (10 -> 8) i zdanie „dla 10 osób” / „for 10” w opisie w wyszukiwarce.
 * Wartości i teksty z panelu zostają: ruszamy tylko to, co nadal ma dokładnie starą liczbę.
 * Zapis o rozkładanej sofie zostaje. Łomnica i Lodowy zostają 10-osobowe. Opinii gości nie ruszamy.
 * Podbijamy datę aktualizacji, żeby panel ostrzegł o starej karcie (jak w migracji z #202).
 */
const WHERE_UNIT = `slug IN ('woloszyn', 'dom-woloszyn') OR icecoldres_code = 'woloszyn'`
const TEXTS: [locale: string, from: string, to: string][] = [
  ['pl', 'dla 10 osób', 'dla 8 osób'],
  ['en', 'cottage for 10 near', 'cottage for 8 near'],
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const now = sql`strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`
  await db.run(sql`UPDATE \`units\` SET \`max_guests\` = 8 WHERE \`max_guests\` = 10 AND (${sql.raw(WHERE_UNIT)});`)
  await db.run(sql`UPDATE \`_units_v\` SET \`version_max_guests\` = 8 WHERE \`latest\` = 1 AND \`version_max_guests\` = 10 AND (${sql.raw(WHERE_UNIT.replace(/\b(slug|icecoldres_code)\b/g, 'version_$1'))});`)
  for (const [locale, from, to] of TEXTS) {
    await db.run(sql`UPDATE \`units_locales\` SET \`seo_description\` = replace(\`seo_description\`, ${from}, ${to})
      WHERE \`_locale\` = ${locale} AND \`seo_description\` LIKE ${'%' + from + '%'}
      AND \`_parent_id\` IN (SELECT \`id\` FROM \`units\` WHERE ${sql.raw(WHERE_UNIT)});`)
    await db.run(sql`UPDATE \`_units_v_locales\` SET \`version_seo_description\` = replace(\`version_seo_description\`, ${from}, ${to})
      WHERE \`_locale\` = ${locale} AND \`version_seo_description\` LIKE ${'%' + from + '%'}
      AND \`_parent_id\` IN (SELECT \`id\` FROM \`_units_v\` WHERE \`latest\` = 1 AND (${sql.raw(WHERE_UNIT.replace(/\b(slug|icecoldres_code)\b/g, 'version_$1'))}));`)
  }
  await db.run(sql`UPDATE \`units\` SET \`updated_at\` = ${now} WHERE ${sql.raw(WHERE_UNIT)};`)
  await db.run(sql`UPDATE \`_units_v\` SET \`version_updated_at\` = ${now}, \`updated_at\` = ${now}
    WHERE \`latest\` = 1 AND (${sql.raw(WHERE_UNIT.replace(/\b(slug|icecoldres_code)\b/g, 'version_$1'))});`)
}

export async function down({ db: _db }: MigrateDownArgs): Promise<void> {}
