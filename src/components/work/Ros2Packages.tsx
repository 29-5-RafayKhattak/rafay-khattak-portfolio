"use client";

import { motion } from "framer-motion";

import { fadeUp, IN_VIEW_SOFT, staggerGroup } from "@/lib/animations";

/**
 * The source modules the system is actually divided into.
 *
 * Names of packages and what each is for — deliberately no deeper. Package
 * boundaries are the useful architectural fact; their internals are not
 * something a case study can show responsibly or a reader can verify.
 */
export function Ros2Packages({
  packages,
}: {
  packages: { name: string; note: string }[];
}) {
  return (
    <motion.div
      variants={staggerGroup(0.06)}
      initial="hidden"
      whileInView="show"
      viewport={IN_VIEW_SOFT}
    >
      <motion.p
        variants={fadeUp}
        className="eyebrow"
        style={{ color: "var(--p-accent, var(--color-muted))" }}
      >
        Packages
      </motion.p>

      <motion.ul variants={fadeUp} className="mt-5 grid gap-3 sm:grid-cols-2">
        {packages.map((pkg) => (
          <li
            key={pkg.name}
            className="min-w-0 rounded-2xl border px-5 py-4"
            style={{
              borderColor: "var(--p-muted, var(--color-line))",
              backgroundColor: "var(--color-white)",
            }}
          >
            {/* Package names are long identifiers; they wrap rather than
                overflow the card on a phone. */}
            <p className="font-mono text-[0.8125rem] break-words text-[var(--color-ink)]">
              {pkg.name}
            </p>
            <p className="eyebrow mt-2 text-[var(--color-muted)]">{pkg.note}</p>
          </li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
