import type { CollectionConfig } from "payload";

import {
  revalidateCollection,
  revalidateCollectionDelete,
} from "@/payload/hooks/revalidate";
import { authenticated, adminOnly, publicRead } from "@/payload/access";
import { orderField } from "@/payload/fields/order";

/**
 * Social links. `icon` is a fixed set rather than free text because each value
 * maps to a component in the icon map — an unrecognised string would render
 * nothing, silently.
 */
export const Socials: CollectionConfig = {
  slug: "socials",
  defaultSort: "order",
  admin: {
    useAsTitle: "label",
    defaultColumns: ["label", "icon", "href", "order"],
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
    { name: "label", type: "text", required: true },
    {
      name: "href",
      type: "text",
      required: true,
      admin: {
        description:
          "Full URL, or a mailto: address. An http(s) link opens in a new tab automatically.",
      },
    },
    {
      name: "icon",
      type: "select",
      required: true,
      options: [
        { label: "GitHub", value: "github" },
        { label: "LinkedIn", value: "linkedin" },
        { label: "Email", value: "mail" },
      ],
    },
  ],
};
