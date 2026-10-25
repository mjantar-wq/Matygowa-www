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
# Budynek z apartamentami (otwarcie wiosną 2027): dwa skrzydła z dachem dwuspadowym, odrysowane ze zdjęcia z drona.
# (środek x, y, długość wzdłuż kalenicy, szerokość, obrót w stopniach)
APT_SKRZYDLA = [(942, 242, 150, 74, 35), (872, 162, 136, 68, -22)]  # najpierw skrzydło południowo-wschodnie, na nim północno-zachodnie
APT_ZNACZNIK = (905, 200)
APARTAMENTY = [("czerwone-wierchy", "Czerwone Wierchy"), ("giewont", "Giewont"), ("kominiarski", "Kominiarski Wierch"), ("ciemniak", "Ciemniak")]  # Ciemniak: nazwa wstępna, bez podpisu na zdjęciu (content/README.md)
# Plac zabaw (otwarcie 2027): na lewo od apartamentów
PLAC = (700, 196, 116, 76)

def dach(cx, cy, w, h, rot=0):
    """Dach domku jak na zdjęciu z drona: kopertowy korpus i boczny szczyt po lewej.
    Połacie od światła (góra, lewo) jaśniejsze, od cienia ciemniejsze, żeby bryła czytała się jak model."""
    a, b = w / 2 * 0.86, h / 2          # pół szerokości korpusu, pół wysokości
    e, t = w / 2 - a + w * 0.07, h * 0.24  # wysunięcie i pół szerokości bocznego szczytu
    n, s_, l, p = f"{-a},{-b} {a},{-b}", f"{a},{b} {-a},{b}", -a, a
    sciany = [
        ("dach-jasna", f"M{-a},{-b} L{a},{-b} L0,0 Z"),          # połać północna
        ("dach-ciemna", f"M{a},{-b} L{a},{b} L0,0 Z"),            # wschodnia
        ("dach", f"M{a},{b} L{-a},{b} L0,0 Z"),                   # południowa
        ("dach-jasna", f"M{-a},{b} L{-a},{-b} L0,0 Z"),           # zachodnia
        ("dach-jasna", f"M{-a - e},{-t} L{-a},{-t} L{-t * 0.2},{-t * 0.15} L{-t * 0.2},0 L{-a - e},0 Z"),  # boczny szczyt, połać od światła
        ("dach", f"M{-a - e},0 L{-t * 0.2},0 L{-t * 0.2},{t * 0.15} L{-a},{t} L{-a - e},{t} Z"),             # boczny szczyt, połać w cieniu
    ]
    g = "".join(f'<path class="{k}" d="{d}"/>' for k, d in sciany)
    g += f'<path class="kalenica" d="M{-a},{-b} L{a},{b} M{a},{-b} L{-a},{b} M{-a - e},0 L0,0"/>'
    return f'<g transform="translate({cx} {cy}) rotate({rot})">{g}</g>'

def dach_dwuspadowy(cx, cy, l, w, rot):
    """Skrzydło z dachem dwuspadowym: kalenica wzdłuż dłuższego boku, połać od światła jaśniejsza."""
    return (f'<g transform="translate({cx} {cy}) rotate({rot})">'
            f'<rect class="dach-jasna" x="{-l/2}" y="{-w/2}" width="{l}" height="{w/2}"/>'
            f'<rect class="dach" x="{-l/2}" y="0" width="{l}" height="{w/2}"/>'
            f'<path class="kalenica" d="M{-l/2},0 L{l/2},0"/></g>')

def naklejka(x, y, rot=-5):
    """Plakietka „Otwarcie 2027” / „Opening 2027”: wersja językowa z atrybutu lang strony (SVG wstawiany w treść)."""
    return (f'<g class="naklejka" transform="translate({x} {y}) rotate({rot})">'
            '<rect class="naklejka-cien" x="-66" y="-14" width="132" height="30" rx="15"/>'
            '<rect class="naklejka-tlo" x="-68" y="-17" width="136" height="30" rx="15"/>'
            '<text class="naklejka-tekst pl" x="0" y="3" text-anchor="middle">Otwarcie 2027</text>'
            '<text class="naklejka-tekst en" x="0" y="3" text-anchor="middle">Opening 2027</text></g>')

