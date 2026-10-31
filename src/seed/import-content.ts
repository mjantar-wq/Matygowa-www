/**
 * Import treści roboczych z content/ (format wątku treści: pola {pl, en}, długi tekst w Markdown)
 * do panelu. Uruchomienie: pnpm seed (lokalnie) albo z PAYLOAD_REMOTE_BINDINGS=true na środowisku testowym.
 * Import jest idempotentny: wpis o tym samym adresie (slug) jest aktualizowany, nie dublowany.
 */
import fs from 'node:fs'
import path from 'node:path'
import config from '@payload-config'
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { getPayload, type CollectionSlug, type Payload } from 'payload'

type L = { pl?: string; en?: string } | null | undefined
type Any = Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any

const DIR = process.env.CONTENT_DIR ?? path.resolve(process.cwd(), 'content')
const LOCALES = ['pl', 'en'] as const
type Loc = (typeof LOCALES)[number]

const read = (file: string) => JSON.parse(fs.readFileSync(path.join(DIR, file), 'utf8'))

// Import partiami: IMPORT_ONLY=attractions (albo np. units,offers) wgrywa nowe pliki z manifestu i tylko te kolekcje.
// „pages” to strony, opinie, dokumenty, aktualności i ustawienia; „news” same aktualności, „testimonials” same opinie. Bez zmiennej import obejmuje wszystko.
const only = new Set((process.env.IMPORT_ONLY ?? '').split(',').map((k) => k.trim()).filter(Boolean))
const want = (key: 'units' | 'attractions' | 'offers' | 'pages' | 'news' | 'testimonials') =>
  !only.size || only.has(key) || ((key === 'news' || key === 'testimonials') && only.has('pages'))

