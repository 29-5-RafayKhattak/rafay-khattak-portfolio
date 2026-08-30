"use client";

import { useRef, useState } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { gsap, useScrollScene } from "@/hooks/useScrollScene";

/**
 * -----------------------------------------------------------------------------
 * PROCESS TOPOLOGY — the run walked one boundary at a time
 * -----------------------------------------------------------------------------
 * Deliberately not the shared ArchitectureDiagram. That component sets each
 * layer as a full-width card, which is right for five layers and impossible for
 * eight — the run would be taller than the viewport it is pinned inside, so the
 * reader would be held still watching something they cannot see the ends of.
 * These rows are about a third the height, and the whole path fits at once.
 *
 * Each step carries what it *is* — process, IPC, threads, memory — because the
 * interesting fact about this pipeline is where the boundaries fall, not that
 * one box follows another.
 * -----------------------------------------------------------------------------
 */
export function ProcessTopology({
  steps,
  support,
}: {
  steps: { id: string; label: string; kind: string }[];
  support: { label: string; note: string }[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const canPin = useMediaQuery("(min-width: 768px)");

  const reducedMotion = useScrollScene(sectionRef, (scope) => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.min(
              steps.length - 1,
              Math.floor(self.progress * steps.length * 1.08),
            );
            setActive((prev) => (prev === index ? prev : index));
          },
        },
      });
    });

    return () => mm.revert();
  });

  // Without the pin — on a phone, or under reduced motion — nothing drives the
  // walk, so every step is simply present rather than one being singled out.
  const walking = canPin && !reducedMotion;

  return (
    <div
      ref={sectionRef}
      style={{ height: reducedMotion ? "auto" : undefined }}
      className="md:h-[200vh]"
    >
      <div className="md:sticky md:top-0 md:flex md:h-[100svh] md:items-center">
        <div className="grid w-full gap-x-[clamp(1.5rem,4vw,3.5rem)] gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,14rem)]">
          <ol className="flex flex-col">
            {steps.map((step, i) => {
              const reached = !walking || active >= i;
              const current = walking && active === i;

              return (
                <li key={step.id}>
                  <div
                    className="flex items-center justify-between gap-4 rounded-xl border px-4 py-3 transition-[background-color,border-color,transform] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-5"
                    style={{
                      // Copper marks the boundary being crossed right now;
                      // charcoal holds everything already passed.
                      borderColor: current
                        ? "var(--p-warm, var(--color-accent))"
                        : reached
                          ? "var(--p-accent, var(--color-line-strong))"
                          : "var(--color-line)",
                      backgroundColor: current
                        ? "color-mix(in srgb, var(--p-warm, var(--color-accent)) 12%, transparent)"
                        : "var(--color-white)",
                      transform: `translateX(${current ? "6px" : "0px"})`,
                    }}
                  >
                    <span className="flex min-w-0 items-baseline gap-3">
                      <span
                        className="eyebrow shrink-0 tabular-nums transition-colors duration-[600ms]"
                        style={{
                          color: current
                            ? "var(--p-warm, var(--color-accent))"
                            : reached
                              ? "var(--p-muted, var(--color-muted))"
                              : "var(--color-line-strong)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="truncate text-[clamp(0.9375rem,1.4vw,1.125rem)] font-medium tracking-[-0.015em] transition-colors duration-[600ms]"
                        style={{
                          color: current
                            ? "var(--p-warm, var(--color-accent))"
                            : reached
                              ? "var(--color-ink)"
                              : "var(--color-muted)",
                        }}
                      >
                        {step.label}
                      </span>
                    </span>

                    <span
                      className="eyebrow shrink-0"
                      style={{ color: "var(--color-muted)" }}
                    >
                      {step.kind}
                    </span>
                  </div>

                  {i < steps.length - 1 && (
                    <div aria-hidden="true" className="flex justify-center py-1.5">
                      <span
                        className="block h-4 w-px transition-colors duration-[600ms]"
                        style={{
                          backgroundColor:
                            !walking || active > i
                              ? "var(--p-accent, var(--color-accent))"
                              : "var(--color-line-strong)",
                        }}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>

          {/* Primitives that hold the run together rather than sit in it. */}
          <ul className="flex flex-col gap-3 lg:pt-1">
            {support.map((item) => (
              <li
                key={item.label}
                className="rounded-xl border border-dashed px-4 py-3"
                style={{ borderColor: "var(--p-muted, var(--color-line-strong))" }}
              >
                <p className="text-[0.875rem] font-medium text-[var(--color-ink)]">
                  {item.label}
                </p>
                <p className="eyebrow mt-1 text-[var(--color-muted)]">
                  {item.note}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
