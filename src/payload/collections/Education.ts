import type { CollectionConfig } from "payload";

import {
  revalidateCollection,
  revalidateCollectionDelete,
} from "@/payload/hooks/revalidate";
import { authenticated, adminOnly, publicRead } from "@/payload/access";
import { orderField } from "@/payload/fields/order";
import { stringList } from "@/payload/fields/shapes";

/**
 * The education timeline, newest first.
 *
 * WHAT THE SCHEMA REFUSES TO STORE
 * There is no GPA, no start or graduation date, and no total number of
 * semesters — none of those were supplied, and a nullable column invites the
 * next editor to fill it with an estimate. `semestersCompleted` stands alone
 * on purpose: the track it drives shows what is finished and then an open
 * marker, because implying a remaining count needs a total nobody has stated.
 */
export const Education: CollectionConfig = {
  slug: "education",
  defaultSort: "order",
  admin: {
    useAsTitle: "qualification",
    defaultColumns: ["number", "qualification", "tag", "order"],
    group: "Content",
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
    { name: "number", type: "text", required: true, admin: { description: "Two-digit index, e.g. 01." } },
    { name: "tag", type: "text", required: true, admin: { description: "Small qualifier beside the index." } },
    { name: "qualification", type: "text", required: true },
    { name: "institution", type: "text" },
    { name: "institutionShort", type: "text", admin: { description: "Abbreviation, e.g. FAST-NUCES." } },
    { name: "description", type: "textarea", required: true },
    { name: "status", type: "text" },
    { name: "progress", type: "text" },
    {
      name: "semestersCompleted",
      type: "number",
      admin: { description: "Completed only. There is deliberately no total." },
    },
    {
      name: "display",
      type: "group",
      admin: { description: "Oversized treatment — only where the qualification itself is set large." },
      fields: [
        { name: "lead", type: "text" },
        { name: "outline", type: "text" },
        { name: "solid", type: "text" },
      ],
    },
    stringList("grades", "Individual grades, revealed in order."),
    {
      name: "gradeTally",
      type: "group",
      admin: { description: "Aggregate, where naming every grade would be noise." },
      fields: [
        { name: "aStars", type: "number" },
        { name: "aGrades", type: "number" },
      ],
    },
    { name: "achievement", type: "text" },
  ],
};
