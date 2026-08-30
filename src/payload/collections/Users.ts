import type { CollectionConfig } from "payload";

import { adminOnly, adminOnlyField, selfOrAdmin } from "@/payload/access";

/**
 * Admin accounts. Payload owns authentication, password hashing, lockout and
 * sessions — none of that is reimplemented here.
 *
 * `role` is deliberately not editable by the account that holds it: an editor
 * who can promote themselves to admin is not a role boundary, it is a
 * suggestion.
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name", "role"],
    group: "Administration",
  },
  access: {
    read: selfOrAdmin,
    create: adminOnly,
    update: selfOrAdmin,
    delete: adminOnly,
  },
  fields: [
    { name: "name", type: "text" },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      access: { update: adminOnlyField },
    },
  ],
};
