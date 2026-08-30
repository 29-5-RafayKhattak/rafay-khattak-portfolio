"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import type { EducationStage as StageData } from "@/data/portfolio";
import { fadeUp, IN_VIEW_SOFT, staggerGroup } from "@/lib/animations";

/**
 * -----------------------------------------------------------------------------
 * ONE EDUCATION STAGE
 * -----------------------------------------------------------------------------
 * The shell each stage shares: index, qualifier, heading, institution and a
 * short line of prose — with the stage's own oversized element passed in as
 * children.
 *
 * Only the frame is shared. The degree is carried by its title set as display
 * type, A Levels by three grades arriving in sequence, and O Levels by a tally
 * beside a distinction. Three stages laid out identically would be the résumé
 * card row this section exists to avoid, so what changes between them is the
 * thing the eye lands on first.
 *
 * The rule down the left edge is the same device the experience timeline uses,
 * which is what ties the two sections together without repeating a layout.
 * -----------------------------------------------------------------------------
 */
export function EducationStage({
  stage,
  children,
  emphasis = false,
}: {
  stage: StageData;
  children?: ReactNode;
  /** The current stage sits on its own ground and gets more air around it. */
  emphasis?: boolean;
}) {
  return (
    <motion.li
      variants={staggerGroup(0.09)}
      initial="hidden"
      whileInView="show"
      viewport={IN_VIEW_SOFT}
      className="relative border-l border-[var(--color-line)] pl-[clamp(1.25rem,3vw,2.75rem)]"
      style={{
        paddingTop: emphasis
          ? "clamp(2.5rem,7vh,4.5rem)"
          : "clamp(2.25rem,6vh,3.5rem)",
        paddingBottom: emphasis
          ? "clamp(2.5rem,7vh,4.5rem)"
          : "clamp(2.25rem,6vh,3.5rem)",
      }}
    >
      {/* Index and qualifier ------------------------------------------ */}
      <motion.div
        variants={fadeUp}
        className="flex flex-wrap items-center gap-x-4 gap-y-2"
      >
        <span className="eyebrow text-[var(--color-accent)]">
          {stage.number}
        </span>
        <span
          className="h-px w-8 shrink-0 bg-[var(--color-line-strong)]"
          aria-hidden="true"
        />
        <span className="eyebrow text-[var(--color-muted)]">{stage.tag}</span>
      </motion.div>

      {/* Heading ------------------------------------------------------- */}
      <motion.h3
        variants={fadeUp}
        className={
          emphasis
            ? "sr-only"
            : "mt-5 text-[var(--step-h3)] leading-[1.05] font-semibold tracking-[-0.03em] text-balance"
        }
      >
        {stage.qualification}
      </motion.h3>

      {/* The stage's own oversized element. ---------------------------- */}
      {children && (
        <motion.div variants={fadeUp} className="mt-[clamp(1.25rem,3.5vh,2rem)]">
          {children}
        </motion.div>
      )}

      {/* Institution --------------------------------------------------- */}
      {stage.institution && (
        <motion.p
          variants={fadeUp}
          className="mt-[clamp(1.5rem,4vh,2.25rem)] max-w-[38ch] text-[var(--step-body)] leading-[1.5] text-balance text-[var(--color-ink)]"
        >
          {stage.institution}
          {stage.institutionShort && (
            <span className="mt-1.5 block eyebrow text-[var(--color-muted)]">
              {stage.institutionShort}
            </span>
          )}
        </motion.p>
      )}

      {/* Prose --------------------------------------------------------- */}
      <motion.p
        variants={fadeUp}
        className="mt-[clamp(1rem,2.5vh,1.5rem)] max-w-[54ch] leading-[1.6] text-[var(--color-muted)]"
      >
        {stage.description}
      </motion.p>

      {/* Status line --------------------------------------------------- */}
      {(stage.progress ?? stage.status) && (
        <motion.p
          variants={fadeUp}
          className="mt-[clamp(1.25rem,3vh,1.75rem)] flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.8125rem] text-[var(--color-muted)]"
        >
          {stage.progress && (
            <span className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-accent)]"
              />
              {stage.progress}
            </span>
          )}
          {stage.progress && stage.status && (
            <span aria-hidden="true" className="text-[var(--color-line-strong)]">
              /
            </span>
          )}
          {stage.status && <span>{stage.status}</span>}
        </motion.p>
      )}
    </motion.li>
  );
}
