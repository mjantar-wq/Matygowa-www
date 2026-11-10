import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * Przenosiny sekcji na ŻYWYCH danych z panelu (Michał, 10.11.2026), zamiast ponownego importu plików, który nadpisuje edycje:
 *  1. „Opowieść o saunie i bani” (blok Rytuały: Ciepło, Mróz, Para, Cisza) idzie ze strony Sauna i bania (rituals)
 *     na stronę Osada (settlement), po sekcji „W zgodzie z naturą” (kotwica `natura`), z nagłówkiem „Jak kończy się dzień w osadzie”
 *     (nagłówek wpisujemy tylko, gdy pole jest puste) i bez listy cen.
 *  2. „Góralszczyzna dziś” (wstęp, tematy, słowniczek; kotwice `goralszczyzna…`) idzie z Osady na koniec strony Sauna i bania.
 *  3. „Ludzie z okolicy” (kotwica `goralszczyzna-ludzie`) znika ze strony. Treść zostaje w content/pages/osada.json
 *     (`enabled: false`) i w starszych wersjach wpisu w panelu.
 *  4. Licznik na stronie głównej: „942 m” + „n.p.m., tu, w osadzie” zamienia się na „942 m n.p.m.” bez opisu.
 *
 * Przenoszone są istniejące wiersze (te same id), więc zostają teksty PL/EN, zdjęcia i wszystko, co zmieniono w panelu.
 * Zmiana dotyczy i opublikowanej treści (pages_blocks_*), i ostatniej wersji w panelu (_pages_v_blocks_*), żeby formularz
 * nie pokazał starego układu. Migracja jest bezpieczna przy ponownym uruchomieniu i przy pustej bazie (nic nie robi).
 */

type Db = MigrateUpArgs['db']
type Block = { table: string; id: number | string; order: number; anchor: string | null }

const LOCALES = ['pl', 'en'] as const
const OPOWIESC_HEADING = { pl: 'Jak kończy się dzień w osadzie', en: 'How a day here ends' }
const OLD_STAT_LABELS = ['n.p.m., tu, w osadzie', 'above sea level, right here']

const rows = async (db: Db, query: ReturnType<typeof sql>): Promise<Record<string, unknown>[]> =>
  (await (db as unknown as { all: (q: unknown) => Promise<Record<string, unknown>[]> }).all(query)) ?? []

/** Tabele bloków układu strony (mają kolumnę _path), z wyłączeniem tabel zagnieżdżonych tablic i tłumaczeń. */
async function blockTables(db: Db, prefix: string): Promise<string[]> {
  const tables = await rows(db, sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name LIKE ${prefix + '_blocks_%'}`)
  const out: string[] = []
  for (const t of tables) {
    const name = String(t.name)
    const cols = await rows(db, sql.raw(`PRAGMA table_info(\`${name}\`)`))
    if (cols.some((c) => c.name === '_path')) out.push(name)
  }
  return out
}

async function layout(db: Db, tables: string[], parent: number): Promise<Block[]> {
  const blocks: Block[] = []
  for (const table of tables) {
    const cols = await rows(db, sql.raw(`PRAGMA table_info(\`${table}\`)`))
    const anchor = cols.some((c) => c.name === 'anchor') ? '`anchor`' : 'NULL'
    const found = await rows(db, sql.raw(`SELECT id, _order, ${anchor} AS anchor FROM \`${table}\` WHERE _parent_id = ${Number(parent)} AND _path IN ('layout', 'version.layout')`))
    for (const b of found) blocks.push({ table, id: b.id as number | string, order: Number(b._order), anchor: (b.anchor as string | null) ?? null })
  }
  return blocks.sort((a, b) => a.order - b.order)
}

const quote = (v: number | string) => (typeof v === 'number' ? String(v) : `'${v.replace(/'/g, "''")}'`)

/** Zapisuje nową kolejność i właściciela bloków dwóch stron. */
async function save(db: Db, page: { id: number; blocks: Block[] }) {
  for (const [i, b] of page.blocks.entries()) {
    await db.run(sql.raw(`UPDATE \`${b.table}\` SET _parent_id = ${page.id}, _order = ${i + 1} WHERE id = ${quote(b.id)}`))
  }
}

/** Wpisuje tekst do pola lokalizowanego bloku tylko wtedy, gdy jest puste (zmiana z panelu ma pierwszeństwo). */
async function setIfEmpty(db: Db, table: string, id: number | string, column: string, values: Record<(typeof LOCALES)[number], string>) {
  const loc = `${table}_locales`
  for (const l of LOCALES) {
    await db.run(sql.raw(`UPDATE \`${loc}\` SET \`${column}\` = '${values[l].replace(/'/g, "''")}' WHERE _parent_id = ${quote(id)} AND _locale = '${l}' AND (\`${column}\` IS NULL OR \`${column}\` = '')`))
    await db.run(sql.raw(`INSERT INTO \`${loc}\` (\`${column}\`, _locale, _parent_id) SELECT '${values[l].replace(/'/g, "''")}', '${l}', ${quote(id)} WHERE NOT EXISTS (SELECT 1 FROM \`${loc}\` WHERE _parent_id = ${quote(id)} AND _locale = '${l}')`))
  }
}

