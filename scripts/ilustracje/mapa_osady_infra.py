"""G1 (nakładka): drogi dojazdowe, ścieżki piesze, parkingi z latarniami, carport, panele i odpady.

Szkic Michała z 15.11.2026. Skrypt nakłada infrastrukturę na gotowy public/ilustracje/G1_mapa_osady.svg
(zastępuje warstwę „warstwa-drogi”), bo SVG ma ręczne poprawki nowsze niż generator mapa_osady.py.
Uruchom: python3 scripts/ilustracje/mapa_osady_infra.py
"""
import math, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TOKENY = {"tlo": "#ffffff", "tlo-2": "#f3f5f4", "linia-mocna": "#7f8b86", "atrament": "#1c2321", "atrament-2": "#37413d",
          "wyciszony": "#56625e", "swierk": "#1f5c4a", "bursztyn": "#c47a2a", "poziomica": "#6e8b98"}
CSS = '.droga-podjazd{fill:var(--color-linia-mocna);stroke:none}.sciezka{fill:none;stroke:var(--color-atrament-2);stroke-width:4;stroke-linecap:round;stroke-linejoin:round;opacity:.8}.parking{fill:color-mix(in srgb,var(--color-linia-mocna) 38%,var(--color-tlo-2));stroke:var(--color-wyciszony);stroke-width:1;vector-effect:non-scaling-stroke}.auto-cien{fill:#000;opacity:.22}.auto-szyba{fill:#27323a;opacity:.85}.auto-dach{opacity:.82;stroke:#000;stroke-opacity:.12;stroke-width:.6}.podzial{fill:none;stroke:var(--color-tlo);stroke-width:1;stroke-dasharray:3 3;opacity:.8;vector-effect:non-scaling-stroke}.latarnia{fill:var(--color-atrament)}.latarnia-rdzen{fill:var(--color-bursztyn)}.carport-dach{fill:#3a4d58}.pv-linia{fill:none;stroke:#cfdbe2;stroke-width:1;opacity:.4;vector-effect:non-scaling-stroke}.pv-pole{fill:#3a4d58;stroke:var(--color-wyciszony);stroke-width:1;vector-effect:non-scaling-stroke}.odpady-pole{fill:var(--color-tlo-2);stroke:var(--color-wyciszony);stroke-width:1;vector-effect:non-scaling-stroke}.swiatlo{display:none;pointer-events:none}:root[data-pora="noc"] .swiatlo{display:inline}:root[data-pora="noc"] .auto{filter:brightness(.72)}:root[data-pora="noc"] .carport-dach,:root[data-pora="noc"] .pv-pole{fill:#2c3a43}:root[data-sezon="zima"] .carport-dach,:root[data-sezon="zima"] .pv-pole{fill:#e4ecf0}:root[data-sezon="zima"][data-pora="noc"] .carport-dach,:root[data-sezon="zima"][data-pora="noc"] .pv-pole{fill:#7d8e99}:root[data-sezon="zima"] .pv-linia{stroke:#8fa2ad;opacity:.7}.pojemnik{fill:var(--color-swierk);opacity:.85}.pojemnik-2{fill:var(--color-bursztyn)}.pojemnik-3{fill:var(--color-wyciszony)}'

# --- Infrastruktura: drogi, ścieżki, parkingi, carport, panele, odpady (szkic Michała, 15.11.2026) ---
# Skala przyjęta z domków: bok domu ok. 108 px ~ 10 m, czyli ok. 11 px na metr (auto ok. 27 x 53 px).
DROGA = "M560,316 L880,316 C985,316 1056,390 1060,490 L1062,730"
PARKINGI = [  # środek x, y, układ: "p" aut obok siebie (pionowo), "l" aut jedno nad drugim (poziomo); strona z latarniami (g, d, l); obrót 180°; auta
    (562, 277, "p", "g", False, ("s", "sedan", "n", "suv")), (692, 347, "p", "d", True, ("r", "kompakt", "b", "sedan")),
    (981, 420, "l", "l", False, ("g", "suv", "p", "kompakt")), (1023, 543, "l", "l", False, ("z", "sedan", "s", "suv")),
    (783, 679, "p", "g", False, ("b", "suv", "n", "kompakt")), (530, 679, "p", "g", False, ("g", "sedan", "r", "suv"))]
