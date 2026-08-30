"use client";

import { useState } from "react";

import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

/**
 * Whether a scroll-driven reveal may start from a hidden state.
 *
 * WHY THIS EXISTS
 * The grades, the semester markers and the distinction are information, not
 * decoration — a reader has to end up seeing them. Starting them hidden and
 * waiting for GSAP means that anything which stops the animation layer running
 * takes the content with it: reduced motion, a hydration failure, a scroll
 * library that never initialises, or a background tab where the viewport
 * measures zero.
 *
 * So the server renders the finished state, and the reveal is armed in a
 * layout effect — before paint, so there is no flash of the answer — and only
 * when motion is actually wanted. If the effect never runs, the section is
 * simply already readable. The animation becomes something that can fail
 * without costing anything, which is the only safe way to hide a fact behind
 * a scroll position.
 */
export function useArmedReveal(enabled: boolean): boolean {
  const [armed, setArmed] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (enabled) setArmed(true);
  }, [enabled]);

  return armed;
}
