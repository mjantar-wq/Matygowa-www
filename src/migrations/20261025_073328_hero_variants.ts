import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_blocks_hero_variants\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_variants_order_idx\` ON \`pages_blocks_hero_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_variants_parent_id_idx\` ON \`pages_blocks_hero_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_variants_image_idx\` ON \`pages_blocks_hero_variants\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_variants_video_idx\` ON \`pages_blocks_hero_variants\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_variants_video_portrait_idx\` ON \`pages_blocks_hero_variants\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hero_variants\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_variants_order_idx\` ON \`_pages_v_blocks_hero_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_variants_parent_id_idx\` ON \`_pages_v_blocks_hero_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_variants_image_idx\` ON \`_pages_v_blocks_hero_variants\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_variants_video_idx\` ON \`_pages_v_blocks_hero_variants\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_variants_video_portrait_idx\` ON \`_pages_v_blocks_hero_variants\` (\`video_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hero\` ADD \`video_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_video_portrait_idx\` ON \`pages_blocks_hero\` (\`video_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hero\` ADD \`video_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_video_portrait_idx\` ON \`_pages_v_blocks_hero\` (\`video_portrait_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_blocks_hero_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero_variants\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`video_id\` integer,
  	\`show_booking_bar\` integer DEFAULT true,
  	\`anchor\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_hero\`("_order", "_parent_id", "_path", "id", "image_id", "video_id", "show_booking_bar", "anchor", "block_name") SELECT "_order", "_parent_id", "_path", "id", "image_id", "video_id", "show_booking_bar", "anchor", "block_name" FROM \`pages_blocks_hero\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hero\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_hero\` RENAME TO \`pages_blocks_hero\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_order_idx\` ON \`pages_blocks_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_parent_id_idx\` ON \`pages_blocks_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_path_idx\` ON \`pages_blocks_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_image_idx\` ON \`pages_blocks_hero\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_video_idx\` ON \`pages_blocks_hero\` (\`video_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_hero\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`video_id\` integer,
  	\`show_booking_bar\` integer DEFAULT true,
  	\`anchor\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`video_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_hero\`("_order", "_parent_id", "_path", "id", "image_id", "video_id", "show_booking_bar", "anchor", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "image_id", "video_id", "show_booking_bar", "anchor", "_uuid", "block_name" FROM \`_pages_v_blocks_hero\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_hero\` RENAME TO \`_pages_v_blocks_hero\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_order_idx\` ON \`_pages_v_blocks_hero\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_parent_id_idx\` ON \`_pages_v_blocks_hero\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_path_idx\` ON \`_pages_v_blocks_hero\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_image_idx\` ON \`_pages_v_blocks_hero\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_video_idx\` ON \`_pages_v_blocks_hero\` (\`video_id\`);`)
}
