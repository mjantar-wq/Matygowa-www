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
2. Treści robocze i obrazy CGI: GitHub → Actions → CI → **Run workflow** z zaznaczonym „Wgraj treści robocze…”. Import tylko dopisuje brakujące wpisy, a istniejących (edytowanych w panelu) nie rusza: panel jest źródłem prawdy. Świadome nadpisanie z plików: pole „import_overwrite” (np. `pages:home`, `units` albo `all`) lub zmienna `IMPORT_OVERWRITE`.
   **Zmiany w treściach, które już są w panelu** (przeniesienie sekcji między stronami, poprawka tekstu) wprowadzamy migracją na żywych danych w `src/migrations/` (patrz `20261110_083000_przenosiny_sekcji_na_zywych_danych.ts`): przenosi istniejące wiersze, więc zostają teksty i edycje z panelu. Migracje uruchamiają się przy wdrożeniu (`deploy:database`), bez ręcznego importu. Pliki w `content/` aktualizujemy równolegle, żeby nowe środowisko wyglądało tak samo.
3. Ustawienia strony → Rezerwacje: silnik Hotres do czasu decyzji o IceColdRes (grudzień 2026).

## Integracja z IceColdRes

- API: `ICECOLDRES_API_URL` i `ICECOLDRES_SLUG` w `wrangler.jsonc` (`vars`). API (zdjęcia, ceny, dostępność): `https://icecoldres.audiowizard.pl`, adres obiektu `booking`. Silnik rezerwacji, na który prowadzą przyciski i ramka kalendarza, także na teście: `https://booking.matygowaosada.pl/pl/booking` i `/en/booking` (adres z Ustawień strony → Rezerwacje → „Adres silnika IceColdRes”, od 22.11.2026).
- Adresy (ustalenie Michała, źródło prawdy: sekcja domen w `docs/integracja-strony.md` w IceColdRes):

  | | Test | Produkcja |
  |---|---|---|
  | Strona | `matygowa.audiowizard.pl` | `matygowaosada.pl` |
  | Panel treści strony | `matygowa.audiowizard.pl/panel` | `matygowaosada.pl/panel` |
  | Rezerwacje (silnik) | `booking.matygowaosada.pl/pl/booking`, `/en/booking` (od 22.11.2026; `icecoldres.audiowizard.pl` zostaje jako adres techniczny API) | `booking.matygowaosada.pl` |
  | Panel IceColdRes | `icecoldres.audiowizard.pl/panel` | `icecoldres.matygowaosada.pl/panel` |

  Zmiana środowiska to `routes` i `vars` (`ICECOLDRES_API_URL`, `ICECOLDRES_SLUG`, `NEXT_PUBLIC_SITE_URL`) w `wrangler.jsonc` oraz adres silnika w Ustawieniach strony. Stary adres panelu `/admin` przekierowuje na `/panel`.
- Pasek rezerwacji: daty wybiera się w kalendarzu z IceColdRes w ramce (`{icecoldresUrl}/{język}/{slug}/kalendarz`, na stronie domu z `unit`), tym samym co na stronie rezerwacji i w rezerwacji telefonicznej w panelu (Michał, 2.11.2026: jeden kalendarz z jednym kodem). Zasady przyjazdów, wyjazdów i minimalnego pobytu są tylko w IceColdRes; protokół ramki opisuje docs/integracja-strony.md w IceColdRes, „Kalendarz do osadzenia”. Przy silniku IceColdRes i włączonym „Pokazuj ceny i dostępność” „Sprawdź termin” wyświetla wolne domy z cenami i plakietkami promocji na stronie. „Rezerwuj” otwiera silnik z `arrival`, `departure`, `adults`, `children`, `ages`, `unit`, `offer` i `utm_*` (zapamiętanymi z wejścia na stronę, na czas wizyty). Wyszukiwanie idzie przez pośrednika strony `/api/booking/search` (bufor 45 s), nie bezpośrednio do IceColdRes. Przy Hotres pasek od razu przechodzi do Hotres. Strona nie ma polityki CSP z `frame-src`; jeśli ją dostanie, musi dopuścić adres silnika.
- Import treści (`pnpm seed`) ustawia silnik IceColdRes (import służy środowisku testowemu).
- Webhook „treść zmieniona” (docs/integracja-strony.md w IceColdRes): `POST /api/revalidate/icecoldres`, podpis `X-IceColdRes-Signature` (HMAC-SHA256, ważny 5 minut), odświeża bufory zapytań według tematów (`property`, `unitTypes`, `photos`, `services`, `pricing`). Sekret: Cloudflare → Workers → `matygowa-www` → Settings → Variables and Secrets → Add → typ **Secret**, nazwa `SITE_WEBHOOK_SECRET`, ta sama wartość co w Workerze `icecoldres-api`. Bez sekretu adres odpowiada 503.
- Newsletter w stopce: formularz wysyła zapis do `POST /api/newsletter`, a strona przekazuje go do IceColdRes (`/api/public/booking/newsletter`; potwierdzenie mailem, wysyłka i wypisanie przez Amazon SES po stronie IceColdRes). Opcjonalny sekret `SITE_API_SECRET` (typ **Secret**, ta sama wartość w Workerach `matygowa-www` i `icecoldres-api`) podpisuje zapytanie i przekazuje IP gościa, więc limit prób liczy się na gościa. Bez sekretu zapis działa, ale wszyscy goście dzielą jeden limit adresu Workera.

