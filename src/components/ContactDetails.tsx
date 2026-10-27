import { getPage } from '@/components/CmsPage'
import { plainText } from '@/components/StructuredData'
import { bookingUrl, engineSettings } from '@/lib/booking'
import { directionsUrl } from '@/lib/maps'
import type { PageContext } from '@/lib/page'
import { fillText, termVars } from '@/lib/terms'
import { SocialIcon, socialKind } from './SocialIcon'

/**
 * Opis „Dojazd zimą” pod przyciskiem trasy: odpowiedź z pytania o zimę w FAQ Przewodnika (jedno miejsce do edycji
 * w panelu), a bez niego tekst ze słownika.
 */
async function winterRouteText(ctx: PageContext) {
  const [page, vars] = await Promise.all([getPage('guide', ctx), termVars(ctx.locale)])
  const faq = page?.layout?.find((b) => b.blockType === 'faq')
  const items = faq?.blockType === 'faq' ? (faq.items ?? []) : []
  const item = items.find((i) => /zim|winter/i.test(i.question ?? ''))
  const text = item ? fillText(plainText(item.answer as Parameters<typeof plainText>[0]), vars).trim() : ''
  return text || ctx.t.footer.winterRouteText
}

/** Strona Kontakt: te same dane co w stopce, przycisk trasy z opisem dojazdu zimą, rezerwacja i profile społecznościowe. */
export async function ContactDetails({ ctx }: { ctx: PageContext }) {
  const s = ctx.settings
  const route = directionsUrl(s)
  const winter = route ? await winterRouteText(ctx) : null
  return (
    <section className="mo-section mo-container mo-kontakt">
      <div>
        {s?.phone ? <p className="mo-h3"><a href={`tel:${s.phone.replace(/\s/g, '')}`}>{s.phone}</a></p> : null}
        {s?.email ? <p className="mo-h3"><a href={`mailto:${s.email}`}>{s.email}</a></p> : null}
        {s?.address ? <p style={{ whiteSpace: 'pre-line' }}>{s.address}</p> : null}
        {route ? (
          <div style={{ marginBlockStart: 'var(--space-4)' }}>
            <p>
              <a className="mo-btn mo-btn--glowny mo-btn--maly" href={route} rel="noopener" target="_blank">{ctx.t.footer.directions}</a>
            </p>
            <p className="mo-label" style={{ marginBlockStart: 'var(--space-4)' }}>{ctx.t.footer.winterRoute}</p>
            <p>{winter}</p>
          </div>
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
