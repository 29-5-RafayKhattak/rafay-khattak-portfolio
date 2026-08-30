import type { CollectionConfig } from "payload";

import {
  revalidateCollection,
  revalidateCollectionDelete,
} from "@/payload/hooks/revalidate";
import { authenticated, adminOnly, publicRead } from "@/payload/access";
import { orderField } from "@/payload/fields/order";

export const Experience: CollectionConfig = {
  slug: "experience",
  defaultSort: "order",
  admin: {
    useAsTitle: "role",
    defaultColumns: ["role", "company", "year", "order"],
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
    { name: "role", type: "text", required: true },
    { name: "company", type: "text", required: true },
    {
      name: "year",
      type: "text",
      required: true,
      admin: { description: "The oversized figure on the row, e.g. 2026." },
    },
    {
      name: "period",
      type: "text",
      required: true,
      admin: { description: "Human-readable span, e.g. Jun 2026 — Present." },
    },
    {
      name: "type",
      type: "text",
      required: true,
      admin: { description: "Full-time · Part-time · Internship. Required — the row renders it beside the company." },
    },
    { name: "location", type: "text" },
    { name: "summary", type: "textarea" },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      admin: { description: "Company mark. Resolved from the media library." },
    },
    {
      name: "skills",
      type: "array",
      fields: [{ name: "value", type: "text", required: true }],
    },
  ],
};
