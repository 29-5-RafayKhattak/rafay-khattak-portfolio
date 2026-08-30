import type { GlobalConfig } from "payload";

import { revalidateGlobal } from "@/payload/hooks/revalidate";
import { authenticated, publicRead } from "@/payload/access";

export const About: GlobalConfig = {
  slug: "about",
  admin: { group: "Content" },
  access: { read: publicRead, update: authenticated },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      name: "statement",
      type: "array",
      admin: { description: "Rendered one line at a time as the section scrolls." },
      fields: [
        { name: "text", type: "text", required: true },
        { name: "accent", type: "checkbox", defaultValue: false },
      ],
    },
    {
      name: "paragraph",
      type: "textarea",
      required: true,
      admin: {
        description:
          "Written from confirmed facts only — no years-of-experience figure, no project count, no claim about anything running in production.",
      },
    },
  ],
};
