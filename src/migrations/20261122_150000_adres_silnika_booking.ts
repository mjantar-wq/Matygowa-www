import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * Adres silnika rezerwacji (Ustawienia strony → Rezerwacje → „Adres silnika IceColdRes”), 22.11.2026, Michał:
 * przyciski „Rezerwuj” i ramka kalendarza mają prowadzić na https://booking.matygowaosada.pl, nie na techniczny
 * icecoldres.audiowizard.pl (adres API, zdjęć i integracji; zostaje w ICECOLDRES_API_URL). Żywe dane z panelu:
 * podmieniamy tylko dotychczasowy domyślny adres (albo pusty), więc inny adres wpisany ręcznie zostaje.
 */
const OLD = 'https://icecoldres.audiowizard.pl'
const NEW = 'https://booking.matygowaosada.pl'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(
    sql`UPDATE \`settings\` SET \`icecoldres_url\` = ${NEW}, \`updated_at\` = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE \`icecoldres_url\` IS NULL OR \`icecoldres_url\` = '' OR \`icecoldres_url\` = ${OLD}`,
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.run(sql`UPDATE \`settings\` SET \`icecoldres_url\` = ${OLD}, \`updated_at\` = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE \`icecoldres_url\` = ${NEW}`)
}
