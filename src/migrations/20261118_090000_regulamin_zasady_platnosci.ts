import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-d1-sqlite'
import { touchPages } from '../lib/touch-pages'

/**
 * Regulamin: nowe domyślne zasady płatności (18.11.2026, Michał): zaliczka 30% online przy rezerwacji, rezerwacja
 * wstrzymana na 24 godziny do potwierdzenia płatności (potem automatycznie usuwana), dopłata do 30 dni przed przyjazdem,
 * rezerwacja na 30 dni lub mniej przed przyjazdem płatna w całości od razu; wszystko, chyba że warunki oferty promocyjnej
 * stanowią inaczej. Żywe dane z panelu: podmieniamy tylko dotychczasowe, dokładne zdania (§ 2 ust. 4 i § 4 ust. 1),
 * więc regulamin poprawiony ręcznie w panelu zostaje. Dotyczy treści opublikowanej i wersji.
 */
const TEXTS: [from: string, to: string][] = [
  // PL § 2 ust. 4
  [
    'Rezerwacja staje się skuteczna po jej potwierdzeniu przez Wynajmującego oraz uiszczeniu opłaty rezerwacyjnej w wysokości {deposit} wartości rezerwacji. Pozostałą część Ceny Najmu należy wpłacić najpóźniej {balance} dni przed przyjazdem. Dokładna kwota oraz termin płatności zostaną wskazane w wiadomości e-mail potwierdzającej rezerwację. Warunki płatności określają warunki wybranej oferty, podane przy rezerwacji i w jej potwierdzeniu; mogą się one różnić między ofertami. Jeżeli Najemca nie dokona płatności wynikającej z oferty (w tym przedpłaty) w terminie, Wynajmujący ma prawo anulować rezerwację po upływie co najmniej 3 dni od tego terminu; wpłacone zaliczki (opłaty rezerwacyjne) nie podlegają wówczas zwrotowi.',
    'Rezerwacja staje się skuteczna po jej potwierdzeniu przez Wynajmującego oraz uiszczeniu opłaty rezerwacyjnej (zaliczki) w wysokości 30% Ceny Najmu. Zaliczkę płaci się online przy składaniu rezerwacji. Rezerwacja jest wstrzymana przez 24 godziny do uzyskania potwierdzenia płatności; jeżeli płatność nie zostanie potwierdzona w tym czasie, rezerwacja jest automatycznie usuwana. Pozostałą część Ceny Najmu należy dopłacić najpóźniej 30 dni przed przyjazdem. Rezerwacja dokonana na 30 dni lub mniej przed przyjazdem wymaga opłacenia całej Ceny Najmu od razu, przy składaniu rezerwacji. Powyższe zasady obowiązują zawsze, chyba że warunki oferty promocyjnej stanowią inaczej; warunki wybranej oferty są podane przy rezerwacji i w jej potwierdzeniu. Dokładna kwota oraz termin płatności zostaną wskazane w wiadomości e-mail potwierdzającej rezerwację. Jeżeli Najemca nie dokona dopłaty w terminie, Wynajmujący ma prawo anulować rezerwację po upływie co najmniej 3 dni od tego terminu; wpłacone zaliczki (opłaty rezerwacyjne) nie podlegają wówczas zwrotowi.',
  ],
  // EN § 2(4)
  [
    'A booking becomes effective once confirmed by the Landlord and once the booking fee of {deposit} of the booking value has been paid. The rest of the Rental Price must be paid no later than {balance} days before arrival. The exact amount and payment deadline are given in the booking confirmation e-mail. The payment conditions are set by the conditions of the chosen offer, given when booking and in the booking confirmation; they may differ between offers. If the Tenant does not make a payment required by the offer (including the advance payment) on time, the Landlord may cancel the booking once at least 3 days have passed after that deadline; advance payments already made (booking fees) are then not refunded.',
    'A booking becomes effective once confirmed by the Landlord and once the booking fee (deposit) of 30% of the Rental Price has been paid. The deposit is paid online when the booking is made. The booking is held for 24 hours until the payment is confirmed; if the payment is not confirmed within that time, the booking is automatically removed. The rest of the Rental Price must be paid no later than 30 days before arrival. A booking made 30 days or less before arrival must be paid in full immediately, when the booking is made. These rules always apply, unless the conditions of a promotional offer provide otherwise; the conditions of the chosen offer are given when booking and in the booking confirmation. The exact amount and payment deadline are given in the booking confirmation e-mail. If the Tenant does not pay the remaining amount on time, the Landlord may cancel the booking once at least 3 days have passed after that deadline; advance payments already made (booking fees) are then not refunded.',
  ],
  // PL § 4 ust. 1
  [
    'Opłata rezerwacyjna stanowi zadatek na poczet Ceny Najmu. Termin zapłaty pozostałej kwoty określają warunki wybranej oferty, wskazane w potwierdzeniu rezerwacji; skutki braku zapłaty w terminie opisuje § 2 ust. 4.',
    'Opłata rezerwacyjna stanowi zadatek na poczet Ceny Najmu. Pozostałą kwotę płaci się najpóźniej 30 dni przed przyjazdem, a przy rezerwacji na 30 dni lub mniej przed przyjazdem całość płaci się od razu (chyba że warunki oferty promocyjnej stanowią inaczej); skutki braku zapłaty w terminie opisuje § 2 ust. 4.',
  ],
  // EN § 4(1)
  [
    'The booking fee is an advance payment (zadatek) towards the Rental Price. The deadline for paying the remaining amount is set by the conditions of the chosen offer, given in the booking confirmation; the consequences of failing to pay on time are described in § 2(4).',
    'The booking fee is an advance payment (zadatek) towards the Rental Price. The remaining amount is paid no later than 30 days before arrival, and a booking made 30 days or less before arrival is paid in full immediately (unless the conditions of a promotional offer provide otherwise); the consequences of failing to pay on time are described in § 2(4).',
  ],
]
const q = (v: string) => `'${v.replace(/'/g, "''")}'`

async function swap(db: MigrateUpArgs['db'], pairs: [from: string, to: string][]) {
  for (const [from, to] of pairs) {
    await db.run(sql.raw(`UPDATE \`pages_blocks_rich_text_locales\` SET \`body\` = replace(\`body\`, ${q(from)}, ${q(to)}) WHERE instr(\`body\`, ${q(from)}) > 0`))
    // wersje w panelu: inaczej formularz pokazałby stary tekst i zapis by go przywrócił
    await db.run(sql.raw(`UPDATE \`_pages_v_blocks_rich_text_locales\` SET \`body\` = replace(\`body\`, ${q(from)}, ${q(to)}) WHERE instr(\`body\`, ${q(from)}) > 0`))
  }
}

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await swap(db, TEXTS)
  await touchPages(db)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await swap(db, TEXTS.map(([from, to]) => [to, from]))
  await touchPages(db)
}
