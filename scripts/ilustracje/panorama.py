#!/usr/bin/env python3
"""G2: panorama Tatr z osady liczona z modelu terenu (Terrarium/SRTM, AWS Open Data).

Dla każdego azymutu szukamy najwyższego kąta elewacji w trzech pasmach odległości
(osada < 2.5 km, Podhale 2.5–9 km, Tatry > 9 km), co daje trzy linie grani do paralaksy.
Szczyty z listy PEAKS są dosuwane do lokalnego maksimum DEM i sprawdzana jest ich widoczność.
Wynik: public/ilustracje/G2_panorama.svg (kolory tylko przez klasy).
"""
import io, json, math, pathlib, urllib.request
import numpy as np
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
from dem import elev, SITE  # noqa: E402  (wspólny model terenu i punkt osady)
EYE = 6.0                     # m nad terenem (taras, piętro)
PEAKS = [  # slug, nazwa, wysokość (jak w treściach strony), współrzędne wierzchołka (OpenStreetMap)
    ("kominiarski-wierch", "Kominiarski Wierch", 1829, 49.24081, 19.83554),
    ("ciemniak", "Ciemniak", 2096, 49.23101, 19.90341),
    ("czerwone-wierchy", "Czerwone Wierchy", 2122, 49.23166, 19.90949),  # Krzesanica, najwyższy z Czerwonych Wierchów
    ("giewont", "Giewont", 1894, 49.25095, 19.93410),
    ("swinica", "Świnica", 2301, 49.21942, 20.00931),
    ("woloszyn", "Wołoszyn", 2155, 49.22833, 20.05000),
    ("gerlach", "Gerlach", 2655, 49.16403, 20.13406),
    ("lodowy", "Lodowy Szczyt", 2627, 49.19855, 20.18277),
    ("lomnica", "Łomnica", 2634, 49.19514, 20.21303),
    ("hawran", "Hawrań", 2152, 49.24847, 20.19769),
]

R = 6371000.0
def dest(lat, lon, az, d):
    la, lo, a, dr = map(math.radians, (lat, lon, az, 0)) if False else (math.radians(lat), math.radians(lon), math.radians(az), d / R)
    la2 = math.asin(math.sin(la) * math.cos(dr) + math.cos(la) * math.sin(dr) * math.cos(a))
    lo2 = lo + math.atan2(math.sin(a) * math.sin(dr) * math.cos(la), math.cos(dr) - math.sin(la) * math.sin(la2))
    return math.degrees(la2), math.degrees(lo2)