SCIEZKI = ["M507,301 L507,322 L560,322", "M658,322 L658,425 L628,425", "M874,438 L874,468 L1048,468",
           "M498,726 L498,617 L489,617", "M750,724 L750,619 L739,619",
           # do wejścia apartamentów (środek dłuższego boku): równolegle do kalenicy, potem krótki łuk do drogi
           "M941,150 L953,139 L1025,222 C1048,250 1048,320 1012,362"]
CARPORT = [(1078, 337), (1128, 336), (1145, 627), (1095, 628)]
PV = (1147, 625, 88, 85)
ODPADY = (1247, 684, 42, 40)

SAMOCHODY = {  # kolory karoserii (stałe, bo nie ma ich w tokenach): srebrny, biały, grafit, granat, bordo, zieleń, piaskowy
    "s": "#aab3b6", "b": "#eceeea", "g": "#3b4240", "n": "#2f4d6b", "r": "#8a3030", "z": "#4f7048", "p": "#b8a88a"}
TYPY = {"sedan": (22, 48), "suv": (24, 47), "kompakt": (21, 42)}

def auto(x, y, obrot, kolor, typ):
    """Samochód z góry: karoseria, szyby, dach, lusterka, światła. Przód zwrócony w górę, obrót w stopniach."""
    w, l = TYPY[typ]; hw, hl = w / 2, l / 2; k = SAMOCHODY[kolor]
    szyba = f'<path class="auto-szyba" d="M{-hw + 3},{-hl * .28:.1f} L{hw - 3},{-hl * .28:.1f} L{hw - 2},{-hl * .06:.1f} L{-hw + 2},{-hl * .06:.1f} Z"/>'
    tyl = f'<path class="auto-szyba" d="M{-hw + 3.5},{hl * .46:.1f} L{hw - 3.5},{hl * .46:.1f} L{hw - 4.5},{hl * .28:.1f} L{-hw + 4.5},{hl * .28:.1f} Z"/>'
    return (f'<g class="auto" transform="translate({x:.1f} {y:.1f}) rotate({obrot})">'
            f'<rect class="auto-cien" x="{-hw + 1}" y="{-hl + 1.5}" width="{w}" height="{l}" rx="6"/>'
            f'<rect x="{-hw}" y="{-hl}" width="{w}" height="{l}" rx="6" fill="{k}"/>'
            f'<rect class="auto-dach" x="{-hw + 2.5}" y="{-hl * .04:.1f}" width="{w - 5}" height="{hl * .34:.1f}" rx="2" fill="{k}"/>'
            f'{szyba}{tyl}'
            f'<rect x="{-hw - 1.6}" y="{-hl * .3:.1f}" width="2.4" height="3.2" rx="1" fill="{k}"/><rect x="{hw - 0.8}" y="{-hl * .3:.1f}" width="2.4" height="3.2" rx="1" fill="{k}"/>'
            f'<rect x="{-hw + 2}" y="{-hl + .8}" width="4.2" height="1.8" rx=".8" fill="#fbf3d4"/><rect x="{hw - 6.2}" y="{-hl + .8}" width="4.2" height="1.8" rx=".8" fill="#fbf3d4"/>'
            f'<rect x="{-hw + 2}" y="{hl - 2.6}" width="4.2" height="1.8" rx=".8" fill="#b02424"/><rect x="{hw - 6.2}" y="{hl - 2.6}" width="4.2" height="1.8" rx=".8" fill="#b02424"/></g>')

BOK = 54  # wszystkie parkingi jednakowe: 54 x 54 px (2 auta po ok. 2,4 m)

def parking(cx, cy, uklad, lampy, obrot=False, auta=("s", "sedan", "g", "suv")):
    w = h = BOK; x, y = cx - w / 2, cy - h / 2
    o = [f'<rect class="parking" x="{x:.1f}" y="{y:.1f}" width="{w}" height="{h}" rx="2"/>']
    if uklad == "p":
        o.append(f'<path class="podzial" d="M{cx},{y + 3:.1f} L{cx},{y + h - 3:.1f}"/>')
        rot = 180 if obrot else 0
        o += [auto(cx + dx, cy, rot, auta[i * 2], auta[i * 2 + 1]) for i, dx in enumerate((-13.5, 13.5))]
    else:
        o.append(f'<path class="podzial" d="M{x + 3:.1f},{cy} L{x + w - 3:.1f},{cy}"/>')
        o += [auto(cx, cy + dy, -90, auta[i * 2], auta[i * 2 + 1]) for i, dy in enumerate((-13.5, 13.5))]
    poz = {"g": [(x + 3, y + 2), (x + w - 3, y + 2)], "d": [(x + 3, y + h - 2), (x + w - 3, y + h - 2)],
           "l": [(x + 2, y + 3), (x + 2, y + h - 3)]}[lampy]
    lamp = "".join(f'<g class="latarnia"><circle cx="{lx:.1f}" cy="{ly:.1f}" r="3.4"/><circle class="latarnia-rdzen" cx="{lx:.1f}" cy="{ly:.1f}" r="1.4"/></g>' for lx, ly in poz)
    return f'<g class="parking-miejsce" data-miejsc="2">{"".join(o)}{lamp}</g>'

