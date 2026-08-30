"use client";

import { useRef } from "react";

import { gsap, useScrollScene } from "@/hooks/useScrollScene";

/**
 * The interaction techniques, set as oversized editorial lines that rise out of
 * their masks one at a time — the same reveal the homepage About statement
 * uses, which is the point: this section describes scroll choreography, so it
 * demonstrates it rather than asserting it.
 *
 * Technique names only. No screens, no content, nothing operational.
 */
/*
 * On the deep background the words move through cream, sage and warm brown so
 * the list reads as one gradient of emphasis rather than four identical lines.
 * On paper it stays with the two portfolio tones.
 */
const DEEP_CYCLE = [
  "var(--p-cream, var(--color-night-ink))",
  "var(--p-muted, var(--color-night-muted))",
  "var(--p-warm, var(--color-accent))",
];
const PAPER_CYCLE = ["var(--color-ink)", "var(--color-accent)"];

export function TechniqueList({
  items,
  onDeep = false,
}: {
  items: string[];
  onDeep?: boolean;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useScrollScene(sectionRef, (scope) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(".technique-line").forEach((line, i) => {
        gsap.fromTo(
          line,
          // `y: 0` pins the pixel half of the translate; GSAP adds it to the
          // percentage half and re-reads percentages as pixels on rebuild.
          { y: 0, yPercent: 108 },
          {
            y: 0,
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: scope,
              start: `top ${78 - i * 8}%`,
              end: `top ${44 - i * 8}%`,
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    });

    return () => mm.revert();
  });

  return (
    <div ref={sectionRef}>
      <ul>
        {items.map((item, i) => (
          <li
            key={item}
            className="overflow-hidden py-[clamp(0.75rem,2vh,1.25rem)] last:border-b-0"
            style={{
              borderBottom: `1px solid ${
                onDeep ? "rgba(245,242,236,0.16)" : "var(--color-line)"
              }`,
            }}
          >
            <span
              className={[
                "block text-[clamp(1.75rem,5.5vw,3.75rem)] leading-[1.1] font-semibold tracking-[-0.04em] uppercase",
                reducedMotion ? "" : "gpu",
              ].join(" ")}
              style={{ color: onDeep ? DEEP_CYCLE[i % 3] : PAPER_CYCLE[i % 2] }}
            >
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
