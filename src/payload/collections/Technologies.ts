import type { CollectionConfig } from "payload";

import {
  revalidateCollection,
  revalidateCollectionDelete,
} from "@/payload/hooks/revalidate";
import { authenticated, adminOnly, publicRead } from "@/payload/access";
import { orderField } from "@/payload/fields/order";

export const Technologies: CollectionConfig = {
  slug: "technologies",
  defaultSort: "order",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "order"],
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
  fields: [orderField, { name: "name", type: "text", required: true }],
};
