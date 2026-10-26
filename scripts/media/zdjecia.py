#!/usr/bin/env python3
"""Prawdziwe zdjęcia z OneDrive w miejsce zaślepek CGI: kadr do proporcji ujęcia, WebP i wpisy w manifeście.

Każde zdjęcie dostaje kod ujęcia z photo-planu (np. W1_salon_kominek_3x2), więc import wybiera je
przed plikiem CGI o tym samym przedrostku. CGI zostaje tylko tam, gdzie nie ma prawdziwego materiału
(noc, bania pod gwiazdami, apartamenty, szron). Z ujęć z drona powstają też spokojne pętle wideo do hero.
Źródła: /mnt/project-files/zdjecia (dobór wątku koncepcji) i kopie z OneDrive w /mnt/user-data/uploads.
Uruchom: python3 scripts/media/zdjecia.py
"""
import glob, json, subprocess, tempfile
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "content/media"
PF = "/mnt/project-files/zdjecia"
UP = glob.glob("/mnt/user-data/uploads/Zdj*")[0]

# kod ujęcia, źródło (glob), kadr w pionie 0–1 (0 = góra), alt PL, alt EN
ZDJECIA = [
    ("K2_hero_osada_swit_16x9", f"{UP}/Sesja zimowa/size_original/DJI_*0393_D.jpg", .5,
     "Matygowa Osada z lotu ptaka zimą, w tle Tatry nad poranną mgłą", "Matygowa Osada from the air in winter, the Tatras above the morning mist"),
    ("K2_hero_osada_swit_9x16", f"{UP}/Sesja zimowa/size_original/DJI_*0394_D.jpg", .5,
     "Domy osady wśród świerków, nad nimi ośnieżone Tatry", "The houses among spruces, the snowy Tatras above"),
    ("K2_hero_osada_lato_16x9", f"{PF}/lato/a7v09961.jpg", .5,
     "Drewniana elewacja domu z balkonem latem", "The wooden façade of a house with its balcony in summer"),
    ("K1_panorama_tatry_21x9", f"{PF}/zima/a9m05010.jpg", .45,
     "Panorama Tatr widziana z osady zimą", "The Tatras panorama seen from the settlement in winter"),
    ("K3_dron_przelot_16x9", f"{PF}/zima/dji_*0394*.jpg", .5,
     "Osada we mgle i grań Tatr z drona", "The settlement in mist and the Tatra ridge from a drone"),
    ("K4_osada_zmierzch_16x9", f"{PF}/www/widoki-05.jpg", .55,
     "Gliczarów Górny o zmierzchu", "Gliczarów Górny at dusk"),
    ("K6_dom_orbita_16x9", f"{PF}/zima/dji_*0389*.jpg", .5,
     "Dom z dużym przeszkleniem szczytu, za nim Tatry", "A house with a glazed gable, the Tatras behind it"),
    ("K8_punkt_widokowy_16x9", f"{PF}/www/widoki-01.jpg", .5,
     "Punkt widokowy nad osadą z widokiem na Tatry", "Viewpoint above the settlement facing the Tatras"),
    ("T1_swit_gran_16x9", f"{PF}/zima/dsc02011.jpg", .5,
     "Widok z balkonu na ośnieżone Tatry", "View from the balcony to the snowy Tatras"),
    ("W1_salon_kominek_3x2", f"{PF}/zima/a7v08874-hdr.jpg", .5,
     "Salon z kominkiem i oknem na Tatry", "Living room with a fireplace and a window onto the Tatras"),
    ("W2_kuchnia_stol_3x2", f"{PF}/zima/a7v08864-hdr.jpg", .5,
     "Stół w jadalni nakryty dla ośmiu osób, za oknem śnieg", "Dining table set for eight, snow outside the window"),
    ("W3_sypialnia_ranek_3x2", f"{PF}/zima/a7v08979-hdr.jpg", .5,
     "Sypialnia z oknem na zaśnieżony stok", "Bedroom with a window onto the snowy slope"),
    ("W5_sauna_3x2", f"{UP}/Sesja letnia/www-facebook/A7V08095-HDR.jpg", .5,
     "Sauna w łazience domu, ławy z jasnego drewna", "The sauna in the house bathroom, benches of pale wood"),
    ("W6_taras_wejscie_3x2", f"{PF}/zima/a9m05021.jpg", .5,
     "Zadaszony taras z widokiem na Tatry zimą", "Covered terrace with a view of the Tatras in winter"),
    ("W7_detal_drewno_kawa_3x2", f"{PF}/zima/dsc01920.jpg", .5,
     "Świeży chleb na desce w kuchni", "Fresh bread on a board in the kitchen"),
    ("B1_bania_alpenglow_3x2", f"{PF}/zima/a9m05004.jpg", .55,
     "Bania na tarasie, w tle świerk i Tatry", "The hot tub on the terrace, a spruce and the Tatras behind"),
    ("B1_bania_lato_3x2", f"{PF}/lato/a7v09923.jpg", .5,
     "Bania na tarasie latem", "The hot tub on the terrace in summer"),
    ("B5_sciezka_do_bani_3x2", f"{PF}/zima/a9m05036.jpg", .5,
     "Bania pod okapem domu, wokół śnieg", "The hot tub under the eaves, snow all around"),
    ("B6_kawa_taras_3x2", f"{PF}/zima/a9m05017.jpg", .5,
     "Krzesła na tarasie w zimowym słońcu", "Chairs on the terrace in the winter sun"),
    # wybór Michała (25.10): zdjęcie 7 z arkusza kandydatów; widać Łomnicę, Lodowy i Gerlach, Hawrań jest tuż za lewą krawędzią
    ("V1_hawran_salon_3x2", f"{PF}/zima/a7v08909-hdr.jpg", .5,
     "Domek Hawrań, salon z narożnym oknem na Tatry", "Hawrań cottage, living room with a corner window onto the Tatras"),
    ("V2_gerlach_okno_3x2", f"{UP}/Zdjecia glowne domku/gerlach/main_gerlach_A7V08035-HDR.jpg", .5,
     "Domek Gerlach, wnętrze z widokiem za oknem", "Gerlach cottage, the interior and the view outside"),
    ("V3_swinica_okno_3x2", f"{UP}/Zdjecia glowne domku/swinica/main_swinica_A7V08030-HDR.jpg", .5,
     "Domek Świnica, wnętrze z widokiem za oknem", "Świnica cottage, the interior and the view outside"),
    ("V4_woloszyn_okno_3x2", f"{UP}/Zdjecia glowne domku/woloszyn/main_woloszyn_A7V02195-HDR.jpg", .5,
     "Domek Wołoszyn, wnętrze z widokiem za oknem", "Wołoszyn cottage, the interior and the view outside"),
    ("V5_lomnica_okno_3x2", f"{UP}/Zdjecia glowne domku/lomnica/main_lomnica_bez_samochodu.jpg", .5,
     "Domek Łomnica, balkon z widokiem na Tatry", "Łomnica cottage, the balcony facing the Tatras"),
    ("V6_lodowy_okno_3x2", f"{UP}/Zdjecia glowne domku/lodowy/main_lodowy_A7V02190-HDR.jpg", .5,
     "Domek Lodowy, wnętrze z widokiem za oknem", "Lodowy cottage, the interior and the view outside"),
]
# Pętle z prawdziwych ujęć z drona: powolny najazd, 12 s, bez dźwięku (zastępują pętle CGI).
WIDEO = [("K2_hero_osada_swit_16x9", (1920, 1080)), ("K2_hero_osada_swit_9x16", (1080, 1920))]
SZER = {"16x9": 2400, "21x9": 2400, "3x2": 1600, "9x16": 1080}

