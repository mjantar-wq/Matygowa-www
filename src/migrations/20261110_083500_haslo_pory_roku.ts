import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

// Nowe hasło sekcji zima/lato na stronie głównej (Michał, 10.11.2026). Zmiana tylko tam, gdzie hasło nadal
// jest dawnym domyślnym: treść zmieniona w panelu zostaje nietknięta.
const HEADINGS = {
  pl: ['Dwie pory roku, ten sam widok', 'Widok, który możesz odkrywać na nowo o każdej porze roku'],
  en: ['Two seasons, the same view', 'A view you can discover anew in every season'],
} as const

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  for (const table of ['pages_blocks_seasons_locales', '_pages_v_blocks_seasons_locales']) {
    for (const locale of ['pl', 'en'] as const) {
      const [from, to] = HEADINGS[locale]
      await db.run(sql`UPDATE ${sql.raw(`\`${table}\``)} SET heading = ${to} WHERE _locale = ${locale} AND heading = ${from};`)
    }
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  for (const table of ['pages_blocks_seasons_locales', '_pages_v_blocks_seasons_locales']) {
    for (const locale of ['pl', 'en'] as const) {
      const [from, to] = HEADINGS[locale]
      await db.run(sql`UPDATE ${sql.raw(`\`${table}\``)} SET heading = ${from} WHERE _locale = ${locale} AND heading = ${to};`)
    }
  }
}