async function main() {
  const payload = await getPayload({ config })
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const md = (text?: string | null) => (text ? convertMarkdownToLexical({ editorConfig, markdown: text }) : null)

  // content/media/manifest.json: prawdziwe zdjęcia (*_foto, placeholder: false, alt PL/EN z manifestu)
  // stoją przed CGI, więc byPrefix wybiera je pierwsze. CGI zawsze isPlaceholder = true.
  // Plik o tej samej nazwie nie jest wgrywany drugi raz.
  const media = new Map<string, number | string>()
  const manifestPath = path.join(DIR, 'media', 'manifest.json')
  for (const item of fs.existsSync(manifestPath) ? (JSON.parse(fs.readFileSync(manifestPath, 'utf8')).items as Any[]) : []) {
    const filename: string = item.file
    const stem = filename.replace(/\.[^.]+$/, '')
    const describe = stem.replace(/^[A-Z]+\d+_/, '').replace(/_(\d+x\d+_)?cgi$/, '').replace(/[_-]+/g, ' ')
    const found = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1, depth: 0 })
    let id = found.docs[0]?.id
    // „series” w manifeście zastępuje reguły z nazwy pliku, np. taras i balkon z serii wnętrz idą do pory roku ze zdjęcia
    // (Michał, 26.10.2026); sauna i bania (także z serii wnętrz i zimy) trafiają do „Sauna i bania”
    const ritual = /^B\d/.test(stem) || (!/^A_/.test(stem) && /sauna|bani|balia/.test(stem))
    const series = (item.series as string[] | undefined) ?? [
      /_lato_/.test(stem) ? 'summer' : /^[KT]/.test(stem) ? 'winter' : null,
      /_noc_|gwiazdy/.test(stem) ? 'night' : null,
      /^[VW]\d/.test(stem) && !ritual ? 'interiors' : null,
      ritual ? 'rituals' : null,
      /^A_/.test(stem) ? 'surroundings' : null,
    ].filter(Boolean)
    if (!id) {
      const real = item.placeholder === false
      id = (
        await payload.create({
          collection: 'media',
          locale: 'pl',
          filePath: path.join(DIR, 'media', filename),
          data: real
            ? { alt: item.alt.pl, isPlaceholder: false, series, caption: item.credit?.pl, rights: item.rights }
            : { alt: `Wizualizacja tymczasowa: ${describe}`, isPlaceholder: true, series, caption: item.note },
        } as never) as Any
      ).id
      await payload.update({ collection: 'media', id, locale: 'en', data: { alt: real ? item.alt.en : `Temporary visualisation: ${describe}`, ...(real && item.credit ? { caption: item.credit.en } : {}) } })
    } else if (series.some((x) => !found.docs[0]?.series?.includes(x as never))) {
      // plik wgrany przed dodaniem serii (albo przed nową regułą): dopisujemy brakujące serie, nie usuwając tych z panelu.
      // Przy tej jednorazowej zmianie zdejmujemy „Wnętrza” ze zdjęć, które reguły z niej wyjęły; dodane później w panelu zostają.
      const existing = (found.docs[0]?.series ?? []) as string[]
      // Pora roku podana w manifeście też zdejmuje tę z nazwy pliku, np. letni zmierzch K4 i punkt widokowy K8 z Zimy (Michał, 28.10.2026).
      const season = (x: string) => x === 'winter' || x === 'summer'
      const kept = existing.filter(
        (x) => (x !== 'interiors' || !/^[VW]\d/.test(stem) || series.includes(x)) && (!item.series || !season(x) || series.includes(x)),
      )
      await payload.update({ collection: 'media', id, locale: 'pl', data: { series: [...new Set([...kept, ...series])] } as never })
    }
    if (id && found.docs[0] && item.rights && found.docs[0].rights !== item.rights) {
      // zgoda obiektu przyszła po wgraniu pliku: manifest zmienia prawa i podpis bez ponownego wgrywania
      await payload.update({ collection: 'media', id, locale: 'pl', data: { rights: item.rights, caption: item.credit?.pl } })
      if (item.credit?.en) await payload.update({ collection: 'media', id, locale: 'en', data: { caption: item.credit.en } })
    }
    media.set(filename, id)
  }
  /** Id zdjęcia (webp) albo filmu (mp4) po początku nazwy pliku, np. img('V1_'), video('K2_hero_osada_swit_16x9'). */
  const byPrefix = (prefix: string, ext: string) => {
    const key = [...media.keys()].find((k) => k.startsWith(prefix) && k.endsWith(ext))
    return key ? media.get(key) : undefined
  }
  const img = (prefix: string) => byPrefix(prefix, '.webp')
  const video = (prefix: string) => byPrefix(prefix, '.mp4')
  if (media.size) payload.logger.info(`media: ${media.size} plików`)

  /** Zapis wpisu w obu językach: najpierw PL (tworzy), potem EN (uzupełnia tłumaczenia). */
  async function upsert(collection: CollectionSlug, slug: string, build: (l: Loc) => Any, keep: string[] = []) {
    const existing = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0, draft: true })
    let id = existing.docs[0]?.id
    for (const locale of LOCALES) {
      let data = { _status: 'published', ...build(locale), slug } as Any
      if (id) {
        // bloki i listy są wspólne dla języków: bez ich id zapis EN utworzyłby nowe wiersze i skasował teksty PL
        const current = await payload.findByID({ collection, id, locale: 'pl', depth: 0, draft: true } as never)
        data = withIds(data, current)
        // pola ustawiane w panelu (np. kolejność domów) import tylko zakłada, nie nadpisuje
        for (const key of keep) delete data[key]
        await payload.update({ collection, id, locale, data, draft: false } as never)
      } else id = ((await payload.create({ collection, locale, data, draft: false } as never)) as Any).id
    }
    payload.logger.info(`${collection}: ${slug}`)
  }

  const peaks: Any[] = read('peaks.json')
  const units: Any[] = read('units.json')
  // własne zdjęcia domków z sesji (Łomnica, Lodowy, Wołoszyn); pozostałe domy mają kadr domu i wspólne wnętrza
  const unitPhotos: Record<string, { hero: string; gallery: string[] }> = fs.existsSync(path.join(DIR, 'unit-photos.json')) ? read('unit-photos.json') : {}
  for (const u of want('units') ? units : []) {
    const peak = peaks.find((p) => p.slug === u.peak) ?? {}
    const slug = u.icecoldres_code || u.peak
    const vShot = ['hawran', 'gerlach', 'swinica', 'woloszyn', 'lomnica', 'lodowy', 'czerwone-wierchy', 'kominiarski-wierch', 'giewont', 'ciemniak'].indexOf(slug) + 1
    await upsert('units', slug, (l) => ({
      hero: unitPhotos[slug] ? media.get(unitPhotos[slug].hero) : vShot ? img(`V${vShot}_`) : undefined,
      // seria zdjęć: własna sesja domku albo kadr domu i wspólne wnętrza (domy są urządzone podobnie)
      gallery: (unitPhotos[slug]
        ? [unitPhotos[slug].hero, ...unitPhotos[slug].gallery].map((f) => media.get(f))
        : [vShot ? img(`V${vShot}_`) : undefined, ...['W1_', 'W2_', 'W3_', 'W5_', 'W6_', 'W7_'].map(img)]
      ).filter(Boolean),
      name: u.name?.[l] ?? peak.name?.[l],
      kind: u.kind === 'apartment' ? 'apartment' : 'house',
      status: u.status === 'coming_soon' ? 'comingSoon' : 'bookable',
      order: u.sort ?? 0,
      icecoldresCode: u.icecoldres_code,
      tagline: u.lead?.[l],
      story: md(u.story?.[l]),
      peak: { name: peak.name?.[l], nameCases: peak.name_cases_pl, elevation: peak.elevation_m, range: peak.range?.[l], story: md(peak.story?.[l]) },
      area: u.facts?.area_m2,
      bedrooms: u.facts?.bedrooms,
      maxGuests: u.facts?.max_guests,
      bathrooms: u.facts?.bathrooms,
      separateWc: !!u.facts?.separate_wc,
      ensuiteUpstairs: !!u.facts?.ensuite_upstairs,
      beds: u.beds?.[l],
      livingRoom: u.facts?.living_room === 'upper' || u.facts?.living_room === 'first' ? 'upper' : u.facts?.living_room ? 'ground' : undefined,
      seo: { title: u.seo?.title?.[l], description: u.seo?.description?.[l] },
    }), ['order'])
  }

  // Atrakcje: ta sama lista dla sekcji na głównej (featured, krótki opis "summary") i strony Okolica
  // (opis rozszerzony "body", zdjęcia "image" i "gallery" jako nazwy plików z content/media, z podpisem licencji w manifeście).
  // "retired": true zdejmuje wpis ze strony (szkic), np. dawne zbiorcze „Termy”, zastąpione konkretnymi obiektami.
  for (const a of want('attractions') ? (read('attractions.json') as Any[]) : []) {
    await upsert('attractions', a.slug, (l) => ({
      name: a.name?.[l],
      seasons: a.season,
      category: a.category,
      description: md(a.body?.[l]),
      summary: a.summary?.[l],
      place: a.place?.[l],
      url: a.url,
      lat: a.lat,
      lng: a.lng,
      image: a.image ? media.get(a.image) : undefined,
      gallery: (a.gallery ?? []).map((f: string) => media.get(f)).filter(Boolean),
      distanceKm: a.distance_km,
      driveMinutes: a.drive_min,
      mapId: a.map_svg_id ?? null,
      featured: !!a.featured,
      ...(a.retired ? { _status: 'draft' } : {}),
    }))
  }

  let offerIndex = 0
  for (const o of want('offers') ? (read('offers.json') as Any[]) : []) {
    // "image" w offers.json (prefiks pliku z content/media) wygrywa z domyślną rotacją okładek
    const fallback = ['K6_', 'K9_', 'K2_hero_osada_noc_16x9', 'K8_', 'B6_'][offerIndex++ % 5]
    const cover = (o.image ? img(o.image) : undefined) ?? img(fallback)
    // active: false zostaje szkicem (niewidoczna); kolejność jak w offers.json
    await upsert('offers', o.slug, (l) => ({ title: o.title?.[l], image: cover, order: offerIndex, icecoldresPromotionId: o.icecoldres_promotion_id || undefined, _status: o.active === false ? 'draft' : 'published' }))
  }

  // oferty bez promocji w IceColdRes nie są pokazywane, więc usuwamy je z panelu (Michał, 25.10.2026);
  // gdy IceColdRes nie odpowiada, niczego nie usuwamy
  const api = process.env.ICECOLDRES_API_URL ?? 'https://icecoldres.audiowizard.pl'
  let promoIds: string[] | null = null
  try {
    const res = await fetch(`${api}/api/public/${process.env.ICECOLDRES_SLUG ?? 'booking'}/promotions`)
    if (res.ok) promoIds = ((await res.json()) as { promotions: { id: string }[] }).promotions.map((p) => p.id)
  } catch {
    promoIds = null
  }
  if (promoIds && want('offers')) {
    const stale = await payload.find({ collection: 'offers', limit: 0, pagination: false, depth: 0, draft: true })
    for (const o of stale.docs) {
      if (o.icecoldresPromotionId && promoIds.includes(o.icecoldresPromotionId)) continue
      await payload.delete({ collection: 'offers', id: o.id })
      console.log(`oferta ${o.slug} usunięta: brak promocji w IceColdRes`)
    }
  }

  // Aktualności: opublikowane. Wcześniej import zapisywał je jako szkice z publikacją 11.01.2027 i każdy import chował
  // wpisy opublikowane w panelu (Michał, 26.10.2026: mają być widoczne na stronie testowej). Data z news.json, ale nie
  // z przyszłości (lista i mapa strony pomijają przyszłe daty); datę z przeszłości ustawioną w panelu import zostawia.
  const today = new Date().toISOString().slice(0, 10)
  const covers: Record<string, string> = { 'apartamenty-wiosna-2027': 'V7_', 'ferie-2027': 'K9_' }
  for (const n of want('news') && fs.existsSync(path.join(DIR, 'news.json')) ? (read('news.json') as Any[]) : []) {
    const found = await payload.find({ collection: 'news', where: { slug: { equals: n.slug } }, limit: 1, depth: 0, draft: true })
    const saved = found.docs[0]?.publishedAt
    const cover = img(covers[n.slug] ?? 'K2_hero_osada_swit_16x9')
    await upsert(
      'news',
      n.slug,
      (l) => ({ title: n.title?.[l], publishedAt: n.publish < today ? n.publish : today, cover, excerpt: n.body?.[l]?.split('\n')[0], content: md(n.body?.[l]) }),
      saved && saved.slice(0, 10) <= today ? ['publishedAt'] : [],
    )
  }

  // prawdziwe opinie z Google i Booking (bez slugów: rozpoznajemy po autorze)
  for (const t of want('testimonials') && fs.existsSync(path.join(DIR, 'testimonials.json')) ? (read('testimonials.json') as Any[]) : []) {
    const found = await payload.find({ collection: 'testimonials', where: { author: { equals: t.author } }, limit: 1, depth: 0 })
    // opinie pobrane automatycznie (z externalId) mają dosłowny tekst ze źródła, import ich nie nadpisuje
    if (found.docs[0]?.externalId) continue
    let id = found.docs[0]?.id
    for (const locale of LOCALES) {
      const data = { quote: t.quote?.[locale], author: t.author, source: t.source, rating: t.rating ?? undefined, date: t.date ? `${t.date}-01`.slice(0, 10) : undefined }
      if (id) await payload.update({ collection: 'testimonials', id, locale, data })
      else id = (await payload.create({ collection: 'testimonials', locale, data })).id
    }
    payload.logger.info(`testimonials: ${t.author}`)
  }

  if (!want('pages')) {
    payload.logger.info(`Import częściowy zakończony (${[...only].join(', ')})`)
    process.exit(0)
  }

  // strona główna: bloki w kolejności szkieletu
  const home = read('pages/home.json')
  const homeBlock = (b: Any, l: Loc): Any | null => {
    const base = { eyebrow: b.eyebrow?.[l], heading: b.heading?.[l] }
    switch (b.type) {
      case 'hero':
        return { blockType: 'hero', headline: b.headline?.[l], subline: b.sub?.[l], showBookingBar: true, image: img('K12_'), video: video('K2_hero_osada_swit_16x9'), videoPortrait: video('K2_hero_osada_swit_9x16'), variants: [{ pora: 'noc', image: img('K2_hero_osada_noc_16x9'), video: video('K2_hero_osada_noc_16x9') }, { sezon: 'lato', image: img('K14_'), video: video('K14_') }] }
      case 'intro':
        return { blockType: 'intro', ...base, body: md(b.body?.[l]), stats: b.stats?.map((s: Any) => ({ value: s.value, label: s.label?.[l] })) }
      case 'peak_panorama':
        return { blockType: 'peaksPanorama', ...base, body: md(b.body?.[l]), showMap: true, image: null, map: null } // ilustracje G2 i G1 z interakcją; zdjęcie i mapa z panelu tylko jako nadpisanie
      case 'day_story':
        return { blockType: 'dayInSettlement', ...base, scenes: b.scenes?.map((s: Any, i: number) => ({ time: s.key, title: s.title?.[l], text: s.winter?.[l], summerText: s.summer?.[l], image: img(['T1_', 'K2_hero_osada_swit_16x9', 'K4_', 'T3_'][i]) })) }
      case 'house_inside':
        return { blockType: 'houseInside', ...base, body: md(b.body?.[l]), rooms: b.rooms?.map((r: Any, i: number) => ({ title: r.title?.[l], text: r.body?.[l], image: img(['W1_', 'W2_', 'W3_', 'W5_'][i] ?? 'W') })) }
      case 'rituals_teaser':
        // zapowiedź na stronie głównej: tekst ze zdjęciem bani (pełne kroki i ceny są na stronie Sauna i bania)
        return { blockType: 'story', ...base, body: md(b.body?.[l]), image: img('B1_bania_alpenglow'), imagePosition: 'start' }
      case 'seasons':
        return { blockType: 'seasons', ...base, winter: { text: b.winter?.[l], image: img('K2_hero_osada_swit_16x9') }, summer: { text: b.summer?.[l], image: img('K2_hero_osada_lato') } }
      case 'surroundings':
        return { blockType: 'surroundings', ...base, body: md(b.body?.[l]), limit: b.featured_attractions ?? 6 }
      case 'nature':
        return { blockType: 'story', ...base, body: md(b.body?.[l]), image: img('K3_'), imagePosition: 'end' }
      case 'testimonials':
        return { blockType: 'testimonials', ...base, eyebrow: b.rating_line?.[l] ?? null }
      case 'offers_news':
        return { blockType: 'offersNews', ...base }
      case 'booking_invite':
        return { blockType: 'bookingInvite', ...base, body: md(b.body?.[l]) }
      default:
        payload.logger.warn(`pominięty blok ${b.type}`)
        return null
    }
  }
  // scena w tle i warianty tekstu (koncepcja po M1): w home.json opcjonalnie
  // "scene": [{ "pora": "noc", "sezon": "zima", "image": "K2_…", "video": "K2_…" }] (prefiksy nazw plików) i
  // "variants": [{ "pora": "noc", "sezon": "lato", "heading": {pl,en}, "text": {pl,en} }]
  const withScene = (b: Any, block: Any | null, l: Loc): Any | null => {
    if (!block) return null
    const scene = (b.scene ?? []).map((r: Any) => ({ pora: r.pora, sezon: r.sezon, image: r.image ? img(r.image) : undefined, video: r.video ? video(r.video) : undefined, videoPortrait: r.videoPortrait ? video(r.videoPortrait) : undefined }))
    const textVariants = (b.variants ?? []).map((v: Any) => ({ pora: v.pora, sezon: v.sezon, heading: v.heading?.[l], text: v.text?.[l] }))
    return { ...block, ...(scene.length ? { scene } : {}), ...(textVariants.length ? { textVariants } : {}) }
  }
  await upsertPage(payload, upsert, 'home', () => ({ pl: 'Strona główna', en: 'Home' }), (l) => home.blocks.map((b: Any) => withScene(b, homeBlock(b, l), l)).filter(Boolean))

  const rytualy = read('pages/rytualy.json')
  await upsertPage(payload, upsert, 'rituals', () => rytualy.title, (l) => [
    { blockType: 'rituals', steps: rytualy.stages?.map((s: Any, i: number) => ({ word: s.word?.[l], text: s.body?.[l], image: img(['W21_sauna_domek', 'K21_balia_zima', 'B1_bania_alpenglow', 'B5_'][i] ?? 'B') })), showPrices: true },
    // same prawdziwe zdjęcia sauny i bani, bez wygenerowanych ludzi (wg Michała)
    { blockType: 'story', heading: rytualy.sauna?.title?.[l], body: md(rytualy.sauna?.body?.[l]), image: img('W51_sauna_lawy'), imagePosition: 'end' },
    { blockType: 'story', heading: rytualy.bania?.title?.[l], body: md(rytualy.bania?.body?.[l]), image: img('B1_bania_lato'), imagePosition: 'start' },
    { blockType: 'richText', body: md(rytualy.rules?.[l]) },
  ], (l) => rytualy.lead?.[l])

  const osada = read('pages/osada.json')
  await upsertPage(payload, upsert, 'settlement', () => osada.title, (l) =>
    osada.sections.flatMap((s: Any, i: number) => {
      // „Góralszczyzna dziś”: wstęp, potem każdy temat osobno, na przemian zdjęcie i tekst; zdjęcie po id tematu (O_<id>_…)
      // ma podpis autora i licencji z manifestu (CC BY / BY-SA wymaga widocznego podpisu)
      if (s.id === 'goralszczyzna' && s.items?.some((it: Any) => it.id)) {
        return [
          { blockType: 'story', anchor: s.id, heading: s.heading?.[l], body: md(s.lead?.[l]), image: s.image ? img(s.image) : undefined, imagePosition: 'end' },
          ...s.items.map((it: Any, j: number) => ({
            blockType: 'story', anchor: `${s.id}-${it.id}`, heading: it.heading?.[l],
            body: md([it.word ? `*${it.word}*: ${it.translation?.[l]}` : null, it.body?.[l]].filter(Boolean).join('\n\n')),
            image: it.id ? img(`O_${it.id}_`) : undefined, imagePosition: j % 2 ? 'end' : 'start',
          })),
          // słowniczek gwary po tematach: słowo, znaczenie i gdzie się z nim spotkacie
          ...(s.glossary?.words?.length ? [{
            blockType: 'story', anchor: `${s.id}-slowniczek`, heading: s.glossary.heading?.[l],
            body: md([s.glossary.lead?.[l], s.glossary.words.map((w: Any) => `- **${w.word}** (${w.meaning?.[l]}). ${w.context?.[l]}`).join('\n')].filter(Boolean).join('\n\n')),
            image: s.glossary.image ? img(s.glossary.image) : undefined, imagePosition: s.items.length % 2 ? 'end' : 'start',
          }] : []),
        ]
      }
      // miejsce na gospodarzy: redakcja dopisze osoby w panelu, do tego czasu sekcja jest ukryta
      if (s.id === 'gospodarze') {
        return { blockType: 'hosts', anchor: s.id, heading: s.heading?.[l], intro: s.personal_note?.[l] ?? undefined, people: (s.hosts ?? []).filter((h: Any) => h.name).map((h: Any) => ({ name: h.name, role: h.role?.[l], text: h.bio?.[l] })) }
      }
      const items = (s.items ?? []).map((it: Any) => `### ${it.heading?.[l]}\n\n*${it.word}*: ${it.translation?.[l]}\n\n${it.body?.[l]}`)
      const text = [s.lead?.[l], s.body?.[l], ...items, s.signature?.[l] ? `*${s.signature[l]}*` : null].filter(Boolean).join('\n\n')
      return { blockType: 'story', anchor: s.id, heading: s.heading?.[l], body: md(text), image: s.image ? img(s.image) : undefined, imagePosition: i % 2 ? 'start' : 'end' }
    }),
  )

  const guide = read('pages/przewodnik.json')
  await upsertPage(payload, upsert, 'guide', () => guide.title, (l) => [{ blockType: 'faq', items: guide.faq.map((f: Any) => ({ question: f.q?.[l], answer: md(f.a?.[l]) })) }])

  const kontakt = read('pages/kontakt.json')
  await upsertPage(payload, upsert, 'contact', () => kontakt.title, () => [], (l) => kontakt.lead?.[l])

  // Regulamin, polityka prywatności i cookies (wspólne z silnikiem IceColdRes); SEO z seo-pages.json poniżej ma pierwszeństwo
  for (const d of read('documents.json') as Any[]) {
    await upsert('pages', d.slug, (l) => ({
      title: d.title?.[l],
      kind: 'document',
      intro: d.intro?.[l],
      layout: [{ blockType: 'richText', body: md(d.body?.[l]) }],
      seo: { title: d.seo?.title?.[l], description: d.seo?.description?.[l] },
    }))
  }

  // SEO podstron (content/seo-pages.json: klucze wątku treści → adresy stron w panelu)
  const seoPages: Any = read('seo-pages.json')
  const seoKeys: Record<string, string> = { home: 'home', domy: 'houses', rytualy: 'rituals', osada: 'settlement', okolica: 'surroundings', oferty: 'offers', aktualnosci: 'news', galeria: 'gallery', kontakt: 'contact', przewodnik: 'guide', regulamin: 'regulamin', prywatnosc: 'prywatnosc' }
  const navTitles: Record<string, L> = { houses: { pl: 'Domki i apartamenty', en: 'Cottages & apartments' }, surroundings: { pl: 'Okolica', en: 'Surroundings' }, offers: { pl: 'Oferty', en: 'Offers' }, news: { pl: 'Aktualności', en: 'News' }, gallery: { pl: 'Galeria', en: 'Gallery' }, regulamin: { pl: 'Regulamin', en: 'Terms' }, prywatnosc: { pl: 'Polityka prywatności', en: 'Privacy policy' } }
  for (const [key, entry] of Object.entries(seoPages) as [string, Any][]) {
    const slug = seoKeys[key]
    if (!slug) continue
    const found = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1, depth: 0, draft: true })
    let id = found.docs[0]?.id
    const created = !id
    const kind = slug === 'regulamin' || slug === 'prywatnosc' ? 'document' : 'section'
    for (const locale of LOCALES) {
      const seo = { title: entry.title?.[locale], description: entry.description?.[locale] }
      // nowa strona potrzebuje tytułu w każdym języku (pole wymagane i tłumaczone)
      const title = created ? { title: navTitles[slug]?.[locale] ?? slug } : {}
      if (id) await payload.update({ collection: 'pages', id, locale, data: { ...title, seo }, draft: false } as never)
      else id = ((await payload.create({ collection: 'pages', locale, data: { slug, kind, title: navTitles[slug]?.[locale] ?? slug, seo, _status: 'published' }, draft: false } as never)) as Any).id
    }
    payload.logger.info(`seo: ${slug}`)
  }

  const s = read('settings.json')
  for (const locale of LOCALES) {
    await payload.updateGlobal({
      slug: 'settings',
      locale,
      data: {
        phone: s.contact?.phone,
        email: s.contact?.email,
        address: s.contact?.address,
        social: Object.entries(s.social ?? {}).map(([label, url]) => ({ label, url: String(url) })),
        priceSlogan: s.booking_bar?.best_rate?.[locale],
        // import służy środowisku testowemu: testujemy integrację z IceColdRes (produkcja: decyzja Michała w grudniu)
        bookingEngine: 'icecoldres',
        icecoldresUrl: 'https://icecoldres.audiowizard.pl',
        seoTitle: s.seo_default?.title?.[locale],
        seoDescription: s.seo_default?.description?.[locale],
      },
    })
  }
  payload.logger.info('Import treści zakończony')
  process.exit(0)
}

