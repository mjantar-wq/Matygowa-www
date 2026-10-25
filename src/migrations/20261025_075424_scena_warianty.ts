import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_blocks_hero_scene\` (
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
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_scene_order_idx\` ON \`pages_blocks_hero_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_scene_parent_id_idx\` ON \`pages_blocks_hero_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_scene_image_idx\` ON \`pages_blocks_hero_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_scene_video_idx\` ON \`pages_blocks_hero_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_scene_video_portrait_idx\` ON \`pages_blocks_hero_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hero_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_text_variants_order_idx\` ON \`pages_blocks_hero_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_text_variants_parent_id_idx\` ON \`pages_blocks_hero_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hero_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_hero_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_hero_text_variants_locales_locale_parent_id_uni\` ON \`pages_blocks_hero_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_text_variants_locales_parent_id_idx\` ON \`pages_blocks_hero_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_intro_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_intro\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_scene_order_idx\` ON \`pages_blocks_intro_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_scene_parent_id_idx\` ON \`pages_blocks_intro_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_scene_image_idx\` ON \`pages_blocks_intro_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_scene_video_idx\` ON \`pages_blocks_intro_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_scene_video_portrait_idx\` ON \`pages_blocks_intro_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_intro_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_intro\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_text_variants_order_idx\` ON \`pages_blocks_intro_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_text_variants_parent_id_idx\` ON \`pages_blocks_intro_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_intro_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_intro_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_intro_text_variants_locales_locale_parent_id_un\` ON \`pages_blocks_intro_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_text_variants_locales_parent_id_idx\` ON \`pages_blocks_intro_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_peaks_panorama_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_peaks_panorama\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_scene_order_idx\` ON \`pages_blocks_peaks_panorama_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_scene_parent_id_idx\` ON \`pages_blocks_peaks_panorama_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_scene_image_idx\` ON \`pages_blocks_peaks_panorama_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_scene_video_idx\` ON \`pages_blocks_peaks_panorama_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_scene_video_portrait_idx\` ON \`pages_blocks_peaks_panorama_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_peaks_panorama_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_peaks_panorama\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_text_variants_order_idx\` ON \`pages_blocks_peaks_panorama_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_text_variants_parent_id_idx\` ON \`pages_blocks_peaks_panorama_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_peaks_panorama_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_peaks_panorama_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_peaks_panorama_text_variants_locales_locale_par\` ON \`pages_blocks_peaks_panorama_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_text_variants_locales_parent_idx\` ON \`pages_blocks_peaks_panorama_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_day_in_settlement_scenes_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_day_in_settlement_scenes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_scenes_scene_order_idx\` ON \`pages_blocks_day_in_settlement_scenes_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_scenes_scene_parent_id_idx\` ON \`pages_blocks_day_in_settlement_scenes_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_scenes_scene_image_idx\` ON \`pages_blocks_day_in_settlement_scenes_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_scenes_scene_video_idx\` ON \`pages_blocks_day_in_settlement_scenes_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_scenes_scene_video_portra_idx\` ON \`pages_blocks_day_in_settlement_scenes_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_day_in_settlement_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_day_in_settlement\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_scene_order_idx\` ON \`pages_blocks_day_in_settlement_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_scene_parent_id_idx\` ON \`pages_blocks_day_in_settlement_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_scene_image_idx\` ON \`pages_blocks_day_in_settlement_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_scene_video_idx\` ON \`pages_blocks_day_in_settlement_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_scene_video_portrait_idx\` ON \`pages_blocks_day_in_settlement_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_day_in_settlement_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_day_in_settlement\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_text_variants_order_idx\` ON \`pages_blocks_day_in_settlement_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_text_variants_parent_id_idx\` ON \`pages_blocks_day_in_settlement_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_day_in_settlement_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_day_in_settlement_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_day_in_settlement_text_variants_locales_locale_\` ON \`pages_blocks_day_in_settlement_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_text_variants_locales_par_idx\` ON \`pages_blocks_day_in_settlement_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_house_inside_rooms_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_house_inside_rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_rooms_scene_order_idx\` ON \`pages_blocks_house_inside_rooms_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_rooms_scene_parent_id_idx\` ON \`pages_blocks_house_inside_rooms_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_rooms_scene_image_idx\` ON \`pages_blocks_house_inside_rooms_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_rooms_scene_video_idx\` ON \`pages_blocks_house_inside_rooms_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_rooms_scene_video_portrait_idx\` ON \`pages_blocks_house_inside_rooms_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_house_inside_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_house_inside\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_scene_order_idx\` ON \`pages_blocks_house_inside_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_scene_parent_id_idx\` ON \`pages_blocks_house_inside_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_scene_image_idx\` ON \`pages_blocks_house_inside_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_scene_video_idx\` ON \`pages_blocks_house_inside_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_scene_video_portrait_idx\` ON \`pages_blocks_house_inside_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_house_inside_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_house_inside\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_text_variants_order_idx\` ON \`pages_blocks_house_inside_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_text_variants_parent_id_idx\` ON \`pages_blocks_house_inside_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_house_inside_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_house_inside_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_house_inside_text_variants_locales_locale_paren\` ON \`pages_blocks_house_inside_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_text_variants_locales_parent_i_idx\` ON \`pages_blocks_house_inside_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_rituals_steps_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_rituals_steps\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_steps_scene_order_idx\` ON \`pages_blocks_rituals_steps_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_steps_scene_parent_id_idx\` ON \`pages_blocks_rituals_steps_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_steps_scene_image_idx\` ON \`pages_blocks_rituals_steps_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_steps_scene_video_idx\` ON \`pages_blocks_rituals_steps_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_steps_scene_video_portrait_idx\` ON \`pages_blocks_rituals_steps_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_rituals_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_rituals\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_scene_order_idx\` ON \`pages_blocks_rituals_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_scene_parent_id_idx\` ON \`pages_blocks_rituals_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_scene_image_idx\` ON \`pages_blocks_rituals_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_scene_video_idx\` ON \`pages_blocks_rituals_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_scene_video_portrait_idx\` ON \`pages_blocks_rituals_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_rituals_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_rituals\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_text_variants_order_idx\` ON \`pages_blocks_rituals_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_text_variants_parent_id_idx\` ON \`pages_blocks_rituals_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_rituals_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_rituals_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_rituals_text_variants_locales_locale_parent_id_\` ON \`pages_blocks_rituals_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_text_variants_locales_parent_id_idx\` ON \`pages_blocks_rituals_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_seasons_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_seasons\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_scene_order_idx\` ON \`pages_blocks_seasons_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_scene_parent_id_idx\` ON \`pages_blocks_seasons_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_scene_image_idx\` ON \`pages_blocks_seasons_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_scene_video_idx\` ON \`pages_blocks_seasons_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_scene_video_portrait_idx\` ON \`pages_blocks_seasons_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_seasons_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_seasons\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_text_variants_order_idx\` ON \`pages_blocks_seasons_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_text_variants_parent_id_idx\` ON \`pages_blocks_seasons_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_seasons_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_seasons_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_seasons_text_variants_locales_locale_parent_id_\` ON \`pages_blocks_seasons_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_text_variants_locales_parent_id_idx\` ON \`pages_blocks_seasons_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_surroundings_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_surroundings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_surroundings_scene_order_idx\` ON \`pages_blocks_surroundings_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_surroundings_scene_parent_id_idx\` ON \`pages_blocks_surroundings_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_surroundings_scene_image_idx\` ON \`pages_blocks_surroundings_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_surroundings_scene_video_idx\` ON \`pages_blocks_surroundings_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_surroundings_scene_video_portrait_idx\` ON \`pages_blocks_surroundings_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_surroundings_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_surroundings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_surroundings_text_variants_order_idx\` ON \`pages_blocks_surroundings_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_surroundings_text_variants_parent_id_idx\` ON \`pages_blocks_surroundings_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_surroundings_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_surroundings_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_surroundings_text_variants_locales_locale_paren\` ON \`pages_blocks_surroundings_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_surroundings_text_variants_locales_parent_i_idx\` ON \`pages_blocks_surroundings_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_story_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_story\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_scene_order_idx\` ON \`pages_blocks_story_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_scene_parent_id_idx\` ON \`pages_blocks_story_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_scene_image_idx\` ON \`pages_blocks_story_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_scene_video_idx\` ON \`pages_blocks_story_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_scene_video_portrait_idx\` ON \`pages_blocks_story_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_story_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_story\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_text_variants_order_idx\` ON \`pages_blocks_story_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_text_variants_parent_id_idx\` ON \`pages_blocks_story_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_story_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_story_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_story_text_variants_locales_locale_parent_id_un\` ON \`pages_blocks_story_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_text_variants_locales_parent_id_idx\` ON \`pages_blocks_story_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_testimonials_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_scene_order_idx\` ON \`pages_blocks_testimonials_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_scene_parent_id_idx\` ON \`pages_blocks_testimonials_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_scene_image_idx\` ON \`pages_blocks_testimonials_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_scene_video_idx\` ON \`pages_blocks_testimonials_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_scene_video_portrait_idx\` ON \`pages_blocks_testimonials_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_testimonials_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_text_variants_order_idx\` ON \`pages_blocks_testimonials_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_text_variants_parent_id_idx\` ON \`pages_blocks_testimonials_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_testimonials_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_testimonials_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_testimonials_text_variants_locales_locale_paren\` ON \`pages_blocks_testimonials_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_text_variants_locales_parent_i_idx\` ON \`pages_blocks_testimonials_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_offers_news_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_offers_news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_offers_news_scene_order_idx\` ON \`pages_blocks_offers_news_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_offers_news_scene_parent_id_idx\` ON \`pages_blocks_offers_news_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_offers_news_scene_image_idx\` ON \`pages_blocks_offers_news_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_offers_news_scene_video_idx\` ON \`pages_blocks_offers_news_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_offers_news_scene_video_portrait_idx\` ON \`pages_blocks_offers_news_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_offers_news_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_offers_news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_offers_news_text_variants_order_idx\` ON \`pages_blocks_offers_news_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_offers_news_text_variants_parent_id_idx\` ON \`pages_blocks_offers_news_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_offers_news_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_offers_news_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_offers_news_text_variants_locales_locale_parent\` ON \`pages_blocks_offers_news_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_offers_news_text_variants_locales_parent_id_idx\` ON \`pages_blocks_offers_news_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_booking_invite_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_booking_invite\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_invite_scene_order_idx\` ON \`pages_blocks_booking_invite_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_invite_scene_parent_id_idx\` ON \`pages_blocks_booking_invite_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_invite_scene_image_idx\` ON \`pages_blocks_booking_invite_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_invite_scene_video_idx\` ON \`pages_blocks_booking_invite_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_invite_scene_video_portrait_idx\` ON \`pages_blocks_booking_invite_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_booking_invite_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_booking_invite\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_invite_text_variants_order_idx\` ON \`pages_blocks_booking_invite_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_invite_text_variants_parent_id_idx\` ON \`pages_blocks_booking_invite_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_booking_invite_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_booking_invite_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_booking_invite_text_variants_locales_locale_par\` ON \`pages_blocks_booking_invite_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_invite_text_variants_locales_parent_idx\` ON \`pages_blocks_booking_invite_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_gallery_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_scene_order_idx\` ON \`pages_blocks_gallery_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_scene_parent_id_idx\` ON \`pages_blocks_gallery_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_scene_image_idx\` ON \`pages_blocks_gallery_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_scene_video_idx\` ON \`pages_blocks_gallery_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_scene_video_portrait_idx\` ON \`pages_blocks_gallery_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_gallery_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_text_variants_order_idx\` ON \`pages_blocks_gallery_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_text_variants_parent_id_idx\` ON \`pages_blocks_gallery_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_gallery_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_gallery_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_gallery_text_variants_locales_locale_parent_id_\` ON \`pages_blocks_gallery_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_text_variants_locales_parent_id_idx\` ON \`pages_blocks_gallery_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_faq_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_scene_order_idx\` ON \`pages_blocks_faq_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_scene_parent_id_idx\` ON \`pages_blocks_faq_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_scene_image_idx\` ON \`pages_blocks_faq_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_scene_video_idx\` ON \`pages_blocks_faq_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_scene_video_portrait_idx\` ON \`pages_blocks_faq_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_faq_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_text_variants_order_idx\` ON \`pages_blocks_faq_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_text_variants_parent_id_idx\` ON \`pages_blocks_faq_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_faq_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_faq_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_faq_text_variants_locales_locale_parent_id_uniq\` ON \`pages_blocks_faq_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_text_variants_locales_parent_id_idx\` ON \`pages_blocks_faq_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_rich_text_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_rich_text\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_scene_order_idx\` ON \`pages_blocks_rich_text_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_scene_parent_id_idx\` ON \`pages_blocks_rich_text_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_scene_image_idx\` ON \`pages_blocks_rich_text_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_scene_video_idx\` ON \`pages_blocks_rich_text_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_scene_video_portrait_idx\` ON \`pages_blocks_rich_text_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_rich_text_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_rich_text\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_text_variants_order_idx\` ON \`pages_blocks_rich_text_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_text_variants_parent_id_idx\` ON \`pages_blocks_rich_text_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_rich_text_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_rich_text_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_rich_text_text_variants_locales_locale_parent_i\` ON \`pages_blocks_rich_text_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_text_variants_locales_parent_id_idx\` ON \`pages_blocks_rich_text_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hosts_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_hosts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_scene_order_idx\` ON \`pages_blocks_hosts_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_scene_parent_id_idx\` ON \`pages_blocks_hosts_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_scene_image_idx\` ON \`pages_blocks_hosts_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_scene_video_idx\` ON \`pages_blocks_hosts_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_scene_video_portrait_idx\` ON \`pages_blocks_hosts_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hosts_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_hosts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_text_variants_order_idx\` ON \`pages_blocks_hosts_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_text_variants_parent_id_idx\` ON \`pages_blocks_hosts_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages_blocks_hosts_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages_blocks_hosts_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_blocks_hosts_text_variants_locales_locale_parent_id_un\` ON \`pages_blocks_hosts_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_text_variants_locales_parent_id_idx\` ON \`pages_blocks_hosts_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hero_scene\` (
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
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_scene_order_idx\` ON \`_pages_v_blocks_hero_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_scene_parent_id_idx\` ON \`_pages_v_blocks_hero_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_scene_image_idx\` ON \`_pages_v_blocks_hero_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_scene_video_idx\` ON \`_pages_v_blocks_hero_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_scene_video_portrait_idx\` ON \`_pages_v_blocks_hero_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hero_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_hero\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_text_variants_order_idx\` ON \`_pages_v_blocks_hero_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_text_variants_parent_id_idx\` ON \`_pages_v_blocks_hero_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hero_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_hero_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_hero_text_variants_locales_locale_parent_id_\` ON \`_pages_v_blocks_hero_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_text_variants_locales_parent_id_idx\` ON \`_pages_v_blocks_hero_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_intro_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_intro\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_intro_scene_order_idx\` ON \`_pages_v_blocks_intro_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_intro_scene_parent_id_idx\` ON \`_pages_v_blocks_intro_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_intro_scene_image_idx\` ON \`_pages_v_blocks_intro_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_intro_scene_video_idx\` ON \`_pages_v_blocks_intro_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_intro_scene_video_portrait_idx\` ON \`_pages_v_blocks_intro_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_intro_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_intro\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_intro_text_variants_order_idx\` ON \`_pages_v_blocks_intro_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_intro_text_variants_parent_id_idx\` ON \`_pages_v_blocks_intro_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_intro_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_intro_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_intro_text_variants_locales_locale_parent_id\` ON \`_pages_v_blocks_intro_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_intro_text_variants_locales_parent_id_idx\` ON \`_pages_v_blocks_intro_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_peaks_panorama_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_peaks_panorama\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_scene_order_idx\` ON \`_pages_v_blocks_peaks_panorama_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_scene_parent_id_idx\` ON \`_pages_v_blocks_peaks_panorama_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_scene_image_idx\` ON \`_pages_v_blocks_peaks_panorama_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_scene_video_idx\` ON \`_pages_v_blocks_peaks_panorama_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_scene_video_portrait_idx\` ON \`_pages_v_blocks_peaks_panorama_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_peaks_panorama_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_peaks_panorama\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_text_variants_order_idx\` ON \`_pages_v_blocks_peaks_panorama_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_text_variants_parent_id_idx\` ON \`_pages_v_blocks_peaks_panorama_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_peaks_panorama_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_peaks_panorama_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_peaks_panorama_text_variants_locales_locale_\` ON \`_pages_v_blocks_peaks_panorama_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_text_variants_locales_par_idx\` ON \`_pages_v_blocks_peaks_panorama_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_day_in_settlement_scenes_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_day_in_settlement_scenes\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_scenes_scene_order_idx\` ON \`_pages_v_blocks_day_in_settlement_scenes_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_scenes_scene_parent_id_idx\` ON \`_pages_v_blocks_day_in_settlement_scenes_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_scenes_scene_image_idx\` ON \`_pages_v_blocks_day_in_settlement_scenes_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_scenes_scene_video_idx\` ON \`_pages_v_blocks_day_in_settlement_scenes_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_scenes_scene_video_por_idx\` ON \`_pages_v_blocks_day_in_settlement_scenes_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_day_in_settlement_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_day_in_settlement\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_scene_order_idx\` ON \`_pages_v_blocks_day_in_settlement_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_scene_parent_id_idx\` ON \`_pages_v_blocks_day_in_settlement_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_scene_image_idx\` ON \`_pages_v_blocks_day_in_settlement_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_scene_video_idx\` ON \`_pages_v_blocks_day_in_settlement_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_scene_video_portrait_idx\` ON \`_pages_v_blocks_day_in_settlement_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_day_in_settlement_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_day_in_settlement\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_text_variants_order_idx\` ON \`_pages_v_blocks_day_in_settlement_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_text_variants_parent_id_idx\` ON \`_pages_v_blocks_day_in_settlement_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_day_in_settlement_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_day_in_settlement_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_day_in_settlement_text_variants_locales_loca\` ON \`_pages_v_blocks_day_in_settlement_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_text_variants_locales__idx\` ON \`_pages_v_blocks_day_in_settlement_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_house_inside_rooms_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_house_inside_rooms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_rooms_scene_order_idx\` ON \`_pages_v_blocks_house_inside_rooms_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_rooms_scene_parent_id_idx\` ON \`_pages_v_blocks_house_inside_rooms_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_rooms_scene_image_idx\` ON \`_pages_v_blocks_house_inside_rooms_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_rooms_scene_video_idx\` ON \`_pages_v_blocks_house_inside_rooms_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_rooms_scene_video_portrait_idx\` ON \`_pages_v_blocks_house_inside_rooms_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_house_inside_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_house_inside\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_scene_order_idx\` ON \`_pages_v_blocks_house_inside_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_scene_parent_id_idx\` ON \`_pages_v_blocks_house_inside_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_scene_image_idx\` ON \`_pages_v_blocks_house_inside_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_scene_video_idx\` ON \`_pages_v_blocks_house_inside_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_scene_video_portrait_idx\` ON \`_pages_v_blocks_house_inside_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_house_inside_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_house_inside\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_text_variants_order_idx\` ON \`_pages_v_blocks_house_inside_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_text_variants_parent_id_idx\` ON \`_pages_v_blocks_house_inside_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_house_inside_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_house_inside_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_house_inside_text_variants_locales_locale_pa\` ON \`_pages_v_blocks_house_inside_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_text_variants_locales_paren_idx\` ON \`_pages_v_blocks_house_inside_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_rituals_steps_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_rituals_steps\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_steps_scene_order_idx\` ON \`_pages_v_blocks_rituals_steps_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_steps_scene_parent_id_idx\` ON \`_pages_v_blocks_rituals_steps_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_steps_scene_image_idx\` ON \`_pages_v_blocks_rituals_steps_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_steps_scene_video_idx\` ON \`_pages_v_blocks_rituals_steps_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_steps_scene_video_portrait_idx\` ON \`_pages_v_blocks_rituals_steps_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_rituals_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_rituals\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_scene_order_idx\` ON \`_pages_v_blocks_rituals_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_scene_parent_id_idx\` ON \`_pages_v_blocks_rituals_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_scene_image_idx\` ON \`_pages_v_blocks_rituals_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_scene_video_idx\` ON \`_pages_v_blocks_rituals_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_scene_video_portrait_idx\` ON \`_pages_v_blocks_rituals_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_rituals_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_rituals\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_text_variants_order_idx\` ON \`_pages_v_blocks_rituals_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_text_variants_parent_id_idx\` ON \`_pages_v_blocks_rituals_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_rituals_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_rituals_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_rituals_text_variants_locales_locale_parent_\` ON \`_pages_v_blocks_rituals_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_text_variants_locales_parent_id_idx\` ON \`_pages_v_blocks_rituals_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_seasons_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_seasons\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_scene_order_idx\` ON \`_pages_v_blocks_seasons_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_scene_parent_id_idx\` ON \`_pages_v_blocks_seasons_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_scene_image_idx\` ON \`_pages_v_blocks_seasons_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_scene_video_idx\` ON \`_pages_v_blocks_seasons_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_scene_video_portrait_idx\` ON \`_pages_v_blocks_seasons_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_seasons_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_seasons\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_text_variants_order_idx\` ON \`_pages_v_blocks_seasons_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_text_variants_parent_id_idx\` ON \`_pages_v_blocks_seasons_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_seasons_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_seasons_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_seasons_text_variants_locales_locale_parent_\` ON \`_pages_v_blocks_seasons_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_text_variants_locales_parent_id_idx\` ON \`_pages_v_blocks_seasons_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_surroundings_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_surroundings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_surroundings_scene_order_idx\` ON \`_pages_v_blocks_surroundings_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_surroundings_scene_parent_id_idx\` ON \`_pages_v_blocks_surroundings_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_surroundings_scene_image_idx\` ON \`_pages_v_blocks_surroundings_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_surroundings_scene_video_idx\` ON \`_pages_v_blocks_surroundings_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_surroundings_scene_video_portrait_idx\` ON \`_pages_v_blocks_surroundings_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_surroundings_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_surroundings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_surroundings_text_variants_order_idx\` ON \`_pages_v_blocks_surroundings_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_surroundings_text_variants_parent_id_idx\` ON \`_pages_v_blocks_surroundings_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_surroundings_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_surroundings_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_surroundings_text_variants_locales_locale_pa\` ON \`_pages_v_blocks_surroundings_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_surroundings_text_variants_locales_paren_idx\` ON \`_pages_v_blocks_surroundings_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_story_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_story\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_scene_order_idx\` ON \`_pages_v_blocks_story_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_scene_parent_id_idx\` ON \`_pages_v_blocks_story_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_scene_image_idx\` ON \`_pages_v_blocks_story_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_scene_video_idx\` ON \`_pages_v_blocks_story_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_scene_video_portrait_idx\` ON \`_pages_v_blocks_story_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_story_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_story\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_text_variants_order_idx\` ON \`_pages_v_blocks_story_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_text_variants_parent_id_idx\` ON \`_pages_v_blocks_story_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_story_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_story_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_story_text_variants_locales_locale_parent_id\` ON \`_pages_v_blocks_story_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_text_variants_locales_parent_id_idx\` ON \`_pages_v_blocks_story_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_testimonials_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_scene_order_idx\` ON \`_pages_v_blocks_testimonials_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_scene_parent_id_idx\` ON \`_pages_v_blocks_testimonials_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_scene_image_idx\` ON \`_pages_v_blocks_testimonials_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_scene_video_idx\` ON \`_pages_v_blocks_testimonials_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_scene_video_portrait_idx\` ON \`_pages_v_blocks_testimonials_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_testimonials_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_testimonials\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_text_variants_order_idx\` ON \`_pages_v_blocks_testimonials_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_text_variants_parent_id_idx\` ON \`_pages_v_blocks_testimonials_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_testimonials_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_testimonials_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_testimonials_text_variants_locales_locale_pa\` ON \`_pages_v_blocks_testimonials_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_text_variants_locales_paren_idx\` ON \`_pages_v_blocks_testimonials_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_offers_news_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_offers_news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offers_news_scene_order_idx\` ON \`_pages_v_blocks_offers_news_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offers_news_scene_parent_id_idx\` ON \`_pages_v_blocks_offers_news_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offers_news_scene_image_idx\` ON \`_pages_v_blocks_offers_news_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offers_news_scene_video_idx\` ON \`_pages_v_blocks_offers_news_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offers_news_scene_video_portrait_idx\` ON \`_pages_v_blocks_offers_news_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_offers_news_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_offers_news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offers_news_text_variants_order_idx\` ON \`_pages_v_blocks_offers_news_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offers_news_text_variants_parent_id_idx\` ON \`_pages_v_blocks_offers_news_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_offers_news_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_offers_news_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_offers_news_text_variants_locales_locale_par\` ON \`_pages_v_blocks_offers_news_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offers_news_text_variants_locales_parent_idx\` ON \`_pages_v_blocks_offers_news_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_booking_invite_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_booking_invite\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_invite_scene_order_idx\` ON \`_pages_v_blocks_booking_invite_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_invite_scene_parent_id_idx\` ON \`_pages_v_blocks_booking_invite_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_invite_scene_image_idx\` ON \`_pages_v_blocks_booking_invite_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_invite_scene_video_idx\` ON \`_pages_v_blocks_booking_invite_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_invite_scene_video_portrait_idx\` ON \`_pages_v_blocks_booking_invite_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_booking_invite_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_booking_invite\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_invite_text_variants_order_idx\` ON \`_pages_v_blocks_booking_invite_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_invite_text_variants_parent_id_idx\` ON \`_pages_v_blocks_booking_invite_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_booking_invite_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_booking_invite_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_booking_invite_text_variants_locales_locale_\` ON \`_pages_v_blocks_booking_invite_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_invite_text_variants_locales_par_idx\` ON \`_pages_v_blocks_booking_invite_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_gallery_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_scene_order_idx\` ON \`_pages_v_blocks_gallery_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_scene_parent_id_idx\` ON \`_pages_v_blocks_gallery_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_scene_image_idx\` ON \`_pages_v_blocks_gallery_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_scene_video_idx\` ON \`_pages_v_blocks_gallery_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_scene_video_portrait_idx\` ON \`_pages_v_blocks_gallery_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_gallery_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_gallery\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_text_variants_order_idx\` ON \`_pages_v_blocks_gallery_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_text_variants_parent_id_idx\` ON \`_pages_v_blocks_gallery_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_gallery_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_gallery_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_gallery_text_variants_locales_locale_parent_\` ON \`_pages_v_blocks_gallery_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_text_variants_locales_parent_id_idx\` ON \`_pages_v_blocks_gallery_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_faq_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_scene_order_idx\` ON \`_pages_v_blocks_faq_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_scene_parent_id_idx\` ON \`_pages_v_blocks_faq_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_scene_image_idx\` ON \`_pages_v_blocks_faq_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_scene_video_idx\` ON \`_pages_v_blocks_faq_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_scene_video_portrait_idx\` ON \`_pages_v_blocks_faq_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_faq_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_faq\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_text_variants_order_idx\` ON \`_pages_v_blocks_faq_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_text_variants_parent_id_idx\` ON \`_pages_v_blocks_faq_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_faq_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_faq_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_faq_text_variants_locales_locale_parent_id_u\` ON \`_pages_v_blocks_faq_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_text_variants_locales_parent_id_idx\` ON \`_pages_v_blocks_faq_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_rich_text_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_rich_text\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_scene_order_idx\` ON \`_pages_v_blocks_rich_text_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_scene_parent_id_idx\` ON \`_pages_v_blocks_rich_text_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_scene_image_idx\` ON \`_pages_v_blocks_rich_text_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_scene_video_idx\` ON \`_pages_v_blocks_rich_text_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_scene_video_portrait_idx\` ON \`_pages_v_blocks_rich_text_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_rich_text_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_rich_text\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_text_variants_order_idx\` ON \`_pages_v_blocks_rich_text_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_text_variants_parent_id_idx\` ON \`_pages_v_blocks_rich_text_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_rich_text_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_rich_text_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_rich_text_text_variants_locales_locale_paren\` ON \`_pages_v_blocks_rich_text_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_text_variants_locales_parent_i_idx\` ON \`_pages_v_blocks_rich_text_text_variants_locales\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hosts_scene\` (
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
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_hosts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_scene_order_idx\` ON \`_pages_v_blocks_hosts_scene\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_scene_parent_id_idx\` ON \`_pages_v_blocks_hosts_scene\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_scene_image_idx\` ON \`_pages_v_blocks_hosts_scene\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_scene_video_idx\` ON \`_pages_v_blocks_hosts_scene\` (\`video_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_scene_video_portrait_idx\` ON \`_pages_v_blocks_hosts_scene\` (\`video_portrait_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hosts_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pora\` text,
  	\`sezon\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_hosts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_text_variants_order_idx\` ON \`_pages_v_blocks_hosts_text_variants\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_text_variants_parent_id_idx\` ON \`_pages_v_blocks_hosts_text_variants\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hosts_text_variants_locales\` (
  	\`heading\` text,
  	\`text\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v_blocks_hosts_text_variants\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_pages_v_blocks_hosts_text_variants_locales_locale_parent_id\` ON \`_pages_v_blocks_hosts_text_variants_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_text_variants_locales_parent_id_idx\` ON \`_pages_v_blocks_hosts_text_variants_locales\` (\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_blocks_hero_scene\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hero_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hero_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_intro_scene\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_intro_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_intro_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_peaks_panorama_scene\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_peaks_panorama_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_peaks_panorama_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_day_in_settlement_scenes_scene\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_day_in_settlement_scene\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_day_in_settlement_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_day_in_settlement_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_house_inside_rooms_scene\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_house_inside_scene\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_house_inside_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_house_inside_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rituals_steps_scene\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rituals_scene\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rituals_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rituals_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_seasons_scene\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_seasons_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_seasons_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_surroundings_scene\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_surroundings_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_surroundings_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_story_scene\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_story_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_story_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_testimonials_scene\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_testimonials_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_testimonials_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_offers_news_scene\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_offers_news_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_offers_news_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_booking_invite_scene\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_booking_invite_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_booking_invite_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_gallery_scene\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_gallery_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_gallery_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq_scene\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rich_text_scene\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rich_text_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rich_text_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hosts_scene\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hosts_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hosts_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero_scene\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_intro_scene\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_intro_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_intro_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_peaks_panorama_scene\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_peaks_panorama_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_peaks_panorama_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_day_in_settlement_scenes_scene\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_day_in_settlement_scene\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_day_in_settlement_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_day_in_settlement_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_house_inside_rooms_scene\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_house_inside_scene\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_house_inside_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_house_inside_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_rituals_steps_scene\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_rituals_scene\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_rituals_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_rituals_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_seasons_scene\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_seasons_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_seasons_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_surroundings_scene\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_surroundings_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_surroundings_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_story_scene\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_story_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_story_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_testimonials_scene\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_testimonials_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_testimonials_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_offers_news_scene\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_offers_news_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_offers_news_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_booking_invite_scene\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_booking_invite_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_booking_invite_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_gallery_scene\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_gallery_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_gallery_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq_scene\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_rich_text_scene\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_rich_text_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_rich_text_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hosts_scene\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hosts_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hosts_text_variants_locales\`;`)
}
