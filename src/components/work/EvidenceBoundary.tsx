"use client";

import { motion } from "framer-motion";

import { fadeUp, IN_VIEW_SOFT, staggerGroup } from "@/lib/animations";

/**
 * The claim boundary, stated plainly: what the work can be shown to support,
 * and what is not being claimed on top of it.
 *
 * A two-column editorial block on a single hairline grid — no cards, no icons,
 * no colour coding. The second column is the more important one and is set at
 * the same weight as the first for exactly that reason.
 */
export function EvidenceBoundary({
  supported,
  notOverstated,
}: {
  supported: string;
  notOverstated: string;
}) {
  const columns = [
    { label: "Supported", body: supported, accent: true },
    { label: "Not overstated", body: notOverstated, accent: false },
  ];

  return (
    <section
      data-tone="day"
      aria-labelledby="evidence-heading"
      className="relative isolate scroll-mt-32 py-[clamp(3.5rem,10vh,7rem)]"
    >
      {/* Cream rather than sage: a half-step down from the section above, so
          the soft stretch closes instead of simply continuing. */}
      <span
        aria-hidden="true"
        className="case-bleed"
        style={{ backgroundColor: "var(--p-cream, var(--color-surface))" }}
      />
      <motion.div
        variants={staggerGroup(0.09)}
        initial="hidden"
        whileInView="show"
        viewport={IN_VIEW_SOFT}
      >
        <motion.h2
          id="evidence-heading"
          variants={fadeUp}
          className="headline max-w-[16ch]"
        >
          Evidence boundary
        </motion.h2>

        <motion.div
          variants={fadeUp}
          className="mt-[clamp(2.5rem,6vh,4rem)] grid gap-x-[clamp(2rem,5vw,4.5rem)] gap-y-10 md:grid-cols-2"
        >
          {columns.map((column) => (
            <div key={column.label}>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="block h-[7px] w-[7px] rounded-full"
                  style={{
                    backgroundColor: column.accent
                      ? "var(--p-accent, var(--color-accent))"
                      : "var(--color-line-strong)",
                  }}
                />
                <h3 className="eyebrow text-[var(--color-muted)]">
                  {column.label}
                </h3>
              </div>

              <p
                className="mt-5 border-t pt-6 text-[length:var(--step-lead)] leading-[1.55]"
                style={{
                  borderColor: column.accent
                    ? "var(--p-accent, var(--color-accent))"
                    : "var(--color-line)",
                  color: column.accent
                    ? "var(--color-ink)"
                    : "var(--color-muted)",
                }}
              >
                {column.body}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
