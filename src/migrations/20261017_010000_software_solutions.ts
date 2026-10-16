import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import changes from "./content/20261017_software_solutions.json";

/** Update known published copy without overwriting unrelated CMS edits. */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const count = await payload.count({ collection: "projects", req });
  if (count.totalDocs === 0) return;

  const settings = await payload.findGlobal({ slug: "settings", req });
  await payload.updateGlobal({
    slug: "settings", req,
    data: {
      ...(settings.person.intro === changes.intro.before
        ? { person: { ...settings.person, intro: changes.intro.after } } : {}),
      ...(settings.site.description === changes.description.before
        ? { site: { ...settings.site, description: changes.description.after } } : {}),
    },
  });
  const about = await payload.findGlobal({ slug: "about", req });
  if (about.paragraph === changes.about.before) {
    await payload.updateGlobal({ slug: "about", data: { paragraph: changes.about.after }, req });
  }
  const contact = await payload.findGlobal({ slug: "contact", req });
  if (contact.subline === changes.contact.before) {
    await payload.updateGlobal({ slug: "contact", data: { subline: changes.contact.after }, req });
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info("Software solutions content retained on rollback; no schema changes to undo.");
}
