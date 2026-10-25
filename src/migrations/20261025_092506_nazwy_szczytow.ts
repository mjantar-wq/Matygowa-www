import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`units\` ADD \`peak_name_cases_gen\` text;`)
  await db.run(sql`ALTER TABLE \`units\` ADD \`peak_name_cases_acc\` text;`)
  await db.run(sql`ALTER TABLE \`units\` ADD \`peak_name_cases_loc\` text;`)
  await db.run(sql`ALTER TABLE \`units\` ADD \`peak_name_cases_inst\` text;`)
  await db.run(sql`ALTER TABLE \`units_locales\` ADD \`peak_name\` text;`)
  await db.run(sql`ALTER TABLE \`_units_v\` ADD \`version_peak_name_cases_gen\` text;`)
  await db.run(sql`ALTER TABLE \`_units_v\` ADD \`version_peak_name_cases_acc\` text;`)
  await db.run(sql`ALTER TABLE \`_units_v\` ADD \`version_peak_name_cases_loc\` text;`)
  await db.run(sql`ALTER TABLE \`_units_v\` ADD \`version_peak_name_cases_inst\` text;`)
  await db.run(sql`ALTER TABLE \`_units_v_locales\` ADD \`version_peak_name\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`units\` DROP COLUMN \`peak_name_cases_gen\`;`)
  await db.run(sql`ALTER TABLE \`units\` DROP COLUMN \`peak_name_cases_acc\`;`)
  await db.run(sql`ALTER TABLE \`units\` DROP COLUMN \`peak_name_cases_loc\`;`)
  await db.run(sql`ALTER TABLE \`units\` DROP COLUMN \`peak_name_cases_inst\`;`)
  await db.run(sql`ALTER TABLE \`units_locales\` DROP COLUMN \`peak_name\`;`)
  await db.run(sql`ALTER TABLE \`_units_v\` DROP COLUMN \`version_peak_name_cases_gen\`;`)
  await db.run(sql`ALTER TABLE \`_units_v\` DROP COLUMN \`version_peak_name_cases_acc\`;`)
  await db.run(sql`ALTER TABLE \`_units_v\` DROP COLUMN \`version_peak_name_cases_loc\`;`)
  await db.run(sql`ALTER TABLE \`_units_v\` DROP COLUMN \`version_peak_name_cases_inst\`;`)
  await db.run(sql`ALTER TABLE \`_units_v_locales\` DROP COLUMN \`version_peak_name\`;`)
}
