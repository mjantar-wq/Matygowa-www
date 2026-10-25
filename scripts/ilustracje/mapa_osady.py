"""G1: mapa osady jako warstwowy SVG.

Układ budynków odrysowany ze zdjęcia z drona „Nazwy domków 2026.jpg” (płótno 1400×800 odpowiada
kadrowi zdjęcia). Kolory wyłącznie z tokenów --color-*, więc mapa sama zmienia się w trybach noc i lato.
Identyfikatory b-dom-* i b-apartamenty są umówione z wątkiem efektów (podświetlenie, dymki).
Uruchom: python3 scripts/ilustracje/mapa_osady.py
"""
import json, math
from pathlib import Path
from tokeny import z_zapasem

ROOT = Path(__file__).resolve().parents[2]
W, H = 1400, 800

# Domki: środek dachu, szerokość, wysokość (px zdjęcia), wysokość szczytu w m.
DOMY = [
    ("woloszyn", "Wołoszyn", 2155, 457, 250, 108, 112),
    ("lomnica", "Łomnica", 2634, 581, 397, 106, 110),
    ("lodowy", "Lodowy", 2627, 828, 396, 106, 110),
    ("swinica", "Świnica", 2301, 431, 572, 116, 116),
    ("gerlach", "Gerlach", 2655, 681, 572, 116, 116),
    ("hawran", "Hawrań", 2152, 934, 572, 116, 116),
]
# Budynek z apartamentami (otwarcie wiosną 2027): jedna bryła po przekątnej, odrysowana ze zdjęcia z drona.
# (środek x, y, długość wzdłuż kalenicy, szerokość, obrót w stopniach)
APT = (905, 184, 212, 94, 47.6)
APT_ZNACZNIK = APT[:2]
# Cztery apartamenty w jednej bryle typu bliźniak (Michał, 25.10.2026): w górnej części na mapie
# Czerwone Wierchy i Kominiarski Wierch, w dolnej Giewont i Ciemniak.
APARTAMENTY = [("czerwone-wierchy", "Czerwone Wierchy", "gora"), ("kominiarski", "Kominiarski Wierch", "gora"), ("giewont", "Giewont", "dol"), ("ciemniak", "Ciemniak", "dol")]
# Plac zabaw (otwarcie 2027): na lewo od apartamentów
PLAC = (650, 192, 128, 84)

# Światło z zachodu-północnego zachodu: połacie zwrócone ku niemu jaśniejsze, od niego ciemniejsze.
SWIATLO = (-0.87, -0.5)

def polac(punkty, normalna, rot):
    """Trójkąt lub wielokąt połaci z klasą tonu zależną od kierunku, w który połać opada (po obrocie)."""
    r = math.radians(rot); nx, ny = normalna
    wx, wy = nx * math.cos(r) - ny * math.sin(r), nx * math.sin(r) + ny * math.cos(r)
    k = wx * SWIATLO[0] + wy * SWIATLO[1]
    # cztery tony: zachód najjaśniejszy, północ półcień, południe pełny ton, wschód najciemniejszy
    klasa = "dach-jasna" if k > 0.6 else "dach-ciemna" if k < -0.6 else "dach dach-pol" if k > 0 else "dach"
    return f'<path class="{klasa}" d="M' + " L".join(f"{x:.1f},{y:.1f}" for x, y in punkty) + ' Z"/>'

def krzyz(c, b, rot):
    """Skrzyżowanie dwóch dachów dwuspadowych o równym spadku (rzut z drona): kalenice na krzyż,
    kosze po przekątnych, osiem trójkątnych połaci. c to środek wzdłuż osi, b to pół szerokości."""
    C, out = (c, 0), []
    for (ex, ey), (kx, ky) in [((0, -b), (-b, -b)), ((0, -b), (b, -b)), ((b, 0), (b, -b)), ((b, 0), (b, b)),
                               ((0, b), (b, b)), ((0, b), (-b, b)), ((-b, 0), (-b, b)), ((-b, 0), (-b, -b))]:
        # połać leży między kalenicą (środek → ex,ey) a koszem (środek → kx,ky); opada w stronę naroża prostopadle do kalenicy
        n = (kx, 0) if ex == 0 else (0, ky)
        out.append(polac([C, (c + ex, ey), (c + kx, ky)], (n[0] / b, n[1] / b), rot))
    return out

