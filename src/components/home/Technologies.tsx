"use client";

import { useRef } from "react";

import { sectionLabels, technologies } from "@/data/portfolio";
import { gsap, useScrollScene } from "@/hooks/useScrollScene";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * -----------------------------------------------------------------------------
 * TOOLKIT
 * -----------------------------------------------------------------------------
 * No percentage bars — a number next to "React" claims a precision nobody has.
 * Instead the stack is set as two editorial rows of names that drift past each
 * other in opposite directions as the section is scrolled through, which gives
 * the list a reason to be read rather than skimmed.
 *
 * Each row is duplicated once so the run never shows its end; the copy is
 * hidden from assistive technology.
 *
 * ANIMATION OWNERSHIP — GSAP ScrollTrigger (scrubbed).
 * -----------------------------------------------------------------------------
 */
export function Technologies() {
  const sectionRef = useRef<HTMLElement>(null);

  const reducedMotion = useScrollScene(sectionRef, (scope) => {
    const mm = gsap.matchMedia();

    // Desktop and tablet get the full opposing drift.
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      buildDrift(scope, 1);
    });

    // Phones get a shorter throw so the names stay on screen long enough
    // to actually be read.
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      buildDrift(scope, 0.45);
    });

    return () => mm.revert();
  });

  const rows = [technologies, [...technologies].reverse()];
  // The second copy only exists to hide the end of a drifting row. With the
  // drift off it is dead weight, and the row wraps normally instead.
  const copies = reducedMotion ? [0] : [0, 1];

  return (
    <section
      ref={sectionRef}
      aria-label={sectionLabels.technologies}
      className="relative z-0 overflow-hidden bg-[var(--color-canvas)] pt-[clamp(1rem,4vh,3rem)] pb-[clamp(5rem,13vh,9rem)]"
    >
      <div className="gutter">
        <SectionLabel index="06" className="mb-[clamp(2rem,5vh,3.5rem)]">
          {sectionLabels.technologies}
        </SectionLabel>
      </div>

      <div className="flex flex-col gap-[clamp(0.5rem,1.5vh,1rem)]">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="relative w-full overflow-hidden">
            <div
              className={[
                `tech-row tech-row-${rowIndex} flex items-center`,
                reducedMotion ? "w-full flex-wrap" : "w-max gpu",
              ].join(" ")}
            >
              {copies.map((copy) => (
                <ul
                  key={copy}
                  className={
                    reducedMotion
                      ? "flex flex-wrap items-center"
                      : "flex shrink-0 items-center"
                  }
                  aria-hidden={copy === 1 ? "true" : undefined}
                >
                  {row.map((tech) => (
                    <li
                      key={tech}
                      className="group flex shrink-0 items-center"
                    >
                      <span
                        className={[
                          "px-[0.28em] text-[clamp(1.75rem,5.5vw,4.25rem)] leading-[1.25] font-medium tracking-[-0.03em] whitespace-nowrap",
                          rowIndex === 1
                            ? "text-[var(--color-muted)]"
                            : "text-[var(--color-ink)]",
                        ].join(" ")}
                      >
                        {tech}
                      </span>
                      <span
                        aria-hidden="true"
                        className="h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]"
                      />
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Both rows travel the width of one copy of the list, in opposite directions,
 * across the section's pass through the viewport. Distances are read from the
 * DOM on refresh so they stay correct through resizes and font swaps.
 */
function buildDrift(scope: HTMLElement, intensity: number) {
  gsap.utils.toArray<HTMLElement>(".tech-row").forEach((row, i) => {
    const forward = i % 2 === 0;
    const distance = () => (row.scrollWidth / 2) * intensity;

    gsap.fromTo(
      row,
      { x: () => (forward ? 0 : -distance()) },
      {
        x: () => (forward ? -distance() : 0),
        ease: "none",
        scrollTrigger: {
          trigger: scope,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            scope.dataset.sceneActive = String(self.isActive);
          },
        },
      },
    );
  });
}
