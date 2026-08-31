import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * The LinkedIn vanity slug changed. Same profile — the id suffix is identical —
 * but the old path no longer resolves.
 *
 * WHY THIS IS A MIGRATION AND NOT A SEED EDIT
 * Socials are a CMS collection, and the seed deliberately refuses to touch a
 * populated database: that guard is what stops every deploy reverting content
 * edited in the admin. So correcting `src/data/portfolio.ts` fixes a fresh
 * install and nothing else, and the live links — seven of them across the
 * navigation, hero rail, footer and mobile menu, plus the `sameAs` array in the
 * Person JSON-LD — would keep pointing at a dead URL until somebody opened the
 * admin. A migration is the one mechanism that ships a data correction with the
 * code that describes it.
 *
 * MATCHED ON THE OLD VALUE, NOT THE ROW
 * If the row has already been corrected by hand before this runs, the WHERE
 * clause matches nothing and the migration is a no-op. That is the point: it
 * repairs one known-stale value rather than asserting what the field must say,
 * so it can never overwrite a later edit made in the admin.
 */
const OLD_HREF = 'https://www.linkedin.com/in/muhammad-rafay-mir-khattak-a709ab277'
const NEW_HREF = 'https://www.linkedin.com/in/rafay-khattak-a709ab277'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "socials"
    SET "href" = ${NEW_HREF}, "updated_at" = now()
    WHERE "href" = ${OLD_HREF};`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "socials"
    SET "href" = ${OLD_HREF}, "updated_at" = now()
    WHERE "href" = ${NEW_HREF};`)
}
