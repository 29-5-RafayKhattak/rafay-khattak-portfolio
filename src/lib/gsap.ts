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

  /*
   * MOBILE BROWSER CHROME
   *
   * On iOS Safari and Chrome Android the URL bar collapses as you scroll down
   * and returns as you scroll up, which changes `window.innerHeight` by
   * ~60-100px mid-gesture and fires `resize`. ScrollTrigger's default response
   * is a full refresh: every start/end is remeasured, and because this page is
   * a stack of pinned scenes whose ranges are all multiples of the viewport,
   * every one of them moves underneath the reader. The visible result is the
   * page jumping backwards a few hundred pixels the moment the bar animates.
   *
   * `ignoreMobileResize` makes ScrollTrigger skip the refresh when only the
   * height changed and only by a small amount — which is exactly the URL bar,
   * and never an orientation change (that swaps the width too, so it still
   * refreshes). The layout itself does not need the refresh either way: the
   * stages are sized in `svh`, the *small* viewport height, so their boxes are
   * already measured against the chrome being visible and do not move when it
   * hides.
   */
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };
