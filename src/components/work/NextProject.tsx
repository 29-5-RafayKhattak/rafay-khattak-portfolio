"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import type { Project } from "@/data/projects";
import { fadeUp, IN_VIEW_SOFT } from "@/lib/animations";

/**
 * The hand-off out of the case study.
 *
 * Whether it links to another case study or back to the homepage sequence
 * depends on the next project in the centralised list — there is no hardcoded
 * destination here, so adding a real project later rewires this automatically.
 *
 * At the end of the sequence it says so, rather than looping back to the first
 * project. A carousel that never ends implies more work than exists; an honest
 * end is also the only place a future project can be announced without
 * inventing one to fill the slot.
 */
export function NextProject({ project }: { project?: Project }) {
  if (!project) {
    return (
      <section
        data-tone="day"
        aria-labelledby="next-project-heading"
        className="border-t border-[var(--color-line)]"
      >
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={IN_VIEW_SOFT}
          className="py-[clamp(3.5rem,10vh,7rem)]"
        >
          <p
            id="next-project-heading"
            className="eyebrow text-[var(--color-muted)]"
          >
            Next project
          </p>
          <p className="display mt-8 max-w-[14ch] text-[var(--color-muted)]">
            More work coming soon.
          </p>
        </motion.div>
      </section>
    );
  }

  const hasCaseStudy = Boolean(project.caseStudy);
  const href = hasCaseStudy ? `/work/${project.slug}` : "/#work";

  return (
    <section
      data-tone="day"
      aria-labelledby="next-project-heading"
      className="border-t border-[var(--color-line)]"
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={IN_VIEW_SOFT}
      >
        <Link
          href={href}
          data-cursor="view"
          className="group block py-[clamp(3.5rem,10vh,7rem)]"
        >
          <p
            id="next-project-heading"
            className="eyebrow text-[var(--color-muted)]"
          >
            Next project
          </p>

          <div className="mt-8 flex items-end justify-between gap-6">
            <div className="min-w-0">
              <span className="eyebrow block text-[var(--color-accent)]">
                {project.index}
              </span>
              <h2 className="display mt-4 max-w-[14ch] transition-colors duration-500 group-hover:text-[var(--color-accent)]">
                {project.name}
              </h2>
              <p className="eyebrow mt-5 text-[var(--color-muted)]">
                {project.category}
                <span className="mx-2 text-[var(--color-accent)]">/</span>
                {project.year}
              </p>
              {!hasCaseStudy && (
                <p className="mt-4 max-w-[42ch] text-[0.9375rem] text-[var(--color-muted)]">
                  Case study not published yet — this returns to the work
                  sequence.
                </p>
              )}
            </div>

            <span
              aria-hidden="true"
              className="mb-2 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[var(--color-line-strong)] transition-[background-color,border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1.5 group-hover:border-[var(--color-ink)] group-hover:bg-[var(--color-ink)] sm:h-16 sm:w-16"
            >
              <ArrowRight
                className="h-5 w-5 text-[var(--color-ink)] transition-colors duration-500 group-hover:text-[var(--color-canvas)]"
                strokeWidth={1.5}
              />
            </span>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
