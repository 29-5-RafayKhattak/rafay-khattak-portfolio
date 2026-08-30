import type { GlobalConfig } from "payload";

import { revalidateGlobal } from "@/payload/hooks/revalidate";
import { authenticated, publicRead } from "@/payload/access";

/**
 * Identity and site-wide values.
 *
 * `site.url` is the one value that turns absolute Open Graph and canonical URLs
 * on. It is left empty rather than pre-filled with a guess: a placeholder does
 * not stay inert, it makes every social and canonical URL resolve against a
 * host that is not serving the site.
 */
export const Settings: GlobalConfig = {
  slug: "settings",
  admin: { group: "Settings" },
  access: { read: publicRead, update: authenticated },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: "person",
      type: "group",
      fields: [
        { name: "firstName", type: "text", required: true },
        { name: "lastName", type: "text", required: true },
        { name: "title", type: "text", required: true, admin: { description: "Long form, e.g. AI ENGINEER · SOFTWARE DEVELOPER." } },
        { name: "titleShort", type: "text", required: true },
        { name: "intro", type: "textarea", required: true },
        { name: "availability", type: "text", required: true },
        { name: "location", type: "text" },
      ],
    },
    {
      name: "portrait",
      type: "group",
      fields: [
        { name: "cutout", type: "upload", relationTo: "media", admin: { description: "Transparent cutout — typography sits behind it." } },
        { name: "original", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "site",
      type: "group",
      fields: [
        { name: "description", type: "textarea", required: true },
        { name: "builtBy", type: "text" },
        {
          name: "url",
          type: "text",
          admin: {
            description:
              "Production origin, no trailing path. Leave empty until the real deployed domain is known — a wrong absolute URL is worse than none.",
          },
        },
      ],
    },
    {
      name: "sectionLabels",
      type: "group",
      admin: { description: "The eyebrow that opens each homepage section." },
      fields: [
        { name: "about", type: "text", required: true },
        { name: "stats", type: "text", required: true },
        { name: "work", type: "text", required: true },
        { name: "experience", type: "text", required: true },
        { name: "education", type: "text", required: true },
        { name: "technologies", type: "text", required: true },
        { name: "contact", type: "text", required: true },
      ],
    },
    {
      name: "horizontalWords",
      type: "array",
      admin: {
        description:
          "The words that travel horizontally in the statement scene, in order.",
      },
      fields: [{ name: "value", type: "text", required: true }],
    },
    {
      name: "navigation",
      type: "array",
      admin: { description: "Primary navigation, in order." },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true, admin: { description: "Anchor, e.g. #work." } },
      ],
    },
  ],
};
