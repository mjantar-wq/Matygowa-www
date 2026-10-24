# Wdrożenie

Każdy push na `main` po zielonym CI wdraża stronę na https://matygowa.audiowizard.pl (`.github/workflows/ci.yml`, zadanie „Wdrożenie”).

## Zasoby Cloudflare (konto z IceColdRes)

| Zasób | Nazwa | Uwagi |
|---|---|---|
| Worker | `matygowa-www` | domena `matygowa.audiowizard.pl` (custom domain, DNS zakłada wrangler) |
| D1 | `matygowa-www` (`50a7b7ac-…`) | utworzona 24.10.2026, region WEUR; treści panelu, bez danych gości |
| R2 | `matygowa-www-media` | jurysdykcja UE; tworzy ją pierwsze wdrożenie |

Koszt: w ramach opłaconego planu Workers Paid (D1 i R2 w darmowych limitach przy tej skali).

## Sekrety repozytorium (GitHub → Settings → Secrets and variables → Actions)

| Sekret | Skąd |
|---|---|
| `CLOUDFLARE_API_TOKEN` | ten sam token co w IceColdRes (uprawnienia: Workers Scripts, D1, R2, Workers Routes i DNS strefy audiowizard.pl) |
| `CLOUDFLARE_ACCOUNT_ID` | jak w IceColdRes |
| `PAYLOAD_SECRET` | losowy ciąg, np. `openssl rand -hex 32`; trafia do Workera jako sekret |

Bez dwóch pierwszych wdrożenie jest pomijane z ostrzeżeniem, CI działa dalej.

## Pierwsze uruchomienie panelu

1. Po pierwszym wdrożeniu otwórz `https://matygowa.audiowizard.pl/admin` i załóż konto administratora (pierwsze konto zakłada się samo).
2. Treści robocze: `CLOUDFLARE_API_TOKEN=… CLOUDFLARE_ACCOUNT_ID=… PAYLOAD_REMOTE_BINDINGS=true pnpm seed`.
3. Ustawienia strony → Rezerwacje: silnik Hotres do czasu decyzji o IceColdRes (grudzień 2026).

## Integracja z IceColdRes

- API: `ICECOLDRES_API_URL` i `ICECOLDRES_SLUG` w `wrangler.jsonc` (`vars`). Obiekt musi mieć adres `matygowa-osada` (panel IceColdRes → Obiekt → adres strony).
- Webhook „treść zmieniona” (docs/integracja-strony.md w IceColdRes): w kolejnym kroku pod `POST /api/revalidate/icecoldres`.

## Do zrobienia przed produkcją

- Cloudflare Access na `/admin` (koncepcja F2; Payload nie ma własnego 2FA).
- Bufor stron (ISR w R2) i odświeżanie po zapisie w panelu; dziś strony renderują się przy każdym wejściu.
- `SITE_INDEXABLE=true` tylko na produkcji (na teście nagłówek `noindex`).
