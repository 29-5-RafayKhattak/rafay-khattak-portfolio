import type { Project as ProjectDoc } from "@/payload-types";
import type {
  CaseStudy,
  CaseStudySection,
  FigureKey,
  Project,
  ProjectPalette,
  ProjectVisualVariant,
  SectionTone,
} from "@/data/projects";

import {
  presentOr,
  ungroup,
  unlayer,
  unlist,
  unlistOptional,
  unpairs,
  unstatus,
} from "@/lib/cms/shape";

/**
 * Maps a Payload project document onto the `Project` contract the components
 * are written against. Nothing downstream of here knows the CMS exists.
 */
export function toProject(doc: ProjectDoc): Project {
  const palette: ProjectPalette | undefined =
    doc.palette?.enabled && doc.palette.accent
      ? {
          accent: doc.palette.accent,
          accentDeep: doc.palette.accentDeep ?? doc.palette.accent,
          muted: doc.palette.muted ?? "",
          surface: doc.palette.surface ?? "",
          surfaceAlt: doc.palette.surfaceAlt ?? undefined,
          surfaceSoft: doc.palette.surfaceSoft ?? undefined,
          warm: doc.palette.warm ?? "",
          cream: doc.palette.cream ?? "",
        }
      : undefined;

  return {
    id: String(doc.id),
    slug: doc.slug,
    index: doc.index,
    name: doc.name,
    category: doc.category,
    company: doc.company ?? undefined,
    year: doc.year,
    description: doc.description,
    visual: doc.visual as ProjectVisualVariant,
    accent: doc.accent,
    tags: unlist(doc.tags),
    palette,
    caseStudy: doc.caseStudy?.hasCaseStudy ? toCaseStudy(doc.caseStudy) : undefined,
  };
}

type CaseStudyDoc = NonNullable<ProjectDoc["caseStudy"]>;

