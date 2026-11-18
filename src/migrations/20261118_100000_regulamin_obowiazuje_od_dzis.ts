import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'
import { touchPages } from '../lib/touch-pages'

/**
 * Regulamin z nowymi zasadami płatności obowiązuje od 18.11.2026 (Michał). Podmieniamy tylko dotychczasową,
 * dokładną datę we wstępie dokumentu (treść opublikowana i wersje), więc wstęp zmieniony w panelu zostaje.
 */
const TEXTS: [locale: string, from: string, to: string][] = [
  ['pl', 'Obowiązuje od: 1.12.2026 r.', 'Obowiązuje od: 18.11.2026 r.'],
  ['en', 'Effective from: 1 December 2026.', 'Effective from: 18 November 2026.'],
]
const q = (v: string) => `'${v.replace(/'/g, "''")}'`

async function swap(db: MigrateUpArgs['db'], pairs: typeof TEXTS) {
  for (const [locale, from, to] of pairs) {
    await db.run(sql.raw(`UPDATE \`pages_locales\` SET \`intro\` = ${q(to)} WHERE _locale = ${q(locale)} AND \`intro\` = ${q(from)} AND _parent_id IN (SELECT id FROM \`pages\` WHERE slug = 'regulamin')`))
    await db.run(sql.raw(`UPDATE \`_pages_v_locales\` SET \`version_intro\` = ${q(to)} WHERE _locale = ${q(locale)} AND \`version_intro\` = ${q(from)} AND _parent_id IN (SELECT id FROM \`_pages_v\` WHERE version_slug = 'regulamin')`))
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await swap(db, TEXTS)
  await touchPages(db)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await swap(db, TEXTS.map(([l, f, t]) => [l, t, f]))
  await touchPages(db)
}
