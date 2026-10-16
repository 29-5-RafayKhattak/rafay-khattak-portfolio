import type { CaseStudy, Project } from "@/data/projects";

/** Only the fields used by a project card cross the client boundary. */
export type ProjectSummary = Omit<Project, "caseStudy"> & {
  caseStudy?: Pick<CaseStudy, "meta" | "highlights">;
};

export function projectSummary({ caseStudy, ...project }: Project): ProjectSummary {
  return {
    ...project,
    caseStudy: caseStudy
      ? { meta: caseStudy.meta, highlights: caseStudy.highlights }
      : undefined,
  };
}
