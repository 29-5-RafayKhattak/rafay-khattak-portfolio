"use client";

import { useRef, type RefObject } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type SceneBuilder = (scope: HTMLElement) => void;

/**
 * Wires a scroll-linked scene to a section and tears it down completely on
 * unmount.
 *
 *   • Skipped entirely under `prefers-reduced-motion` — no ScrollTrigger is
 *     created, so the section renders as ordinary static content.
 *   • `gsap.context()` scopes every selector inside the section and its
 *     `revert()` removes the tweens, the inline styles they wrote AND the
 *     ScrollTriggers they created. That is what stops instances leaking across
 *     navigations.
 *   • The builder is held in a ref so re-renders never rebuild the timeline.
 *
 * Returns whether reduced motion is active, so callers can render a static
 * fallback layout.
 */
export function useScrollScene<T extends HTMLElement>(
  ref: RefObject<T | null>,
  build: SceneBuilder,
): boolean {
  const reducedMotion = useReducedMotion();
  const buildRef = useRef(build);

  // Declared before the scene effect, so on mount the ref is current by the
  // time the scene is built, and later renders swap the builder without
  // tearing the timeline down.
  useIsomorphicLayoutEffect(() => {
    buildRef.current = build;
  });

  useIsomorphicLayoutEffect(() => {
    const scope = ref.current;
    if (reducedMotion || !scope) return;

    const ctx = gsap.context(() => buildRef.current(scope), scope);

    // Section heights settle after fonts swap and images decode; re-measure
    // once on the next frame so pinned ranges match the final layout.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [reducedMotion, ref]);

  return reducedMotion;
}

export { gsap, ScrollTrigger };
