import * as migration_20261024_222614_initial from './20261024_222614_initial';
import * as migration_20261024_223907_role_default from './20261024_223907_role_default';
import * as migration_20261024_235001_pomiar_zgody from './20261024_235001_pomiar_zgody';
import * as migration_20261025_002906_unit_bathrooms_hosts from './20261025_002906_unit_bathrooms_hosts';
import * as migration_20261025_073328_hero_variants from './20261025_073328_hero_variants';
import * as migration_20261025_075424_scena_warianty from './20261025_075424_scena_warianty';
import * as migration_20261025_092914_nazwy_szczytow_mapa_atrakcji from './20261025_092914_nazwy_szczytow_mapa_atrakcji';
import * as migration_20261025_094500_wlasciciel from './20261025_094500_wlasciciel';
import * as migration_20261025_113356_opinie_z_google from './20261025_113356_opinie_z_google';
import * as migration_20261025_153818_oferty_tylko_zdjecie from './20261025_153818_oferty_tylko_zdjecie';
import * as migration_20261025_182700_okolica_galeria from './20261025_182700_okolica_galeria';
import * as migration_20261025_190310_zdjecia_prawa from './20261025_190310_zdjecia_prawa';
import * as migration_20261027_064308_lozka from './20261027_064308_lozka';
import * as migration_20261027_075500_warunki_platnosci from './20261027_075500_warunki_platnosci';
import * as migration_20261028_094500_apartamenty_na_dole from './20261028_094500_apartamenty_na_dole';
import * as migration_20261110_080900_oferty_tylko_lista from './20261110_080900_oferty_tylko_lista';
import * as migration_20261110_083000_przenosiny_sekcji_na_zywych_danych from './20261110_083000_przenosiny_sekcji_na_zywych_danych';
import * as migration_20261110_083500_cztery_pory_roku from './20261110_083500_cztery_pory_roku';
import * as migration_20261110_090000_angielski_zgodny_z_polskim from './20261110_090000_angielski_zgodny_z_polskim';
import * as migration_20261110_100000_sauna_i_bania_na_osade from './20261110_100000_sauna_i_bania_na_osade';
import * as migration_20261110_110000_slowniczek_na_osade from './20261110_110000_slowniczek_na_osade';
import * as migration_20261110_120000_oferty_bez_zdjec_z_importu from './20261110_120000_oferty_bez_zdjec_z_importu';
import * as migration_20261110_130000_ukryj_tytul_rytualy from './20261110_130000_ukryj_tytul_rytualy';
import * as migration_20261110_131000_przywroc_licznik_i_haslo_z_panelu from './20261110_131000_przywroc_licznik_i_haslo_z_panelu';
import * as migration_20261110_140000_woloszyn_8_osob from './20261110_140000_woloszyn_8_osob';
import * as migration_20261110_140500_balony_link_strona_obiektu from './20261110_140500_balony_link_strona_obiektu';
import * as migration_20261110_140600_hero_bania from './20261110_140600_hero_bania';
import * as migration_20261110_140700_sauna_bania_platne from './20261110_140700_sauna_bania_platne';

