import Link from 'next/link'
import { href } from '@/i18n/routes'
import { formatPrice } from '@/lib/booking'
import type { PageContext } from '@/lib/page'
import type { Unit } from '@/payload-types'
import { Media } from './Media'

/** Karta domu albo apartamentu: szczyt, wysokość, osoby, cena „od” (z IceColdRes, gdy jest). */
export function UnitCard({ unit, ctx, priceFrom }: { unit: Unit; ctx: PageContext; priceFrom?: number | null }) {
  const t = ctx.t
  return (
    <Link href={href(ctx.locale, 'houses', unit.slug)} className="mo-card">
      <div className="mo-card__media"><Media media={unit.hero} fallback={unit.name} /></div>
      <p className="mo-card__eyebrow">
        {unit.peak?.elevation ? <span className="mo-figure">{t.house.elevation(unit.peak.elevation)}</span> : null}
        <span className="mo-label">{t.house.kind[unit.kind]}</span>
      </p>
      <h3 className="mo-h3 mo-card__title">{unit.name}</h3>
      <p className="mo-body-s mo-card__text">{unit.maxGuests ? t.house.guests(unit.maxGuests) : null}</p>
      <p className="mo-card__meta">
        {unit.status === 'comingSoon' ? (
          <span className="mo-badge">{t.house.comingSoon}</span>
        ) : priceFrom ? (
          <span className="mo-price">
            {t.booking.from} {formatPrice(priceFrom, ctx.locale)} <small>{t.booking.perNight}</small>
          </span>
        ) : (
          <span />
        )}
        <span className="mo-card__arrow" aria-hidden="true">→</span>
      </p>
    </Link>
  )
}
