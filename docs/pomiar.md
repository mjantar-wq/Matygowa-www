# Pomiar, zgody i dokumenty

Strona nie ładuje żadnego skryptu pomiarowego, dopóki w panelu nie ma identyfikatora Google Tag Manager. GA4 i piksel Meta są tagami w GTM i startują dopiero po zgodzie gościa (Consent Mode v2, tryb podstawowy). Wszystko jest bezpłatne.

## Jak to działa

| Element | Gdzie |
|---|---|
| Baner zgód: „Akceptuję wszystkie”, „Tylko niezbędne”, „Wybieram sam”; ponowne otwarcie linkiem „Ustawienia cookies” w stopce | `src/components/ConsentBanner.tsx` |
| Zgoda w ciasteczku `mo_zgody` (12 miesięcy) na domenie nadrzędnej, więc silnik rezerwacji na `booking.matygowaosada.pl` może odczytać ten sam wybór | `src/lib/consent.ts` |
| `gtag('consent','default', denied)` przed GTM, potem zapisany wybór i zdarzenie `consent_ready`; kliknięcie w banerze wysyła `consent update` i `consent_update` | `src/lib/consent.ts`, `src/components/Analytics.tsx` |
| Identyfikator GTM | panel: Ustawienia strony → Pomiar i zgody |
| `booking_click` (pasek rezerwacji i każdy link do silnika), `contact_click` (telefon, e-mail, WhatsApp) | `src/lib/tracking.ts`, `src/components/ClickTracking.tsx`, `src/components/BookingBar.tsx` |
| UTM z pierwszego wejścia w sesji trafiają do silnika, także gdy gość obejrzał po drodze inne podstrony | `campaignParams()` w `src/lib/tracking.ts` |
| Kontener GTM do importu | [`docs/gtm/kontener-matygowa.json`](gtm/kontener-matygowa.json) |
| Regulamin, polityka prywatności, polityka cookies (PL/EN) | `content/documents.json`, import `pnpm seed`; adresy `/regulamin`, `/prywatnosc`, `/dokumenty/cookies` (`/en/terms`, `/en/privacy`, `/en/documents/cookies`) |

Zdarzenia w `dataLayer`:

| Zdarzenie | Parametry |
|---|---|
| `booking_click` | `booking_location` (`booking_bar` albo `link`), `unit`, `arrival`, `nights`, `adults`, `children` |
| `contact_click` | `contact_method` (`phone`, `email`, `whatsapp`) |
| `consent_ready`, `consent_update` | `consent_analytics`, `consent_marketing` |

Pasek rezerwacji jest zwykłym formularzem GET z ukrytymi polami, bo tylko taki formularz linker GA4 uzupełnia o `_gl` (sesja przechodzi na domenę silnika).

## Instrukcja dla Michała (konta na Twój adres)

Obecna strona (WordPress) ma już kontener **GTM-5DGN22VH**, tag Google **GT-PH3VVXRT** z wtyczki Site Kit, baner Complianz i piksel Meta. Najpierw sprawdź, czy masz do nich dostęp: zaloguj się na tagmanager.google.com i analytics.google.com kontem Google, którym konfigurowano Site Kit (WordPress → Site Kit → Ustawienia pokazuje to konto). Jeśli masz dostęp, użyj istniejącej usługi GA4 (zachowasz historię) i przejdź od kroku 2. Jeśli nie, zacznij od kroku 1.

