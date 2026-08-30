"use client";

import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";

import { fadeUp, IN_VIEW_SOFT, staggerGroup } from "@/lib/animations";

/**
 * What is publishable and what is not, side by side.
 *
 * Set as two equal editorial columns rather than a "good list" and a "bad
 * list". Nothing here is a warning: withholding a client's source and
 * operational data is normal professional conduct, and styling it as an error
 * state would misrepresent that.
 */
export function DisclosureLists({
  canShow,
  withheld,
  titles = { canShow: "Can show", withheld: "Private" },
}: {
  canShow: string[];
  withheld: string[];
  /** The same two-column shape serves "can show / private" and
   *  "verified / not verified"; only the headings differ. */
  titles?: { canShow: string; withheld: string };
}) {
  const columns = [
    { title: titles.canShow, items: canShow, accent: true },
    { title: titles.withheld, items: withheld, accent: false },
  ];

  return (
    <motion.div
      variants={staggerGroup(0.1)}
      initial="hidden"
      whileInView="show"
      viewport={IN_VIEW_SOFT}
      className="grid gap-[clamp(1.5rem,4vw,3rem)] sm:grid-cols-2"
    >
      {columns.map((column) => (
        <motion.div
          key={column.title}
          variants={fadeUp}
          className="rounded-[clamp(1rem,2vw,1.5rem)] border border-[var(--color-line)] bg-[var(--color-surface)] p-[clamp(1.5rem,3vw,2.25rem)]"
        >
          <div className="flex items-center gap-3">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full"
              style={{
                backgroundColor: column.accent
                  ? "var(--color-accent-soft)"
                  : "rgba(17,17,17,0.05)",
              }}
              aria-hidden="true"
            >
              {column.accent ? (
                <Check
                  className="h-3.5 w-3.5 text-[var(--color-accent)]"
                  strokeWidth={2.2}
                />
              ) : (
                <Minus
                  className="h-3.5 w-3.5 text-[var(--color-muted)]"
                  strokeWidth={2.2}
                />
              )}
            </span>
            <h3 className="eyebrow text-[var(--color-ink)]">{column.title}</h3>
          </div>

          <ul className="mt-6 flex flex-col">
            {column.items.map((item) => (
              <li
                key={item}
                className="border-t border-[var(--color-line)] py-3 text-[0.9375rem] leading-[1.45] text-[var(--color-muted)] first:border-t-0 first:pt-0"
              >
                {item}
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </motion.div>
  );
}
