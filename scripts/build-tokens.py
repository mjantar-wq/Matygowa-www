#!/usr/bin/env python3
"""Generuje src/styles/tokens.css z design/tokens.json (źródło: system wizualny Matygowej Osady).

Uruchom po każdej zmianie tokenów: python3 scripts/build-tokens.py
"""
import json
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
t = json.loads((ROOT / "design/tokens.json").read_text())
themes = [x["id"] for x in t["color"]["themes"]]
colors = t["color"]["tokens"]


def val(tok, i):
    return tok["value"].get(themes[i], tok["value"][themes[0]])


def rem(px):
    return f"{px / 16:g}rem"


out = [
    "/* Matygowa Osada: tokeny wyglądu. Źródło: design/tokens.json",
    "   (system wizualny: https://claude.ai/artifact/3yKkA57MMib2E9qbuJ8gQd).",
    "   Plik generowany przez scripts/build-tokens.py; nie edytuj ręcznie. */",
    "",
    "@theme {",
]
out += [f"  --color-{c['name']}: {val(c, 0)};" for c in colors]
out += [
    '  --font-display: var(--font-fraunces), "Iowan Old Style", Georgia, serif;',
    '  --font-ui: var(--font-inter), system-ui, -apple-system, "Segoe UI", sans-serif;',
    '  --font-tabliczka: var(--font-rufina), Georgia, serif;',
]
# Rozmiary płynne: od wartości „Telefon Npx” z opisu stylu (375px) do wartości desktop (1440px).
for group in t["type"]["groups"]:
    for s in group["styles"]:
        mx = float(s["fontSize"][:-2])
        m = re.search(r"Telefon (\d+)px", s["usage"])
        mn = float(m.group(1)) if m else mx
        if mn == mx:
            size = rem(mx)
        else:
            slope = (mx - mn) / (1440 - 375)
            size = f"clamp({rem(mn)}, {(mn - slope * 375) / 16:.4f}rem + {slope * 100:.4f}vw, {rem(mx)})"
        out.append(f"  --text-{s['name']}: {size};")
        out.append(f"  --text-{s['name']}--line-height: {s['lineHeight']};")
        if s.get("letterSpacing"):
            out.append(f"  --text-{s['name']}--letter-spacing: {s['letterSpacing']};")
        out.append(f"  --text-{s['name']}--font-weight: {s['fontWeight']};")
out += [f"  --radius-{r['name'].removeprefix('radius-')}: {r['value']};" for r in t["radius"]["tokens"]]
out += [f"  --ease-{e['name'].removeprefix('krzywa-')}: {e['value']};" for e in t["easing"]["tokens"]]
out += ["}", "", ":root {"]
out += [f"  --{s['name']}: {rem(int(s['value'][:-2]))};" for s in t["spacing"]["tokens"]]
out += [f"  --{x['name']}: {x['value']};" for fam in ("layout", "size", "duration") for x in t[fam]["tokens"]]
shadow = t["shadow"]["tokens"][0]["value"]
out += [
    f"  --cien-wyskakujace: {shadow['zima-dzien']};",
    "  /* Siatka telefonu; tablet i desktop niżej. */",
    "  --margines: 1.25rem;",
    "  --rynna: 1.5rem;",
    "  --sekcja-y: var(--space-9);",
    "  color-scheme: light;",
    "}",
    "@media (min-width: 768px) { :root { --margines: 3rem; --sekcja-y: var(--space-10); } }",
    "@media (min-width: 1024px) { :root { --margines: 6rem; --rynna: 2rem; --sekcja-y: var(--space-11); } }",
    "",
]
selectors = {
    1: ':root[data-pora="noc"]',
    2: ':root[data-sezon="lato"]',
    3: ':root[data-sezon="lato"][data-pora="noc"]',
}
for i, sel in selectors.items():
    out.append(sel + " {")
    out += [f"  --color-{c['name']}: {val(c, i)};" for c in colors if i == 3 or val(c, i) != val(c, 0)]
    if i in (1, 3):
        out += [f"  --cien-wyskakujace: {shadow['zima-noc']};", "  color-scheme: dark;"]
    out += ["}", ""]
out += [
    "/* Zmiana pory dnia i roku: tylko kolory, w tempie mgły. Klasę mo-przejscie dodaje przełącznik na czas zmiany. */",
    ":root.mo-przejscie, :root.mo-przejscie * { transition: background-color var(--ruch-mgla) var(--ease-przejscie), color var(--ruch-mgla) var(--ease-przejscie), border-color var(--ruch-mgla) var(--ease-przejscie), fill var(--ruch-mgla) var(--ease-przejscie), stroke var(--ruch-mgla) var(--ease-przejscie) !important; }",
    "@media (prefers-reduced-motion: reduce) { :root.mo-przejscie, :root.mo-przejscie * { transition: none !important; } }",
    "",
]
(ROOT / "src/styles/tokens.css").write_text("\n".join(out))
print("src/styles/tokens.css")
