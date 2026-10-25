import Link from 'next/link'
import { href } from '@/i18n/routes'
import { formatPrice } from '@/lib/booking'
import { peakViewAlt } from '@/lib/peak'
import type { PageContext } from '@/lib/page'
import type { Unit } from '@/payload-types'
import { Media } from './Media'

/**
 * Kafelek domu albo apartamentu w tym samym rozmiarze i układzie co wyniki „Sprawdź termin” (Michał, 25.10.2026):
 * zdjęcie, nazwa, rodzaj, wysokość, osoby i metraż, cena „od” (z IceColdRes, gdy jest). Siatka: `.mo-tiles` w `.mo-tiles-wrap`.
 */
export function UnitCard({ unit, ctx, priceFrom }: { unit: Unit; ctx: PageContext; priceFrom?: number | null }) {
  const t = ctx.t
  const see = unit.kind === 'apartment' ? t.effects.seeApartment : t.effects.seeHouse
  const facts = [
    t.house.kind[unit.kind],
    unit.peak?.elevation ? t.house.elevation(unit.peak.elevation) : null,
    unit.maxGuests ? t.house.guests(unit.maxGuests) : null,
    unit.area ? `${unit.area} m²` : null,
  ].filter(Boolean)
  return (
    <li className="mo-tile">
      <Link href={href(ctx.locale, 'houses', unit.slug)} className="mo-tile__link">
        <span className="mo-tile__photo">
          <Media media={unit.hero} fallback={unit.name} alt={peakViewAlt(unit, ctx.locale)} />
          {unit.status === 'comingSoon' ? <span className="mo-tile__free">{t.house.comingSoon}</span> : null}
        </span>
        <span className="mo-tile__body">
          <span className="mo-tile__head">
            <span className="mo-tile__name">{unit.name}</span>
          </span>
          <span className="mo-body-s mo-tile__text">{facts.join(' · ')}</span>
          <span className="mo-tile__foot">
            {priceFrom && unit.status !== 'comingSoon' ? (
              <span className="mo-price">
                {t.booking.from} {formatPrice(priceFrom, ctx.locale)} <small>{t.booking.perNight}</small>
              </span>
            ) : (
              <span />
            )}
            <span className="mo-btn mo-btn--glowny">{see}</span>
          </span>
        </span>
      </Link>
    </li>
  )
}
