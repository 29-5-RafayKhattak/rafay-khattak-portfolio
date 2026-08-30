"use client";

import { useRef } from "react";

import type { Stat } from "@/data/portfolio";
import { LAYER, SCENE, sceneTrigger } from "@/lib/scene";
import { gsap, useScrollScene } from "@/hooks/useScrollScene";
import { Scene } from "@/components/layout/Scene";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * -----------------------------------------------------------------------------
 * METRICS — one number at a time
 * -----------------------------------------------------------------------------
 * Not a row of cards. The stage is pinned and scroll acts as a transport
 * control: each figure rises into the frame, holds, and is pushed out by the
 * next one. A ticker down the side shows how far through the run you are.
 *
 * ANIMATION OWNERSHIP — GSAP ScrollTrigger (scrubbed). Only transform and
 * opacity are touched, so each slide is a compositor-only change.
 * -----------------------------------------------------------------------------
 */
export function StatsSequence({ stats, label }: { stats: Stat[]; label: string }) {
  const sectionRef = useRef<HTMLElement>(null);

  const reducedMotion = useScrollScene(sectionRef, (scope) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: sceneTrigger(scope, { scrub: 0.55 }),
      });

      const slides = gsap.utils.toArray<HTMLElement>(".stat-slide");

      /**
       * One timeline unit per metric. Of that unit, SWAP is spent handing over
       * to the next one and the remaining ~72% is a settled hold — the figure
       * sitting still, fully legible, before anything moves.
       */
      const STEP = 1;
      const SWAP = 0.28;
      /** Percent travel that fully clears the mask, padding included. */
      const OUT = 118;

      const parts = (slide: HTMLElement) => ({
        value: slide.querySelector(".stat-value"),
        meta: slide.querySelector(".stat-meta"),
      });

      /*
       * No opacity crossfade. Every slide stays fully opaque and the mask
       * around it decides what can be read, so a figure is either completely
       * legible or completely out of frame — never the half-strength ghost a
       * dissolve leaves in the middle.
       *
       * The outgoing and incoming figures travel in lockstep, one mask-height
       * apart, so at any point in the hand-off the tail of one occupies the
       * top of the frame and the head of the next occupies the bottom. They
       * roll past each other rather than blending.
       */
      slides.forEach((slide, i) => {
        const { value, meta } = parts(slide);
        gsap.set(slide, { opacity: 1 });
        /*
         * `y: 0` is not redundant. GSAP keeps the pixel and percentage parts of
         * a translate as separate components and adds them. On any re-init — a
         * resize, or React re-running the effect — it reads the previous
         * percentage transform back as pixels, and without pinning the pixel
         * part to zero the two accumulate and every figure drifts out of frame.
         */
        gsap.set([value, meta], { y: 0, yPercent: i === 0 ? 0 : OUT });
      });

      slides.forEach((slide, i) => {
        const { value, meta } = parts(slide);
        const render = { ease: "none", immediateRender: false } as const;
        // The caption trails the figure very slightly, so the pair reads as
        // one movement with a leading edge rather than a single block.
        const TRAIL = 0.05;

        // --- arriving ---------------------------------------------------
        if (i > 0) {
          const enter = i * STEP - SWAP;
          tl.fromTo(
            value,
            { y: 0, yPercent: OUT },
            { ...render, y: 0, yPercent: 0, duration: SWAP },
            enter,
          ).fromTo(
            meta,
            { y: 0, yPercent: OUT },
            { ...render, y: 0, yPercent: 0, duration: SWAP },
            enter + TRAIL,
          );
        }

        // --- leaving ----------------------------------------------------
        if (i < slides.length - 1) {
          const exit = (i + 1) * STEP - SWAP;
          tl.to(value, { y: 0, yPercent: -OUT, duration: SWAP, ease: "none" }, exit)
            .to(meta, { y: 0, yPercent: -OUT, duration: SWAP, ease: "none" }, exit + TRAIL);
        }
      });

      // Progress rail alongside the sequence.
      tl.fromTo(
        ".stat-progress",
        { scaleX: 1 / slides.length },
        // Duration covers the last metric's hold too, so the final figure
        // gets a settled beat instead of arriving exactly at the end.
        { scaleX: 1, duration: slides.length * STEP, ease: "none" },
        0,
      );
    });

    return () => mm.revert();
  });

  return (
    <Scene
      ariaLabel={label}
      sectionRef={sectionRef}
      content={SCENE.stats}
      layer={LAYER.stats}
      tone="night"
      reducedMotion={reducedMotion}
      className="on-night bg-[var(--color-night)]"
      fallback={
        <>
          <SectionLabel index="02" night className="mb-12">
            {label}
          </SectionLabel>
          <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="headline text-[var(--color-night-ink)]">
                  {stat.value}
                </dt>
                {/* Same hierarchy as the pinned stage, at the smaller scale a
                    static grid needs — reduced motion gets a considered
                    layout, not an unstyled one. */}
                <dd className="mt-3">
                  <span className="block text-[length:var(--step-lead)] leading-[1.15] font-semibold tracking-[-0.02em] text-[var(--color-night-ink)]">
                    {stat.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-3.5 block h-px w-8 bg-[var(--color-accent)]"
                  />
                  <span className="mt-3.5 block text-[length:var(--step-body)] leading-[1.6] text-[var(--color-night-muted)]">
                    {stat.caption}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </>
      }
    >
      <div className="relative flex h-full flex-col">
        <div className="gutter shrink-0 pt-[clamp(4.5rem,9vh,6.25rem)]">
          <SectionLabel index="02" night>
            {label}
          </SectionLabel>
        </div>

        {/* Slides ------------------------------------------------------ */}
        <div className="relative min-h-0 flex-1">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="stat-slide gutter absolute inset-0 flex flex-col justify-center"
              style={{ opacity: i === 0 ? 1 : 0 }}
              /* See ProjectsShowcase: which metric is visible depends on
                 scroll, so none of them are hidden from assistive tech. */
            >
              <div className="grid items-center gap-x-[clamp(1.5rem,4vw,4rem)] gap-y-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                {/* The figure slides behind a hard mask edge. */}
                <div className="overflow-hidden py-[0.05em]">
                  <span className="stat-value block text-[clamp(4.5rem,15vw,13rem)] leading-[0.82] font-semibold tracking-[-0.05em] text-[var(--color-night-ink)] gpu">
                    {stat.value}
                  </span>
                </div>

                <div className="overflow-hidden">
                  {/*
                    The caption carried no type styling at all — it inherited
                    17px body text and default leading, set beside a figure
                    rendering at over 200px. The pairing read as a headline with
                    a footnote stuck under it rather than as two parts of one
                    statement. It now sits at lead size with open leading, the
                    label is set with real weight rather than medium, and an
                    accent rule divides them — the same device the section
                    labels and the education stages use.
                  */}
                  <div className="stat-meta gpu">
                    <p className="text-[length:var(--step-h3)] leading-[1.05] font-semibold tracking-[-0.03em] text-[var(--color-night-ink)]">
                      {stat.label}
                    </p>

                    <span
                      aria-hidden="true"
                      className="mt-[clamp(1.25rem,3vh,1.75rem)] block h-px w-10 bg-[var(--color-accent)]"
                    />

                    <p className="mt-[clamp(1.25rem,3vh,1.75rem)] max-w-[36ch] text-[length:var(--step-lead)] leading-[1.6] text-balance text-[var(--color-night-muted)]">
                      {stat.caption}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress rail ----------------------------------------------- */}
        <div className="gutter flex shrink-0 items-center gap-4 pb-[calc(clamp(2rem,6vh,3.5rem)+var(--safe-bottom))]">
          <span className="eyebrow text-[var(--color-night-muted)]">01</span>
          <span
            className="relative h-px flex-1 overflow-hidden bg-[var(--color-night-line)]"
            aria-hidden="true"
          >
            <span className="stat-progress absolute inset-0 origin-left scale-x-0 bg-[var(--color-accent)]" />
          </span>
          <span className="eyebrow text-[var(--color-night-muted)]">
            {String(stats.length).padStart(2, "0")}
          </span>
        </div>
      </div>
    </Scene>
  );
}
