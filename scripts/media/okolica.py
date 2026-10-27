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
# Wolne licencje na razie bez zdjęć: Michał odrzucił 25.10 zdjęcia kolei (bez wagonika) i Morskiego Oka (słaba jakość).
ZDJECIA = []

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
    ("A_skywalk-poronin_1", "https://skywalk-poronin.pl/wp-content/uploads/2025/07/skywalk-poronin-lato-4-1700x956.jpg", "https://skywalk-poronin.pl", "SkyWalk Serce Poronina", "granted", .5,
     "Taras widokowy SkyWalk nad lasem, w tle Tatry", "The SkyWalk viewing deck above the forest, the Tatras behind"),
    ("A_skywalk-poronin_2", "https://skywalk-poronin.pl/wp-content/uploads/2025/04/9.jpg", "https://skywalk-poronin.pl", "SkyWalk Serce Poronina", "granted", .5,
     "SkyWalk na Polanie Zgorzelisko z lotu ptaka, za nim panorama Tatr", "SkyWalk on Polana Zgorzelisko from the air, the Tatra panorama behind"),
    ("A_skywalk-poronin_3", "https://skywalk-poronin.pl/wp-content/uploads/2025/07/skywalk-poronin-lato-3-1-1700x956.jpg", "https://skywalk-poronin.pl", "SkyWalk Serce Poronina", "granted", .5,
     "Drewniana ścieżka SkyWalk i wieża z lotu ptaka", "The wooden SkyWalk path and tower from the air"),
    # 27.10: SkyWalk zgodził się mailem na użycie dowolnego zdjęcia ze swojej strony (granted)
    ("A_skywalk-poronin_4", "https://skywalk-poronin.pl/wp-content/uploads/2025/03/1080x650Obszar-kompozycji-3.jpg", "https://skywalk-poronin.pl", "SkyWalk Serce Poronina", "granted", .5,
     "Wieża SkyWalk w świetle zachodzącego słońca, za nią Tatry", "The SkyWalk tower in the evening sun, the Tatras behind"),
    ("A_skywalk-poronin_5", "https://skywalk-poronin.pl/wp-content/uploads/2025/04/7a728534-1f86-4c8a-9463-847c27becb40-scaled.jpg", "https://skywalk-poronin.pl", "SkyWalk Serce Poronina", "granted", .5,
     "SkyWalk wśród lasów, nad nim ośnieżone Tatry", "SkyWalk among the forests, the snowy Tatras above"),
    ("A_skywalk-poronin_6", "https://skywalk-poronin.pl/wp-content/uploads/2025/04/5.jpg", "https://skywalk-poronin.pl", "SkyWalk Serce Poronina", "granted", .5,
     "Ośnieżone Tatry nad ścieżką SkyWalk", "The snowy Tatras above the SkyWalk path"),
    ("A_szymoszkowa_1", "https://szymoszkowa.pl/wp-content/uploads/2020/11/Trasy-narciarskie-na-Polanie-Szymoszkowej-Zakopane.jpg", "https://szymoszkowa.pl", "Polana Szymoszkowa", "pending", .5,
     "Kolej krzesełkowa na Polanie Szymoszkowej zimą, w tle Tatry", "The chairlift on Polana Szymoszkowa in winter, the Tatras behind"),
    ("A_szymoszkowa_2", "https://szymoszkowa.pl/wp-content/uploads/2020/08/Polana-Szymoszkowa-Lato-09-2.jpg", "https://szymoszkowa.pl", "Polana Szymoszkowa", "pending", .5,
     "Polana Szymoszkowa latem z lotu ptaka, na horyzoncie Tatry", "Polana Szymoszkowa in summer from the air, the Tatras on the horizon"),
    # 27.10: zdjęcia Grzegorza Chmiela przesłane przez flisaków ze zgodą na publikację na stronie (granted)
    ("A_splyw-dunajcem_g1", "https://flisacy.sromowce.pl/matygowa-gf7/_DSC6042.jpg", "https://flisacy.com.pl", "Grzegorz Chmiel", "granted", 0.3,
     "Tratwa flisacka na Dunajcu pod Trzema Koronami", "A raft on the Dunajec beneath the Three Crowns"),
    ("A_splyw-dunajcem_g2", "https://flisacy.sromowce.pl/matygowa-gf7/IMG_0872.jpg", "https://flisacy.com.pl", "Grzegorz Chmiel", "granted", 0.5,
     "Tratwa w przełomie Dunajca między wapiennymi skałami", "A raft in the Dunajec gorge between limestone cliffs"),
    ("A_splyw-dunajcem_g3", "https://flisacy.sromowce.pl/matygowa-gf7/_1014610.jpg", "https://flisacy.com.pl", "Grzegorz Chmiel", "granted", 0.5,
     "Tratwy na Dunajcu, w tle ośnieżone Tatry", "Rafts on the Dunajec, the snowy Tatras behind"),
    ("A_splyw-dunajcem_g4", "https://flisacy.sromowce.pl/matygowa-gf7/IMG_0439.jpg", "https://flisacy.com.pl", "Grzegorz Chmiel", "granted", 0.5,
     "Tratwa w porannej mgle w przełomie Dunajca", "A raft in the morning mist in the Dunajec gorge"),
    ("A_splyw-dunajcem_g5", "https://flisacy.sromowce.pl/matygowa-gf7/_DSC5747.jpg", "https://flisacy.com.pl", "Grzegorz Chmiel", "granted", 0.5,
     "Flisacy na Dunajcu wśród jesiennych Pienin", "Raftsmen on the Dunajec among the autumn Pieniny"),
    ("A_splyw-dunajcem_g6", "https://flisacy.sromowce.pl/matygowa-gf7/_1001570.jpg", "https://flisacy.com.pl", "Grzegorz Chmiel", "granted", 0.5,
     "Tratwy w przełomie Dunajca jesienią", "Rafts in the Dunajec gorge in autumn"),
    ("A_bielska-jaskinia_1", "https://www.ssj.sk/sk/photoloader/103/9.jpg/0x0", "https://www.ssj.sk/sk/jaskyna/2-belianska-jaskyna", "Správa slovenských jaskýň", "pending", .5,
     "Nacieki w Bielskiej Jaskini", "Dripstone formations in Belianska Cave"),
    ("A_bielska-jaskinia_2", "https://www.ssj.sk/sk/photoloader/105/11.jpg/0x0", "https://www.ssj.sk/sk/jaskyna/2-belianska-jaskyna", "Správa slovenských jaskýň", "pending", .5,
     "Ściana nacieków w Bielskiej Jaskini", "A wall of flowstone in Belianska Cave"),
    # 25.10 (decyzja Michała): koleje z wagonikiem, Morskie Oko ze schroniskiem nad brzegiem, balon z Tatrami w tle, szlaki (26.10: bez zdjęć schroniska Głodówka i schroniska nad Morskim Okiem, Michał nie prosi ich o zgodę)
    ("A_kasprowy-wierch_w1", "https://www.pkl.pl/data/pages/28/1600x0px__n4a0359a.jpg", "https://www.pkl.pl/kasprowy-wierch/kasprowy.html", "Polskie Koleje Linowe", "pending", .5,
     "Wagonik kolei na Kasprowy Wierch nad doliną, w tle Tatry", "The Kasprowy Wierch cable car above the valley, the Tatras behind"),
    ("A_kasprowy-wierch_w2", "https://www.pkl.pl/data/pages/28/1600x0px_kasprowy-15-.jpg", "https://www.pkl.pl/kasprowy-wierch/kasprowy.html", "Polskie Koleje Linowe", "pending", .5,
     "Wagonik kolei na Kasprowy Wierch w świetle zachodzącego słońca", "The Kasprowy Wierch cable car in the evening sun"),
    ("A_gubalowka_w1", "https://www.pkl.pl/data/pages/34/1600x0px_20181216_a9dsc06983v1.jpg", "https://www.pkl.pl/gubalowka/gubalowka.html", "Polskie Koleje Linowe", "pending", .5,
     "Wagon kolei na Gubałówkę wśród zaśnieżonych świerków, w tle Tatry", "The Gubałówka funicular among snowy spruces, the Tatras behind"),
    ("A_gubalowka_w2", "https://www.pkl.pl/data/pages/34/1600x0px_20181213_a6500ab606881v1.jpg", "https://www.pkl.pl/gubalowka/gubalowka.html", "Polskie Koleje Linowe", "pending", .5,
     "Wagon kolei na Gubałówkę na trasie przez zimowy las", "The Gubałówka funicular on its way through the winter forest"),
    ("A_morskie-oko_s1", "https://schroniskomorskieoko.pl/sites/default/files/static/20121008_ab4_2155.jpg", "https://schroniskomorskieoko.pl", "Schronisko PTTK nad Morskim Okiem", "pending", .5,
     "Schronisko nad brzegiem Morskiego Oka, za nim ośnieżone zbocza", "The mountain hut on the shore of Morskie Oko, snowy slopes behind"),
    ("A_morskie-oko_s2", "https://schroniskomorskieoko.pl/sites/default/themes/dozp/images/tlo10.jpg", "https://schroniskomorskieoko.pl", "Schronisko PTTK nad Morskim Okiem", "pending", .5,
     "Morskie Oko o zachodzie, szczyty odbite w wodzie", "Morskie Oko at sunset, the peaks mirrored in the water"),
    # 26.10: zdjęcia przesłane przez Loty balonem ze zgodą na użycie na stronie (oryginały w folderze „09 ilustracje”
    # Michała: z1 = Tatry 3, z2 = Podhale 2, z3 = Tatry 2, z4 = Podhale 3, z5 = Tatry 1, z6 = Podhale 1; skopiuj je do .okolica-cache)
    ("A_balony_z1", None, "https://lotybalonem.com/zakopane", "Loty balonem Zakopane i Podhale", "granted", .5,
     "Kolorowy balon nad ośnieżonymi szczytami Tatr", "A colourful balloon above the snowy Tatra peaks"),
    ("A_balony_z2", None, "https://lotybalonem.com/zakopane", "Loty balonem Zakopane i Podhale", "granted", .5,
     "Kosz balonu nad Podhalem, na horyzoncie cała grań Tatr", "The balloon basket above Podhale, the whole Tatra ridge on the horizon"),
    ("A_balony_z3", None, "https://lotybalonem.com/zakopane", "Loty balonem Zakopane i Podhale", "granted", .5,
     "Balon nad zaśnieżonymi graniami Tatr", "The balloon above the snowy Tatra ridges"),
    ("A_balony_z4", None, "https://lotybalonem.com/zakopane", "Loty balonem Zakopane i Podhale", "granted", .5,
     "Balon nad zimowymi polanami Podhala, w tle Tatry", "A balloon above the winter meadows of Podhale, the Tatras behind"),
    ("A_balony_z5", None, "https://lotybalonem.com/zakopane", "Loty balonem Zakopane i Podhale", "granted", .5,
     "Kosz balonu wśród tatrzańskich szczytów w słońcu", "The balloon basket among the Tatra peaks in the sun"),
    ("A_balony_z6", None, "https://lotybalonem.com/zakopane", "Loty balonem Zakopane i Podhale", "granted", .5,
     "Balon nad Podhalem w niskim słońcu, w dali Tatry", "The balloon above Podhale in the low sun, the Tatras in the distance"),
    ("A_szlaki-rowery_1", "https://velodunajec.pl/wp-content/uploads/2021/04/1-43-scaled.jpg", "https://velodunajec.pl", "Velo Dunajec", "pending", .5,
     "Trasa rowerowa Velo Dunajec wśród łąk, w dali Jezioro Czorsztyńskie", "The Velo Dunajec cycle route through meadows, Lake Czorsztyn in the distance"),
    ("A_szlaki-rowery_3", "https://velodunajec.pl/wp-content/uploads/2021/04/Group-5-DJI_0609-HDR5_DJI_0649-HDR5-9-images-scaled.jpg", "https://velodunajec.pl", "Velo Dunajec", "pending", .5,
     "Droga przez łąki Podhala w porannej mgle", "A track across the Podhale meadows in the morning mist"),
    ("A_murzasichle_1", "https://www.modrzewiowybor.pl/files/images//1/15/156/1560/2_1.jpg", "https://www.modrzewiowybor.pl", "Park Linowy Murzasichle", "pending", .5,
     "Trasa parku linowego w Murzasichlu między świerkami", "The rope park course in Murzasichle among the spruces"),
    ("A_murzasichle_2", "https://www.modrzewiowybor.pl/files/images//f/f3/f3c/f3cc/1_1.jpg", "https://www.modrzewiowybor.pl", "Park Linowy Murzasichle", "pending", .5,
     "Kładki i platformy parku linowego wysoko na drzewach", "Rope park walkways and platforms high in the trees"),
    ("A_murzasichle_3", "https://www.modrzewiowybor.pl/files/images//7/79/799/799b/3_1.jpg", "https://www.modrzewiowybor.pl", "Park Linowy Murzasichle", "pending", .5,
     "Park linowy w Murzasichlu z góry, trasy i daszki wśród drzew", "The Murzasichle rope park from above, courses and roofs among the trees"),
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
            if not url: raise SystemExit(f"brak {src}: to zdjęcie przesłane przez obiekt, skopiuj oryginał do .okolica-cache")
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
