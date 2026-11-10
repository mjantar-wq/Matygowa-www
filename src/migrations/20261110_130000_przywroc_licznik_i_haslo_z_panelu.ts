import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'

/**
 * Cofnięcie przypadkowego powrotu starej treści na stronie głównej (10.11.2026).
 * Zapis strony głównej z panelu (09:56 i 11:19) wysłał z otwartej wcześniej zakładki stare polskie wartości:
 * licznik „942 m” + „n.p.m., tu, w osadzie” oraz hasło „Dwie pory roku, ten sam widok”. Angielska wersja została nowa.
 * Przywracamy nowe wartości z #189 i #190 tylko tam, gdzie nadal stoi dokładnie stara treść
 * (jeśli ktoś zmienił tekst w panelu na inny, zostaje bez zmian). Dotyczy opublikowanej treści i najnowszej wersji.
 */
const OLD_LABELS = ['n.p.m., tu, w osadzie', 'above sea level, right here']
const OLD_HEADING = 'Dwie pory roku, ten sam widok'
const NEW_HEADING = 'Widok, który możesz odkrywać na nowo o każdej porze roku'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  for (const p of ['pages', '_pages_v']) {
    const stats = `${p}_blocks_intro_stats`
    const seasons = `${p}_blocks_seasons`
    const scope = p === 'pages' ? '' : ` AND _parent_id IN (SELECT id FROM \`_pages_v\` WHERE latest = 1)`
    const introIds = `SELECT id FROM \`${p}_blocks_intro\` WHERE 1 = 1${p === 'pages' ? '' : ` AND _parent_id IN (SELECT id FROM \`_pages_v\` WHERE latest = 1)`}`
    await db.run(sql.raw(`UPDATE \`${stats}_locales\` SET label = '' WHERE label IN (${OLD_LABELS.map((l) => `'${l}'`).join(', ')}) AND _parent_id IN (SELECT id FROM \`${stats}\` WHERE value = '942 m' AND _parent_id IN (${introIds}))`))
    await db.run(sql.raw(`UPDATE \`${stats}\` SET value = '942 m n.p.m.' WHERE value = '942 m' AND _parent_id IN (${introIds})`))
    await db.run(sql.raw(`UPDATE \`${seasons}_locales\` SET heading = '${NEW_HEADING}' WHERE _locale = 'pl' AND heading = '${OLD_HEADING}' AND _parent_id IN (SELECT id FROM \`${seasons}\` WHERE 1 = 1${scope})`))
  }
}

export async function down({ db: _db }: MigrateDownArgs): Promise<void> {}
