import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

// Pierwszy import przypisał ofercie zdjęcie L25_ (łąka) z offers.json. Własne zdjęcie z panelu ma pierwszeństwo przed
// zdjęciem z IceColdRes, więc to z importu zasłaniało zdjęcie promocji. Czyścimy tylko zdjęcia z importu (L25_*),
// nie te wgrane ręcznie w panelu.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.run(sql`UPDATE \`offers\` SET \`image_id\` = NULL WHERE \`image_id\` IN (SELECT \`id\` FROM \`media\` WHERE \`filename\` LIKE 'L25\_%' ESCAPE '\');`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // zdjęć z importu nie przywracamy: i tak były tylko zastępnikiem
  void db
}
