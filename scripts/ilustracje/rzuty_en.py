"""Generuje angielskie wersje rzutów G3 (public/ilustracje/G3_rzut_*_en.svg) z polskich SVG.
Uruchomienie po każdej zmianie rzutów PL: python3 scripts/ilustracje/rzuty_en.py"""
import glob, re, os

TXT = {
    'Sypialnia': 'Bedroom', 'Łazienka': 'Bathroom', 'Schody': 'Stairs', 'Hol': 'Hall',
    'Sauna': 'Sauna', 'Salon z kuchnią': 'Living room with kitchen', 'z zewnątrz': 'outside access',
    'Wejście': 'Entrance', 'WC': 'WC', 'Narciarnia': 'Ski room', 'Klatka': 'Stairwell',
    'z łazienką · ok. 13 m²': 'en suite · approx. 13 m²', 'prywatna': 'private',
    'i kominkiem · 35,7 m²': 'with fireplace · 35.7 m²', 'i kominkiem · 26,4 m²': 'with fireplace · 26.4 m²',
    'i jadalnią · 32,5 m²': 'and dining area · 32.5 m²', 'i jadalnią · ok. 38 m²': 'and dining area · approx. 38 m²',
    'Techniczne': 'Utility room', 'Pralnia': 'Laundry',
}
ARIA = {
    'Rzut poglądowy apartamentu na parterze': 'Indicative floor plan of the apartment: ground floor',
    'Rzut poglądowy apartamentu na piętrze': 'Indicative floor plan of the apartment: upper floor',
    'Rzut poglądowy domku, układ z salonem na parterze: parter': 'Indicative floor plan of the house, living room on the ground floor: ground floor',
    'Rzut poglądowy domku, układ z salonem na parterze: piętro': 'Indicative floor plan of the house, living room on the ground floor: upper floor',
    'Rzut poglądowy domku, układ z salonem na piętrze: parter': 'Indicative floor plan of the house, living room upstairs: ground floor',
    'Rzut poglądowy domku, układ z salonem na piętrze: piętro': 'Indicative floor plan of the house, living room upstairs: upper floor',
}
DIM = re.compile(r'^(\d+),(\d+) m²$')
base = os.path.join(os.path.dirname(__file__), '..', '..', 'public', 'ilustracje')
for f in glob.glob(os.path.join(base, 'G3_rzut_*.svg')):
    if f.endswith('_en.svg'): continue
    s = open(f, encoding='utf-8').read()
    def tr(m):
        t = m.group(2)
        en = TXT.get(t) or (DIM.sub(r'\1.\2 m²', t) if DIM.match(t) else None)
        if en is None and re.match(r'^[\d ,]+ ?m²$', t): en = t.replace(',', '.')
        if en is None: raise SystemExit(f'brak tłumaczenia: {t!r} w {f}')
        return m.group(1) + en + '</text>'
    s = re.sub(r'(<text[^>]*>)([^<]*)</text>', tr, s)
    s = re.sub(r'data-nazwa="([^"]*)"', lambda m: 'data-nazwa="%s"' % TXT.get(m.group(1), m.group(1)), s)
    s = re.sub(r'aria-label="([^"]*)"', lambda m: 'aria-label="%s"' % ARIA[m.group(1)], s)
    open(f[:-4] + '_en.svg', 'w', encoding='utf-8').write(s)
