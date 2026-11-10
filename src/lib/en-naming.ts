/**
 * Nazewnictwo obiektów w wersji EN (analiza SEO, Michał, 10.11.2026): rdzeniem jest „house”, a „chalet” dopełnia
 * opisy w wyszukiwarce. „Cottage” zostaje tylko tam, gdzie mowa o zabytkowych chatach góralskich (strona Rytuały).
 * Używane przez migrację 20261110_170000 (żywe dane) i skrypt synchronizujący pliki z content/.
 * Kolejność ma znaczenie: najpierw frazy dłuższe i bardziej szczegółowe.
 */
export const EN_NAMING_PHRASES: [from: string, to: string][] = [
  ['Tatra cottages with sauna and hot tub near Zakopane', 'Private houses with sauna and hot tub near Zakopane'],
  ['Private cottages near Zakopane and Bukowina Tatrzańska', 'Private houses and chalets near Zakopane and Bukowina Tatrzańska'],
  ['Cottages with sauna and hot tub in the Tatras', 'Private houses with sauna and hot tub in the Tatras'],
  ['Six private 120 m² cottages near Zakopane', 'Six private 120 m² houses (mountain chalets) near Zakopane'],
  ['Gallery: Tatra cottages in winter and summer', 'Gallery: Tatra chalets in winter and summer'],
  ['Photos of the cottages,', 'Photos of the houses,'],
  ['A private cottage for ', 'A private mountain chalet for '],
  ['A cottage that looks out at', 'A house that looks out at'],
  ['Other cottages and apartments', 'Other houses and apartments'],
  ['Cottages & apartments', 'Houses & apartments'],
  ['Cottages in Gliczarów Górny', 'Houses in Gliczarów Górny'],
  ['in every cottage', 'in every house'],
  ['in cottages with a sauna', 'in houses with a sauna'],
  ['one of our cottages its name', 'one of our houses its name'],
  ['a snowy cottage outside', 'a snowy house outside'],
  ['The cottage terrace', 'The house terrace'],
  ['in front of the cottage', 'in front of the house'],
  ['Hawrań cottage', 'Hawrań house'],
  ['Gerlach cottage', 'Gerlach house'],
  ['Świnica cottage', 'Świnica house'],
  ['Wołoszyn cottage', 'Wołoszyn house'],
  ['Łomnica cottage', 'Łomnica house'],
  ['Lodowy cottage', 'Lodowy house'],
]

/** Pola, w których cała wartość to dokładnie ten tekst (etykieta statystyki „6 cottages”). */
export const EN_NAMING_EXACT: [from: string, to: string][] = [['cottages', 'houses']]
