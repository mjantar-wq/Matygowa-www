import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'
import { touchPages } from '../lib/touch-pages'

/**
 * Sauna i bania na stronie Osada: ceny zgodne z obecną stroną matygowaosada.pl (sauna 50 zł/h i bania 150 zł/4 h są
 * dodatkowo płatne, po uzgodnieniu; sesja sauny nie jest w cenie pobytu). Zamiana tylko tam, gdzie w tekście stoi
 * dokładnie stare zdanie (treść zmieniona w panelu zostaje). Dotyczy bloków „Historia” z kart Sauna i Bania:
 * treści opublikowanej i najnowszej wersji. Bez importu plików.
 */
const SWAPS: [string, string][] = [
  ['Pierwsza sesja dnia (1 godzina) jest w cenie pobytu, każda kolejna kosztuje 50 zł.', 'Godzina korzystania kosztuje 50 zł, dodatkowo płatna i po uzgodnieniu z nami.'],
  ['The first session of the day (1 hour) is included in your stay; each further session costs 50 PLN.', 'One hour costs 50 PLN, charged in addition to your stay and arranged with us beforehand.'],
  ['Sesja trwa 4 godziny i kosztuje 150 zł. Wodę', 'Sesja trwa 4 godziny i kosztuje 150 zł, dodatkowo płatna i po uzgodnieniu z nami. Wodę'],
  ['A session lasts 4 hours and costs 150 PLN. It takes', 'A session lasts 4 hours and costs 150 PLN, charged in addition to your stay and arranged with us beforehand. It takes'],
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of ['pages_blocks_story_locales', '_pages_v_blocks_story_locales']) {
    const t = sql.raw(`\`${table}\``)
    const latest = table.startsWith('_pages_v')
      ? sql` AND \`_parent_id\` IN (SELECT s.id FROM \`_pages_v_blocks_story\` s WHERE s._parent_id IN (SELECT id FROM \`_pages_v\` WHERE \`latest\` = 1))`
      : sql``
    for (const [from, to] of SWAPS) {
      await db.run(sql`UPDATE ${t} SET \`body\` = REPLACE(\`body\`, ${from}, ${to}) WHERE \`body\` LIKE ${'%' + from + '%'}${latest};`)
    }
  }
  await touchPages(db)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  void db
}
