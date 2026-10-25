import { expect, test } from '@playwright/test'

test.describe('Szkielet strony', () => {
  test('strona główna PL ma hero, pasek rezerwacji i menu', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'pl')
    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sprawdź termin' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Domki i apartamenty' })).toBeVisible()
  })

  test('wersja EN i przełącznik języka zachowuje podstronę', async ({ page }) => {
    await page.goto('/domy')
    await page.getByRole('link', { name: /^EN/ }).click()
    await expect(page).toHaveURL(/\/en\/houses$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })

  test('wszystkie podstrony menu odpowiadają', async ({ request }) => {
    // w trybie dev każda podstrona kompiluje się przy pierwszym wejściu
    test.setTimeout(120_000)
    for (const path of ['/sauna-i-bania', '/okolica', '/oferty', '/aktualnosci', '/osada', '/galeria', '/przewodnik', '/kontakt', '/en/sauna-and-hot-tub', '/en/guest-guide', '/en/contact']) {
      const res = await request.get(path)
      expect(res.status(), path).toBe(200)
    }
  })

  test('wewnętrzny adres /pl/houses przekierowuje na /domy', async ({ request }) => {
    const res = await request.get('/pl/houses', { maxRedirects: 0 })
    expect(res.status()).toBe(308)
    expect(res.headers().location).toBe('/domy')
  })
})
