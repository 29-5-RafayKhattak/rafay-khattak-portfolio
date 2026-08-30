"use client";

import { motion } from "framer-motion";

import type { MetaEntry } from "@/data/projects";
import { fadeUp, IN_VIEW_SOFT, staggerGroup } from "@/lib/animations";

/**
 * The hero's secondary column: context, period, status, visibility.
 * Small uppercase labels over plain values, separated by hairlines — the same
 * register the homepage uses for its section eyebrows.
 */
export function ProjectMetadata({ entries }: { entries: MetaEntry[] }) {
  return (
    <motion.dl
      variants={staggerGroup(0.07, 0.1)}
      initial="hidden"
      whileInView="show"
      viewport={IN_VIEW_SOFT}
      className="flex flex-col"
    >
      {entries.map((entry) => (
        <motion.div
          key={entry.label}
          variants={fadeUp}
          className="border-t border-[var(--color-line)] py-4 first:border-t-0 first:pt-0"
        >
          <dt className="eyebrow text-[var(--color-muted)]">{entry.label}</dt>
          <dd className="mt-2 text-[0.9375rem] leading-[1.5] text-[var(--color-ink)]">
            {entry.value}
          </dd>
        </motion.div>
      ))}
    </motion.dl>
  );
}
