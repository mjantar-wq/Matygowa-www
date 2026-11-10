// Wersja treści dla bufora stron (src/edge/pages.ts): znacznik czasu w R2, podbijany po każdym zapisie w panelu.
// Nowa wersja zmienia klucz bufora, więc zmiana z panelu jest widoczna od następnego wejścia, bez czyszczenia CDN.

export const VERSION_KEY = '_bufor/wersja'

type Bucket = Pick<R2Bucket, 'get' | 'put'>

let memo: { value: string; until: number; at: number } | null = null
/** Po tylu ms od odczytu wersja jest jeszcze używana od ręki, a odświeża się w tle (gość nie czeka na R2). */
const SOFT_MS = 5000
/** Starszej niż to wersji nie używamy bez ponownego odczytu: zmiana z panelu dotrze do gości najpóźniej po tym czasie. */
const HARD_MS = 60_000

async function readVersion(bucket: Bucket, now: number): Promise<string> {
  let value = '0'
  try {
    value = (await (await bucket.get(VERSION_KEY))?.text()) ?? '0'
  } catch {}
  memo = { value, until: now + SOFT_MS, at: now }
  return value
}

/**
 * Bieżąca wersja. W izolacie pamiętana kilka sekund; po tym czasie odpowiedź idzie od razu ze starej wartości,
 * a odczyt z R2 dzieje się w tle (`defer`), więc odczyt R2 nie wydłuża pierwszej odpowiedzi.
 */
export async function contentVersion(bucket: Bucket, now = Date.now(), defer?: (p: Promise<unknown>) => void): Promise<string> {
  if (memo && memo.until > now) return memo.value
  if (memo && defer && now - memo.at < HARD_MS) {
    const stale = memo.value
    // kolejne żądania nie zakładają drugiego odczytu, dopóki ten trwa
    memo = { ...memo, until: now + SOFT_MS }
    defer(readVersion(bucket, now))
    return stale
  }
  return readVersion(bucket, now)
}

export async function bumpContentVersion(bucket: Bucket) {
  const value = Date.now().toString(36)
  await bucket.put(VERSION_KEY, value)
  memo = { value, until: Date.now() + SOFT_MS, at: Date.now() }
}

// Strona złożona przy awarii bazy (zastępniki zamiast treści) nie może trafić do bufora. Odczyt treści (src/lib/cms.ts)
// zaznacza błąd w izolacie, a bufor stron nie zapisuje strony, w trakcie której składania pojawił się błąd.
const CMS_ERROR = Symbol.for('matygowa.cmsError')
type Marked = { [CMS_ERROR]?: number }

export function markCmsError() {
  ;(globalThis as Marked)[CMS_ERROR] = Date.now()
}

export const cmsErrorSince = (since: number) => ((globalThis as Marked)[CMS_ERROR] ?? 0) >= since
