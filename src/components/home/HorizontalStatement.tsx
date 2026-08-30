"use client";

import { useRef } from "react";

import { LAYER, SCENE, sceneTrigger } from "@/lib/scene";
import { gsap, useScrollScene } from "@/hooks/useScrollScene";
import { Scene } from "@/components/layout/Scene";

/**
 * -----------------------------------------------------------------------------
 * THE HORIZONTAL MOMENT
 * -----------------------------------------------------------------------------
 * Vertical scrolling is translated into horizontal travel for one run of giant
 * words. Native scrolling is never intercepted — the page still scrolls down,
 * the words simply move sideways while it does, so a trackpad, a wheel and a
 * touchscreen all behave exactly as the reader expects.
 *
 * The distance is measured from the actual rendered track width rather than
 * guessed, and re-measured on resize via `invalidateOnRefresh`.
 *
 * ANIMATION OWNERSHIP — GSAP ScrollTrigger (scrubbed).
 * -----------------------------------------------------------------------------
 */
export function HorizontalStatement({
  horizontalWords,
}: {
  horizontalWords: string[];
}) {
  const sectionRef = useRef<HTMLElement>(null);

  const reducedMotion = useScrollScene(sectionRef, (scope) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const track = scope.querySelector<HTMLElement>(".statement-track");
      if (!track) return;

      const tl = gsap.timeline({
        scrollTrigger: sceneTrigger(scope, { scrub: 0.7 }),
      });

      tl.fromTo(
        track,
        // Starts just off the right edge and travels until its tail clears
        // the left one. Recomputed on every refresh so it stays exact.
        { x: () => window.innerWidth * 0.12 },
        {
          x: () => -(track.scrollWidth - window.innerWidth * 0.88),
          ease: "none",
          duration: 1,
        },
        0,
      );

      // The rule beneath fills as the words pass.
      tl.fromTo(
        ".statement-rule",
        { scaleX: 0 },
        { scaleX: 1, ease: "none", duration: 1 },
        0,
      );
    });

    return () => mm.revert();
  });

  const words = (
    <>
      {horizontalWords.map((word, i) => (
        <span key={word} className="flex shrink-0 items-center">
          <span
            className={[
              "name-line",
              i % 2 === 1 ? "name-outline" : "name-solid",
            ].join(" ")}
            style={{ fontSize: "clamp(3.5rem, 15vw, 13rem)" }}
          >
            {word}
          </span>
          <span
            aria-hidden="true"
            className="mx-[0.28em] inline-block h-[0.09em] w-[0.36em] shrink-0 bg-[var(--color-accent)]"
            style={{ fontSize: "clamp(3.5rem, 15vw, 13rem)" }}
          />
        </span>
      ))}
    </>
  );

  return (
    <Scene
      ariaLabel="What I work on"
      sectionRef={sectionRef}
      content={SCENE.statement}
      layer={LAYER.statement}
      roundedTop
      reducedMotion={reducedMotion}
      className="bg-[var(--color-canvas)]"
      stageClassName="flex flex-col justify-center"
      fallback={
        <ul className="flex flex-wrap gap-x-8 gap-y-2">
          {horizontalWords.map((word) => (
            <li
              key={word}
              className="text-[clamp(2rem,9vw,4.5rem)] leading-[1.05] font-bold tracking-[-0.04em]"
            >
              {word}
            </li>
          ))}
        </ul>
      }
    >
      <div className="flex h-full flex-col justify-center">
        <div className="gutter mb-[clamp(1.5rem,4vh,2.5rem)]">
          <span className="eyebrow text-[var(--color-muted)]">
            What I work on
          </span>
        </div>

        {/* The track is wider than the viewport by design; the parent clips
            it, so the page itself never scrolls sideways. */}
        <div className="relative w-full overflow-hidden">
          <div className="statement-track flex w-max items-center gpu">
            {words}
          </div>
        </div>

        <div className="gutter mt-[clamp(1.5rem,4vh,2.5rem)]">
          <span
            className="statement-rule block h-px w-full origin-left bg-[var(--color-line-strong)]"
            aria-hidden="true"
          />
        </div>
      </div>
    </Scene>
  );
}
