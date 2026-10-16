import type { MigrateDownArgs, MigrateUpArgs } from "@payloadcms/db-postgres";
import type { RequiredDataFromCollectionSlug } from "payload";
import snapshot from "./content/20261017_business_chatbots.json";

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const { docs } = await payload.find({ collection: "projects", sort: "order", pagination: false, req });
  const chatbot = docs.find((project) => project.slug === snapshot.slug);
  if (!chatbot) return; // Fresh installs use the updated seed.

  await payload.update({
    collection: "projects", id: chatbot.id, req,
    data: snapshot.project as Partial<RequiredDataFromCollectionSlug<"projects">>,
  });
  const ordered = [chatbot, ...docs.filter((project) => project.id !== chatbot.id)];
  for (const [order, project] of ordered.entries()) {
    const index = String(order + 1).padStart(2, "0");
    if (project.order !== order || project.index !== index) {
      await payload.update({ collection: "projects", id: project.id, data: { order, index }, req });
    }
  }

  const { changes } = snapshot;
  const about = await payload.findGlobal({ slug: "about", req });
  if (about.paragraph === changes.about.before) {
    await payload.updateGlobal({ slug: "about", data: { paragraph: changes.about.after }, req });
  }
  const settings = await payload.findGlobal({ slug: "settings", req });
  if (settings.site.description === changes.description.before) {
    await payload.updateGlobal({ slug: "settings", data: { site: { ...settings.site, description: changes.description.after } }, req });
  }
  await payload.update({
    collection: "stats", req,
    where: { and: [
      { label: { equals: changes.stat.before.label } },
      { caption: { equals: changes.stat.before.caption } },
    ] },
    data: changes.stat.after,
  });
}

export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.info("Business chatbot content retained on rollback; no schema changes to undo.");
}
