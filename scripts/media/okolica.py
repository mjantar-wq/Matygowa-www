#!/usr/bin/env python3
"""Zdjęcia atrakcji okolicy na wolnych licencjach (Wikimedia Commons, Flickr CC) do content/media.

Każde zdjęcie ma autora, licencję i adres źródła; podpis „Fot. … · licencja · serwis adres” trafia do pola
„Podpis” w panelu i wyświetla się pod zdjęciem (licencje CC BY i CC BY-SA wymagają podpisu, CC0 nie, ale go zostawiamy).
Bez ludzi na pierwszym planie (zgoda na wizerunek). Pliki A_<atrakcja>_<n>.webp; pierwsze zdjęcie atrakcji jest główne.

OBIEKTY to zdjęcia ze stron obiektów, na które Michał poprosił o zgodę 25.10.2026 (decyzja Michała: na stronie
testowej mogą być od razu). Mają prawa „pending”, więc na produkcji strona ich nie pokaże. Po zgodzie obiektu zmień
"pending" na "granted" (import poprawi prawa w panelu), a bez zgody usuń wpis i plik.
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

# plik, adres pliku, strona źródła, obiekt (w podpisie), prawa, kadr w pionie, alt PL, alt EN
OBIEKTY = [
    ("A_termy-bukovina_1", "https://u.profitroom.pl/2015.termabukowina.pl/thumb/1920x1080/uploads/zdjciemniejsze.jpg", "https://www.termybukovina.pl", "Termy Bukovina", "pending", .5,
     "Baseny zewnętrzne i zjeżdżalnie Term Bukovina, w tle Tatry", "The outdoor pools and slides of Termy Bukovina, the Tatras behind"),
    ("A_termy-bukovina_2", "https://u.profitroom.pl/2015.termabukowina.pl/thumb/1920x1080/uploads/DJI_20260716190832_0673_D-HDR.jpg", "https://www.termybukovina.pl", "Termy Bukovina", "pending", .5,
     "Termy Bukovina wśród lasów, na horyzoncie Tatry", "Termy Bukovina among the forests, the Tatras on the horizon"),
    ("A_terma-bania_1", "https://u.profitroom.pl/2017.termabania.pl/thumb/1920x980/uploads/TermyBaniaBialka112024_14.jpg", "https://www.termabania.pl", "Terma Bania", "pending", .5,
     "Terma Bania z lotu ptaka, baseny pod gołym niebem przy stoku", "Terma Bania from the air, open-air pools by the slopes"),
    ("A_terma-bania_2", "https://u.profitroom.pl/2017.termabania.pl/thumb/1920x980/uploads/Terma_Bania_062019_17AB.jpg", "https://www.termabania.pl", "Terma Bania", "pending", .5,
     "Basen zewnętrzny przed przeszkloną halą Termy Bania", "The outdoor pool in front of the glazed hall of Terma Bania"),
    ("A_bialka-narty_1", "https://u.profitroom.pl/2017.termabania.pl/thumb/1920x980/uploads/Group51-DJI_20260220174457_0783_D_DJI_20260220174504_0786_D-4images.jpg", "https://www.termabania.pl", "Terma Bania", "pending", .5,
     "Oświetlone stoki w Białce Tatrzańskiej zimą o zmierzchu", "Floodlit ski slopes in Białka Tatrzańska on a winter evening"),
    ("A_skywalk-poronin_1", "https://skywalk-poronin.pl/wp-content/uploads/2025/07/skywalk-poronin-lato-4-1700x956.jpg", "https://skywalk-poronin.pl", "SkyWalk Serce Poronina", "pending", .5,
     "Taras widokowy SkyWalk nad lasem, w tle Tatry", "The SkyWalk viewing deck above the forest, the Tatras behind"),
    ("A_skywalk-poronin_2", "https://skywalk-poronin.pl/wp-content/uploads/2025/04/9.jpg", "https://skywalk-poronin.pl", "SkyWalk Serce Poronina", "pending", .5,
     "SkyWalk na Polanie Zgorzelisko z lotu ptaka, za nim panorama Tatr", "SkyWalk on Polana Zgorzelisko from the air, the Tatra panorama behind"),
    ("A_skywalk-poronin_3", "https://skywalk-poronin.pl/wp-content/uploads/2025/07/skywalk-poronin-lato-3-1-1700x956.jpg", "https://skywalk-poronin.pl", "SkyWalk Serce Poronina", "pending", .5,
     "Drewniana ścieżka SkyWalk i wieża z lotu ptaka", "The wooden SkyWalk path and tower from the air"),
    ("A_szymoszkowa_1", "https://szymoszkowa.pl/wp-content/uploads/2020/11/Trasy-narciarskie-na-Polanie-Szymoszkowej-Zakopane.jpg", "https://szymoszkowa.pl", "Polana Szymoszkowa", "pending", .5,
     "Kolej krzesełkowa na Polanie Szymoszkowej zimą, w tle Tatry", "The chairlift on Polana Szymoszkowa in winter, the Tatras behind"),
    ("A_szymoszkowa_2", "https://szymoszkowa.pl/wp-content/uploads/2020/08/Polana-Szymoszkowa-Lato-09-2.jpg", "https://szymoszkowa.pl", "Polana Szymoszkowa", "pending", .5,
     "Polana Szymoszkowa latem z lotu ptaka, na horyzoncie Tatry", "Polana Szymoszkowa in summer from the air, the Tatras on the horizon"),
    ("A_splyw-dunajcem_1", "https://flisacy.pl/assets/gallery_thumbnails/46/469d5c5196327a9130b9f8316698e52a.jpg", "https://flisacy.pl", "Flisacy Pienińscy", "pending", .5,
     "Tratwa flisacka na Dunajcu jesienią, nad nią Trzy Korony", "A raft on the Dunajec in autumn, the Three Crowns above"),
    ("A_splyw-dunajcem_2", "https://flisacy.pl/assets/gallery_thumbnails/97/977082cda46cbde9f29ea1d102f913fd.jpg", "https://flisacy.pl", "Flisacy Pienińscy", "pending", .5,
     "Dunajec pod Trzema Koronami w słoneczny dzień", "The Dunajec beneath the Three Crowns on a sunny day"),
    ("A_bielska-jaskinia_1", "https://www.ssj.sk/sk/photoloader/103/9.jpg/0x0", "https://www.ssj.sk/sk/jaskyna/2-belianska-jaskyna", "Správa slovenských jaskýň", "pending", .5,
     "Nacieki w Bielskiej Jaskini", "Dripstone formations in Belianska Cave"),
    ("A_bielska-jaskinia_2", "https://www.ssj.sk/sk/photoloader/105/11.jpg/0x0", "https://www.ssj.sk/sk/jaskyna/2-belianska-jaskyna", "Správa slovenských jaskýň", "pending", .5,
     "Ściana nacieków w Bielskiej Jaskini", "A wall of flowstone in Belianska Cave"),
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
    wpisy = [(kod, url, strona, autor, lic, "free", oy, alt_pl, alt_en) for kod, url, strona, autor, lic, oy, alt_pl, alt_en in ZDJECIA]
    wpisy += [(kod, url, strona, obiekt, None, prawa, oy, alt_pl, alt_en) for kod, url, strona, obiekt, prawa, oy, alt_pl, alt_en in OBIEKTY]
    for kod, url, strona, autor, lic, prawa, oy, alt_pl, alt_en in wpisy:
        src = CACHE / f"{kod}.jpg"
        if not src.exists():
            src.write_bytes(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60).read())
            time.sleep(3)
        im = kadr(ImageOps.exif_transpose(Image.open(src)).convert("RGB"), 3 / 2, oy)
        if im.width > 1800: im = im.resize((1800, 1200), Image.LANCZOS)
        name = f"{kod}.webp"
        im.save(OUT / name, "WEBP", quality=80, method=6)
        wpis = {"file": name, "shot": kod, "width": im.width, "height": im.height, "placeholder": False, "rights": prawa,
                "alt": {"pl": alt_pl, "en": alt_en}, "source": strona, "author": autor}
        if lic:
            serwis = "Flickr" if "flickr.com" in strona else "Wikimedia Commons"
            wpis |= {"license": lic, "license_url": LIC[lic],
                     "credit": {"pl": f"Fot. {autor} · {lic} · {serwis} {strona}", "en": f"Photo: {autor} · {lic} · {serwis} {strona}"}}
        else:
            # zdjęcie obiektu: podpis z nazwą obiektu i linkiem do jego strony
            domena = strona.split("/")[2].removeprefix("www.")
            wpis |= {"credit": {"pl": f"Fot. {autor} · {domena} {strona}", "en": f"Photo: {autor} · {domena} {strona}"}}
        nowe.append(wpis)
        print(name, im.size)
    m["items"] = stare + nowe
    (OUT / "manifest.json").write_text(json.dumps(m, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
