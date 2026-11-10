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
  const all = await rows(db, sql`SELECT name FROM sqlite_master WHERE type = 'table'`)
  const tables = all.filter((t) => String(t.name).endsWith('_locales'))
  for (const { name } of tables) {
    const table = String(name)
    if (/testimonial|review/i.test(table)) continue
    const cols = await rows(db, sql.raw(`SELECT name, type FROM pragma_table_info(${q(table)})`))
    if (!cols.some((c) => c.name === '_locale')) continue
    const textCols = cols
      .map((c) => ({ name: String(c.name), type: String(c.type) }))
      .filter((c) => !['_locale', 'id', '_parent_id'].includes(c.name) && /^(text|varchar)/i.test(c.type))
    if (!textCols.length) continue
    // Jedno zapytanie na tabelę (zdalna D1 jest wolna przy tysiącach zapytań): wszystkie kolumny naraz, łańcuch replace().
    // Każda fraza zawiera „ottage”, więc wiersze bez niego pomijamy.
    const sets = textCols.map(({ name: col }) => {
      const C = `\`${col}\``
      let expr = C
      for (const [from, to] of EN_NAMING_PHRASES) expr = `replace(${expr}, ${q(from)}, ${q(to)})`
      for (const [from, to] of EN_NAMING_EXACT) expr = `CASE WHEN ${C} = ${q(from)} THEN ${q(to)} ELSE ${expr} END`
      return `${C} = ${expr}`
    })
    const any = textCols.map(({ name: col }) => `instr(\`${col}\`, 'ottage') > 0`).join(' OR ')
    await db.run(sql.raw(`UPDATE \`${table}\` SET ${sets.join(', ')} WHERE \`_locale\` = 'en' AND (${any})`))
  }
  const now = sql`strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`
  await db.run(sql`UPDATE \`units\` SET \`updated_at\` = ${now}`)
  await db.run(sql`UPDATE \`_units_v\` SET \`version_updated_at\` = ${now}, \`updated_at\` = ${now} WHERE \`latest\` = 1`)
  await touchPages(db)
}

export async function down({ db: _db }: MigrateDownArgs): Promise<void> {}
