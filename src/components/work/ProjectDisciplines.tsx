"use client";

import { useRef } from "react";

import { gsap, useScrollScene } from "@/hooks/useScrollScene";

/**
 * The disciplines a project touches, set on a single thin rule.
 *
 * The nodes fill left to right as the hero is scrolled through — a progress
 * line that happens to be made of labels. Scroll-linked because it reads as
 * one continuous gesture tied to leaving the hero, not as four separate
 * entrances.
 *
 * On narrow screens the rule becomes a horizontally scrollable strip rather
 * than compressing four labels into an unreadable row.
 */
export function ProjectDisciplines({
  items,
  covers,
}: {
  items: string[];
  /**
   * Which of the disciplines this project genuinely touches. Without it every
   * node lights, which claims breadth a focused project does not have — the
   * rest stay on the rule as context for where this one sits.
   */
  covers?: string[];
}) {
  const touches = (item: string) => !covers || covers.includes(item);
  const sectionRef = useRef<HTMLDivElement>(null);

  useScrollScene(sectionRef, (scope) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        scope.querySelector(".discipline-fill"),
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: scope,
            start: "top 85%",
            end: "top 35%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        },
      );

      gsap.utils.toArray<HTMLElement>(".discipline-node").forEach((node, i) => {
        // A node outside the project's disciplines never reaches, at any
        // scroll position.
        if (node.dataset.covered === "false") return;

        gsap.timeline({
          scrollTrigger: {
            trigger: scope,
            start: `top ${80 - i * 11}%`,
            end: "bottom top",
            invalidateOnRefresh: true,
            onToggle: (self) => {
              node.dataset.reached = String(self.isActive || self.progress > 0);
            },
            onRefresh: (self) => {
              node.dataset.reached = String(self.progress > 0);
            },
          },
        });
      });
    });

    return () => mm.revert();
  });

  return (
    <div ref={sectionRef}>
      <p className="eyebrow mb-6 text-[var(--color-muted)]">Covers</p>

      {/* Pulled out to the shell edge and padded back in by the same amount, so
          the strip scrolls edge to edge while its first label still lines up
          with the column above. Both halves read `--gutter-x` rather than
          repeating its value: the token now widens for a notch, and a literal
          copy would drift out of alignment in landscape. */}
      <div className="-mx-[var(--gutter-x)] overflow-x-auto px-[var(--gutter-x)] pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="relative flex min-w-[22rem] gap-0">
          {/* Rule --------------------------------------------------- */}
          <span
            aria-hidden="true"
            className="absolute top-[5px] right-0 left-0 h-px"
            style={{ backgroundColor: "var(--p-muted, var(--color-line))" }}
          />
          <span
            aria-hidden="true"
            className="discipline-fill absolute top-[5px] right-0 left-0 h-px origin-left scale-x-0"
            style={{ backgroundColor: "var(--p-accent, var(--color-accent))" }}
          />

          {items.map((item) => (
            <div
              key={item}
              data-covered={String(touches(item))}
              className="discipline-node group relative flex-1 pr-6"
            >
              <span
                aria-hidden="true"
                className="relative z-10 block h-[11px] w-[11px] rounded-full border-2 border-[var(--color-canvas)] transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  backgroundColor: touches(item)
                    ? "var(--p-muted, var(--color-line-strong))"
                    : "var(--color-line)",
                }}
              />
              <span
                className="eyebrow mt-4 block whitespace-nowrap transition-colors duration-500 group-data-[reached=true]:text-[var(--color-ink)]"
                style={{
                  color: touches(item)
                    ? "var(--color-muted)"
                    : "var(--color-line-strong)",
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
