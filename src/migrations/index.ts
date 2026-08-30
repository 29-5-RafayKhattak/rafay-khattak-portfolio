import * as migration_20260830_101152_initial from './20260830_101152_initial';
import * as migration_20260830_105053_experience_type_required from './20260830_105053_experience_type_required';
import * as migration_20260830_105247_horizontal_words from './20260830_105247_horizontal_words';
import * as migration_20260830_114859_media_storage_prefix from './20260830_114859_media_storage_prefix';

export const migrations = [
  {
    up: migration_20260830_101152_initial.up,
    down: migration_20260830_101152_initial.down,
    name: '20260830_101152_initial',
  },
  {
    up: migration_20260830_105053_experience_type_required.up,
    down: migration_20260830_105053_experience_type_required.down,
    name: '20260830_105053_experience_type_required',
  },
  {
    up: migration_20260830_105247_horizontal_words.up,
    down: migration_20260830_105247_horizontal_words.down,
    name: '20260830_105247_horizontal_words',
  },
  {
    up: migration_20260830_114859_media_storage_prefix.up,
    down: migration_20260830_114859_media_storage_prefix.down,
    name: '20260830_114859_media_storage_prefix'
  },
];
