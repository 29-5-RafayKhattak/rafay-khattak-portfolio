import { revalidateTag } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from "payload";

import { TAG_FOR } from "@/lib/cms/tags";

/**
 * Publishing invalidates the cache entry the change actually touched.
 *
 * Without this the site would serve whatever was cached when a page was first
 * requested, and an editor would have no way to tell whether their change had
 * landed short of waiting for a deploy. Tagging per content area means editing
 * one project does not discard the settings, the education timeline or the
 * media alongside it.
 *
 * Media invalidates the projects tag: an image is referenced by case studies,
 * so replacing one has to reach the pages that render it.
 */
const invalidate = (slug: string) => {
  const tag = TAG_FOR[slug];
  if (!tag) return;

  /*
   * `revalidateTag` needs Next's request context and throws
   * "static generation store missing" without one.
   *
   * Payload runs plenty of places Next is not: the seed script, migrations, any
   * CLI write. There is no cache to invalidate in those contexts, so failing is
   * pointless — but it is not harmless: the seed runs as a pre-deploy step, and
   * an exception here would fail the step and block the deployment. Hence the
   * catch: no request context simply means nothing to invalidate.
   *
   * `"max"` expires the entry outright rather than easing it out on a profile —
   * a publish should be visible on the next request, not eventually.
   */
  try {
    revalidateTag(tag, "max");
  } catch {
    // Outside a Next request. Nothing is cached here, so nothing to do.
  }
};

export const revalidateCollection: CollectionAfterChangeHook = ({
  collection,
  doc,
}) => {
  invalidate(collection.slug);
  return doc;
};

export const revalidateCollectionDelete: CollectionAfterDeleteHook = ({
  collection,
  doc,
}) => {
  invalidate(collection.slug);
  return doc;
};

export const revalidateGlobal: GlobalAfterChangeHook = ({ global, doc }) => {
  invalidate(global.slug);
  return doc;
};
