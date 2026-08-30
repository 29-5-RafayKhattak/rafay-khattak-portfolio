"use client";

import { motion } from "framer-motion";

import { fadeUp, IN_VIEW_SOFT, staggerGroup } from "@/lib/animations";

/**
 * Credits for collaborative work.
 *
 * Deliberately small and deliberately present. This portfolio belongs to one
 * person, but a project built with someone else has to say so plainly and
 * without ranking the names — so they are set at equal weight, separated by a
 * hairline, in the order supplied.
 *
 * A role is optional. Where one is known — a maintainer, say — stating it is
 * more honest than a bare list that leaves the reader to assume the portfolio's
 * owner led the work; where it is not known, nothing is invented to fill the
 * gap, and the names simply sit side by side as before.
 */
export function Contributors({
  people,
}: {
  people: { name: string; role?: string }[];
}) {
  if (people.length < 2) return null;

  // With roles the names need their own column each; without them they read as
  // a single line of equals, which is the original arrangement.
  const hasRoles = people.some((person) => person.role);

  return (
    <section
      data-tone="day"
      aria-labelledby="contributors-heading"
      className="border-t border-[var(--color-line)] py-[clamp(2.5rem,7vh,4rem)]"
    >
      <motion.div
        variants={staggerGroup(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={IN_VIEW_SOFT}
      >
        <motion.h2
          id="contributors-heading"
          variants={fadeUp}
          className="eyebrow text-[var(--color-muted)]"
        >
          Contributors
        </motion.h2>

        {hasRoles ? (
          <motion.ul
            variants={fadeUp}
            className="mt-6 grid gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-6 sm:grid-cols-2"
          >
            {people.map((person) => (
              <li
                key={person.name}
                className="border-t border-[var(--color-line)] pt-4"
              >
                <p className="text-[clamp(1.0625rem,1.8vw,1.375rem)] tracking-[-0.015em] text-[var(--color-ink)]">
                  {person.name}
                </p>
                {person.role && (
                  <p className="mt-1.5 text-[0.875rem] text-[var(--color-muted)]">
                    {person.role}
                  </p>
                )}
              </li>
            ))}
          </motion.ul>
        ) : (
          <motion.ul
            variants={fadeUp}
            className="mt-5 flex flex-col sm:flex-row sm:flex-wrap sm:items-center"
          >
            {people.map((person, i) => (
              <li key={person.name} className="flex items-center">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="mx-5 hidden h-4 w-px bg-[var(--color-line-strong)] sm:block"
                  />
                )}
                <span className="py-1 text-[clamp(1.0625rem,1.8vw,1.375rem)] tracking-[-0.015em] text-[var(--color-ink)]">
                  {person.name}
                </span>
              </li>
            ))}
          </motion.ul>
        )}
      </motion.div>
    </section>
  );
}
