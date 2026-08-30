"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * `reducedMotion="user"` makes every Framer Motion component honour the OS
 * setting automatically: transforms are dropped and only opacity is animated.
 *
 * The scroll-linked GSAP layer opts out separately (each section checks the
 * hook before building a timeline at all), so the two halves of the animation
 * system are covered by their own mechanism rather than one global switch.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
