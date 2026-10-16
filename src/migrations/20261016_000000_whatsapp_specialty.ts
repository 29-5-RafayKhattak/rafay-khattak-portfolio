import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import type { RequiredDataFromCollectionSlug } from "payload";
import snapshot from "./content/20261016_whatsapp.json";

/** Frozen content keeps this migration independent of future seed edits. */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const count = await payload.count({ collection: "projects", req });
  // An empty install is populated by the normal seed after migrations.
  if (count.totalDocs === 0) return;

  const existing = await payload.find({
    collection: "projects", where: { slug: { equals: snapshot.project.slug } }, limit: 1, req,
  });
  if (!existing.docs.length) {
    await payload.create({
      collection: "projects",
      data: snapshot.project as RequiredDataFromCollectionSlug<"projects">,
      req,
    });
  }

  const { changes } = snapshot;
  const settings = await payload.findGlobal({ slug: "settings", req });
  const navigation = settings.navigation ?? [];
  const hasServices = navigation.some((item) => item.href === "#services");
  const nextNavigation = [...navigation];
  if (!hasServices) {
    const workIndex = nextNavigation.findIndex((item) => item.href === "#work");
    nextNavigation.splice(workIndex === -1 ? nextNavigation.length : workIndex + 1, 0, {
      label: "Services", href: "#services",
    });
  }
  // Replace only the known old copy; preserve subsequent CMS edits.
  await payload.updateGlobal({
    slug: "settings", req,
    data: {
      ...(settings.person.intro === changes.intro.before
        ? { person: { ...settings.person, intro: changes.intro.after } } : {}),
      ...(settings.site.description === changes.description.before
        ? { site: { ...settings.site, description: changes.description.after } } : {}),
      ...(!hasServices ? { navigation: nextNavigation } : {}),
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
  for (const { before, after } of changes.stats) {
    const { docs } = await payload.find({
      collection: "stats", req,
      where: { and: [
        { label: { equals: before.label } },
        { value: { equals: before.value } },
        { caption: { equals: before.caption } },
      ] },
    });
    for (const stat of docs) {
      await payload.update({ collection: "stats", id: stat.id, data: after, req });
    }
  }
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  // Content may have been edited after publication. A code rollback must not
  // delete the project or restore stale copy over the owner's later changes.
  payload.logger.info("WhatsApp content retained on rollback; no schema changes to undo.");
}
