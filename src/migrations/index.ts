import * as migration_20261024_222614_initial from './20261024_222614_initial';
import * as migration_20261024_223907_role_default from './20261024_223907_role_default';

export const migrations = [
  {
    up: migration_20261024_222614_initial.up,
    down: migration_20261024_222614_initial.down,
    name: '20261024_222614_initial',
  },
  {
    up: migration_20261024_223907_role_default.up,
    down: migration_20261024_223907_role_default.down,
    name: '20261024_223907_role_default'
  },
];
