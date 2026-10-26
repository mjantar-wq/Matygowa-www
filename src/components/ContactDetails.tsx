import Link from 'next/link'
import { href } from '@/i18n/routes'
import { bookingUrl, engineSettings } from '@/lib/booking'
import { directionsUrl } from '@/lib/maps'
import type { PageContext } from '@/lib/page'
import { SocialIcon, socialKind } from './SocialIcon'

/** Strona Kontakt: te same dane co w stopce, przycisk do rezerwacji i profile społecznościowe. */
export function ContactDetails({ ctx }: { ctx: PageContext }) {
  const s = ctx.settings
  const route = directionsUrl(s)
  return (
    <section className="mo-section mo-container mo-kontakt">
      <div>
        {s?.phone ? <p className="mo-h3"><a href={`tel:${s.phone.replace(/\s/g, '')}`}>{s.phone}</a></p> : null}
        {s?.email ? <p className="mo-h3"><a href={`mailto:${s.email}`}>{s.email}</a></p> : null}
        {s?.address ? <p style={{ whiteSpace: 'pre-line' }}>{s.address}</p> : null}
        {route ? (
          <p style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-4)', marginBlockStart: 'var(--space-4)' }}>
            <a className="mo-btn mo-btn--glowny mo-btn--maly" href={route} rel="noopener">{ctx.t.footer.directions}</a>
            <Link href={href(ctx.locale, 'guide')} prefetch={false}>{ctx.t.footer.winterRoute}</Link>
          </p>
        ) : null}
      </div>
      <p>
        <a className="mo-btn mo-btn--glowny" href={bookingUrl(engineSettings(s), ctx.locale)}>{ctx.t.booking.goToEngine}</a>
      </p>
      {s?.social?.length ? (
        <div>
          <p className="mo-label">{ctx.t.footer.follow}</p>
          <ul className="mo-kontakt__social">
            {s.social.map((x) => {
              const kind = socialKind(x.url, x.label)
              return (
                <li key={x.id ?? x.url}>
                  <a className="mo-btn mo-btn--glowny mo-btn--maly" href={x.url} rel="noopener" target="_blank">
                    {kind ? <SocialIcon kind={kind} size={20} /> : null}
                    <span>{kind === 'facebook' ? 'Facebook' : kind === 'instagram' ? 'Instagram' : x.label}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
