import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'
import { touchPages } from '../lib/touch-pages'

/**
 * Strona Osada, karta Bania: na końcu opisu został urwany wyraz „Obok.” (audyt 12.11.2026).
 * Żywe dane z panelu: usuwamy tylko ten wyraz i tylko tam, gdzie zdanie nadal kończy się dokładnie
 * „z widokiem na Tatry. Obok.”, więc tekst zmieniony w panelu zostaje. Dotyczy treści opublikowanej
 * i wersji (tabele pages_* i _pages_v_*), wszystkich kolumn tekstowych (zwykły tekst i JSON edytora).
 */
const FROM = 'z widokiem na Tatry. Obok.'
const TO = 'z widokiem na Tatry.'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const rows = async (q: ReturnType<typeof sql>): Promise<Record<string, unknown>[]> =>
    (await (db as unknown as { all: (q: unknown) => Promise<Record<string, unknown>[]> }).all(q)) ?? []
  const tables = await rows(sql`SELECT name FROM sqlite_master WHERE type = 'table' AND (name LIKE 'pages\\_%' ESCAPE '\\' OR name LIKE '\\_pages\\_v\\_%' ESCAPE '\\')`)
  for (const { name } of tables) {
    const cols = await rows(sql.raw(`PRAGMA table_info(\`${String(name)}\`)`))
    for (const c of cols) {
      if (!/CHAR|TEXT|CLOB/i.test(String(c.type))) continue
      await db.run(sql.raw(`UPDATE \`${String(name)}\` SET \`${String(c.name)}\` = replace(\`${String(c.name)}\`, '${FROM}', '${TO}') WHERE \`${String(c.name)}\` LIKE '%${FROM}%'`))
    }
  }
  await touchPages(db)
}

export async function down({ db: _db }: MigrateDownArgs): Promise<void> {}
