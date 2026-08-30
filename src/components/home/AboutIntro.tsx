"use client";

import { useRef } from "react";

import type { About } from "@/lib/cms/content";
import { LAYER, SCENE, sceneTrigger } from "@/lib/scene";
import { gsap, useScrollScene } from "@/hooks/useScrollScene";
import { Scene } from "@/components/layout/Scene";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * -----------------------------------------------------------------------------
 * ABOUT — the dark room
 * -----------------------------------------------------------------------------
 * The hero's last frame is already charcoal, so this scene sliding into place
 * reads as the same room rather than a new section.
 *
 * The statement does not arrive at once. Each line is masked by an
 * overflow-hidden wrapper and driven up out of it in turn, at a rate set purely
 * by scroll position.
 *
 * ANIMATION OWNERSHIP — GSAP ScrollTrigger (scrubbed) throughout.
 * -----------------------------------------------------------------------------
 */
export function AboutIntro({ about, label }: { about: About; label: string }) {
  const sectionRef = useRef<HTMLElement>(null);

  const reducedMotion = useScrollScene(sectionRef, (scope) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: sceneTrigger(scope, { scrub: 0.6 }),
      });

      gsap.utils.toArray<HTMLElement>(".about-line-inner").forEach((line, i) => {
        tl.fromTo(
          line,
          // `y: 0` pins the pixel half of the translate; GSAP adds it to the
          // percentage half and re-reads percentages as pixels on rebuild.
          { y: 0, yPercent: 106 },
          { y: 0, yPercent: 0, duration: 0.7, ease: "none" },
          i * 0.6,
        );
      });

      tl.fromTo(
        ".about-rule",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, ease: "none" },
        2.35,
      ).fromTo(
        ".about-tail",
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.6, ease: "none" },
        2.45,
      );
    });

    return () => mm.revert();
  });

  const statement = (
    <h2 className="display max-w-[18ch]">
      {about.statement.map((line) => (
        <span key={line.text} className="block overflow-hidden py-[0.03em]">
          <span
            className={[
              "about-line-inner block",
              line.accent
                ? "text-[var(--color-accent)]"
                : "text-[var(--color-night-ink)]",
              reducedMotion ? "" : "gpu",
            ].join(" ")}
          >
            {line.text}
          </span>
        </span>
      ))}
    </h2>
  );

  return (
    <Scene
      id="about"
      ariaLabel={label}
      sectionRef={sectionRef}
      content={SCENE.about}
      layer={LAYER.about}
      tone="night"
      reducedMotion={reducedMotion}
      className="on-night bg-[var(--color-night)]"
      stageClassName="flex flex-col justify-center"
      fallback={
        <>
          <SectionLabel index="01" night className="mb-10">
            {label}
          </SectionLabel>
          {statement}
          <p className="mt-8 max-w-[52ch] text-[length:var(--step-lead)] leading-[1.5] text-[var(--color-night-muted)]">
            {about.paragraph}
          </p>
        </>
      }
    >
      <div className="gutter w-full">
        <SectionLabel
          index="01"
          night
          className="mb-[clamp(1.75rem,4.5vh,3.25rem)]"
        >
          {label}
        </SectionLabel>

        {statement}

        <div className="mt-[clamp(1.75rem,4.5vh,3.25rem)]">
          <span
            className="about-rule block h-px w-full origin-left bg-[var(--color-night-line)]"
            aria-hidden="true"
          />
          <p className="about-tail mt-6 max-w-[54ch] text-[length:var(--step-lead)] leading-[1.5] text-[var(--color-night-muted)]">
            {about.paragraph}
          </p>
        </div>
      </div>
    </Scene>
  );
}
