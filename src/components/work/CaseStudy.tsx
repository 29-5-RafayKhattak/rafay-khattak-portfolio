"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  paletteVars,
  type CaseStudy as CaseStudyData,
  type FigureKey,
  type Project,
} from "@/data/projects";
import { AccessModel } from "@/components/work/AccessModel";
import { AggregationFlow } from "@/components/work/AggregationFlow";
import { AnalysisTooling } from "@/components/work/AnalysisTooling";
import { ArchitectureDiagram } from "@/components/work/ArchitectureDiagram";
import { CaseStudyNav } from "@/components/work/CaseStudyNav";
import { CaseStudySection } from "@/components/work/CaseStudySection";
import { Contributors } from "@/components/work/Contributors";
import { DisclosureLists } from "@/components/work/DisclosureLists";
import { DataFlows } from "@/components/work/DataFlows";
import { DomainGraph } from "@/components/work/DomainGraph";
import { EvidenceBoundary } from "@/components/work/EvidenceBoundary";
import { GrowthStages } from "@/components/work/GrowthStages";
import { KnownGap } from "@/components/work/KnownGap";
import { LabeledGroups } from "@/components/work/LabeledGroups";
import { NextProject } from "@/components/work/NextProject";
import { ProjectHero } from "@/components/work/ProjectHero";
import { ProjectMedia } from "@/components/work/ProjectMedia";
import { PhaseTrack } from "@/components/work/PhaseTrack";
import { PrimitiveList } from "@/components/work/PrimitiveList";
import { ProcessTopology } from "@/components/work/ProcessTopology";
import { ProofPoints } from "@/components/work/ProofPoints";
import { RelationDiagram } from "@/components/work/RelationDiagram";
import { RepositoryCTA } from "@/components/work/RepositoryCTA";
import { Ros2Packages } from "@/components/work/Ros2Packages";
import { StepChain } from "@/components/work/StepChain";
import { ResponsibilityTrack } from "@/components/work/ResponsibilityTrack";
import { StatusList } from "@/components/work/StatusList";
import { TechnicalNotes } from "@/components/work/TechnicalNotes";
import { TechniqueList } from "@/components/work/TechniqueList";
import { TradeoffColumns } from "@/components/work/TradeoffColumns";

/**
 * -----------------------------------------------------------------------------
 * CASE STUDY
 * -----------------------------------------------------------------------------
 * Driven entirely by the project's data. Sections, their order, their
 * background tone and the figure that accompanies each one all come from
 * data/projects.ts — nothing about any individual project is written here.
 *
 * That is what lets two projects with different structures (WLE has five
 * sections about a CMS; RideFlow has four about a relational system) share one
 * implementation rather than forking the page.
 *
 * The page reuses the homepage's shell wholesale: same navbar, footer, smooth
 * scrolling, type ramp, tokens and easing. It is a continuation of the
 * homepage, not a second site.
 * -----------------------------------------------------------------------------
 */

/**
 * Figures are looked up by key rather than passed as JSX, so the data layer
 * stays free of components and two projects can share a figure while supplying
 * different content to it.
 */
