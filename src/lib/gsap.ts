"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Single registration point for GSAP plugins.
 *
 * ScrollTrigger touches `document` at import time, so every module that needs
 * it imports from here rather than registering independently — that keeps the
 * plugin from being registered repeatedly across client components.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  // Transforms are the only thing we animate on scroll, so let GSAP force
  // 3D layers only where it helps rather than everywhere.
  gsap.config({ nullTargetWarn: false });
  gsap.defaults({ ease: "none" });
}

export { gsap, ScrollTrigger };
