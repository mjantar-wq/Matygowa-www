"""G1 (nakładka): drogi dojazdowe, ścieżki piesze, parkingi z latarniami, carport, panele i odpady.

Szkic Michała z 15.11.2026. Skrypt nakłada infrastrukturę na gotowy public/ilustracje/G1_mapa_osady.svg
(zastępuje warstwę „warstwa-drogi”), bo SVG ma ręczne poprawki nowsze niż generator mapa_osady.py.
Uruchom: python3 scripts/ilustracje/mapa_osady_infra.py
"""
import math, random, re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
TOKENY = {"tlo": "#ffffff", "tlo-2": "#f3f5f4", "linia-mocna": "#7f8b86", "atrament": "#1c2321", "atrament-2": "#37413d",
          "wyciszony": "#56625e", "swierk": "#1f5c4a", "bursztyn": "#c47a2a", "poziomica": "#6e8b98"}
CSS = '.droga-podjazd{fill:var(--color-linia-mocna);stroke:none}.sciezka{fill:none;stroke:var(--color-atrament-2);stroke-width:4;stroke-linecap:round;stroke-linejoin:round;opacity:.8}.parking{fill:color-mix(in srgb,var(--color-linia-mocna) 38%,var(--color-tlo-2));stroke:var(--color-wyciszony);stroke-width:1;vector-effect:non-scaling-stroke}.auto-cien{fill:#000;opacity:.22}.auto-szyba{fill:#27323a;opacity:.85}.auto-dach{opacity:.82;stroke:#000;stroke-opacity:.12;stroke-width:.6}.podzial{fill:none;stroke:var(--color-tlo);stroke-width:1;stroke-dasharray:3 3;opacity:.8;vector-effect:non-scaling-stroke}.latarnia{fill:var(--color-atrament)}.latarnia-rdzen{fill:var(--color-bursztyn)}.carport-dach{fill:#3a4d58}.pv-linia{fill:none;stroke:#cfdbe2;stroke-width:1;opacity:.4;vector-effect:non-scaling-stroke}.pv-pole{fill:#3a4d58;stroke:var(--color-wyciszony);stroke-width:1;vector-effect:non-scaling-stroke}.odpady-pole{fill:var(--color-tlo-2);stroke:var(--color-wyciszony);stroke-width:1;vector-effect:non-scaling-stroke}.snieg{display:none;pointer-events:none}:root[data-sezon="zima"] .snieg{display:inline}.zaspa-tlo{fill:#c3d3de;opacity:.55}.zaspa-bryla{fill:#fff}.snieg-dach{fill:#fff}.snieg-dach.s0{fill:#fff}.snieg-dach.s1{fill:#e6edf2}.snieg-dach.s2{fill:#cfdbe4}.snieg-dach.s3{fill:#b3c3d0}:root[data-pora="noc"] .snieg-dach.s0{fill:#e9eef2}:root[data-pora="noc"] .snieg-dach.s1{fill:#d3dce3}:root[data-pora="noc"] .snieg-dach.s2{fill:#bcc8d1}:root[data-pora="noc"] .snieg-dach.s3{fill:#a0afbb}.mo-hotspot:hover .snieg-dach.snieg-dach,.mo-hotspot.is-lit .snieg-dach.snieg-dach{fill:var(--color-bursztyn)}.mo-hotspot:hover .snieg-dach-linia,.mo-hotspot.is-lit .snieg-dach-linia{opacity:0}:root[data-pora="noc"] .mo-hotspot:not(.is-wkrotce) .snieg-dom{filter:drop-shadow(0 0 6px var(--color-bursztyn))}.snieg-dom{filter:drop-shadow(1.5px 2.5px 1.2px rgba(70,95,115,.55))}:root[data-pora="noc"] .snieg-dom{filter:drop-shadow(1.5px 2.5px 1.5px rgba(0,0,0,.7))}.snieg-dach-linia{fill:none;stroke:#9db0bd;stroke-width:1;opacity:.55;vector-effect:non-scaling-stroke}.snieg-auto{fill:#fff;opacity:.9}.snieg-pobocze{fill:none;stroke:#fff;stroke-linecap:round;opacity:.95}:root[data-sezon="zima"] .sezon-zima .zaspa,:root[data-sezon="zima"] .sezon-zima .zaspa-cien{display:none}:root[data-pora="noc"] .zaspa-tlo{fill:#2a3640;opacity:.8}:root[data-pora="noc"] .zaspa-bryla{fill:#6c7c88}:root[data-pora="noc"] .snieg-pobocze{fill:none;stroke:#8b9ba7}:root[data-pora="noc"] .snieg-auto{fill:#a7b6c1}.swiatlo{display:none;pointer-events:none}:root[data-pora="noc"] .swiatlo{display:inline}:root[data-pora="noc"] .auto{filter:brightness(.72)}:root[data-pora="noc"] .carport-dach,:root[data-pora="noc"] .pv-pole{fill:#2c3a43}:root[data-sezon="zima"] .carport-dach,:root[data-sezon="zima"] .pv-pole{fill:#e4ecf0}:root[data-sezon="zima"][data-pora="noc"] .carport-dach,:root[data-sezon="zima"][data-pora="noc"] .pv-pole{fill:#7d8e99}:root[data-sezon="zima"] .pv-linia{stroke:#8fa2ad;opacity:.7}.pojemnik{fill:var(--color-swierk);opacity:.85}.pojemnik-2{fill:var(--color-bursztyn)}.pojemnik-3{fill:var(--color-wyciszony)}'

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
            f'<rect class="snieg snieg-auto" x="{-hw + 4.5}" y="{-hl * .02:.1f}" width="{w - 9}" height="{hl * .24:.1f}" rx="3"/>'
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


