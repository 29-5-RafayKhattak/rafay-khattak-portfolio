"use client";

import { useRef, useState } from "react";

import { gsap, useScrollScene } from "@/hooks/useScrollScene";
import { useArmedReveal } from "@/components/education/useArmedReveal";

/**
 * -----------------------------------------------------------------------------
 * GRADE REVEAL
 * -----------------------------------------------------------------------------
 * Individual grades set at display scale, arriving one at a time as the stage
 * is scrolled through.
 *
 * The reveal is a clip and a lift — the character rises into a masked box —
 * rather than a fade, so it reads as typography being set rather than an
 * element appearing. Deliberately no bounce, no scale-in and no celebratory
 * treatment: the grades are meant to carry by scale and spacing alone.
 *
 * One ScrollTrigger per grade at a staggered start, so the sequence is driven
 * by scroll position without anything running per frame.
 * -----------------------------------------------------------------------------
 */
export function GradeReveal({
  grades,
  label = "Result",
}: {
  grades: string[];
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);

  const reducedMotion = useScrollScene(ref, () => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(".grade-item").forEach((item, i) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: `top ${86 - i * 5}%`,
            invalidateOnRefresh: true,
            onEnter: () => setShown((n) => Math.max(n, i + 1)),
            onLeaveBack: () => setShown((n) => Math.min(n, i)),
          // A trigger created with its start already passed never fires a
          // toggle — the same hazard sceneTrigger documents. Without this,
          // deep-linking to #education lands the reader on a section whose
          // content is still at opacity 0. onRefresh runs on creation and on
          // every resize, so it is what makes the anchor safe.
            onRefresh: (self) =>
              setShown((n) =>
                self.progress > 0 ? Math.max(n, i + 1) : Math.min(n, i),
              ),
          },
        });
      });
    });

    return () => mm.revert();
  });

  const armed = useArmedReveal(!reducedMotion);
  const revealed = (i: number) => !armed || i < shown;

  return (
    <div ref={ref}>
      <p className="eyebrow text-[var(--color-muted)]">{label}</p>

      <ol className="mt-4 flex flex-wrap items-baseline gap-x-[clamp(1rem,4vw,2.75rem)] gap-y-2">
        {grades.map((grade, i) => (
          <li key={`${grade}-${i}`} className="grade-item overflow-hidden">
            <span
              className="block text-[clamp(3rem,11vw,7rem)] leading-[1.05] font-semibold tracking-[-0.05em] text-[var(--color-ink)] transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{
                transform: revealed(i) ? "translateY(0)" : "translateY(105%)",
                opacity: revealed(i) ? 1 : 0,
                transitionDelay: armed ? `${i * 60}ms` : "0ms",
              }}
            >
              {grade}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
