"use client";

import { motion } from "framer-motion";

import { fadeUp, IN_VIEW_SOFT, staggerGroup } from "@/lib/animations";

/**
 * What is and is not currently available.
 *
 * Set as typographic rows rather than status cards: a row of green tick badges
 * would read as a health dashboard and quietly overstate a prototype that is
 * not running. The unavailable row is styled at the same weight as the rest —
 * it is a fact about the project, not a failure to apologise for.
 */
export function StatusList({
  items,
}: {
  items: { label: string; value: string; available: boolean }[];
}) {
  return (
    <motion.dl
      variants={staggerGroup(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={IN_VIEW_SOFT}
      className="max-w-[42rem]"
    >
      {items.map((item) => (
        <motion.div
          key={item.label}
          variants={fadeUp}
          className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-[var(--color-line)] py-5 first:border-t-0 first:pt-0"
        >
          <dt className="eyebrow text-[var(--color-muted)]">{item.label}</dt>
          <dd className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="text-[0.875rem]"
              style={{
                color: item.available
                  ? "var(--p-accent, var(--color-accent))"
                  : "var(--color-line-strong)",
              }}
            >
              {item.available ? "✓" : "○"}
            </span>
            <span
              className="text-[1.0625rem] tracking-[-0.01em]"
              style={{
                color: item.available
                  ? "var(--color-ink)"
                  : "var(--color-muted)",
              }}
            >
              {item.value}
            </span>
          </dd>
        </motion.div>
      ))}
    </motion.dl>
  );
}