function figureFor(key: FigureKey | undefined, study: CaseStudyData): ReactNode {
  if (!key) return null;

  switch (key) {
    case "relation":
      return <RelationDiagram />;

    case "architecture":
    case "stack":
      return study.architecture ? (
        <ArchitectureDiagram
          heads={study.architecture.heads}
          stack={study.architecture.stack}
          aside={study.architecture.aside}
        />
      ) : null;

    case "infrastructure":
      return study.infrastructure ? (
        <ArchitectureDiagram stack={study.infrastructure.stack} onDeep />
      ) : null;

    case "domain":
      return study.domain ? (
        <DomainGraph nodes={study.domain.nodes} edges={study.domain.edges} />
      ) : null;

    case "techniques":
      return study.techniques ? (
        <TechniqueList items={study.techniques} onDeep />
      ) : null;

    case "responsibility":
      return study.responsibility ? (
        <ResponsibilityTrack
          stages={study.responsibility.stages}
          caveat={study.responsibility.caveat}
        />
      ) : null;

    case "disclosure":
      return study.disclosure ? (
        <DisclosureLists
          canShow={study.disclosure.canShow}
          withheld={study.disclosure.withheld}
        />
      ) : null;

    case "status":
      return study.status ? <StatusList items={study.status} /> : null;

    case "phases":
      return study.phases ? <PhaseTrack phases={study.phases} /> : null;

    /*
     * Three views of one system, in the order they answer the reader's
     * questions: what it is divided into, how a request travels through it,
     * and what actually moves between the parts.
     */
    case "research-architecture":
      return (
        <div className="flex flex-col gap-[clamp(2.5rem,7vh,4.5rem)]">
          {study.packages && <Ros2Packages packages={study.packages} />}
          {study.architecture && (
            <ArchitectureDiagram
              stack={study.architecture.stack}
              aside={study.architecture.aside}
            />
          )}
          {study.dataFlows && <DataFlows flows={study.dataFlows} />}
        </div>
      );

    case "metrics":
      return study.metrics ? (
        <LabeledGroups
          groups={study.metrics}
          note="These are the measures the experiments are designed to capture, not results. No benchmark figures, accuracy numbers or comparative outcomes are reported on this page."
        />
      ) : null;

    case "capabilities":
      return study.capabilities ? (
        <LabeledGroups
          groups={study.capabilities.groups}
          note={study.capabilities.note}
        />
      ) : null;

    case "planned":
      return study.planned ? <StatusList items={study.planned} /> : null;

    /*
     * The run itself, then the primitives it is built from — the second only
     * means anything once the reader has seen where the boundaries fall.
     */
    case "process-topology":
      return (
        <div className="flex flex-col gap-[clamp(2.5rem,7vh,4.5rem)]">
          {study.topology && (
            <ProcessTopology
              steps={study.topology.steps}
              support={study.topology.support}
            />
          )}
          {study.primitives && <PrimitiveList items={study.primitives} />}
        </div>
      );

    case "aggregation":
      return study.aggregation ? (
        <AggregationFlow
          source={study.aggregation.source}
          groupBy={study.aggregation.groupBy}
          measures={study.aggregation.measures}
          output={study.aggregation.output}
          note={study.aggregation.note}
        />
      ) : null;

    /*
     * What holds and what does not, then the steps that would settle the
     * difference — drawn as outline, because none of them have been taken.
     */
    case "limits":
      return (
        <div className="flex flex-col gap-[clamp(2.5rem,7vh,4rem)]">
          {study.limits && (
            <DisclosureLists
              canShow={study.limits.verified}
              withheld={study.limits.notVerified}
              titles={{ canShow: "Verified", withheld: "Not verified" }}
            />
          )}
          {study.nextProof && (
            <div>
              <p
                className="eyebrow"
                style={{ color: "var(--p-accent, var(--color-muted))" }}
              >
                Next proof
              </p>
              <div className="mt-5">
                <StepChain steps={study.nextProof} muted />
              </div>
            </div>
          )}
        </div>
      );

    case "growth":
      return study.growth ? <GrowthStages stages={study.growth} /> : null;

    case "proof":
      return study.proof ? (
        <ProofPoints
          points={study.proof.points}
          chain={study.proof.chain}
          note={study.proof.note}
        />
      ) : null;

    case "tradeoff":
      return study.tradeoff ? (
        <TradeoffColumns
          left={study.tradeoff.left}
          right={study.tradeoff.right}
          words={study.tradeoff.words}
        />
      ) : null;

    case "gap":
      return study.gap ? (
        <KnownGap
          label={study.gap.label}
          subject={study.gap.subject}
          status={study.gap.status}
          next={study.gap.next}
        />
      ) : null;

    default:
      return null;
  }
}

export function CaseStudy({
  project,
  nextProject,
}: {
  project: Project;
  nextProject?: Project;
}) {
  const study = project.caseStudy;
  if (!study) return null;

  return (
    /*
     * The palette is scoped here, so every themed token inside resolves to
     * this project's colours and everything outside — navbar, footer, the rest
     * of the portfolio — is untouched. A project without a palette renders
     * with the portfolio's own tokens.
     */
    <main style={paletteVars(project.palette)}>
      <ProjectHero project={project} />

      <div className="gutter">
        <div className="case-body grid grid-cols-[minmax(0,1fr)] gap-x-[var(--case-gap)] lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]">
          {/* Contents index / reading position ---------------------- */}
          <div className="min-w-0 lg:pt-[clamp(3.5rem,10vh,7rem)]">
            <CaseStudyNav sections={study.sections} />
          </div>

          {/* Body ---------------------------------------------------- */}
          <div className="min-w-0">
            {study.sections.map((section, i) => (
              <CaseStudySection
                key={section.id}
                section={section}
                tone={section.tone ?? "paper"}
                className={
                  i === 0
                    ? "border-t border-[var(--color-line)] lg:border-t-0"
                    : undefined
                }
              >
                {figureFor(section.figure, study)}
              </CaseStudySection>
            ))}

            {study.tooling && <AnalysisTooling groups={study.tooling} />}

            {study.accessModel && (
              <AccessModel
                title={study.accessModel.title}
                items={study.accessModel.items}
                note={study.accessModel.note}
              />
            )}

            <ProjectMedia items={study.media} />

            <EvidenceBoundary
              supported={study.evidence.supported}
              notOverstated={study.evidence.notOverstated}
            />

            <TechnicalNotes
              groups={study.technicalNotes}
              summary={study.technicalSummary}
              repository={study.repository}
              publicArtifacts={study.publicArtifacts}
            />

            {study.repositoryUrl && <RepositoryCTA href={study.repositoryUrl} />}

            {(study.credits ?? study.contributors) && (
              <Contributors
                people={
                  study.credits ??
                  (study.contributors ?? []).map((name) => ({ name }))
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Hand-off ---------------------------------------------------- */}
      <div className="gutter">
        <NextProject project={nextProject} />

        <div className="border-t border-[var(--color-line)] py-[clamp(2.5rem,7vh,4rem)]">
          <Link
            href="/#work"
            data-cursor="arrow"
            className="group inline-flex items-center gap-2.5 text-[0.9375rem] text-[var(--color-muted)] transition-colors duration-300 hover:text-[var(--color-ink)]"
          >
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1"
              strokeWidth={1.6}
              aria-hidden="true"
            />
            Back to Selected Work
          </Link>
        </div>
      </div>
    </main>
  );
}