async function moveSections(db: Db, prefix: '' | '_', pageIds: { settlement: number; rituals: number }) {
  const p = prefix ? '_pages_v' : 'pages'
  const tables = await blockTables(db, p)
  const ritualsTable = `${p}_blocks_rituals`
  const storyTable = `${p}_blocks_story`
  const settlement = { id: pageIds.settlement, blocks: await layout(db, tables, pageIds.settlement) }
  const rituals = { id: pageIds.rituals, blocks: await layout(db, tables, pageIds.rituals) }
  const isGoral = (b: Block) => b.anchor === 'goralszczyzna' || (b.anchor?.startsWith('goralszczyzna-') ?? false)

  // 1. opowieść o saunie i bani: Rytuały → Osada (jeśli jeszcze jej tam nie ma)
  const hasOpowiesc = settlement.blocks.some((b) => b.table === ritualsTable)
  const opowiesc = rituals.blocks.find((b) => b.table === ritualsTable)
  if (opowiesc && !hasOpowiesc) {
    rituals.blocks = rituals.blocks.filter((b) => b !== opowiesc)
    const at = settlement.blocks.findIndex((b) => b.anchor === 'natura')
    settlement.blocks.splice(at === -1 ? settlement.blocks.length : at + 1, 0, opowiesc)
    await db.run(sql.raw(`UPDATE \`${ritualsTable}\` SET show_prices = 0, anchor = COALESCE(NULLIF(anchor, ''), 'opowiesc') WHERE id = ${quote(opowiesc.id)}`))
    await setIfEmpty(db, ritualsTable, opowiesc.id, 'heading', OPOWIESC_HEADING)
  }

  // 3. „Ludzie z okolicy” znika ze strony (przed przeniesieniem reszty)
  const ludzie = settlement.blocks.filter((b) => b.table === storyTable && b.anchor === 'goralszczyzna-ludzie')
  for (const b of ludzie) {
    await db.run(sql.raw(`DELETE FROM \`${storyTable}_locales\` WHERE _parent_id = ${quote(b.id)}`))
    await db.run(sql.raw(`DELETE FROM \`${storyTable}\` WHERE id = ${quote(b.id)}`))
  }
  settlement.blocks = settlement.blocks.filter((b) => !ludzie.includes(b))

  // 2. „Góralszczyzna dziś”: Osada → koniec strony Sauna i bania (jeśli jeszcze jej tam nie ma)
  const alreadyThere = rituals.blocks.some((b) => b.anchor === 'goralszczyzna')
  const goral = settlement.blocks.filter(isGoral)
  if (goral.length && !alreadyThere) {
    settlement.blocks = settlement.blocks.filter((b) => !goral.includes(b))
    rituals.blocks.push(...goral)
  }

  await save(db, settlement)
  await save(db, rituals)

  // bez „Ludzi z okolicy” słowniczek wypada po temacie ze zdjęciem po prawej, więc zdjęcie idzie na lewo (jak w nowym imporcie)
  if (ludzie.length) await db.run(sql.raw(`UPDATE \`${storyTable}\` SET image_position = 'start' WHERE anchor = 'goralszczyzna-slowniczek' AND image_position = 'end' AND _parent_id = ${rituals.id}`))
}

async function fixStat(db: Db, p: string) {
  const stats = `${p}_blocks_intro_stats`
  await db.run(sql.raw(`UPDATE \`${stats}_locales\` SET label = '' WHERE label IN (${OLD_STAT_LABELS.map((l) => `'${l}'`).join(', ')}) AND _parent_id IN (SELECT id FROM \`${stats}\` WHERE value = '942 m')`))
  await db.run(sql.raw(`UPDATE \`${stats}\` SET value = '942 m n.p.m.' WHERE value = '942 m'`))
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const pages = await rows(db, sql`SELECT id, slug FROM pages WHERE slug IN ('settlement', 'rituals')`)
  const id = (slug: string) => pages.find((r) => r.slug === slug)?.id as number | undefined
  const settlement = id('settlement')
  const rituals = id('rituals')

  if (settlement && rituals) {
    // opublikowana treść
    await moveSections(db, '', { settlement, rituals })
    // ostatnia wersja w panelu (może być nowsza niż opublikowana, jeśli ktoś zapisał szkic)
    const latest = (page: number) => rows(db, sql`SELECT id FROM _pages_v WHERE parent_id = ${page} AND latest = 1 LIMIT 1`)
    const [vs, vr] = [await latest(settlement), await latest(rituals)]
    if (vs[0] && vr[0]) await moveSections(db, '_', { settlement: vs[0].id as number, rituals: vr[0].id as number })
  }

  await fixStat(db, 'pages')
  await fixStat(db, '_pages_v')
}

export async function down({ db: _db }: MigrateDownArgs): Promise<void> {
  // Przenosin nie cofamy automatycznie: wrócić do poprzedniego układu można z historii wersji wpisu w panelu.
}
