import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`attractions_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`attractions\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`attractions_rels_order_idx\` ON \`attractions_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`attractions_rels_parent_idx\` ON \`attractions_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`attractions_rels_path_idx\` ON \`attractions_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`attractions_rels_media_id_idx\` ON \`attractions_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE TABLE \`_attractions_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`media_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_attractions_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_attractions_v_rels_order_idx\` ON \`_attractions_v_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`_attractions_v_rels_parent_idx\` ON \`_attractions_v_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_attractions_v_rels_path_idx\` ON \`_attractions_v_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`_attractions_v_rels_media_id_idx\` ON \`_attractions_v_rels\` (\`media_id\`);`)
  await db.run(sql`ALTER TABLE \`attractions_locales\` ADD \`place\` text;`)
  await db.run(sql`ALTER TABLE \`_attractions_v_locales\` ADD \`version_place\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`attractions_rels\`;`)
  await db.run(sql`DROP TABLE \`_attractions_v_rels\`;`)
  await db.run(sql`ALTER TABLE \`attractions_locales\` DROP COLUMN \`place\`;`)
  await db.run(sql`ALTER TABLE \`_attractions_v_locales\` DROP COLUMN \`version_place\`;`)
}
