"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";

import { experience, sectionLabels } from "@/data/portfolio";
import { fadeUp, IN_VIEW_SOFT, staggerGroup } from "@/lib/animations";
import { FINE_POINTER, useMediaQuery } from "@/hooks/useMediaQuery";
import { gsap, useScrollScene } from "@/hooks/useScrollScene";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * -----------------------------------------------------------------------------
 * EXPERIENCE
 * -----------------------------------------------------------------------------
 * Not pinned. After four pinned scenes the page hands control back, so this
 * reads as an ordinary column — but only one entry is ever *in focus*, and
 * which one is decided by two inputs at once:
 *
 *   scroll  — whichever row is nearest the middle of the viewport
 *   hover   — takes over the moment the pointer lands on a row
 *
 * Hover wins while it is held and releases back to scroll on exit, so the
 * section reads as a slow scroll-driven sequence until you touch it, then
 * becomes directly manipulable. Touch devices never register hover and simply
 * keep the scroll behaviour.
 *
 * The focused row is stated four ways at once — the accent rule filling down
 * its left edge, the year colouring, the logo coming up out of greyscale, and
 * the whole row stepping forward — so the change reads as a single deliberate
 * shift in attention rather than four separate effects.
 *
 * ANIMATION OWNERSHIP
 *   GSAP ScrollTrigger — which row is active (a toggle, not a scrub).
 *   Framer Motion      — the once-only entrance, on the row wrapper.
 *   CSS transitions    — the focus change itself, so it eases rather than
 *                        tracking scroll 1:1.
 * Each owns a different element, so none of them contend.
 * -----------------------------------------------------------------------------
 */
export function ExperienceTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollActive, setScrollActive] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const finePointer = useMediaQuery(FINE_POINTER);
  const active = hovered ?? scrollActive;

  const reducedMotion = useScrollScene(sectionRef, () => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(".experience-row").forEach((row, i) => {
        gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 62%",
            end: "bottom 38%",
            onEnter: () => setScrollActive(i),
            onEnterBack: () => setScrollActive(i),
            invalidateOnRefresh: true,
          },
        });
      });
    });

    return () => mm.revert();
  });

  return (
    <section
      id="experience"
      ref={sectionRef}
      aria-label={sectionLabels.experience}
      className="relative z-0 bg-[var(--color-canvas)]"
    >
      <div className="gutter py-[clamp(4.5rem,12vh,9rem)]">
        <SectionLabel index="04" className="mb-[clamp(2.5rem,7vh,5rem)]">
          {sectionLabels.experience}
        </SectionLabel>

        <motion.ol
          variants={staggerGroup(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={IN_VIEW_SOFT}
        >
          {experience.map((item, i) => {
            // Reduced motion gets every row at full strength: the focus
            // treatment is decoration, and the content must not depend on it.
            const isActive = reducedMotion || active === i;

            return (
              <motion.li
                key={`${item.company}-${item.period}`}
                variants={fadeUp}
                className="experience-row group relative border-l border-[var(--color-line)]"
                onMouseEnter={finePointer ? () => setHovered(i) : undefined}
                onMouseLeave={finePointer ? () => setHovered(null) : undefined}
              >
                {/* The rule fills down the row's left edge as it takes focus. */}
                <span
                  aria-hidden="true"
                  className="absolute top-0 -left-px h-full w-[2px] origin-top bg-[var(--color-accent)] transition-transform duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{ transform: `scaleY(${isActive ? 1 : 0})` }}
                />

                <div
                  className="grid gap-x-[clamp(1.5rem,4vw,4rem)] gap-y-5 py-[clamp(2rem,5vh,3.25rem)] pl-[clamp(1.25rem,3vw,2.75rem)] transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]"
                  style={{
                    opacity: isActive ? 1 : 0.3,
                    transform: `translateX(${isActive ? "8px" : "0px"})`,
                  }}
                >
                  {/* Year — the typographic anchor of the row. -------- */}
                  <div className="flex items-baseline gap-4 md:flex-col md:items-start md:gap-2">
                    <span
                      className="text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[0.85] font-semibold tracking-[-0.045em] transition-colors duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        color: isActive
                          ? "var(--color-accent)"
                          : "var(--color-line-strong)",
                      }}
                    >
                      {item.year}
                    </span>
                    <span className="eyebrow text-[var(--color-muted)]">
                      {item.period}
                    </span>
                  </div>

                  {/* Body -------------------------------------------- */}
                  <div className="flex items-start gap-4 sm:gap-5">
                    {item.logo && (
                      <span
                        className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-line)] bg-[var(--color-white)] p-2 transition-[filter,transform,box-shadow] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:h-14 sm:w-14"
                        style={{
                          filter: isActive ? "none" : "grayscale(1)",
                          transform: `scale(${isActive ? 1.04 : 1})`,
                          boxShadow: isActive
                            ? "0 12px 28px -18px rgba(17,17,17,0.45)"
                            : "none",
                        }}
                      >
                        <Image
                          src={item.logo}
                          alt={`${item.company} logo`}
                          width={112}
                          height={112}
                          className="h-full w-full object-contain"
                        />
                      </span>
                    )}

                    <div className="min-w-0">
                      <h3 className="text-[var(--step-h3)] leading-[1.08] font-semibold tracking-[-0.03em] text-balance">
                        {item.role}
                      </h3>

                      <p className="mt-2 text-[var(--step-body)] text-[var(--color-muted)]">
                        <span className="text-[var(--color-ink)]">
                          {item.company}
                        </span>
                        <span
                          aria-hidden="true"
                          className="mx-2 text-[var(--color-line-strong)]"
                        >
                          /
                        </span>
                        {/* Kept whole: "Full-time" otherwise breaks at its
                            hyphen when the company name wraps. */}
                        <span className="whitespace-nowrap">{item.type}</span>
                      </p>

                      {item.location && (
                        <p className="eyebrow mt-2.5 text-[var(--color-muted)]">
                          {item.location}
                        </p>
                      )}

                      {item.summary && (
                        <p className="mt-4 max-w-[56ch] leading-[1.55] text-[var(--color-muted)]">
                          {item.summary}
                        </p>
                      )}

                      {item.skills && item.skills.length > 0 && (
                        <ul className="mt-5 flex flex-wrap gap-2">
                          {item.skills.map((skill) => (
                            <li
                              key={skill}
                              className="rounded-full border border-[var(--color-line)] px-3 py-1 text-[0.75rem] whitespace-nowrap text-[var(--color-muted)] transition-colors duration-[600ms]"
                              style={
                                isActive
                                  ? {
                                      borderColor: "var(--color-line-strong)",
                                      color: "var(--color-ink)",
                                    }
                                  : undefined
                              }
                            >
                              {skill}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      </div>
    </section>
  );
}
