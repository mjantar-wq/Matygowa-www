import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * Zamiana miejsc na ŻYWYCH danych z panelu (Michał, 10.11.2026), bez importu plików, który nadpisuje edycje:
 *  1. Narracja „Jak kończy się dzień w osadzie” (blok Rytuały: Ciepło, Mróz, Para, Cisza) wraca ze strony Osada
 *     (settlement) na początek strony Sauna i bania (rituals), przed „Góralszczyznę dziś”.
 *  2. Blok „Sauna i bania” idzie z rituals na Osadę, po sekcji „W zgodzie z naturą” (kotwica `natura`), w tej samej kolejności:
 *     wstęp (dotąd pole „Wstęp” strony, teraz blok „Tekst” z nagłówkiem = tytuł strony), karta Sauna, karta Bania, zasady.
 *     Pole „Wstęp” strony Sauna i bania zostaje puste, żeby wstęp nie występował dwa razy.
 *
 * Przenoszone są istniejące wiersze (te same id), więc zostają teksty PL/EN, zdjęcia i ceny z panelu. Nowy jest tylko blok
 * wstępu, zbudowany z aktualnego tekstu pola „Wstęp”. Dotyczy treści opublikowanej (pages_*) i ostatniej wersji w panelu
 * (_pages_v_*). Bezpieczna przy ponownym uruchomieniu i przy pustej bazie. Opinii gości nie ruszamy.
 */

type Db = MigrateUpArgs['db']
type Block = { table: string; id: number | string; order: number; anchor: string | null }

const LOCALES = ['pl', 'en'] as const
const INTRO_ANCHOR = 'sauna-i-bania'

const rows = async (db: Db, query: ReturnType<typeof sql>): Promise<Record<string, unknown>[]> =>
  (await (db as unknown as { all: (q: unknown) => Promise<Record<string, unknown>[]> }).all(query)) ?? []

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
const str = (v: string) => `'${v.replace(/'/g, "''")}'`

async function save(db: Db, page: { id: number; blocks: Block[] }) {
  for (const [i, b] of page.blocks.entries()) {
    await db.run(sql.raw(`UPDATE \`${b.table}\` SET _parent_id = ${page.id}, _order = ${i + 1} WHERE id = ${quote(b.id)}`))
  }
}

/** Zwykły tekst pola „Wstęp” (z *kursywą*) jako akapit edytora Lexical. */
function paragraph(text: string): string {
  const children = text
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .map((part) => {
      const italic = /^\*[^*]+\*$/.test(part)
      return { detail: 0, format: italic ? 2 : 0, mode: 'normal', style: '', text: italic ? part.slice(1, -1) : part, type: 'text', version: 1 }
    })
  return JSON.stringify({
    root: {
      children: [{ children, direction: null, format: '', indent: 0, type: 'paragraph', version: 1, textFormat: 0, textStyle: '' }],
      direction: null, format: '', indent: 0, type: 'root', version: 1,
    },
  })
}

/** Dodaje blok „Tekst” ze wstępem strony Sauna i bania; zwraca go albo null, gdy wstępu nie ma. */
async function createIntroBlock(db: Db, versions: boolean, page: { id: number; blocks: Block[] }, intro: Record<string, string>, title: Record<string, string>): Promise<Block | null> {
  if (!LOCALES.some((l) => intro[l])) return null
  const table = versions ? '_pages_v_blocks_rich_text' : 'pages_blocks_rich_text'
  let id: number | string
  if (versions) {
    await db.run(sql.raw(`INSERT INTO \`${table}\` (_order, _parent_id, _path, anchor, _uuid) VALUES (0, ${page.id}, 'version.layout', ${str(INTRO_ANCHOR)}, ${str(crypto.randomUUID().replace(/-/g, '').slice(0, 24))})`))
    id = Number((await rows(db, sql.raw(`SELECT MAX(id) AS id FROM \`${table}\``)))[0]?.id)
  } else {
    id = crypto.randomUUID().replace(/-/g, '').slice(0, 24)
    await db.run(sql.raw(`INSERT INTO \`${table}\` (_order, _parent_id, _path, id, anchor) VALUES (0, ${page.id}, 'layout', ${str(id)}, ${str(INTRO_ANCHOR)})`))
  }
  for (const l of LOCALES) {
    await db.run(sql.raw(`INSERT INTO \`${table}_locales\` (heading, body, _locale, _parent_id) VALUES (${str(title[l] ?? '')}, ${str(intro[l] ? paragraph(intro[l]) : '')}, '${l}', ${quote(id)})`))
  }
  return { table, id, order: 0, anchor: INTRO_ANCHOR }
}

