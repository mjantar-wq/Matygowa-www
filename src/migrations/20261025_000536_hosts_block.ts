import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_blocks_hosts_people\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`photo_id\` integer,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_hosts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_people_order_idx\` ON \`pages_blocks_hosts_people\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_people_parent_id_idx\` ON \`pages_blocks_hosts_people\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_people_photo_idx\` ON \`pages_blocks_hosts_people\` (\`photo_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hosts_people_locales\` (
  	\`role\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_hosts_people\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_hosts_people_locales_locale_parent_id_unique\` ON \`pages_blocks_hosts_people_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_people_locales_parent_id_idx\` ON \`pages_blocks_hosts_people_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hosts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`anchor\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_order_idx\` ON \`pages_blocks_hosts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_parent_id_idx\` ON \`pages_blocks_hosts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_path_idx\` ON \`pages_blocks_hosts\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hosts_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_hosts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_hosts_locales_locale_parent_id_unique\` ON \`pages_blocks_hosts_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_locales_parent_id_idx\` ON \`pages_blocks_hosts_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hosts_people\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`photo_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`photo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_hosts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_people_order_idx\` ON \`_pages_v_blocks_hosts_people\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_people_parent_id_idx\` ON \`_pages_v_blocks_hosts_people\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_people_photo_idx\` ON \`_pages_v_blocks_hosts_people\` (\`photo_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hosts_people_locales\` (
  	\`role\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_hosts_people\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_hosts_people_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_hosts_people_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_people_locales_parent_id_idx\` ON \`_pages_v_blocks_hosts_people_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hosts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`anchor\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_order_idx\` ON \`_pages_v_blocks_hosts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_parent_id_idx\` ON \`_pages_v_blocks_hosts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_path_idx\` ON \`_pages_v_blocks_hosts\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hosts_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_hosts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_hosts_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_hosts_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_locales_parent_id_idx\` ON \`_pages_v_blocks_hosts_locales\` (\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_blocks_hosts_people\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hosts_people_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hosts\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hosts_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hosts_people\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hosts_people_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hosts\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hosts_locales\`;`)
}
