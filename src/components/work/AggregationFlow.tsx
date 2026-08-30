"use client";

import { motion } from "framer-motion";

import { fadeUp, IN_VIEW_SOFT, staggerGroup } from "@/lib/animations";

/**
 * A grouping transformation, named without being numbered.
 *
 * Records go in, they are grouped, five measures come out per group. Every
 * value that would make this concrete — a symbol, a price, a volume — is
 * absent on purpose: inventing a row of market data to fill the table would
 * fabricate output for a pipeline whose real runs are not published, and it
 * would make a systems project look like a trading product.
 */
export function AggregationFlow({
  source,
  groupBy,
  measures,
  output,
  note,
}: {
  source: string;
  groupBy: string;
  measures: string[];
  output: string;
  note: { title: string; body: string; formula: string };
}) {
  const band = (label: string) => (
    <div
      className="rounded-2xl border px-5 py-4 text-center"
      style={{
        borderColor: "var(--p-muted, var(--color-line))",
        backgroundColor: "var(--color-white)",
      }}
    >
      <p className="text-[clamp(0.9375rem,1.6vw,1.125rem)] font-medium tracking-[-0.015em] text-[var(--color-ink)]">
        {label}
      </p>
    </div>
  );

  const connector = (
    <div aria-hidden="true" className="flex justify-center py-2">
      <span
        className="block h-5 w-px"
        style={{ backgroundColor: "var(--p-accent, var(--color-line-strong))" }}
      />
    </div>
  );

  return (
    <motion.div
      variants={staggerGroup(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={IN_VIEW_SOFT}
    >
      <motion.div variants={fadeUp}>{band(source)}</motion.div>
      {connector}
      <motion.div variants={fadeUp}>{band(groupBy)}</motion.div>
      {connector}

      {/* The five measures are peers, so they sit side by side rather than
          stacking into an order the implementation does not have. */}
      <motion.ul
        variants={fadeUp}
        className="grid grid-cols-2 gap-2.5 sm:grid-cols-5"
      >
        {measures.map((measure) => (
          <li
            key={measure}
            className="rounded-2xl border px-3 py-4 text-center"
            style={{
              borderColor: "var(--p-warm, var(--color-accent))",
              backgroundColor:
                "color-mix(in srgb, var(--p-warm, var(--color-accent)) 10%, transparent)",
            }}
          >
            <span
              className="text-[0.875rem] font-medium tracking-[-0.01em]"
              style={{ color: "var(--p-warm, var(--color-accent))" }}
            >
              {measure}
            </span>
          </li>
        ))}
      </motion.ul>

      {connector}
      <motion.div variants={fadeUp}>{band(output)}</motion.div>

      {/* One measure needs a definition; the rest do not. */}
      <motion.div
        variants={fadeUp}
        className="mt-[clamp(2rem,5vh,3rem)] rounded-[clamp(0.875rem,1.6vw,1.5rem)] border p-[clamp(1.25rem,3vw,2rem)]"
        style={{
          borderColor: "var(--p-muted, var(--color-line))",
          backgroundColor: "var(--p-surface-soft, var(--color-surface))",
        }}
      >
        <p
          className="eyebrow"
          style={{ color: "var(--p-warm, var(--color-accent))" }}
        >
          {note.title}
        </p>
        <p className="mt-4 max-w-[60ch] text-[0.9375rem] leading-[1.6] text-[var(--color-ink)]">
          {note.body}
        </p>
        {/* Scrolls inside its own box so a long formula never widens the page. */}
        <div className="mt-5 overflow-x-auto">
          <code
            className="block font-mono text-[0.875rem] whitespace-nowrap"
            style={{ color: "var(--p-accent, var(--color-muted))" }}
          >
            {note.formula}
          </code>
        </div>
      </motion.div>
    </motion.div>
  );
}
