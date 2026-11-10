import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * Angielskie teksty zgodne z polskimi po ręcznych poprawkach w panelu (Michał, 10.11.2026).
 * Zmiany idą na ŻYWYCH danych, nie przez ponowny import plików, który nadpisałby edycje z panelu.
 *
 * Każda poprawka dotyczy tylko pola EN i tylko wtedy, gdy jest w nim jeszcze dotychczasowy tekst (dokładne dopasowanie
 * fragmentu). Jeśli ktoś już poprawił to pole w panelu, migracja go nie rusza. Polskich tekstów i opinii gości nie zmieniamy.
 * Poprawki obejmują treść opublikowaną (pages_*) i wersje w panelu (_pages_v_*), żeby formularz nie pokazał starego tekstu.
 *
 *  1. Sauna i bania: wstęp i opis SEO. PL mówi, że bania jest grzana ekologicznie (pompa ciepła, jacuzzi), EN mówił o ogniu.
 *  2. Strona główna: „Osobita” w opisie panoramy; „balia z jacuzzi” w opisie łazienek; ostatnia scena dnia „Wieczór”, nie „Night”.
 *  3. Góralszczyzna dziś: bez dopisku „and do it today, every day”; słowniczek bez hasła „Wołosi” (usunięte z PL).
 *  4. Polityka prywatności: okres przechowywania danych z umowy („zwykle 6 lat, przy roszczeniach z najmu krócej”).
 */

type Db = MigrateUpArgs['db']
type Replacement = readonly [string, string]
type Transform = (value: string) => string

const rows = async (db: Db, query: ReturnType<typeof sql>): Promise<Record<string, unknown>[]> =>
  (await (db as unknown as { all: (q: unknown) => Promise<Record<string, unknown>[]> }).all(query)) ?? []

const quote = (v: string) => `'${v.replace(/'/g, "''")}'`

/** Przechodzi po węzłach tekstowych edytora (Lexical) albo, dla zwykłego tekstu, po całym polu. */
function mapText(value: string, fn: (text: string) => string, onTree?: (root: unknown) => void): string {
  let json: unknown
  try {
    json = JSON.parse(value)
  } catch {
    return fn(value)
  }
  if (json === null || typeof json !== 'object') return fn(value)
  const walk = (node: unknown): void => {
    if (Array.isArray(node)) return node.forEach(walk)
    if (node && typeof node === 'object') {
      const n = node as Record<string, unknown>
      if (n.type === 'text' && typeof n.text === 'string') n.text = fn(n.text)
      Object.values(n).forEach(walk)
    }
  }
  walk(json)
  onTree?.(json)
  return JSON.stringify(json)
}

const replacing =
  (list: Replacement[]): Transform =>
  (value) => {
    const next = mapText(value, (text) => list.reduce((acc, [from, to]) => (acc.includes(to) ? acc : acc.split(from).join(to)), text))
    return next
  }

const nodeText = (n: unknown): string => {
  if (!n || typeof n !== 'object') return ''
  const o = n as Record<string, unknown>
  if (typeof o.text === 'string') return o.text
  return Array.isArray(o.children) ? o.children.map(nodeText).join('') : ''
}

/** Usuwa z listy pozycje zaczynające się od podanego słowa i numeruje pozostałe od nowa. */
const dropListItem = (word: string): Transform => (value) =>
  mapText(
    value,
    (t) => t,
    (root) => {
      const walk = (node: unknown): void => {
        if (Array.isArray(node)) return node.forEach(walk)
        if (!node || typeof node !== 'object') return
        const n = node as Record<string, unknown>
        if (n.type === 'list' && Array.isArray(n.children)) {
          n.children = n.children.filter((c) => !(c && (c as Record<string, unknown>).type === 'listitem' && nodeText(c).startsWith(word)))
          ;(n.children as Record<string, unknown>[]).forEach((c, i) => {
            if (c.type === 'listitem') c.value = i + 1
          })
        }
        Object.values(n).forEach(walk)
      }
      walk(root)
    },
  )

/** Zmienia pole EN w tabeli tłumaczeń tylko wtedy, gdy transformacja coś zmienia i pole zawiera podany fragment. */
async function fix(db: Db, table: string, column: string, needle: string, transform: Transform) {
  const exists = await rows(db, sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = ${table}`)
  if (!exists.length) return
  const found = await rows(db, sql.raw(`SELECT id, \`${column}\` AS v FROM \`${table}\` WHERE _locale = 'en' AND \`${column}\` LIKE ${quote(`%${needle.replace(/[%_]/g, '')}%`)}`))
  for (const r of found) {
    const before = String(r.v)
    const after = transform(before)
    if (after !== before) await db.run(sql.raw(`UPDATE \`${table}\` SET \`${column}\` = ${quote(after)} WHERE id = ${typeof r.id === 'number' ? r.id : quote(String(r.id))}`))
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const published = { pages: 'pages', blocks: 'pages_blocks', intro: 'intro', seo: 'seo_description' }
  const versions = { pages: '_pages_v', blocks: '_pages_v_blocks', intro: 'version_intro', seo: 'version_seo_description' }

  for (const t of [published, versions]) {
    // 1. Sauna i bania
    await fix(db, `${t.pages}_locales`, t.intro, 'wooden tub of hot water heated by a wood fire', replacing([
      [
        'a wooden tub of hot water heated by a wood fire. Every house here has its own,',
        'a wooden tub of hot water, most often heated by a wood fire. Ours is heated ecologically, by a heat pump and with jacuzzi jets as well. Every house has its own,',
      ],
    ]))
    await fix(db, `${t.pages}_locales`, t.seo, 'wood-fired hot tub', replacing([['and a wood-fired hot tub on', 'and a hot tub with jacuzzi on']]))

    // 2. Strona główna
    await fix(db, `${t.blocks}_intro_locales`, 'body', 'Belianske Tatras in the east', replacing([
      ['from the towering Belianske Tatras in the east to the edge of the Western Tatras', 'from the towering Belianske Tatras to Osobita at the edge of the Western Tatras'],
    ]))
    await fix(db, `${t.blocks}_house_inside_rooms_locales`, 'text', 'an outdoor hot tub', replacing([['On the terrace, an outdoor hot tub.', 'On the terrace, a hot tub with jacuzzi.']]))
    const scenes = `${t.blocks}_day_in_settlement_scenes_locales`
    const hasScenes = await rows(db, sql`SELECT name FROM sqlite_master WHERE type = 'table' AND name = ${scenes}`)
    if (hasScenes.length) await db.run(sql.raw(`UPDATE \`${scenes}\` SET title = 'Evening' WHERE _locale = 'en' AND title = 'Night' AND text LIKE 'A fire in the hearth%'`))

    // 3. Góralszczyzna dziś
    await fix(db, `${t.blocks}_story_locales`, 'body', 'and do it today, every day', replacing([['the way their grandparents did, and do it today, every day.', 'the way their grandparents did.']]))
    await fix(db, `${t.blocks}_story_locales`, 'body', 'wandering Carpathian shepherds', dropListItem('Wołosi'))

    // 4. Polityka prywatności
    await fix(db, `${t.blocks}_rich_text_locales`, 'body', 'become time-barred', replacing([
      ['then until claims become time-barred', 'then until claims become time-barred (usually 6 years, shorter for claims arising from the rental)'],
    ]))
  }
}

export async function down({ db: _db }: MigrateDownArgs): Promise<void> {
  // Poprawek tekstów nie cofamy: poprzednie brzmienie jest w historii wersji wpisu w panelu.
}
