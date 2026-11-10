import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'
import { touchPages } from '../lib/touch-pages'

/**
 * Nazwy domków w EN: „Hawrań Chalet” zamiast „Hawrań house” (Michał, 10.11.2026).
 * Żywe dane, tylko pola EN (_locale = 'en'), opublikowane i wersje. Zamieniamy wyłącznie dokładne dotychczasowe frazy
 * „<Szczyt> house”, więc nazwy i teksty zmienione w panelu zostają. Opinii gości i polskiego nie ruszamy.
 * Jedno zapytanie na tabelę (zdalna D1 jest wolna przy wielu pojedynczych zapytaniach), bez LIKE ... ESCAPE.
 */
const PEAKS = ['Hawrań', 'Gerlach', 'Świnica', 'Wołoszyn', 'Łomnica', 'Lodowy']
const PHRASES: [string, string][] = PEAKS.map((p) => [`${p} house`, `${p} Chalet`])
// Opisy zdjęć (media): nazwy domków z „cottage” przechodzą na „Chalet”, reszta na „house” (zdjęcia dotyczą naszych domków).
const MEDIA_PHRASES: [string, string][] = [
  ...PEAKS.map((p): [string, string] => [`${p} cottage`, `${p} Chalet`]),
  ['cottages', 'houses'],
  ['cottage', 'house'],
]

const rows = async (db: unknown, query: ReturnType<typeof sql>): Promise<Record<string, unknown>[]> =>
  (await (db as { all: (q: unknown) => Promise<Record<string, unknown>[]> }).all(query)) ?? []
const q = (v: string) => `'${v.replace(/'/g, "''")}'`

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const all = await rows(db, sql`SELECT name FROM sqlite_master WHERE type = 'table'`)
  for (const { name } of all.filter((t) => String(t.name).endsWith('_locales'))) {
    const table = String(name)
    if (/testimonial|review/i.test(table)) continue
    const cols = await rows(db, sql.raw(`SELECT name, type FROM pragma_table_info(${q(table)})`))
    if (!cols.some((c) => c.name === '_locale')) continue
    const textCols = cols
      .map((c) => ({ name: String(c.name), type: String(c.type) }))
      .filter((c) => !['_locale', 'id', '_parent_id'].includes(c.name) && /^(text|varchar)/i.test(c.type))
    if (!textCols.length) continue
    const sets = textCols.map(({ name: col }) => {
      let expr = `\`${col}\``
      for (const [from, to] of table === 'media_locales' ? [...MEDIA_PHRASES, ...PHRASES] : PHRASES) expr = `replace(${expr}, ${q(from)}, ${q(to)})`
      return `\`${col}\` = ${expr}`
    })
    const any = textCols.map(({ name: col }) => `instr(\`${col}\`, ${table === 'media_locales' ? "'ottage'" : "' house'"}) > 0`).join(' OR ')
    await db.run(sql.raw(`UPDATE \`${table}\` SET ${sets.join(', ')} WHERE \`_locale\` = 'en' AND (${any})`))
  }
  const now = sql`strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`
  await db.run(sql`UPDATE \`units\` SET \`updated_at\` = ${now}`)
  await db.run(sql`UPDATE \`_units_v\` SET \`version_updated_at\` = ${now}, \`updated_at\` = ${now} WHERE \`latest\` = 1`)
  await touchPages(db)
}

export async function down({ db: _db }: MigrateDownArgs): Promise<void> {}
