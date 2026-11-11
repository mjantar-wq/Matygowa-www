"""Wartości zapasowe kolorów w SVG: var(--color-x) → var(--color-x,#hex) z jasnego motywu w src/styles/tokens.css.

Wstawiony w stronę SVG bierze tokeny strony (tryby noc i lato); wczytany przez <img> albo otwarty osobno
nie widzi zmiennych strony i bez wartości zapasowej malowałby wszystko na czarno.
"""
import re
from pathlib import Path

_CSS = (Path(__file__).resolve().parents[2] / "src/styles/tokens.css").read_text()
JASNE = {}
for k, v in re.findall(r"(--color-[a-z0-9-]+):\s*([^;]+);", _CSS):
    JASNE.setdefault(k, v.strip())  # pierwszy blok to @theme, czyli motyw jasny

def wielkie_litery(svg: str) -> str:
    """Zamienia CSS text-transform:uppercase na litery wielkie wpisane wprost w <text>.

    Przy text-transform polskie znaki (Ł, Ś, Ń…) trafiały w inny krój niż reszta napisu i wychodziły większe;
    z wielkimi literami w samym tekście przeglądarka dobiera jeden krój do całego napisu.
    """
    selektory = re.findall(r"([^{}<>]+)\{[^}]*text-transform:uppercase", svg)
    for sel in selektory:
        sel = sel.strip()
        m = re.fullmatch(r"\.([\w-]+)", sel)
        if m:
            cls = m[1]
            svg = re.sub(rf'(<text class="(?:[^"]* )?{cls}(?: [^"]*)?"[^>]*>)([^<]*)(</text>)', lambda x: x[1] + x[2].upper() + x[3], svg)
            continue
        m = re.fullmatch(r"\.([\w-]+) text", sel)
        if m:
            cls = m[1]
            def g(x):
                return re.sub(r"(<text[^>]*>)([^<]*)(</text>)", lambda t: t[1] + t[2].upper() + t[3], x[0])
            svg = re.sub(rf'<g class="{cls}"[^>]*>.*?</g>', g, svg, flags=re.S)
    return svg.replace("text-transform:uppercase;", "").replace(";text-transform:uppercase", "")

def z_zapasem(svg: str) -> str:
    svg = wielkie_litery(svg)
    return re.sub(r"var\((--color-[a-z0-9-]+)\)", lambda m: f"var({m[1]},{JASNE[m[1]]})", svg)
