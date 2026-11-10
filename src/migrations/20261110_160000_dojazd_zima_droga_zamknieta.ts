import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'
import { touchPages } from '../lib/touch-pages'

/**
 * FAQ Przewodnika „Jak dojechać zimą?” (zasila też opis pod przyciskiem trasy na stronie Kontakt): dopisujemy
 * ostrzeżenie, że przy utrzymującej się pokrywie śnieżnej droga od Gliczarowa Dolnego jest zamknięta.
 * Tylko dopisanie na końcu zdania, które stoi w bazie dokładnie w starym brzmieniu (treść zmieniona w panelu
 * zostaje nietknięta), w treści opublikowanej i we wszystkich wersjach. Bez importu plików.
 */
const ADD: [string, string][] = [
  [
    'zawsze zaciągajcie hamulec postojowy.',
    ' Uwaga: przy utrzymującej się pokrywie śnieżnej droga od Gliczarowa Dolnego jest zamknięta, więc uwzględnijcie to, planując dojazd.',
  ],
  [
    'always apply the handbrake when you park by the house.',
    ' Please note: while snow cover persists, the road from Gliczarów Dolny is closed, so plan your journey accordingly.',
  ],
]

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const table of ['pages_blocks_faq_items_locales', '_pages_v_blocks_faq_items_locales']) {
    const t = sql.raw(`\`${table}\``)
    for (const [end, extra] of ADD) {
      const from = `${end}","type":"text"`
      const to = `${end}${extra}","type":"text"`
      // idempotentnie: pomijamy, gdy ostrzeżenie już jest
      await db.run(
        sql`UPDATE ${t} SET \`answer\` = replace(\`answer\`, ${from}, ${to}) WHERE instr(\`answer\`, ${from}) > 0 AND instr(\`answer\`, ${extra.trim()}) = 0;`,
      )
    }
  }
  await touchPages(db)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  void db
}
