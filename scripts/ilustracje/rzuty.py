#!/usr/bin/env python3
"""G3: rzuty poglądowe dwóch układów domków (bez skali, bez drzwi), po dwa piętra.

Schody leżą w tym samym miejscu na obu piętrach i są otwarte na hol lub wejście (OTWARCIA), żeby było widać dojście.

Źródła: projekt architektoniczny „BUDYNEK A1” (Bentkowski, salon na parterze: Świnica, Gerlach, Hawrań)
i projekt wnętrz W2a z 12.2023 (Topór, salon na piętrze: Wołoszyn, Łomnica, Lodowy).
Powierzchnie: tabela A1 (powierzchnia podłogi); parter W2a z rysunku; piętro W2a bez wymiarów, zmierzone ze skanu (stąd „ok.”).
Pokoje są prostokątami w siatce 0–100 na szerokość budynku; ściany to ciemna bryła widoczna między pokojami.
Uruchom: python3 scripts/ilustracje/rzuty.py
"""
from pathlib import Path
from tokeny import z_zapasem

ROOT = Path(__file__).resolve().parents[2]
S = 10  # jednostka siatki w px viewBoxa
SCIANA = 0.45  # pół grubości ściany działowej (jednostki siatki)
ZEWN = 1.2    # grubość ściany zewnętrznej

# Bryła parteru: rdzeń, szersza część z wykuszami bocznymi i wykusz frontowy (szerszy przy salonie na parterze).
def parter(b0, b1):
    return [(12.8, 0), (87.2, 0), (87.2, 30.8), (100, 30.8), (100, 61), (b1, 61), (b1, 71.4),
            (b0, 71.4), (b0, 61), (0, 61), (0, 30.8), (12.8, 30.8)]

