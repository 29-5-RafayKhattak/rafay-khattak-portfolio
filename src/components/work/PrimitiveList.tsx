"use client";

import { useRef, useState } from "react";

import { gsap, useScrollScene } from "@/hooks/useScrollScene";

/**
 * Low-level primitives, set large and revealed one at a time.
 *
 * Named rather than explained. Anyone who recognises "named semaphores" needs
 * no gloss, and anyone who does not is not going to be convinced by a sentence
 * of paraphrase — the useful signal is which primitives the work actually
 * touched, so the list is the content.
 */
export function PrimitiveList({ items }: { items: string[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [reached, setReached] = useState(0);

  const reducedMotion = useScrollScene(sectionRef, (scope) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top 78%",
          end: "bottom 62%",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = Math.min(
              items.length,
              Math.floor(self.progress * items.length) + 1,
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
      <p
        className="eyebrow"
        style={{ color: "var(--p-accent, var(--color-muted))" }}
      >
        Systems primitives
      </p>

      <ul className="mt-6 grid gap-x-[clamp(1.5rem,4vw,3rem)] sm:grid-cols-2">
        {items.map((item, i) => (
          <li
            key={item}
            className="border-t py-[clamp(0.75rem,2vh,1.125rem)] font-mono text-[clamp(1rem,2.2vw,1.5rem)] tracking-[-0.02em]"
            style={{
              borderColor: "var(--color-line)",
              color: on(i)
                ? "var(--color-ink)"
                : "var(--p-muted, var(--color-muted))",
              opacity: on(i) ? 1 : 0.45,
              transform: on(i) ? "translateY(0)" : "translateY(8px)",
              transition:
                "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1), color 700ms",
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