def dach(cx, cy, w, h, rot=0):
    """Dach domku jak na zdjęciu z drona: dwa dachy dwuspadowe na krzyż nad kwadratowym korpusem
    i niższe skrzydło z dachem dwuspadowym po lewej (zachodniej) stronie."""
    b = min(w, h) / 2 * 0.86; e, t = b * 0.44, b * 0.5  # pół boku korpusu, wysunięcie i pół szerokości skrzydła
    x0 = e / 2                                         # korpus przesunięty w prawo, skrzydło wystaje w lewo
    g = [polac([(-b - e, -t), (-b, -t), (-b, 0), (-b - e, 0)], (0, -1), rot),
         polac([(-b - e, 0), (-b, 0), (-b, t), (-b - e, t)], (0, 1), rot)]
    g += krzyz(0, b, rot)
    g.append(f'<path class="kalenica" d="M0,{-b} L0,{b} M{-b},0 L{b},0 M{-b},{-b} L{b},{b} M{b},{-b} L{-b},{b} M{-b - e},0 L{-b},0"/>')
    return f'<g transform="translate({cx + x0} {cy}) rotate({rot})">{"".join(g)}</g>'

def apartamenty_dach(cx, cy, l, w, rot, p=12):
    """Budynek z apartamentami jako jedna bryła: długi dach dwuspadowy wzdłuż osi i dwa poprzeczne
    szczyty (jak w domkach), wysunięte poza ściany po obu stronach."""
    b, c = w / 2, l / 4; g = []
    for s0, s1 in [(-l / 2, -c - b), (-c + b, c - b), (c + b, l / 2)]:   # odcinki samego dachu głównego
        if s1 > s0:
            g += [polac([(s0, -b), (s1, -b), (s1, 0), (s0, 0)], (0, -1), rot), polac([(s0, 0), (s1, 0), (s1, b), (s0, b)], (0, 1), rot)]
    for cc in (-c, c):
        for d in (-1, 1):  # wysunięte szczyty poprzeczne: dwie połacie rozdzielone kalenicą
            y0, y1 = d * b, d * (b + p)
            g += [polac([(cc - b, y0), (cc, y0), (cc, y1), (cc - b, y1)], (-1, 0), rot), polac([(cc, y0), (cc + b, y0), (cc + b, y1), (cc, y1)], (1, 0), rot)]
        g += krzyz(cc, b, rot)
    k = f"M{-l/2},0 L{l/2},0" + "".join(f" M{cc},{-b - p} L{cc},{b + p} M{cc - b},{-b} L{cc + b},{b} M{cc + b},{-b} L{cc - b},{b}" for cc in (-c, c))
    g.append(f'<path class="kalenica" d="{k}"/>')
    return f'<g transform="translate({cx} {cy}) rotate({rot})">{"".join(g)}</g>'

def naklejka(x, y, rot=-5):
    """Plakietka „Otwarcie 2027” / „Opening 2027”: wersja językowa z atrybutu lang strony (SVG wstawiany w treść)."""
    return (f'<g class="naklejka" transform="translate({x} {y}) rotate({rot})">'
            '<rect class="naklejka-cien" x="-66" y="-14" width="132" height="30" rx="15"/>'
            '<rect class="naklejka-tlo" x="-68" y="-17" width="136" height="30" rx="15"/>'
            '<text class="naklejka-tekst pl" x="0" y="3" text-anchor="middle">Otwarcie 2027</text>'
            '<text class="naklejka-tekst en" x="0" y="3" text-anchor="middle">Opening 2027</text></g>')

def piwnica():
    """Opis piwnicy wzdłuż dłuższego boku skrzydła od strony rogu działki (siłownia i świetlica, też od 2027)."""
    cx, cy, l, w, rot = APT
    return (f'<g class="piwnica" transform="translate({cx} {cy}) rotate({rot}) translate(0 {-w/2 - 26})">'
            f'<path class="piwnica-linia" d="M{-l/2 + 8},4 L{l/2 - 8},4"/>'
            '<text class="piwnica-tekst pl" x="0" y="-16" text-anchor="middle">W piwnicy: siłownia</text>'
            '<text class="piwnica-tekst pl" x="0" y="-2" text-anchor="middle">i świetlica dla dzieci · od 2027</text>'
            '<text class="piwnica-tekst en" x="0" y="-16" text-anchor="middle">Basement: gym</text>'
            '<text class="piwnica-tekst en" x="0" y="-2" text-anchor="middle">and kids’ playroom · from 2027</text></g>')

