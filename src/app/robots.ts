import type { MetadataRoute } from "next";

import { getSettings } from "@/lib/cms/queries";

/** Dynamic for the same reason as the sitemap: no database during the build. */
export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { site } = await getSettings();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        /*
         * The admin surface and the GraphQL endpoints, and nothing else.
         * Blocking `/api` wholesale would be the obvious line to write and the
         * wrong one: CMS media is served from `/api/media/...`, so it would
         * quietly withdraw every image on the site from image search.
         */
        disallow: ["/admin", "/api/graphql", "/api/graphql-playground"],
      },
    ],
    ...(site.url
      ? { sitemap: `${site.url}/sitemap.xml`, host: site.url }
      : {}),
  };
}
