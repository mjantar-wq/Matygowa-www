import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`offers\` DROP COLUMN \`valid_from\`;`)
  await db.run(sql`ALTER TABLE \`offers\` DROP COLUMN \`valid_to\`;`)
  await db.run(sql`ALTER TABLE \`offers_locales\` DROP COLUMN \`summary\`;`)
  await db.run(sql`ALTER TABLE \`offers_locales\` DROP COLUMN \`content\`;`)
  await db.run(sql`ALTER TABLE \`_offers_v\` DROP COLUMN \`version_valid_from\`;`)
  await db.run(sql`ALTER TABLE \`_offers_v\` DROP COLUMN \`version_valid_to\`;`)
  await db.run(sql`ALTER TABLE \`_offers_v_locales\` DROP COLUMN \`version_summary\`;`)
  await db.run(sql`ALTER TABLE \`_offers_v_locales\` DROP COLUMN \`version_content\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`offers\` ADD \`valid_from\` text;`)
  await db.run(sql`ALTER TABLE \`offers\` ADD \`valid_to\` text;`)
  await db.run(sql`ALTER TABLE \`offers_locales\` ADD \`summary\` text;`)
  await db.run(sql`ALTER TABLE \`offers_locales\` ADD \`content\` text;`)
  await db.run(sql`ALTER TABLE \`_offers_v\` ADD \`version_valid_from\` text;`)
  await db.run(sql`ALTER TABLE \`_offers_v\` ADD \`version_valid_to\` text;`)
  await db.run(sql`ALTER TABLE \`_offers_v_locales\` ADD \`version_summary\` text;`)
  await db.run(sql`ALTER TABLE \`_offers_v_locales\` ADD \`version_content\` text;`)
}
