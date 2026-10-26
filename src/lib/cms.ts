import 'server-only'
import config from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload, type CollectionSlug, type TypedLocale, type Where } from 'payload'
import { cache } from 'react'
import type { Locale } from '@/i18n/locales'

/**
 * Odczyt treści z Payload (Local API, bez HTTP). Podgląd wersji roboczych: tryb draft Next.js.
 * Błąd bazy nie może położyć strony: wtedy zwracamy pustą treść i szkielet pokazuje zastępniki.
 */
export const payload = cache(() => getPayload({ config }))

async function isDraft() {
  try {
    return (await draftMode()).isEnabled
  } catch {
    return false
  }
}

/** Kolejność domów i apartamentów z panelu (pole „Kolejność”); przy równych numerach decyduje nazwa. */
export const UNIT_ORDER = ['order', 'name']

export async function findMany<T>(collection: CollectionSlug, locale: Locale, opts: { where?: Where; limit?: number; sort?: string | string[]; depth?: number } = {}) {
  try {
    const draft = await isDraft()
    const res = await (await payload()).find({
      collection,
      locale: locale as TypedLocale,
      fallbackLocale: 'pl',
      draft,
      // Local API domyślnie pomija reguły dostępu: bez podglądu publiczna strona ma widzieć tylko opublikowane
      overrideAccess: draft,
      where: opts.where,
      limit: opts.limit ?? 100,
      sort: opts.sort,
      depth: opts.depth ?? 1,
      pagination: false,
    })
    return res.docs as T[]
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', msg: 'cms_find_failed', collection, err: String(err) }))
    return [] as T[]
  }
}

export async function findBySlug<T>(collection: CollectionSlug, slug: string, locale: Locale, depth = 2) {
  const docs = await findMany<T>(collection, locale, { where: { slug: { equals: slug } }, limit: 1, depth })
  return docs[0] ?? null
}

export const getSettings = cache(async (locale: Locale) => {
  try {
    return await (await payload()).findGlobal({ slug: 'settings', locale: locale as TypedLocale, fallbackLocale: 'pl', depth: 1 })
  } catch (err) {
    console.error(JSON.stringify({ level: 'error', msg: 'cms_settings_failed', err: String(err) }))
    return null
  }
})
