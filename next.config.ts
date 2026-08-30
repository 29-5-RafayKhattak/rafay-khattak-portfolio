import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
     * Media is served by Payload from /api/media/file/<name>, and its URLs
     * carry a `?prefix=` query. next/image refuses a local source with an
     * unconfigured query string outright — it renders nothing and throws — so
     * the prefix this app sets has to be declared here. The empty-search entry
     * covers assets stored without a prefix.
     */
    localPatterns: [
      { pathname: "/api/media/**", search: "?prefix=media" },
      { pathname: "/api/media/**", search: "" },
    ],
  },
};

/*
 * `withPayload` marks the CMS's server-only dependencies as external so they
 * are not traced into the client or edge bundles. Without it the build fails
 * resolving `drizzle-kit`, which the Postgres adapter loads at runtime for
 * migrations and which has no business being bundled at all.
 */
export default withPayload(nextConfig, { devBundleServerPackages: false });
