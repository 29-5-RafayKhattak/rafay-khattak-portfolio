import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudy } from "@/components/work/CaseStudy";
import { Footer } from "@/components/layout/Footer";
import {
  getNextProject,
  getProject,
  getSettings,
  getSocials,
} from "@/lib/cms/queries";

/**
 * Case-study route.
 *
 * Driven entirely by data, so a new project becomes a row in the CMS and gets a
 * page for free. Only projects that actually carry a case study resolve; the
 * rest 404 rather than rendering an empty shell.
 *
 * NO `generateStaticParams`, DELIBERATELY
 * Prerendering these at build would require a database connection during the
 * build, and the deployment is built without one — the image compiles, then
 * migrations run in a separate pre-deploy step on the private network. Binding
 * the build to the database would make a database outage break the build and,
 * worse, would freeze published content until the next redeploy. These render
 * on demand and are cached instead.
 */
/**
 * Rendered on demand, never at build.
 *
 * The deployment compiles without a database — Railway does not expose private
 * networking to a build — so a page that fetched at build time would fail the
 * build outright. Pinning content to build time would also mean every edit in
 * the admin needed a redeploy before anyone could see it.
 *
 * The render is dynamic; the data underneath it is cached by tag and
 * invalidated on publish, so this is not a database round trip per visitor.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getProject(slug), getSettings()]);

  if (!project?.caseStudy) return {};

  // The root layout supplies the "%s — RAFAY KHATTAK" template, so the title
  // here is just the project name.
  const description =
    project.caseStudy.seoDescription ?? project.caseStudy.statement;

  const ogTitle = `${project.name} — ${settings.person.fullName}`;

  return {
    title: project.name,
    description,
    /*
     * Relative, resolved against the `metadataBase` the root layout sets from
     * the one committed origin. Written this way so a case study never names
     * the domain — the alternative is six absolute URLs that all have to be
     * found and changed the day the site moves.
     */
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title: ogTitle,
      description,
      type: "article",
      url: `/work/${slug}`,
      siteName: settings.person.fullName,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
    },
  };
}

export default async function WorkCaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project?.caseStudy) notFound();

  const [nextProject, settings, socials] = await Promise.all([
    getNextProject(slug),
    getSettings(),
    getSocials(),
  ]);

  return (
    <>
      <CaseStudy project={project} nextProject={nextProject} />
      <Footer
        navigation={settings.navigation}
        person={settings.person}
        site={settings.site}
        socials={socials}
      />
    </>
  );
}
