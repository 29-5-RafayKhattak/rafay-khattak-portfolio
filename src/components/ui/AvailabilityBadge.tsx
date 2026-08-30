"use client";

/**
 * -----------------------------------------------------------------------------
 * AVAILABILITY
 * -----------------------------------------------------------------------------
 * A solid green dot with a faint ring that expands out of it every few
 * seconds, and a line of small mono capitals beside it.
 *
 * DELIBERATELY NOT A CHIP
 * This used to be a bordered, blurred white pill. In the navigation that made
 * the least important thing on the bar the most prominent: it was the widest,
 * brightest, only-contained element, so the eye landed on availability before
 * it found the navigation or the call to action. It is bare type at the same
 * register as every other micro-label on the site, which puts the single solid
 * button back in charge of the bar.
 *
 * THE PULSE
 * Long and mostly idle rather than a steady blink: the ring expands once, then
 * the animation spends the rest of its 4.4s cycle doing nothing. A status that
 * beats continuously reads as an alert; this reads as a light that is on. It
 * is one transform and one opacity on a 6px element, so it stays on the
 * compositor, and it stops entirely under reduced motion (see globals.css).
 * -----------------------------------------------------------------------------
 */
export function AvailabilityBadge({
  availability,
  className = "",
  night = false,
  /** Larger type and dot, for the foot of the mobile menu. */
  size = "sm",
}: {
  availability: string;
  className?: string;
  night?: boolean;
  size?: "sm" | "md";
}) {
  const dot = size === "md" ? "h-2 w-2" : "h-1.5 w-1.5";

  return (
    <div
      className={[
        "inline-flex w-fit shrink-0 items-center self-start",
        size === "md" ? "gap-3" : "gap-2.5",
        className,
      ].join(" ")}
    >
      <span className={`relative flex shrink-0 ${dot}`} aria-hidden="true">
        <span
          className={`availability-halo absolute inset-0 rounded-full bg-[var(--color-live)]`}
        />
        <span
          className={`relative rounded-full bg-[var(--color-live)] ${dot}`}
        />
      </span>
      <span
        className={[
          // Mono capitals, matching every other micro-label on the site, and
          // muted so it reads as a status line rather than a claim.
          "font-mono font-medium uppercase whitespace-nowrap",
          size === "md"
            ? "text-[0.75rem] tracking-[0.16em]"
            : "text-[0.6875rem] tracking-[0.14em]",
          night ? "text-[var(--color-night-muted)]" : "text-[var(--color-muted)]",
        ].join(" ")}
      >
        {availability}
      </span>
    </div>
  );
}
