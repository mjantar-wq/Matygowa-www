import { describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

describe('znaczniki warunków z IceColdRes', async () => {
  const { fillText, fillTree, termVars } = await import('@/lib/terms')
  const vars = { checkin: '15:00', deposit: '30%', balance: '14' }

  it('podmienia znane znaczniki, brakujące i obce zostawia', () => {
    expect(fillText('Przyjazd od {checkin}, zaliczka {deposit}, dopłata {balance} dni, {freeCancellation}, {inne}', vars)).toBe(
      'Przyjazd od 15:00, zaliczka 30%, dopłata 14 dni, {freeCancellation}, {inne}',
    )
  })

  it('w drzewie Lexical tylko w polach text, bez zmiany oryginału', () => {
    const tree = { root: { children: [{ type: 'paragraph', children: [{ type: 'text', text: 'Od {checkin}' }] }] } }
    const out = fillTree(tree, vars)
    expect(out.root.children[0]!.children[0]!.text).toBe('Od 15:00')
    expect(tree.root.children[0]!.children[0]!.text).toBe('Od {checkin}')
  })

  it('wartości z oferty standardowej i godzin obiektu', async () => {
    vi.stubGlobal('fetch', async () =>
      Response.json({
        property: { checkInTime: '15:00', checkOutTime: '10:30' },
        offers: [
          { id: 'flex', terms: { depositBp: 2000, balanceDueDaysBeforeArrival: 7, freeCancellationDays: 7, text: { pl: 'x' } } },
          { id: 'standard', terms: { depositBp: 5000, balanceDueDaysBeforeArrival: 14, freeCancellationDays: 60, text: { pl: 'Zadatek 50%.', en: 'Deposit 50%.' } } },
        ],
      }),
    )
    expect(await termVars('en')).toEqual({ checkin: '15:00', checkout: '10:30', deposit: '50%', balance: '14', freeCancellation: '60', terms: 'Deposit 50%.' })
    vi.unstubAllGlobals()
  })
})
