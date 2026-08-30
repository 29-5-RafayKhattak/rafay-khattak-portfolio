"use client";

import { motion } from "framer-motion";

import { fadeUp, IN_VIEW_SOFT, staggerGroup } from "@/lib/animations";

/**
 * The problem, drawn: two audiences with competing needs meeting at one
 * system. Public visitors read, editors publish, and the CMS in the middle is
 * what has to serve both — which is the whole reason the project exists.
 *
 * Generated geometry, not a screenshot. Nothing here reflects real screens,
 * real content or real internal structure.
 */
export function RelationDiagram() {
  const nodes = [
    { id: "public", label: "Public website", note: "People finding information" },
    { id: "cms", label: "CMS", note: "Structure and publishing", accent: true },
    { id: "editors", label: "Content editors", note: "People maintaining it" },
  ];

  return (
    <motion.div
      variants={staggerGroup(0.12)}
      initial="hidden"
      whileInView="show"
      viewport={IN_VIEW_SOFT}
      className="mx-auto flex max-w-lg flex-col items-stretch"
    >
      {nodes.map((node, i) => (
        <motion.div key={node.id} variants={fadeUp}>
          <div
            className="rounded-2xl border px-6 py-5 text-center"
            style={{
              borderColor: node.accent
                ? "var(--color-accent)"
                : "var(--color-line)",
              backgroundColor: node.accent
                ? "var(--color-accent-soft)"
                : "var(--color-surface)",
            }}
          >
            <p
              className="text-[1.0625rem] font-medium tracking-[-0.015em]"
              style={{
                color: node.accent
                  ? "var(--color-accent)"
                  : "var(--color-ink)",
              }}
            >
              {node.label}
            </p>
            <p className="eyebrow mt-2 text-[var(--color-muted)]">{node.note}</p>
          </div>

          {/* Both directions matter equally here. */}
          {i < nodes.length - 1 && (
            <div
              aria-hidden="true"
              className="flex flex-col items-center py-3 text-[var(--color-line-strong)]"
            >
              <span className="text-[0.75rem] leading-none">&#9650;</span>
              <span className="my-1 block h-6 w-px bg-[var(--color-line-strong)]" />
              <span className="text-[0.75rem] leading-none">&#9660;</span>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
