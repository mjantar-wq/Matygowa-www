import * as migration_20261024_222614_initial from './20261024_222614_initial';
import * as migration_20261024_223907_role_default from './20261024_223907_role_default';
import * as migration_20261025_000114_unit_bathrooms from './20261025_000114_unit_bathrooms';
import * as migration_20261025_000536_hosts_block from './20261025_000536_hosts_block';

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
    up: migration_20261025_000114_unit_bathrooms.up,
    down: migration_20261025_000114_unit_bathrooms.down,
    name: '20261025_000114_unit_bathrooms',
  },
  {
    up: migration_20261025_000536_hosts_block.up,
    down: migration_20261025_000536_hosts_block.down,
    name: '20261025_000536_hosts_block'
  },
];