def kadr(im, ar, oy):
    """Środek w poziomie, w pionie wg oy; potem zmniejszenie do szerokości z SZER (bez powiększania)."""
    w, h = im.size; a, b = map(int, ar.split("x")); r = a / b
    if w / h > r: nw, nh = round(h * r), h
    else: nw, nh = w, round(w / r)
    x0, y0 = (w - nw) // 2, round((h - nh) * oy)
    im = im.crop((x0, y0, x0 + nw, y0 + nh))
    tw = min(SZER[ar], nw)
    return im.resize((tw, round(tw / r)), Image.LANCZOS) if tw < nw else im

items = []
for kod, src, oy, pl, en in ZDJECIA:
    f = sorted(glob.glob(src))[0]
    ar = kod.rsplit("_", 1)[1]
    im = kadr(ImageOps.exif_transpose(Image.open(f)).convert("RGB"), ar, oy)
    name = f"{kod}_foto.webp"
    im.save(OUT / name, "WEBP", quality=80, method=6)
    items.append({"file": name, "shot": kod.split("_")[0], "width": im.width, "height": im.height, "placeholder": False,
                  "alt": {"pl": pl, "en": en}, "source": Path(f).name})
    print(name, im.size, f"{(OUT / name).stat().st_size // 1024} kB")
    if any(k == kod for k, _ in WIDEO):
        size = dict(WIDEO)[kod]
        with tempfile.NamedTemporaryFile(suffix=".jpg") as t:
            src_im = Image.open(OUT / name); big = src_im.resize((size[0] * 2, size[1] * 2), Image.LANCZOS); big.save(t.name, quality=92)
            mp4 = f"{kod}_foto.mp4"
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-loop", "1", "-i", t.name, "-vf",
                            f"zoompan=z='1+0.06*on/360':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=360:s={size[0]}x{size[1]}:fps=30,format=yuv420p",
                            "-t", "12", "-c:v", "libx264", "-crf", "26", "-preset", "slow", "-movflags", "+faststart", "-an", str(OUT / mp4)], check=True)
        items.append({"file": mp4, "shot": kod.split("_")[0], "width": size[0], "height": size[1], "placeholder": False,
                      "alt": {"pl": pl, "en": en}, "source": Path(f).name})
        print(mp4, f"{(OUT / mp4).stat().st_size // 1024} kB")

m = json.loads((OUT / "manifest.json").read_text())
stare = [i for i in m["items"] if not i["file"].endswith(("_foto.webp", "_foto.mp4"))]
m["items"] = items + stare  # prawdziwe przed CGI: import wybiera pierwszy plik o danym przedrostku
m["rule"] = ("Pliki *_foto to prawdziwe zdjęcia (placeholder: false) i mają pierwszeństwo przed plikami *_cgi o tym samym kodzie ujęcia. "
             "CGI tylko tam, gdzie nie ma prawdziwego materiału; nie publikować CGI bez oznaczenia.")
(OUT / "manifest.json").write_text(json.dumps(m, ensure_ascii=False, indent=1))
print(len(items), "prawdziwych plików")
