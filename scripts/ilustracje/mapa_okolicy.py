#!/usr/bin/env python3
"""G7: mapa okolicy (Podhale, Tatry, atrakcje z content/attractions.json) jako warstwowy SVG.

Poziomice z modelu terenu Terrarium (te same kafle co G2), drogi, rzeki i granica z OpenStreetMap
(Overpass, zapis w /tmp/osm/g7.json, kolejne przebiegi czytają zapis). Współrzędne punktów: Nominatim.
Wymaga: numpy, pillow, contourpy (narzędzie jednorazowe, nie zależność strony).
Uruchom: python3 scripts/ilustracje/mapa_okolicy.py
"""
import json, math, pathlib, sys, urllib.parse, urllib.request
import numpy as np
import contourpy

sys.path.insert(0, str(pathlib.Path(__file__).parent))
from tokeny import z_zapasem  # noqa: E402
from dem import elev, SITE  # noqa: E402  (ten sam DEM i punkt osady co G2)
ROOT = pathlib.Path(__file__).resolve().parents[2]

LAT0, LAT1, LON0, LON1 = 49.17, 49.46, 19.88, 20.44
W = 1400
KX = W / (LON1 - LON0)
KY = KX / math.cos(math.radians((LAT0 + LAT1) / 2))
H = round((LAT1 - LAT0) * KY)
def xy(lat, lon): return (lon - LON0) * KX, (LAT1 - lat) * KY

OSM = pathlib.Path("/tmp/osm/g7.json")
QUERY = (f'[out:json][timeout:80];(way["highway"~"^(trunk|primary|secondary)$"]({LAT0},{LON0},{LAT1},{LON1});'
         f'way["waterway"="river"]["name"~"Dunajec|Białka|Biały Dunajec"]({LAT0},{LON0},{LAT1},{LON1});'
         f'way["boundary"="administrative"]["admin_level"="2"]({LAT0},{LON0},{LAT1},{LON1}););out geom qt;')
if not OSM.exists():
    OSM.parent.mkdir(exist_ok=True)
    req = urllib.request.Request("https://overpass.kumi.systems/api/interpreter", urllib.parse.urlencode({"data": QUERY}).encode())
    OSM.write_bytes(urllib.request.urlopen(req, timeout=120).read())
osm = json.loads(OSM.read_text())["elements"]

# Atrakcje (slug jak w content/attractions.json) i miejscowości; dx, dy, kotwica etykiety dobrane ręcznie.
POI = [
    ("kasprowy-wierch", "Kolejka na Kasprowy", 49.27025, 19.98085, 12, -10, "start"),
    ("kotelnica", "Kotelnica Białczańska", 49.37623, 20.08090, -12, 4, "end"),
    ("termy", "Terma Bania", 49.38759, 20.09902, 12, -6, "start"),
    ("termy-bukovina", "Termy Bukovina", 49.32518, 20.09417, 12, 16, "start"),
    ("skywalk-poronin", "SkyWalk", 49.30728, 20.08848, -12, 4, "end"),
    ("murzasichle", "Murzasichle", 49.31170, 20.04359, -12, 16, "end"),
    ("splyw-dunajcem", "Spływ Dunajcem", 49.40522, 20.34027, 0, -16, "middle"),
    ("jaskinie-slowacja", "Jaskinia Bielska", 49.22876, 20.31147, 0, 24, "middle"),
    ("morskie-oko", "Morskie Oko", 49.19738, 20.07072, 12, 4, "start"),
    ("gubalowka", "Gubałówka", 49.3015, 19.9384, 4, -10, "middle"),
    ("szymoszkowa", "Polana Szymoszkowa", 49.2980, 19.9249, 0, 38, "middle"),
]
MIEJSCOWOSCI = [
    ("Zakopane", 49.29691, 19.95048, 0, 26, "middle"), ("Poronin", 49.33965, 20.00556, -12, -8, "end"),
    ("Bukowina Tatrzańska", 49.34230, 20.10726, 0, -12, "middle"), ("Białka Tatrzańska", 49.39464, 20.10505, 12, 0, "start"),
    ("Jurgów", 49.34052, 20.13862, 12, 22, "start"), ("Łysa Polana", 49.26535, 20.11631, 12, 4, "start"),
]

# Poziomice co 100 m, co piąta mocniejsza.
NX, NY = 280, round(280 * H / W)
lons = np.linspace(LON0, LON1, NX); lats = np.linspace(LAT1, LAT0, NY)
Z = np.array([[elev(la, lo) for lo in lons] for la in lats])
gen = contourpy.contour_generator(np.arange(NX) * W / (NX - 1), np.arange(NY) * H / (NY - 1), Z, line_type=contourpy.LineType.Separate)
def d_of(pts): return "M" + " L".join(f"{x:.0f},{y:.0f}" for x, y in pts[::2])
cienkie, mocne = [], []
for lvl in range(700, 2700, 100):
    for seg in gen.lines(lvl):
        if len(seg) < 8: continue
        (mocne if lvl % 500 == 0 else cienkie).append(d_of(seg))
# Tatry wyżej niż 1500 m jako delikatny płat (hale i turnie).
fill = contourpy.contour_generator(np.arange(NX) * W / (NX - 1), np.arange(NY) * H / (NY - 1), Z, fill_type=contourpy.FillType.OuterOffset)
tatry = []
for pts, offs in zip(*fill.filled(1500, 9000)):
    tatry.append(" ".join(d_of(pts[a:b]) + " Z" for a, b in zip(offs[:-1], offs[1:])))