def piwnica():
    """Opis piwnicy wzdłuż dłuższego boku skrzydła od strony rogu działki (siłownia i świetlica, też od 2027)."""
    cx, cy, l, w, rot = APT_SKRZYDLA[0]
    return (f'<g class="piwnica" transform="translate({cx} {cy}) rotate({rot}) translate(46 {-w/2 - 6})">'
            f'<path class="piwnica-linia" d="M{-l/2 + 20},4 L{l/2 - 52},4"/>'
            '<text class="piwnica-tekst pl" x="0" y="-16" text-anchor="middle">W piwnicy: siłownia</text>'
            '<text class="piwnica-tekst pl" x="0" y="-2" text-anchor="middle">i świetlica dla dzieci · od 2027</text>'
            '<text class="piwnica-tekst en" x="0" y="-16" text-anchor="middle">Basement: gym</text>'
            '<text class="piwnica-tekst en" x="0" y="-2" text-anchor="middle">and kids’ playroom · from 2027</text></g>')

def plac_zabaw(cx, cy, w, h):
    """Plac zabaw w rzucie: ogrodzone pole z piaskiem, huśtawka, zjeżdżalnia i piaskownica jako proste znaki."""
    x0, y0 = cx - w / 2, cy - h / 2
    return (f'<rect class="plac" x="{x0}" y="{y0}" width="{w}" height="{h}" rx="10"/>'
            f'<rect class="plac-obrys" x="{x0}" y="{y0}" width="{w}" height="{h}" rx="10"/>'
            f'<path class="plac-znak" d="M{x0+16},{y0+18} L{x0+44},{y0+18} M{x0+18},{y0+12} L{x0+18},{y0+24} M{x0+42},{y0+12} L{x0+42},{y0+24} M{x0+26},{y0+18} L{x0+26},{y0+30} M{x0+34},{y0+18} L{x0+34},{y0+30} M{x0+23},{y0+30} L{x0+29},{y0+30} M{x0+31},{y0+30} L{x0+37},{y0+30}"/>'
            f'<path class="plac-znak" d="M{x0+62},{y0+16} L{x0+74},{y0+16} L{x0+74},{y0+28} L{x0+62},{y0+28} Z M{x0+74},{y0+20} L{x0+102},{y0+48} M{x0+74},{y0+26} L{x0+98},{y0+50}"/>'
            f'<circle class="plac-piasek" cx="{x0+30}" cy="{y0+54}" r="12"/>')

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
     '.dach{fill:var(--color-atrament)}.dach-jasna{fill:color-mix(in srgb,var(--color-atrament) 78%,var(--color-tlo))}.dach-ciemna{fill:color-mix(in srgb,var(--color-atrament) 92%,#000)}'
     '.kalenica{fill:none;stroke:var(--color-tlo-2);stroke-width:1;opacity:.35;vector-effect:non-scaling-stroke}'
     '.is-wkrotce{opacity:.92}'
     '.plac{fill:color-mix(in srgb,var(--color-bursztyn) 18%,var(--color-tlo))}.plac-obrys{fill:none;stroke:var(--color-wyciszony);stroke-width:1;stroke-dasharray:2 4;vector-effect:non-scaling-stroke}'
     '.plac-znak{fill:none;stroke:var(--color-atrament);stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}.plac-piasek{fill:color-mix(in srgb,var(--color-bursztyn) 40%,var(--color-tlo));stroke:var(--color-atrament);stroke-width:1.2}'
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

apts = ",".join(n for _, n in APARTAMENTY)
L.append(f'<g id="b-apartamenty" class="budynek is-wkrotce" data-otwarcie="2027-04" data-apartamenty="{apts}" tabindex="0" role="button" aria-label="Apartamenty Czerwone Wierchy, Giewont, Kominiarski Wierch i Ciemniak, otwarcie wiosną 2027">')
L.append("".join(dach_dwuspadowy(*sk) for sk in APT_SKRZYDLA) + f'<circle class="znacznik" cx="{APT_ZNACZNIK[0]}" cy="{APT_ZNACZNIK[1]}" r="5"/>')
L.append('<rect class="etykieta-tlo" x="830" y="14" width="230" height="46" rx="2"/>'
         '<text class="nazwa" x="945" y="34" text-anchor="middle">Apartamenty</text>'
         '<text class="opis" x="945" y="52" text-anchor="middle">4 apartamenty</text>' + naklejka(905, 86) + piwnica() + '</g>')
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
    "apartamenty": {"id": "b-apartamenty", "otwarcie": "2027-04", "lokale": [{"slug": s, "nazwa": n} for s, n in APARTAMENTY]},
}, ensure_ascii=False, indent=1))
print(out)