# Pokój: id, nazwa, x0, y0, x1, y1, podpis drugiej linii, rodzaj (None, "schody", "sauna", "skos")
# albo dołączony prostokąt (x0, y0, x1, y1) bez ściany od strony pokoju, np. wykusz salonu.
UKLADY = {
    "salon-parter": {
        "domy": ["swinica", "gerlach", "hawran"],
        # wg Michała: narciarnia to przybudówka na zewnątrz, na lewo od wejścia, przy frontowej ścianie sauny
        "parter": ([(12.8, -9.1), (31.1, -9.1), (31.1, 0)] + parter(22.6, 77.4)[1:], [
            ("narciarnia", "Narciarnia", 12.8, -9.1, 31.1, 0, "z zewnątrz", None),
            ("sauna", "Sauna", 12.8, 0, 31.1, 15.7, None, "sauna"),
            ("lazienka", "Łazienka", 12.8, 15.7, 31.1, 30.8, None, None),
            ("wejscie", "Wejście", 31.1, 0, 51.9, 30.8, None, None),
            ("schody", "Schody", 51.9, 0, 87.2, 17.5, None, "schody"),
            ("wc", "WC", 51.9, 17.5, 64.2, 30.8, None, None),
            ("techniczne", "Techniczne", 64.2, 17.5, 87.2, 30.8, None, None),
            ("sypialnia-1", "Sypialnia", 0, 30.8, 22.6, 61, "9,6 m²", None),
            ("salon", "Salon z kuchnią", 22.6, 30.8, 100, 61, "i jadalnią · 32,5 m²", (22.6, 61, 77.4, 71.4)),
        ]),
        "pietro": ([(12.8, 0), (87.2, 0), (87.2, 66), (12.8, 66)], [
            ("sypialnia-2", "Sypialnia", 12.8, 0, 44, 29.2, "13 m²", None),
            # wg Michała: schody przy prawej ścianie zewnętrznej, z zakrętem; łazienka w kształcie „L”
            # z wcięciem nad biegiem schodów z parteru (bieg u góry, potem zakręt w dół do holu)
            ("lazienka-2", "Łazienka", 44, 0, 58.5, 29.2, None, None),
            ("lazienka-2b", "", 58.5, 14.1, 72.6, 29.2, None, None),
            ("schody-bieg", "", 58.5, 0, 72.6, 14.1, None, "schody"),
            ("schody", "Schody", 72.6, 0, 87.2, 29.2, None, "schody"),
            ("hol", "Hol", 12.8, 29.2, 87.2, 39.6, None, None),
            ("sypialnia-3", "Sypialnia", 12.8, 39.6, 50.9, 66, "14,5 m²", None),
            ("sypialnia-4", "Sypialnia", 50.9, 39.6, 87.2, 66, "11,3 m²", None),
        ]),
    },
    "salon-pietro": {
        "domy": ["woloszyn", "lomnica", "lodowy"],
        # narciarnia jak w domkach z salonem na parterze: przybudówka przy frontowej ścianie sauny, wejście z zewnątrz
        "parter": ([(12.8, -9.1), (31, -9.1), (31, 0)] + parter(33.3, 66.7)[1:], [
            ("narciarnia", "Narciarnia", 12.8, -9.1, 31, 0, "z zewnątrz", None),
            ("sauna", "Sauna", 12.8, 0, 31, 14.3, None, "sauna"),
            ("lazienka", "Łazienka", 12.8, 14.3, 38.1, 30.8, None, None),
            ("wejscie", "Wejście", 31, 0, 52.4, 14.3, None, None),
            ("hol", "Hol", 38.1, 14.3, 52.4, 30.8, None, None),
            ("schody", "Schody", 52.4, 0, 87.2, 14.3, None, "schody"),
            ("lazienka-2", "Łazienka", 52.4, 14.3, 72.6, 30.8, None, None),
            ("schody-2", "", 72.6, 14.3, 87.2, 30.8, None, "schody"),
            ("sypialnia-1", "Sypialnia", 0, 30.8, 33.3, 61, "12 m²", None),
            ("korytarz", "", 33.3, 30.8, 66.7, 40.5, None, None),
            ("sypialnia-2", "Sypialnia", 33.3, 40.5, 66.7, 71.4, "13,3 m²", None),
            ("sypialnia-3", "Sypialnia", 66.7, 30.8, 100, 61, "12 m²", None),
        ]),
        "pietro": ([(12.8, 0), (87.2, 0), (87.2, 71.6), (12.8, 71.6)], [
            ("lazienka-prywatna", "Łazienka", 12.8, 0, 27.4, 32.8, "prywatna", None),
            ("sypialnia-4", "Sypialnia", 27.4, 0, 57.7, 32.8, "z łazienką · ok. 13 m²", None),
            ("wc", "WC", 57.7, 0, 72.2, 18.5, None, None),  # wg Michała: WC od ściany zewnętrznej, wejście do sypialni z boku z holu
            ("hol", "Hol", 57.7, 18.5, 72.2, 32.8, None, None),
            ("schody", "Schody", 72.2, 0, 87.2, 32.8, None, "schody"),
            ("salon", "Salon z kuchnią", 12.8, 32.8, 87.2, 71.6, "i jadalnią · ok. 38 m²", None),
        ]),
    },
}

