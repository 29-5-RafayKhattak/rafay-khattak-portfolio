"use client";

import { useEffect, useState } from "react";

/**
 * Reports which of the given section ids the reader is currently in.
 *
 * Derived from scroll position rather than IntersectionObserver: a case study
 * has stretches — diagrams, pinned sequences — where no section's box happens
 * to straddle an observer's root band, and an observer simply reports nothing
 * there, leaving the highlight stranded. Walking the list and taking the last
 * section whose top has passed the reading line always gives an answer.
 *
 * Reads are throttled to one animation frame and touch only
 * getBoundingClientRect, so the cost is a handful of rect reads per frame.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    if (!ids.length) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      // A little above centre: a heading feels "current" as it settles into
      // the upper half of the screen, not once it reaches the middle.
      const line = window.innerHeight * 0.38;

      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = id;
      }

      setActive((prev) => (prev === current ? prev : current));
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
  }, [ids]);

  return active;
}
