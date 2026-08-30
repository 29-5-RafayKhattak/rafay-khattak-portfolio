"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { anchorOffset } from "@/lib/navigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type ScrollApi = {
  /** Scrolls to a selector or offset, using Lenis when it is running. */
  scrollTo: (target: string | number, offset?: number) => void;
  /** Freezes the page beneath an overlay. Safe to call with Lenis disabled. */
  setLocked: (locked: boolean) => void;
};

const ScrollContext = createContext<ScrollApi>({
  scrollTo: () => {},
  setLocked: () => {},
});

export const useSmoothScroll = () => useContext(ScrollContext);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    /*
     * Reduced motion: no Lenis at all. Native scrolling stays completely
     * untouched, and ScrollTrigger is never wired up by the sections either.
     */
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Gentle expo-out. Enough damping to feel premium, not enough to feel
      // like the page is ignoring the input.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      // Trackpads and touchscreens keep their native 1:1 feel — only the
      // discrete mouse wheel gets smoothed.
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
      autoRaf: false,
    });

    lenisRef.current = lenis;

    // --- ScrollTrigger synchronisation ------------------------------------
    // Lenis owns the scroll position, so ScrollTrigger must be updated from
    // Lenis rather than from the browser's own scroll event.
    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    // One rAF loop for the whole page: GSAP's ticker drives Lenis.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    /*
     * ---------------------------------------------------------------------
     * KEYBOARD SCROLLING
     * ---------------------------------------------------------------------
     * Lenis has no keyboard handling of its own. Left alone, pressing Home or
     * Page Up moves the native scroll position while Lenis's internal target
     * stays where it was — and on the next frame Lenis drags the page back.
     * The page then appears frozen to anyone not using a mouse.
     *
     * So the scroll keys are routed through Lenis instead, which keeps the
     * keyboard on exactly the same easing as the wheel.
     */
    const SCROLL_KEYS = new Set([
      "Home",
      "End",
      "PageUp",
      "PageDown",
      "ArrowUp",
      "ArrowDown",
      " ",
      "Spacebar",
    ]);

    const isTypingTarget = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      if (!el || !el.tagName) return false;
      if (el.isContentEditable) return true;
      return ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!SCROLL_KEYS.has(event.key)) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      const page = window.innerHeight * 0.9;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      // targetScroll, not animatedScroll: repeated presses should stack up
      // rather than all resolving from the same in-flight position.
      const current = lenis.targetScroll;
      let destination: number;

      switch (event.key) {
        case "Home":
          destination = 0;
          break;
        case "End":
          destination = max;
          break;
        case "PageUp":
          destination = current - page;
          break;
        case "PageDown":
          destination = current + page;
          break;
        case "ArrowUp":
          destination = current - 90;
          break;
        case "ArrowDown":
          destination = current + 90;
          break;
        default: // Space, with Shift to go back
          destination = current + (event.shiftKey ? -page : page);
      }

      event.preventDefault();
      lenis.scrollTo(Math.max(0, Math.min(max, destination)), {
        duration: event.key === "Home" || event.key === "End" ? 1.2 : 0.7,
      });
    };

    /*
     * Tabbing to an element below the fold makes the browser scroll it into
     * view natively — the same divergence as above, from the other direction.
     * Adopting the browser's new position keeps Lenis from undoing it.
     */
    const onFocusIn = () => {
      if (Math.abs(window.scrollY - lenis.animatedScroll) < 2) return;
      if (lenis.isScrolling) return;
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  /*
   * Late-arriving layout (webfonts swapping, the portrait decoding) changes
   * section heights after the first ScrollTrigger measurement. Refresh once
   * everything has settled so pinned ranges line up with reality.
   */
  useEffect(() => {
    if (reducedMotion) return;

    let cancelled = false;
    const refresh = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };

    const onLoad = () => requestAnimationFrame(refresh);
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    document.fonts?.ready.then(refresh).catch(() => {});

    /*
     * A page that initialises while hidden measures a viewport of zero — a
     * background tab, a restored session, a prerendered navigation. Every
     * pinned scene's height is a multiple of `vh`, so all of them collapse to
     * nothing, every trigger range becomes empty, and no sequence ever
     * advances: the reader gets the first frame of each scene and no error to
     * explain why. Refreshing once the document is actually visible is the
     * correction, and it costs nothing — ScrollTrigger.refresh is a no-op when
     * the measurements have not moved.
     */
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        requestAnimationFrame(refresh);
      }
    };

    document.addEventListener("visibilitychange", onVisible);
    // A back/forward-cache restore skips `load` entirely.
    window.addEventListener("pageshow", onVisible);

    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", onVisible);
    };
  }, [reducedMotion]);

  /*
   * Arriving with a hash — a shared link, or "Back to Selected Work" coming
   * from a case study — needs the same curtain correction that in-page links
   * get. The browser's native anchor jump lands on the raw section top, which
   * for a pinned scene is one full viewport before its content is on screen.
   *
   * Keyed on pathname, not mount: this provider lives in the root layout and
   * does not remount on client-side navigation, so a mount-only effect would
   * fire on hard loads and silently do nothing on every Link.
   *
   * Corrected repeatedly over the first moments rather than once. Pinned
   * section heights are only final after fonts swap and ScrollTrigger
   * measures, so the correct destination moves for a few frames after arrival.
   */
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return;

    const timers: number[] = [];
    const correct = () => {
      const target = document.querySelector(hash);
      if (!target) return;
      const top =
        target.getBoundingClientRect().top +
        window.scrollY +
        anchorOffset(hash);
      window.scrollTo({ top, behavior: "auto" });
      lenisRef.current?.scrollTo(top, { immediate: true, force: true });
    };

    [0, 120, 320, 640].forEach((delay) => {
      timers.push(window.setTimeout(correct, delay));
    });

    return () => timers.forEach(window.clearTimeout);
  }, [pathname]);

  const scrollTo = useCallback((target: string | number, offset = 0) => {
    const lenis = lenisRef.current;

    if (lenis) {
      lenis.scrollTo(target, { offset, duration: 1.4 });
      return;
    }

    // Reduced motion / Lenis unavailable — jump natively.
    if (typeof target === "number") {
      window.scrollTo({ top: target + offset });
      return;
    }
    const el = document.querySelector(target);
    if (el) {
      const top =
        el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top });
    }
  }, []);

  /*
   * Lenis owns the scroll position, so stopping it is what actually freezes
   * the page. `overflow: hidden` on <body> is the fallback for reduced motion,
   * where Lenis is never created.
   */
  const setLocked = useCallback((locked: boolean) => {
    const lenis = lenisRef.current;
    if (lenis) {
      if (locked) lenis.stop();
      else lenis.start();
      return;
    }
    document.body.style.overflow = locked ? "hidden" : "";
  }, []);

  const value = useMemo<ScrollApi>(
    () => ({ scrollTo, setLocked }),
    [scrollTo, setLocked],
  );

  return (
    <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>
  );
}
