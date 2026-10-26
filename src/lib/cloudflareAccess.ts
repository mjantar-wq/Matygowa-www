/**
 * Lista e-maili w polityce Cloudflare Access bramki /panel („Redakcja”) idzie za kontami panelu:
 * nowe konto dopisuje swój e-mail, usunięte konto go wykreśla, zmiana e-maila podmienia wpis.
 * Wpisy dodane ręcznie w Cloudflare zostają nietknięte; adresów z CF_ACCESS_KEEP_EMAILS synchronizacja nigdy nie wykreśla.
 *
 * Konfiguracja Workera: CF_ACCESS_ACCOUNT_ID i CF_ACCESS_POLICY_ID (vars; CF_ACCESS_APP_ID tylko dla polityki
 * przypisanej do jednej aplikacji, a nie wielokrotnego użytku), CF_ACCESS_API_TOKEN (sekret,
 * token z jednym uprawnieniem „Access: Apps and Policies – Edit”). Bez nich synchronizacja jest wyłączona.
 */
type Rule = { email?: { email?: string } } & Record<string, unknown>
type Policy = { include?: Rule[] } & Record<string, unknown>

const norm = (e?: string | null) => (e ?? '').trim().toLowerCase()

export async function syncAccessEmail(add: string | null, remove: string | null): Promise<void> {
  const account = process.env.CF_ACCESS_ACCOUNT_ID
  const policyId = process.env.CF_ACCESS_POLICY_ID
  const token = process.env.CF_ACCESS_API_TOKEN
  if (!account || !policyId || !token) return
  const keep = (process.env.CF_ACCESS_KEEP_EMAILS ?? '').split(',').map(norm).filter(Boolean)
  const [a, r0] = [norm(add), norm(remove)]
  // adresy z listy stałej (właściciel) zostają w bramce, nawet gdy ktoś usunie konto panelu o tym samym e-mailu
  const r = keep.includes(r0) ? '' : r0
  if (a === r) return

  const app = process.env.CF_ACCESS_APP_ID
  const url = `https://api.cloudflare.com/client/v4/accounts/${account}/access/${app ? `apps/${app}/` : ''}policies/${policyId}`
  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  const got = (await (await fetch(url, { headers })).json()) as { success: boolean; result?: Policy; errors?: unknown }
  if (!got.success || !got.result) throw new Error(`Cloudflare Access: odczyt polityki ${JSON.stringify(got.errors)}`)

  const include = (got.result.include ?? []).filter((x) => !r || norm(x.email?.email) !== r)
  if (a && !include.some((x) => norm(x.email?.email) === a)) include.push({ email: { email: a } })
  // pusta lista zamknęłaby panel wszystkim
  if (!include.length) return

  const { id: _id, created_at: _c, updated_at: _u, app_count: _n, reusable: _r, ...rest } = got.result
  const put = (await (await fetch(url, { method: 'PUT', headers, body: JSON.stringify({ ...rest, include }) })).json()) as {
    success: boolean
    errors?: unknown
  }
  if (!put.success) throw new Error(`Cloudflare Access: zapis polityki ${JSON.stringify(put.errors)}`)
}
