import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

// (pomocnik leży w src/lib, bo Payload uruchamia KAŻDY plik z src/migrations jako migrację)
// Migracje od 10.11.2026 13:00, które zmieniają treść stron SQL-em, muszą podbić datę aktualizacji (touchPages),
// inaczej panel nie ostrzeże o starej karcie i zapis z niej cofnie migrację.
describe('migracje treści stron', () => {
  const dir = join(process.cwd(), 'src/migrations')
  const files = readdirSync(dir).filter((f) => /^\d{8}_\d{6}_.+\.ts$/.test(f) && f >= '20261110_131000')
  for (const f of files) {
    const src = readFileSync(join(dir, f), 'utf8')
    if (!/(UPDATE|INSERT INTO|DELETE FROM)\s+\\?`?\$?\{?[^`]*pages/i.test(src)) continue
    it(`${f} wywołuje touchPages`, () => {
      expect(src).toContain('touchPages(')
    })
  }
  it('migracja przywracająca licznik jest objęta kontrolą', () => {
    expect(files).toContain('20261110_131000_przywroc_licznik_i_haslo_z_panelu.ts')
    expect(readFileSync(join(dir, '20261110_131000_przywroc_licznik_i_haslo_z_panelu.ts'), 'utf8')).toContain('touchPages(')
  })
})