# Apartamenty w siódmym budynku (bliźniak, projekt wnętrz MD Studio 04.2026): cztery lokale, po dwa
# w każdym segmencie, parter i piętro; klatka schodowa na oba piętra. Siatka 0–100 na szerokość segmentu.
APARTAMENT = {
    "parter": ([(0, 0), (47.2, 0), (47.2, 13.8), (100, 13.8), (100, 99.2), (47.2, 99.2), (47.2, 117), (0, 117)], [
        ("sypialnia-1", "Sypialnia", 0, 0, 47.2, 37.4, "14,1 m²", None),
        ("sypialnia-2", "Sypialnia", 47.2, 13.8, 100, 45.5, "14,4 m²", None),
        ("salon", "Salon z kuchnią", 0, 37.4, 47.2, 117, "i kominkiem · 35,7 m²", None),
        ("hol", "Hol", 47.2, 45.5, 61, 71.5, None, None),
        ("lazienka", "Łazienka", 61, 45.5, 80.5, 71.5, "4,7 m²", None),
        ("sauna", "Sauna", 80.5, 45.5, 100, 71.5, None, "sauna"),
        ("klatka", "Klatka", 47.2, 71.5, 61, 99.2, None, None),
        ("pralnia", "Pralnia", 61, 71.5, 100, 85, None, None),
        ("schody", "Schody", 61, 85, 100, 99.2, None, "schody"),
    ]),
    "pietro": ([(0, 15.4), (100, 15.4), (100, 102.4), (0, 102.4)], [
        ("sypialnia-1", "Sypialnia", 0, 15.4, 45.5, 39, "11,7 m²", None),
        ("sypialnia-2", "Sypialnia", 45.5, 15.4, 74.8, 39, "9,8 m²", None),
        ("sauna", "Sauna", 74.8, 15.4, 100, 39, None, "sauna"),
        ("salon", "Salon z kuchnią", 0, 39, 45.5, 102.4, "i kominkiem · 26,4 m²", None),
        ("hol", "Hol", 45.5, 39, 63.4, 71.5, None, None),
        ("lazienka", "Łazienka", 63.4, 39, 100, 71.5, "6,5 m²", None),
        ("klatka", "Klatka", 45.5, 71.5, 61, 102.4, None, None),
        ("schody", "Schody", 61, 71.5, 100, 102.4, None, "schody"),
    ]),
}

# Pary pomieszczeń bez ściany między nimi (schody z holem, wejściem albo klatką), wg planów źródłowych.
OTWARCIA = {
    ("salon-parter", "parter"): [("wejscie", "schody"), ("wejscie", "salon")],
    ("salon-parter", "pietro"): [("schody", "hol"), ("lazienka-2", "lazienka-2b"), ("schody-bieg", "schody")],
    ("salon-pietro", "parter"): [("wejscie", "schody"), ("schody", "schody-2"), ("wejscie", "hol"), ("hol", "korytarz")],
    ("salon-pietro", "pietro"): [("schody", "salon"), ("hol", "schody"), ("hol", "salon")],
    ("apartament", "parter"): [("klatka", "schody")],
    ("apartament", "pietro"): [("klatka", "schody"), ("hol", "klatka")],
}

# Schody z zakrętem: gdzie leży narożnik z klinowymi stopniami. „prawo”: bieg w prawo i zakręt w dół (parter),
# „gora”: dojście z lewej u góry i bieg w dół do holu (piętro). Strzałka pokazuje kierunek wejścia na górę.
BIEG_GORA = 72.6 - 58.5  # długość biegu nad wcięciem łazienki (jednostki siatki), strzałka zaczyna się w nim
ZAKRET = {("salon-parter", "parter"): "prawo", ("salon-parter", "pietro"): "gora"}

