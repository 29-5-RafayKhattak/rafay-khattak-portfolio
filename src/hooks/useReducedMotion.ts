"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";

/**
 * Tracks `prefers-reduced-motion`, including live changes to the setting.
 *
 * Returns `false` during SSR and the first client render so markup matches;
 * the real value arrives immediately after, which is before any scroll scene
 * is wired up.
 */
export function useReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