export const migrations = [
  {
    up: migration_20261024_222614_initial.up,
    down: migration_20261024_222614_initial.down,
    name: '20261024_222614_initial',
  },
  {
    up: migration_20261024_223907_role_default.up,
    down: migration_20261024_223907_role_default.down,
    name: '20261024_223907_role_default',
  },
  {
    up: migration_20261024_235001_pomiar_zgody.up,
    down: migration_20261024_235001_pomiar_zgody.down,
    name: '20261024_235001_pomiar_zgody',
  },
  {
    up: migration_20261025_002906_unit_bathrooms_hosts.up,
    down: migration_20261025_002906_unit_bathrooms_hosts.down,
    name: '20261025_002906_unit_bathrooms_hosts',
  },
  {
    up: migration_20261025_073328_hero_variants.up,
    down: migration_20261025_073328_hero_variants.down,
    name: '20261025_073328_hero_variants',
  },
  {
    up: migration_20261025_075424_scena_warianty.up,
    down: migration_20261025_075424_scena_warianty.down,
    name: '20261025_075424_scena_warianty',
  },
  {
    up: migration_20261025_092914_nazwy_szczytow_mapa_atrakcji.up,
    down: migration_20261025_092914_nazwy_szczytow_mapa_atrakcji.down,
    name: '20261025_092914_nazwy_szczytow_mapa_atrakcji',
  },
  {
    up: migration_20261025_094500_wlasciciel.up,
    down: migration_20261025_094500_wlasciciel.down,
    name: '20261025_094500_wlasciciel',
  },
  {
    up: migration_20261025_113356_opinie_z_google.up,
    down: migration_20261025_113356_opinie_z_google.down,
    name: '20261025_113356_opinie_z_google',
  },
  {
    up: migration_20261025_153818_oferty_tylko_zdjecie.up,
    down: migration_20261025_153818_oferty_tylko_zdjecie.down,
    name: '20261025_153818_oferty_tylko_zdjecie',
  },
  {
    up: migration_20261025_182700_okolica_galeria.up,
    down: migration_20261025_182700_okolica_galeria.down,
    name: '20261025_182700_okolica_galeria',
  },
  {
    up: migration_20261025_190310_zdjecia_prawa.up,
    down: migration_20261025_190310_zdjecia_prawa.down,
    name: '20261025_190310_zdjecia_prawa',
  },
  {
    up: migration_20261027_064308_lozka.up,
    down: migration_20261027_064308_lozka.down,
    name: '20261027_064308_lozka'
  },
  {
    up: migration_20261027_075500_warunki_platnosci.up,
    down: migration_20261027_075500_warunki_platnosci.down,
    name: '20261027_075500_warunki_platnosci'
  },
  {
    up: migration_20261028_094500_apartamenty_na_dole.up,
    down: migration_20261028_094500_apartamenty_na_dole.down,
    name: '20261028_094500_apartamenty_na_dole'
  },
  {
    up: migration_20261110_080900_oferty_tylko_lista.up,
    down: migration_20261110_080900_oferty_tylko_lista.down,
    name: '20261110_080900_oferty_tylko_lista',
  },
  {
    up: migration_20261110_083000_przenosiny_sekcji_na_zywych_danych.up,
    down: migration_20261110_083000_przenosiny_sekcji_na_zywych_danych.down,
    name: '20261110_083000_przenosiny_sekcji_na_zywych_danych'
  },
  {
    up: migration_20261110_083500_cztery_pory_roku.up,
    down: migration_20261110_083500_cztery_pory_roku.down,
    name: '20261110_083500_cztery_pory_roku'
  },
  {
    up: migration_20261110_090000_angielski_zgodny_z_polskim.up,
    down: migration_20261110_090000_angielski_zgodny_z_polskim.down,
    name: '20261110_090000_angielski_zgodny_z_polskim'
  },
  {
    up: migration_20261110_100000_sauna_i_bania_na_osade.up,
    down: migration_20261110_100000_sauna_i_bania_na_osade.down,
    name: '20261110_100000_sauna_i_bania_na_osade'
  },
  {
    up: migration_20261110_110000_slowniczek_na_osade.up,
    down: migration_20261110_110000_slowniczek_na_osade.down,
    name: '20261110_110000_slowniczek_na_osade'
  },
  {
    up: migration_20261110_120000_oferty_bez_zdjec_z_importu.up,
    down: migration_20261110_120000_oferty_bez_zdjec_z_importu.down,
    name: '20261110_120000_oferty_bez_zdjec_z_importu'
  },
  {
    up: migration_20261110_130000_ukryj_tytul_rytualy.up,
    down: migration_20261110_130000_ukryj_tytul_rytualy.down,
    name: '20261110_130000_ukryj_tytul_rytualy'
  },
  {
    up: migration_20261110_131000_przywroc_licznik_i_haslo_z_panelu.up,
    down: migration_20261110_131000_przywroc_licznik_i_haslo_z_panelu.down,
    name: '20261110_131000_przywroc_licznik_i_haslo_z_panelu'
  },
  {
    up: migration_20261110_140000_woloszyn_8_osob.up,
    down: migration_20261110_140000_woloszyn_8_osob.down,
    name: '20261110_140000_woloszyn_8_osob'
  },
  {
    up: migration_20261110_140500_balony_link_strona_obiektu.up,
    down: migration_20261110_140500_balony_link_strona_obiektu.down,
    name: '20261110_140500_balony_link_strona_obiektu'
  },
  {
    up: migration_20261110_140600_hero_bania.up,
    down: migration_20261110_140600_hero_bania.down,
    name: '20261110_140600_hero_bania'
  },
  {
    up: migration_20261110_140700_sauna_bania_platne.up,
    down: migration_20261110_140700_sauna_bania_platne.down,
    name: '20261110_140700_sauna_bania_platne'
  },
];
