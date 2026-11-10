import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'
import { touchPages } from '../lib/touch-pages'

/**
 * Strona „Osada”: angielskie opisy bani i sauny zgodne z polskimi po poprawkach z panelu (Michał, 10.11.2026).
 * Zmiana idzie na ŻYWYCH danych i dotyczy tylko pól EN (_locale = 'en'). Polskich tekstów nie ruszamy.
 * Pole jest poprawiane tylko wtedy, gdy stoi w nim dokładnie dotychczasowy angielski tekst (jeśli ktoś zmienił je w panelu, zostaje).
 * Dotyczy opublikowanej treści i najnowszej wersji w panelu, potem podbijamy daty (touchPages).
 */

const para = (children: unknown[]) => ({
  children,
  direction: null as string | null,
  format: '',
  indent: 0,
  type: 'paragraph',
  version: 1,
  textFormat: 0,
  textStyle: '',
})
const text = (t: string) => ({ detail: 0, format: 0, mode: 'normal', style: '', text: t, type: 'text', version: 1 })
const body = (children: unknown[]) =>
  JSON.stringify({ root: { children: [para(children)], direction: null as string | null, format: '', indent: 0, type: 'root', version: 1 } })

// Drugie zdanie zależy od tego, czy migracja „sauna_bania_platne” (140700) już przepisała cennik: łączymy oba warianty.
const PAID = 'charged in addition to your stay and arranged with us beforehand'
const BANIA_NEEDLE = 'A session lasts 4 hours and costs 150 PLN'
const SAUNA_NEEDLE = 'A private sauna in every house.'

const baniaBody = (paid: boolean) =>
  body([
    text(
      'In Podhale, a bania is a wooden tub of hot water, most often heated by a wood fire. Ours additionally has jacuzzi jets and is heated ecologically, by a heat pump. Every house has its own, on the terrace, with a view of the Tatras.',
    ),
    { type: 'linebreak', version: 1 },
    text(
      `A session lasts 4 hours and costs 150 PLN${paid ? `, ${PAID}` : ''}. It takes several hours to heat the water, so please book the hot tub by 8 pm the day before, when you book your stay or later in My Booking.`,
    ),
  ])

const saunaBody = (paid: boolean) =>
  body([
    text(
      `A private Finnish sauna in every house. Set the temperature to your liking, and by pouring water over the stones you will only then really heat up the atmosphere. ${
        paid ? `One hour costs 50 PLN, ${PAID}.` : 'The first session of the day (1 hour) is included in your stay; each further session costs 50 PLN.'
      }`,
    ),
  ])

export async function up({ db }: MigrateUpArgs): Promise<void> {
  const q = (s: string) => `'${s.replace(/'/g, "''")}'`
  for (const p of ['pages', '_pages_v']) {
    const story = `${p}_blocks_story`
    const pageScope = `SELECT id FROM \`${story}\` WHERE _parent_id IN (SELECT id FROM \`${p === 'pages' ? 'pages' : '_pages_v'}\` WHERE ${p === 'pages' ? `slug = 'settlement'` : `latest = 1 AND parent_id = (SELECT id FROM pages WHERE slug = 'settlement')`})`
    for (const [needle, make] of [
      [BANIA_NEEDLE, baniaBody],
      [SAUNA_NEEDLE, saunaBody],
    ] as const) {
      const found = (await (db as unknown as { all: (q: unknown) => Promise<{ id: number; body: string }[]> }).all(
        sql.raw(
          `SELECT id, body FROM \`${story}_locales\` WHERE _locale = 'en' AND instr(body, ${q(needle)}) > 0 AND instr(body, 'Finnish') = 0 AND instr(body, 'In Podhale') = 0 AND _parent_id IN (${pageScope})`,
        ),
      )) ?? []
      for (const r of found) {
        await db.run(sql.raw(`UPDATE \`${story}_locales\` SET body = ${q(make(r.body.includes(PAID)))} WHERE id = ${Number(r.id)}`))
      }
    }
  }
  await touchPages(db)
}

export async function down({ db: _db }: MigrateDownArgs): Promise<void> {
  // Poprzednie brzmienie jest w historii wersji strony w panelu.
}
