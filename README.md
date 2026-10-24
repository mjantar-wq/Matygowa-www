# Matygowa-www

Nowa strona Matygowej Osady: Next.js 16 z wbudowanym panelem treści Payload 3 (`/admin`), na Cloudflare Workers (OpenNext), baza D1, pliki w R2.
Rezerwacje, ceny i promocje pochodzą z IceColdRes (publiczne API), do czasu jego uruchomienia przyciski prowadzą do Hotres (przełącznik w panelu: Ustawienia strony → Rezerwacje).

- Środowisko testowe: https://matygowa.audiowizard.pl (panel: `/admin`)
- Koncepcja i plan: dokument projektu „Matygowa Osada: koncepcja, szkielet, specyfikacja i plan nowej strony”
- Wdrożenie i sekrety: [`docs/wdrozenie.md`](docs/wdrozenie.md)

## Uruchomienie lokalne

```sh
pnpm install
cp .env.example .env            # PAYLOAD_SECRET=dowolny-ciąg
pnpm payload migrate            # lokalna D1 w .wrangler/
pnpm seed                       # treści robocze z content/
pnpm dev                        # http://localhost:3000, panel: /admin
```

Kontrola: `pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e`.

## Struktura

| Ścieżka | Zawartość |
|---|---|
| `src/app/(frontend)/[locale]/` | podstrony; katalog = klucz podstrony (`houses`, `rituals`…) |
| `src/i18n/` | języki (`locales.ts`), tłumaczone adresy (`routes.ts`), napisy interfejsu |
| `src/collections/`, `src/globals/` | panel treści: domy i apartamenty, aktualności, atrakcje, oferty, opinie, strony, media, ustawienia |
| `src/blocks/` | bloki sekcji stron (konfiguracja panelu i wygląd) |
| `src/lib/icecoldres.ts`, `src/lib/booking.ts` | API IceColdRes i adres silnika rezerwacji |
| `src/styles/` | tokeny wyglądu i klasy `mo-*` (właściciel: wątek spójności wizualnej) |
| `content/` | treści robocze PL/EN do importu (`pnpm seed`) |

## Adresy i języki

Polski bez prefiksu (`/domy/hawran`), angielski pod `/en/` (`/en/houses/hawran`). Linki buduje wyłącznie `href(locale, route, slug)`.
Nowy język (np. słowacki, arabski): `enabled: true` w `src/i18n/locales.ts`, słownik w `src/i18n/dictionaries.ts`, segmenty w `src/i18n/routes.ts`; panel sam doda pola tłumaczeń. Style używają tylko właściwości logicznych CSS, więc arabski (RTL) nie wymaga przebudowy.

## Zasady

- Kolory, kroje, odstępy tylko przez zmienne z `src/styles/tokens.css` albo klasy `mo-*`.
- Obrazy CGI do czasu sesji zdjęciowej mają w bibliotece zaznaczone „Materiał tymczasowy”.
- Zmiana schematu panelu: `pnpm generate:types:payload && pnpm payload migrate:create <nazwa>`.
