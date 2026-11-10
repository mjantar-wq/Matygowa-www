import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'
import { touchPages } from '../lib/touch-pages'
import { EN_NAMING_PHRASES, EN_NAMING_EXACT } from '../lib/en-naming'

/**
 * Nazewnictwo EN pod SEO: „house” zamiast „cottage”, „chalet” w opisach w wyszukiwarce (Michał, 10.11.2026).
 * Idzie na ŻYWYCH danych i tylko w polach EN (_locale = 'en'), w opublikowanej treści i w wersjach.
 * Zamieniamy wyłącznie dokładne dotychczasowe frazy, więc tekst zmieniony w panelu zostaje nietknięty.
 * Opinii gości nie ruszamy: pomijamy każdą tabelę z „testimonial” lub „review” w nazwie.
 * Polskich tekstów nie ruszamy.
 */
type Db = { run: (q: unknown) => Promise<unknown> }
const rows = async (db: unknown, query: ReturnType<typeof sql>): Promise<Record<string, unknown>[]> =>
  (await (db as { all: (q: unknown) => Promise<Record<string, unknown>[]> }).all(query)) ?? []
const q = (v: string) => `'${v.replace(/'/g, "''")}'`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const tables = await rows(db, sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE '%\_locales' ESCAPE '\'`)
  for (const { name } of tables) {
    const table = String(name)
    if (/testimonial|review/i.test(table)) continue
    const cols = await rows(db, sql.raw(`SELECT name, type FROM pragma_table_info(${q(table)})`))
    if (!cols.some((c) => c.name === '_locale')) continue
    for (const c of cols) {
      const col = String(c.name)
      if (col === '_locale' || col === 'id' || col === '_parent_id' || !/^(text|varchar)/i.test(String(c.type))) continue
      const C = `\`${table}\`.\`${col}\``
      for (const [from, to] of EN_NAMING_PHRASES) {
        await db.run(
          sql.raw(`UPDATE \`${table}\` SET \`${col}\` = replace(${C}, ${q(from)}, ${q(to)}) WHERE \`_locale\` = 'en' AND instr(${C}, ${q(from)}) > 0`),
        )
      }
      for (const [from, to] of EN_NAMING_EXACT) {
        await db.run(sql.raw(`UPDATE \`${table}\` SET \`${col}\` = ${q(to)} WHERE \`_locale\` = 'en' AND ${C} = ${q(from)}`))
      }
    }
  }
  const now = sql`strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`
  await db.run(sql`UPDATE \`units\` SET \`updated_at\` = ${now}`)
  await db.run(sql`UPDATE \`_units_v\` SET \`version_updated_at\` = ${now}, \`updated_at\` = ${now} WHERE \`latest\` = 1`)
  await touchPages(db)
}

export async function down({ db: _db }: MigrateDownArgs): Promise<void> {}
