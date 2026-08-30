"use client";

import { useRef, useState } from "react";

import { gsap, useScrollScene } from "@/hooks/useScrollScene";

/**
 * The stages of the work, progressing as the reader scrolls through them.
 *
 * The caveat underneath is not decoration and is not collapsible: a case study
 * that lists "AI-assisted Development" as a stage has to be equally plain about
 * what that means for authorship. It is set as a full-width statement rather
 * than a footnote for that reason.
 */
export function ResponsibilityTrack({
  stages,
  caveat,
}: {
  stages: string[];
  caveat: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(0);

  const reducedMotion = useScrollScene(sectionRef, (scope) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(".responsibility-stage").forEach((el, i) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 78%",
            end: "bottom 30%",
            invalidateOnRefresh: true,
            onEnter: () => setReached((prev) => Math.max(prev, i + 1)),
            onEnterBack: () => setReached(i + 1),
          },
        });
      });

      gsap.fromTo(
        scope.querySelector(".responsibility-fill"),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: scope.querySelector(".responsibility-list"),
            start: "top 72%",
            end: "bottom 55%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    return () => mm.revert();
  });

  return (
    <div ref={sectionRef}>
      <div className="responsibility-list relative">
        {/* Rail ----------------------------------------------------- */}
        <span
          aria-hidden="true"
          className="absolute top-0 bottom-0 left-[7px] w-px bg-[var(--color-line)]"
        />
        <span
          aria-hidden="true"
          className="responsibility-fill absolute top-0 bottom-0 left-[7px] w-px origin-top bg-[var(--color-accent)]"
        />

        <ol className="flex flex-col">
          {stages.map((stage, i) => {
            const isReached = reducedMotion || reached > i;
            return (
              <li
                key={stage}
                className="responsibility-stage relative flex items-center gap-5 py-[clamp(0.75rem,2.2vh,1.15rem)] pl-9"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 block h-[15px] w-[15px] rounded-full border-2 border-[var(--color-canvas)] transition-[background-color,transform] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    backgroundColor: isReached
                      ? "var(--color-accent)"
                      : "var(--color-line-strong)",
                    transform: `scale(${isReached ? 1.1 : 1})`,
                  }}
                />
                <span className="eyebrow w-8 shrink-0 text-[var(--color-muted)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="text-[clamp(1.0625rem,2.2vw,1.5rem)] font-medium tracking-[-0.02em] transition-colors duration-[600ms]"
                  style={{
                    color: isReached
                      ? "var(--color-ink)"
                      : "var(--color-muted)",
                  }}
                >
                  {stage}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* The authorship caveat ------------------------------------- */}
      <p className="mt-[clamp(2rem,5vh,3rem)] border-l-2 border-[var(--color-accent)] pl-5 text-[length:var(--step-lead)] leading-[1.5] text-[var(--color-ink)]">
        {caveat}
      </p>
    </div>
  );
}
