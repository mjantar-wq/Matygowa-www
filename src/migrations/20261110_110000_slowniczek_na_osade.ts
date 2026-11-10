import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * Słowniczek „Słowa, które tu usłyszycie” (blok z kotwicą `goralszczyzna-slowniczek`, razem ze zdjęciem) idzie ze strony
 * Sauna i bania (rituals) na sam dół strony Osada (settlement) (Michał, 10.11.2026). Na ŻYWYCH danych z panelu:
 * przenoszony jest istniejący wiersz (to samo id), więc zostają teksty PL/EN, zdjęcie i edycje z panelu. Dotyczy treści
 * opublikowanej i ostatniej wersji w panelu. Bezpieczna przy ponownym uruchomieniu i przy pustej bazie. Opinii gości nie ruszamy.
 */

type Db = MigrateUpArgs['db']
const ANCHOR = 'goralszczyzna-slowniczek'

const rows = async (db: Db, query: ReturnType<typeof sql>): Promise<Record<string, unknown>[]> =>
  (await (db as unknown as { all: (q: unknown) => Promise<Record<string, unknown>[]> }).all(query)) ?? []

const quote = (v: number | string) => (typeof v === 'number' ? String(v) : `'${v.replace(/'/g, "''")}'`)

/** Przenosi blok słowniczka na koniec układu strony docelowej. */
async function move(db: Db, versions: boolean, from: number, to: number) {
  const table = versions ? '_pages_v_blocks_story' : 'pages_blocks_story'
  const p = versions ? '_pages_v' : 'pages'
  const there = await rows(db, sql.raw(`SELECT id FROM \`${table}\` WHERE _parent_id = ${to} AND anchor = '${ANCHOR}'`))
  if (there.length) return
  const block = await rows(db, sql.raw(`SELECT id FROM \`${table}\` WHERE _parent_id = ${from} AND anchor = '${ANCHOR}' AND _path IN ('layout', 'version.layout') LIMIT 1`))
  if (!block[0]) return
  // koniec układu = największa kolejność wśród wszystkich bloków strony docelowej
  let last = 0
  const tables = await rows(db, sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE ${p + '_blocks_%'}`)
  for (const t of tables) {
    const name = String(t.name)
    const cols = await rows(db, sql.raw(`PRAGMA table_info(\`${name}\`)`))
    if (!cols.some((c) => c.name === '_path')) continue
    const m = await rows(db, sql.raw(`SELECT MAX(_order) AS m FROM \`${name}\` WHERE _parent_id = ${to} AND _path IN ('layout', 'version.layout')`))
    last = Math.max(last, Number(m[0]?.m ?? 0))
  }
  await db.run(sql.raw(`UPDATE \`${table}\` SET _parent_id = ${to}, _order = ${last + 1} WHERE id = ${quote(block[0].id as number | string)}`))
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const pages = await rows(db, sql`SELECT id, slug FROM pages WHERE slug IN ('settlement', 'rituals')`)
  const id = (slug: string) => pages.find((r) => r.slug === slug)?.id as number | undefined
  const settlement = id('settlement')
  const rituals = id('rituals')
  if (!settlement || !rituals) return

  await move(db, false, rituals, settlement)
  const latest = (page: number) => rows(db, sql`SELECT id FROM _pages_v WHERE parent_id = ${page} AND latest = 1 LIMIT 1`)
  const [vs, vr] = [await latest(settlement), await latest(rituals)]
  if (vs[0] && vr[0]) await move(db, true, vr[0].id as number, vs[0].id as number)
}

export async function down({ db: _db }: MigrateDownArgs): Promise<void> {
  // Przenosin nie cofamy automatycznie: wrócić do poprzedniego układu można z historii wersji wpisu w panelu.
}
