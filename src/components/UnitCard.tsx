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
      <p className="mo-eyebrow">
        {t.house.kind[unit.kind]}
        {unit.status === 'comingSoon' ? ` · ${t.house.comingSoon}` : ''}
      </p>
      <h3 className="mo-h3">{unit.name}</h3>
      <p className="mo-card__meta">
        {unit.peak?.elevation ? t.house.elevation(unit.peak.elevation) : null}
        {unit.maxGuests ? ` · ${t.house.guests(unit.maxGuests)}` : null}
      </p>
      {priceFrom ? (
        <p>
          {t.booking.from} {formatPrice(priceFrom, ctx.locale)} {t.booking.perNight}
        </p>
      ) : null}
    </Link>
  )
}
