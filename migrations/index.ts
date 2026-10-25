import * as migration_20261024_214659_initial from './20261024_214659_initial';
import * as migration_20261025_080517_r2_storage from './20261025_080517_r2_storage';
import * as migration_20261025_094259_m3_pages from './20261025_094259_m3_pages';

export const migrations = [
  {
    up: migration_20261024_214659_initial.up,
    down: migration_20261024_214659_initial.down,
    name: '20261024_214659_initial',
  },
  {
    up: migration_20261025_080517_r2_storage.up,
    down: migration_20261025_080517_r2_storage.down,
    name: '20261025_080517_r2_storage',
  },
  {
    up: migration_20261025_094259_m3_pages.up,
    down: migration_20261025_094259_m3_pages.down,
    name: '20261025_094259_m3_pages'
  },
];