def plac_zabaw(cx, cy, w, h):
    """Plac zabaw w rzucie z góry: miękka nawierzchnia z drewnianym obrzeżem, wieża z daszkiem i zjeżdżalnią,
    huśtawka z dwoma siedziskami, piaskownica i dwa krzewy. Wszystko z tokenów, więc działa w nocy i zimą."""
    x0, y0 = cx - w / 2, cy - h / 2
    return (f'<rect class="plac" x="{x0}" y="{y0}" width="{w}" height="{h}" rx="16"/>'
            f'<rect class="plac-obrys" x="{x0}" y="{y0}" width="{w}" height="{h}" rx="16"/>'
            # huśtawka: belka na dwóch kozłach i dwa siedziska na łańcuchach
            f'<path class="plac-drewno" d="M{x0+14},{y0+20} L{x0+58},{y0+20} M{x0+14},{y0+13} L{x0+14},{y0+27} M{x0+58},{y0+13} L{x0+58},{y0+27}"/>'
            f'<path class="plac-lancuch" d="M{x0+26},{y0+20} L{x0+26},{y0+33} M{x0+32},{y0+20} L{x0+32},{y0+33} M{x0+40},{y0+20} L{x0+40},{y0+33} M{x0+46},{y0+20} L{x0+46},{y0+33}"/>'
            f'<rect class="plac-siedzisko" x="{x0+24}" y="{y0+33}" width="10" height="4" rx="1.5"/><rect class="plac-siedzisko" x="{x0+38}" y="{y0+33}" width="10" height="4" rx="1.5"/>'
            # wieża z daszkiem (cztery połacie) i zjeżdżalnia łukiem w dół
            f'<path class="plac-zjezdzalnia" d="M{x0+w-30},{y0+40} C{x0+w-30},{y0+56} {x0+w-44},{y0+66} {x0+w-62},{y0+h-10}"/>'
            f'<rect class="plac-drewno-pole" x="{x0+w-44}" y="{y0+12}" width="28" height="28" rx="2"/>'
            f'<path class="dach-jasna" d="M{x0+w-46},{y0+10} L{x0+w-14},{y0+10} L{x0+w-30},{y0+26} Z"/><path class="dach-ciemna" d="M{x0+w-14},{y0+10} L{x0+w-14},{y0+42} L{x0+w-30},{y0+26} Z"/>'
            f'<path class="dach" d="M{x0+w-14},{y0+42} L{x0+w-46},{y0+42} L{x0+w-30},{y0+26} Z"/><path class="dach-jasna" d="M{x0+w-46},{y0+42} L{x0+w-46},{y0+10} L{x0+w-30},{y0+26} Z"/>'
            # piaskownica z drewnianą ramą i krzewy
            f'<rect class="plac-piasek" x="{x0+14}" y="{y0+h-36}" width="30" height="24" rx="3"/>'
            f'<circle class="plac-krzew" cx="{x0+w-8}" cy="{y0+h-8}" r="9"/><circle class="plac-krzew" cx="{x0+6}" cy="{y0+h/2}" r="7"/>')

def drzewa(seed, x0, y0, x1, y1, n):
    """Świerki jako kropki: deterministyczny rozrzut, żeby kolejne przebiegi dawały ten sam plik."""
    out, s = [], seed
    for _ in range(n):
        s = (s * 1103515245 + 12345) % 2**31; x = x0 + (s % 1000) / 1000 * (x1 - x0)
        s = (s * 1103515245 + 12345) % 2**31; y = y0 + (s % 1000) / 1000 * (y1 - y0)
        s = (s * 1103515245 + 12345) % 2**31; r = 9 + (s % 9)
        out.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r}"/>')
    return "".join(out)

def poziomice():
    """Łagodne poziomice łąki: stok opada ku drodze (dół kadru)."""
    out = []
    for i in range(9):
        y0 = 40 + i * 86
        d = " ".join(f"{'M' if j == 0 else 'L'}{x},{y0 + 18 * math.sin(x / 210 + i * .7) + 0.04 * x:.1f}" for j, x in enumerate(range(0, W + 1, 25)))
        out.append(f'<path d="{d}"/>')
    return "".join(out)

L = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-labelledby="g1-tytul">',
     '<title id="g1-tytul">Mapa Matygowej Osady: sześć domków oraz budynek z apartamentami i plac zabaw otwierane w 2027</title>',
     '<style>'
     '.teren{fill:var(--color-tlo)}.dzialka{fill:var(--color-tlo-2)}'
     '.poziomice path{fill:none;stroke:var(--color-poziomica);stroke-width:1;opacity:.45;vector-effect:non-scaling-stroke}'
     '.droga{fill:none;stroke:var(--color-linia-mocna);stroke-linecap:round;stroke-linejoin:round}'
     '.ogrodzenie{fill:none;stroke:var(--color-wyciszony);stroke-width:1;stroke-dasharray:2 5;vector-effect:non-scaling-stroke}'
     '.las circle{fill:var(--color-swierk);opacity:.28}'
     '.stozek{fill:var(--color-bursztyn);opacity:.08}'
     '.dach{fill:var(--color-atrament)}.dach-jasna{fill:color-mix(in srgb,var(--color-atrament) 70%,var(--color-tlo))}.dach-pol{fill:color-mix(in srgb,var(--color-atrament) 84%,var(--color-tlo))}.dach-ciemna{fill:color-mix(in srgb,var(--color-atrament) 92%,#000)}'
     '.kalenica{fill:none;stroke:var(--color-tlo-2);stroke-width:1;opacity:.35;vector-effect:non-scaling-stroke}'
     '.is-wkrotce{opacity:.92}'
     '.plac{fill:color-mix(in srgb,var(--color-bursztyn) 18%,var(--color-tlo))}.plac-obrys{fill:none;stroke:var(--color-wyciszony);stroke-width:1;stroke-dasharray:2 4;vector-effect:non-scaling-stroke}'
     '.plac-drewno{fill:none;stroke:color-mix(in srgb,var(--color-bursztyn) 55%,var(--color-atrament));stroke-width:3;stroke-linecap:round}.plac-lancuch{fill:none;stroke:var(--color-wyciszony);stroke-width:1;vector-effect:non-scaling-stroke}'
     '.plac-siedzisko{fill:var(--color-atrament)}.plac-drewno-pole{fill:color-mix(in srgb,var(--color-bursztyn) 55%,var(--color-atrament))}'
     '.plac-zjezdzalnia{fill:none;stroke:var(--color-bursztyn);stroke-width:7;stroke-linecap:round}'
     '.plac-piasek{fill:color-mix(in srgb,var(--color-bursztyn) 35%,var(--color-tlo));stroke:color-mix(in srgb,var(--color-bursztyn) 55%,var(--color-atrament));stroke-width:3}'
     '.plac-krzew{fill:var(--color-swierk);opacity:.45}'
     '.naklejka-tlo{fill:var(--color-bursztyn);stroke:var(--color-tlo);stroke-width:2}.naklejka-cien{fill:var(--color-atrament);opacity:.18}'
     '.naklejka-tekst{font:700 12px var(--font-ui,sans-serif);letter-spacing:.14em;text-transform:uppercase;fill:#1a1208}'
     '.piwnica-tekst{font:500 11px var(--font-ui,sans-serif);letter-spacing:.04em;fill:var(--color-atrament-2);paint-order:stroke;stroke:var(--color-tlo-2);stroke-width:4px;stroke-linejoin:round}.piwnica-linia{fill:none;stroke:var(--color-bursztyn);stroke-width:1.5;stroke-dasharray:1 4;stroke-linecap:round;vector-effect:non-scaling-stroke}'
     '.en{display:none}:root[lang="en"] .naklejka .pl,:root[lang="en"] .piwnica .pl{display:none}:root[lang="en"] .naklejka .en,:root[lang="en"] .piwnica .en{display:inline}'
     '.nazwa{font:700 15px var(--font-tabliczka,Georgia,serif);letter-spacing:.1em;text-transform:uppercase;fill:var(--color-atrament)}'
     '.opis{font:500 12px var(--font-ui,sans-serif);letter-spacing:.06em;fill:var(--color-wyciszony)}'
     '.znacznik{fill:var(--color-bursztyn)}'
     '.etykieta-tlo{fill:var(--color-tlo);opacity:.9}'
     '</style>',
     f'<rect class="teren" width="{W}" height="{H}"/>',
     f'<g class="poziomice" id="warstwa-poziomice">{poziomice()}</g>',
     '<g id="warstwa-dzialka"><path class="dzialka" d="M395,105 L1080,82 L1112,700 L338,700 Z"/>'
     '<path class="ogrodzenie" d="M395,105 L1080,82 L1112,700 L338,700 Z"/></g>',
     f'<g class="las" id="warstwa-las">{drzewa(7, 1100, 40, 1390, 560, 70)}{drzewa(11, 150, 735, 1000, 800, 26)}{drzewa(3, 990, 0, 1180, 120, 12)}</g>',
     '<g id="warstwa-drogi">'
     '<path class="droga" stroke-width="22" d="M-10,770 C300,722 900,716 1250,748 L1410,760"/>'
     '<path class="droga" stroke-width="12" d="M1060,730 C1052,560 1046,430 1010,350 C980,300 930,300 870,300 L560,300"/>'
     '<path class="droga" stroke-width="8" d="M745,300 L745,690 M560,300 L520,300 C500,300 490,320 490,340 L490,480"/></g>',
     # Widok na Tatry: osada patrzy na południe, tu przyjęte jako dół kadru (do potwierdzenia przy orientacji zdjęcia).
     '<g id="warstwa-widok"><path class="stozek" d="M681,640 L180,800 L1180,800 Z"/></g>',
     '<g id="budynki">']

