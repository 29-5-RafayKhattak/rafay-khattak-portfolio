"use client";

import { motion } from "framer-motion";
import Image from "next/image";

import type { CaseStudy } from "@/data/projects";
import { fadeUp, IN_VIEW_SOFT, staggerGroup } from "@/lib/animations";

/**
 * Real, approved project screenshots.
 *
 * Renders nothing at all while `media` is empty — deliberately. A case study
 * for a project whose screens are not cleared for publication should show no
 * screens, not a placeholder standing in for one. An empty frame captioned
 * "coming soon" is still a claim about what the interface looks like.
 *
 * To publish: drop files into /public/images/projects/<slug>/ and add entries
 * to `media` in data/projects.ts. This section appears on its own.
 */
export function ProjectMedia({
  items,
  label = "Screens",
}: {
  items: CaseStudy["media"];
  label?: string;
}) {
  if (!items.length) return null;

  return (
    <section
      data-tone="day"
      aria-labelledby="media-heading"
      className="scroll-mt-32 border-t border-[var(--color-line)] py-[clamp(3.5rem,10vh,7rem)]"
    >
      <motion.div
        variants={staggerGroup(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={IN_VIEW_SOFT}
      >
        <motion.h2 id="media-heading" variants={fadeUp} className="headline">
          {label}
        </motion.h2>

        <div className="mt-[clamp(2.5rem,7vh,4rem)] flex flex-col gap-[clamp(2rem,6vh,3.5rem)]">
          {items.map((shot) => (
            <motion.figure key={shot.src} variants={fadeUp}>
              <div className="overflow-hidden rounded-[clamp(0.875rem,1.6vw,1.5rem)] border border-[var(--color-line)] shadow-[0_28px_60px_-38px_rgba(17,17,17,0.45)]">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={shot.width}
                  height={shot.height}
                  sizes="(max-width: 1024px) 100vw, 900px"
                  className="h-auto w-full"
                />
              </div>
              {shot.caption && (
                <figcaption className="eyebrow mt-4 text-[var(--color-muted)]">
                  {shot.caption}
                </figcaption>
              )}
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
