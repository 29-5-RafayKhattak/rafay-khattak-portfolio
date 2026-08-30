import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

import { SITE_ORIGIN } from "./src/lib/site-origin";

/**
 * The Railway-generated origin, which still resolves and still serves the app.
 * Named exactly once, here, because this is the only thing in the codebase that
 * has any reason to know it exists — nothing renders it, links to it, or reads
 * it. The canonical origin is NOT repeated: it is imported from the same
 * constant `site.url`, the canonicals, the sitemap and robots all derive from,
 * so the redirect and the metadata can never disagree.
 *
 * Railway has no domain-level redirect: `railway domain` only creates, lists
 * and deletes, and the IaC schema exposes nothing either. Both domains are
 * attached to the same service on the same port, so the only place that can
 * tell them apart is the application, and the cheapest place to do it is here
 * — a config redirect is matched before any React runs, which a middleware
 * would not be.
 */
const LEGACY_ORIGIN_HOST = "rafay-khattak-portfolio-production.up.railway.app";

const nextConfig: NextConfig = {
  /*
   * One permanent redirect, host-matched.
   *
   * `permanent: true` emits 308 rather than 301 — Next uses it precisely so
   * the request method survives the hop, where a 301 lets browsers rewrite a
   * POST into a GET.
   *
   * `/:path*` carries the whole path, including the empty one, so the homepage
   * and `/work/<slug>` are the same rule. Query strings are appended by Next
   * automatically and must not be named in the destination.
   *
   * It cannot loop: the rule only fires when the Host is the legacy origin,
   * and the destination is a different host, so the redirected request fails
   * the `has` match. Requests already arriving at the canonical domain — and
   * localhost in development — never match it at all.
   */
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: LEGACY_ORIGIN_HOST }],
        destination: `${SITE_ORIGIN}/:path*`,
        permanent: true,
      },
    ];
  },

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