def way(e): return "M" + " L".join("%.0f,%.0f" % xy(p["lat"], p["lon"]) for p in e["geometry"])
drogi = {"glowna": [], "boczna": []}; rzeki, granica = [], []
for e in osm:
    if "geometry" not in e: continue
    t = e.get("tags", {})
    if t.get("highway") in ("trunk", "primary"): drogi["glowna"].append(way(e))
    elif t.get("highway"): drogi["boczna"].append(way(e))
    elif t.get("waterway"): rzeki.append(way(e))
    elif t.get("boundary"): granica.append(way(e))

L = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-labelledby="g7-tytul">',
     '<title id="g7-tytul">Mapa okolicy Matygowej Osady: Podhale, Tatry i atrakcje w pobliżu</title>',
     '<style>'
     '.teren{fill:var(--color-tlo)}.tatry{fill:var(--color-tlo-2)}'
     '.poz{fill:none;stroke:var(--color-poziomica);stroke-width:.8;opacity:.45;vector-effect:non-scaling-stroke}'
     '.poz-mocna{fill:none;stroke:var(--color-poziomica);stroke-width:1.2;opacity:.7;vector-effect:non-scaling-stroke}'
     '.rzeka{fill:none;stroke:var(--color-poziomica);stroke-width:2.5;vector-effect:non-scaling-stroke}'
     '.granica{fill:none;stroke:var(--color-wyciszony);stroke-width:1.5;stroke-dasharray:10 4 2 4;vector-effect:non-scaling-stroke}'
     '.droga-glowna{fill:none;stroke:var(--color-atrament-2);stroke-width:2;stroke-linejoin:round;vector-effect:non-scaling-stroke}'
     '.droga-boczna{fill:none;stroke:var(--color-linia-mocna);stroke-width:1.5;stroke-linejoin:round;vector-effect:non-scaling-stroke}'
     '.poi circle{fill:var(--color-bursztyn);stroke:var(--color-tlo);stroke-width:3}'
     '.poi text{font:500 15px var(--font-ui,sans-serif);fill:var(--color-atrament);paint-order:stroke;stroke:var(--color-tlo);stroke-width:4px;stroke-linejoin:round}'
     '.wies circle{fill:var(--color-atrament)}'
     '.wies text{font:500 12px var(--font-ui,sans-serif);letter-spacing:.16em;text-transform:uppercase;fill:var(--color-wyciszony);paint-order:stroke;stroke:var(--color-tlo);stroke-width:4px}'
     '.osada .pierscien{fill:none;stroke:var(--color-swierk);stroke-width:2}.osada .srodek{fill:var(--color-swierk)}'
     '.osada text{font:700 18px var(--font-tabliczka,Georgia,serif);letter-spacing:.1em;text-transform:uppercase;fill:var(--color-swierk);paint-order:stroke;stroke:var(--color-tlo);stroke-width:5px}'
     '.panstwo{font:500 12px var(--font-ui,sans-serif);letter-spacing:.3em;text-transform:uppercase;fill:var(--color-wyciszony)}'
     '.atrybucja{font:400 11px var(--font-ui,sans-serif);fill:var(--color-wyciszony)}'
     '</style>',
     f'<rect class="teren" width="{W}" height="{H}"/>',
     f'<g id="warstwa-tatry">' + "".join(f'<path class="tatry" fill-rule="evenodd" d="{d}"/>' for d in tatry) + '</g>',
     f'<g id="warstwa-poziomice"><path class="poz" d="{" ".join(cienkie)}"/><path class="poz-mocna" d="{" ".join(mocne)}"/></g>',
     f'<g id="warstwa-wody"><path class="rzeka" d="{" ".join(rzeki)}"/></g>',
     f'<g id="warstwa-granica"><path class="granica" d="{" ".join(granica)}"/></g>',
     f'<g id="warstwa-drogi"><path class="droga-boczna" d="{" ".join(drogi["boczna"])}"/><path class="droga-glowna" d="{" ".join(drogi["glowna"])}"/></g>',
     '<text class="panstwo" x="%.0f" y="%.0f">Polska</text><text class="panstwo" x="%.0f" y="%.0f">Słowacja</text>' % (*xy(49.44, 19.92), *xy(49.20, 20.24)),
     '<g id="warstwa-miejscowosci">']
for nazwa, la, lo, dx, dy, a in MIEJSCOWOSCI:
    x, y = xy(la, lo)
    L.append(f'<g class="wies" transform="translate({x:.0f} {y:.0f})"><circle r="3"/><text x="{dx}" y="{dy}" text-anchor="{a}">{nazwa}</text></g>')
L.append('</g><g id="warstwa-atrakcje">')
for slug, nazwa, la, lo, dx, dy, a in POI:
    x, y = xy(la, lo)
    km = 6371 * math.acos(min(1, math.sin(math.radians(SITE[0])) * math.sin(math.radians(la)) + math.cos(math.radians(SITE[0])) * math.cos(math.radians(la)) * math.cos(math.radians(lo - SITE[1]))))
    L.append(f'<g id="a-{slug}" class="poi" data-km="{km:.1f}" transform="translate({x:.0f} {y:.0f})"><circle r="7"/><text x="{dx}" y="{dy + 5}" text-anchor="{a}">{nazwa}</text></g>')
x, y = xy(*SITE)
L.append(f'</g><g id="osada" class="osada" transform="translate({x:.0f} {y:.0f})"><circle class="pierscien" r="16"/><circle class="srodek" r="6"/>'
         '<text x="0" y="40" text-anchor="middle">Matygowa Osada</text></g>')
L.append(f'<text class="atrybucja" x="{W - 16}" y="{H - 16}" text-anchor="end">Dane: © współtwórcy OpenStreetMap (ODbL), wysokości: Terrarium / SRTM</text></svg>')

out = ROOT / "public/ilustracje/G7_mapa_okolicy.svg"
out.write_text(z_zapasem("\n".join(L)))
print(out, W, H, f"{out.stat().st_size // 1024} kB")
