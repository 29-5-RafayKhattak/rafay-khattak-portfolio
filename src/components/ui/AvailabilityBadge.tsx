"use client";

/**
 * The status dot breathes rather than blinks — a slow halo pulse, which reads
 * as "live" without pulling focus away from the name. Pure CSS, so it costs
 * nothing on the main thread and stops under reduced motion (see globals.css).
 *
 * DELIBERATELY NOT A CHIP
 * This used to be a bordered, blurred white pill. In the navigation that made
 * the least important thing on the bar the most prominent: it was the widest,
 * brightest, only-contained element, so the eye landed on availability before
 * it found the navigation or the call to action. It is now bare type at the
 * same weight as everything else around it, which puts the single solid button
 * back in charge of the bar.
 */
export function AvailabilityBadge({
  availability,
  className = "",
  night = false,
}: {
  availability: string;
  className?: string;
  night?: boolean;
}) {
  return (
    <div
      className={[
        "inline-flex w-fit shrink-0 items-center gap-2.5 self-start",
        className,
      ].join(" ")}
    >
      <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
        <span className="availability-halo absolute inset-0 rounded-full bg-[#3faa62]" />
        <span className="relative h-2 w-2 rounded-full bg-[#3faa62]" />
      </span>
      <span
        className={[
          // Mono, matching every other micro-label on the site, and muted so it
          // reads as a status line rather than a claim.
          "font-mono text-[0.6875rem] font-medium tracking-[0.1em] uppercase whitespace-nowrap",
          night ? "text-[var(--color-night-muted)]" : "text-[var(--color-muted)]",
        ].join(" ")}
      >
        {availability}
      </span>
    </div>
  );
}