## Szybkość strony (Worker, `src/edge/`)

- **Bufor stron** (`src/edge/pages.ts`): gotowe strony dla gości leżą w pamięci podręcznej Cloudflare i w R2 (`_bufor/strony/`). Zapis w panelu, import treści i webhook IceColdRes podbijają wersję treści (`_bufor/wersja` w R2), więc zmiana jest widoczna od następnego wejścia. Strona starsza niż 5 minut idzie do gościa od razu, a nowa składa się w tle. Panel, `/api`, podgląd wersji roboczych i zalogowani redaktorzy omijają bufor. Nagłówek `x-bufor` mówi, skąd przyszła strona (`HIT`, `R2`, `MISS`, `…-ODSWIEZANIE`).
- **Zdjęcia** (`src/edge/media.ts`): `/api/media/file/…` idzie prosto z R2 (bez Payloada i D1). `?w=480|828|1200|1600|2048` daje mniejszą kopię AVIF/WebP z bindingu Images (plan Images Free: 5000 unikalnych przekształceń miesięcznie, format się nie liczy), zapisaną w R2 pod `_rozmiary/`. Po przekroczeniu limitu albo przy błędzie idzie oryginał. `<img srcset>` w `Media.tsx`, `HeroStage.tsx` i `Lightbox.tsx`.
- Na łączu 2G/3G (Chrome) i przy oszczędzaniu danych: bez filmu w tle i mniej zdjęć pobieranych z wyprzedzeniem.

## Start na matygowaosada.pl

Strefa DNS `matygowaosada.pl` jest na koncie Cloudflare Przemka, a Worker na koncie Michała, więc domena wchodzi jak `pms` i `booking` w IceColdRes: przez Custom Hostnames (Cloudflare for SaaS) strefy `audiowizard.pl`, fallback origin `pms-saas.audiowizard.pl`. Nazwy `matygowaosada.pl` i `www.matygowaosada.pl` są tam dodane (TLS 1.2, walidacja TXT).

Co robi kod (PR „Start strony na matygowaosada.pl”):

- trasy `matygowaosada.pl/*` i `www.matygowaosada.pl/*` w strefie `audiowizard.pl` (`wrangler.jsonc`);
- `www.matygowaosada.pl` → 301 na `https://matygowaosada.pl` ze ścieżką i parametrami (Worker, `src/edge/hosts.ts`);
- `NEXT_PUBLIC_SITE_URL=https://matygowaosada.pl` i `SITE_INDEXABLE=true` w `vars`: robots.txt, mapa witryny, canonical i hreflang wskazują produkcję; indeksowanie dotyczy tylko tej nazwy;
- `matygowa.audiowizard.pl` zostaje adresem testowym (zawsze `noindex`, robots.txt zamknięty, panel dalej za Access);
- stare adresy WordPressa (cała mapa `wp-sitemap.xml` z 24.11.2026) → 301 na nowe odpowiedniki: `content/redirects.json`, test `tests/int/wordpress-redirects.int.spec.ts`; `/sitemap_index.xml` i `/wp-sitemap.xml` → `/sitemap.xml`;
- ciasteczko zgód (`mo_zgody`) baner zapisuje na domenie nadrzędnej liczonej z adresu strony (`.matygowaosada.pl`), więc silnik `booking.matygowaosada.pl` widzi wybór. `NEXT_PUBLIC_CONSENT_DOMAIN` nie jest potrzebne.

### Kolejność dnia startu (bez przerwy dla gości)

Trasa Workera dla nazwy, która w Custom Hostnames nie jest **Active**, może zatrzymać wdrożenie z CI (tak ostrzega `docs/wdrozenie.md` w IceColdRes; nie da się tego sprawdzić na sucho, bo `wrangler deploy --dry-run` nie woła API tras). Dlatego PR nie wchodzi przed DNS, a DNS nie przełącza się przed PR:

