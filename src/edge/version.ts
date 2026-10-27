// Wersja treści dla bufora stron (src/edge/pages.ts): znacznik czasu w R2, podbijany po każdym zapisie w panelu.
// Nowa wersja zmienia klucz bufora, więc zmiana z panelu jest widoczna od następnego wejścia, bez czyszczenia CDN.

export const VERSION_KEY = '_bufor/wersja'

type Bucket = Pick<R2Bucket, 'get' | 'put'>

let memo: { value: string; until: number } | null = null

/** Bieżąca wersja; w izolacie pamiętana kilka sekund, żeby nie pytać R2 przy każdym żądaniu. */
export async function contentVersion(bucket: Bucket, now = Date.now()): Promise<string> {
  if (memo && memo.until > now) return memo.value
  let value = '0'
  try {
    value = (await (await bucket.get(VERSION_KEY))?.text()) ?? '0'
  } catch {}
  memo = { value, until: now + 5000 }
  return value
}

export async function bumpContentVersion(bucket: Bucket) {
  const value = Date.now().toString(36)
  await bucket.put(VERSION_KEY, value)
  memo = { value, until: Date.now() + 5000 }
}

// Strona złożona przy awarii bazy (zastępniki zamiast treści) nie może trafić do bufora. Odczyt treści (src/lib/cms.ts)
// zaznacza błąd w izolacie, a bufor stron nie zapisuje strony, w trakcie której składania pojawił się błąd.
const CMS_ERROR = Symbol.for('matygowa.cmsError')
type Marked = { [CMS_ERROR]?: number }

export function markCmsError() {
  ;(globalThis as Marked)[CMS_ERROR] = Date.now()
}

export const cmsErrorSince = (since: number) => ((globalThis as Marked)[CMS_ERROR] ?? 0) >= since
