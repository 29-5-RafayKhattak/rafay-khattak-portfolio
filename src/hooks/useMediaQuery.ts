"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Subscribes to a media query through `useSyncExternalStore`, which is the
 * concurrent-safe way to read a browser API during render.
 *
 * The server snapshot is always `false`, so SSR and the first client render
 * agree and hydration stays clean. React then re-renders with the real value
 * if it differs — which is exactly when animation setup happens.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** True only on devices with a real pointer — never on touch. */
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