1. Przemek wpisuje **same rekordy TXT** (5 sztuk). `@` i `www` zostają na starym WordPressie, strona działa bez zmian.
2. Cloudflare → `audiowizard.pl` → SSL/TLS → Custom Hostnames: obie nazwy **Active** (status i certyfikat).
3. Michał mówi „scalaj”: scalenie PR, CI wdraża Workera (trasy przechodzą, bo nazwy są Active). Ruch dalej idzie do WordPressa, bo DNS się jeszcze nie zmienił.
4. Sprawdzenie przed przełączeniem: `curl --resolve matygowaosada.pl:443:<IP z `dig pms-saas.audiowizard.pl`> https://matygowaosada.pl/` pokazuje nową stronę.
5. Michał dodaje `matygowaosada.pl` i `www` (ścieżki `panel`, `admin`) do aplikacji Cloudflare Access „Panel strony Matygowa”, bez `/api`.
6. Przemek przestawia `@` i `www` na CNAME `pms-saas.audiowizard.pl` (szara chmurka), usuwając stare rekordy A/CNAME WordPressa. Przełączenie trwa chwilę (TTL), potem gości obsługuje nowa strona. Rekordów poczty (MX, SPF, DKIM) nie ruszamy.
7. Testy po przełączeniu: strona, `/en`, `www` → 301, kilka starych adresów WordPressa, `/robots.txt` i `/sitemap.xml` z nową domeną, `/panel` za Access, rezerwacja z paska otwiera `booking.matygowaosada.pl`.
8. Powrót w razie kłopotu: Przemek przywraca dawne rekordy `@` i `www` (WordPress wraca w kilka minut).

## Do zrobienia przed produkcją

- Cloudflare Access na `/panel` i `/admin` (Payload nie ma własnego 2FA), bez `/api` (obrazy dla gości). Hasła panelu: PBKDF2 100 000 rund (limit Workers), łatka `patches/payload@3.92.0.patch`; przy aktualizacji Payloada sprawdź, czy łatka nadal pasuje.
- `SITE_INDEXABLE=true` jest w `wrangler.jsonc`; indeksowana jest tylko nazwa `matygowaosada.pl`, adres testowy ma zawsze `noindex` i zamknięty robots.txt (`src/edge/hosts.ts`).
- Zdjęcia obiektów w Okolicy: w Galerii i mediach przefiltruj „Prawa do zdjęcia” = „Czeka na zgodę”. Każde takie zdjęcie albo dostaje zgodę obiektu na piśmie (zmień na „Zgoda obiektu”, w repo `pending` na `granted` w `scripts/media/okolica.py`), albo znika. Na produkcji (`SITE_INDEXABLE=true`) strona i tak ich nie pokazuje. Prośby wysłał Michał 25.10.2026 (Termy Bukovina, Terma Bania, SkyWalk, Kotelnica, Szymoszkowa, PKL, Flisacy, Bielska Jaskinia).
- Termy Bukovina zgodziły się 18.11.2026 (mail Moniki Gustaw, marketing) na użycie wybranych zdjęć w zakładce „Okolica”, pod warunkiem podania źródła i linku do termybukovina.pl; tylko ta publikacja, bez przekazywania i użycia w innych materiałach. Cztery zdjęcia od nich (`A_termy-bukovina_z1…z4`, prawa „granted”, podpis „Fot. Termy Bukovina · termybukovina.pl”) zastąpiły zdjęcia ze strony obiektu. Na żywo: workflow CI z `import_content` i `import_only=attraction-photos` wgrywa pliki i podmienia tylko zdjęcie główne i galerię tej atrakcji.
- Opinie z Google (`src/lib/reviews.ts`, cron w poniedziałki i czwartki 4:30 UTC; tylko 5 gwiazdek): klucz API z Google Cloud ograniczony do „Places API (New)”, wpisany jako sekret Workera `GOOGLE_PLACES_API_KEY` (Settings → Variables and Secrets, kiedy nie trwa żadne wdrożenie), oraz Place ID obiektu (z [Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id), zaczyna się od „ChIJ”) w `GOOGLE_PLACE_ID` w `wrangler.jsonc`. Rola menedżera wizytówki nie jest potrzebna, bo opinie są publiczne. Place ID jest już w `wrangler.jsonc`; do działania brakuje tylko sekretu. Google zwraca do 5 opinii na zapytanie, więc baza rośnie z czasem.
- Opinie z Booking: Booking.com nie ma publicznego API opinii (tylko dla partnerów Connectivity), więc wpisuje się je w panelu (źródło Booking, ocena w skali 10). Na stronie pokazują się od 9/10. Na stronie losowane są pół na pół z Google (`ReviewShuffle`).
