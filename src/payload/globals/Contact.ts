import type { GlobalConfig } from "payload";

import { revalidateGlobal } from "@/payload/hooks/revalidate";
import { authenticated, publicRead } from "@/payload/access";

export const Contact: GlobalConfig = {
  slug: "contact",
  admin: { group: "Content" },
  access: { read: publicRead, update: authenticated },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    { name: "email", type: "email", required: true },
    {
      name: "headline",
      type: "array",
      required: true,
      admin: { description: "One entry per display line." },
      fields: [{ name: "value", type: "text", required: true }],
    },
    { name: "subline", type: "text", required: true },
    { name: "sublineAccent", type: "text", required: true },
    { name: "cta", type: "text", required: true },
  ],
};
