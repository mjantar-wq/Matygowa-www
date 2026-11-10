import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

// Oferty w panelu: lista promocji z IceColdRes z przełącznikiem „Pokazuj na stronie” (bez wersji roboczych).
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`offers\` ADD \`published\` integer DEFAULT true;`)
  // dotychczasowe szkice były niewidoczne na stronie
  await db.run(sql`UPDATE \`offers\` SET \`published\` = (\`_status\` = 'published');`)
  await db.run(sql`CREATE UNIQUE INDEX \`offers_icecoldres_promotion_id_idx\` ON \`offers\` (\`icecoldres_promotion_id\`);`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX IF EXISTS \`offers_icecoldres_promotion_id_idx\`;`)
  await db.run(sql`ALTER TABLE \`offers\` DROP COLUMN \`published\`;`)
}
