"use client";

import { useRef } from "react";

import type { Project } from "@/data/projects";
import { paletteVars } from "@/data/projects";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { LAYER, projectsSceneHeight, sceneTrigger } from "@/lib/scene";
import { gsap, useScrollScene } from "@/hooks/useScrollScene";
import { Scene } from "@/components/layout/Scene";
import { ProjectVisual } from "@/components/ui/ProjectVisual";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * -----------------------------------------------------------------------------
 * SELECTED WORK — scroll as a transport control
 * -----------------------------------------------------------------------------
 * The stage is pinned and exactly one project is on screen at a time.
 *
 *   LEFT    oversized index
 *   CENTRE  the visual, revealed by a clip-path wipe and settling out of a
 *           slight over-scale
 *   RIGHT   name, category, year, description
 *
 * The section is pulled up over the metrics that precede it and given a rounded
 * top edge, so the change from the dark room to the light one happens as one
 * surface sliding over another rather than as a cut between two blocks.
 *
 * ANIMATION OWNERSHIP — GSAP ScrollTrigger (scrubbed) for the sequence.
 * -----------------------------------------------------------------------------
 */
export function ProjectsShowcase({
  projects,
  label,
}: {
  projects: Project[];
  label: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  const reducedMotion = useScrollScene(sectionRef, (scope) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        // Driving starts once the metrics above have finished sliding away.
        scrollTrigger: sceneTrigger(scope, { scrub: 0.55 }),
      });

      const slides = gsap.utils.toArray<HTMLElement>(".project-slide");

      /**
       * One timeline unit per project, of which SWAP is the hand-over and the
       * remaining ~70% is a settled hold — the project sitting still and fully
       * readable before the next one starts arriving.
       */
      const STEP = 1;
      const SWAP = 0.3;
      /** Percent travel that fully clears a mask. */
      const OUT = 115;

      const PORTFOLIO_ACCENT =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--color-accent")
          .trim() || "#9a6840";

      const parts = (slide: HTMLElement) => ({
        visual: slide.querySelector(".project-visual"),
        index: slide.querySelector(".project-index"),
        copy: slide.querySelectorAll(".project-copy-line"),
      });

      /*
       * A project with its own palette tints the whole stage while it is the
       * active one, then hands the room back to the portfolio off-white. Tied
       * to the same timeline as the slides, so the change is scroll-linked and
       * gradual rather than a switch flipping at a threshold.
       */
      gsap.utils.toArray<HTMLElement>(".project-atmosphere").forEach((layer) => {
        const i = Number(layer.dataset.index);
        const accent = layer.dataset.accent;

        // Full while its own project holds the frame, gone by the time the
        // next one has finished arriving.
        tl.fromTo(
          layer,
          { opacity: i === 0 ? 1 : 0 },
          { opacity: 1, duration: SWAP, ease: "none" },
          Math.max(0, i * STEP - SWAP),
        ).to(
          layer,
          { opacity: 0, duration: SWAP, ease: "none" },
          (i + 1) * STEP - SWAP,
        );

        /*
         * The progress rail sits outside the slides, so it cannot inherit the
         * scoped palette — its colour has to be driven directly. Tweened on
         * the same windows as the atmosphere so the indicator changes with the
         * room rather than a beat after it.
         */
        if (!accent) return;

        // The first project owns the frame from time zero and gets its accent
        // from the rendered markup instead — a timeline `.set()` at time 0
        // only lands once the playhead has rendered, which leaves the rail the
        // wrong colour until the reader scrolls.
        if (i > 0) {
          tl.to(
            ".project-progress",
            { backgroundColor: accent, duration: SWAP, ease: "none" },
            i * STEP - SWAP,
          );
        }

        tl.to(
          ".project-progress",
          {
            backgroundColor: PORTFOLIO_ACCENT,
            duration: SWAP,
            ease: "none",
          },
          (i + 1) * STEP - SWAP,
        );
      });


      /*
       * No opacity crossfade, for the same reason as the metrics: dissolving
       * one project into another leaves both on screen at half strength in the
       * middle. Instead the visual wipes — the outgoing one collapsing to the
       * top edge while the incoming one grows from the bottom — so the two
       * tile the frame rather than blending, and the text rolls behind masks.
       *
       * Resting state is set up front and every fromTo opts out of
       * immediateRender; otherwise the timeline's time-0 state shows whichever
       * project was configured last and project 01 is skipped past.
       */
      slides.forEach((slide, i) => {
        const { visual, index, copy } = parts(slide);
        /*
         * `pointerEvents` matters as much as opacity here. The slides are
         * stacked with `absolute inset-0` and every one is left fully opaque —
         * only masks and clip-path decide what is *seen*. Masks do not affect
         * hit-testing, so without this the last slide in the DOM covers the
         * whole stage and swallows every click, including the case-study CTA.
         */
        gsap.set(slide, {
          opacity: 1,
          pointerEvents: i === 0 ? "auto" : "none",
        });
        /*
         * `y: 0` is not redundant — see StatsSequence. GSAP adds the pixel and
         * percentage parts of a translate, and re-reads percentages as pixels
         * on re-init, so the pixel part has to be pinned or they accumulate.
         */
        gsap.set([index, ...Array.from(copy)], {
          y: 0,
          yPercent: i === 0 ? 0 : OUT,
        });
        if (i === 0) return;
        gsap.set(visual, { clipPath: "inset(100% 0% 0% 0%)", scale: 1.12 });
      });

      slides.forEach((slide, i) => {
        const { visual, index, copy } = parts(slide);
        const render = { ease: "none", immediateRender: false } as const;
        const TRAIL = 0.05;

        // --- arriving ---------------------------------------------------
        if (i > 0) {
          const enter = i * STEP - SWAP;

          tl.fromTo(
            visual,
            // Grows from the lower edge, easing out of a slight over-scale as
            // it lands so the reveal has some weight to it.
            { clipPath: "inset(100% 0% 0% 0%)", scale: 1.12 },
            { ...render, clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: SWAP },
            enter,
          )
            .fromTo(
              index,
              { y: 0, yPercent: OUT },
              { ...render, y: 0, yPercent: 0, duration: SWAP },
              enter,
            )
            .fromTo(
              copy,
              { y: 0, yPercent: OUT },
              { ...render, y: 0, yPercent: 0, duration: SWAP, stagger: 0.04 },
              enter + TRAIL,
            )
            // Becomes clickable at the midpoint of its own arrival, which is
            // also when the one before it stops being clickable — so exactly
            // one slide owns the pointer at any scroll position.
            .set(slide, { pointerEvents: "auto" }, enter + SWAP / 2);
        }

        // --- leaving ----------------------------------------------------
        if (i < slides.length - 1) {
          const exit = (i + 1) * STEP - SWAP;

          tl.to(
            visual,
            {
              clipPath: "inset(0% 0% 100% 0%)",
              scale: 1.06,
              duration: SWAP,
              ease: "none",
            },
            exit,
          )
            .to(index, { y: 0, yPercent: -OUT, duration: SWAP, ease: "none" }, exit)
            .to(
              copy,
              { y: 0, yPercent: -OUT, duration: SWAP, stagger: 0.04, ease: "none" },
              exit + TRAIL,
            )
            .set(slide, { pointerEvents: "none" }, exit + SWAP / 2);
        }
      });

      tl.fromTo(
        ".project-progress",
        { scaleX: 1 / slides.length },
        // Duration covers the last project's hold too, so it gets a settled
        // beat rather than arriving exactly at the end of the range.
        { scaleX: 1, duration: slides.length * STEP, ease: "none" },
        0,
      );
    });

    return () => mm.revert();
  });

  return (
    <Scene
      id="work"
      ariaLabel={label}
      sectionRef={sectionRef}
      content={projectsSceneHeight(projects.length)}
      layer={LAYER.projects}
      roundedTop
      reducedMotion={reducedMotion}
      className="bg-[var(--color-surface)]"
      fallback={
        <>
          <SectionLabel index="03" className="mb-12">
            {label}
          </SectionLabel>
          <ul className="grid gap-14">
            {projects.map((project) => (
              <li key={project.index} className="grid gap-6 md:grid-cols-[7rem_1fr]">
                <span className="headline text-[var(--color-line-strong)]">
                  {project.index}
                </span>
                <div>
                  <div className="aspect-[4/3] max-w-xl overflow-hidden rounded-2xl border border-[var(--color-line)]">
                    <ProjectVisual variant={project.visual} accent={project.accent} palette={project.palette} />
                  </div>
                  <h3 className="mt-5 text-[length:var(--step-h3)] font-semibold tracking-[-0.025em]">
                    {project.name}
                  </h3>
                  <p className="eyebrow mt-2 text-[var(--color-muted)]">
                    {project.category} — {project.year}
                  </p>
                  <p className="mt-3 max-w-[52ch] text-[var(--color-muted)]">
                    {project.description}
                  </p>
                  {project.caseStudy && (
                    <Link
                      href={`/work/${project.slug}`}
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-3 text-[0.875rem] font-medium text-[var(--color-canvas)]"
                    >
                      View Case Study
                      <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      }
    >
      {/* Atmosphere layers, one per project that defines a palette. */}
      {projects.map((project, i) =>
        project.palette ? (
          <span
            key={`atmosphere-${project.id}`}
            aria-hidden="true"
            data-index={i}
            data-accent={project.palette.accent}
            className="project-atmosphere pointer-events-none absolute inset-0 z-0"
            style={{ backgroundColor: project.palette.surface, opacity: 0 }}
          />
        ) : null,
      )}

      <div className="relative z-10 flex h-full flex-col">
        {/*
          The floor has to clear the navigation bar, which is 83px at its
          tallest and does not shrink with viewport height — a proportional
          value alone tucks the eyebrow under it on short screens.
        */}
        <div className="gutter shrink-0 pt-[clamp(5rem,9.5vh,7rem)]">
          <SectionLabel index="03">{label}</SectionLabel>
        </div>

        {/* Slides ------------------------------------------------------ */}
        <div className="relative min-h-0 flex-1">
          {projects.map((project, i) => (
            <article
              key={project.index}
              className="project-slide gutter absolute inset-0 flex items-center"
              // Palette scope, plus the pre-JS state. GSAP takes opacity and
              // pointer-events over once the sequence is built; until then only
              // the first slide is visible and only the first is clickable.
              style={{
                ...paletteVars(project.palette),
                opacity: i === 0 ? 1 : 0,
                pointerEvents: i === 0 ? "auto" : "none",
              }}
              /*
               * Deliberately not aria-hidden. Which project is visible is a
               * function of scroll position, so a static aria-hidden would
               * hide whichever one the reader is actually looking at. Leaving
               * all five exposed also means a screen-reader user gets the
               * whole list without having to scrub through the sequence.
               */
            >
              {/*
                The index column is deliberately narrow and its number is set
                flush right, so the figure sits against the visual instead of
                floating in an empty column — which is what made the old
                three-column split read as a gap with a number in it.
              */}
              {/*
                Three tiers, because the stage is a fixed 100svh and the slide
                has to fit inside it at every shape:
                  < sm  stacked, with the visual bounded by height (below)
                  sm    visual and copy side by side, so the extra content uses
                        the width rather than a height the stage does not have
                  lg    the index column joins them
              */}
              <div className="grid w-full items-center gap-x-[clamp(1.25rem,3vw,3rem)] gap-y-[clamp(0.75rem,2.5vh,1.5rem)] sm:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)] lg:grid-cols-[minmax(0,0.26fr)_minmax(0,1.18fr)_minmax(0,0.7fr)] xl:grid-cols-[minmax(0,0.34fr)_minmax(0,1.12fr)_minmax(0,0.72fr)]">
                {/* Index — dropped on narrow screens where it would crowd
                    the visual out of the frame. */}
                {/*
                  The numeral used to hold this column alone, which left the
                  stage's left third empty at every scroll position — a tall
                  gap with a figure floating in it. The case study's own hero
                  facts fill it: read from the same data, so the homepage and
                  the case study cannot disagree, and specific enough that the
                  column earns its width. A display numeral over fine print is
                  the column doing editorial work instead of holding a space.

                  The animated node is now the group rather than the numeral,
                  so both travel together on one existing tween. No new
                  animation, and the copy stagger next door is untouched —
                  adding these to `.project-copy-line` would have lengthened
                  its entrance for every slide.
                */}
                <div className="hidden overflow-hidden text-right lg:block">
                  <div className="project-index gpu">
                    <span
                      className="block text-[clamp(5rem,11vw,11.5rem)] leading-[0.78] font-semibold tracking-[-0.06em]"
                      style={{ color: project.accent, opacity: 0.26 }}
                    >
                      {project.index}
                    </span>

                    {project.caseStudy?.highlights && (
                      /*
                        Only from `xl`. At the `lg` breakpoint this column is
                        under 100px wide, which turns every value into a
                        four-line rag — worse than the empty space it was
                        meant to fix. The column widens at `xl` and the facts
                        appear with it.
                      */
                      <dl className="mt-[clamp(1.5rem,3.5vh,2.5rem)] hidden flex-col gap-[clamp(0.75rem,1.8vh,1.125rem)] xl:flex">
                        {project.caseStudy.highlights.map((fact) => (
                          <div
                            key={fact.label}
                            className="spec-item pt-[clamp(0.5rem,1.2vh,0.75rem)]"
                          >
                            <dt className="spec-label text-[clamp(0.5625rem,0.54rem+0.14vw,0.6875rem)]">
                              {fact.label}
                            </dt>
                            <dd className="spec-value mt-1.5 text-[clamp(0.8125rem,0.79rem+0.16vw,0.9375rem)] text-balance">
                              {fact.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                </div>

                {/*
                  The shadow is what makes this read as an object sitting on
                  the page rather than a panel tinted slightly off it. The
                  hover lift is on an inner node: GSAP owns `scale` on
                  .project-visual for the wipe, and the two must not share a
                  property.
                */}
                {/*
                  max-w derived from svh bounds the tile by HEIGHT while leaving
                  the aspect ratio intact: on a short window it narrows instead
                  of cropping the visual, and on a normal phone the cap exceeds
                  the available width and never engages.
                */}
                <div className="work-visual project-visual group/visual mx-auto aspect-[16/10] w-full max-w-[calc(22svh*1.6)] overflow-hidden rounded-[clamp(0.875rem,1.6vw,1.5rem)] border border-[var(--color-line)] shadow-[0_28px_60px_-38px_rgba(17,17,17,0.45)] gpu sm:max-w-none">
                  {project.caseStudy ? (
                    <Link
                      href={`/work/${project.slug}`}
                      aria-label={`${project.name} — view case study`}
                      data-cursor="view"
                      className="block h-full w-full transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/visual:scale-[1.02]"
                    >
                      <ProjectVisual variant={project.visual} accent={project.accent} palette={project.palette} />
                    </Link>
                  ) : (
                    <div
                      className="h-full w-full transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/visual:scale-[1.02]"
                      data-cursor="view"
                    >
                      <ProjectVisual variant={project.visual} accent={project.accent} palette={project.palette} />
                    </div>
                  )}
                </div>

                <div className="max-w-[40ch]">
                  <div className="overflow-hidden">
                    <h3 className="project-copy-line text-[clamp(1.625rem,2.7vw,2.5rem)] leading-[1.04] font-semibold tracking-[-0.035em] text-balance gpu">
                      {project.name}
                    </h3>
                  </div>
                  <div className="mt-[clamp(0.5rem,1.6vh,0.875rem)] overflow-hidden">
                    <p className="project-copy-line eyebrow gpu">
                      {/* `warm`, not `accent` — see the LABELLED FACT note in
                          globals.css. At eyebrow size the deep tone is ink,
                          and neat `warm` is too pale to read. */}
                      <span className="accent-ink">{project.category}</span>
                      <span className="mx-2" style={{ color: project.accent }}>
                        /
                      </span>
                      <span className="text-[var(--color-muted)]">
                        {project.year}
                      </span>
                    </p>
                  </div>
                  {project.company && (
                    <div className="mt-1.5 overflow-hidden">
                      <p className="project-copy-line eyebrow text-[var(--color-muted)] gpu">
                        {project.company}
                      </p>
                    </div>
                  )}

                  {/*
                    Status keeps the fact block together and stops the copy
                    column ending well above the visual beside it. Read from
                    the case-study metadata rather than duplicated, so the two
                    surfaces can never disagree.
                  */}
                  {(() => {
                    const status = project.caseStudy?.meta.find(
                      (m) => m.label === "Status",
                    )?.value;
                    if (!status) return null;
                    return (
                      <div className="mt-[clamp(0.625rem,2vh,1rem)] overflow-hidden">
                        <p className="project-copy-line gpu flex items-center gap-2.5 text-[0.8125rem] text-[var(--color-muted)]">
                          <span
                            aria-hidden="true"
                            className="block h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{
                              backgroundColor:
                                "var(--p-warm, var(--color-accent))",
                            }}
                          />
                          {status}
                        </p>
                      </div>
                    );
                  })()}
                  <div className="mt-[clamp(0.875rem,3vh,1.5rem)] overflow-hidden">
                    <p className="work-desc project-copy-line text-[length:var(--step-body)] leading-[1.6] text-[var(--color-muted)] gpu">
                      {project.description}
                    </p>
                  </div>
                  <div className="mt-[clamp(0.75rem,2.5vh,1.25rem)] overflow-hidden">
                    <ul className="work-tags project-copy-line flex flex-wrap gap-2 gpu">
                      {project.tags.map((tag) => (
                        <li key={tag}>
                          <span className="tech-pill">{tag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Only projects with a published case study get a CTA. */}
                  {project.caseStudy && (
                    <div className="mt-[clamp(0.875rem,3vh,1.5rem)] overflow-hidden">
                      <div className="project-copy-line gpu">
                        <Link
                          href={`/work/${project.slug}`}
                          data-cursor="arrow"
                          className="group/cta inline-flex items-center gap-2 rounded-full px-5 py-3 text-[0.875rem] font-medium text-white transition-colors duration-300"
                          style={{
                            backgroundColor:
                              "var(--p-accent, var(--color-ink))",
                          }}
                        >
                          View Case Study
                          <ArrowUpRight
                            className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/cta:translate-x-[3px] group-hover/cta:-translate-y-[3px]"
                            strokeWidth={1.75}
                            aria-hidden="true"
                          />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Progress rail ----------------------------------------------- */}
        <div className="gutter flex shrink-0 items-center gap-4 pb-[calc(clamp(1.75rem,5vh,3rem)+var(--safe-bottom))]">
          <span className="eyebrow text-[var(--color-muted)]">01</span>
          <span
            className="relative h-px flex-1 overflow-hidden bg-[var(--color-line)]"
            aria-hidden="true"
          >
            <span
              className="project-progress absolute inset-0 origin-left scale-x-0"
              style={{
                backgroundColor:
                  projects[0].palette?.accent ?? "var(--color-accent)",
              }}
            />
          </span>
          <span className="eyebrow text-[var(--color-muted)]">
            {String(projects.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </Scene>
  );
}
