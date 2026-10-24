# System wizualny

Źródło prawdy wyglądu strony: https://claude.ai/artifact/3yKkA57MMib2E9qbuJ8gQd (zasady, przykłady komponentów).

- `design/tokens.json`: tokeny (kolory w czterech trybach zima/lato × dzień/noc, typografia, odstępy, siatka, wymiary, ruch).
- `src/styles/tokens.css`: generowany z tokens.json poleceniem `python3 scripts/build-tokens.py`. Tailwind 4 czyta `@theme`, więc działają klasy `bg-tlo`, `text-atrament`, `text-h2`, `font-display`, `rounded-pole`.
- `src/styles/components.css`: komponenty z prefiksem `mo-` (karty, pasek rezerwacji, przyciski, przełączniki, dymek szczytu, poziomice).
- `public/brand/`: logo obiektu (SVG, jednobarwne).

Zasady w kodzie:

- Żadnych kolorów, rozmiarów czcionek ani odstępów wpisanych na sztywno: tylko tokeny (`var(--…)` albo klasy z `@theme`).
- Tryby ustawiają atrybuty na `<html>`: `data-pora="dzien|noc"`, `data-sezon="zima|lato"`.
- Kroje przez next/font jako zmienne `--font-fraunces`, `--font-inter`, `--font-rufina` (nie `--font-display`, które definiuje tokens.css).
- Karty zawsze w anatomii `mo-card` (5 rzędów); rząd kart w `mo-cards` wyrównuje się subgridem.
