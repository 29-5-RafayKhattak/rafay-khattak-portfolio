"use client";

import { motion } from "framer-motion";

import { fadeUp, IN_VIEW_SOFT, staggerGroup } from "@/lib/animations";

/**
 * What travels across the messaging layer, and where each thing goes.
 *
 * Three named flows rather than one arrow labelled "data": the useful fact
 * about this architecture is that state, experience and telemetry are separate
 * streams with separate destinations, which a single pipe would hide.
 *
 * Topic names are published interface, not internals — they are the contract
 * between robot and trainer, and naming them says nothing a reader could
 * exploit.
 */
export function DataFlows({
  flows,
}: {
  flows: { label: string; carries: string; topic: string; to: string }[];
}) {
  return (
    <motion.div
      variants={staggerGroup(0.07)}
      initial="hidden"
      whileInView="show"
      viewport={IN_VIEW_SOFT}
    >
      <motion.h3
        variants={fadeUp}
        className="text-[clamp(1.125rem,2.2vw,1.5rem)] font-semibold tracking-[-0.025em] text-[var(--color-ink)]"
      >
        Data flow
      </motion.h3>

      <motion.ul variants={fadeUp} className="mt-6 flex flex-col gap-3">
        {flows.map((flow) => (
          <li
            key={flow.label}
            className="rounded-2xl border p-[clamp(1rem,2.5vw,1.5rem)]"
            style={{
              borderColor: "var(--p-muted, var(--color-line))",
              backgroundColor: "var(--color-white)",
            }}
          >
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span
                className="text-[1rem] font-medium tracking-[-0.015em]"
                style={{ color: "var(--p-accent, var(--color-ink))" }}
              >
                {flow.label}
              </span>
              <span className="text-[0.875rem] text-[var(--color-muted)]">
                {flow.carries}
              </span>
            </div>

            {/* Wraps on a phone rather than scrolling sideways, so the
                destination is never the part that gets cut off. */}
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
              <code
                className="rounded-full border px-3 py-1.5 font-mono text-[0.8125rem] break-all"
                style={{
                  borderColor: "var(--p-muted, var(--color-line-strong))",
                  color: "var(--color-ink)",
                }}
              >
                {flow.topic}
              </code>
              <span
                aria-hidden="true"
                className="h-px w-5 shrink-0"
                style={{
                  backgroundColor: "var(--p-muted, var(--color-line-strong))",
                }}
              />
              <span className="text-[0.875rem] text-[var(--color-ink)]">
                {flow.to}
              </span>
            </div>
          </li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
