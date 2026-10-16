"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { scheduleScrollRefresh } from "@/lib/gsap";
import { anchorOffset } from "@/lib/navigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type ScrollApi = {
  scrollTo: (target: string | number, offset?: number) => void;
  setLocked: (locked: boolean) => void;
};

const ScrollContext = createContext<ScrollApi>({ scrollTo: () => {}, setLocked: () => {} });
export const useSmoothScroll = () => useContext(ScrollContext);

/** Native wheel, trackpad and keyboard scrolling; easing only for anchor clicks. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();
  const previousOverflow = useRef<string | null>(null);

  useEffect(() => {
    let disposed = false;
    let interacted = false;
    let frame: number | undefined;
    const interrupt = () => { interacted = true; };

    // Correct deep links after scene layout settles, but never pull someone
    // back to the anchor once they start scrolling or interacting.
    const settle = () => {
      if (disposed) return;
      scheduleScrollRefresh();
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = undefined;
        if (interacted || !window.location.hash) return;
        let id: string;
        try { id = decodeURIComponent(window.location.hash.slice(1)); }
        catch { return; }
        const target = document.getElementById(id);
        if (!target) return;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY + anchorOffset(`#${CSS.escape(id)}`),
          behavior: "instant",
        });
      });
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") scheduleScrollRefresh();
    };

    window.addEventListener("wheel", interrupt, { passive: true });
    window.addEventListener("touchstart", interrupt, { passive: true });
    window.addEventListener("pointerdown", interrupt, { passive: true });
    window.addEventListener("keydown", interrupt);
    window.addEventListener("load", settle, { once: true });
    window.addEventListener("pageshow", onVisible);
    document.addEventListener("visibilitychange", onVisible);
    document.fonts?.ready.then(settle).catch(() => {});
    settle();

    return () => {
      disposed = true;
      if (frame !== undefined) cancelAnimationFrame(frame);
      window.removeEventListener("wheel", interrupt);
      window.removeEventListener("touchstart", interrupt);
      window.removeEventListener("pointerdown", interrupt);
      window.removeEventListener("keydown", interrupt);
      window.removeEventListener("load", settle);
      window.removeEventListener("pageshow", onVisible);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [pathname, reducedMotion]);

  const scrollTo = useCallback((target: string | number, offset = 0) => {
    const el = typeof target === "string" ? document.querySelector(target) : null;
    if (typeof target === "string" && !el) return;
    const top = typeof target === "number"
      ? target
      : el!.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + offset, behavior: reducedMotion ? "instant" : "smooth" });
  }, [reducedMotion]);

  const setLocked = useCallback((locked: boolean) => {
    if (locked && previousOverflow.current === null) {
      previousOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else if (!locked && previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }
  }, []);

  useEffect(() => () => {
    if (previousOverflow.current !== null) document.body.style.overflow = previousOverflow.current;
  }, []);

  const value = useMemo(() => ({ scrollTo, setLocked }), [scrollTo, setLocked]);
  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}