# --- Śnieg (tylko wersje zimowe: data-sezon=zima) ---
DOMKI = [(457, 250, 108, 112), (581, 397, 106, 110), (828, 396, 106, 110), (431, 572, 116, 116), (681, 572, 116, 116), (934, 572, 116, 116)]
APT_SRODEK = (905, 184, 212, 94, 47.6)

def blob(rng, cx, cy, r, fx=1.25, fy=.72, lo=.62, hi=1.15):
    """Nieregularna zaspa: wygładzony wielokąt (Catmull-Rom → Béziery), spłaszczona w poziomie."""
    n = rng.randint(8, 11)
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n + rng.uniform(-.2, .2)
        rr = r * rng.uniform(lo, hi)
        pts.append((cx + rr * math.cos(a) * fx, cy + rr * math.sin(a) * fy))
    d = f"M{pts[0][0]:.1f},{pts[0][1]:.1f}"
    for i in range(n):
        p0, p1, p2, p3 = pts[i - 1], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]
        d += (f" C{p1[0] + (p2[0] - p0[0]) / 6:.1f},{p1[1] + (p2[1] - p0[1]) / 6:.1f} "
              f"{p2[0] - (p3[0] - p1[0]) / 6:.1f},{p2[1] - (p3[1] - p1[1]) / 6:.1f} {p2[0]:.1f},{p2[1]:.1f}")
    return d + " Z"

def _zajete(x, y, margines):
    """Czy punkt wypada na budynku, podpisie, parkingu, drodze lub innym obiekcie (wtedy bez zaspy)."""
    for cx, cy, w, h in DOMKI:
        if abs(x - cx) < w / 2 + margines + 6 and abs(y - cy) < h / 2 + margines + 6: return True
        if abs(x - cx) < 78 + margines and cy + h / 2 - 4 < y < cy + h / 2 + 56 + margines: return True  # podpis pod domkiem
    cx, cy, l, w, rot = APT_SRODEK; r = math.radians(rot)
    u = (x - cx) * math.cos(r) + (y - cy) * math.sin(r); v = -(x - cx) * math.sin(r) + (y - cy) * math.cos(r)
    if abs(u) < l / 2 + 28 + margines and abs(v) < w / 2 + 28 + margines: return True
    for px, py, *_ in PARKINGI:
        if abs(x - px) < BOK / 2 + 8 + margines and abs(y - py) < BOK / 2 + 8 + margines: return True
    if 580 < x < 725 and 140 < y < 290: return True      # plac zabaw z podpisem
    if 900 < x < 1400 and 40 < y < 190: return True      # dymek i naklejka apartamentów
    if 1060 < x < 1160 and 320 < y < 640: return True    # carport
    if 1130 < x < 1330 and 440 < y < 740: return True    # panele, odpady i podpisy
    if 1170 < x < 1330 and 600 < y < 730: return True
    for t in range(0, 61):                                 # droga wewnętrzna
        tt = t / 60; m = 1 - tt
        bx = m**3 * 880 + 3 * m**2 * tt * 985 + 3 * m * tt**2 * 1056 + tt**3 * 1060
        by = m**3 * 316 + 3 * m**2 * tt * 316 + 3 * m * tt**2 * 390 + tt**3 * 490
        if (x - bx) ** 2 + (y - by) ** 2 < (20 + margines) ** 2: return True
    if 555 < x < 890 and abs(y - 316) < 20 + margines: return True
    if x > 1030 and 480 < y < 735 and abs(x - 1060) < 20 + margines: return True
    if y > 690 and x < 1300: return True                  # droga główna
    if y > 715: return True
    return False