/** Przepisuje id wierszy list i bloków z zapisanego wpisu (po pozycji), żeby zapis drugiego języka ich nie podmienił. */
function withIds(data: unknown, current: unknown): Any {
  if (Array.isArray(data)) return data.map((item, i) => withIds(item, Array.isArray(current) ? current[i] : undefined))
  if (data && typeof data === 'object' && !('root' in data)) {
    const cur = (current && typeof current === 'object' ? current : {}) as Any
    const out: Any = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, withIds(v, cur[k])]))
    if (cur.id && !('id' in out) && 'blockType' in out === 'blockType' in cur) out.id = cur.id
    return out
  }
  return data as Any
}

async function upsertPage(
  _payload: Payload,
  upsert: (c: CollectionSlug, slug: string, build: (l: Loc) => Any) => Promise<void>,
  slug: string,
  title: () => L,
  layout: (l: Loc) => Any[],
  intro?: (l: Loc) => string | undefined,
) {
  await upsert('pages', slug, (l) => ({ title: title()?.[l] ?? slug, kind: 'section', intro: intro?.(l), layout: layout(l) }))
}

// `payload run` kończy proces po załadowaniu modułu, więc czekamy na import na najwyższym poziomie
await main().catch((err) => {
  console.error(err)
  process.exit(1)
})
