"use client";

import { person } from "@/data/portfolio";

/**
 * The status dot breathes rather than blinks — a slow halo pulse, which reads
 * as "live" without pulling focus away from the name. Pure CSS, so it costs
 * nothing on the main thread and stops under reduced motion (see globals.css).
 */
export function AvailabilityBadge({
  className = "",
  night = false,
}: {
  className?: string;
  night?: boolean;
}) {
  return (
    <div
      className={[
        "inline-flex w-fit shrink-0 self-start items-center gap-2.5 rounded-full border py-2 pl-3 pr-4 backdrop-blur-sm",
        night
          ? "border-[var(--color-night-line)] bg-white/5"
          : "border-[var(--color-line)] bg-[var(--color-white)]/70",
        className,
      ].join(" ")}
    >
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
        <span className="availability-halo absolute inset-0 rounded-full bg-[#3faa62]" />
        <span className="relative h-2 w-2 rounded-full bg-[#3faa62]" />
      </span>
      <span
        className={[
          "text-[0.6875rem] font-medium tracking-[0.08em] uppercase whitespace-nowrap",
          night ? "text-[var(--color-night-ink)]" : "text-[var(--color-ink)]",
        ].join(" ")}
      >
        {person.availability}
      </span>
    </div>
  );
}
