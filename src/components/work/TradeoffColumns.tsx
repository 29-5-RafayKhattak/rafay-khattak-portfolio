"use client";

import { useRef, useState } from "react";

import { gsap, useScrollScene } from "@/hooks/useScrollScene";

/**
 * -----------------------------------------------------------------------------
 * THE TRADEOFF — the two sides of a deliberate presentation compromise
 * -----------------------------------------------------------------------------
 * The honest version of this section is that the strongest engineering evidence
 * on the project is exactly the part that cannot be shown. The section states
 * both sides rather than resolving them, and the four editorial words carry it
 * visually so it does not need a fabricated screen to look substantial.
 *
 * Rendered on the project's deep accent, supplied by the section tone — this
 * component only sets type colours, never the background.
 * -----------------------------------------------------------------------------
 */

const CREAM = "var(--p-cream, var(--color-night-ink))";
const CREAM_SOFT = "rgba(248,247,244,0.65)";
const HAIRLINE = "rgba(248,247,244,0.22)";

export function TradeoffColumns({
  left,
  right,
  words,
}: {
  left?: { title: string; items: string[] };
  right?: { title: string; items: string[] };
  words: string[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(0);

  const reducedMotion = useScrollScene(sectionRef, (scope) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top 78%",
          end: "bottom 70%",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = Math.min(
              words.length,
              Math.floor(self.progress * words.length) + 1,
            );
            setReached((prev) => (prev === next ? prev : next));
          },
        },
      });
    });

    return () => mm.revert();
  });

  const on = (i: number) => reducedMotion || reached > i;

  const column = (side: { title: string; items: string[] }) => (
    <div>
      <p className="eyebrow" style={{ color: "var(--p-warm, var(--color-accent))" }}>
        {side.title}
      </p>
      <ul className="mt-6 flex flex-col">
        {side.items.map((item) => (
          <li
            key={item}
            className="border-t py-3.5 text-[0.9375rem] leading-[1.5]"
            style={{ borderColor: HAIRLINE, color: CREAM_SOFT }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div ref={sectionRef}>
      {/*
        The two sides, held apart rather than reconciled — where there are two.
        A section with no opposing lists is carried by the words alone, and the
        top margin below closes up so they do not float in dead space.
      */}
      {(left || right) && (
        <div className="grid gap-x-[clamp(2rem,6vw,5rem)] gap-y-[clamp(2.5rem,6vh,3.5rem)] sm:grid-cols-2">
          {left && column(left)}
          {right && column(right)}
        </div>
      )}

      {/* The words the section actually turns on. */}
      <ul className={`${left || right ? "mt-[clamp(3rem,9vh,5.5rem)]" : ""} flex flex-col gap-[clamp(0.25rem,1.5vh,0.75rem)]`}>
        {words.map((word, i) => (
          <li
            key={word}
            className="text-[clamp(1.75rem,5.5vw,3.5rem)] leading-[1.06] font-semibold tracking-[-0.04em]"
            style={{
              color: on(i) ? CREAM : "rgba(248,247,244,0.22)",
              transform: on(i) ? "translateY(0)" : "translateY(12px)",
              transition:
                "color 800ms cubic-bezier(0.16,1,0.3,1), transform 800ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
}
