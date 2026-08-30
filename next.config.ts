import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

/*
 * `withPayload` marks the CMS's server-only dependencies as external so they
 * are not traced into the client or edge bundles. Without it the build fails
 * resolving `drizzle-kit`, which the Postgres adapter loads at runtime for
 * migrations and which has no business being bundled at all.
 */
export default withPayload(nextConfig, { devBundleServerPackages: false });
