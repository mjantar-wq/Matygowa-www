#!/usr/bin/env python3
"""Zdjęcia atrakcji okolicy na wolnych licencjach (Wikimedia Commons, Flickr CC) do content/media.

Każde zdjęcie ma autora, licencję i adres źródła; podpis „Fot. … · licencja · serwis adres” trafia do pola
„Podpis” w panelu i wyświetla się pod zdjęciem (licencje CC BY i CC BY-SA wymagają podpisu, CC0 nie, ale go zostawiamy).
Bez ludzi na pierwszym planie (zgoda na wizerunek). Pliki A_<atrakcja>_<n>.webp; pierwsze zdjęcie atrakcji jest główne.
Uruchom: python3 scripts/media/okolica.py (pobiera brakujące oryginały do scripts/media/.okolica-cache).
"""
import json, time, urllib.request
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1].parent
OUT = ROOT / "content/media"
CACHE = Path(__file__).resolve().parent / ".okolica-cache"
UA = {"User-Agent": "MatygowaSite/1.0 (https://matygowa.audiowizard.pl)"}
LIC = {
    "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/",
    "CC BY 2.5": "https://creativecommons.org/licenses/by/2.5/",
    "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/",
    "CC BY-SA 2.0": "https://creativecommons.org/licenses/by-sa/2.0/",
    "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
    "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
    "CC0": "https://creativecommons.org/publicdomain/zero/1.0/",
}

# plik, adres pliku, strona źródła, autor, licencja, kadr w pionie (0 = góra), alt PL, alt EN
ZDJECIA = [
    ("A_morskie-oko_1", "https://live.staticflickr.com/4459/37504444722_f8220066f5_b.jpg", "https://www.flickr.com/photos/66885349@N03/37504444722", "Gael Varoquaux", "CC BY 2.0", .5,
     "Morskie Oko o świcie, nad taflą ściany Mięguszowieckich Szczytów", "Morskie Oko at dawn, the Mięguszowieckie walls above the water"),
    ("A_gubalowka_1", "https://live.staticflickr.com/5488/9686214805_b2db60ee3c_b.jpg", "https://www.flickr.com/photos/22178197@N00/9686214805", "Kamil Porembiński", "CC BY-SA 2.0", .5,
     "Panorama Tatr z Gubałówki latem", "The Tatras panorama from Gubałówka in summer"),
    ("A_gubalowka_2", "https://live.staticflickr.com/5538/9686128195_19dbee7300_b.jpg", "https://www.flickr.com/photos/22178197@N00/9686128195", "Kamil Porembiński", "CC BY-SA 2.0", .5,
     "Łąki na Gubałówce, w dole Zakopane, w tle Tatry", "Meadows on Gubałówka, Zakopane below, the Tatras behind"),
    ("A_kasprowy-wierch_1", "https://live.staticflickr.com/5443/9694498926_416a9f6d0e_b.jpg", "https://www.flickr.com/photos/22178197@N00/9694498926", "Kamil Porembiński", "CC BY-SA 2.0", .5,
     "Szczyt Kasprowego Wierchu z obserwatorium i górną stacją kolei", "The summit of Kasprowy Wierch with the observatory and the top station"),
    ("A_kasprowy-wierch_2", "https://live.staticflickr.com/3258/2786311693_56a9f5b172_b.jpg", "https://www.flickr.com/photos/29779572@N07/2786311693", "disordered design", "CC BY 2.0", .5,
     "Zbocza Kasprowego Wierchu latem, na grzbiecie obserwatorium", "The slopes of Kasprowy Wierch in summer, the observatory on the ridge"),
]


def kadr(im, ar, oy):
    w, h = im.size
    if w / h > ar:
        nw = round(h * ar); x = (w - nw) // 2
        return im.crop((x, 0, x + nw, h))
    nh = round(w / ar); y = round((h - nh) * oy)
    return im.crop((0, y, w, y + nh))


def main():
    CACHE.mkdir(exist_ok=True)
    m = json.loads((OUT / "manifest.json").read_text())
    stare = [i for i in m["items"] if not i["file"].startswith("A_")]
    nowe = []
    for kod, url, strona, autor, lic, oy, alt_pl, alt_en in ZDJECIA:
        src = CACHE / f"{kod}.jpg"
        if not src.exists():
            src.write_bytes(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read())
            time.sleep(3)
        im = kadr(ImageOps.exif_transpose(Image.open(src)).convert("RGB"), 3 / 2, oy)
        if im.width > 1800: im = im.resize((1800, 1200), Image.LANCZOS)
        name = f"{kod}.webp"
        im.save(OUT / name, "WEBP", quality=80, method=6)
        serwis = "Flickr" if "flickr.com" in strona else "Wikimedia Commons"
        nowe.append({
            "file": name, "shot": kod, "width": im.width, "height": im.height, "placeholder": False,
            "alt": {"pl": alt_pl, "en": alt_en},
            "source": strona, "author": autor, "license": lic, "license_url": LIC[lic],
            "credit": {"pl": f"Fot. {autor} · {lic} · {serwis} {strona}", "en": f"Photo: {autor} · {lic} · {serwis} {strona}"},
        })
        print(name, im.size)
    m["items"] = stare + nowe
    (OUT / "manifest.json").write_text(json.dumps(m, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