def snieg_grunt():
    """Zaspy na trawie: łagodne, rozciągnięte poziomo; część na działce (drobniejsze), część na łące wokół."""
    rng = random.Random(11)
    out, n = [], 0
    while n < 230:
        wewn = n < 120
        if wewn:
            y = rng.uniform(100, 690); x0 = 395 - 57 * (y - 105) / 595; x1 = 1080 + 32 * (y - 82) / 618
            x = rng.uniform(x0 + 8, x1 - 8); r = rng.choice((4, 5, 7, 9, 12)) * rng.uniform(.8, 1.25)
        else:
            x, y = rng.uniform(20, 1380), rng.uniform(10, 700); r = rng.choice((7, 9, 12, 16, 22)) * rng.uniform(.8, 1.2)
            if 330 < x < 1120 and 80 < y < 705: continue
        if _zajete(x, y, r): continue
        d = blob(rng, x, y, r, 1.9, .62, .75, 1.1)
        out.append(f'<path class="zaspa-tlo" transform="translate(.8 1.8)" d="{d}"/><path class="zaspa-bryla" d="{d}"/>')
        n += 1
    return '<g id="warstwa-snieg-grunt" class="snieg" aria-hidden="true">' + "".join(out) + '</g>'

SWIATLO = (-0.87, -0.5)  # jak w mapa_osady.py: światło z zachodu-północnego zachodu

def _ton(nx, ny):
    """Klasa tonu połaci zależna od kierunku, w który opada: 0 najjaśniejsza (od światła) … 3 najciemniejsza."""
    k = nx * SWIATLO[0] + ny * SWIATLO[1]
    return 0 if k > .6 else 1 if k > 0 else 3 if k < -.6 else 2

def snieg_dom(cx, cy, w, h):
    """Dach domku biały z cieniowaniem połaci (rzut z góry, dwa dachy na krzyż: osiem trójkątów plus cztery ganki).
    Wstawiany do grupy domku, żeby podświetlenie przy wyborze domku (hover, fokus) działało także zimą."""
    a, b = w * .43, h * .43
    o = []
    for sx in (-1, 1):
        for sy in (-1, 1):
            o.append(f'<path class="snieg-dach s{_ton(0, sy)}" d="M0,0 L{sx * a:.1f},0 L{sx * a:.1f},{sy * b:.1f} Z"/>')
            o.append(f'<path class="snieg-dach s{_ton(sx, 0)}" d="M0,0 L0,{sy * b:.1f} L{sx * a:.1f},{sy * b:.1f} Z"/>')
    for sx in (-1, 1):
        o.append(f'<rect class="snieg-dach s{_ton(sx, 0)}" x="{(a if sx > 0 else -w / 2):.1f}" y="{-h * .14:.1f}" width="{w / 2 - a:.1f}" height="{h * .28:.1f}"/>')
    for sy in (-1, 1):
        o.append(f'<rect class="snieg-dach s{_ton(0, sy)}" x="{-w * .14:.1f}" y="{(b if sy > 0 else -h / 2):.1f}" width="{w * .28:.1f}" height="{h / 2 - b:.1f}"/>')
    o.append(f'<path class="snieg-dach-linia" d="M{-a:.1f},{-b:.1f} L{a:.1f},{b:.1f} M{a:.1f},{-b:.1f} L{-a:.1f},{b:.1f} M0,{-h * .5:.1f} L0,{h * .5:.1f} M{-w * .5:.1f},0 L{w * .5:.1f},0"/>')
    return f'<g class="snieg snieg-dom" aria-hidden="true" transform="translate({cx} {cy})">{"".join(o)}</g>'

