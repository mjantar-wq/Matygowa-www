# Treści nowej strony Matygowej Osady (S7)

Stan: wersja 1, 24.10.2026. Teksty PL i EN, gotowe do importu do Payload CMS.

## Format
- Jeden plik JSON na kolekcję, `slug` jako klucz, pola lokalizowane `{"pl": "...", "en": "..."}` (gotowe na kolejne języki: sk, ar).
- Tekst długi to Markdown (tylko *kursywa*), do zamiany na Lexical przy imporcie.
- Media jako nazwy ról (np. `hero-panorama-swit`), pliki dobiera strumień foto.
- Pole `note` to uwaga redakcyjna, nie trafia na stronę.
- Źródło: `_src/*.py`, budowanie: `python3 _src/build.py` (nadpisuje JSON i `podglad-tresci.md`).

| Plik | Kolekcja Payload |
|---|---|
| settings.json | globalne Ustawienia (pasek rezerwacji, kontakt, menu, przełączniki, SEO domyślne) |
| peaks.json | Szczyty i historie (10) |
| units.json | Domy i apartamenty (6 + 4, apartamenty `coming_soon`), powiązanie `peak` i `icecoldres_code` |
| pages/home.json | Strona główna jako bloki, w kolejności szkieletu |
| pages/rytualy.json, osada.json, przewodnik.json | Podstrony |
| attractions.json, offers.json, testimonials.json | Atrakcje, Oferty, Opinie |

testimonials.json: 4 prawdziwe opinie z Google (odczyt z widżetu obecnej strony 24.10.2026), daty przybliżone, EN to tłumaczenie. Ocen pojedynczych opinii widżet nie pokazuje (ogólnie 5,0). Później widżet Google.

## Do potwierdzenia przez Michała
1. Nazwy domów potwierdzone (zdjęcie „Nazwy domków 2026”, zgodne z IceColdRes). Ciemniak bez podpisu na zdjęciu, nazwa wstępna.
2. Nazwy apartamentów są wstępne. Ciemniak jest jednym z czterech Czerwonych Wierchów, więc dwa apartamenty nazywają się od tego samego masywu; tekst to wykorzystuje, ale warto rozważyć inny szczyt.
3. Lista lokalnych partnerów, ręczniki do bani.
4. Ceny ofert sezonowych (Boże Narodzenie, ferie) są z obecnej strony; w IceColdRes oznaczone „do potwierdzenia”.

## Źródła faktów o szczytach
- Hawrań: summitpost.org/havran/589554
- Gerlach: en.wikipedia.org/wiki/Gerlachovský_štít, national-geographic.pl (Gerlach: fakty)
- Świnica: summitpost.org/mountain/rock/152562/swinica.html
- Wołoszyn: summitpost.org/mountain/rock/154678/woloszyn.html, en.wikipedia.org/wiki/Wołoszyn
- Łomnica: en.wikipedia.org/wiki/Lomnický_štít, Alpine Journal 1990 (Gajewski, Townson)
- Lodowy: en.wikipedia.org/wiki/Ľadový_štít
- Czerwone Wierchy: en.wikipedia.org/wiki/Czerwone_Wierchy
- Kominiarski Wierch: summitpost.org/kominiarski-wierch/400371
- Giewont: en.wikipedia.org/wiki/Giewont
- Ciemniak: en.wikipedia.org/wiki/Ciemniak_(mountain)
- Obiekt, ceny, zasady: matygowaosada.pl (strona główna, domy, o nas, oferty, kontakt, regulamin), IceColdRes `apps/api/src/import/matygowa-osada.ts`

## Jeszcze nie zrobione (M4)
Mapa przekierowań ze starej strony, dane strukturalne (schema.org LodgingBusiness, VacationRental), opisy SEO podstron.
