"use client";

import { useId } from "react";

/**
 * A slowly rotating ring of the project's own terms.
 *
 * Set on a circular path and turned continuously, so the empty margin beside
 * the hero carries something rather than nothing. It reads the project's
 * disciplines rather than decorative words — the same list the progress line
 * below it uses — so it is still saying something about the work.
 *
 * Held deliberately quiet: low contrast, a slow revolution, and no interaction.
 * It is the only perpetual motion on the site, which is why it is small, muted,
 * and appears exactly once.
 *
 * `textLength` with `lengthAdjust="spacing"` fits the string to the exact
 * circumference, so the loop closes with no seam or overlap whatever the
 * caller passes in.
 */
export function OrbitingTags({
  items,
  className = "",
  seconds = 38,
}: {
  items: string[];
  className?: string;
  seconds?: number;
}) {
  const id = useId().replace(/:/g, "");
  const pathId = `orbit-${id}`;

  const R = 78;
  const circumference = 2 * Math.PI * R;
  const label = `${items.join("  ·  ")}  ·  `;

  return (
    <div
      className={`orbit-tags pointer-events-none select-none ${className}`}
      style={{ "--orbit-seconds": `${seconds}s` } as React.CSSProperties}
    >
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
        <defs>
          <path
            id={pathId}
            fill="none"
            d={`M100,100 m-${R},0 a${R},${R} 0 1,1 ${R * 2},0 a${R},${R} 0 1,1 -${R * 2},0`}
          />
        </defs>

        {/* The ring the type sits on */}
        <circle
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke="var(--p-muted, var(--color-line))"
          strokeOpacity="0.55"
        />

        <text
          fontFamily="ui-monospace, SFMono-Regular, monospace"
          fontSize="9.5"
          letterSpacing="1.2"
          fill="var(--p-accent, var(--color-muted))"
          fillOpacity="0.62"
        >
          <textPath
            href={`#${pathId}`}
            startOffset="0"
            textLength={circumference}
            lengthAdjust="spacing"
          >
            {label.toUpperCase()}
          </textPath>
        </text>

        {/* A single mark at the centre, so the ring reads as deliberate */}
        <circle
          cx="100"
          cy="100"
          r="3"
          fill="var(--p-warm, var(--color-accent))"
        />
      </svg>
    </div>
  );
}
