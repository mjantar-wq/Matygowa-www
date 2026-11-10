import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'
import { touchPages } from '../lib/touch-pages'

/**
 * Przewodnik gościa (FAQ): angielska wersja zgodna z aktualną polską z panelu. Różniły się dwie odpowiedzi:
 * zwierzęta (PL: „tylko po wcześniejszym uzgodnieniu”) i małe dzieci (PL: akcesoria dla niemowląt).
 * Podmieniamy tylko dokładne dotychczasowe brzmienie EN (tekst zmieniony w panelu zostaje nietknięty),
 * w treści opublikowanej i w wersjach. Polskie teksty bez zmian. Bez LIKE ... ESCAPE (D1 go nie obsługuje).
 */
const REPLACE: [string, string][] = [
  [
    'Yes, dogs and cats by prior arrangement.',
    'Yes, but only by prior arrangement.',
  ],
  [
    'Let us know in advance and we will get the house ready.',
    'Let us know in advance and we will prepare baby essentials for you, such as a high chair, a toilet seat reducer and more.',
  ],
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of ['pages_blocks_faq_items_locales', '_pages_v_blocks_faq_items_locales']) {
    const t = sql.raw(`\`${table}\``)
    for (const [from, to] of REPLACE) {
      await db.run(
        sql`UPDATE ${t} SET \`answer\` = replace(\`answer\`, ${from}, ${to}) WHERE \`_locale\` = 'en' AND instr(\`answer\`, ${from}) > 0;`,
      )
    }
  }
  await touchPages(db)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  void db
}
