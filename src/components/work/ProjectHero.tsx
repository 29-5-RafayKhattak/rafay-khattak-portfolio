"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import type { Project } from "@/data/projects";
import { fadeUp, staggerGroup } from "@/lib/animations";
import { gsap, useScrollScene } from "@/hooks/useScrollScene";
import { ProjectDisciplines } from "@/components/work/ProjectDisciplines";
import { ProjectMetadata } from "@/components/work/ProjectMetadata";
import { OrbitingTags } from "@/components/work/OrbitingTags";
import { TechnologyList } from "@/components/work/TechnologyList";

/**
 * -----------------------------------------------------------------------------
 * CASE STUDY HERO — typography only
 * -----------------------------------------------------------------------------
 * Deliberately image-free. This project's real screens are not cleared for
 * publication, and the honest alternative to showing them is showing nothing —
 * not a wireframe, browser frame or invented dashboard standing in for an
 * interface the reader would assume is real. Scale and whitespace carry the
 * hero instead, which is what the rest of the portfolio does anyway.
 *
 * Real screenshots land in <ProjectMedia /> further down the page once they are
 * approved; nothing here needs to change when they do.
 *
 * ANIMATION OWNERSHIP
 *   Framer Motion — the one-shot entrance (opacity + y on outer wrappers).
 *   GSAP + scrub  — the departure, on inner elements, so the two systems never
 *                   share a node.
 * -----------------------------------------------------------------------------
 */
