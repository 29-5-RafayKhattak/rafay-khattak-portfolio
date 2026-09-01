import type { SocialLink } from "@/data/portfolio";
import type { SiteSettings } from "@/lib/cms/content";
import { SITE_ORIGIN } from "@/lib/site-origin";

/**
 * -----------------------------------------------------------------------------
 * SEARCH SURFACES
 * -----------------------------------------------------------------------------
 * Everything a crawler or a social card reads, and nothing a visitor sees.
 *
 * WHY THE NAME IS SPELLED TWICE
 * `person.fullName` is "RAFAY KHATTAK" and must stay that way: the hero, the
 * footer and the mobile menu set it as display type, and its own contract says
 * it is never re-cased. A `<title>` is not display type. All-capitals in a
 * search result reads as shouting, and Google will frequently rewrite it — at
 * which point the title is out of anyone's hands. So the metadata layer uses
 * the same name in its ordinary written form, which is how it already appears
 * in `site.builtBy` and the portrait's alt text.
 * -----------------------------------------------------------------------------
 */
export const SEARCH_NAME = "Rafay Khattak";

/**
 * The social card, named once.
 *
 * It lives in `public/` and is referenced explicitly rather than through the
 * `opengraph-image` file convention. The convention is the nicer API and it
 * works on the homepage, but it did not reach `/work/[slug]`: that route
 * defines its own `openGraph` block for the per-project title and URL, and the
 * file-derived image did not survive the merge. An explicit reference behaves
 * identically on every route, which for the one asset every share preview
 * depends on is worth more than the automation.
 *
 * Relative on purpose — `metadataBase` makes it absolute, so the domain is
 * still written in exactly one place.
 */
export const OG_IMAGE = {
  url: "/images/og-default.png",
  width: 1200,
  height: 630,
  alt: `${SEARCH_NAME} — AI Engineer and Software Developer`,
} as const;

/** The one job title, shared by the `<title>`, the card and the JSON-LD. */
export const searchTitle = (titleShort: string) =>
  `${SEARCH_NAME} — ${titleShort}`;

/**
 * Person and WebSite, emitted once, on the homepage only.
 *
 * ONE GRAPH, NOT TWO BLOCKS
 * They are related — the site is published by the person — so they go in a
 * single `@graph` joined by `@id` rather than as two standalone objects that
 * each restate the same name and URL. That is also what keeps this from being
 * the "duplicate structured data" it would otherwise become the moment both
 * described the same entity independently.
 *
 * EVERY VALUE IS READ FROM THE PORTFOLIO
 * Nothing here is asserted that the site does not already state elsewhere:
 * the socials are the same two public profiles the footer links to, the
 * institution is the one the education section names, and the job title is the
 * one under the wordmark. `mailto:` is deliberately excluded from `sameAs` —
 * that property is for profile pages, and an email address is not one.
 */
export function personGraph({
  person,
  site,
  socials,
  alumniOf,
  portraitUrl,
  email,
  telephone,
}: {
  person: SiteSettings["person"];
  site: SiteSettings["site"];
  socials: SocialLink[];
  /** Institution names the education data actually supplies. */
  alumniOf: string[];
  portraitUrl?: string;
  /** The same two contact points the contact section publishes, or nothing. */
  email?: string;
  telephone?: string;
}) {
  const personId = `${SITE_ORIGIN}/#person`;
  const siteId = `${SITE_ORIGIN}/#website`;

  const profiles = socials
    .map((s) => s.href)
    .filter((href) => href.startsWith("http"));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: SEARCH_NAME,
        url: SITE_ORIGIN,
        jobTitle: person.titleShort,
        description: site.description,
        ...(profiles.length ? { sameAs: profiles } : {}),
        ...(alumniOf.length
          ? {
              alumniOf: alumniOf.map((name) => ({
                "@type": "CollegeOrUniversity",
                name,
              })),
            }
          : {}),
        ...(portraitUrl ? { image: portraitUrl } : {}),
        /*
         * Only what the page already shows. These are published in the contact
         * section in plain sight, so restating them here tells a crawler
         * nothing a reader cannot see — which is the line this graph is written
         * to stay on.
         */
        ...(email ? { email } : {}),
        ...(telephone ? { telephone } : {}),
        knowsAbout: [
          "AI Engineering",
          "Software Engineering",
          "Data Science",
          "Full-Stack Development",
          "Intelligent Systems",
        ],
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        url: SITE_ORIGIN,
        name: SEARCH_NAME,
        description: site.description,
        inLanguage: "en",
        // No SearchAction: the site has no search, and claiming one produces a
        // sitelinks searchbox that leads nowhere.
        publisher: { "@id": personId },
      },
    ],
  };
}
