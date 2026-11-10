import { sql } from '@payloadcms/db-d1-sqlite'

type Db = { run: (q: ReturnType<typeof sql>) => Promise<unknown> }

/**
 * Migracja, która zmienia treść stron SQL-em, musi to wywołać na końcu.
 *
 * Panel Payload ostrzega o nieaktualnej karcie (okno „Dokument zmienił się, odśwież”) tylko wtedy, gdy zmieniła się
 * data aktualizacji dokumentu. Zmiana SQL-em jej nie rusza, więc karta otwarta przed migracją zapisywała stare
 * wartości bez ostrzeżenia i cofała migrację (10.11.2026: licznik „942 m n.p.m.” i hasło pór roku).
 * Podbijamy datę strony i jej najnowszej wersji (panel porównuje datę najnowszej wersji).
 */
export async function touchPages(db: Db): Promise<void> {
  const now = sql`strftime('%Y-%m-%dT%H:%M:%fZ', 'now')`
  await db.run(sql`UPDATE \`pages\` SET \`updated_at\` = ${now}`)
  await db.run(sql`UPDATE \`_pages_v\` SET \`version_updated_at\` = ${now}, \`updated_at\` = ${now} WHERE \`latest\` = 1`)
}
