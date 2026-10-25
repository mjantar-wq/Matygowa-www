import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_blocks_hero_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`pages_blocks_intro_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`pages_blocks_peaks_panorama_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`pages_blocks_day_in_settlement_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`pages_blocks_house_inside_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`pages_blocks_rituals_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`pages_blocks_seasons_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`pages_blocks_surroundings_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`pages_blocks_story_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`pages_blocks_testimonials_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`pages_blocks_offers_news_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`pages_blocks_booking_invite_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`pages_blocks_gallery_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`pages_blocks_faq_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`pages_blocks_rich_text_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`pages_blocks_hosts_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hero_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_intro_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_peaks_panorama_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_day_in_settlement_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_house_inside_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_rituals_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_seasons_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_surroundings_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_story_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_testimonials_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_offers_news_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_booking_invite_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_gallery_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_faq_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_rich_text_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`CREATE TABLE \`_pages_v_blocks_hosts_text_variants\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`variant\` text,
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
  await db.run(sql`ALTER TABLE \`pages_blocks_hero\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hero\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hero\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hero\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hero\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hero\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hero\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hero\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_scene_scene_winter_day_idx\` ON \`pages_blocks_hero\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_scene_scene_winter_night_idx\` ON \`pages_blocks_hero\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_scene_scene_summer_day_idx\` ON \`pages_blocks_hero\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_scene_scene_summer_night_idx\` ON \`pages_blocks_hero\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_scene_scene_winter_day_portrait_idx\` ON \`pages_blocks_hero\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_scene_scene_winter_night_portrait_idx\` ON \`pages_blocks_hero\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_scene_scene_summer_day_portrait_idx\` ON \`pages_blocks_hero\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hero_scene_scene_summer_night_portrait_idx\` ON \`pages_blocks_hero\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_intro\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_intro\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_intro\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_intro\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_intro\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_intro\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_intro\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_intro\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_scene_scene_winter_day_idx\` ON \`pages_blocks_intro\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_scene_scene_winter_night_idx\` ON \`pages_blocks_intro\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_scene_scene_summer_day_idx\` ON \`pages_blocks_intro\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_scene_scene_summer_night_idx\` ON \`pages_blocks_intro\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_scene_scene_winter_day_portrait_idx\` ON \`pages_blocks_intro\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_scene_scene_winter_night_portrait_idx\` ON \`pages_blocks_intro\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_scene_scene_summer_day_portrait_idx\` ON \`pages_blocks_intro\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_scene_scene_summer_night_portrait_idx\` ON \`pages_blocks_intro\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_peaks_panorama\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_peaks_panorama\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_peaks_panorama\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_peaks_panorama\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_peaks_panorama\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_peaks_panorama\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_peaks_panorama\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_peaks_panorama\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_scene_scene_winter_day_idx\` ON \`pages_blocks_peaks_panorama\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_scene_scene_winter_night_idx\` ON \`pages_blocks_peaks_panorama\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_scene_scene_summer_day_idx\` ON \`pages_blocks_peaks_panorama\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_scene_scene_summer_night_idx\` ON \`pages_blocks_peaks_panorama\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_scene_scene_winter_day_portr_idx\` ON \`pages_blocks_peaks_panorama\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_scene_scene_winter_night_por_idx\` ON \`pages_blocks_peaks_panorama\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_scene_scene_summer_day_portr_idx\` ON \`pages_blocks_peaks_panorama\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_scene_scene_summer_night_por_idx\` ON \`pages_blocks_peaks_panorama\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_day_in_settlement\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_day_in_settlement\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_day_in_settlement\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_day_in_settlement\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_day_in_settlement\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_day_in_settlement\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_day_in_settlement\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_day_in_settlement\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_scene_scene_winter_day_idx\` ON \`pages_blocks_day_in_settlement\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_scene_scene_winter_night_idx\` ON \`pages_blocks_day_in_settlement\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_scene_scene_summer_day_idx\` ON \`pages_blocks_day_in_settlement\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_scene_scene_summer_night_idx\` ON \`pages_blocks_day_in_settlement\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_scene_scene_winter_day_po_idx\` ON \`pages_blocks_day_in_settlement\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_scene_scene_winter_night__idx\` ON \`pages_blocks_day_in_settlement\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_scene_scene_summer_day_po_idx\` ON \`pages_blocks_day_in_settlement\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_scene_scene_summer_night__idx\` ON \`pages_blocks_day_in_settlement\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_house_inside\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_house_inside\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_house_inside\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_house_inside\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_house_inside\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_house_inside\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_house_inside\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_house_inside\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_scene_scene_winter_day_idx\` ON \`pages_blocks_house_inside\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_scene_scene_winter_night_idx\` ON \`pages_blocks_house_inside\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_scene_scene_summer_day_idx\` ON \`pages_blocks_house_inside\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_scene_scene_summer_night_idx\` ON \`pages_blocks_house_inside\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_scene_scene_winter_day_portrai_idx\` ON \`pages_blocks_house_inside\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_scene_scene_winter_night_portr_idx\` ON \`pages_blocks_house_inside\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_scene_scene_summer_day_portrai_idx\` ON \`pages_blocks_house_inside\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_scene_scene_summer_night_portr_idx\` ON \`pages_blocks_house_inside\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_rituals\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_rituals\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_rituals\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_rituals\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_rituals\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_rituals\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_rituals\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_rituals\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_scene_scene_winter_day_idx\` ON \`pages_blocks_rituals\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_scene_scene_winter_night_idx\` ON \`pages_blocks_rituals\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_scene_scene_summer_day_idx\` ON \`pages_blocks_rituals\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_scene_scene_summer_night_idx\` ON \`pages_blocks_rituals\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_scene_scene_winter_day_portrait_idx\` ON \`pages_blocks_rituals\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_scene_scene_winter_night_portrait_idx\` ON \`pages_blocks_rituals\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_scene_scene_summer_day_portrait_idx\` ON \`pages_blocks_rituals\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_scene_scene_summer_night_portrait_idx\` ON \`pages_blocks_rituals\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_seasons\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_seasons\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_seasons\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_seasons\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_seasons\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_seasons\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_seasons\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_seasons\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_scene_scene_winter_day_idx\` ON \`pages_blocks_seasons\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_scene_scene_winter_night_idx\` ON \`pages_blocks_seasons\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_scene_scene_summer_day_idx\` ON \`pages_blocks_seasons\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_scene_scene_summer_night_idx\` ON \`pages_blocks_seasons\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_scene_scene_winter_day_portrait_idx\` ON \`pages_blocks_seasons\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_scene_scene_winter_night_portrait_idx\` ON \`pages_blocks_seasons\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_scene_scene_summer_day_portrait_idx\` ON \`pages_blocks_seasons\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_scene_scene_summer_night_portrait_idx\` ON \`pages_blocks_seasons\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_surroundings\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_surroundings\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_surroundings\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_surroundings\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_surroundings\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_surroundings\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_surroundings\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_surroundings\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_surroundings_scene_scene_winter_day_idx\` ON \`pages_blocks_surroundings\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_surroundings_scene_scene_winter_night_idx\` ON \`pages_blocks_surroundings\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_surroundings_scene_scene_summer_day_idx\` ON \`pages_blocks_surroundings\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_surroundings_scene_scene_summer_night_idx\` ON \`pages_blocks_surroundings\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_surroundings_scene_scene_winter_day_portrai_idx\` ON \`pages_blocks_surroundings\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_surroundings_scene_scene_winter_night_portr_idx\` ON \`pages_blocks_surroundings\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_surroundings_scene_scene_summer_day_portrai_idx\` ON \`pages_blocks_surroundings\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_surroundings_scene_scene_summer_night_portr_idx\` ON \`pages_blocks_surroundings\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_story\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_story\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_story\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_story\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_story\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_story\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_story\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_story\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_scene_scene_winter_day_idx\` ON \`pages_blocks_story\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_scene_scene_winter_night_idx\` ON \`pages_blocks_story\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_scene_scene_summer_day_idx\` ON \`pages_blocks_story\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_scene_scene_summer_night_idx\` ON \`pages_blocks_story\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_scene_scene_winter_day_portrait_idx\` ON \`pages_blocks_story\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_scene_scene_winter_night_portrait_idx\` ON \`pages_blocks_story\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_scene_scene_summer_day_portrait_idx\` ON \`pages_blocks_story\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_scene_scene_summer_night_portrait_idx\` ON \`pages_blocks_story\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_testimonials\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_testimonials\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_testimonials\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_testimonials\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_testimonials\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_testimonials\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_testimonials\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_testimonials\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_scene_scene_winter_day_idx\` ON \`pages_blocks_testimonials\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_scene_scene_winter_night_idx\` ON \`pages_blocks_testimonials\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_scene_scene_summer_day_idx\` ON \`pages_blocks_testimonials\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_scene_scene_summer_night_idx\` ON \`pages_blocks_testimonials\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_scene_scene_winter_day_portrai_idx\` ON \`pages_blocks_testimonials\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_scene_scene_winter_night_portr_idx\` ON \`pages_blocks_testimonials\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_scene_scene_summer_day_portrai_idx\` ON \`pages_blocks_testimonials\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_scene_scene_summer_night_portr_idx\` ON \`pages_blocks_testimonials\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_offers_news\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_offers_news\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_offers_news\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_offers_news\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_offers_news\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_offers_news\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_offers_news\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_offers_news\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_offers_news_scene_scene_winter_day_idx\` ON \`pages_blocks_offers_news\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_offers_news_scene_scene_winter_night_idx\` ON \`pages_blocks_offers_news\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_offers_news_scene_scene_summer_day_idx\` ON \`pages_blocks_offers_news\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_offers_news_scene_scene_summer_night_idx\` ON \`pages_blocks_offers_news\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_offers_news_scene_scene_winter_day_portrait_idx\` ON \`pages_blocks_offers_news\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_offers_news_scene_scene_winter_night_portra_idx\` ON \`pages_blocks_offers_news\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_offers_news_scene_scene_summer_day_portrait_idx\` ON \`pages_blocks_offers_news\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_offers_news_scene_scene_summer_night_portra_idx\` ON \`pages_blocks_offers_news\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_invite\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_invite\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_invite\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_invite\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_invite\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_invite\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_invite\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_booking_invite\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_invite_scene_scene_winter_day_idx\` ON \`pages_blocks_booking_invite\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_invite_scene_scene_winter_night_idx\` ON \`pages_blocks_booking_invite\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_invite_scene_scene_summer_day_idx\` ON \`pages_blocks_booking_invite\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_invite_scene_scene_summer_night_idx\` ON \`pages_blocks_booking_invite\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_invite_scene_scene_winter_day_portr_idx\` ON \`pages_blocks_booking_invite\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_invite_scene_scene_winter_night_por_idx\` ON \`pages_blocks_booking_invite\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_invite_scene_scene_summer_day_portr_idx\` ON \`pages_blocks_booking_invite\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_invite_scene_scene_summer_night_por_idx\` ON \`pages_blocks_booking_invite\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_gallery\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_gallery\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_gallery\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_gallery\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_gallery\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_gallery\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_gallery\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_gallery\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_scene_scene_winter_day_idx\` ON \`pages_blocks_gallery\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_scene_scene_winter_night_idx\` ON \`pages_blocks_gallery\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_scene_scene_summer_day_idx\` ON \`pages_blocks_gallery\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_scene_scene_summer_night_idx\` ON \`pages_blocks_gallery\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_scene_scene_winter_day_portrait_idx\` ON \`pages_blocks_gallery\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_scene_scene_winter_night_portrait_idx\` ON \`pages_blocks_gallery\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_scene_scene_summer_day_portrait_idx\` ON \`pages_blocks_gallery\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_scene_scene_summer_night_portrait_idx\` ON \`pages_blocks_gallery\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_faq\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_faq\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_faq\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_faq\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_faq\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_faq\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_faq\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_faq\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_scene_scene_winter_day_idx\` ON \`pages_blocks_faq\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_scene_scene_winter_night_idx\` ON \`pages_blocks_faq\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_scene_scene_summer_day_idx\` ON \`pages_blocks_faq\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_scene_scene_summer_night_idx\` ON \`pages_blocks_faq\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_scene_scene_winter_day_portrait_idx\` ON \`pages_blocks_faq\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_scene_scene_winter_night_portrait_idx\` ON \`pages_blocks_faq\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_scene_scene_summer_day_portrait_idx\` ON \`pages_blocks_faq\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_scene_scene_summer_night_portrait_idx\` ON \`pages_blocks_faq\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_rich_text\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_rich_text\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_rich_text\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_rich_text\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_rich_text\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_rich_text\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_rich_text\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_rich_text\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_scene_scene_winter_day_idx\` ON \`pages_blocks_rich_text\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_scene_scene_winter_night_idx\` ON \`pages_blocks_rich_text\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_scene_scene_summer_day_idx\` ON \`pages_blocks_rich_text\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_scene_scene_summer_night_idx\` ON \`pages_blocks_rich_text\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_scene_scene_winter_day_portrait_idx\` ON \`pages_blocks_rich_text\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_scene_scene_winter_night_portrait_idx\` ON \`pages_blocks_rich_text\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_scene_scene_summer_day_portrait_idx\` ON \`pages_blocks_rich_text\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_scene_scene_summer_night_portrait_idx\` ON \`pages_blocks_rich_text\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hosts\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hosts\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hosts\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hosts\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hosts\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hosts\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hosts\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages_blocks_hosts\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_scene_scene_winter_day_idx\` ON \`pages_blocks_hosts\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_scene_scene_winter_night_idx\` ON \`pages_blocks_hosts\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_scene_scene_summer_day_idx\` ON \`pages_blocks_hosts\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_scene_scene_summer_night_idx\` ON \`pages_blocks_hosts\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_scene_scene_winter_day_portrait_idx\` ON \`pages_blocks_hosts\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_scene_scene_winter_night_portrait_idx\` ON \`pages_blocks_hosts\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_scene_scene_summer_day_portrait_idx\` ON \`pages_blocks_hosts\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_scene_scene_summer_night_portrait_idx\` ON \`pages_blocks_hosts\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hero\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hero\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hero\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hero\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hero\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hero\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hero\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hero\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_scene_scene_winter_day_idx\` ON \`_pages_v_blocks_hero\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_scene_scene_winter_night_idx\` ON \`_pages_v_blocks_hero\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_scene_scene_summer_day_idx\` ON \`_pages_v_blocks_hero\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_scene_scene_summer_night_idx\` ON \`_pages_v_blocks_hero\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_scene_scene_winter_day_portrait_idx\` ON \`_pages_v_blocks_hero\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_scene_scene_winter_night_portrait_idx\` ON \`_pages_v_blocks_hero\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_scene_scene_summer_day_portrait_idx\` ON \`_pages_v_blocks_hero\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hero_scene_scene_summer_night_portrait_idx\` ON \`_pages_v_blocks_hero\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_intro\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_intro\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_intro\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_intro\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_intro\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_intro\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_intro\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_intro\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_intro_scene_scene_winter_day_idx\` ON \`_pages_v_blocks_intro\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_intro_scene_scene_winter_night_idx\` ON \`_pages_v_blocks_intro\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_intro_scene_scene_summer_day_idx\` ON \`_pages_v_blocks_intro\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_intro_scene_scene_summer_night_idx\` ON \`_pages_v_blocks_intro\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_intro_scene_scene_winter_day_portrait_idx\` ON \`_pages_v_blocks_intro\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_intro_scene_scene_winter_night_portrait_idx\` ON \`_pages_v_blocks_intro\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_intro_scene_scene_summer_day_portrait_idx\` ON \`_pages_v_blocks_intro\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_intro_scene_scene_summer_night_portrait_idx\` ON \`_pages_v_blocks_intro\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_peaks_panorama\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_peaks_panorama\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_peaks_panorama\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_peaks_panorama\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_peaks_panorama\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_peaks_panorama\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_peaks_panorama\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_peaks_panorama\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_scene_scene_winter_day_idx\` ON \`_pages_v_blocks_peaks_panorama\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_scene_scene_winter_night_idx\` ON \`_pages_v_blocks_peaks_panorama\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_scene_scene_summer_day_idx\` ON \`_pages_v_blocks_peaks_panorama\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_scene_scene_summer_night_idx\` ON \`_pages_v_blocks_peaks_panorama\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_scene_scene_winter_day_po_idx\` ON \`_pages_v_blocks_peaks_panorama\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_scene_scene_winter_night__idx\` ON \`_pages_v_blocks_peaks_panorama\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_scene_scene_summer_day_po_idx\` ON \`_pages_v_blocks_peaks_panorama\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_scene_scene_summer_night__idx\` ON \`_pages_v_blocks_peaks_panorama\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_day_in_settlement\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_day_in_settlement\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_day_in_settlement\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_day_in_settlement\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_day_in_settlement\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_day_in_settlement\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_day_in_settlement\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_day_in_settlement\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_scene_scene_winter_day_idx\` ON \`_pages_v_blocks_day_in_settlement\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_scene_scene_winter_nig_idx\` ON \`_pages_v_blocks_day_in_settlement\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_scene_scene_summer_day_idx\` ON \`_pages_v_blocks_day_in_settlement\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_scene_scene_summer_nig_idx\` ON \`_pages_v_blocks_day_in_settlement\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_scene_scene_winter_d_1_idx\` ON \`_pages_v_blocks_day_in_settlement\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_scene_scene_winter_n_1_idx\` ON \`_pages_v_blocks_day_in_settlement\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_scene_scene_summer_d_1_idx\` ON \`_pages_v_blocks_day_in_settlement\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_scene_scene_summer_n_1_idx\` ON \`_pages_v_blocks_day_in_settlement\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_house_inside\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_house_inside\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_house_inside\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_house_inside\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_house_inside\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_house_inside\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_house_inside\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_house_inside\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_scene_scene_winter_day_idx\` ON \`_pages_v_blocks_house_inside\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_scene_scene_winter_night_idx\` ON \`_pages_v_blocks_house_inside\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_scene_scene_summer_day_idx\` ON \`_pages_v_blocks_house_inside\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_scene_scene_summer_night_idx\` ON \`_pages_v_blocks_house_inside\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_scene_scene_winter_day_port_idx\` ON \`_pages_v_blocks_house_inside\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_scene_scene_winter_night_po_idx\` ON \`_pages_v_blocks_house_inside\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_scene_scene_summer_day_port_idx\` ON \`_pages_v_blocks_house_inside\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_scene_scene_summer_night_po_idx\` ON \`_pages_v_blocks_house_inside\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_rituals\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_rituals\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_rituals\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_rituals\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_rituals\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_rituals\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_rituals\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_rituals\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_scene_scene_winter_day_idx\` ON \`_pages_v_blocks_rituals\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_scene_scene_winter_night_idx\` ON \`_pages_v_blocks_rituals\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_scene_scene_summer_day_idx\` ON \`_pages_v_blocks_rituals\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_scene_scene_summer_night_idx\` ON \`_pages_v_blocks_rituals\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_scene_scene_winter_day_portrait_idx\` ON \`_pages_v_blocks_rituals\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_scene_scene_winter_night_portrai_idx\` ON \`_pages_v_blocks_rituals\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_scene_scene_summer_day_portrait_idx\` ON \`_pages_v_blocks_rituals\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_scene_scene_summer_night_portrai_idx\` ON \`_pages_v_blocks_rituals\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_seasons\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_seasons\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_seasons\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_seasons\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_seasons\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_seasons\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_seasons\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_seasons\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_scene_scene_winter_day_idx\` ON \`_pages_v_blocks_seasons\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_scene_scene_winter_night_idx\` ON \`_pages_v_blocks_seasons\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_scene_scene_summer_day_idx\` ON \`_pages_v_blocks_seasons\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_scene_scene_summer_night_idx\` ON \`_pages_v_blocks_seasons\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_scene_scene_winter_day_portrait_idx\` ON \`_pages_v_blocks_seasons\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_scene_scene_winter_night_portrai_idx\` ON \`_pages_v_blocks_seasons\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_scene_scene_summer_day_portrait_idx\` ON \`_pages_v_blocks_seasons\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_scene_scene_summer_night_portrai_idx\` ON \`_pages_v_blocks_seasons\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_surroundings\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_surroundings\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_surroundings\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_surroundings\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_surroundings\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_surroundings\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_surroundings\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_surroundings\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_surroundings_scene_scene_winter_day_idx\` ON \`_pages_v_blocks_surroundings\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_surroundings_scene_scene_winter_night_idx\` ON \`_pages_v_blocks_surroundings\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_surroundings_scene_scene_summer_day_idx\` ON \`_pages_v_blocks_surroundings\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_surroundings_scene_scene_summer_night_idx\` ON \`_pages_v_blocks_surroundings\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_surroundings_scene_scene_winter_day_port_idx\` ON \`_pages_v_blocks_surroundings\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_surroundings_scene_scene_winter_night_po_idx\` ON \`_pages_v_blocks_surroundings\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_surroundings_scene_scene_summer_day_port_idx\` ON \`_pages_v_blocks_surroundings\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_surroundings_scene_scene_summer_night_po_idx\` ON \`_pages_v_blocks_surroundings\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_story\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_story\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_story\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_story\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_story\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_story\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_story\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_story\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_scene_scene_winter_day_idx\` ON \`_pages_v_blocks_story\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_scene_scene_winter_night_idx\` ON \`_pages_v_blocks_story\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_scene_scene_summer_day_idx\` ON \`_pages_v_blocks_story\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_scene_scene_summer_night_idx\` ON \`_pages_v_blocks_story\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_scene_scene_winter_day_portrait_idx\` ON \`_pages_v_blocks_story\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_scene_scene_winter_night_portrait_idx\` ON \`_pages_v_blocks_story\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_scene_scene_summer_day_portrait_idx\` ON \`_pages_v_blocks_story\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_scene_scene_summer_night_portrait_idx\` ON \`_pages_v_blocks_story\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_testimonials\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_testimonials\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_testimonials\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_testimonials\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_testimonials\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_testimonials\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_testimonials\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_testimonials\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_scene_scene_winter_day_idx\` ON \`_pages_v_blocks_testimonials\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_scene_scene_winter_night_idx\` ON \`_pages_v_blocks_testimonials\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_scene_scene_summer_day_idx\` ON \`_pages_v_blocks_testimonials\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_scene_scene_summer_night_idx\` ON \`_pages_v_blocks_testimonials\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_scene_scene_winter_day_port_idx\` ON \`_pages_v_blocks_testimonials\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_scene_scene_winter_night_po_idx\` ON \`_pages_v_blocks_testimonials\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_scene_scene_summer_day_port_idx\` ON \`_pages_v_blocks_testimonials\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_scene_scene_summer_night_po_idx\` ON \`_pages_v_blocks_testimonials\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_offers_news\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_offers_news\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_offers_news\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_offers_news\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_offers_news\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_offers_news\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_offers_news\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_offers_news\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offers_news_scene_scene_winter_day_idx\` ON \`_pages_v_blocks_offers_news\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offers_news_scene_scene_winter_night_idx\` ON \`_pages_v_blocks_offers_news\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offers_news_scene_scene_summer_day_idx\` ON \`_pages_v_blocks_offers_news\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offers_news_scene_scene_summer_night_idx\` ON \`_pages_v_blocks_offers_news\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offers_news_scene_scene_winter_day_portr_idx\` ON \`_pages_v_blocks_offers_news\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offers_news_scene_scene_winter_night_por_idx\` ON \`_pages_v_blocks_offers_news\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offers_news_scene_scene_summer_day_portr_idx\` ON \`_pages_v_blocks_offers_news\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offers_news_scene_scene_summer_night_por_idx\` ON \`_pages_v_blocks_offers_news\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_invite\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_invite\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_invite\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_invite\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_invite\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_invite\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_invite\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_booking_invite\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_invite_scene_scene_winter_day_idx\` ON \`_pages_v_blocks_booking_invite\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_invite_scene_scene_winter_night_idx\` ON \`_pages_v_blocks_booking_invite\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_invite_scene_scene_summer_day_idx\` ON \`_pages_v_blocks_booking_invite\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_invite_scene_scene_summer_night_idx\` ON \`_pages_v_blocks_booking_invite\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_invite_scene_scene_winter_day_po_idx\` ON \`_pages_v_blocks_booking_invite\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_invite_scene_scene_winter_night__idx\` ON \`_pages_v_blocks_booking_invite\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_invite_scene_scene_summer_day_po_idx\` ON \`_pages_v_blocks_booking_invite\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_invite_scene_scene_summer_night__idx\` ON \`_pages_v_blocks_booking_invite\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_gallery\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_gallery\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_gallery\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_gallery\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_gallery\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_gallery\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_gallery\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_gallery\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_scene_scene_winter_day_idx\` ON \`_pages_v_blocks_gallery\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_scene_scene_winter_night_idx\` ON \`_pages_v_blocks_gallery\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_scene_scene_summer_day_idx\` ON \`_pages_v_blocks_gallery\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_scene_scene_summer_night_idx\` ON \`_pages_v_blocks_gallery\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_scene_scene_winter_day_portrait_idx\` ON \`_pages_v_blocks_gallery\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_scene_scene_winter_night_portrai_idx\` ON \`_pages_v_blocks_gallery\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_scene_scene_summer_day_portrait_idx\` ON \`_pages_v_blocks_gallery\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_scene_scene_summer_night_portrai_idx\` ON \`_pages_v_blocks_gallery\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_faq\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_faq\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_faq\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_faq\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_faq\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_faq\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_faq\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_faq\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_scene_scene_winter_day_idx\` ON \`_pages_v_blocks_faq\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_scene_scene_winter_night_idx\` ON \`_pages_v_blocks_faq\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_scene_scene_summer_day_idx\` ON \`_pages_v_blocks_faq\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_scene_scene_summer_night_idx\` ON \`_pages_v_blocks_faq\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_scene_scene_winter_day_portrait_idx\` ON \`_pages_v_blocks_faq\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_scene_scene_winter_night_portrait_idx\` ON \`_pages_v_blocks_faq\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_scene_scene_summer_day_portrait_idx\` ON \`_pages_v_blocks_faq\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_scene_scene_summer_night_portrait_idx\` ON \`_pages_v_blocks_faq\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_rich_text\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_rich_text\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_rich_text\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_rich_text\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_rich_text\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_rich_text\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_rich_text\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_rich_text\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_scene_scene_winter_day_idx\` ON \`_pages_v_blocks_rich_text\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_scene_scene_winter_night_idx\` ON \`_pages_v_blocks_rich_text\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_scene_scene_summer_day_idx\` ON \`_pages_v_blocks_rich_text\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_scene_scene_summer_night_idx\` ON \`_pages_v_blocks_rich_text\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_scene_scene_winter_day_portrai_idx\` ON \`_pages_v_blocks_rich_text\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_scene_scene_winter_night_portr_idx\` ON \`_pages_v_blocks_rich_text\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_scene_scene_summer_day_portrai_idx\` ON \`_pages_v_blocks_rich_text\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_scene_scene_summer_night_portr_idx\` ON \`_pages_v_blocks_rich_text\` (\`scene_summer_night_portrait_id\`);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hosts\` ADD \`scene_winter_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hosts\` ADD \`scene_winter_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hosts\` ADD \`scene_summer_day_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hosts\` ADD \`scene_summer_night_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hosts\` ADD \`scene_winter_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hosts\` ADD \`scene_winter_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hosts\` ADD \`scene_summer_day_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`_pages_v_blocks_hosts\` ADD \`scene_summer_night_portrait_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_scene_scene_winter_day_idx\` ON \`_pages_v_blocks_hosts\` (\`scene_winter_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_scene_scene_winter_night_idx\` ON \`_pages_v_blocks_hosts\` (\`scene_winter_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_scene_scene_summer_day_idx\` ON \`_pages_v_blocks_hosts\` (\`scene_summer_day_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_scene_scene_summer_night_idx\` ON \`_pages_v_blocks_hosts\` (\`scene_summer_night_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_scene_scene_winter_day_portrait_idx\` ON \`_pages_v_blocks_hosts\` (\`scene_winter_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_scene_scene_winter_night_portrait_idx\` ON \`_pages_v_blocks_hosts\` (\`scene_winter_night_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_scene_scene_summer_day_portrait_idx\` ON \`_pages_v_blocks_hosts\` (\`scene_summer_day_portrait_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_scene_scene_summer_night_portrait_idx\` ON \`_pages_v_blocks_hosts\` (\`scene_summer_night_portrait_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_blocks_hero_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hero_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_intro_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_intro_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_peaks_panorama_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_peaks_panorama_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_day_in_settlement_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_day_in_settlement_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_house_inside_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_house_inside_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rituals_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rituals_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_seasons_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_seasons_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_surroundings_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_surroundings_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_story_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_story_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_testimonials_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_testimonials_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_offers_news_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_offers_news_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_booking_invite_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_booking_invite_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_gallery_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_gallery_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rich_text_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rich_text_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hosts_text_variants\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hosts_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hero_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_intro_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_intro_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_peaks_panorama_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_peaks_panorama_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_day_in_settlement_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_day_in_settlement_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_house_inside_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_house_inside_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_rituals_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_rituals_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_seasons_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_seasons_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_surroundings_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_surroundings_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_story_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_story_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_testimonials_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_testimonials_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_offers_news_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_offers_news_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_booking_invite_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_booking_invite_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_gallery_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_gallery_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_rich_text_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_rich_text_text_variants_locales\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hosts_text_variants\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hosts_text_variants_locales\`;`)
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
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_intro\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`anchor\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_intro\`("_order", "_parent_id", "_path", "id", "anchor", "block_name") SELECT "_order", "_parent_id", "_path", "id", "anchor", "block_name" FROM \`pages_blocks_intro\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_intro\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_intro\` RENAME TO \`pages_blocks_intro\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_order_idx\` ON \`pages_blocks_intro\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_parent_id_idx\` ON \`pages_blocks_intro\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_intro_path_idx\` ON \`pages_blocks_intro\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_peaks_panorama\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`show_map\` integer DEFAULT true,
  	\`map_id\` integer,
  	\`anchor\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`map_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_peaks_panorama\`("_order", "_parent_id", "_path", "id", "image_id", "show_map", "map_id", "anchor", "block_name") SELECT "_order", "_parent_id", "_path", "id", "image_id", "show_map", "map_id", "anchor", "block_name" FROM \`pages_blocks_peaks_panorama\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_peaks_panorama\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_peaks_panorama\` RENAME TO \`pages_blocks_peaks_panorama\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_order_idx\` ON \`pages_blocks_peaks_panorama\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_parent_id_idx\` ON \`pages_blocks_peaks_panorama\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_path_idx\` ON \`pages_blocks_peaks_panorama\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_image_idx\` ON \`pages_blocks_peaks_panorama\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_peaks_panorama_map_idx\` ON \`pages_blocks_peaks_panorama\` (\`map_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_day_in_settlement\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`anchor\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_day_in_settlement\`("_order", "_parent_id", "_path", "id", "anchor", "block_name") SELECT "_order", "_parent_id", "_path", "id", "anchor", "block_name" FROM \`pages_blocks_day_in_settlement\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_day_in_settlement\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_day_in_settlement\` RENAME TO \`pages_blocks_day_in_settlement\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_order_idx\` ON \`pages_blocks_day_in_settlement\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_parent_id_idx\` ON \`pages_blocks_day_in_settlement\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_day_in_settlement_path_idx\` ON \`pages_blocks_day_in_settlement\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_house_inside\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`plan_id\` integer,
  	\`anchor\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`plan_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_house_inside\`("_order", "_parent_id", "_path", "id", "plan_id", "anchor", "block_name") SELECT "_order", "_parent_id", "_path", "id", "plan_id", "anchor", "block_name" FROM \`pages_blocks_house_inside\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_house_inside\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_house_inside\` RENAME TO \`pages_blocks_house_inside\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_order_idx\` ON \`pages_blocks_house_inside\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_parent_id_idx\` ON \`pages_blocks_house_inside\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_path_idx\` ON \`pages_blocks_house_inside\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_house_inside_plan_idx\` ON \`pages_blocks_house_inside\` (\`plan_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_rituals\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`show_prices\` integer DEFAULT true,
  	\`anchor\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_rituals\`("_order", "_parent_id", "_path", "id", "show_prices", "anchor", "block_name") SELECT "_order", "_parent_id", "_path", "id", "show_prices", "anchor", "block_name" FROM \`pages_blocks_rituals\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rituals\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_rituals\` RENAME TO \`pages_blocks_rituals\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_order_idx\` ON \`pages_blocks_rituals\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_parent_id_idx\` ON \`pages_blocks_rituals\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rituals_path_idx\` ON \`pages_blocks_rituals\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_seasons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`winter_image_id\` integer,
  	\`summer_image_id\` integer,
  	\`anchor\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`winter_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`summer_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_seasons\`("_order", "_parent_id", "_path", "id", "winter_image_id", "summer_image_id", "anchor", "block_name") SELECT "_order", "_parent_id", "_path", "id", "winter_image_id", "summer_image_id", "anchor", "block_name" FROM \`pages_blocks_seasons\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_seasons\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_seasons\` RENAME TO \`pages_blocks_seasons\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_order_idx\` ON \`pages_blocks_seasons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_parent_id_idx\` ON \`pages_blocks_seasons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_path_idx\` ON \`pages_blocks_seasons\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_winter_winter_image_idx\` ON \`pages_blocks_seasons\` (\`winter_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_seasons_summer_summer_image_idx\` ON \`pages_blocks_seasons\` (\`summer_image_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_surroundings\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`map_id\` integer,
  	\`limit\` numeric DEFAULT 6,
  	\`anchor\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`map_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_surroundings\`("_order", "_parent_id", "_path", "id", "map_id", "limit", "anchor", "block_name") SELECT "_order", "_parent_id", "_path", "id", "map_id", "limit", "anchor", "block_name" FROM \`pages_blocks_surroundings\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_surroundings\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_surroundings\` RENAME TO \`pages_blocks_surroundings\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_surroundings_order_idx\` ON \`pages_blocks_surroundings\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_surroundings_parent_id_idx\` ON \`pages_blocks_surroundings\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_surroundings_path_idx\` ON \`pages_blocks_surroundings\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_surroundings_map_idx\` ON \`pages_blocks_surroundings\` (\`map_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_story\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`image_position\` text DEFAULT 'end',
  	\`anchor\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_story\`("_order", "_parent_id", "_path", "id", "image_id", "image_position", "anchor", "block_name") SELECT "_order", "_parent_id", "_path", "id", "image_id", "image_position", "anchor", "block_name" FROM \`pages_blocks_story\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_story\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_story\` RENAME TO \`pages_blocks_story\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_order_idx\` ON \`pages_blocks_story\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_parent_id_idx\` ON \`pages_blocks_story\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_path_idx\` ON \`pages_blocks_story\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_story_image_idx\` ON \`pages_blocks_story\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_testimonials\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`anchor\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_testimonials\`("_order", "_parent_id", "_path", "id", "anchor", "block_name") SELECT "_order", "_parent_id", "_path", "id", "anchor", "block_name" FROM \`pages_blocks_testimonials\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_testimonials\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_testimonials\` RENAME TO \`pages_blocks_testimonials\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_order_idx\` ON \`pages_blocks_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_parent_id_idx\` ON \`pages_blocks_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_testimonials_path_idx\` ON \`pages_blocks_testimonials\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_offers_news\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`anchor\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_offers_news\`("_order", "_parent_id", "_path", "id", "anchor", "block_name") SELECT "_order", "_parent_id", "_path", "id", "anchor", "block_name" FROM \`pages_blocks_offers_news\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_offers_news\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_offers_news\` RENAME TO \`pages_blocks_offers_news\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_offers_news_order_idx\` ON \`pages_blocks_offers_news\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_offers_news_parent_id_idx\` ON \`pages_blocks_offers_news\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_offers_news_path_idx\` ON \`pages_blocks_offers_news\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_booking_invite\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`anchor\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_booking_invite\`("_order", "_parent_id", "_path", "id", "anchor", "block_name") SELECT "_order", "_parent_id", "_path", "id", "anchor", "block_name" FROM \`pages_blocks_booking_invite\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_booking_invite\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_booking_invite\` RENAME TO \`pages_blocks_booking_invite\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_invite_order_idx\` ON \`pages_blocks_booking_invite\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_invite_parent_id_idx\` ON \`pages_blocks_booking_invite\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_booking_invite_path_idx\` ON \`pages_blocks_booking_invite\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_gallery\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`anchor\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_gallery\`("_order", "_parent_id", "_path", "id", "anchor", "block_name") SELECT "_order", "_parent_id", "_path", "id", "anchor", "block_name" FROM \`pages_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_gallery\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_gallery\` RENAME TO \`pages_blocks_gallery\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_order_idx\` ON \`pages_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_parent_id_idx\` ON \`pages_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_gallery_path_idx\` ON \`pages_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_faq\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`anchor\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_faq\`("_order", "_parent_id", "_path", "id", "anchor", "block_name") SELECT "_order", "_parent_id", "_path", "id", "anchor", "block_name" FROM \`pages_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_faq\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_faq\` RENAME TO \`pages_blocks_faq\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_order_idx\` ON \`pages_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_parent_id_idx\` ON \`pages_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_faq_path_idx\` ON \`pages_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_rich_text\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`anchor\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_rich_text\`("_order", "_parent_id", "_path", "id", "anchor", "block_name") SELECT "_order", "_parent_id", "_path", "id", "anchor", "block_name" FROM \`pages_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_rich_text\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_rich_text\` RENAME TO \`pages_blocks_rich_text\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_order_idx\` ON \`pages_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_parent_id_idx\` ON \`pages_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_rich_text_path_idx\` ON \`pages_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_blocks_hosts\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`anchor\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_blocks_hosts\`("_order", "_parent_id", "_path", "id", "anchor", "block_name") SELECT "_order", "_parent_id", "_path", "id", "anchor", "block_name" FROM \`pages_blocks_hosts\`;`)
  await db.run(sql`DROP TABLE \`pages_blocks_hosts\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_blocks_hosts\` RENAME TO \`pages_blocks_hosts\`;`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_order_idx\` ON \`pages_blocks_hosts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_parent_id_idx\` ON \`pages_blocks_hosts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_blocks_hosts_path_idx\` ON \`pages_blocks_hosts\` (\`_path\`);`)
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
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_intro\` (
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
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_intro\`("_order", "_parent_id", "_path", "id", "anchor", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "anchor", "_uuid", "block_name" FROM \`_pages_v_blocks_intro\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_intro\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_intro\` RENAME TO \`_pages_v_blocks_intro\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_intro_order_idx\` ON \`_pages_v_blocks_intro\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_intro_parent_id_idx\` ON \`_pages_v_blocks_intro\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_intro_path_idx\` ON \`_pages_v_blocks_intro\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_peaks_panorama\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`show_map\` integer DEFAULT true,
  	\`map_id\` integer,
  	\`anchor\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`map_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_peaks_panorama\`("_order", "_parent_id", "_path", "id", "image_id", "show_map", "map_id", "anchor", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "image_id", "show_map", "map_id", "anchor", "_uuid", "block_name" FROM \`_pages_v_blocks_peaks_panorama\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_peaks_panorama\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_peaks_panorama\` RENAME TO \`_pages_v_blocks_peaks_panorama\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_order_idx\` ON \`_pages_v_blocks_peaks_panorama\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_parent_id_idx\` ON \`_pages_v_blocks_peaks_panorama\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_path_idx\` ON \`_pages_v_blocks_peaks_panorama\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_image_idx\` ON \`_pages_v_blocks_peaks_panorama\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_peaks_panorama_map_idx\` ON \`_pages_v_blocks_peaks_panorama\` (\`map_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_day_in_settlement\` (
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
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_day_in_settlement\`("_order", "_parent_id", "_path", "id", "anchor", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "anchor", "_uuid", "block_name" FROM \`_pages_v_blocks_day_in_settlement\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_day_in_settlement\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_day_in_settlement\` RENAME TO \`_pages_v_blocks_day_in_settlement\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_order_idx\` ON \`_pages_v_blocks_day_in_settlement\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_parent_id_idx\` ON \`_pages_v_blocks_day_in_settlement\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_day_in_settlement_path_idx\` ON \`_pages_v_blocks_day_in_settlement\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_house_inside\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`plan_id\` integer,
  	\`anchor\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`plan_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_house_inside\`("_order", "_parent_id", "_path", "id", "plan_id", "anchor", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "plan_id", "anchor", "_uuid", "block_name" FROM \`_pages_v_blocks_house_inside\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_house_inside\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_house_inside\` RENAME TO \`_pages_v_blocks_house_inside\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_order_idx\` ON \`_pages_v_blocks_house_inside\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_parent_id_idx\` ON \`_pages_v_blocks_house_inside\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_path_idx\` ON \`_pages_v_blocks_house_inside\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_house_inside_plan_idx\` ON \`_pages_v_blocks_house_inside\` (\`plan_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_rituals\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`show_prices\` integer DEFAULT true,
  	\`anchor\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_rituals\`("_order", "_parent_id", "_path", "id", "show_prices", "anchor", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "show_prices", "anchor", "_uuid", "block_name" FROM \`_pages_v_blocks_rituals\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_rituals\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_rituals\` RENAME TO \`_pages_v_blocks_rituals\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_order_idx\` ON \`_pages_v_blocks_rituals\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_parent_id_idx\` ON \`_pages_v_blocks_rituals\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rituals_path_idx\` ON \`_pages_v_blocks_rituals\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_seasons\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`winter_image_id\` integer,
  	\`summer_image_id\` integer,
  	\`anchor\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`winter_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`summer_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_seasons\`("_order", "_parent_id", "_path", "id", "winter_image_id", "summer_image_id", "anchor", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "winter_image_id", "summer_image_id", "anchor", "_uuid", "block_name" FROM \`_pages_v_blocks_seasons\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_seasons\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_seasons\` RENAME TO \`_pages_v_blocks_seasons\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_order_idx\` ON \`_pages_v_blocks_seasons\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_parent_id_idx\` ON \`_pages_v_blocks_seasons\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_path_idx\` ON \`_pages_v_blocks_seasons\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_winter_winter_image_idx\` ON \`_pages_v_blocks_seasons\` (\`winter_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_seasons_summer_summer_image_idx\` ON \`_pages_v_blocks_seasons\` (\`summer_image_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_surroundings\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`map_id\` integer,
  	\`limit\` numeric DEFAULT 6,
  	\`anchor\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`map_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_surroundings\`("_order", "_parent_id", "_path", "id", "map_id", "limit", "anchor", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "map_id", "limit", "anchor", "_uuid", "block_name" FROM \`_pages_v_blocks_surroundings\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_surroundings\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_surroundings\` RENAME TO \`_pages_v_blocks_surroundings\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_surroundings_order_idx\` ON \`_pages_v_blocks_surroundings\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_surroundings_parent_id_idx\` ON \`_pages_v_blocks_surroundings\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_surroundings_path_idx\` ON \`_pages_v_blocks_surroundings\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_surroundings_map_idx\` ON \`_pages_v_blocks_surroundings\` (\`map_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_story\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_path\` text NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer,
  	\`image_position\` text DEFAULT 'end',
  	\`anchor\` text,
  	\`_uuid\` text,
  	\`block_name\` text,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_pages_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_story\`("_order", "_parent_id", "_path", "id", "image_id", "image_position", "anchor", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "image_id", "image_position", "anchor", "_uuid", "block_name" FROM \`_pages_v_blocks_story\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_story\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_story\` RENAME TO \`_pages_v_blocks_story\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_order_idx\` ON \`_pages_v_blocks_story\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_parent_id_idx\` ON \`_pages_v_blocks_story\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_path_idx\` ON \`_pages_v_blocks_story\` (\`_path\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_story_image_idx\` ON \`_pages_v_blocks_story\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_testimonials\` (
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
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_testimonials\`("_order", "_parent_id", "_path", "id", "anchor", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "anchor", "_uuid", "block_name" FROM \`_pages_v_blocks_testimonials\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_testimonials\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_testimonials\` RENAME TO \`_pages_v_blocks_testimonials\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_order_idx\` ON \`_pages_v_blocks_testimonials\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_parent_id_idx\` ON \`_pages_v_blocks_testimonials\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_testimonials_path_idx\` ON \`_pages_v_blocks_testimonials\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_offers_news\` (
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
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_offers_news\`("_order", "_parent_id", "_path", "id", "anchor", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "anchor", "_uuid", "block_name" FROM \`_pages_v_blocks_offers_news\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_offers_news\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_offers_news\` RENAME TO \`_pages_v_blocks_offers_news\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offers_news_order_idx\` ON \`_pages_v_blocks_offers_news\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offers_news_parent_id_idx\` ON \`_pages_v_blocks_offers_news\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_offers_news_path_idx\` ON \`_pages_v_blocks_offers_news\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_booking_invite\` (
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
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_booking_invite\`("_order", "_parent_id", "_path", "id", "anchor", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "anchor", "_uuid", "block_name" FROM \`_pages_v_blocks_booking_invite\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_booking_invite\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_booking_invite\` RENAME TO \`_pages_v_blocks_booking_invite\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_invite_order_idx\` ON \`_pages_v_blocks_booking_invite\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_invite_parent_id_idx\` ON \`_pages_v_blocks_booking_invite\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_booking_invite_path_idx\` ON \`_pages_v_blocks_booking_invite\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_gallery\` (
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
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_gallery\`("_order", "_parent_id", "_path", "id", "anchor", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "anchor", "_uuid", "block_name" FROM \`_pages_v_blocks_gallery\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_gallery\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_gallery\` RENAME TO \`_pages_v_blocks_gallery\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_order_idx\` ON \`_pages_v_blocks_gallery\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_parent_id_idx\` ON \`_pages_v_blocks_gallery\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_gallery_path_idx\` ON \`_pages_v_blocks_gallery\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_faq\` (
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
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_faq\`("_order", "_parent_id", "_path", "id", "anchor", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "anchor", "_uuid", "block_name" FROM \`_pages_v_blocks_faq\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_faq\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_faq\` RENAME TO \`_pages_v_blocks_faq\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_order_idx\` ON \`_pages_v_blocks_faq\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_parent_id_idx\` ON \`_pages_v_blocks_faq\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_faq_path_idx\` ON \`_pages_v_blocks_faq\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_rich_text\` (
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
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_rich_text\`("_order", "_parent_id", "_path", "id", "anchor", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "anchor", "_uuid", "block_name" FROM \`_pages_v_blocks_rich_text\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_rich_text\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_rich_text\` RENAME TO \`_pages_v_blocks_rich_text\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_order_idx\` ON \`_pages_v_blocks_rich_text\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_parent_id_idx\` ON \`_pages_v_blocks_rich_text\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_rich_text_path_idx\` ON \`_pages_v_blocks_rich_text\` (\`_path\`);`)
  await db.run(sql`CREATE TABLE \`__new__pages_v_blocks_hosts\` (
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
  await db.run(sql`INSERT INTO \`__new__pages_v_blocks_hosts\`("_order", "_parent_id", "_path", "id", "anchor", "_uuid", "block_name") SELECT "_order", "_parent_id", "_path", "id", "anchor", "_uuid", "block_name" FROM \`_pages_v_blocks_hosts\`;`)
  await db.run(sql`DROP TABLE \`_pages_v_blocks_hosts\`;`)
  await db.run(sql`ALTER TABLE \`__new__pages_v_blocks_hosts\` RENAME TO \`_pages_v_blocks_hosts\`;`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_order_idx\` ON \`_pages_v_blocks_hosts\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_parent_id_idx\` ON \`_pages_v_blocks_hosts\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_pages_v_blocks_hosts_path_idx\` ON \`_pages_v_blocks_hosts\` (\`_path\`);`)
}
