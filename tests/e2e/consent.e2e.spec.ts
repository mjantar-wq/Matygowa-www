import { expect, test } from '@playwright/test'

test.describe('Zgody, pomiar i dokumenty', () => {
  test('baner: „Tylko niezbędne” zapisuje odmowę i nie wraca po odświeżeniu', async ({ page, context }) => {
    await page.goto('/')
    const banner = page.getByRole('dialog', { name: 'Pliki cookies' })
    await expect(banner).toBeVisible()
    await banner.getByRole('button', { name: 'Tylko niezbędne' }).click()
    await expect(banner).toBeHidden()
    const cookie = (await context.cookies()).find((c) => c.name === 'mo_zgody')
    expect(JSON.parse(decodeURIComponent(cookie!.value))).toMatchObject({ v: 1, analytics: false, marketing: false })
    await page.reload()
    await expect(page.getByRole('button', { name: 'Ustawienia cookies' })).toBeVisible()
    await expect(banner).toBeHidden()
    // ponowne otwarcie ze stopki, z wyborem kategorii
    await page.getByRole('button', { name: 'Ustawienia cookies' }).click()
    await banner.getByLabel(/Analityczne/).check()
    await banner.getByRole('button', { name: 'Zapisz wybór' }).click()
    const updated = (await context.cookies()).find((c) => c.name === 'mo_zgody')
    expect(JSON.parse(decodeURIComponent(updated!.value))).toMatchObject({ analytics: true, marketing: false })
  })

  test('pasek rezerwacji przekazuje UTM z pierwszego wejścia do silnika', async ({ page }) => {
    await page.goto('/?utm_source=newsletter&utm_medium=email&utm_campaign=zima')
    await page.goto('/domy')
    await page.goto('/')
    const form = page.locator('form.mo-booking').first()
    await expect(form.locator('input[type=hidden][name=utm_source]')).toHaveValue('newsletter')
    await expect(form.locator('input[type=hidden][name=utm_campaign]')).toHaveValue('zima')
  })

  test('dokumenty PL i EN są dostępne', async ({ request }) => {
    test.setTimeout(120_000)
    for (const path of ['/regulamin', '/prywatnosc', '/dokumenty/cookies', '/en/terms', '/en/privacy', '/en/documents/cookies']) {
      const res = await request.get(path)
      expect(res.status(), path).toBe(200)
    }
  })
})
