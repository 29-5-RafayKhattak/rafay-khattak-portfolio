/**
 * -----------------------------------------------------------------------------
 * SHAPE TRANSLATION — database row to presentation contract
 * -----------------------------------------------------------------------------
 * Payload stores a list of strings as a child table of `{ id, value }` rows and
 * reserves `id` on every row, so a stored diagram layer is `{ layerId, label }`
 * where the contract wants `{ id, label }`. This module is the only place that
 * knows about that difference.
 *
 * That boundary is the whole point of the architecture: components are written
 * against `src/data`'s types and never see a Payload document, so the CMS can
 * change shape without a single component changing with it.
 * -----------------------------------------------------------------------------
 */

type ValueRow = { value?: string | null } | null;

/** [{ value }] -> string[], dropping empties rather than emitting blanks. */
export const unlist = (rows?: ValueRow[] | null): string[] =>
  (rows ?? [])
    .map((r) => r?.value)
    .filter((v): v is string => typeof v === "string" && v.length > 0);

/** Same, but returns undefined for an empty list so optional fields stay absent. */
export const unlistOptional = (rows?: ValueRow[] | null): string[] | undefined => {
  const out = unlist(rows);
  return out.length ? out : undefined;
};

type GroupRow = { title?: string | null; items?: ValueRow[] | null } | null;

/** Titled groups of labels. */
export const ungroup = (rows?: GroupRow[] | null) => {
  const out = (rows ?? [])
    .filter((r): r is NonNullable<GroupRow> => Boolean(r?.title))
    .map((r) => ({ title: r.title as string, items: unlist(r.items) }));
  return out.length ? out : undefined;
};

type LayerRow = {
  layerId?: string | null;
  label?: string | null;
  note?: string | null;
} | null;

/** `layerId` is the stored name; the contract calls it `id`. */
export const unlayer = (rows?: LayerRow[] | null) => {
  const out = (rows ?? [])
    .filter((r): r is NonNullable<LayerRow> => Boolean(r?.layerId && r?.label))
    .map((r) => ({
      id: r.layerId as string,
      label: r.label as string,
      ...(r.note ? { note: r.note } : {}),
    }));
  return out.length ? out : undefined;
};

type StatusRow = {
  label?: string | null;
  value?: string | null;
  available?: boolean | null;
} | null;

export const unstatus = (rows?: StatusRow[] | null) => {
  const out = (rows ?? [])
    .filter((r): r is NonNullable<StatusRow> => Boolean(r?.label && r?.value))
    .map((r) => ({
      label: r.label as string,
      value: r.value as string,
      available: Boolean(r.available),
    }));
  return out.length ? out : undefined;
};

type LabelValueRow = { label?: string | null; value?: string | null } | null;

export const unpairs = (rows?: LabelValueRow[] | null) => {
  const out = (rows ?? [])
    .filter((r): r is NonNullable<LabelValueRow> => Boolean(r?.label && r?.value))
    .map((r) => ({ label: r.label as string, value: r.value as string }));
  return out.length ? out : undefined;
};

/** Drops a group whose every field came back empty, so `undefined` means absent. */
export const presentOr = <T extends object>(value: T | null | undefined): T | undefined => {
  if (!value) return undefined;
  const meaningful = Object.values(value).some((v) =>
    Array.isArray(v) ? v.length > 0 : v !== null && v !== undefined && v !== "",
  );
  return meaningful ? value : undefined;
};
