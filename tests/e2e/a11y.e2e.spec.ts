import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// Bramka jakości z koncepcji: axe bez błędów poważnych (serious, critical) na kluczowych stronach, WCAG 2.1 AA.
const PAGES = ['/', '/domy', '/domy/hawran', '/sauna-i-bania', '/okolica', '/oferty', '/osada', '/galeria', '/przewodnik', '/kontakt', '/en']

test.describe('Dostępność (axe)', () => {
  for (const path of PAGES) {
    test(`${path} bez poważnych błędów`, async ({ page }) => {
      test.setTimeout(120_000)
      await page.goto(path)
      // baner zgód zasłania stronę przy pierwszym wejściu; sprawdzamy stronę po wyborze
      await page.getByRole('button', { name: 'Tylko niezbędne' }).click({ timeout: 5_000 }).catch(() => {})
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
      const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      expect(serious.map((v) => `${v.id}: ${v.help} (${v.nodes.length}) ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])
    })
  }
})
