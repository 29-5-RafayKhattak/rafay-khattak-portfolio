"use client";

import { motion } from "framer-motion";

import type { CaseStudy } from "@/data/projects";
import { fadeUp, IN_VIEW_SOFT, staggerGroup } from "@/lib/animations";

/**
 * The technical closing: what the platform runs on, grouped, plus the summary
 * and the state of publishable artifacts.
 *
 * Everything is named at the level of "which technology", never "how it is
 * configured". No environment variables, connection strings, bucket names,
 * hostnames, keys or admin surfaces appear here or anywhere else on the page.
 */
export function TechnicalNotes({
  groups,
  summary,
  repository,
  publicArtifacts,
}: {
  groups: CaseStudy["technicalNotes"];
  summary: string;
  repository: string;
  publicArtifacts: string;
}) {
  return (
    <section
      data-tone="day"
      aria-labelledby="technical-notes-heading"
      className="scroll-mt-32 border-t border-[var(--color-line)] py-[clamp(3.5rem,10vh,7rem)]"
    >
      <motion.div
        variants={staggerGroup(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={IN_VIEW_SOFT}
      >
        <motion.h2
          id="technical-notes-heading"
          variants={fadeUp}
          className="headline max-w-[16ch]"
        >
          Technical notes
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="mt-7 max-w-[62ch] text-[length:var(--step-lead)] leading-[1.6] text-[var(--color-muted)]"
        >
          {summary}
        </motion.p>

        {/* Grouped stack ------------------------------------------- */}
        <motion.div
          variants={fadeUp}
          className="mt-[clamp(2.5rem,6vh,4rem)] grid gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
        >
          {groups.map((group) => (
            <div key={group.title}>
              <h3 className="eyebrow border-b border-[var(--color-line)] pb-4 text-[var(--color-accent)]">
                {group.title}
              </h3>
              <ul className="mt-5 flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-[0.9375rem] text-[var(--color-ink)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Repository status --------------------------------------- */}
        <motion.dl
          variants={fadeUp}
          className="mt-[clamp(2.5rem,6vh,4rem)] grid gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-6 border-t border-[var(--color-line)] pt-8 sm:grid-cols-2"
        >
          <div>
            <dt className="eyebrow text-[var(--color-muted)]">Repository</dt>
            <dd className="mt-2 text-[0.9375rem] text-[var(--color-ink)]">
              {repository}
            </dd>
          </div>
          <div>
            <dt className="eyebrow text-[var(--color-muted)]">
              Public artifacts
            </dt>
            <dd className="mt-2 max-w-[46ch] text-[0.9375rem] leading-[1.5] text-[var(--color-muted)]">
              {publicArtifacts}
            </dd>
          </div>
        </motion.dl>
      </motion.div>
    </section>
  );
}
