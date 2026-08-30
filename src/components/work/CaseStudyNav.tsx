"use client";

import { useMemo } from "react";

import type { CaseStudySection } from "@/data/projects";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useSmoothScroll } from "@/components/layout/SmoothScroll";

/**
 * Contents index and reading-position indicator in one element.
 *
 * The brief asked for both a contents navigation and a progress indicator down
 * the page edge. Built as two separate things they would report the same fact
 * twice and compete for the same quiet corner of the layout, so this is one
 * control doing both jobs: it lists the sections, it says where you are, and it
 * takes you somewhere when clicked.
 *
 * Desktop  — a sticky column that travels with the reader.
 * Mobile   — a horizontally scrollable strip of numbers, pinned under the bar.
 */
export function CaseStudyNav({ sections }: { sections: CaseStudySection[] }) {
  const ids = useMemo(() => sections.map((s) => s.id), [sections]);
  const active = useActiveSection(ids);
  const { scrollTo } = useSmoothScroll();

  const go = (id: string) => (event: React.MouseEvent) => {
    event.preventDefault();
    scrollTo(`#${id}`, -110);
  };

  return (
    <>
      {/* Desktop — sticky index ------------------------------------- */}
      <nav
        aria-label="On this page"
        className="sticky top-[7.5rem] hidden lg:block"
      >
        <p className="eyebrow mb-5 text-[var(--color-muted)]">On this page</p>
        <ul className="flex flex-col gap-1">
          {sections.map((section) => {
            const isActive = active === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={go(section.id)}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex items-center gap-3 py-2"
                >
                  {/* The rule extends as its section becomes current. */}
                  <span
                    aria-hidden="true"
                    className="h-px shrink-0 bg-[var(--color-accent)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={{
                      width: isActive ? "1.5rem" : "0.5rem",
                      opacity: isActive ? 1 : 0.25,
                    }}
                  />
                  <span
                    className="eyebrow transition-colors duration-500"
                    style={{
                      color: isActive
                        ? "var(--color-accent)"
                        : "var(--color-muted)",
                    }}
                  >
                    {section.number}
                  </span>
                  <span
                    className="text-[0.875rem] transition-colors duration-500"
                    style={{
                      color: isActive
                        ? "var(--color-ink)"
                        : "var(--color-muted)",
                    }}
                  >
                    {section.title}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Mobile — compact horizontal navigator ----------------------- */}
      <nav
        aria-label="On this page"
        // 6rem clears the navigation bar, which is 83px at its tallest
        // and does not shrink with viewport height.
        className="sticky top-[6rem] z-30 -mx-[clamp(1.25rem,4vw,4.5rem)] border-y border-[var(--color-line)] bg-[var(--color-canvas)]/92 backdrop-blur-md lg:hidden"
      >
        <ul className="flex gap-1 overflow-x-auto px-[clamp(1.25rem,4vw,4.5rem)] py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((section) => {
            const isActive = active === section.id;
            return (
              <li key={section.id} className="shrink-0">
                <a
                  href={`#${section.id}`}
                  onClick={go(section.id)}
                  aria-current={isActive ? "true" : undefined}
                  className="flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.8125rem] whitespace-nowrap transition-colors duration-400"
                  style={{
                    borderColor: isActive
                      ? "var(--color-accent)"
                      : "var(--color-line)",
                    color: isActive
                      ? "var(--color-ink)"
                      : "var(--color-muted)",
                    backgroundColor: isActive
                      ? "var(--color-accent-soft)"
                      : "transparent",
                  }}
                >
                  <span className="eyebrow text-[var(--color-accent)]">
                    {section.number}
                  </span>
                  {section.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
