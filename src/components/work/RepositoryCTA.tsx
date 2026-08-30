"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { fadeUp, IN_VIEW_SOFT } from "@/lib/animations";

/**
 * The public repository link.
 *
 * A polished control rather than a bare URL in body text — and the only place
 * the address appears, so it reads as an invitation instead of a footnote.
 * External, so it opens in a new tab with `rel="noopener noreferrer"`.
 *
 * Only ever rendered for a public repository — see `repositoryUrl` in
 * data/projects.ts for why a private one carries no link at all.
 */
export function RepositoryCTA({ href }: { href: string }) {
  return (
    <section
      data-tone="day"
      aria-labelledby="repository-heading"
      className="border-t border-[var(--color-line)] py-[clamp(3rem,8vh,5rem)]"
    >
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={IN_VIEW_SOFT}
      >
        <h2 id="repository-heading" className="eyebrow text-[var(--color-muted)]">
          Source
        </h2>

        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="arrow"
          className="repo-cta group mt-6 inline-flex items-center gap-3 rounded-full border px-6 py-4 text-[0.9375rem] font-medium"
        >
          View Public Repository
          <ArrowUpRight
            className="h-[1.1em] w-[1.1em] shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </a>
      </motion.div>
    </section>
  );
}