def bearing_dist(lat1, lon1, lat2, lon2):
    p1, p2 = math.radians(lat1), math.radians(lat2); dl = math.radians(lon2 - lon1)
    b = math.degrees(math.atan2(math.sin(dl) * math.cos(p2), math.cos(p1) * math.sin(p2) - math.sin(p1) * math.cos(p2) * math.cos(dl))) % 360
    d = 2 * R * math.asin(math.sqrt(math.sin((p2 - p1) / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2))
    return b, d

H0 = elev(*SITE) + EYE
def angle(h, d):
    return math.degrees(math.atan2(h - H0 - d * d / (2 * R) * 0.87, d))  # 0.87: refrakcja

def snap(lat, lon, r=150):
    best = (elev(lat, lon), lat, lon)
    for dy in range(-r, r + 1, 30):
        for dx in range(-r, r + 1, 30):
            la = lat + dy / 111320; lo = lon + dx / (111320 * math.cos(math.radians(lat)))
            e = elev(la, lo)
            if e > best[0]: best = (e, la, lo)
    return best

AZ0, AZ1, STEP = 240.0, 124.0, 0.05  # od zachodu (lewo) do wschodu (prawo), widok na południe
BANDS = [(80, 2500), (2500, 9000), (9000, 45000)]
azs = np.arange(AZ0, AZ1 - 1e-9, -STEP)
sky = np.full((len(BANDS), len(azs)), -10.0)
for k, az in enumerate(azs):
    for b, (d0, d1) in enumerate(BANDS):
        d = d0
        while d < d1:
            la, lo = dest(*SITE, az, d)
            a = angle(elev(la, lo), d)
            if a > sky[b, k]: sky[b, k] = a
            d += 25 if d < 2500 else (60 if d < 9000 else 120)
def smooth(row, n):
    k = np.ones(n) / n
    return np.convolve(np.pad(row, n // 2, mode="edge"), k, mode="valid")[: len(row)]
sky[0] = smooth(sky[0], 41)   # osada: łagodna linia zbocza
sky[1] = smooth(sky[1], 15)   # Podhale: lekko wygładzone
# warstwy bliższe zasłaniają dalsze: dalsza linia nie niższa niż bliższa (w rysunku robi to kolejność)
peaks = []
for slug, name, h, lat, lon in PEAKS:
    e, la, lo = snap(lat, lon)
    az, d = bearing_dist(*SITE, la, lo)
    a = angle(e, d)
    k = int(round((AZ0 - az) / STEP))
    near = max(sky[0, k], sky[1, k])
    peaks.append(dict(slug=slug, name=name, height=h, az=round(az, 2), dist_km=round(d / 1000, 1), dem=round(float(e)), angle=a, visible=bool(a > near - 0.02), k=k))

W, H = 3200, 900
EXAG = 3.2                      # przewyższenie pionowe ilustracji
xs = (AZ0 - azs) / (AZ0 - AZ1) * W
amin = -1.2
def y(a): return H - (a - amin) * (W / (AZ0 - AZ1)) * EXAG
def path(row, smooth=1):
    pts = " ".join(f"{x:.1f},{y(a):.1f}" for x, a in zip(xs[::smooth], row[::smooth]))
    return f"M0,{H} L{pts} L{W},{H} Z"

L = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-labelledby="g2-title" class="mo-ilustracja mo-panorama-svg">',
     '<title id="g2-title">Panorama Tatr z Matygowej Osady: dziesięć szczytów, od których domy i apartamenty biorą nazwy</title>',
     '<style>.niebo{fill:var(--color-tlo)}.fill-far{fill:var(--color-tlo-2);stroke:var(--color-atrament);stroke-width:1;vector-effect:non-scaling-stroke}.fill-mid{fill:var(--color-poziomica);opacity:.35}.fill-near{fill:var(--color-poziomica);opacity:.7}.line{stroke:var(--color-atrament);stroke-width:1;fill:none;vector-effect:non-scaling-stroke}.accent{fill:var(--color-bursztyn)}.peak-name{font:700 22px var(--font-tabliczka,Georgia,serif);letter-spacing:.1em;text-transform:uppercase;fill:var(--color-atrament)}.peak-h{font:500 18px var(--font-ui,sans-serif);letter-spacing:.06em;fill:var(--color-wyciszony)}</style>',
     f'<rect id="niebo" class="niebo" width="{W}" height="{H}"/>',
     f'<g id="warstwa-tatry"><path class="fill-far" d="{path(sky[2])}"/></g>',
     f'<g id="warstwa-podhale"><path class="fill-mid" d="{path(sky[1])}"/></g>',
     f'<g id="warstwa-osada"><path class="fill-near" d="{path(sky[0])}"/></g>',
     '<g id="szczyty">']
# Etykiety: dla każdego szczytu najniższe wolne miejsce nad nim; prostokąty etykiet i linie odniesienia nie mogą się przecinać.
boxes = []  # (x0, x1, y0, y1) w układzie płótna
def free(x0, x1, y0, y1, lx, ly1):
    for b0, b1, c0, c1 in boxes:
        if x0 < b1 + 12 and x1 > b0 - 12 and y0 < c1 + 6 and y1 > c0 - 6: return False
        if b0 - 6 < lx < b1 + 6 and c1 > y1 and c0 < ly1: return False  # linia przez cudzą etykietę
    return True
vis = sorted((p for p in peaks if p["visible"]), key=lambda q: q["k"])
groups = []  # szczyty bliżej niż 120 px dostają wspólny rząd etykiet z rozchodzącymi się liniami
for p in vis:
    if groups and xs[p["k"]] - xs[groups[-1][-1]["k"]] < 120: groups[-1].append(p)
    else: groups.append([p])
for g in sorted(groups, key=lambda g: -max(p["height"] for p in g)):
    halfs = [len(p["name"]) * 9.5 + 8 for p in g]
    total = sum(2 * h for h in halfs) + 32 * (len(g) - 1)
    pxs = [xs[p["k"]] for p in g]; pys = [y(sky[2, p["k"]]) for p in g]
    x0 = max(8, min(W - 8 - total, sum(pxs) / len(pxs) - total / 2))
    top = min(pys) - 130 - (40 if len(g) > 1 else 0)
    while top > 20 and not free(x0, x0 + total, top, top + 52, pxs[0], max(pys)): top -= 6
    boxes.append((x0, x0 + total, top, top + 52))
    cx = x0
    for p, half, x, yy in zip(g, halfs, pxs, pys):
        r, lx = top - yy, cx + half - x  # przesunięcia etykiety względem szczytu
        knee = f"0,{r + 100:.0f} " if len(g) > 1 else ""
        L.append(f'<g id="p-{p["slug"]}" data-height="{p["height"]}" data-azimuth="{p["az"]}" data-distance-km="{p["dist_km"]}" transform="translate({x:.1f} {yy:.1f})">'
                 f'<polyline class="line" points="0,-14 {knee}{lx:.0f},{r + 60:.0f}"/><circle class="accent" r="6"/>'
                 f'<text class="peak-name" x="{lx:.0f}" y="{r + 22:.0f}" text-anchor="middle">{p["name"]}</text><text class="peak-h" x="{lx:.0f}" y="{r + 46:.0f}" text-anchor="middle">{p["height"]} m</text></g>')
        cx += 2 * half + 32
L.append("</g></svg>")
out = ROOT / "public/ilustracje/G2_panorama.svg"; out.parent.mkdir(parents=True, exist_ok=True)
out.write_text("\n".join(L))
(ROOT / "public/ilustracje/G2_panorama.json").write_text(json.dumps({"site": SITE, "eyeM": round(H0), "azimuthFrom": AZ0, "azimuthTo": AZ1, "verticalExaggeration": EXAG, "peaks": [{k: v for k, v in p.items() if k not in ("k", "angle")} for p in peaks]}, ensure_ascii=False, indent=1))
for p in peaks: print(p["slug"], p["az"], p["dist_km"], p["dem"], round(p["angle"], 2), "OK" if p["visible"] else "UKRYTY")
print("H0", H0)

# G5: sylwetka każdego szczytu tak, jak widać go z osady (wycinek ±1,6° dalekiej grani, wysokość dopasowana do kadru).
SW, SH, OKNO = 240, 96, int(1.6 / STEP)
for p in peaks:
    k0, k1 = max(0, p["k"] - OKNO), min(len(azs), p["k"] + OKNO + 1)
    a = sky[2, k0:k1]; lo, hi = a.min(), a.max()
    sx = lambda k: (k - (p["k"] - OKNO)) / (2 * OKNO) * SW
    sy = lambda v: SH - 8 - (v - lo) / max(hi - lo, 1e-6) * (SH - 24)
    d = f"M{sx(k0):.1f},{SH} " + " ".join(f"L{sx(k0 + i):.1f},{sy(v):.1f}" for i, v in enumerate(a)) + f" L{sx(k1 - 1):.1f},{SH} Z"
    (ROOT / f"public/ilustracje/G5_sylwetka_{p['slug']}.svg").write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {SW} {SH}" role="img" aria-label="Sylwetka: {p["name"]} widziany z osady">'
        '<style>.g{fill:var(--color-tlo-2);stroke:var(--color-atrament);stroke-width:1.2;stroke-linejoin:round;vector-effect:non-scaling-stroke}.k{fill:var(--color-bursztyn)}</style>'
        f'<path class="g" d="{d}"/><circle class="k" cx="{sx(p["k"]):.1f}" cy="{sy(sky[2, p["k"]]):.1f}" r="3.5"/></svg>')
