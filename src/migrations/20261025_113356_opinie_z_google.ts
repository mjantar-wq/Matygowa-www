import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`testimonials\` ADD \`external_id\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`testimonials_external_id_idx\` ON \`testimonials\` (\`external_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`testimonials_external_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`testimonials\` DROP COLUMN \`external_id\`;`)
}
