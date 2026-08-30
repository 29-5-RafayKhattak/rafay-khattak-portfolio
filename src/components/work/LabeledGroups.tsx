"use client";

import { motion } from "framer-motion";

import { fadeUp, IN_VIEW_SOFT, staggerGroup } from "@/lib/animations";

/**
 * Titled groups of short labels.
 *
 * Used wherever the content is genuinely a list of names under headings —
 * measurement targets, tooling capabilities — and inventing a richer visual for
 * it would add decoration rather than meaning.
 */
export function LabeledGroups({
  groups,
  note,
}: {
  groups: { title: string; items: string[] }[];
  note?: string;
}) {
  return (
    <motion.div
      variants={staggerGroup(0.07)}
      initial="hidden"
      whileInView="show"
      viewport={IN_VIEW_SOFT}
    >
      <div className="grid gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-[clamp(2rem,5vh,3rem)] sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <motion.div key={group.title} variants={fadeUp}>
            <p
              className="eyebrow"
              style={{ color: "var(--p-accent, var(--color-muted))" }}
            >
              {group.title}
            </p>
            <ul className="mt-5 flex flex-col">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="border-t border-[var(--color-line)] py-3 text-[0.9375rem] leading-[1.5] text-[var(--color-ink)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {note && (
        <motion.p
          variants={fadeUp}
          className="mt-[clamp(2rem,5vh,3rem)] max-w-[62ch] text-[0.875rem] leading-[1.6] text-[var(--color-muted)]"
        >
          {note}
        </motion.p>
      )}
    </motion.div>
  );
}