export function ProjectHero({ project }: { project: Project }) {
  const sectionRef = useRef<HTMLElement>(null);
  const caseStudy = project.caseStudy;

  useScrollScene(sectionRef, (scope) => {
    const mm = gsap.matchMedia();

    // Desktop only. On a phone the hero is barely taller than the viewport, so
    // parallax on the way out reads as drift rather than intent.
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: scope,
            start: "top top",
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        })
        .to(".case-hero-title", { yPercent: -22, ease: "none" }, 0)
        .to(".case-hero-lede", { yPercent: -10, opacity: 0.5, ease: "none" }, 0)
        .to(".case-hero-side", { opacity: 0.2, y: -34, ease: "none" }, 0);
    });

    return () => mm.revert();
  });

  if (!caseStudy) return null;

  return (
    <section
      ref={sectionRef}
      data-tone="day"
      className="gutter relative isolate pt-[clamp(5.5rem,11vh,7.5rem)] pb-[clamp(2.5rem,6vh,3.75rem)]"
      aria-label={`${project.name} — overview`}
    >
      {/*
        One large, very soft shape behind the title. Deliberately the only
        gradient on the page: enough to stop the hero reading as flat paper,
        far short of a coloured background.
      */}
      {project.palette && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -z-10"
          style={{
            top: "clamp(4rem,12vh,10rem)",
            left: "-8%",
            width: "min(72rem, 88%)",
            aspectRatio: "3 / 2",
            background: `radial-gradient(45% 45% at 42% 48%, ${project.palette.surface} 0%, transparent 72%)`,
            opacity: 0.85,
          }}
        />
      )}
      {/* Back to work ------------------------------------------------ */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="mb-[clamp(2rem,5vh,3.25rem)]"
      >
        <Link
          href="/#work"
          data-cursor="arrow"
          className="group inline-flex items-center gap-2.5 text-[0.875rem] text-[var(--color-muted)] transition-colors duration-300 hover:text-[var(--color-ink)]"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-1"
            strokeWidth={1.6}
            aria-hidden="true"
          />
          Back to Selected Work
        </Link>
      </motion.div>

      <div className="grid gap-x-[clamp(2rem,4.5vw,5rem)] gap-y-[clamp(2rem,5vh,3.25rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,19rem)]">
        {/* Primary column ------------------------------------------- */}
        <motion.div variants={staggerGroup(0.09)} initial="hidden" animate="show">
          {/* The number carries the weight here, so it is set at display
              scale rather than as an eyebrow beside the label. */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-baseline gap-x-5 gap-y-3"
          >
            <span
              className="text-[clamp(3rem,7vw,5.5rem)] leading-[0.8] font-semibold tracking-[-0.05em]"
              style={{ color: "var(--p-warm, var(--color-accent))" }}
            >
              {project.index}
            </span>
            {/*
              Where a project publishes under stated terms, those terms take the
              far side of the rule and the category moves in beside the index —
              so the first thing read after the number is what may be shown.
              Without a note the row keeps its original arrangement.
            */}
            {caseStudy.heroNote && (
              <span
                className="eyebrow shrink-0"
                style={{ color: "var(--p-accent, var(--color-muted))" }}
              >
                {project.category}
              </span>
            )}
            <span
              className="h-px min-w-6 flex-1 translate-y-[-0.35em]"
              style={{ backgroundColor: "var(--p-muted, var(--color-line))" }}
              aria-hidden="true"
            />
            {/*
              Allowed to shrink and to wrap onto its own line: a note this long
              cannot share a row with the index on a phone, and holding it on
              one line only gets it clipped by the shell's overflow guard.
            */}
            <span
              className="eyebrow ml-auto max-w-[26rem] text-right"
              style={{
                color: caseStudy.heroNote
                  ? "var(--color-muted)"
                  : "var(--p-accent, var(--color-muted))",
              }}
            >
              {caseStudy.heroNote ?? project.category}
            </span>
          </motion.div>

          {/*
            Where the data supplies a split, the leading word takes the project
            accent — a wordmark-like treatment that colours the title without
            renaming anything. Read together it is still "WLE Website", and the
            accessible name is unchanged.
          */}
          <motion.h1
            variants={fadeUp}
            className="case-hero-title mt-[clamp(1.5rem,3.5vh,2.5rem)] max-w-[12ch] text-[clamp(3rem,9vw,7.5rem)] leading-[0.92] font-semibold tracking-[-0.045em] text-balance"
            aria-label={project.name}
          >
            {(() => {
              const mark = caseStudy.wordmark;
              if (!mark) return project.name;

              /*
               * The separator is derived by checking the two halves against
               * the real name rather than being supplied. That makes it
               * impossible for this treatment to render a name the project
               * does not actually have — "Ride" + "Flow" joins to "RideFlow",
               * "WLE" + "Website" to "WLE Website", and anything that matches
               * neither falls back to the name itself.
               */
              const joiner = ["", " "].find(
                (sep) => `${mark.lead}${sep}${mark.tail}` === project.name,
              );
              if (joiner === undefined) return project.name;

              /*
                 The accented half takes `warm`, not `accent`. Every project's
                 `accent` is a near-black deep tone chosen for full-bleed
                 bands — set beside #111 ink at display size it reads as the
                 same colour, so the two-tone wordmark did nothing at all.
                 `warm` is the palette's mid-tone by definition, which is what
                 this treatment needs. Projects without a palette fall back to
                 the house accent rather than to ink.
              */
              const tone = (part: "lead" | "tail") =>
                mark.accent === part
                  ? "var(--p-warm, var(--color-accent))"
                  : "var(--color-ink)";

              return (
                <>
                  <span style={{ color: tone("lead") }}>{mark.lead}</span>
                  {joiner}
                  <span style={{ color: tone("tail") }}>{mark.tail}</span>
                </>
              );
            })()}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="case-hero-lede mt-[clamp(1.5rem,3.5vh,2.25rem)] max-w-[48ch] text-[clamp(1.0625rem,1.7vw,1.5rem)] leading-[1.45] text-balance text-[var(--color-muted)]"
          >
            {caseStudy.statement}
          </motion.p>

          {/*
            Fills the paper left under the lede when the metadata column runs
            long. Two columns rather than four: the values are phrases, not
            single numbers, and a four-across strip would either wrap badly or
            force them to be shortened into something less true.
          */}
          {caseStudy.highlights && (
            <motion.dl
              variants={fadeUp}
              className="mt-[clamp(2rem,4.5vh,3rem)] grid max-w-[42rem] grid-cols-1 gap-x-[clamp(1.5rem,3vw,3rem)] sm:grid-cols-2"
            >
              {caseStudy.highlights.map((fact) => (
                <div key={fact.label} className="spec-item py-4">
                  <dt className="spec-label text-[length:var(--step-eyebrow)]">
                    {fact.label}
                  </dt>
                  <dd className="spec-value mt-2 text-[1.0625rem]">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </motion.dl>
          )}
        </motion.div>

        {/* Secondary column ----------------------------------------- */}
        <div className="case-hero-side lg:pt-4">
          <ProjectMetadata entries={caseStudy.meta} />

          <OrbitingTags
            items={caseStudy.disciplines}
            className="mt-[clamp(2rem,4.5vh,3rem)] hidden h-[clamp(10rem,13vw,12.5rem)] w-[clamp(10rem,13vw,12.5rem)] sm:block"
          />
        </div>
      </div>

      {/* Disciplines --------------------------------------------------- */}
      <div className="mt-[clamp(2.5rem,6vh,3.5rem)] border-t border-[var(--color-line)] pt-[clamp(1.5rem,3.5vh,2.25rem)]">
        <ProjectDisciplines
          items={caseStudy.disciplines}
          covers={caseStudy.covers}
        />
      </div>

      {/* Stack --------------------------------------------------------- */}
      <div className="mt-[clamp(1.75rem,4vh,2.5rem)]">
        <TechnologyList items={caseStudy.technologies} />
      </div>
    </section>
  );
}
