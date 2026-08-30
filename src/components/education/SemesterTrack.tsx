"use client";

import { Fragment, useRef, useState } from "react";

import { gsap, useScrollScene } from "@/hooks/useScrollScene";
import { useArmedReveal } from "@/components/education/useArmedReveal";

/**
 * -----------------------------------------------------------------------------
 * SEMESTER TRACK
 * -----------------------------------------------------------------------------
 * Completed semesters as a sequence of markers that fill left to right on
 * scroll, followed by one open marker that stands for continuing.
 *
 * WHAT IT DELIBERATELY DOES NOT SAY
 * There is no percentage, no "4 of 8", and no remaining count — the length of
 * the degree has not been stated, and every one of those would have to invent
 * it. The open marker carries "continuing" without implying how much is left,
 * which is the whole reason it is drawn as a ring rather than as a gap in a bar.
 *
 * ANIMATION OWNERSHIP
 * One ScrollTrigger per marker, firing a discrete state change on enter — the
 * same pattern the experience timeline uses. Nothing runs per frame, so
 * scrolling never drives a React render. The fill itself is a CSS transition,
 * so it eases rather than tracking the scrollbar.
 * -----------------------------------------------------------------------------
 */
export function SemesterTrack({
  completed,
  nextLabel = "Next",
}: {
  completed: number;
  nextLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(0);

  const reducedMotion = useScrollScene(ref, () => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(".semester-marker").forEach((marker, i) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: marker,
            // Staggered down the viewport so the markers light in order as the
            // stage is read, rather than all at once when the row appears.
            start: `top ${88 - i * 4}%`,
            invalidateOnRefresh: true,
            onEnter: () => setLit((n) => Math.max(n, i + 1)),
            onLeaveBack: () => setLit((n) => Math.min(n, i)),
          // A trigger created with its start already passed never fires a
          // toggle — the same hazard sceneTrigger documents. Without this,
          // deep-linking to #education lands the reader on a section whose
          // content is still at opacity 0. onRefresh runs on creation and on
          // every resize, so it is what makes the anchor safe.
            onRefresh: (self) =>
              setLit((n) =>
                self.progress > 0 ? Math.max(n, i + 1) : Math.min(n, i),
              ),
          },
        });
      });
    });

    return () => mm.revert();
  });

  // Until the reveal is armed the track is simply complete. The count is
  // information, not decoration, so it must not depend on an animation layer
  // that reduced motion — or anything else — may have stopped from running.
  const armed = useArmedReveal(!reducedMotion);
  const shown = armed ? lit : completed;

  const markers = [
    ...Array.from({ length: completed }, (_, i) => ({
      key: `s${i + 1}`,
      label: String(i + 1).padStart(2, "0"),
      done: true,
    })),
    { key: "next", label: nextLabel, done: false },
  ];

  return (
    <div ref={ref} className="w-full">
      <p className="eyebrow text-[var(--color-muted)]">Semester</p>

      <ol className="mt-5 flex items-start" aria-label="Semesters completed">
        {markers.map((marker, i) => {
          const filled = marker.done && i < shown;

          return (
            <Fragment key={marker.key}>
              <li className="semester-marker flex shrink-0 flex-col items-center gap-3">
                <span
                  aria-hidden="true"
                  className="block h-2.5 w-2.5 rounded-full border transition-[background-color,border-color,transform] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    backgroundColor: filled
                      ? "var(--color-accent)"
                      : "transparent",
                    borderColor: filled
                      ? "var(--color-accent)"
                      : "var(--color-line-strong)",
                    transform: `scale(${filled ? 1 : 0.85})`,
                  }}
                />
                <span
                  className="eyebrow text-[0.625rem] whitespace-nowrap transition-colors duration-[600ms]"
                  style={{
                    color: filled
                      ? "var(--color-ink)"
                      : "var(--color-muted)",
                  }}
                >
                  {marker.label}
                </span>
                <span className="sr-only">
                  {marker.done ? "completed" : "continuing"}
                </span>
              </li>

              {i < markers.length - 1 && (
                <span
                  aria-hidden="true"
                  /* Nudged down to meet the middle of a 10px marker. */
                  className="mt-[4.5px] h-px min-w-3 flex-1 origin-left transition-[background-color] duration-[600ms]"
                  style={{
                    backgroundColor:
                      i < shown - 1 || (marker.done && i < shown)
                        ? "var(--color-accent)"
                        : "var(--color-line)",
                  }}
                />
              )}
            </Fragment>
          );
        })}
      </ol>
    </div>
  );
}
