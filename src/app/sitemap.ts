import type { MetadataRoute } from "next";

import { getProjects, getSettings } from "@/lib/cms/queries";

/**
 * Rendered on demand, never at build — the same constraint the pages are under.
 *
 * The deployment compiles without a database (Railway does not expose private
 * networking to a build), so a sitemap evaluated at build time would fail the
 * build outright. It would also freeze the list of case studies at whatever
 * was published when the image was compiled, which is exactly the thing this
 * file exists to keep current.
 */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, projects] = await Promise.all([getSettings(), getProjects()]);

  const origin = settings.site.url;
  /*
   * A sitemap has to carry absolute URLs — there is no `metadataBase` to
   * resolve against here. With no origin there is no honest sitemap to emit,
   * and an empty one is better than a set of URLs pointing at a host that is
   * not serving the site.
   */
  if (!origin) return [];

  const lastModified = new Date();

  return [
    {
      url: origin,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    // Only projects with a published case study resolve; the rest 404, and a
    // sitemap that lists them would be telling crawlers to fetch dead routes.
    ...projects
      .filter((project) => project.caseStudy)
      .map((project) => ({
        url: `${origin}/work/${project.slug}`,
        lastModified,
        changeFrequency: "yearly" as const,
        priority: 0.8,
      })),
  ];
}
