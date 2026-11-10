import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

// Sekcja pór roku na stronie głównej: z dwóch (zima, lato) na cztery (Michał, 10.11.2026).
// Treści z panelu zostają nietknięte: nowe pola dostają teksty tylko tam, gdzie są puste, a hasło sekcji
// zmienia się tylko wtedy, gdy nadal jest dawnym, domyślnym „Dwie pory roku, ten sam widok”.
const TEXTS = {
  pl: {
    heading: ['Dwie pory roku, ten sam widok', 'Widok, który możesz odkrywać na nowo o każdej porze roku'],
    spring: ['Wiosna', 'Wiosną w dolinach kwitną krokusy, a szczyty jeszcze bieleją. Cisza przed sezonem, pierwsze spacery po suchych szlakach, poranna kawa na tarasie.'],
    autumn: ['Jesień', 'Jesienią Czerwone Wierchy rdzewieją, a poranki pachną dymem z kominów. Grzyby w lesie, szlaki bez tłumów, wieczorem sauna i bania.'],
  },
  en: {
    heading: ['Two seasons, the same view', 'A view you can discover anew in every season'],
    spring: ['Spring', 'In spring crocuses bloom in the valleys while the peaks are still white. Quiet before the season, first walks on dry trails, morning coffee on the terrace.'],
    autumn: ['Autumn', 'In autumn the Red Peaks turn rust-red and the mornings smell of chimney smoke. Mushrooms in the forest, trails without the crowds, and in the evening the sauna and hot tub.'],
  },
} as const

const TABLES = ['pages_blocks_seasons_locales', '_pages_v_blocks_seasons_locales']

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  for (const table of TABLES) {
    const t = sql.raw(`\`${table}\``)
    await db.run(sql`ALTER TABLE ${t} ADD \`spring_title\` text;`)
    await db.run(sql`ALTER TABLE ${t} ADD \`spring_text\` text;`)
    await db.run(sql`ALTER TABLE ${t} ADD \`autumn_title\` text;`)
    await db.run(sql`ALTER TABLE ${t} ADD \`autumn_text\` text;`)
    for (const locale of ['pl', 'en'] as const) {
      const x = TEXTS[locale]
      await db.run(
        sql`UPDATE ${t} SET spring_title = ${x.spring[0]}, spring_text = ${x.spring[1]}, autumn_title = ${x.autumn[0]}, autumn_text = ${x.autumn[1]} WHERE _locale = ${locale};`,
      )
      await db.run(sql`UPDATE ${t} SET heading = ${x.heading[1]} WHERE _locale = ${locale} AND heading = ${x.heading[0]};`)
    }
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  for (const table of TABLES) {
    const t = sql.raw(`\`${table}\``)
    for (const col of ['spring_title', 'spring_text', 'autumn_title', 'autumn_text']) await db.run(sql`ALTER TABLE ${t} DROP COLUMN ${sql.raw(`\`${col}\``)};`)
  }
}
