'use client'

import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/i18n/locales'
import type { Dictionary } from '@/i18n/dictionaries'
import { href } from '@/i18n/routes'
import { formatPrice } from '@/lib/booking'
import type { UnitTile } from '@/lib/unit-tiles'
import { Lightbox } from './effects/Lightbox'

export interface Result {
  code: string
  name: string
  nameEn: string | null
  free: number
  offers: {
    offerId: string
    name: string
    total: number
    badge: string | null
    badgeEn: string | null
  }[]
  reason: string | null
  unit: UnitTile | null
}

type Props = {
  results: Result[]
  nights: number
  locale: Locale
  t: Dictionary['booking']
  fx: Dictionary['effects']
  /** adres silnika z danymi pobytu, domem i ofertą */
  book: (unit: string, offer: string) => string
}

/**
 * Wyniki „Sprawdź termin” (Michał, 25.10.2026): kafelki bliskie kwadratu, 3 w rzędzie na komputerze i 1 na telefonie;
 * wybrany dom otwiera się w oknie ze zdjęciami do powiększenia (Lightbox), opisem, ofertami i „Rezerwuj”.
 */
export function UnitResults({ results, nights, locale, t, fx, book }: Props) {
  const [chosen, setChosen] = useState<string | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const name = (r: Result) => (locale === 'pl' ? r.name : r.nameEn || r.name)
  const badgeOf = (o: Result['offers'][number]) => (locale === 'pl' ? o.badge : o.badgeEn || o.badge)
  const elevation = (m: number) => `${m.toLocaleString(locale === 'pl' ? 'pl-PL' : 'en-GB')} ${t.elevationUnit}`
  const sorted = [...results.filter((r) => r.offers.length), ...results.filter((r) => !r.offers.length)]
  const open = sorted.find((r) => r.code === chosen && r.offers.length)

  useEffect(() => {
    const d = dialog.current
    if (open && d && !d.open) d.showModal()
  }, [open])

  return (
    <>
      <ul className="mo-tiles">
        {sorted.map((r) => {
          const off = !r.offers.length
          const u = r.unit
          const best = r.offers[0]
          const photo = u?.photos[0]
          const show = () => setChosen(r.code)
          return (
            <li key={r.code} className="mo-tile" data-off={off || undefined}>
              <button
                type="button"
                className="mo-tile__photo"
                onClick={off ? undefined : show}
                disabled={off}
                aria-haspopup={off ? undefined : 'dialog'}
                aria-label={`${t.details}: ${name(r)}`}
              >
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- zdjęcia z biblioteki strony albo IceColdRes
                  <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" style={{ objectPosition: photo.focus }} />
                ) : null}
                {off ? null : <span className="mo-tile__free">{t.free}</span>}
                {u && u.photos.length > 1 ? <span className="mo-tile__count">{u.photos.length}</span> : null}
              </button>
              <div className="mo-tile__body">
                <div className="mo-tile__head">
                  <h4 className="mo-tile__name">{name(r)}</h4>
                  {off ? null : (
                    <button type="button" className="mo-link mo-tile__toggle" aria-haspopup="dialog" onClick={show}>
                      {t.details}
                    </button>
                  )}
                </div>
                <p className="mo-body-s mo-tile__text">
                  {off
                    ? (t.reasons[r.reason ?? ''] ?? t.unavailable)
                    : [
                        u ? t.kind[u.kind] : null,
                        u?.elevation ? elevation(u.elevation) : null,
                        u?.maxGuests ? `${t.upTo} ${u.maxGuests} ${t.people}` : null,
                        u?.area ? `${u.area} m²` : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                </p>
                {best ? (
                  <div className="mo-tile__foot">
                    <div>
                      {badgeOf(best) ? <span className="mo-badge">{badgeOf(best)}</span> : null}
                      <p className="mo-price">
                        {formatPrice(best.total, locale)} <small>{t.total}</small>
                      </p>
                      <p className="mo-body-s mo-result__nightly">
                        {formatPrice(Math.round(best.total / nights), locale)} {t.perNight}
                      </p>
                    </div>
                    <a className="mo-btn mo-btn--glowny" href={book(r.code, best.offerId)} data-track="booking_results">
                      {t.book}
                    </a>
                  </div>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>

      <dialog
        ref={dialog}
        className="mo-unit-dialog"
        aria-label={open ? name(open) : undefined}
        // zamknięcie powiększenia zdjęcia (wewnętrzne okno) nie zamyka okna domu
        onClose={(e) => {
          if (e.target === e.currentTarget) setChosen(null)
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) e.currentTarget.close()
        }}
      >
        {open ? (
          <div className="mo-unit-dialog__inner">
            <button type="button" className="mo-unit-dialog__close" onClick={() => dialog.current?.close()} aria-label={fx.close}>
              ×
            </button>
            {open.unit?.photos.length ? (
              <div className="mo-unit-dialog__photos">
                <Lightbox
                  t={fx}
                  items={open.unit.photos.map((p) => {
                    const [x, y] = p.focus.split(' ').map((v) => parseFloat(v))
                    return { url: p.src, alt: p.alt, focusX: x, focusY: y }
                  })}
                />
              </div>
            ) : null}
            <div className="mo-unit-dialog__text">
              <p className="mo-card__eyebrow">
                {open.unit ? <span className="mo-label">{t.kind[open.unit.kind]}</span> : null}
                {open.unit?.elevation ? <span className="mo-figure">{elevation(open.unit.elevation)}</span> : null}
              </p>
              <h3 className="mo-unit-dialog__name">{name(open)}</h3>
              {open.unit?.tagline ? <p className="mo-unit-dialog__lede">{open.unit.tagline}</p> : null}
              {open.unit ? (
                <dl className="mo-tile__facts">
                  {open.unit.area ? (
                    <div>
                      <dt>{t.facts.area}</dt>
                      <dd>{open.unit.area} m²</dd>
                    </div>
                  ) : null}
                  {open.unit.maxGuests ? (
                    <div>
                      <dt>{t.facts.guests}</dt>
                      <dd>
                        {open.unit.stdGuests && open.unit.stdGuests < open.unit.maxGuests ? `${open.unit.stdGuests}–` : ''}
                        {open.unit.maxGuests}
                      </dd>
                    </div>
                  ) : null}
                  {open.unit.bedrooms ? (
                    <div>
                      <dt>{t.facts.bedrooms}</dt>
                      <dd>{open.unit.bedrooms}</dd>
                    </div>
                  ) : null}
                  {open.unit.bathrooms ? (
                    <div>
                      <dt>{t.facts.bathrooms}</dt>
                      <dd>{open.unit.bathrooms}</dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}
              {open.unit?.amenities.length ? (
                <div className="mo-unit-dialog__amenities">
                  <p className="mo-label">{t.facts.amenities}</p>
                  <p className="mo-body-s">{capitalize(open.unit.amenities.join(', '))}</p>
                </div>
              ) : null}
              <ul className="mo-tile__offers">
                {open.offers.map((o) => (
                  <li key={o.offerId}>
                    <span className="mo-body-s">
                      {open.offers.length > 1 ? o.name : t.total}
                      {badgeOf(o) ? <span className="mo-badge"> {badgeOf(o)}</span> : null}
                    </span>
                    <span className="mo-price">{formatPrice(o.total, locale)}</span>
                    <a className="mo-btn mo-btn--glowny" href={book(open.code, o.offerId)} data-track="booking_results">
                      {t.book}
                    </a>
                  </li>
                ))}
              </ul>
              {open.unit ? (
                <a className="mo-link" href={href(locale, 'houses', open.unit.slug)}>
                  {t.seeUnit}
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  )
}

/** Lista udogodnień zaczyna się wielką literą (wg Michała), reszta bez zmian. */
const capitalize = (text: string) => text.charAt(0).toLocaleUpperCase('pl') + text.slice(1)
