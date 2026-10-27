import { expect, test } from '@playwright/test'

test.describe('Szkielet strony', () => {
  test('strona główna PL ma hero, pasek rezerwacji i menu', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('lang', 'pl')
    await expect(page.locator('h1').first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sprawdź termin' }).first()).toBeVisible()
    await expect(page.getByRole('link', { name: 'Domki i apartamenty' })).toBeVisible()
  })

  test('pasek rezerwacji: liczbę dzieci wpisuje się i kasuje tak samo jak liczbę osób', async ({ page }) => {
    await page.goto('/')
    const guests = page.getByRole('combobox', { name: 'Liczba osób' }).first()
    const children = page.getByRole('combobox', { name: 'W tym dzieci' }).first()
    // bez domyślnego 0 do kasowania (Michał, 26.10.2026)
    await expect(children).toHaveValue('')
    await guests.fill('4')
    await guests.press('Enter')
    await children.fill('2')
    await children.press('Enter')
    await expect(page.getByRole('group', { name: 'Wiek dzieci' }).first().getByRole('combobox')).toHaveCount(2)
    await children.fill('1')
    await children.press('Enter')
    await expect(page.getByRole('group', { name: 'Wiek dzieci' }).first().getByRole('combobox')).toHaveCount(1)
    await children.fill('')
    await children.press('Enter')
    await expect(children).toHaveValue('')
    await expect(page.getByRole('group', { name: 'Wiek dzieci' })).toHaveCount(0)
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

  test('SEO: tytuł i opis strony głównej, obraz do udostępnień, dane strukturalne i mapa witryny', async ({ page, request }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Matygowa Osada/)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/)
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /^https?:\/\//)
    await page.goto('/domy/hawran')
    // nazwa osady tylko raz, także gdy tytuł z panelu już ją zawiera
    expect((await page.title()).match(/Matygowa Osada/g)?.length).toBe(1)
    expect(await page.locator('script[type="application/ld+json"]').allTextContents()).toContainEqual(expect.stringContaining('"VacationRental"'))
    await page.goto('/przewodnik')
    expect(await page.locator('script[type="application/ld+json"]').allTextContents()).toContainEqual(expect.stringContaining('"FAQPage"'))
    await expect(page.locator('main')).not.toContainText('{freeCancellation}')
    const sitemap = await request.get('/sitemap.xml')
    expect(sitemap.status()).toBe(200)
    expect(await sitemap.text()).toContain('/domy/hawran')
  })

  test('galeria pokazuje serie zdjęć, bez notatek dla redaktora', async ({ page }) => {
    await page.goto('/galeria')
    await expect(page.getByRole('heading', { level: 2, name: 'Zima' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'Wnętrza' })).toBeVisible()
    await expect(page.locator('main')).not.toContainText('Panel →')
  })

  test('kontakt prowadzi do trasy dojazdu i wskazówek na zimę', async ({ page }) => {
    await page.goto('/kontakt')
    const route = page.locator('main').getByRole('link', { name: 'Wyznacz trasę' })
    await expect(route).toHaveAttribute('href', /google\.com\/maps\/dir\/.*Matyg%C3%B3wka/)
    await expect(route).toHaveAttribute('target', '_blank')
    await expect(page.locator('main')).toContainText('Dojazd zimą')
    await expect(page.locator('main')).toContainText('łańcuchy śniegowe')
  })

  test('wewnętrzny adres /pl/houses przekierowuje na /domy', async ({ request }) => {
    const res = await request.get('/pl/houses', { maxRedirects: 0 })
    expect(res.status()).toBe(308)
    expect(res.headers().location).toBe('/domy')
  })
})

test.describe('Efekty i interakcje', () => {
  test('przełącznik Dzień / Noc zmienia nastrój strony i go pamięta', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Noc' }).first().click()
    await expect(page.locator('html')).toHaveAttribute('data-pora', 'noc')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-pora', 'noc')
    await page.getByRole('button', { name: 'Lato' }).first().click()
    await expect(page.locator('html')).toHaveAttribute('data-sezon', 'lato')
  })

  test('bez ruchu hero nie ładuje filmu', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' })
    const page = await ctx.newPage()
    await page.goto('/')
    await page.waitForLoadState('load')
    await page.waitForTimeout(800)
    const sources = await page.locator('.mo-hero video, .mo-stage video').evaluateAll((vs) => vs.map((v) => (v as HTMLVideoElement).currentSrc))
    expect(sources.every((s) => !s)).toBe(true)
    await ctx.close()
  })

  test('strona główna: scena zmienia się z rozdziałem', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    const first = await page.locator('.mo-stage__scene[data-active]').getAttribute('data-kind')
    expect(first).toBe('media')
    await page.locator('[data-block="peaksPanorama"] [data-step]').first().scrollIntoViewIfNeeded()
    await page.evaluate(() => scrollBy(0, 1))
    await expect(page.locator('.mo-stage__scene[data-active]')).toHaveAttribute('data-kind', 'panorama')
  })

  test('hero: film tylko latem za dnia, bez przycisku pauzy', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.mo-hero__slide:not(.is-dzien-lato) video')).toHaveCount(0)
    await expect(page.locator('.mo-hero__slide.is-dzien-lato video')).toHaveCount(1)
    await expect(page.locator('.mo-hero__pause')).toHaveCount(0)
  })

  test('mapa osady: ukryty przycisk (klawiatura) otwiera okno domu z odnośnikiem do karty', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    const button = page.locator('.mo-map .mo-hotspots button').first()
    await button.evaluate((el) => el.scrollIntoView({ block: 'center' }))
    await button.focus()
    await expect(button).toBeVisible()
    await page.keyboard.press('Enter')
    const dialog = page.locator('dialog.mo-map-dialog[open]')
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('a.mo-btn')).toHaveAttribute('href', /^\/(domy|en\/houses)\//)
    await page.keyboard.press('Escape')
    await expect(dialog).toHaveCount(0)
  })

  test('strona główna: przypięty przycisk otwiera pasek rezerwacji, gdy hero zniknie z ekranu', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')
    const open = page.locator('.mo-dock__open')
    await expect(page.locator('.mo-dock')).not.toHaveAttribute('data-shown')
    await page.locator('[data-block="houseInside"]').scrollIntoViewIfNeeded()
    await expect(page.locator('.mo-dock')).toHaveAttribute('data-shown')
    await open.click()
    await expect(page.locator('.mo-dock__dialog .mo-booking')).toBeVisible()
    // długie wyniki przewijają się wewnątrz okna, a jego dół mieści się na ekranie
    const body = await page.locator('.mo-dock__body').boundingBox()
    expect(body!.y + body!.height).toBeLessThanOrEqual(800)
    expect(await page.locator('.mo-dock__body').evaluate((el) => getComputedStyle(el).overflowY)).toBe('auto')
    await expect(page.locator('.mo-dock__close')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.locator('.mo-dock__dialog')).not.toBeVisible()
  })
})

test('logo na stronie głównej przewija na samą górę i czyści kotwicę', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/en')
  const banner = page.getByRole('dialog', { name: /cookies/i })
  if (await banner.isVisible()) await banner.getByRole('button').first().click()
  await page.evaluate(() => {
    history.replaceState(null, '', '/en#test')
    window.scrollTo(0, 1500)
  })
  await page.locator('.mo-logo').click()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  expect(new URL(page.url()).pathname + new URL(page.url()).hash).toBe('/en')
})
