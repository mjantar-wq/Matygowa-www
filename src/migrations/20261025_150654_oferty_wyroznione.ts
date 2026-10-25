import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`offers\` ADD \`featured\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`_offers_v\` ADD \`version_featured\` integer DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`offers\` DROP COLUMN \`featured\`;`)
  await db.run(sql`ALTER TABLE \`_offers_v\` DROP COLUMN \`version_featured\`;`)
}
