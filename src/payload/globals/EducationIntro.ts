import type { GlobalConfig } from "payload";

import { revalidateGlobal } from "@/payload/hooks/revalidate";
import { authenticated, publicRead } from "@/payload/access";

export const EducationIntro: GlobalConfig = {
  slug: "education-intro",
  admin: { group: "Content" },
  access: { read: publicRead, update: authenticated },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: "statement",
      type: "array",
      required: true,
      admin: { description: "Split so each line arrives on its own." },
      fields: [{ name: "value", type: "text", required: true }],
    },
    { name: "lede", type: "textarea", required: true },
  ],
};
