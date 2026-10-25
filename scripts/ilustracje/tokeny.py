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

def z_zapasem(svg: str) -> str:
    return re.sub(r"var\((--color-[a-z0-9-]+)\)", lambda m: f"var({m[1]},{JASNE[m[1]]})", svg)
