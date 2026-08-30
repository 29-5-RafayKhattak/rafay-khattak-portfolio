"use client";

import { useRef, useState } from "react";

import { gsap, useScrollScene } from "@/hooks/useScrollScene";
import { StepChain } from "@/components/work/StepChain";

/**
 * -----------------------------------------------------------------------------
 * WHAT I CAN SHOW — the claims that public source actually supports
 * -----------------------------------------------------------------------------
 * Two parts, and the order matters. First the proof points, set large and
 * revealed one at a time, because each is a separate thing a reader could go
 * and verify. Then the chain a single test walks, set small underneath, because
 * it qualifies the last of those points rather than standing beside them.
 *
 * The chain carries stage names only. Putting numbers on it — an input, a
 * threshold, a result — would be inventing evidence for a test whose values
 * have not been published, which is exactly the failure the section opposite
 * this one is about.
 * -----------------------------------------------------------------------------
 */
export function ProofPoints({
  points,
  chain,
  note,
}: {
  points: string[];
  chain: string[];
  note: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(0);

  const reducedMotion = useScrollScene(sectionRef, (scope) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top 76%",
          end: "bottom 68%",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = Math.min(
              points.length,
              Math.floor(self.progress * points.length) + 1,
            );
            setReached((prev) => (prev === next ? prev : next));
          },
        },
      });
    });

    return () => mm.revert();
  });

  const on = (i: number) => reducedMotion || reached > i;

  return (
    <div ref={sectionRef}>
      {/* The proof points ---------------------------------------------- */}
      <ol className="flex flex-col">
        {points.map((point, i) => (
          <li
            key={point}
            className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-[clamp(1rem,2.5vw,2rem)] border-t py-[clamp(1.125rem,3vh,1.75rem)]"
            style={{
              borderColor: "var(--color-line)",
              opacity: on(i) ? 1 : 0.3,
              transform: on(i) ? "translateY(0)" : "translateY(8px)",
              transition:
                "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <span
              className="eyebrow tabular-nums"
              style={{
                color: on(i)
                  ? "var(--p-warm, var(--color-accent))"
                  : "var(--color-line-strong)",
                transition: "color 700ms",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className="text-[clamp(1.125rem,2.6vw,1.875rem)] leading-[1.15] font-medium tracking-[-0.03em]"
              style={{
                color: on(i)
                  ? "var(--color-ink)"
                  : "var(--p-muted, var(--color-muted))",
                transition: "color 700ms",
              }}
            >
              {point}
            </span>
          </li>
        ))}
      </ol>

      {/* What the KPI test walks --------------------------------------- */}
      <div
        className="mt-[clamp(2.5rem,7vh,4rem)] rounded-[clamp(0.875rem,1.6vw,1.5rem)] border p-[clamp(1.25rem,3.5vw,2.25rem)]"
        style={{
          borderColor: "var(--p-muted, var(--color-line))",
          backgroundColor: "var(--p-cream, var(--color-surface))",
        }}
      >
        <p className="eyebrow" style={{ color: "var(--p-accent, var(--color-muted))" }}>
          Known-data KPI test
        </p>

        <div className="mt-6">
          <StepChain steps={chain} />
        </div>

        <p className="mt-6 max-w-[58ch] text-[0.875rem] leading-[1.6] text-[var(--color-muted)]">
          {note}
        </p>
      </div>
    </div>
  );
}
