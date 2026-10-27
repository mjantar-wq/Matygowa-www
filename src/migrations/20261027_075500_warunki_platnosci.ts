import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

// Przewodnik, „Jak wygląda płatność i rezygnacja?” (Michał, 27.10.2026): tylko pełny opis warunków z IceColdRes
// i dopisek, że warunki mogą się różnić między ofertami; bez skrótu z zaliczką i dopłatą, który go dublował.
// Podmiana tylko tekstu startowego, więc odpowiedź zmieniona już w panelu zostaje. Te same zdania są w content/pages/przewodnik.json.
const ANSWERS: [old: string, next: string][] = [
  [
    'Przy rezerwacji wpłacacie zaliczkę {deposit}, a resztę na {balance} dni przed przyjazdem. Rezygnacja jest bezpłatna do {freeCancellation} dni przed przyjazdem. Warunki mogą się różnić między ofertami, pełny opis: {terms}',
    '{terms} Warunki mogą się różnić między ofertami.',
  ],
  [
    'You pay a deposit of {deposit} when booking and the balance {balance} days before arrival. Cancellation is free up to {freeCancellation} days before arrival. Terms may differ between offers; full details: {terms}',
    '{terms} Terms may differ between offers.',
  ],
]

async function swap(db: MigrateUpArgs['db'], pairs: [from: string, to: string][]) {
  for (const [from, to] of pairs) {
    await db.run(sql`UPDATE \`pages_blocks_faq_items_locales\` SET \`answer\` = replace(\`answer\`, ${from}, ${to}) WHERE instr(\`answer\`, ${from}) > 0;`)
    // wersje w panelu: inaczej formularz pokazałby stary tekst i zapis by go przywrócił
    await db.run(sql`UPDATE \`_pages_v_blocks_faq_items_locales\` SET \`answer\` = replace(\`answer\`, ${from}, ${to}) WHERE instr(\`answer\`, ${from}) > 0;`)
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await swap(db, ANSWERS)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await swap(db, ANSWERS.map(([old, next]) => [next, old]))
}
