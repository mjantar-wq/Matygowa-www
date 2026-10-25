import { bookingUrl, engineSettings } from '@/lib/booking'
import type { PageContext } from '@/lib/page'

/** Monochromatyczne logo (currentColor), żeby pasowały do przycisku z obrysem w każdej porze dnia. */
const ICONS: Record<string, React.ReactNode> = {
  facebook: <path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v9h4v-9h3l.5-4h-3.5V8.8c0-.5.3-.8.5-.8Z" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.4" cy="6.6" r="1.3" />
    </>
  ),
}

/** Strona Kontakt: te same dane co w stopce, przycisk do rezerwacji i profile społecznościowe. */
export function ContactDetails({ ctx }: { ctx: PageContext }) {
  const s = ctx.settings
  return (
    <section className="mo-section mo-container mo-kontakt">
      <div>
        {s?.phone ? <p className="mo-h3"><a href={`tel:${s.phone.replace(/\s/g, '')}`}>{s.phone}</a></p> : null}
        {s?.email ? <p className="mo-h3"><a href={`mailto:${s.email}`}>{s.email}</a></p> : null}
        {s?.address ? <p style={{ whiteSpace: 'pre-line' }}>{s.address}</p> : null}
      </div>
      <p>
        <a className="mo-btn mo-btn--glowny" href={bookingUrl(engineSettings(s), ctx.locale)}>{ctx.t.booking.goToEngine}</a>
      </p>
      {s?.social?.length ? (
        <div>
          <p className="mo-label">{ctx.t.footer.follow}</p>
          <ul className="mo-kontakt__social">
            {s.social.map((x) => (
              <li key={x.id ?? x.url}>
                <a className="mo-btn mo-btn--obrys mo-btn--maly" href={x.url} rel="noopener" target="_blank">
                  {ICONS[x.label.toLowerCase()] ? <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">{ICONS[x.label.toLowerCase()]}</svg> : null}
                  <span>{x.label.toLowerCase() === 'facebook' ? 'Facebook' : x.label.toLowerCase() === 'instagram' ? 'Instagram' : x.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