def snieg_apartamenty():
    cx, cy, l, w, rot = APT_SRODEK
    r = math.radians(rot)
    t_gora = _ton(math.sin(r), -math.cos(r)); t_dol = _ton(-math.sin(r), math.cos(r))  # połacie po obu stronach kalenicy
    return (f'<g class="snieg snieg-dom" aria-hidden="true" transform="translate({cx} {cy}) rotate({rot})">'
            f'<rect class="snieg-dach s{t_gora}" x="{-l * .5}" y="{-w * .5}" width="{l}" height="{w / 2}"/>'
            f'<rect class="snieg-dach s{t_dol}" x="{-l * .5}" y="0" width="{l}" height="{w / 2}"/>'
            f'<path class="snieg-dach-linia" d="M{-l * .5},0 L{l * .5},0 M0,{-w * .5} L0,{w * .5}"/></g>')

def pobocza():
    """Zwałki śniegu po bokach odśnieżonych dróg i podjazdów."""
    return ('<g class="snieg" aria-hidden="true">'
            f'<path class="snieg-pobocze" stroke-width="27" d="{DROGA}"/>'
            '<path class="snieg-pobocze" stroke-width="35" d="M-10,770 C300,722 900,716 1250,748 L1410,760"/>'
            '<path class="snieg-pobocze" stroke-width="35" d="M530,704 L530,728 M783,704 L783,724 M1004,420 L1034,420"/></g>')

INFRA = (pobocza() + '<g id="warstwa-drogi">'
         '<path class="droga" stroke-width="22" d="M-10,770 C300,722 900,716 1250,748 L1410,760"/>'
         f'<path class="droga" stroke-width="18" d="{DROGA}"/>'
         '<path class="droga" stroke-width="30" d="M530,704 L530,728 M783,704 L783,724 M1004,420 L1034,420"/>'
         '</g>'
         '<g id="warstwa-sciezki">' + "".join(f'<path class="sciezka" d="{d}"/>' for d in SCIEZKI) + '</g>'
         + snieg_grunt() +
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
    # starsze wersje dopinały ścieżki na końcu pliku; teraz leżą w warstwie infrastruktury, pod podpisami domków
    if "<!--/infra-->" in s:
        glowa, ogon = s.split("<!--/infra-->", 1)
        s = glowa + "<!--/infra-->" + re.sub(r'<g id="warstwa-sciezki">.*?</g>', "", ogon, flags=re.S)
    if "<!--infra-->" in s:
        s, n = re.subn(r"<!--infra-->.*?<!--/infra-->", lambda m: "<!--infra-->" + INFRA + "<!--/infra-->", s, count=1, flags=re.S)
    else:
        s, n = re.subn(r'<g id="warstwa-drogi">.*?</g>', lambda m: "<!--infra-->" + INFRA + "<!--/infra-->", s, count=1, flags=re.S)
    assert n == 1
    # śnieg na dachach: domki na wierzchu, apartamenty tuż pod swoimi plakietkami z nazwami
    s = re.sub(r"<!--snieg-->.*?<!--/snieg-->", "", s, flags=re.S)
    for cx, cy, w, h in DOMKI:
        znacznik = f'<circle class="znacznik" cx="{cx}" cy="{cy}" r="5"/>'
        assert znacznik in s, znacznik
        s = s.replace(znacznik, "<!--snieg-->" + snieg_dom(cx, cy, w, h) + "<!--/snieg-->" + znacznik, 1)
    s = s.replace('<g class="apt-nazwa"', "<!--snieg-->" + snieg_apartamenty() + '<!--/snieg--><g class="apt-nazwa"', 1)
    p.write_text(s)
    print(p)

if __name__ == "__main__":
    main()
