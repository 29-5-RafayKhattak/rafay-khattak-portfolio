"use client";

import { useRef, useState } from "react";

import { gsap, useScrollScene } from "@/hooks/useScrollScene";

/**
 * -----------------------------------------------------------------------------
 * RELATIONAL DOMAIN
 * -----------------------------------------------------------------------------
 * The entities of the system and the edges between them, revealed in stages as
 * the section is scrolled through: the two actors first, then the ride that
 * joins them, then money, then feedback, then settlement.
 *
 * The staging is the argument. Showing all eight nodes at once would be a
 * diagram of a schema; revealing them in dependency order shows that each part
 * only makes sense in terms of the ones before it — which is the point being
 * made about the domain being relational rather than a set of screens.
 *
 * An edge lights only when both of its endpoints are active, so the graph
 * assembles itself rather than fading in wholesale.
 *
 * Below `md` the graph is replaced by a plain staged list: eight labelled nodes
 * and their edges do not survive being scaled to a phone, and an unreadable
 * diagram explains nothing.
 * -----------------------------------------------------------------------------
 */

/** A node, positioned in the 900×560 viewBox by the project's own data. */
type Node = { id: string; label: string; stage: number; x: number; y: number };

const BOX = { w: 168, h: 54 };
/** Gap left between a box edge and the line that meets it. */
const GAP = 7;

/**
 * Where the segment from `from` to `to` leaves `from`'s box, plus a gap.
 *
 * Drawn centre to centre the edges pass underneath the boxes, which is
 * invisible only for as long as every box stays opaque; trimming also leaves an
 * even gap at every junction, which is what makes the graph read as drawn
 * rather than as boxes dropped on top of lines.
 */
const exitPoint = (from: Node, to: Node) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const scale = Math.min(
    dx === 0 ? Infinity : (BOX.w / 2 + GAP) / Math.abs(dx),
    dy === 0 ? Infinity : (BOX.h / 2 + GAP) / Math.abs(dy),
  );
  return { x: from.x + dx * scale, y: from.y + dy * scale };
};

export function DomainGraph({
  nodes,
  edges,
}: {
  nodes: Node[];
  edges: [string, string][];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(1);

  const maxStage = nodes.reduce((m, n) => Math.max(m, n.stage), 1);

  const reducedMotion = useScrollScene(sectionRef, (scope) => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: "top 78%",
          end: "bottom 55%",
          scrub: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const next = Math.min(
              maxStage,
              Math.floor(self.progress * maxStage) + 1,
            );
            setStage((prev) => (prev === next ? prev : next));
          },
        },
      });
    });

    return () => mm.revert();
  });

  // Without motion every stage is simply shown — the content must not depend
  // on an animation the reader has asked not to see.
  const revealed = (s: number) => reducedMotion || stage >= s;
  const stageOf = (id: string) => nodes.find((n) => n.id === id)?.stage ?? 99;

  return (
    <div ref={sectionRef} className="w-full">
      {/*
        Both forms are rendered and swapped with CSS rather than a JS media
        query. A media query resolves to `false` during server rendering, so
        the markup would ship as the mobile list and swap to the graph only
        after hydration — a visible content change and a layout shift on every
        desktop load. `display: none` also keeps the hidden one out of the
        accessibility tree, so nothing is announced twice.
      */}
      <div
          className="hidden overflow-hidden rounded-[clamp(0.875rem,1.6vw,1.5rem)] border p-[clamp(1rem,2vw,2rem)] md:block"
          style={{
            borderColor: "var(--p-muted, var(--color-line))",
            backgroundColor: "var(--p-cream, var(--color-surface))",
          }}
        >
          <svg viewBox="0 0 900 560" className="h-full w-full" role="img"
               aria-label="Entities in the system and the relationships between them">
            {/* Edges first, so nodes sit on top of them */}
            {edges.map(([from, to]) => {
              const a = nodes.find((n) => n.id === from);
              const b = nodes.find((n) => n.id === to);
              if (!a || !b) return null;
              const on = revealed(Math.max(stageOf(from), stageOf(to)));
              const p = exitPoint(a, b);
              const q = exitPoint(b, a);

              return (
                <line
                  key={`${from}-${to}`}
                  x1={p.x}
                  y1={p.y}
                  x2={q.x}
                  y2={q.y}
                  strokeLinecap="round"
                  stroke={
                    on
                      ? "var(--p-muted, var(--color-line-strong))"
                      : "var(--color-line)"
                  }
                  strokeWidth={on ? 1.5 : 1}
                  strokeOpacity={on ? 0.9 : 0.35}
                  style={{ transition: "stroke-opacity 600ms, stroke-width 600ms" }}
                />
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const on = revealed(node.stage);
              const isCurrent = !reducedMotion && stage === node.stage;

              return (
                <g
                  key={node.id}
                  style={{ transition: "opacity 600ms" }}
                  opacity={on ? 1 : 0.28}
                >
                  <rect
                    x={node.x - BOX.w / 2}
                    y={node.y - BOX.h / 2}
                    width={BOX.w}
                    height={BOX.h}
                    rx="8"
                    fill="#ffffff"
                    stroke={
                      isCurrent
                        ? "var(--p-warm, var(--color-accent))"
                        : on
                          ? "var(--p-accent, var(--color-ink))"
                          : "var(--color-line)"
                    }
                    strokeWidth={isCurrent ? 1.75 : 1.15}
                    style={{ transition: "stroke 600ms, stroke-width 600ms" }}
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    fontFamily="ui-sans-serif, system-ui, sans-serif"
                    fontSize="15"
                    letterSpacing="2.2"
                    fill={
                      isCurrent
                        ? "var(--p-warm, var(--color-accent))"
                        : "var(--color-ink)"
                    }
                    style={{ transition: "fill 600ms" }}
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
      </div>

      {/* Below md: the same staging, as a list that can actually be read. */}
      <ol
        className="overflow-hidden rounded-2xl border md:hidden"
        style={{
          borderColor: "var(--p-muted, var(--color-line))",
          backgroundColor: "var(--p-cream, var(--color-surface))",
        }}
      >
          {nodes.map((node) => {
            const on = revealed(node.stage);
            return (
              <li
                key={node.id}
                className="flex items-center gap-4 border-b px-5 py-4 last:border-b-0"
                style={{
                  borderColor: "var(--color-line)",
                  opacity: on ? 1 : 0.35,
                  transition: "opacity 600ms",
                }}
              >
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{
                    backgroundColor: on
                      ? "var(--p-accent, var(--color-accent))"
                      : "var(--color-line-strong)",
                    transition: "background-color 600ms",
                  }}
                />
                <span className="text-[0.9375rem] tracking-[0.12em] text-[var(--color-ink)]">
                  {node.label}
                </span>
              </li>
            );
          })}
      </ol>
    </div>
  );
}
