import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

// Nowe hasło sekcji zima/lato na stronie głównej, wiosna dopisana do zimy, jesień do lata (Michał, 10.11.2026).
// Zmiana tylko tam, gdzie pole nadal ma dawną treść domyślną: treść zmieniona w panelu zostaje nietknięta.
const HEADINGS = {
  pl: ['Dwie pory roku, ten sam widok', 'Widok, który możesz odkrywać na nowo o każdej porze roku'],
  en: ['Two seasons, the same view', 'A view you can discover anew in every season'],
} as const

const TEXTS = {
  winter: {
    pl: ["Zimą Gliczarów jest biały i cichy. Narty kilka minut stąd, kulig, termy, a wieczorem bania w śniegu.", "Zimą Gliczarów jest biały i cichy. Narty kilka minut stąd, kulig, termy, a wieczorem bania w śniegu. Wiosną z dolin schodzi śnieg, a szczyty jeszcze bieleją: cisza przed sezonem i pierwsze krokusy."],
    en: ["In winter Gliczarów is white and quiet. Ski slopes a few minutes away, sleigh rides, thermal pools, and in the evening a hot tub in the snow.", "In winter Gliczarów is white and quiet. Ski slopes a few minutes away, sleigh rides, thermal pools, and in the evening a hot tub in the snow. In spring the snow leaves the valleys while the peaks stay white: quiet before the season and the first crocuses."],
  },
  summer: {
    pl: ["Latem łąki pachną sianem, a szlaki zaczynają się niedaleko. Rowery, spływ Dunajcem, długie wieczory na tarasie.", "Latem łąki pachną sianem, a szlaki zaczynają się niedaleko. Rowery, spływ Dunajcem, długie wieczory na tarasie. Jesienią Czerwone Wierchy rdzewieją, a poranki pachną dymem z kominów."],
    en: ["In summer the meadows smell of hay and the trails start close by. Bikes, rafting on the Dunajec, long evenings on the terrace.", "In summer the meadows smell of hay and the trails start close by. Bikes, rafting on the Dunajec, long evenings on the terrace. In autumn the Red Peaks turn rust-red and the mornings smell of chimney smoke."],
  },
} as const

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  for (const table of ['pages_blocks_seasons_locales', '_pages_v_blocks_seasons_locales']) {
    for (const locale of ['pl', 'en'] as const) {
      const [from, to] = HEADINGS[locale]
      await db.run(sql`UPDATE ${sql.raw(`\`${table}\``)} SET heading = ${to} WHERE _locale = ${locale} AND heading = ${from};`)
      for (const season of ['winter', 'summer'] as const) {
        const [old, next] = TEXTS[season][locale]
        await db.run(sql`UPDATE ${sql.raw(`\`${table}\``)} SET ${sql.raw(`${season}_text`)} = ${next} WHERE _locale = ${locale} AND ${sql.raw(`${season}_text`)} = ${old};`)
      }
    }
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  for (const table of ['pages_blocks_seasons_locales', '_pages_v_blocks_seasons_locales']) {
    for (const locale of ['pl', 'en'] as const) {
      const [from, to] = HEADINGS[locale]
      await db.run(sql`UPDATE ${sql.raw(`\`${table}\``)} SET heading = ${from} WHERE _locale = ${locale} AND heading = ${to};`)
      for (const season of ['winter', 'summer'] as const) {
        const [old, next] = TEXTS[season][locale]
        await db.run(sql`UPDATE ${sql.raw(`\`${table}\``)} SET ${sql.raw(`${season}_text`)} = ${old} WHERE _locale = ${locale} AND ${sql.raw(`${season}_text`)} = ${next};`)
      }
    }
  }
}
