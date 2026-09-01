import * as migration_20260830_101152_initial from './20260830_101152_initial';
import * as migration_20260830_105053_experience_type_required from './20260830_105053_experience_type_required';
import * as migration_20260830_105247_horizontal_words from './20260830_105247_horizontal_words';
import * as migration_20260830_114859_media_storage_prefix from './20260830_114859_media_storage_prefix';
import * as migration_20260901_000000_linkedin_vanity_url from './20260901_000000_linkedin_vanity_url';
import * as migration_20260901_114931_contact_phone from './20260901_114931_contact_phone';

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
    name: '20260830_114859_media_storage_prefix',
  },
  {
    up: migration_20260901_000000_linkedin_vanity_url.up,
    down: migration_20260901_000000_linkedin_vanity_url.down,
    name: '20260901_000000_linkedin_vanity_url',
  },
  {
    up: migration_20260901_114931_contact_phone.up,
    down: migration_20260901_114931_contact_phone.down,
    name: '20260901_114931_contact_phone'
  },
];
