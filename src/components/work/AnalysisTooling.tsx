"use client";

import { motion } from "framer-motion";

import { fadeUp, IN_VIEW_SOFT } from "@/lib/animations";
import { LabeledGroups } from "@/components/work/LabeledGroups";

/**
 * Tooling that exists, described by what it can produce.
 *
 * The distinction this section has to hold is between capability and result:
 * the figures can be generated, and none of them are shown here because none
 * have been produced from a real run yet. Saying the tooling is
 * publication-ready is supportable; implying a publication is not.
 */
export function AnalysisTooling({
  groups,
}: {
  groups: { title: string; items: string[] }[];
}) {
  return (
    <section
      data-tone="day"
      aria-labelledby="tooling-heading"
      className="border-t border-[var(--color-line)] py-[clamp(3rem,8vh,5rem)]"
    >
      <motion.h2
        id="tooling-heading"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={IN_VIEW_SOFT}
        className="mb-[clamp(1.75rem,4vh,2.5rem)] text-[clamp(1.25rem,2.6vw,1.75rem)] font-semibold tracking-[-0.03em] text-[var(--color-ink)]"
      >
        Analysis Tooling
      </motion.h2>

      <LabeledGroups
        groups={groups}
        note="The tooling can generate high-resolution figures suitable for research analysis and publication preparation. No figures are reproduced on this page — none have been produced from a completed experimental run, and nothing here has been submitted or published."
      />
    </section>
  );
}
