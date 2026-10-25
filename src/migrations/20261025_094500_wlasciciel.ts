import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

// Rola „właściciel” (tylko on zakłada konta i nadaje role): dostaje ją najstarsze konto, jeśli właściciela jeszcze nie ma.
// Kolumna role jest tekstowa, więc schemat się nie zmienia.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`UPDATE \`users\` SET \`role\` = 'owner' WHERE \`id\` = (SELECT min(\`id\`) FROM \`users\`) AND NOT EXISTS (SELECT 1 FROM \`users\` WHERE \`role\` = 'owner');`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`UPDATE \`users\` SET \`role\` = 'admin' WHERE \`role\` = 'owner';`)
}
