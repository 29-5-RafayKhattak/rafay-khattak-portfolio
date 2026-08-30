"use client";

import { useRef, useState } from "react";

import { gsap, useScrollScene } from "@/hooks/useScrollScene";

/**
 * -----------------------------------------------------------------------------
 * HOW IT GREW — the system expanding, one stage at a time
 * -----------------------------------------------------------------------------
 * Deliberately not feature cards. A row of bordered cards would present five
 * equal, simultaneous features; what actually happened is that one boundary was
 * built and the next four were added on top of it over time. So this is a
 * single vertical run with a rail that fills as the reader descends, and each
 * stage arrives only once the rail reaches it.
 *
 * The numbers carry the section — they are the largest thing on the page here,
 * because the order is the point.
 * -----------------------------------------------------------------------------
 */
export function GrowthStages({
  stages,
}: {
  stages: { number: string; label: string; note: string }[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(0);

  const reducedMotion = useScrollScene(sectionRef, (scope) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        scope.querySelector(".growth-fill"),
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: scope,
            start: "top 72%",
            end: "bottom 65%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        },
      );

      gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top 72%",
          end: "bottom 65%",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = Math.min(
              stages.length,
              Math.floor(self.progress * stages.length) + 1,
            );
            setReached((prev) => (prev === next ? prev : next));
          },
        },
      });
    });

    return () => mm.revert();
  });

  // Without motion the whole progression is simply present — the content must
  // never depend on an animation the reader has asked not to see.
  const on = (i: number) => reducedMotion || reached > i;

  return (
    <div ref={sectionRef} className="relative">
      {/* The rail, and the part of it the reader has travelled. */}
      <span
        aria-hidden="true"
        className="absolute top-0 bottom-0 left-0 w-px"
        style={{ backgroundColor: "var(--color-line)" }}
      />
      <span
        aria-hidden="true"
        className="growth-fill absolute top-0 bottom-0 left-0 w-px origin-top"
        style={{
          backgroundColor: "var(--p-accent, var(--color-accent))",
          transform: reducedMotion ? undefined : "scaleY(0)",
        }}
      />

      <ol className="flex flex-col">
        {stages.map((stage, i) => (
          <li
            key={stage.number}
            className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-[clamp(1.25rem,3vw,2.75rem)] py-[clamp(1.5rem,4vh,2.5rem)] pl-[clamp(1.25rem,3vw,2.5rem)]"
            style={{
              opacity: on(i) ? 1 : 0.32,
              transform: on(i) ? "translateY(0)" : "translateY(10px)",
              transition:
                "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <span
              className="text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.85] font-semibold tracking-[-0.05em] tabular-nums"
              style={{
                color: on(i)
                  ? "var(--p-accent, var(--color-ink))"
                  : "var(--color-line-strong)",
                transition: "color 700ms",
              }}
            >
              {stage.number}
            </span>

            <div className="min-w-0">
              <h3 className="text-[clamp(1.0625rem,1.9vw,1.375rem)] font-medium tracking-[-0.02em] text-[var(--color-ink)]">
                {stage.label}
              </h3>
              <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-[1.6] text-[var(--color-muted)]">
                {stage.note}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
