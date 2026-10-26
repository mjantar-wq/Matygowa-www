# Wdrożenie

Każdy push na `main` po zielonym CI wdraża stronę na https://matygowa.audiowizard.pl (`.github/workflows/ci.yml`, zadanie „Wdrożenie”).

## Zasoby Cloudflare (konto z IceColdRes)

| Zasób | Nazwa | Uwagi |
|---|---|---|
| Worker | `matygowa-www` | domena `matygowa.audiowizard.pl` (custom domain, DNS zakłada wrangler) |
| D1 | `matygowa-www` (`50a7b7ac-…`) | utworzona 24.10.2026, region WEUR; treści panelu, bez danych gości |
| R2 | `matygowa-www-media` | jurysdykcja UE; tworzy ją pierwsze wdrożenie |

Koszt: w ramach opłaconego planu Workers Paid (D1 i R2 w darmowych limitach przy tej skali).

## Jednorazowa konfiguracja (Michał, ok. 5 minut)

Wdrożenie robi GitHub Actions, więc potrzebuje własnego tokenu Cloudflare (connector Cloudflare w Claude służy do rozmowy, nie do automatycznych wdrożeń z GitHub). Sekretów nie da się przenieść z innego repozytorium, trzeba je wpisać tutaj.

**Krok 1. Token Cloudflare**
1. Zaloguj się do Cloudflare i otwórz [gotowy formularz tokenu](https://dash.cloudflare.com/profile/api-tokens?permissionGroupKeys=%5B%7B%22key%22%3A%22workers_scripts%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22d1%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_routes%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22workers_r2%22%2C%22type%22%3A%22edit%22%7D%2C%7B%22key%22%3A%22account_settings%22%2C%22type%22%3A%22read%22%7D%5D&accountId=%2A&zoneId=all&name=Matygowa-www%20GitHub%20deploy). Uprawnienia są już zaznaczone: Workers Scripts, D1, Workers Routes, R2 (edycja) i Account Settings (odczyt).
2. W sekcji **Account Resources** zostaw swoje konto. W **Zone Resources** wybierz **Include → Specific zone → audiowizard.pl**.
3. Na dole **Continue to summary**, potem **Create Token**. Skopiuj token, pokazuje się tylko raz.

**Krok 2. Identyfikator konta**
W panelu Cloudflare: **Workers & Pages**, po prawej **Account Details**, kopiuj **Account ID**.

**Krok 3. Sekrety w GitHub**
Otwórz [Settings → Secrets and variables → Actions](https://github.com/mjantar-wq/Matygowa-www/settings/secrets/actions) w repozytorium Matygowa-www i trzy razy **New repository secret**:

| Nazwa | Wartość |
|---|---|
| `CLOUDFLARE_API_TOKEN` | token z kroku 1 |
| `CLOUDFLARE_ACCOUNT_ID` | identyfikator z kroku 2 |
| `PAYLOAD_SECRET` | dowolny długi losowy ciąg, np. 40 znaków z menedżera haseł; szyfruje sesje panelu |

**Krok 4.** Napisz w wątku projektu, że gotowe. Claude uruchomi wdrożenie i sprawdzi stronę.

Bez sekretów CI działa, a krok wdrożenia jest pomijany z ostrzeżeniem.

## Pierwsze uruchomienie panelu

1. Po pierwszym wdrożeniu otwórz `https://matygowa.audiowizard.pl/panel` i załóż konto administratora (pierwsze konto zakłada się samo).
2. Treści robocze i obrazy CGI: GitHub → Actions → CI → **Run workflow** z zaznaczonym „Wgraj treści robocze…”. Import nadpisuje te same wpisy w panelu, więc po rozpoczęciu edycji w panelu uruchamiamy go tylko świadomie.
3. Ustawienia strony → Rezerwacje: silnik Hotres do czasu decyzji o IceColdRes (grudzień 2026).

## Integracja z IceColdRes

- API: `ICECOLDRES_API_URL` i `ICECOLDRES_SLUG` w `wrangler.jsonc` (`vars`). Test: `https://icecoldres.audiowizard.pl`, adres obiektu `booking` (silnik: https://icecoldres.audiowizard.pl/pl/booking i `/en/booking`).
- Adresy (ustalenie Michała, źródło prawdy: sekcja domen w `docs/integracja-strony.md` w IceColdRes):

  | | Test | Produkcja |
  |---|---|---|
  | Strona | `matygowa.audiowizard.pl` | `matygowaosada.pl` |
  | Panel treści strony | `matygowa.audiowizard.pl/panel` | `matygowaosada.pl/panel` |
  | Rezerwacje (silnik) | `icecoldres.audiowizard.pl/pl/booking`, `/en/booking` | `booking.matygowaosada.pl` |
  | Panel IceColdRes | `icecoldres.audiowizard.pl/panel` | `icecoldres.matygowaosada.pl/panel` |

  Zmiana środowiska to `routes` i `vars` (`ICECOLDRES_API_URL`, `ICECOLDRES_SLUG`, `NEXT_PUBLIC_SITE_URL`) w `wrangler.jsonc` oraz adres silnika w Ustawieniach strony. Stary adres panelu `/admin` przekierowuje na `/panel`.
- Pasek rezerwacji: przy silniku IceColdRes i włączonym „Pokazuj ceny i dostępność” kalendarz pokazuje ceny „od” i plakietki promocji strony, a „Sprawdź termin” wyświetla wolne domy z cenami na stronie. „Rezerwuj” otwiera silnik z `arrival`, `departure`, `adults`, `children`, `ages`, `unit`, `offer` i `utm_*` (zapamiętanymi z wejścia na stronę, na czas wizyty). Przeglądarka pyta pośrednika strony `/api/booking/calendar` i `/api/booking/search` (bufor 45 s), nie bezpośrednio IceColdRes. Przy Hotres pasek od razu przechodzi do Hotres.
- Import treści (`pnpm seed`) ustawia silnik IceColdRes (import służy środowisku testowemu).
- Webhook „treść zmieniona” (docs/integracja-strony.md w IceColdRes): `POST /api/revalidate/icecoldres`, podpis `X-IceColdRes-Signature` (HMAC-SHA256, ważny 5 minut), odświeża bufory zapytań według tematów (`property`, `unitTypes`, `photos`, `services`, `pricing`). Sekret: Cloudflare → Workers → `matygowa-www` → Settings → Variables and Secrets → Add → typ **Secret**, nazwa `SITE_WEBHOOK_SECRET`, ta sama wartość co w Workerze `icecoldres-api`. Bez sekretu adres odpowiada 503.

## Do zrobienia przed produkcją

- Cloudflare Access na `/panel` i `/admin` (Payload nie ma własnego 2FA), bez `/api` (obrazy dla gości). Hasła panelu: PBKDF2 100 000 rund (limit Workers), łatka `patches/payload@3.92.0.patch`; przy aktualizacji Payloada sprawdź, czy łatka nadal pasuje.
- Bufor stron (ISR w R2) i odświeżanie po zapisie w panelu; dziś strony renderują się przy każdym wejściu.
- `SITE_INDEXABLE=true` tylko na produkcji (na teście nagłówek `noindex`).
- Zdjęcia obiektów w Okolicy: w Galerii i mediach przefiltruj „Prawa do zdjęcia” = „Czeka na zgodę”. Każde takie zdjęcie albo dostaje zgodę obiektu na piśmie (zmień na „Zgoda obiektu”, w repo `pending` na `granted` w `scripts/media/okolica.py`), albo znika. Na produkcji (`SITE_INDEXABLE=true`) strona i tak ich nie pokazuje. Prośby wysłał Michał 25.10.2026 (Termy Bukovina, Terma Bania, SkyWalk, Kotelnica, Szymoszkowa, PKL, Flisacy, Bielska Jaskinia).
- Opinie z Google (`src/lib/reviews.ts`, cron w poniedziałki 4:30 UTC): klucz API z Google Cloud ograniczony do „Places API (New)”, wpisany jako sekret Workera `GOOGLE_PLACES_API_KEY` (Settings → Variables and Secrets, kiedy nie trwa żadne wdrożenie), oraz Place ID obiektu (z [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id), zaczyna się od „ChIJ”) w `GOOGLE_PLACE_ID` w `wrangler.jsonc`. Rola menedżera wizytówki nie jest potrzebna, bo opinie są publiczne. Do tego czasu źródło jest wyłączone, a opinie wpisuje się w panelu.
- Opinie z Booking: automatycznie dopiero po podpięciu prawdziwego obiektu do Booking.com (Beds24 albo IceColdRes).
