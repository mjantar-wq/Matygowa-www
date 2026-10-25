import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`media\` ADD \`rights\` text;`)
  await db.run(sql`CREATE INDEX \`media_rights_idx\` ON \`media\` (\`rights\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`media_rights_idx\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`rights\`;`)
}
