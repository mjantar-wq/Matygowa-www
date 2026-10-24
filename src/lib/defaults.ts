import type { Locale } from '@/i18n/locales'
import type { Page } from '@/payload-types'

/**
 * Domyślny układ strony głównej (koncepcja: 13 sekcji; stopka jest w układzie strony), widoczny,
 * dopóki w panelu nie ma strony „home”. Teksty robocze; finalne przychodzą z panelu.
 */
export function defaultHomeLayout(locale: Locale): NonNullable<Page['layout']> {
  const pl = locale === 'pl'
  const s = (blockType: string, heading: string, extra: Record<string, unknown> = {}) =>
    ({ id: blockType, blockType, heading, eyebrow: null, ...extra }) as unknown as NonNullable<Page['layout']>[number]
  return [
    s('hero', '', { headline: pl ? 'Dziesięć szczytów, jeden widok' : 'Ten peaks, one view', subline: pl ? 'Prywatne domy z panoramą Tatr w Gliczarowie Górnym' : 'Private houses facing the Tatras in Gliczarów Górny', showBookingBar: true }),
    s('intro', pl ? 'Wysoko nad codziennością' : 'High above the everyday', {
      stats: [
        { id: 'a', value: '6', label: pl ? 'domów po 120 m²' : 'houses, 120 m² each' },
        { id: 'b', value: '4', label: pl ? 'apartamenty od wiosny 2027' : 'apartments from spring 2027' },
        { id: 'c', value: '10', label: pl ? 'szczytów w oknach' : 'peaks in the windows' },
      ],
    }),
    s('peaksPanorama', pl ? 'Panorama szczytów' : 'The peaks panorama', { showMap: true }),
    s('dayInSettlement', pl ? 'Dzień w osadzie' : 'A day at the settlement', {
      scenes: (['dawn', 'day', 'dusk', 'night'] as const).map((time) => ({ id: time, time, title: time, text: '' })),
    }),
    s('houseInside', pl ? 'Dom od środka' : 'Inside the house'),
    s('rituals', pl ? 'Sauna i bania' : 'Sauna and hot tub', { showPrices: true }),
    s('seasons', pl ? 'Zima i lato' : 'Winter and summer'),
    s('surroundings', pl ? 'Okolica' : 'Surroundings', { limit: 6 }),
    s('story', pl ? 'W zgodzie z naturą' : 'In tune with nature'),
    s('testimonials', pl ? 'Opinie gości' : 'Guest reviews'),
    s('offersNews', pl ? 'Oferty i aktualności' : 'Offers and news'),
    s('bookingInvite', pl ? 'Zarezerwuj swój widok' : 'Book your view'),
  ]
}
