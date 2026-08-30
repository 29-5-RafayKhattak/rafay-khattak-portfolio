"use client";

import { motion } from "framer-motion";

import { fadeIn, IN_VIEW_SOFT } from "@/lib/animations";

/**
 * The small monospaced eyebrow that opens each section, with a hairline that
 * draws itself out from the label on first view.
 */
export function SectionLabel({
  children,
  index,
  night = false,
  className = "",
}: {
  children: string;
  index?: string;
  night?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      whileInView="show"
      viewport={IN_VIEW_SOFT}
      className={`flex items-center gap-4 ${className}`}
    >
      {index && (
        <span
          className={
            night
              ? "eyebrow text-[var(--color-accent)]"
              : "eyebrow text-[var(--color-accent)]"
          }
        >
          {index}
        </span>
      )}
      <span
        className={[
          "eyebrow",
          night ? "text-[var(--color-night-muted)]" : "text-[var(--color-muted)]",
        ].join(" ")}
      >
        {children}
      </span>
      <motion.span
        aria-hidden="true"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={IN_VIEW_SOFT}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className={[
          "h-px flex-1 origin-left",
          night ? "bg-[var(--color-night-line)]" : "bg-[var(--color-line)]",
        ].join(" ")}
      />
    </motion.div>
  );
}
