"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

import type { CaseStudySection as SectionData, SectionTone } from "@/data/projects";
import { fadeUp, IN_VIEW_SOFT, staggerGroup } from "@/lib/animations";

/**
 * The shell every numbered section shares: accent index, heading, and a prose
 * column held to ~62 characters so the body stays readable at any width.
 *
 * TONE
 * A section can sit on paper, on the project's pale surface, or on its deep
 * accent. The colour is applied by a `.case-bleed` layer rather than to the
 * section box itself — the case-study body lives in a two-column grid, so the
 * box stops short of the shell edges and a background painted on it would read
 * as a floating panel instead of a band.
 *
 * Only `deep` changes the type colours, and it also declares `data-tone="night"`
 * so the fixed navigation inverts over it.
 */
const TONE: Record<
  SectionTone,
  {
    bg?: string;
    heading: string;
    body: string;
    index: string;
    rule: string;
    navTone: "day" | "night";
  }
> = {
  paper: {
    heading: "var(--color-ink)",
    body: "var(--color-muted)",
    index: "var(--p-warm, var(--color-accent))",
    rule: "var(--color-line)",
    navTone: "day",
  },
  surface: {
    bg: "var(--color-surface)",
    heading: "var(--color-ink)",
    body: "var(--color-muted)",
    index: "var(--p-warm, var(--color-accent))",
    rule: "var(--color-line)",
    navTone: "day",
  },
  /* A half-step off paper — used where a section should lift without
     announcing itself as a coloured band. */
  soft: {
    bg: "var(--p-surface-soft, var(--color-surface))",
    heading: "var(--color-ink)",
    body: "var(--color-muted)",
    index: "var(--p-accent, var(--color-accent))",
    rule: "var(--color-line)",
    navTone: "day",
  },
  /* The project's second pale ground, so a long page can alternate between
     two tints instead of repeating one. */
  alt: {
    bg: "var(--p-surface-alt, var(--p-surface, var(--color-surface)))",
    heading: "var(--color-ink)",
    body: "var(--color-muted)",
    index: "var(--p-accent, var(--color-accent))",
    rule: "rgba(17,17,17,0.12)",
    navTone: "day",
  },
  sage: {
    bg: "var(--p-surface, var(--color-surface))",
    heading: "var(--color-ink)",
    body: "var(--color-muted)",
    index: "var(--p-accent, var(--color-accent))",
    rule: "rgba(17,17,17,0.12)",
    navTone: "day",
  },
  deep: {
    bg: "var(--p-accent, var(--color-night))",
    heading: "var(--p-cream, var(--color-night-ink))",
    body: "rgba(245,242,236,0.65)",
    index: "var(--p-warm, var(--color-accent))",
    rule: "rgba(245,242,236,0.22)",
    navTone: "night",
  },
};

export function CaseStudySection({
  section,
  children,
  tone = "paper",
  className = "",
}: {
  section: SectionData;
  children?: ReactNode;
  tone?: SectionTone;
  className?: string;
}) {
  const t = TONE[tone];

  return (
    <section
      id={section.id}
      data-tone={t.navTone}
      aria-labelledby={`${section.id}-heading`}
      className={`relative isolate scroll-mt-32 py-[clamp(2.75rem,6.5vh,4.75rem)] ${className}`}
    >
      {t.bg && (
        <span
          aria-hidden="true"
          className="case-bleed"
          style={{ backgroundColor: t.bg }}
        />
      )}

      <motion.div
        variants={staggerGroup(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={IN_VIEW_SOFT}
      >
        <motion.div variants={fadeUp} className="flex items-center gap-4">
          <span className="eyebrow" style={{ color: t.index }}>
            {section.number}
          </span>
          <span
            className="h-px w-10"
            style={{ backgroundColor: t.rule }}
            aria-hidden="true"
          />
        </motion.div>

        <motion.h2
          id={`${section.id}-heading`}
          variants={fadeUp}
          className="headline mt-4 max-w-[18ch]"
          style={{ color: t.heading }}
        >
          {section.title}
        </motion.h2>

        {/*
          Each paragraph animates in on its own so a longer section still
          arrives in reading order rather than as one block.
        */}
        {(Array.isArray(section.body) ? section.body : [section.body]).map(
          (paragraph, i) => (
            <motion.p
              key={i}
              variants={fadeUp}
              className={`max-w-[66ch] text-[var(--step-lead)] leading-[1.62] ${
                i === 0 ? "mt-6" : "mt-4"
              }`}
              style={{ color: t.body }}
            >
              {paragraph}
            </motion.p>
          ),
        )}
      </motion.div>

      {children && <div className="mt-[clamp(2rem,4.5vh,3rem)]">{children}</div>}
    </section>
  );
}
