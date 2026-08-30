import type { Field } from "payload";

/**
 * -----------------------------------------------------------------------------
 * REPEATED FIELD SHAPES
 * -----------------------------------------------------------------------------
 * A case study is mostly the same four shapes used over and over: a list of
 * strings, a list of titled string groups, a list of status rows, and a list of
 * diagram layers. Written inline they would be roughly four hundred lines of
 * near-identical config in one file, which is where schema drift starts — two
 * copies of "a list of strings" that quietly disagree about whether the value
 * is required.
 *
 * WHY ARRAYS OF { value } RATHER THAN A JSON FIELD
 * Postgres stores a Payload array as a real child table, so a list stays
 * queryable, migratable and diffable. A JSON blob would be one column that
 * nothing can validate and every edit rewrites wholesale.
 * -----------------------------------------------------------------------------
 */

/** A plain ordered list of strings. */
export const stringList = (
  name: string,
  description?: string,
  required = false,
): Field => ({
  name,
  type: "array",
  required,
  admin: description ? { description } : undefined,
  fields: [{ name: "value", type: "text", required: true }],
});

/** Titled groups of short labels — technical notes, metrics, capabilities. */
export const labelledGroups = (name: string, description?: string): Field => ({
  name,
  type: "array",
  admin: description ? { description } : undefined,
  fields: [
    { name: "title", type: "text", required: true },
    stringList("items", undefined, true),
  ],
});

/**
 * Rows that state whether something exists.
 *
 * `available` is the load-bearing field: a status list that renders planned
 * work identically to delivered work is the easiest way for a page to read as
 * finished when it is not.
 */
export const statusRows = (name: string, description?: string): Field => ({
  name,
  type: "array",
  admin: description ? { description } : undefined,
  fields: [
    { name: "label", type: "text", required: true },
    { name: "value", type: "text", required: true },
    {
      name: "available",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Ticked means delivered. Unticked renders as outstanding." },
    },
  ],
});

/** One horizontal band of an architecture diagram. */
export const layerRows = (name: string, description?: string): Field => ({
  name,
  type: "array",
  admin: description ? { description } : undefined,
  fields: [
    {
      name: "layerId",
      type: "text",
      required: true,
      admin: { description: "Stable key for this layer, unique within the diagram." },
    },
    { name: "label", type: "text", required: true },
    { name: "note", type: "text" },
  ],
});

/** A labelled fact — used by hero metadata and the highlights strip. */
export const labelValueRows = (name: string, description?: string): Field => ({
  name,
  type: "array",
  admin: description ? { description } : undefined,
  fields: [
    { name: "label", type: "text", required: true },
    { name: "value", type: "text", required: true },
  ],
});
