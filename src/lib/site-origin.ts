/**
 * -----------------------------------------------------------------------------
 * THE CANONICAL ORIGIN
 * -----------------------------------------------------------------------------
 * Scheme and host, no trailing slash and no path. Everything that needs to say
 * where this site lives resolves to this one string:
 *
 *   metadataBase, and through it every canonical, Open Graph and Twitter URL
 *   the sitemap's absolute entries
 *   the robots Host and Sitemap lines
 *   the permanent redirect off the Railway-generated origin
 *
 * WHY THIS IS ITS OWN FILE
 * It began life on `site.url` in `src/data/portfolio.ts`, which is the right
 * place for it to be *read* from and the wrong place for it to be *defined*.
 * `next.config.ts` is transpiled by Next before any path alias exists, so it
 * cannot import a module that uses `@/` — and `portfolio.ts` re-exports types
 * from `@/data/projects`, which is enough to break the config load outright.
 *
 * So the value lives here, in a module with no imports at all, and both worlds
 * reach it: application code through `site.url`, and the build config through a
 * relative path. Moving the site remains a one-line edit, and the redirect can
 * never point somewhere the metadata disagrees with.
 * -----------------------------------------------------------------------------
 */
export const SITE_ORIGIN = "https://rafayktk.com";
