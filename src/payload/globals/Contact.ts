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
      name: "phone",
      type: "text",
      admin: {
        description:
          "Optional. Shown beside the email in the contact section. Store it in the form it should be read in — the tel: link strips the spacing itself.",
      },
    },
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