def schody(a, b, c, d, zakret):
    """Stopnie poprzecznie do biegu; przy zakręcie narożnik z klinowymi stopniami i strzałka biegu."""
    if zakret == "poziom":  # krótki bieg poziomy: stopnie pionowo niezależnie od proporcji
        n = max(2, int(c // 28))
        return [f'<line class="stopnie" x1="{a + c * i / n:.0f}" y1="{b:.0f}" x2="{a + c * i / n:.0f}" y2="{b + d:.0f}"/>' for i in range(1, n)]
    if not zakret:
        n = int(max(c, d) // 28)
        return [f'<line class="stopnie" x1="{a + c * i / n:.0f}" y1="{b:.0f}" x2="{a + c * i / n:.0f}" y2="{b + d:.0f}"/>' if c >= d else
                f'<line class="stopnie" x1="{a:.0f}" y1="{b + d * i / n:.0f}" x2="{a + c:.0f}" y2="{b + d * i / n:.0f}"/>' for i in range(1, n)]
    k = min(c, d)  # bok narożnika
    if zakret == "prawo":  # prosty bieg a..a+c-k, narożnik po prawej, środek zakrętu w lewym dolnym rogu narożnika
        n = int((c - k) // 28)
        g = [f'<line class="stopnie" x1="{a + (c - k) * i / n:.0f}" y1="{b:.0f}" x2="{a + (c - k) * i / n:.0f}" y2="{b + d:.0f}"/>' for i in range(1, n + 1)]
        o, cele = (a + c - k, b + d), [(a + c - k * .45, b), (a + c, b), (a + c, b + k * .45)]
        bieg = [(a + 14, b + d * .78), (a + c - k / 2, b + d * .78), (a + c - k / 2, b + d - 6)]
    else:  # „gora”: narożnik u góry, prosty bieg w dół
        n = int((d - k) // 28)
        g = [f'<line class="stopnie" x1="{a:.0f}" y1="{b + k + (d - k) * i / n:.0f}" x2="{a + c:.0f}" y2="{b + k + (d - k) * i / n:.0f}"/>' for i in range(n)]
        o, cele = (a, b + k), [(a + k * .45, b), (a + c, b), (a + c, b + k * .45)]
        bieg = [(a - (BIEG_GORA - 1) * S, b + k / 2), (a + c * .62, b + k / 2), (a + c * .62, b + d - 14)]
    g += [f'<line class="stopnie" x1="{o[0]:.0f}" y1="{o[1]:.0f}" x2="{x:.0f}" y2="{y:.0f}"/>' for x, y in cele]
    g.append('<polyline class="bieg" marker-end="url(#strzalka)" points="%s"/>' % " ".join(f"{x:.0f},{y:.0f}" for x, y in bieg))
    return g

def otwarcie(p, q):
    """Prostokąt w kolorze pokoju na wspólnej ścianie dwóch pomieszczeń."""
    _, _, ax0, ay0, ax1, ay1, *_ = p
    _, _, bx0, by0, bx1, by1, *_ = q
    for x in {ax1, ax0} & {bx0, bx1}:  # ściana pionowa
        y0, y1 = max(ay0, by0) + SCIANA, min(ay1, by1) - SCIANA
        if y1 > y0: return (x - SCIANA - .01) * S, y0 * S, (2 * SCIANA + .02) * S, (y1 - y0) * S
    for y in {ay1, ay0} & {by0, by1}:  # ściana pozioma
        x0, x1 = max(ax0, bx0) + SCIANA, min(ax1, bx1) - SCIANA
        if x1 > x0: return x0 * S, (y - SCIANA - .01) * S, (x1 - x0) * S, (2 * SCIANA + .02) * S
    raise ValueError(f"{p[0]} i {q[0]} nie mają wspólnej ściany")

def svg(uklad, pietro, bryla, pokoje):
    pad = 4  # wspólny kadr dla rzutów jednego budynku, żeby piętra miały tę samą skalę na stronie
    gora = 0 if uklad == "apartament" else 9.1  # narciarnia wystaje przed front, ten sam kadr na obu piętrach
    vb = -pad * S, -(pad + gora) * S, (100 + 2 * pad) * S, ((117 if uklad == "apartament" else 72) + gora + 2 * pad) * S
    pts = " ".join(f"{x * S:.0f},{y * S:.0f}" for x, y in bryla)
    kondygnacja = "parter" if pietro == "parter" else "piętro"
    tytul = (f"Rzut poglądowy apartamentu na {'parterze' if pietro == 'parter' else 'piętrze'}" if uklad == "apartament" else
             f"Rzut poglądowy domku, układ z salonem na {'parterze' if uklad == 'salon-parter' else 'piętrze'}: {kondygnacja}")
    L = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]:.0f} {vb[1]:.0f} {vb[2]:.0f} {vb[3]:.0f}" role="img" aria-label="{tytul}">',
         '<style>'
         '.bryla{fill:var(--color-atrament);stroke:var(--color-atrament);stroke-width:%d;stroke-linejoin:miter}' % (ZEWN * S * 2) +
         '.pokoj{fill:var(--color-tlo)}.pokoj.skos{fill:var(--color-tlo-2)}'
         '.stopnie{stroke:var(--color-linia-mocna);stroke-width:1.5;vector-effect:non-scaling-stroke}'
         '.bieg{fill:none;stroke:var(--color-atrament-2);stroke-width:1.5;vector-effect:non-scaling-stroke}#strzalka path{fill:var(--color-atrament-2)}'
         '.sauna-deski{stroke:var(--color-bursztyn);stroke-width:1;opacity:.6;vector-effect:non-scaling-stroke}'
         '.nazwa{font:500 19px var(--font-ui,sans-serif);letter-spacing:.12em;text-transform:uppercase;fill:var(--color-atrament);paint-order:stroke;stroke:var(--color-tlo);stroke-width:8px;stroke-linejoin:round}'
         '.dopisek{font:500 18px var(--font-ui,sans-serif);letter-spacing:.06em;font-variant-numeric:tabular-nums;fill:var(--color-wyciszony)}'
         '.pokoj-g:hover .pokoj,.pokoj-g:focus .pokoj{fill:var(--color-tlo-2)}'
         '</style>',
         '<defs><marker id="strzalka" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z"/></marker></defs>',
         f'<polygon class="bryla" points="{pts}"/>']
    for pid, nazwa, x0, y0, x1, y1, dop, rodzaj in pokoje:
        a, b, c, d = (x0 + SCIANA) * S, (y0 + SCIANA) * S, (x1 - x0 - 2 * SCIANA) * S, (y1 - y0 - 2 * SCIANA) * S
        g = [f'<g id="r-{pid}" class="pokoj-g" data-nazwa="{nazwa or pid}">', f'<rect class="pokoj{" skos" if rodzaj == "skos" else ""}" x="{a:.0f}" y="{b:.0f}" width="{c:.0f}" height="{d:.0f}"/>']
        if isinstance(rodzaj, tuple):
            e0, f0, e1, f1 = rodzaj
            g.append(f'<rect class="pokoj" x="{(e0 + SCIANA) * S:.0f}" y="{(f0 - 2 * SCIANA) * S:.0f}" width="{(e1 - e0 - 2 * SCIANA) * S:.0f}" height="{(f1 - f0 + SCIANA) * S:.0f}"/>')
        if rodzaj == "schody":  # stopnie poprzecznie do dłuższego boku
            g += schody(a, b, c, d, ZAKRET.get((uklad, pietro)) if pid == "schody" else "poziom" if pid == "schody-bieg" else None)
        if rodzaj == "sauna":
            for i in range(1, int(d // 18)):
                g.append(f'<line class="sauna-deski" x1="{a:.0f}" y1="{b + i * 18:.0f}" x2="{a + c:.0f}" y2="{b + i * 18:.0f}"/>')
        if nazwa:
            cx, cy = a + c / 2, b + d / 2 + (0 if dop else 8)
            maly = ' style="font-size:15px;letter-spacing:.03em"' if c < len(nazwa) * 14 else ''  # nazwa szersza niż pokój, np. narciarnia
            g.append(f'<text class="nazwa"{maly} x="{cx:.0f}" y="{cy - (6 if dop else 0):.0f}" text-anchor="middle">{nazwa}</text>')
            if dop: g.append(f'<text class="dopisek" x="{cx:.0f}" y="{cy + 22:.0f}" text-anchor="middle">{dop}</text>')
        L += g + ["</g>"]
    pok = {p[0]: p for p in pokoje}
    for a, b in OTWARCIA.get((uklad, pietro), []):
        L.append('<rect class="pokoj" x="%.0f" y="%.0f" width="%.0f" height="%.0f"/>' % otwarcie(pok[a], pok[b]))
    L.append("</svg>")
    return "\n".join(L)

out = ROOT / "public/ilustracje"
for uklad, u in UKLADY.items():
    for pietro in ("parter", "pietro"):
        f = out / f"G3_rzut_{uklad}_{pietro}.svg"
        f.write_text(z_zapasem(svg(uklad, pietro, *u[pietro])))
        print(f.name, "dla", ", ".join(u["domy"]))
for pietro, (bryla, pokoje) in APARTAMENT.items():
    f = out / f"G3_rzut_apartament_{pietro}.svg"
    f.write_text(z_zapasem(svg("apartament", pietro, bryla, pokoje)))
    print(f.name)
