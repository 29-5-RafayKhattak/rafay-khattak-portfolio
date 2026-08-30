import type { ServerFunctionClient } from "payload";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import React from "react";

import config from "@payload-config";
import { importMap } from "./admin/importMap.js";

import "@payloadcms/next/css";

/**
 * -----------------------------------------------------------------------------
 * CMS ROOT LAYOUT
 * -----------------------------------------------------------------------------
 * The admin owns its own <html> and <body>, which is why the public site had to
 * move into a (site) group and the application has no layout at app/ root. Next
 * only permits per-group root layouts when the top-level one is absent.
 *
 * Consequence worth knowing: nothing that must apply to the whole public site
 * belongs here, and the site's design system is deliberately not imported into
 * this route group — the admin is a tool, not a page of the portfolio.
 * -----------------------------------------------------------------------------
 */

type Args = { children: React.ReactNode };

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

export default function CmsRootLayout({ children }: Args) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
