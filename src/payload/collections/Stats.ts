import type { CollectionConfig } from "payload";

import {
  revalidateCollection,
  revalidateCollectionDelete,
} from "@/payload/hooks/revalidate";
import { authenticated, adminOnly, publicRead } from "@/payload/access";
import { orderField } from "@/payload/fields/order";

/**
 * The "By the numbers" run.
 *
 * Every figure here is meant to be checkable against something — the previous
 * hardcoded set claimed eight AI systems in production against none, and 24
 * projects against six. `source` exists so the claim and its evidence travel
 * together: it is not rendered, it is there so the next person to edit a number
 * can see where it came from.
 */
export const Stats: CollectionConfig = {
  slug: "stats",
  defaultSort: "order",
  admin: {
    useAsTitle: "label",
    defaultColumns: ["value", "label", "order"],
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
    { name: "value", type: "text", required: true },
    { name: "label", type: "text", required: true },
    { name: "caption", type: "textarea", required: true },
    {
      name: "source",
      type: "text",
      admin: {
        position: "sidebar",
        description:
          "Where this figure can be verified. Internal note — never rendered.",
      },
    },
  ],
};
