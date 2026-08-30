"use client";

import { useRef, useState } from "react";

import { gsap, useScrollScene } from "@/hooks/useScrollScene";

/**
 * -----------------------------------------------------------------------------
 * PHASES — what is finished, and what is not
 * -----------------------------------------------------------------------------
 * The distinction between delivered and planned work is carried structurally
 * here, not in prose. A finished phase gets a filled marker, the project accent
 * and a solid rail; an unfinished one gets a hollow marker, a dashed rail and
 * the word "Upcoming" beside its number.
 *
 * That matters more on a research page than anywhere else on this site: a phase
 * list that renders planned work identically to completed work reads as a
 * finished project, which is the easiest way for a page like this to overstate
 * itself without a single false sentence.
 * -----------------------------------------------------------------------------
 */
export function PhaseTrack({
  phases,
}: {
  phases: { number: string; label: string; complete: boolean; items: string[] }[];
}) {
  const sectionRef = useRef<HTMLOListElement>(null);
  const [reached, setReached] = useState(0);

  const reducedMotion = useScrollScene(sectionRef, (scope) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top 74%",
          end: "bottom 66%",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = Math.min(
              phases.length,
              Math.floor(self.progress * phases.length) + 1,
            );
            setReached((prev) => (prev === next ? prev : next));
          },
        },
      });
    });

    return () => mm.revert();
  });

  const arrived = (i: number) => reducedMotion || reached > i;

  return (
    <ol ref={sectionRef} className="flex flex-col">
      {phases.map((phase, i) => {
        const on = arrived(i);
        // Colour tracks completion, never scroll position — a phase does not
        // become finished because the reader got to it.
        const markColor = phase.complete
          ? "var(--p-accent, var(--color-accent))"
          : "var(--p-muted, var(--color-line-strong))";

        return (
          <li
            key={phase.number}
            className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-[clamp(1rem,3vw,2.25rem)]"
            style={{
              opacity: on ? 1 : 0.32,
              transform: on ? "translateY(0)" : "translateY(10px)",
              transition:
                "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {/* Marker and rail */}
            <div className="flex flex-col items-center">
              <span
                aria-hidden="true"
                className="mt-[0.6rem] block h-3 w-3 shrink-0 rounded-full border-2"
                style={{
                  borderColor: markColor,
                  backgroundColor: phase.complete ? markColor : "transparent",
                }}
              />
              {i < phases.length - 1 && (
                <span
                  aria-hidden="true"
                  className="mt-2 w-px flex-1"
                  style={
                    phase.complete
                      ? { backgroundColor: markColor }
                      : {
                          backgroundImage: `linear-gradient(to bottom, ${"var(--p-muted, var(--color-line-strong))"} 50%, transparent 50%)`,
                          backgroundSize: "1px 8px",
                        }
                  }
                />
              )}
            </div>

            <div className="min-w-0 pb-[clamp(2rem,5vh,3rem)]">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <span
                  className="text-[clamp(1.75rem,4vw,2.75rem)] leading-[0.9] font-semibold tracking-[-0.045em] tabular-nums"
                  style={{ color: markColor }}
                >
                  {phase.number}
                </span>
                <h3 className="text-[clamp(1.0625rem,1.9vw,1.375rem)] font-medium tracking-[-0.02em] text-[var(--color-ink)]">
                  {phase.label}
                </h3>
                <span
                  className="eyebrow rounded-full border px-2.5 py-1"
                  style={{
                    borderColor: phase.complete
                      ? "var(--p-accent, var(--color-accent))"
                      : "var(--color-line-strong)",
                    color: phase.complete
                      ? "var(--p-accent, var(--color-accent))"
                      : "var(--color-muted)",
                  }}
                >
                  {phase.complete ? "Complete" : "Upcoming"}
                </span>
              </div>

              <ul className="mt-5 flex flex-wrap gap-2">
                {phase.items.map((item) => (
                  <li key={item}>
                    <span
                      className="inline-block rounded-full border px-3.5 py-1.5 text-[0.8125rem]"
                      style={{
                        borderColor: "var(--color-line)",
                        color: phase.complete
                          ? "var(--color-ink)"
                          : "var(--color-muted)",
                        backgroundColor: phase.complete
                          ? "var(--color-white)"
                          : "transparent",
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
