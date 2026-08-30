"use client";

import { useRef, useState } from "react";

import type { ArchitectureLayer } from "@/data/projects";
import { useArmedReveal } from "@/components/education/useArmedReveal";
import { gsap, useScrollScene } from "@/hooks/useScrollScene";

/**
 * -----------------------------------------------------------------------------
 * ARCHITECTURE — the one pinned moment in the case study
 * -----------------------------------------------------------------------------
 * The request path is held still while the reader scrolls, and each layer
 * lights in turn from the browser down to the database. Pinning earns its place
 * here specifically: the point of the diagram is the *relationship* between
 * layers, which is lost if they scroll past one at a time.
 *
 * Everything else on the page scrolls normally — a case study that pins every
 * section stops being readable.
 *
 * Deliberately generic: boxes name technologies and roles, never schemas,
 * endpoints, bucket names, hostnames or anything else specific to the
 * deployment.
 * -----------------------------------------------------------------------------
 */
export function ArchitectureDiagram({
  stack,
  aside,
  heads,
  onDeep = false,
}: {
  stack: ArchitectureLayer[];
  aside?: ArchitectureLayer[];
  /** Parallel entry points that all feed the first layer of the stack. */
  heads?: ArchitectureLayer[];
  /** Rendered on the project's deep accent rather than on paper. */
  onDeep?: boolean;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const reducedMotion = useScrollScene(sectionRef, (scope) => {
    const mm = gsap.matchMedia();

    // Pinned only where there is room. Below `md` the diagram is a plain
    // stacked list and holding it still would trap the reader.
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const steps = stack.length;

      gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Spread the layers across the range, holding the last one for
            // the tail so the finished diagram gets a beat before it leaves.
            const index = Math.min(
              steps - 1,
              Math.floor(self.progress * steps * 1.08),
            );
            setActive((prev) => (prev === index ? prev : index));
          },
        },
      });
    });

    /*
     * Below `md` the same walk runs unpinned. Dropping it entirely was the
     * easy option and the wrong one: the layers lighting from the browser
     * down to the database is the argument the diagram makes, and a phone
     * that renders all of them lit at once is left with a static list of
     * boxes. So the diagram scrolls normally — no pin, nothing held still —
     * and its own passage through the viewport drives the same `active`
     * index the pinned version does.
     *
     * The range ends at `bottom 60%` rather than at the foot of the range,
     * so the last layer is reached while the diagram is still comfortably on
     * screen instead of as it leaves.
     */
    mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
      const steps = stack.length;

      gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top 82%",
          end: "bottom 60%",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const index = Math.min(
              steps - 1,
              Math.floor(self.progress * steps * 1.08),
            );
            setActive((prev) => (prev === index ? prev : index));
          },
        },
      });
    });

    return () => mm.revert();
  });

  /*
   * The walk is armed in a layout effect rather than assumed, so the server
   * renders every layer in its lit state and anything that stops the
   * animation layer running — reduced motion, a hydration failure, a tab that
   * measured a zero viewport — leaves a diagram that is simply all readable
   * rather than one stuck with its lower layers dimmed. Same reasoning as the
   * education reveals; see useArmedReveal.
   */
  const armed = useArmedReveal(!reducedMotion);
  const walking = armed && !reducedMotion;

  return (
    <div
      ref={sectionRef}
      // Extra height is what the pin consumes; without motion it collapses to
      // the diagram's natural size.
      style={{ height: reducedMotion ? "auto" : undefined }}
      className="md:h-[220vh]"
    >
      <div className="md:sticky md:top-0 md:flex md:h-[100svh] md:items-center">
        <div className="grid w-full gap-x-[clamp(1.5rem,4vw,3.5rem)] gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]">
          {/* Request path ------------------------------------------- */}
          <ol className="flex flex-col">
            {heads && heads.length > 0 && (
              <li>
                {/* Role surfaces sit side by side because they are peers —
                    stacking them would imply an order that does not exist. */}
                <ul className="grid gap-3 sm:grid-cols-3">
                  {heads.map((head) => (
                    <li
                      key={head.id}
                      className="rounded-2xl border px-4 py-3.5 text-center"
                      style={{
                        borderColor: onDeep
                          ? "rgba(248,247,244,0.28)"
                          : "var(--p-muted, var(--color-line))",
                        backgroundColor: onDeep
                          ? "rgba(248,247,244,0.04)"
                          : "var(--color-white)",
                      }}
                    >
                      <p
                        className="text-[0.9375rem] font-medium tracking-[-0.01em]"
                        style={{
                          color: onDeep
                            ? "var(--p-cream, var(--color-night-ink))"
                            : "var(--color-ink)",
                        }}
                      >
                        {head.label}
                      </p>
                      {head.note && (
                        <p
                          className="eyebrow mt-1.5"
                          style={{
                            color: onDeep
                              ? "rgba(248,247,244,0.6)"
                              : "var(--color-muted)",
                          }}
                        >
                          {head.note}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
                <div aria-hidden="true" className="flex justify-center py-2.5">
                  <span
                    className="block h-5 w-px"
                    style={{
                      backgroundColor: onDeep
                        ? "var(--p-muted, rgba(248,247,244,0.4))"
                        : "var(--p-accent, var(--color-line-strong))",
                    }}
                  />
                </div>
              </li>
            )}

            {stack.map((layer, i) => {
              const isActive = !walking || active >= i;
              const isCurrent = walking && active === i;

              return (
                <li key={layer.id}>
                  <div
                    className="rounded-2xl border px-5 py-4 transition-[background-color,border-color,transform,box-shadow] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6 sm:py-5"
                    style={{
                      // Warm brown marks the layer being read; everything the
                      // reader has already passed is held in the project green.
                      borderColor: isCurrent
                        ? "var(--p-warm, var(--color-accent))"
                        : isActive
                          ? onDeep
                            ? "var(--p-muted, rgba(248,247,244,0.45))"
                            : "var(--p-accent, var(--color-line-strong))"
                          : onDeep
                            ? "rgba(248,247,244,0.18)"
                            : "var(--color-line)",
                      backgroundColor: isCurrent
                        ? "color-mix(in srgb, var(--p-warm, var(--color-accent)) 12%, transparent)"
                        : onDeep
                          ? "rgba(248,247,244,0.05)"
                          : "var(--color-white)",
                      transform: `translateX(${isCurrent ? "6px" : "0px"})`,
                      boxShadow: isCurrent
                        ? "0 18px 40px -30px rgba(17,17,17,0.5)"
                        : "none",
                    }}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <p
                        className="text-[clamp(1rem,1.6vw,1.25rem)] font-medium tracking-[-0.02em] transition-colors duration-[600ms]"
                        style={{
                          color: isCurrent
                            ? "var(--p-warm, var(--color-accent))"
                            : isActive
                              ? onDeep
                                ? "var(--p-cream, var(--color-night-ink))"
                                : "var(--color-ink)"
                              : onDeep
                                ? "rgba(248,247,244,0.55)"
                                : "var(--color-muted)",
                        }}
                      >
                        {layer.label}
                      </p>
                      {layer.note && (
                        <p
                          className="eyebrow shrink-0"
                          style={{
                            color: onDeep
                              ? "rgba(248,247,244,0.6)"
                              : "var(--color-muted)",
                          }}
                        >
                          {layer.note}
                        </p>
                      )}
                    </div>
                  </div>

                  {i < stack.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="flex justify-center py-2.5"
                    >
                      <span
                        className="block h-5 w-px transition-colors duration-[600ms]"
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

          {/* Services alongside the path ---------------------------- */}
          <ul className="flex flex-col gap-4 lg:pt-2">
            {(aside ?? []).map((service) => (
              <li
                key={service.id}
                className="rounded-2xl border border-dashed px-5 py-4"
                style={{
                  borderColor: "var(--p-muted, var(--color-line-strong))",
                }}
              >
                <p className="text-[0.9375rem] font-medium text-[var(--color-ink)]">
                  {service.label}
                </p>
                {service.note && (
                  <p className="eyebrow mt-1.5 text-[var(--color-muted)]">
                    {service.note}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
