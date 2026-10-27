import { SeasonOffersButton } from '@/components/effects/SeasonOffersButton'
import { promoSeason } from '@/lib/icecoldres'
import type { PageContext } from '@/lib/page'

/**
 * Pusty sezon (przełącznik lato/zima chowa w CSS promocje z drugiej pory roku): zamiast „wkrótce” przycisk
 * „Sprawdź oferty na Zimę/Lato”, który przełącza stronę. Gdy promocji nie ma wcale, nic nie pokazuje.
 */
export function SeasonOffersEmpty({ seasons, ctx }: { seasons: (string | null | undefined)[]; ctx: PageContext }) {
  if (!seasons.length) return null
  return (['lato', 'zima'] as const).map((sezon) => {
    const other = sezon === 'lato' ? 'zima' : 'lato'
    const has = (s: 'lato' | 'zima') => seasons.some((x) => (promoSeason(x) ?? s) === s)
    if (has(sezon) || !has(other)) return null
    return (
      <div key={sezon} data-sezon-promo={sezon} className="mo-placeholder">
        <SeasonOffersButton to={other} label={ctx.t.offers.seeSeason[other]} />
      </div>
    )
  })
}
