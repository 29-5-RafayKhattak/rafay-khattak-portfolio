import type { CollectionConfig } from "payload";

import {
  revalidateCollection,
  revalidateCollectionDelete,
} from "@/payload/hooks/revalidate";
import { authenticated, adminOnly, publicRead } from "@/payload/access";
import { caseStudyField } from "@/payload/fields/caseStudy";
import { orderField } from "@/payload/fields/order";
import { stringList } from "@/payload/fields/shapes";

const VISUALS = [
  "system",
  "modules",
  "relations",
  "pipeline",
  "grid",
  "orbit",
  "scan",
  "strata",
  "flow",
  "edge",
  "topology",
] as const;

/**
 * -----------------------------------------------------------------------------
 * PROJECTS
 * -----------------------------------------------------------------------------
 * The single source for the homepage sequence AND the case-study pages. A
 * project with `caseStudy.hasCaseStudy` set gets a page at /work/<slug>; one
 * without simply appears in the sequence.
 *
 * `order` is what the two-digit index and the work sequence both follow, so
 * reordering the run is one number rather than an edit in two places.
 *
 * The palette is per-project and deliberately constrained to the same muted,
 * mid-dark register as the rest of the site — the section gains variety without
 * turning into a different design language. `warm` is the only value that
 * carries hue at small sizes; `accent` is the near-black used for full-bleed
 * bands and is indistinguishable from ink as small type.
 * -----------------------------------------------------------------------------
 */
export const Projects: CollectionConfig = {
  slug: "projects",
  defaultSort: "order",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["index", "name", "category", "year", "order"],
    group: "Work",
  },
  access: {
    read: publicRead,
    create: authenticated,
    update: authenticated,
    delete: adminOnly,
  },
  hooks: {
    afterChange: [revalidateCollection],
    afterDelete: [revalidateCollectionDelete],
  },
  fields: [
    orderField,
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: { description: "URL segment. Changing it breaks existing links." },
    },
    { name: "index", type: "text", required: true, admin: { description: "Two-digit index rendered as oversized type." } },
    { name: "name", type: "text", required: true },
    { name: "category", type: "text", required: true },
    { name: "company", type: "text", admin: { description: "Employer or client, where the work was commercial." } },
    { name: "year", type: "text", required: true },
    { name: "description", type: "textarea", required: true, admin: { description: "The one-sentence thesis, used in the homepage sequence." } },
    {
      name: "visual",
      type: "select",
      required: true,
      options: VISUALS.map((v) => ({ label: v, value: v })),
      admin: { description: "Which generated visual represents the project." },
    },
    {
      name: "accent",
      type: "text",
      required: true,
      admin: { description: "Hex. The project's mark colour in the homepage sequence." },
    },
    stringList("tags", "Short stack pills on the homepage card."),
    {
      name: "palette",
      type: "group",
      admin: { description: "Optional. Without one the project uses the portfolio palette." },
      fields: [
        { name: "enabled", type: "checkbox", defaultValue: false },
        { name: "accent", type: "text", admin: { description: "Deep tone for full-bleed bands. Near-black." } },
        { name: "accentDeep", type: "text" },
        { name: "muted", type: "text" },
        { name: "surface", type: "text" },
        { name: "surfaceAlt", type: "text" },
        { name: "surfaceSoft", type: "text" },
        { name: "warm", type: "text", admin: { description: "Mid-tone. The only palette value that carries hue at small sizes." } },
        { name: "cream", type: "text" },
      ],
    },
    caseStudyField,
  ],
};
