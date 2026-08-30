"use client";

import { motion } from "framer-motion";

import { fadeUp, IN_VIEW_SOFT, staggerGroup } from "@/lib/animations";

/**
 * A gap in the work, stated rather than designed around.
 *
 * The motion here is deliberately the calmest on the page: no scrub, no
 * staging, no reveal that makes the absence of tests look like a feature. It
 * arrives once and sits still.
 */
export function KnownGap({
  label,
  subject,
  status,
  next,
}: {
  label: string;
  subject: string;
  status: string;
  next: string;
}) {
  return (
    <motion.div
      variants={staggerGroup(0.08)}
      initial="hidden"
      whileInView="show"
      viewport={IN_VIEW_SOFT}
      className="rounded-[clamp(0.875rem,1.6vw,1.5rem)] border p-[clamp(1.5rem,4vw,2.75rem)]"
      style={{
        borderColor: "var(--p-muted, var(--color-line))",
        backgroundColor: "var(--p-cream, var(--color-surface))",
      }}
    >
      <motion.p
        variants={fadeUp}
        className="eyebrow"
        style={{ color: "var(--p-warm, var(--color-accent))" }}
      >
        {label}
      </motion.p>

      <motion.h3
        variants={fadeUp}
        className="mt-4 text-[clamp(1.375rem,3.2vw,2.125rem)] leading-[1.1] font-semibold tracking-[-0.035em] text-[var(--color-ink)]"
      >
        {subject}
      </motion.h3>

      <motion.dl
        variants={fadeUp}
        className="mt-[clamp(1.75rem,4vh,2.5rem)] grid gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-6 sm:grid-cols-2"
      >
        <div className="border-t pt-4" style={{ borderColor: "var(--color-line)" }}>
          <dt className="eyebrow text-[var(--color-muted)]">Status</dt>
          <dd
            className="mt-2 text-[0.9375rem] leading-[1.5]"
            style={{ color: "var(--p-accent, var(--color-ink))" }}
          >
            {status}
          </dd>
        </div>
        <div className="border-t pt-4" style={{ borderColor: "var(--color-line)" }}>
          <dt className="eyebrow text-[var(--color-muted)]">Next improvement</dt>
          <dd className="mt-2 text-[0.9375rem] leading-[1.5] text-[var(--color-muted)]">
            {next}
          </dd>
        </div>
      </motion.dl>
    </motion.div>
  );
}
