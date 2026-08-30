"use client";

import { useEffect, useRef, useState } from "react";

import { gsap, useScrollScene } from "@/hooks/useScrollScene";
import { useArmedReveal } from "@/components/education/useArmedReveal";

/**
 * -----------------------------------------------------------------------------
 * NATIONAL DISTINCTION
 * -----------------------------------------------------------------------------
 * The closing moment of the education sequence, and the one place in it that
 * gets a room of its own.
 *
 * It is made entirely of scale, spacing and a background that warms half a
 * step — no medal, no seal, no gradient, no sparkle. The two words arrive in
 * order, outlined then solid, which is the same pairing the hero uses for the
 * name; the emphasis comes from the page going quiet around them rather than
 * from anything added on top.
 *
 * `onFocus` lets the section dim the stages above while this holds the frame,
 * so the moment reads as the page attending to one thing.
 * -----------------------------------------------------------------------------
 */
export function DistinctionMoment({
  words,
  caption,
  onFocus,
}: {
  words: [string, string];
  caption?: string;
  onFocus?: (active: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const [warm, setWarm] = useState(false);

  const reducedMotion = useScrollScene(ref, (scope) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top 78%",
          end: "bottom 30%",
          invalidateOnRefresh: true,
          onEnter: () => {
            setWarm(true);
            onFocus?.(true);
          },
          onEnterBack: () => {
            setWarm(true);
            onFocus?.(true);
          },
          onLeave: () => onFocus?.(false),
          onLeaveBack: () => {
            setWarm(false);
            onFocus?.(false);
          },
          // A trigger created with its start already passed never fires a
          // toggle — the same hazard sceneTrigger documents. Without this,
          // deep-linking to #education lands the reader on a section whose
          // content is still at opacity 0. onRefresh runs on creation and on
          // every resize, so it is what makes the anchor safe.
          onRefresh: (self) => {
            setWarm(self.progress > 0);
            onFocus?.(self.isActive);
          },
        },
      });

      gsap.utils.toArray<HTMLElement>(".distinction-word").forEach((word, i) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: word,
            start: `top ${84 - i * 6}%`,
            invalidateOnRefresh: true,
            onEnter: () => setPhase((n) => Math.max(n, i + 1)),
            onLeaveBack: () => setPhase((n) => Math.min(n, i)),
            onRefresh: (self) =>
              setPhase((n) =>
                self.progress > 0 ? Math.max(n, i + 1) : Math.min(n, i),
              ),
          },
        });
      });
    });

    return () => mm.revert();
  });

  // Reduced motion never receives the focus callback above, so release any dim
  // the section may be holding and show both words outright.
  useEffect(() => {
    if (reducedMotion) onFocus?.(false);
  }, [reducedMotion, onFocus]);

  const armed = useArmedReveal(!reducedMotion);
  const shown = (i: number) => !armed || i < phase;

  return (
    <div
      ref={ref}
      className="relative isolate -mx-[var(--gutter-x)] px-[var(--gutter-x)] py-[clamp(3.5rem,11vh,7.5rem)] transition-colors duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        backgroundColor:
          !armed || warm ? "var(--color-cream)" : "var(--color-surface)",
      }}
    >
      <p className="eyebrow text-[var(--color-accent)]">Achievement</p>

      <p className="edu-display mt-[clamp(1.25rem,3.5vh,2.25rem)]">
        {words.map((word, i) => (
          <span key={word} className="distinction-word block overflow-hidden">
            <span
              className={`block ${i === 0 ? "edu-outline" : "edu-solid"} transition-[transform,opacity] duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]`}
              style={{
                transform: shown(i) ? "translateY(0)" : "translateY(102%)",
                opacity: shown(i) ? 1 : 0,
              }}
            >
              {word}
            </span>
          </span>
        ))}
      </p>

      {caption && (
        <p
          className="mt-[clamp(1.5rem,4vh,2.5rem)] max-w-[46ch] leading-[1.6] text-[var(--color-muted)] transition-opacity duration-[900ms]"
          style={{ opacity: shown(1) ? 1 : 0 }}
        >
          {caption}
        </p>
      )}
    </div>
  );
}
