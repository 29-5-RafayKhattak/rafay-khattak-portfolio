"use client";

import { motion } from "framer-motion";
import { useRef } from "react";

import type { Contact } from "@/lib/cms/content";
import { fadeUp, IN_VIEW_SOFT, staggerGroup } from "@/lib/animations";
import { gsap, useScrollScene } from "@/hooks/useScrollScene";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * -----------------------------------------------------------------------------
 * CONTACT
 * -----------------------------------------------------------------------------
 * The page has been building for a long time by now, so this scene deliberately
 * settles: the room goes dark again, the movement stops, and what is left is
 * the sentence, the address and one button.
 *
 * ANIMATION OWNERSHIP
 *   GSAP ScrollTrigger — the statement lines rising out of their masks, which
 *                        stays tied to scroll so the arrival is unhurried.
 *   Framer Motion      — the supporting copy and CTA, which fire once on entry.
 * -----------------------------------------------------------------------------
 */
export function ContactCTA({ contact, label }: { contact: Contact; label: string }) {
  const sectionRef = useRef<HTMLElement>(null);

  useScrollScene(sectionRef, (scope) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils
        .toArray<HTMLElement>(".contact-line-inner")
        .forEach((line, i) => {
          gsap.fromTo(
            line,
            // See AboutIntro: the pixel half of the translate is pinned so it
            // cannot accumulate with the percentage half on a rebuild.
            { y: 0, yPercent: 108 },
            {
              y: 0,
              yPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: scope,
                start: `top ${72 - i * 7}%`,
                end: `top ${34 - i * 7}%`,
                scrub: 0.6,
                invalidateOnRefresh: true,
                onToggle: (self) => {
                  scope.dataset.sceneActive = String(self.isActive);
                },
              },
            },
          );
        });
    });

    return () => mm.revert();
  });

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-label={label}
      data-tone="night"
      className="on-night relative z-0 rounded-t-[clamp(1.25rem,2.6vw,2.25rem)] bg-[var(--color-night)]"
    >
      <div className="gutter py-[clamp(5rem,14vh,10rem)]">
        <SectionLabel index="07" night className="mb-[clamp(2.5rem,6vh,4rem)]">
          {label}
        </SectionLabel>

        <h2 className="display max-w-[16ch]">
          {contact.headline.map((line, i) => (
            <span key={line} className="block overflow-hidden py-[0.03em]">
              <span
                className={[
                  "contact-line-inner block gpu",
                  i === contact.headline.length - 1
                    ? "text-[var(--color-accent)]"
                    : "text-[var(--color-night-ink)]",
                ].join(" ")}
              >
                {line}
              </span>
            </span>
          ))}
        </h2>

        <motion.div
          variants={staggerGroup(0.09, 0.05)}
          initial="hidden"
          whileInView="show"
          viewport={IN_VIEW_SOFT}
          className="mt-[clamp(2.5rem,7vh,4.5rem)] flex flex-col gap-10 md:flex-row md:items-end md:justify-between"
        >
          <motion.div variants={fadeUp}>
            <p className="max-w-[38ch] text-[length:var(--step-lead)] leading-[1.45] text-[var(--color-night-muted)]">
              {contact.subline}{" "}
              <span className="text-[var(--color-night-ink)]">
                {contact.sublineAccent}
              </span>
            </p>

            <a
              href={`mailto:${contact.email}`}
              data-cursor="arrow"
              className="tap group mt-5 inline-block text-[clamp(1.05rem,2.4vw,1.65rem)] font-medium tracking-[-0.02em] text-[var(--color-night-ink)]"
            >
              {contact.email}
              <span
                aria-hidden="true"
                className="mt-1 block h-px w-full origin-left scale-x-100 bg-[var(--color-night-line)] transition-colors duration-300 group-hover:bg-[var(--color-accent)]"
              />
            </a>
          </motion.div>

          <motion.div variants={fadeUp}>
            <Button href={`mailto:${contact.email}`} arrow night>
              {contact.cta}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
