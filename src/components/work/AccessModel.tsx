"use client";

import { motion } from "framer-motion";

import { fadeUp, IN_VIEW_SOFT, staggerGroup } from "@/lib/animations";

/**
 * -----------------------------------------------------------------------------
 * ACCESS & AUDIT MODEL
 * -----------------------------------------------------------------------------
 * Security is a real part of this system, so it gets named — but at concept
 * level only. Each item below is a property the system has, not a description
 * of how it is enforced.
 *
 * What is deliberately absent: permission matrices, role identifiers, route
 * structures, cookie and session secrets, and anything else that would give a
 * reader a head start on attacking the running system. The note under the list
 * says so out loud, so the abstraction reads as a decision rather than as
 * thinness.
 * -----------------------------------------------------------------------------
 */
export function AccessModel({
  title,
  items,
  note,
}: {
  title: string;
  items: string[];
  note: string;
}) {
  return (
    <motion.section
      aria-labelledby="access-model-heading"
      variants={staggerGroup(0.06)}
      initial="hidden"
      whileInView="show"
      viewport={IN_VIEW_SOFT}
      className="border-t border-[var(--color-line)] py-[clamp(3rem,8vh,5rem)]"
    >
      <motion.h2
        id="access-model-heading"
        variants={fadeUp}
        className="text-[clamp(1.25rem,2.6vw,1.75rem)] font-semibold tracking-[-0.03em] text-[var(--color-ink)]"
      >
        {title}
      </motion.h2>

      <motion.ul
        variants={fadeUp}
        className="mt-[clamp(1.75rem,4vh,2.5rem)] grid gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-0 sm:grid-cols-2"
      >
        {items.map((item) => (
          <li
            key={item}
            className="flex items-center gap-3.5 border-t border-[var(--color-line)] py-3.5"
          >
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: "var(--p-accent, var(--color-accent))" }}
            />
            <span className="text-[0.9375rem] leading-[1.5] text-[var(--color-ink)]">
              {item}
            </span>
          </li>
        ))}
      </motion.ul>

      <motion.p
        variants={fadeUp}
        className="mt-7 max-w-[62ch] text-[0.875rem] leading-[1.6] text-[var(--color-muted)]"
      >
        {note}
      </motion.p>
    </motion.section>
  );
}
