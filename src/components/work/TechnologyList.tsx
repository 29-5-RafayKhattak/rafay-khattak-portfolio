"use client";

import { motion } from "framer-motion";

import { fadeUp, IN_VIEW_SOFT, staggerGroup } from "@/lib/animations";

/**
 * Bordered pills, matching the tag styling already used by the homepage
 * showcase and the experience timeline. No vendor logos: a row of brand marks
 * would drag colour into a palette built on off-white, black and one brown.
 */
export function TechnologyList({
  items,
  label = "Stack",
}: {
  items: string[];
  label?: string;
}) {
  return (
    <div>
      <p className="eyebrow mb-5 text-[var(--color-muted)]">{label}</p>
      <motion.ul
        variants={staggerGroup(0.05)}
        initial="hidden"
        whileInView="show"
        viewport={IN_VIEW_SOFT}
        className="flex flex-wrap gap-2"
      >
        {items.map((item) => (
          <motion.li key={item} variants={fadeUp}>
            {/*
              Cohesive rather than branded: a cream surface, the project accent
              as a hairline, black type. A row of official vendor colours would
              drag five unrelated hues into a palette built on three.
            */}
            <span className="tech-pill">{item}</span>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}