for slug, nazwa, wys, cx, cy, w, h in DOMY:
    L.append(f'<g id="b-dom-{slug}" class="budynek" data-nazwa="{nazwa}" data-szczyt-m="{wys}" tabindex="0" role="button" aria-label="Domek {nazwa}">'
             f'{dach(cx, cy, w, h)}<circle class="znacznik" cx="{cx}" cy="{cy}" r="5"/>'
             f'<rect class="etykieta-tlo" x="{cx - 70}" y="{cy + h/2 + 8}" width="140" height="42" rx="2"/>'
             f'<text class="nazwa" x="{cx}" y="{cy + h/2 + 27}" text-anchor="middle">{nazwa}</text>'
             f'<text class="opis" x="{cx}" y="{cy + h/2 + 44}" text-anchor="middle">{wys} m n.p.m.</text></g>')

apts = ",".join(n for _, n, _ in APARTAMENTY)
L.append(f'<g id="b-apartamenty" class="budynek is-wkrotce" data-otwarcie="2027-04" data-apartamenty="{apts}" tabindex="0" role="button" aria-label="Apartamenty: w górnej części Czerwone Wierchy i Kominiarski Wierch, w dolnej Giewont i Ciemniak, otwarcie wiosną 2027">')
L.append(apartamenty_dach(*APT) + f'<circle class="znacznik" cx="{APT_ZNACZNIK[0]}" cy="{APT_ZNACZNIK[1]}" r="5"/>')
L.append('<rect class="etykieta-tlo" x="830" y="4" width="230" height="44" rx="2"/>'
         '<text class="nazwa" x="945" y="24" text-anchor="middle">Apartamenty</text>'
         '<text class="opis" x="945" y="41" text-anchor="middle">4 apartamenty</text>' + naklejka(1000, 64, -4) + piwnica() + '</g>')
px, py, pw, ph = PLAC
L.append(f'<g id="b-plac-zabaw" class="obiekt is-wkrotce" data-otwarcie="2027" aria-label="Plac zabaw dla dzieci, otwarcie 2027">{plac_zabaw(*PLAC)}'
         f'<rect class="etykieta-tlo" x="{px - 60}" y="{py + ph/2 + 8}" width="120" height="26" rx="2"/>'
         f'<text class="opis" x="{px}" y="{py + ph/2 + 25}" text-anchor="middle">Plac zabaw</text>' + naklejka(px, py - ph/2 - 6, 4) + '</g>')
L.append('</g></svg>')

out = ROOT / "public/ilustracje/G1_mapa_osady.svg"; out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(z_zapasem("\n".join(L)))
(ROOT / "public/ilustracje/G1_mapa_osady.json").write_text(json.dumps({
    "zrodlo": "Nazwy domków 2026.jpg (dron)",
    "domy": [{"id": f"b-dom-{s}", "nazwa": n, "szczytM": h, "x": x, "y": y} for s, n, h, x, y, *_ in DOMY],
    "plac": {"id": "b-plac-zabaw", "otwarcie": "2027"},
    "apartamenty": {"id": "b-apartamenty", "otwarcie": "2027-04", "lokale": [{"slug": s, "nazwa": n, "czesc": c} for s, n, c in APARTAMENTY]},
}, ensure_ascii=False, indent=1))
print(out)