1. **GA4.** analytics.google.com → Administracja → Utwórz → Usługa „Matygowa Osada”, strefa czasowa Polska, waluta PLN → strumień danych „Sieć”: `matygowaosada.pl`. Skopiuj identyfikator pomiaru `G-…`.
2. **Ustawienia GA4:**
   - Administracja → Przechowywanie danych → 14 miesięcy.
   - Strumień danych → Skonfiguruj ustawienia tagu → Skonfiguruj domeny: `matygowaosada.pl`, `booking.matygowaosada.pl`, `matygowa.audiowizard.pl`, `icecoldres.audiowizard.pl` (warunek „zawiera”). To łączy sesję strony z silnikiem rezerwacji.
   - Strumień → Pomiar zaawansowany: włączony (przewijanie, kliknięcia wychodzące, filmy).
   - Administracja → Zdarzenia: gdy pojawi się `booking_click`, oznacz je jako **zdarzenie kluczowe** (to „przejście do rezerwacji”); `purchase` z silnika IceColdRes oznacz tak samo.
   - Administracja → Definicje niestandardowe → wymiary na poziomie zdarzenia: `booking_location`, `unit`, `contact_method`; dane: `nights`.
3. **GTM.** tagmanager.google.com → Utwórz konto „Matygowa Osada”, kontener `matygowaosada.pl`, typ „Sieć”. Skopiuj identyfikator `GTM-…`.
4. **Import kontenera.** Administracja → Importuj kontener → plik `kontener-matygowa.json` → obszar roboczy „Istniejący” (Default Workspace) → **Scal**, „Zmień nazwy elementów w konflikcie”.
5. Zmienne → **GA4 – identyfikator pomiaru**: wpisz `G-…`. **Meta – identyfikator piksela**: wpisz identyfikator z Meta Events Manager (ten sam piksel co dziś).
6. Administracja → Ustawienia kontenera → zaznacz „Włącz przegląd ustawień zgody” (Consent Overview), żeby widzieć, jaka zgoda blokuje który tag.
7. **Panel strony.** matygowa.audiowizard.pl/panel → Ustawienia strony → Pomiar i zgody → wklej `GTM-…` → Zapisz.
8. **Test.** W GTM kliknij „Podgląd”, wpisz `https://matygowa.audiowizard.pl`. Sprawdź: przed zgodą tagi GA4 i Meta są „Nie uruchomiono” (blokada zgody); po „Akceptuję wszystkie” uruchamiają się; „Sprawdź termin” daje `booking_click`. W GA4 → Raporty → Czas rzeczywisty zobaczysz wizytę.
9. Gdy test jest dobry: GTM → **Prześlij** → nazwa wersji „Start: GA4, Meta, Consent Mode”.
10. **Konta dla współpracowników:** dostęp nadajesz w GTM i GA4 → Administracja → Zarządzanie dostępem. Właścicielem zostajesz Ty.

Przy przejściu nowej strony na `matygowaosada.pl` usuń z WordPressa Site Kit, Complianz i stary piksel, żeby nic nie mierzyło dwa razy.

## Do sprawdzenia przed publikacją dokumentów

- Administratorem danych i Wynajmującym jest **DKSKA Sp. z o.o.** (dane z obecnego regulaminu i polityki prywatności); Matygowa Osada, ul. Matygówka 30, to obiekt i adres korespondencyjny.
- Regulamin to obecny „Regulamin rezerwacji oraz pobytu” z 10.10.2025 bez zmian merytorycznych, plus: § 10 ust. 3 zdanie o prawach konsumentów, § 10 ust. 5 (wersja polska rozstrzyga), § 12 (strona i system rezerwacji, wymóg ustawy o świadczeniu usług drogą elektroniczną). Data „Obowiązuje od” do wpisania przy publikacji.
- Do decyzji: § 8 ust. 8 odsyła do „§ 5 ust. 3, 8 i 9”, a chodzi raczej o § 6; § 2 ust. 4 i 6 opisują tylko przelew, a IceColdRes wprowadza płatność online (Stripe) i warunki anulacji z oferty, więc przed uruchomieniem IceColdRes regulamin trzeba z nim zgrać; klauzula sądu właściwego dla siedziby Wynajmującego nie działa wobec konsumentów.
- Treści są w panelu (Strony i sekcje → regulamin / prywatnosc / cookies), więc poprawki prawnika wpisuje się bez wdrożenia. To nie jest porada prawna: przed startem warto dać trzy dokumenty do przejrzenia prawnikowi.