def swiatlo():
    """Poświata latarni (tylko w nocy, data-pora=noc): miękki bursztynowy krąg wokół każdej lampy."""
    out = ['<defs><radialGradient id="g1-poswiata"><stop offset="0" style="stop-color:var(--color-bursztyn,#c47a2a)" stop-opacity=".6"/>'
           '<stop offset=".35" style="stop-color:var(--color-bursztyn,#c47a2a)" stop-opacity=".26"/><stop offset="1" style="stop-color:var(--color-bursztyn,#c47a2a)" stop-opacity="0"/></radialGradient></defs>']
    for cx, cy, uklad, lampy, *_ in PARKINGI:
        x, y = cx - BOK / 2, cy - BOK / 2
        poz = {"g": [(x + 3, y + 2), (x + BOK - 3, y + 2)], "d": [(x + 3, y + BOK - 2), (x + BOK - 3, y + BOK - 2)], "l": [(x + 2, y + 3), (x + 2, y + BOK - 3)]}[lampy]
        out += [f'<circle cx="{lx:.1f}" cy="{ly:.1f}" r="42" fill="url(#g1-poswiata)"/>' for lx, ly in poz]
    return '<g id="warstwa-swiatlo" class="swiatlo" aria-hidden="true">' + "".join(out) + '</g>'

def carport():
    (x0, y0), (x1, y1), (x2, y2), (x3, y3) = CARPORT
    pts = f"M{x0},{y0} L{x1},{y1} L{x2},{y2} L{x3},{y3} Z"
    lin = "".join(f'<path class="pv-linia" d="M{x0 + (x3 - x0) * i / 10:.1f},{y0 + (y3 - y0) * i / 10:.1f} L{x1 + (x2 - x1) * i / 10:.1f},{y1 + (y2 - y1) * i / 10:.1f}"/>' for i in range(1, 10))
    mid = f'<path class="pv-linia" d="M{(x0 + x1) / 2:.1f},{(y0 + y1) / 2:.1f} L{(x3 + x2) / 2:.1f},{(y3 + y2) / 2:.1f}"/>'
    return f'<g id="carport" data-miejsc="10"><path class="carport-dach" d="{pts}"/>{lin}{mid}</g>'

def panele(x, y, w, h):
    o = [f'<rect class="pv-pole" x="{x}" y="{y}" width="{w}" height="{h}" rx="2"/>']
    o += [f'<path class="pv-linia" d="M{x},{y + h * i / 5:.1f} L{x + w},{y + h * i / 5:.1f}"/>' for i in range(1, 5)]
    o += [f'<path class="pv-linia" d="M{x + w * i / 6:.1f},{y} L{x + w * i / 6:.1f},{y + h}"/>' for i in range(1, 6)]
    return f'<g id="panele-sloneczne">{"".join(o)}</g>'

def odpady(x, y, w, h):
    b = "".join(f'<rect class="pojemnik{k}" x="{x + 5 + i * 12}" y="{y + 10}" width="9" height="{h - 18}" rx="1.5"/>' for i, k in enumerate(("", "-2", "-3")))
    return f'<g id="odpady"><rect class="odpady-pole" x="{x}" y="{y}" width="{w}" height="{h}" rx="2"/>{b}</g>'

def podpis(x, y, pl, en, szer):
    return (f'<g class="podpis-infra" aria-hidden="true"><rect class="etykieta-tlo" x="{x - szer / 2:.0f}" y="{y - 14}" width="{szer}" height="19" rx="2"/>'
            f'<text class="opis tl" x="{x}" y="{y}" text-anchor="middle"><tspan class="pl">{pl}</tspan><tspan class="en">{en}</tspan></text></g>')

