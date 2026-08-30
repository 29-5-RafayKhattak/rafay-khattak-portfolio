import type { CollectionConfig } from "payload";

import {
  revalidateCollection,
  revalidateCollectionDelete,
} from "@/payload/hooks/revalidate";
import { authenticated, adminOnly, publicRead } from "@/payload/access";

/**
 * A normalized taxonomy for the media library, so "what kind of asset is this"
 * is a row rather than a free-text string retyped on every upload. Keeping it
 * a collection means the vocabulary can grow without a schema change.
 */
export const MediaKinds: CollectionConfig = {
  slug: "media-kinds",
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "slug"],
    group: "Media",
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
    { name: "label", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { description: "Stable identifier, e.g. portrait, logo, screenshot." },
    },
    { name: "description", type: "textarea" },
  ],
};
