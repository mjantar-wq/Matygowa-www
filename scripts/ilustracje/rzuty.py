#!/usr/bin/env python3
"""G3: rzuty poglądowe dwóch układów domków (bez skali, bez drzwi), po dwa piętra.

Źródła: projekt architektoniczny „BUDYNEK A1” (Bentkowski, salon na parterze: Świnica, Gerlach, Hawrań)
i projekt wnętrz W2a z 12.2023 (Topór, salon na piętrze: Wołoszyn, Łomnica, Lodowy).
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
        "parter": (parter(22.6, 77.4), [
            ("sauna", "Sauna", 12.8, 0, 31.1, 15.7, None, "sauna"),
            ("narciarnia", "Narciarnia", 31.1, 0, 51.9, 9.1, "wejście z zewnątrz", None),  # wg Michała: dostęp tylko z zewnątrz, obok wejścia
            ("lazienka", "Łazienka", 12.8, 15.7, 31.1, 30.8, None, None),
            ("wejscie", "Wejście", 31.1, 9.1, 51.9, 30.8, None, None),
            ("schody", "Schody", 51.9, 0, 87.2, 17.5, None, "schody"),
            ("wc", "WC", 51.9, 17.5, 64.2, 30.8, None, None),
            ("techniczne", "Techniczne", 64.2, 17.5, 87.2, 30.8, None, None),
            ("sypialnia-1", "Sypialnia", 0, 30.8, 22.6, 61, None, None),
            ("salon", "Salon z kuchnią", 22.6, 30.8, 100, 61, "i jadalnią", (22.6, 61, 77.4, 71.4)),
        ]),
        "pietro": ([(12.8, 0), (87.2, 0), (87.2, 66), (12.8, 66)], [
            ("sypialnia-2", "Sypialnia", 12.8, 0, 44, 29.2, None, None),
            ("lazienka-2", "Łazienka", 44, 0, 58.5, 29.2, None, None),
            ("schody", "Schody", 58.5, 0, 72.6, 29.2, None, "schody"),
            ("skos", "", 72.6, 0, 87.2, 29.2, None, "skos"),
            ("hol", "Hol", 12.8, 29.2, 87.2, 39.6, None, None),
            ("sypialnia-3", "Sypialnia", 12.8, 39.6, 50.9, 66, None, None),
            ("sypialnia-4", "Sypialnia", 50.9, 39.6, 87.2, 66, None, None),
        ]),
    },
    "salon-pietro": {
        "domy": ["woloszyn", "lomnica", "lodowy"],
        "parter": (parter(33.3, 66.7), [
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
            ("sypialnia-4", "Sypialnia", 27.4, 0, 57.7, 32.8, "z łazienką", None),
            ("hol", "", 57.7, 0, 72.2, 13.3, None, None),
            ("wc", "WC", 57.7, 13.3, 72.2, 32.8, None, None),
            ("schody", "Schody", 72.2, 0, 87.2, 32.8, None, "schody"),
            ("salon", "Salon z kuchnią", 12.8, 32.8, 87.2, 71.6, "i jadalnią", None),
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
        ("klatka", "Klatka", 47.2, 71.5, 61, 99.2, None, "skos"),
        ("pralnia", "Pralnia", 61, 71.5, 75, 99.2, None, None),
        ("schody", "", 75, 71.5, 100, 99.2, None, "schody"),
    ]),
    "pietro": ([(0, 15.4), (100, 15.4), (100, 102.4), (0, 102.4)], [
        ("sypialnia-1", "Sypialnia", 0, 15.4, 45.5, 39, "11,7 m²", None),
        ("sypialnia-2", "Sypialnia", 45.5, 15.4, 74.8, 39, "9,8 m²", None),
        ("sauna", "Sauna", 74.8, 15.4, 100, 39, None, "sauna"),
        ("salon", "Salon z kuchnią", 0, 39, 45.5, 102.4, "i kominkiem · 26,4 m²", None),
        ("hol", "Hol", 45.5, 39, 63.4, 71.5, None, None),
        ("lazienka", "Łazienka", 63.4, 39, 100, 71.5, "6,5 m²", None),
        ("klatka", "Klatka", 45.5, 71.5, 61, 102.4, None, "skos"),
        ("schody", "", 61, 71.5, 100, 102.4, None, "schody"),
    ]),
}

def svg(uklad, pietro, bryla, pokoje):
    pad = 4  # wspólny kadr dla rzutów jednego budynku, żeby piętra miały tę samą skalę na stronie
    vb = -pad * S, -pad * S, (100 + 2 * pad) * S, ((117 if uklad == "apartament" else 72) + 2 * pad) * S
    pts = " ".join(f"{x * S:.0f},{y * S:.0f}" for x, y in bryla)
    kondygnacja = "parter" if pietro == "parter" else "piętro"
    tytul = (f"Rzut poglądowy apartamentu na {'parterze' if pietro == 'parter' else 'piętrze'}" if uklad == "apartament" else
             f"Rzut poglądowy domku, układ z salonem na {'parterze' if uklad == 'salon-parter' else 'piętrze'}: {kondygnacja}")
    L = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]:.0f} {vb[1]:.0f} {vb[2]:.0f} {vb[3]:.0f}" role="img" aria-label="{tytul}">',
         '<style>'
         '.bryla{fill:var(--color-atrament);stroke:var(--color-atrament);stroke-width:%d;stroke-linejoin:miter}' % (ZEWN * S * 2) +
         '.pokoj{fill:var(--color-tlo)}.pokoj.skos{fill:var(--color-tlo-2)}'
         '.stopnie{stroke:var(--color-linia-mocna);stroke-width:1.5;vector-effect:non-scaling-stroke}'
         '.sauna-deski{stroke:var(--color-bursztyn);stroke-width:1;opacity:.6;vector-effect:non-scaling-stroke}'
         '.nazwa{font:500 19px var(--font-ui,sans-serif);letter-spacing:.12em;text-transform:uppercase;fill:var(--color-atrament);paint-order:stroke;stroke:var(--color-tlo);stroke-width:8px;stroke-linejoin:round}'
         '.dopisek{font:500 18px var(--font-ui,sans-serif);letter-spacing:.06em;font-variant-numeric:tabular-nums;fill:var(--color-wyciszony)}'
         '.pokoj-g:hover .pokoj,.pokoj-g:focus .pokoj{fill:var(--color-tlo-2)}'
         '</style>',
         f'<polygon class="bryla" points="{pts}"/>']
    for pid, nazwa, x0, y0, x1, y1, dop, rodzaj in pokoje:
        a, b, c, d = (x0 + SCIANA) * S, (y0 + SCIANA) * S, (x1 - x0 - 2 * SCIANA) * S, (y1 - y0 - 2 * SCIANA) * S
        g = [f'<g id="r-{pid}" class="pokoj-g" data-nazwa="{nazwa or pid}">', f'<rect class="pokoj{" skos" if rodzaj == "skos" else ""}" x="{a:.0f}" y="{b:.0f}" width="{c:.0f}" height="{d:.0f}"/>']
        if isinstance(rodzaj, tuple):
            e0, f0, e1, f1 = rodzaj
            g.append(f'<rect class="pokoj" x="{(e0 + SCIANA) * S:.0f}" y="{(f0 - 2 * SCIANA) * S:.0f}" width="{(e1 - e0 - 2 * SCIANA) * S:.0f}" height="{(f1 - f0 + SCIANA) * S:.0f}"/>')
        if rodzaj == "schody":  # stopnie poprzecznie do dłuższego boku
            n = int(max(c, d) // 28)
            for i in range(1, n):
                g.append(f'<line class="stopnie" x1="{a + c * i / n:.0f}" y1="{b:.0f}" x2="{a + c * i / n:.0f}" y2="{b + d:.0f}"/>' if c >= d else
                         f'<line class="stopnie" x1="{a:.0f}" y1="{b + d * i / n:.0f}" x2="{a + c:.0f}" y2="{b + d * i / n:.0f}"/>')
        if rodzaj == "sauna":
            for i in range(1, int(d // 18)):
                g.append(f'<line class="sauna-deski" x1="{a:.0f}" y1="{b + i * 18:.0f}" x2="{a + c:.0f}" y2="{b + i * 18:.0f}"/>')
        if nazwa:
            cx, cy = a + c / 2, b + d / 2 + (0 if dop else 8)
            g.append(f'<text class="nazwa" x="{cx:.0f}" y="{cy - (6 if dop else 0):.0f}" text-anchor="middle">{nazwa}</text>')
            if dop: g.append(f'<text class="dopisek" x="{cx:.0f}" y="{cy + 22:.0f}" text-anchor="middle">{dop}</text>')
        L += g + ["</g>"]
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
