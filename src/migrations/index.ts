import * as migration_20260830_101152_initial from './20260830_101152_initial';
import * as migration_20260830_105053_experience_type_required from './20260830_105053_experience_type_required';
import * as migration_20260830_105247_horizontal_words from './20260830_105247_horizontal_words';
import * as migration_20260830_114859_media_storage_prefix from './20260830_114859_media_storage_prefix';
import * as migration_20260901_000000_linkedin_vanity_url from './20260901_000000_linkedin_vanity_url';
import * as migration_20261016_000000_whatsapp_specialty from './20261016_000000_whatsapp_specialty';
import * as migration_20261017_000000_business_chatbots from './20261017_000000_business_chatbots';
import * as migration_20261017_010000_software_solutions from './20261017_010000_software_solutions';

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
  {
    up: migration_20260901_000000_linkedin_vanity_url.up,
    down: migration_20260901_000000_linkedin_vanity_url.down,
    name: '20260901_000000_linkedin_vanity_url',
  },
  {
    up: migration_20261016_000000_whatsapp_specialty.up,
    down: migration_20261016_000000_whatsapp_specialty.down,
    name: '20261016_000000_whatsapp_specialty',
  },
  {
    up: migration_20261017_000000_business_chatbots.up,
    down: migration_20261017_000000_business_chatbots.down,
    name: '20261017_000000_business_chatbots',
  },
  {
    up: migration_20261017_010000_software_solutions.up,
    down: migration_20261017_010000_software_solutions.down,
    name: '20261017_010000_software_solutions',
  },
];