function toCaseStudy(cs: CaseStudyDoc): CaseStudy {
  const sections: CaseStudySection[] = (cs.sections ?? []).map((s) => ({
    id: s.sectionId,
    number: s.number,
    title: s.title,
    tone: (s.tone ?? "paper") as SectionTone,
    figure: (s.figure ?? undefined) as FigureKey | undefined,
    body: unlist(s.body),
  }));

  return {
    statement: cs.statement ?? "",
    seoDescription: cs.seoDescription ?? undefined,
    heroNote: cs.heroNote ?? undefined,
    wordmark: presentOr(
      cs.wordmark?.lead && cs.wordmark.tail && cs.wordmark.accent
        ? {
            lead: cs.wordmark.lead,
            tail: cs.wordmark.tail,
            accent: cs.wordmark.accent as "lead" | "tail",
          }
        : undefined,
    ),
    meta: unpairs(cs.meta) ?? [],
    highlights: unpairs(cs.highlights),
    disciplines: unlist(cs.disciplines),
    covers: unlistOptional(cs.covers),
    technologies: unlist(cs.technologies),
    technicalSummary: cs.technicalSummary ?? "",
    repository: cs.repository ?? "",
    repositoryUrl: cs.repositoryUrl ?? undefined,
    publicArtifacts: cs.publicArtifacts ?? "",
    evidence: {
      supported: cs.evidence?.supported ?? "",
      notOverstated: cs.evidence?.notOverstated ?? "",
    },
    sections,
    techniques: unlistOptional(cs.techniques),
    contributors: unlistOptional(cs.contributors),
    credits: cs.credits?.length
      ? cs.credits.map((c) => ({ name: c.name, role: c.role ?? "" }))
      : undefined,
    status: unstatus(cs.status),
    planned: unstatus(cs.planned),
    responsibility: cs.responsibility?.stages?.length
      ? {
          stages: unlist(cs.responsibility.stages),
          caveat: cs.responsibility.caveat ?? "",
        }
      : undefined,
    disclosure: cs.disclosure?.canShow?.length
      ? {
          canShow: unlist(cs.disclosure.canShow),
          withheld: unlist(cs.disclosure.withheld),
        }
      : undefined,
    technicalNotes: ungroup(cs.technicalNotes) ?? [],
    architecture: cs.architecture?.stack?.length
      ? {
          heads: unlayer(cs.architecture.heads),
          stack: unlayer(cs.architecture.stack) ?? [],
          aside: unlayer(cs.architecture.aside),
        }
      : undefined,
    infrastructure: cs.infrastructure?.stack?.length
      ? { stack: unlayer(cs.infrastructure.stack) ?? [] }
      : undefined,
    domain: cs.domain?.nodes?.length
      ? {
          nodes: cs.domain.nodes.map((n) => ({
            id: n.nodeId,
            label: n.label,
            stage: n.stage,
            x: n.x,
            y: n.y,
          })),
          edges: (cs.domain.edges ?? []).map(
            (e) => [e.from, e.to] as [string, string],
          ),
        }
      : undefined,
    growth: cs.growth?.length
      ? cs.growth.map((g) => ({ number: g.number, label: g.label, note: g.note }))
      : undefined,
    tradeoff: cs.tradeoff?.words?.length
      ? {
          left: cs.tradeoff.left?.title
            ? {
                title: cs.tradeoff.left.title,
                items: unlist(cs.tradeoff.left.items),
              }
            : undefined,
          right: cs.tradeoff.right?.title
            ? {
                title: cs.tradeoff.right.title,
                items: unlist(cs.tradeoff.right.items),
              }
            : undefined,
          words: unlist(cs.tradeoff.words),
        }
      : undefined,
    phases: cs.phases?.length
      ? cs.phases.map((p) => ({
          number: p.number,
          label: p.label,
          complete: Boolean(p.complete),
          items: unlist(p.items),
        }))
      : undefined,
    packages: cs.packages?.length
      ? cs.packages.map((p) => ({ name: p.name, note: p.note ?? "" }))
      : undefined,
    dataFlows: cs.dataFlows?.length
      ? cs.dataFlows.map((f) => ({
          label: f.label,
          carries: f.carries,
          topic: f.topic,
          to: f.to,
        }))
      : undefined,
    metrics: ungroup(cs.metrics),
    tooling: ungroup(cs.tooling),
    capabilities: cs.capabilities?.groups?.length
      ? {
          groups: ungroup(cs.capabilities.groups) ?? [],
          note: cs.capabilities.note ?? "",
        }
      : undefined,
    topology: cs.topology?.steps?.length
      ? {
          steps: cs.topology.steps.map((s) => ({
            id: s.stepId,
            label: s.label,
            kind: s.kind,
          })),
          support: (cs.topology.support ?? []).map((s) => ({
            label: s.label,
            note: s.note ?? "",
          })),
        }
      : undefined,
    primitives: unlistOptional(cs.primitives),
    aggregation: cs.aggregation?.source
      ? {
          source: cs.aggregation.source,
          groupBy: cs.aggregation.groupBy ?? "",
          measures: unlist(cs.aggregation.measures),
          output: cs.aggregation.output ?? "",
          note: {
            title: cs.aggregation.note?.title ?? "",
            body: cs.aggregation.note?.body ?? "",
            formula: cs.aggregation.note?.formula ?? "",
          },
        }
      : undefined,
    limits: cs.limits?.verified?.length
      ? {
          verified: unlist(cs.limits.verified),
          notVerified: unlist(cs.limits.notVerified),
        }
      : undefined,
    nextProof: unlistOptional(cs.nextProof),
    gap: cs.gap?.label
      ? {
          label: cs.gap.label,
          subject: cs.gap.subject ?? "",
          status: cs.gap.status ?? "",
          next: cs.gap.next ?? "",
        }
      : undefined,
    proof: cs.proof?.points?.length
      ? {
          points: unlist(cs.proof.points),
          chain: unlist(cs.proof.chain),
          note: cs.proof.note ?? "",
        }
      : undefined,
    accessModel: cs.accessModel?.items?.length
      ? {
          title: cs.accessModel.title ?? "",
          items: unlist(cs.accessModel.items),
          note: cs.accessModel.note ?? "",
        }
      : undefined,
    /*
     * Resolved from the media library. Anything not yet populated simply is not
     * here — the case study renders no media section at all while it is empty,
     * which is the honest state for screenshots that have not been approved.
     */
    media: (cs.media ?? []).flatMap((m) => {
      const img = m.image;
      if (!img || typeof img === "number" || !img.url) return [];
      return [
        {
          src: img.url,
          alt: img.alt,
          caption: m.caption ?? img.caption ?? undefined,
          width: img.width ?? 1600,
          height: img.height ?? 1000,
        },
      ];
    }),
  };
}
