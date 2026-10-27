import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`units_locales\` ADD \`beds\` text;`)
  await db.run(sql`ALTER TABLE \`_units_v_locales\` ADD \`version_beds\` text;`)

  // Treść startowa (Michał, 27.10.2026): rozkładana sofa tylko w domach 10-osobowych. Te same zdania są w content/units.json.
  const beds: [where: string, locale: string, text: string][] = [
    ["kind = 'house' AND coalesce(max_guests, 0) < 10", 'pl', HOUSE_PL],
    ["kind = 'house' AND coalesce(max_guests, 0) < 10", 'en', HOUSE_EN],
    ["kind = 'house' AND max_guests >= 10", 'pl', `${HOUSE_PL} ${SOFA_PL}`],
    ["kind = 'house' AND max_guests >= 10", 'en', `${HOUSE_EN} ${SOFA_EN}`],
    ["kind = 'apartment'", 'pl', APARTMENT_PL],
    ["kind = 'apartment'", 'en', APARTMENT_EN],
  ]
  for (const [where, locale, text] of beds) {
    await db.run(sql`UPDATE \`units_locales\` SET \`beds\` = ${text}
      WHERE \`_locale\` = ${locale} AND \`beds\` IS NULL AND \`_parent_id\` IN (SELECT \`id\` FROM \`units\` WHERE ${sql.raw(where)});`)
    // ostatnia wersja w panelu: inaczej formularz pokazałby puste pole i zapis by je wyczyścił
    await db.run(sql`UPDATE \`_units_v_locales\` SET \`version_beds\` = ${text}
      WHERE \`_locale\` = ${locale} AND \`version_beds\` IS NULL AND \`_parent_id\` IN (
        SELECT \`id\` FROM \`_units_v\` WHERE \`latest\` = 1 AND ${sql.raw(where.replace(/\b(kind|max_guests)\b/g, 'version_$1'))});`)
  }
}

const HOUSE_PL = 'Trzy sypialnie z łóżkiem dwuosobowym (160 cm) i jedna z dwoma łóżkami jednoosobowymi.'
const HOUSE_EN = 'Three bedrooms with a double bed (160 cm) and one with two single beds.'
const SOFA_PL = 'W salonie rozkładana dwuosobowa sofa.'
const SOFA_EN = 'Plus a double sofa bed in the living room.'
const APARTMENT_PL = 'Sypialnia z łóżkiem dwuosobowym (160 cm) i rozkładana sofa w salonie.'
const APARTMENT_EN = 'A bedroom with a double bed (160 cm) and a sofa bed in the living room.'

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`units_locales\` DROP COLUMN \`beds\`;`)
  await db.run(sql`ALTER TABLE \`_units_v_locales\` DROP COLUMN \`version_beds\`;`)
}