async function swap(db: Db, versions: boolean, pageIds: { settlement: number; rituals: number }) {
  const p = versions ? '_pages_v' : 'pages'
  const tables = await blockTables(db, p)
  const ritualsTable = `${p}_blocks_rituals`
  const settlement = { id: pageIds.settlement, blocks: await layout(db, tables, pageIds.settlement) }
  const rituals = { id: pageIds.rituals, blocks: await layout(db, tables, pageIds.rituals) }
  const isGoral = (b: Block) => b.anchor === 'goralszczyzna' || (b.anchor?.startsWith('goralszczyzna-') ?? false)

  // 2. blok Sauna i bania: rituals → Osada (to, co nie jest narracją ani Góralszczyzną)
  const saunaBlocks = rituals.blocks.filter((b) => b.table !== ritualsTable && !isGoral(b))
  const alreadyMoved = settlement.blocks.some((b) => b.anchor === INTRO_ANCHOR)
  const narrationOnOsada = settlement.blocks.find((b) => b.table === ritualsTable)

  // 1. narracja: Osada → początek Rytuałów (jeśli jeszcze jej tam nie ma)
  const narrationBack = narrationOnOsada && !rituals.blocks.some((b) => b.table === ritualsTable) ? narrationOnOsada : null
  if (narrationBack) settlement.blocks = settlement.blocks.filter((b) => b !== narrationBack)

  let introBlock: Block | null = null
  if (saunaBlocks.length && !alreadyMoved) {
    const titleRows = await rows(db, versions
      ? sql`SELECT _locale, version_title AS title, version_intro AS intro FROM _pages_v_locales WHERE _parent_id = ${rituals.id}`
      : sql`SELECT _locale, title, intro FROM pages_locales WHERE _parent_id = ${rituals.id}`)
    const intro: Record<string, string> = {}
    const title: Record<string, string> = {}
    for (const r of titleRows) { intro[String(r._locale)] = String(r.intro ?? ''); title[String(r._locale)] = String(r.title ?? '') }
    introBlock = await createIntroBlock(db, versions, settlement, intro, title)
    rituals.blocks = rituals.blocks.filter((b) => !saunaBlocks.includes(b))
    const at = settlement.blocks.findIndex((b) => b.anchor === 'natura')
    settlement.blocks.splice(at === -1 ? settlement.blocks.length : at + 1, 0, ...(introBlock ? [introBlock] : []), ...saunaBlocks)
    // wstęp przeniesiony do bloku, więc pole strony czyścimy (przeniesienie, nie kopia)
    if (introBlock) {
      await db.run(sql.raw(versions
        ? `UPDATE _pages_v_locales SET version_intro = NULL WHERE _parent_id = ${rituals.id}`
        : `UPDATE pages_locales SET intro = NULL WHERE _parent_id = ${rituals.id}`))
    }
  }

  if (narrationBack) rituals.blocks.unshift(narrationBack)

  await save(db, settlement)
  await save(db, rituals)
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const pages = await rows(db, sql`SELECT id, slug FROM pages WHERE slug IN ('settlement', 'rituals')`)
  const id = (slug: string) => pages.find((r) => r.slug === slug)?.id as number | undefined
  const settlement = id('settlement')
  const rituals = id('rituals')
  if (!settlement || !rituals) return

  await swap(db, false, { settlement, rituals })
  // ostatnia wersja w panelu (może być nowsza niż opublikowana, jeśli ktoś zapisał szkic)
  const latest = (page: number) => rows(db, sql`SELECT id FROM _pages_v WHERE parent_id = ${page} AND latest = 1 LIMIT 1`)
  const [vs, vr] = [await latest(settlement), await latest(rituals)]
  if (vs[0] && vr[0]) await swap(db, true, { settlement: vs[0].id as number, rituals: vr[0].id as number })
}

export async function down({ db: _db }: MigrateDownArgs): Promise<void> {
  // Przenosin nie cofamy automatycznie: wrócić do poprzedniego układu można z historii wersji wpisu w panelu.
}