def podjazd():
    """Wjazd wokół budynku z apartamentami: droga łagodnie poszerza się na zakręcie (do ok. 2,5 razy), potem wraca do zwykłej szerokości."""
    P = [(840, 316), (930, 320), (1058, 500), (1062, 693)]
    pts = [(740 + 100 * i / 10, 316) for i in range(10)]
    for i in range(0, 17):
        t = 0.6 * i / 16; m = 1 - t
        pts.append((m**3 * P[0][0] + 3 * m**2 * t * P[1][0] + 3 * m * t**2 * P[2][0] + t**3 * P[3][0],
                    m**3 * P[0][1] + 3 * m**2 * t * P[1][1] + 3 * m * t**2 * P[2][1] + t**3 * P[3][1]))
    n = len(pts) - 1; L, R = [], []
    for i, (x, y) in enumerate(pts):
        x0, y0 = pts[max(i - 1, 0)]; x1, y1 = pts[min(i + 1, n)]
        dx, dy = x1 - x0, y1 - y0; d = math.hypot(dx, dy) or 1
        hw = 9 + 15 * max(math.sin(math.pi * i / n), 0) ** 1.5
        L.append((x - dy / d * hw, y + dx / d * hw)); R.append((x + dy / d * hw, y - dx / d * hw))
    return "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in L + R[::-1]) + " Z"

INFRA = ('<g id="warstwa-drogi">'
         '<path class="droga" stroke-width="22" d="M-10,770 C300,722 900,716 1250,748 L1410,760"/>'
         f'<path class="droga" stroke-width="18" d="{DROGA}"/>'
         '<path class="droga" stroke-width="30" d="M530,704 L530,728 M783,704 L783,724 M1004,420 L1034,420"/>'
         '</g>'
         '<g id="warstwa-sciezki">' + "".join(f'<path class="sciezka" d="{d}"/>' for d in SCIEZKI) + '</g>'
         '<g id="warstwa-parkingi">' + "".join(parking(*q) for q in PARKINGI) + carport() + '</g>'
         + swiatlo() +
         '<g id="warstwa-energia">' + panele(*PV) + odpady(*ODPADY)
         + podpis(1180, 456, "Carport: 10 miejsc", "Carport: 10 cars", 124)
         + podpis(1191, 614, "Panele słoneczne", "Solar panels", 118)
         + podpis(1268, 676, "Odpady", "Waste", 58) + '</g>')


def main():
    p = ROOT / "public/ilustracje/G1_mapa_osady.svg"
    s = p.read_text()
    css = re.sub(r"var\(--color-([a-z0-9-]+)(?:,[^)]*)?\)", lambda m: f"var(--color-{m[1]},{TOKENY[m[1]]})", CSS)
    css = re.sub(r"color-mix\(in srgb,", "color-mix(in srgb,", css)
    s = re.sub(r"<style>.*?(?=\.ogrodzenie\{)", lambda m: m[0], s, count=1, flags=re.S)
    s = re.sub(r"\.droga-podjazd\{.*?(?=\.ogrodzenie\{)", "", s, count=1, flags=re.S)  # idempotencja
    s = s.replace(".ogrodzenie{", css + ".ogrodzenie{", 1)
    s = re.sub(r'<g id="warstwa-sciezki">.*?</g>(?=</svg>)', "", s, flags=re.S)
    if "<!--infra-->" in s:
        s, n = re.subn(r"<!--infra-->.*?<!--/infra-->", lambda m: "<!--infra-->" + INFRA + "<!--/infra-->", s, count=1, flags=re.S)
    else:
        s, n = re.subn(r'<g id="warstwa-drogi">.*?</g>', lambda m: "<!--infra-->" + INFRA + "<!--/infra-->", s, count=1, flags=re.S)
    assert n == 1
    # ścieżki na wierzchu (nad podpisami domków), więc wycinamy je z warstwy infrastruktury i dopinamy na końcu
    m = re.search(r'<g id="warstwa-sciezki">.*?</g>', s, flags=re.S)
    s = s[:m.start()] + s[m.end():]
    s = s.replace("</svg>", m[0] + "</svg>", 1)
    p.write_text(s)
    print(p)

if __name__ == "__main__":
    main()
