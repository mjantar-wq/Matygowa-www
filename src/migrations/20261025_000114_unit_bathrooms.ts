import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`units\` ADD \`bathrooms\` numeric;`)
  await db.run(sql`ALTER TABLE \`units\` ADD \`separate_wc\` integer;`)
  await db.run(sql`ALTER TABLE \`units\` ADD \`ensuite_upstairs\` integer;`)
  await db.run(sql`ALTER TABLE \`_units_v\` ADD \`version_bathrooms\` numeric;`)
  await db.run(sql`ALTER TABLE \`_units_v\` ADD \`version_separate_wc\` integer;`)
  await db.run(sql`ALTER TABLE \`_units_v\` ADD \`version_ensuite_upstairs\` integer;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`units\` DROP COLUMN \`bathrooms\`;`)
  await db.run(sql`ALTER TABLE \`units\` DROP COLUMN \`separate_wc\`;`)
  await db.run(sql`ALTER TABLE \`units\` DROP COLUMN \`ensuite_upstairs\`;`)
  await db.run(sql`ALTER TABLE \`_units_v\` DROP COLUMN \`version_bathrooms\`;`)
  await db.run(sql`ALTER TABLE \`_units_v\` DROP COLUMN \`version_separate_wc\`;`)
  await db.run(sql`ALTER TABLE \`_units_v\` DROP COLUMN \`version_ensuite_upstairs\`;`)
}
