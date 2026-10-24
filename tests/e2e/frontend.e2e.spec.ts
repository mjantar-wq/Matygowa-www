import { expect, test } from '@playwright/test'

test.describe('Szkielet strony', () => {
  test('strona główna PL ma hero, pasek rezerwacji i menu', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'pl')
    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sprawdź termin' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Domy i apartamenty' })).toBeVisible()
  })

  test('wersja EN i przełącznik języka zachowuje podstronę', async ({ page }) => {
    await page.goto('/domy')
    await page.getByRole('link', { name: /^EN/ }).click()
    await expect(page).toHaveURL(/\/en\/houses$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  })

  test('wszystkie podstrony menu odpowiadają', async ({ request }) => {
    for (const path of ['/rytualy', '/okolica', '/oferty', '/aktualnosci', '/osada', '/galeria', '/przewodnik', '/kontakt', '/en/rituals', '/en/contact']) {
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
