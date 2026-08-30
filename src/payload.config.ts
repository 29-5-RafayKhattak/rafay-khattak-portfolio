import path from "path";
import { fileURLToPath } from "url";

import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Education } from "@/payload/collections/Education";
import { Experience } from "@/payload/collections/Experience";
import { Media } from "@/payload/collections/Media";
import { MediaKinds } from "@/payload/collections/MediaKinds";
import { Projects } from "@/payload/collections/Projects";
import { Socials } from "@/payload/collections/Socials";
import { Stats } from "@/payload/collections/Stats";
import { Technologies } from "@/payload/collections/Technologies";
import { Users } from "@/payload/collections/Users";
import { About } from "@/payload/globals/About";
import { Contact } from "@/payload/globals/Contact";
import { EducationIntro } from "@/payload/globals/EducationIntro";
import { Settings } from "@/payload/globals/Settings";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * -----------------------------------------------------------------------------
 * PAYLOAD CONFIG
 * -----------------------------------------------------------------------------
 * Self-hosted inside the same Next application rather than as a separate
 * service, so the site and its administration share one deployment, one type
 * system and one build.
 *
 * SCHEMA IS MIGRATION-DRIVEN
 * `push` is disabled in every environment including development. A schema that
 * auto-syncs is a schema with no history: nothing to review, nothing to roll
 * back, and no way to tell whether production matches the code. Railway applies
 * the committed migrations as a pre-deploy step, which keeps deployment
 * fail-closed without coupling the build to a database.
 *
 * OBJECT STORAGE IS OPTIONAL AT BUILD TIME
 * The S3 plugin only engages when the bucket variables are present. Without
 * them Payload falls back to local disk, so a build — and a contributor with no
 * bucket credentials — still works.
 * -----------------------------------------------------------------------------
 */

const hasBucket = Boolean(
  process.env.S3_BUCKET &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY,
);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: "— Portfolio CMS",
    },
  },

  collections: [
    Projects,
    Experience,
    Education,
    Stats,
    Technologies,
    Socials,
    Media,
    MediaKinds,
    Users,
  ],

  globals: [Settings, About, Contact, EducationIntro],

  editor: lexicalEditor(),

  secret: process.env.PAYLOAD_SECRET || "",

  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI || "" },
    push: false,
    migrationDir: path.resolve(dirname, "migrations"),
  }),

  // Image derivatives are generated once at upload rather than per request.
  sharp,

  /*
   * The plugin is ALWAYS registered, and only its storage backend is
   * conditional.
   *
   * `alwaysInsertFields` keeps the `prefix` column in the schema whether or not
   * bucket credentials are present. Without it the generated migration depends
   * on which environment variables happened to be set when it was created — a
   * migration generated locally without a bucket omits the column, and every
   * upload in production then fails with `column "prefix" does not exist`. A
   * schema that changes shape based on ambient environment is not a schema.
   *
   * `enabled` is what actually switches the backend: with no credentials
   * Payload falls back to local disk, so a build and a contributor without
   * bucket access both still work.
   */
  plugins: [
    s3Storage({
      enabled: hasBucket,
      alwaysInsertFields: true,
      collections: { media: { prefix: "media" } },
      bucket: process.env.S3_BUCKET ?? "",
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || "auto",
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
        },
        /*
         * Railway buckets address objects by virtual host — `railway bucket
         * credentials` reports urlStyle: virtual-host. Path style is opt-in for
         * providers that need it.
         */
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
      },
    }),
  ],
});
