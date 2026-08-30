"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

import { FINE_POINTER, useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type CursorMode = "default" | "view" | "arrow";

/**
 * A small dot that grows into a labelled disc over interactive regions.
 *
 * Opt-in per element via `data-cursor="view" | "arrow"`. Mounted only on
 * genuine fine-pointer devices, and never under reduced motion, so touch
 * users keep their native behaviour and nothing extra runs on their main
 * thread.
 */
export function Cursor() {
  const reducedMotion = useReducedMotion();
  const finePointer = useMediaQuery(FINE_POINTER);
  const enabled = finePointer && !reducedMotion;
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 750, damping: 42, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 750, damping: 42, mass: 0.35 });

  useEffect(() => {
    if (!enabled) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor-active");

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      if (!visible) setVisible(true);

      const target = (event.target as Element | null)?.closest?.("[data-cursor]");
      const next = target?.getAttribute("data-cursor");
      setMode(next === "view" || next === "arrow" ? next : "default");
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      root.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [enabled, visible, x, y]);

  if (!enabled) return null;

  const expanded = mode !== "default";

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[100] mix-blend-difference"
      style={{ x: springX, y: springY }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="flex items-center justify-center rounded-full bg-white text-[0.6875rem] font-medium tracking-[0.06em] text-black uppercase"
        animate={{
          width: expanded ? 68 : 9,
          height: expanded ? 68 : 9,
          x: expanded ? -34 : -4.5,
          y: expanded ? -34 : -4.5,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.6 }}
      >
        <AnimatePresence mode="wait">
          {mode === "view" && (
            <motion.span
              key="view"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.16 }}
            >
              View
            </motion.span>
          )}
          {mode === "arrow" && (
            <motion.span
              key="arrow"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.16 }}
            >
              <ArrowUpRight className="h-5 w-5" strokeWidth={1.75} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
