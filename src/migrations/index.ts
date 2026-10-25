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
    name: '20261025_153818_oferty_tylko_zdjecie'
  },
];
