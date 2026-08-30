import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { caseStudyProjects, getNextProject, getProject } from "@/data/projects";
import { person } from "@/data/portfolio";
import { CaseStudy } from "@/components/work/CaseStudy";
import { Footer } from "@/components/layout/Footer";

/**
 * Case-study route.
 *
 * Dynamic rather than a single hardcoded page: the case study is driven
 * entirely by data, so a second real project becomes an object in
 * data/projects.ts and gets a page for free.
 *
 * Only projects that actually carry a `caseStudy` are pre-rendered; the
 * placeholder projects have no page and correctly 404 rather than rendering an
 * empty shell.
 */
export function generateStaticParams() {
  return caseStudyProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project?.caseStudy) return {};

  // The root layout supplies the "%s — RAFAY KHATTAK" template, so the title
  // here is just the project name.
  const description =
    project.caseStudy.seoDescription ?? project.caseStudy.statement;

  return {
    title: project.name,
    description,
    openGraph: {
      title: `${project.name} — ${person.fullName}`,
      description,
      type: "article",
    },
  };
}

export default async function WorkCaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project?.caseStudy) notFound();

  return (
    <>
      <CaseStudy project={project} nextProject={getNextProject(slug)} />
      <Footer />
    </>
  );
}
