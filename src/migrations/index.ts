import * as migration_20261024_222614_initial from './20261024_222614_initial';
import * as migration_20261024_223907_role_default from './20261024_223907_role_default';
import * as migration_20261024_235001_pomiar_zgody from './20261024_235001_pomiar_zgody';
import * as migration_20261025_002906_unit_bathrooms_hosts from './20261025_002906_unit_bathrooms_hosts';
import * as migration_20261025_073243_scena_warianty from './20261025_073243_scena_warianty';

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
    up: migration_20261025_073243_scena_warianty.up,
    down: migration_20261025_073243_scena_warianty.down,
    name: '20261025_073243_scena_warianty'
  },
];
