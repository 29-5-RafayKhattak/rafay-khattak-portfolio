import type { Field } from "payload";

/**
 * Explicit ordering.
 *
 * Sequence is content here — the work run, the education timeline, the metrics
 * sequence — so it belongs in the row rather than being inferred from creation
 * time, which reorders itself the moment a record is re-created.
 */
export const orderField: Field = {
  name: "order",
  type: "number",
  required: true,
  defaultValue: 0,
  admin: {
    position: "sidebar",
    description: "Lower numbers come first.",
  },
};
