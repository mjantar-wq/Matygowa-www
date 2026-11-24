import { describe, expect, it } from 'vitest'
import { closedRobots, indexableHost, withRobotsHeader, wwwRedirect } from '../../src/edge/hosts'

const req = (url: string) => new Request(url)
const on = { SITE_INDEXABLE: 'true' }

describe('adresy strony', () => {
  it('www przenosi 301 na adres bez www z zachowaniem ścieżki i parametrów', () => {
    const res = wwwRedirect(req('https://www.matygowaosada.pl/domy/hawran?utm_source=fb&a=1'))!
    expect(res.status).toBe(301)
    expect(res.headers.get('location')).toBe('https://matygowaosada.pl/domy/hawran?utm_source=fb&a=1')
    expect(wwwRedirect(req('https://matygowaosada.pl/'))).toBeNull()
    expect(wwwRedirect(req('https://matygowa.audiowizard.pl/'))).toBeNull()
  })

  it('indeksowanie tylko na produkcji i przy SITE_INDEXABLE=true', () => {
    expect(indexableHost(req('https://matygowaosada.pl/'), on)).toBe(true)
    expect(indexableHost(req('https://matygowaosada.pl/'), {})).toBe(false)
    expect(indexableHost(req('https://matygowa.audiowizard.pl/'), on)).toBe(false)
  })

  it('adres testowy: robots.txt zamknięty i nagłówek noindex', async () => {
    const robots = closedRobots(req('https://matygowa.audiowizard.pl/robots.txt'), on)!
    expect(await robots.text()).toContain('Disallow: /')
    expect(closedRobots(req('https://matygowaosada.pl/robots.txt'), on)).toBeNull()
    expect(withRobotsHeader(req('https://matygowa.audiowizard.pl/'), on, new Response('x')).headers.get('x-robots-tag')).toBe('noindex, nofollow')
    expect(withRobotsHeader(req('https://matygowaosada.pl/'), on, new Response('x')).headers.get('x-robots-tag')).toBeNull()
  })
})
