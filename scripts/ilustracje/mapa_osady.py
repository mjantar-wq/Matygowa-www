"""G1: mapa osady jako warstwowy SVG.

Układ budynków odrysowany ze zdjęcia z drona „Nazwy domków 2026.jpg” (płótno 1400×800 odpowiada
kadrowi zdjęcia). Kolory wyłącznie z tokenów --color-*, więc mapa sama zmienia się w trybach noc i lato.
Identyfikatory b-dom-* i b-apartamenty są umówione z wątkiem efektów (podświetlenie, dymki).
Uruchom: python3 scripts/ilustracje/mapa_osady.py
"""
import json, math
from pathlib import Path

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
# Budynek z apartamentami (otwarcie wiosną 2027): obrys z rzutu dachu i linie kalenic.
APT_OBRYS = "M816,170 L874,116 L940,136 L962,186 L1010,226 L1002,292 L956,304 L918,270 L862,208 L818,194 Z"
APT_KALENICE = "M845,165 L905,150 L935,175 M905,150 L898,128 M935,175 L975,240 L962,282 M975,240 L1000,258"
APARTAMENTY = [("czerwone-wierchy", "Czerwone Wierchy"), ("giewont", "Giewont"), ("kominiarski", "Kominiarski Wierch"), ("ciemniak", "Ciemniak")]  # Ciemniak: nazwa wstępna, bez podpisu na zdjęciu (content/README.md)

def dach(cx, cy, w, h, rot=0):
    """Dach czterospadowy w rzucie: obrys i kalenica z czterema narożnymi grzbietami."""
    k = min(w, h) / 2 * 0.8
    pts = [(-w / 2, -h / 2), (w / 2, -h / 2), (w / 2, h / 2), (-w / 2, h / 2)]
    r1, r2 = (-(w / 2 - k), 0), ((w / 2 - k), 0)
    if h > w: r1, r2 = (0, -(h / 2 - k)), (0, (h / 2 - k))
    ridge = f"M{pts[0][0]},{pts[0][1]} L{r1[0]},{r1[1]} L{pts[3][0]},{pts[3][1]} M{r1[0]},{r1[1]} L{r2[0]},{r2[1]} M{pts[1][0]},{pts[1][1]} L{r2[0]},{r2[1]} L{pts[2][0]},{pts[2][1]}"
    return (f'<g transform="translate({cx} {cy}) rotate({rot})"><rect class="dach" x="{-w/2}" y="{-h/2}" width="{w}" height="{h}"/>'
            f'<path class="kalenica" d="{ridge}"/></g>')

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
     '<title id="g1-tytul">Mapa Matygowej Osady: sześć domków i budynek z apartamentami otwierany wiosną 2027</title>',
     '<style>'
     '.teren{fill:var(--color-tlo)}.dzialka{fill:var(--color-tlo-2)}'
     '.poziomice path{fill:none;stroke:var(--color-poziomica);stroke-width:1;opacity:.45;vector-effect:non-scaling-stroke}'
     '.droga{fill:none;stroke:var(--color-linia-mocna);stroke-linecap:round;stroke-linejoin:round}'
     '.ogrodzenie{fill:none;stroke:var(--color-wyciszony);stroke-width:1;stroke-dasharray:2 5;vector-effect:non-scaling-stroke}'
     '.las circle{fill:var(--color-swierk);opacity:.28}'
     '.stozek{fill:var(--color-bursztyn);opacity:.08}'
     '.dach{fill:var(--color-atrament)}.kalenica{fill:none;stroke:var(--color-tlo-2);stroke-width:1;opacity:.55;vector-effect:non-scaling-stroke}'
     '.is-wkrotce .dach{fill:var(--color-tlo);stroke:var(--color-atrament);stroke-width:1.5;stroke-dasharray:6 5;vector-effect:non-scaling-stroke}'
     '.is-wkrotce .kalenica{stroke:var(--color-atrament);opacity:.35}'
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
L.append(f'<path class="dach" d="{APT_OBRYS}"/><path class="kalenica" d="{APT_KALENICE}"/><circle class="znacznik" cx="915" cy="210" r="5"/>')
L.append('<rect class="etykieta-tlo" x="830" y="20" width="230" height="46" rx="2"/>'
         '<text class="nazwa" x="945" y="40" text-anchor="middle">Apartamenty</text>'
         '<text class="opis" x="945" y="58" text-anchor="middle">wiosna 2027 · 4 apartamenty</text></g>')
L.append('</g></svg>')

out = ROOT / "public/ilustracje/G1_mapa_osady.svg"; out.parent.mkdir(parents=True, exist_ok=True)
out.write_text("\n".join(L))
(ROOT / "public/ilustracje/G1_mapa_osady.json").write_text(json.dumps({
    "zrodlo": "Nazwy domków 2026.jpg (dron)",
    "domy": [{"id": f"b-dom-{s}", "nazwa": n, "szczytM": h, "x": x, "y": y} for s, n, h, x, y, *_ in DOMY],
    "apartamenty": {"id": "b-apartamenty", "otwarcie": "2027-04", "lokale": [{"slug": s, "nazwa": n} for s, n in APARTAMENTY]},
}, ensure_ascii=False, indent=1))
print(out)
