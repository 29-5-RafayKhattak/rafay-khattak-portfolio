"use client";

import { useEffect, useState } from "react";

export type Tone = "day" | "night";

/** Vertical centre of the navigation bar, in CSS pixels from the viewport top. */
const NAV_LINE = 34;

/**
 * Reports whether the surface currently sitting under the navigation bar is
 * light or dark, so the bar can invert instead of going dark-on-dark.
 *
 * Elements opt in with `data-tone`. They are read in document order and the
 * first one covering the nav line wins — which matches paint order, because
 * the pinned scenes carry descending z-indexes (see lib/scene.ts). The hero
 * marks its own two halves separately, since its background darkens partway
 * through rather than at a section boundary.
 *
 * Reads are throttled to one per frame and touch only getBoundingClientRect,
 * so this costs a handful of rect reads per frame at most.
 */
export function useNavTone(): Tone {
  const [tone, setTone] = useState<Tone>("day");

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const zones = document.querySelectorAll<HTMLElement>("[data-tone]");

      for (const zone of zones) {
        const rect = zone.getBoundingClientRect();
        if (rect.top <= NAV_LINE && rect.bottom > NAV_LINE) {
          const next = zone.dataset.tone === "night" ? "night" : "day";
          setTone((current) => (current === next ? current : next));
          return;
        }
      }

      setTone((current) => (current === "day" ? current : "day"));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return tone;
}
