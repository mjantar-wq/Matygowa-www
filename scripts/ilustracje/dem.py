"""Wspólny model terenu dla ilustracji: kafle Terrarium (SRTM, AWS Open Data), pamięć podręczna w /tmp."""
import math, pathlib, urllib.request
import numpy as np
from PIL import Image

CACHE = pathlib.Path("/tmp/terrarium"); CACHE.mkdir(exist_ok=True)
Z = 12
SITE = (49.34471, 20.05793)  # Matygowa Osada (współrzędne od Michała, te same co w PeakFinder)

def tile_xy(lat, lon):
    n = 2 ** Z
    x = (lon + 180) / 360 * n
    y = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
    return x, y

_tiles = {}
def tile(tx, ty):
    if (tx, ty) not in _tiles:
        f = CACHE / f"{Z}_{tx}_{ty}.png"
        if not f.exists():
            url = f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{Z}/{tx}/{ty}.png"
            f.write_bytes(urllib.request.urlopen(url, timeout=60).read())
        a = np.asarray(Image.open(f).convert("RGB")).astype(np.float64)
        _tiles[(tx, ty)] = a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
    return _tiles[(tx, ty)]

def elev(lat, lon):
    x, y = tile_xy(lat, lon)
    tx, ty = int(x), int(y)
    px, py = (x - tx) * 256, (y - ty) * 256
    t = tile(tx, ty)
    # dwuliniowo w obrębie kafla (krawędź kafla: najbliższy piksel), żeby bliskie grzbiety nie były schodkami
    i, j = min(int(py), 254), min(int(px), 254)
    fy, fx = min(py - i, 1.0), min(px - j, 1.0)
    return (t[i, j] * (1 - fx) * (1 - fy) + t[i, j + 1] * fx * (1 - fy)
            + t[i + 1, j] * (1 - fx) * fy + t[i + 1, j + 1] * fx * fy)
