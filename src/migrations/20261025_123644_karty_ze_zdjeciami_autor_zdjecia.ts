import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_blocks_features_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_items_order_idx\` ON \`pages_blocks_features_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_items_parent_id_idx\` ON \`pages_blocks_features_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_items_image_idx\` ON \`pages_blocks_features_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_features_items_locales\` (
  	\`heading\` text,
  	\`body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_features_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_features_items_locales_locale_parent_id_unique\` ON \`pages_blocks_features_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_items_locales_parent_id_idx\` ON \`pages_blocks_features_items_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_features_scene\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	\`image_id\` integer,
  	\`video_id\` integer,
  	\`video_portrait_id\` integer,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`video_portrait_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_scene_order_idx\` ON \`pages_blocks_features_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_scene_parent_id_idx\` ON \`pages_blocks_features_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_scene_image_idx\` ON \`pages_blocks_features_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_scene_video_idx\` ON \`pages_blocks_features_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_scene_video_portrait_idx\` ON \`pages_blocks_features_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_features_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_text_variants_order_idx\` ON \`pages_blocks_features_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_text_variants_parent_id_idx\` ON \`pages_blocks_features_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_features_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_features_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_features_text_variants_locales_locale_parent_id\` ON \`pages_blocks_features_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_text_variants_locales_parent_id_idx\` ON \`pages_blocks_features_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_features\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`anchor\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_order_idx\` ON \`pages_blocks_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_parent_id_idx\` ON \`pages_blocks_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_path_idx\` ON \`pages_blocks_features\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_features_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_features_locales_locale_parent_id_unique\` ON \`pages_blocks_features_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_features_locales_parent_id_idx\` ON \`pages_blocks_features_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_features_items\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_items_order_idx\` ON \`_pages_v_blocks_features_items\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_items_parent_id_idx\` ON \`_pages_v_blocks_features_items\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_items_image_idx\` ON \`_pages_v_blocks_features_items\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_features_items_locales\` (
  	\`heading\` text,
  	\`body\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_features_items\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_features_items_locales_locale_parent_id_uniq\` ON \`_pages_v_blocks_features_items_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_items_locales_parent_id_idx\` ON \`_pages_v_blocks_features_items_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_features_scene\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	\`image_id\` integer,
  	\`video_id\` integer,
  	\`video_portrait_id\` integer,
  	\`_uuid\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`video_portrait_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_scene_order_idx\` ON \`_pages_v_blocks_features_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_scene_parent_id_idx\` ON \`_pages_v_blocks_features_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_scene_image_idx\` ON \`_pages_v_blocks_features_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_scene_video_idx\` ON \`_pages_v_blocks_features_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_scene_video_portrait_idx\` ON \`_pages_v_blocks_features_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_features_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_text_variants_order_idx\` ON \`_pages_v_blocks_features_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_text_variants_parent_id_idx\` ON \`_pages_v_blocks_features_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_features_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_features_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_features_text_variants_locales_locale_parent\` ON \`_pages_v_blocks_features_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_text_variants_locales_parent_id_idx\` ON \`_pages_v_blocks_features_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_features\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_order_idx\` ON \`_pages_v_blocks_features\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_parent_id_idx\` ON \`_pages_v_blocks_features\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_path_idx\` ON \`_pages_v_blocks_features\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_features_locales\` (
  	\`eyebrow\` text,
  	\`heading\` text,
  	\`intro\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_features\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_features_locales_locale_parent_id_unique\` ON \`_pages_v_blocks_features_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_features_locales_parent_id_idx\` ON \`_pages_v_blocks_features_locales\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`credit_author\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`credit_license\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`credit_source\` text;`)
  await db.run(sql`ALTER TABLE \`media\` ADD \`credit_url\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_blocks_features_items\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_features_items_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_features_scene\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_features_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_features_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_features\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_features_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_features_items\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_features_items_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_features_scene\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_features_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_features_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_features\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_features_locales\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`credit_author\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`credit_license\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`credit_source\`;`)
  await db.run(sql`ALTER TABLE \`media\` DROP COLUMN \`credit_url\`;`)
}
