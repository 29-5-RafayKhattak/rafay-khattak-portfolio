/**
 * Anchor scrolling.
 *
 * A scene that is pulled up under the one before it starts one CURTAIN earlier
 * than the point where its content is actually on screen. Jumping to the raw
 * section top would therefore land the reader on the tail of the *previous*
 * scene. Scene tags those sections with `data-anchor-offset-vh`, and this
 * helper adds it back on.
 */

/** Clearance for the fixed navigation bar. */
const NAV_CLEARANCE = 80;

export function anchorOffset(href: string): number {
  if (typeof document === "undefined") return -NAV_CLEARANCE;

  const target = document.querySelector(href);
  const curtainVh = target?.getAttribute("data-anchor-offset-vh");
  const curtainPx = curtainVh
    ? (window.innerHeight * parseFloat(curtainVh)) / 100
    : 0;

  return curtainPx - NAV_CLEARANCE;
}
