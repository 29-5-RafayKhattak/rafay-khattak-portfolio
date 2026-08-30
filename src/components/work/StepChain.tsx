"use client";

/**
 * A short ordered run of named steps.
 *
 * Wraps rather than scrolls horizontally: a scroller hides its own end, and the
 * last step of a chain is usually the one that matters — the result, the output,
 * the thing not done yet. On a phone these fold onto two or three rows and stay
 * entirely visible.
 *
 * Labels only, never values. Every chain on this site describes a path that
 * something takes; putting numbers on one would turn a description into a
 * reported result.
 */
export function StepChain({
  steps,
  muted = false,
}: {
  steps: string[];
  /** For a chain of steps not yet taken — drawn as outline, not as fact. */
  muted?: boolean;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-3">
      {steps.map((step, i) => (
        <li key={step} className="flex items-center gap-3">
          <span
            className="rounded-full border px-3.5 py-2 text-[0.8125rem] whitespace-nowrap"
            style={{
              borderColor: muted
                ? "var(--color-line-strong)"
                : "var(--p-muted, var(--color-line-strong))",
              color: muted ? "var(--color-muted)" : "var(--color-ink)",
              backgroundColor: muted ? "transparent" : "var(--color-white)",
              borderStyle: muted ? "dashed" : "solid",
            }}
          >
            {step}
          </span>
          {i < steps.length - 1 && (
            <span
              aria-hidden="true"
              className="block h-px w-4 shrink-0"
              style={{
                backgroundColor: muted
                  ? "var(--color-line-strong)"
                  : "var(--p-muted, var(--color-line-strong))",
              }}
            />
          )}
        </li>
      ))}
    </ol>
  );
}
