# Deseń tła strony

Tło całej strony to kafel SVG użyty jako maska CSS (`body::before` w `src/styles/components.css`,
ten sam deseń leży nad panoramą w `src/styles/effects.css`). Kolor nadaje token `--color-linia`,
siłę `--wzor-podhale-krycie`, więc deseń sam działa w trybie dzień/noc.

## Warianty (wszystkie zostają w repo)

| Wariant | Plik | Kafel (desktop / mobile) | Opis |
|---|---|---|---|
| podhale | `public/ilustracje/G6_wzor_podhale_tatry.svg` | 240 / 180 px | pierwszy deseń Michała (25.10.2026) |
| v1 | `public/ilustracje/desen/desen-v1.svg` | 384 / 256 px | haft krzyżykowy, regularny raport |
| v2 | `public/ilustracje/desen/desen-v2.svg` | 768 / 512 px | haft nieregularny, gęsty |
| **v3 (aktywny)** | `public/ilustracje/desen/desen-v3.svg` | 768 / 512 px | haft nieregularny, rzadszy, delikatniejsze motywy |

## Jak zmienić wariant

W `src/styles/components.css` podmień w `:root` wartości `--wzor-podhale` (plik) i `--wzor-podhale-kafel`
(desktop i reguła `@media (max-width: 767px)`) na zestaw z tabeli. Nic więcej nie trzeba zmieniać.

## Generatory

`gen_v1.py`, `gen_v2.py`, `gen_v3.py` (Python 3, bez zależności) generują kafel w wersji kontrastowej i subtelnej.
Plik do repo to wersja kontrastowa bez prostokąta tła, z `fill="#000"` (maska). Układ v2/v3 jest losowany
ze stałym ziarnem (`random.Random(2027)`), więc wynik jest powtarzalny.
