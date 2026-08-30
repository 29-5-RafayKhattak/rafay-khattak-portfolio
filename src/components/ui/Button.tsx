"use client";

import { motion, useMotionValue, useSpring, useReducedMotion as useFramerReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef, type MouseEvent, type ReactNode } from "react";

/**
 * Internal hrefs route through next/link so navigation stays client-side and
 * the smooth-scroll provider is never torn down mid-journey. Wrapped once at
 * module scope — creating it per render would remount the anchor on every
 * pointer move the magnetic effect triggers.
 */
const MotionLink = motion.create(Link);

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  /** Renders the ↗ glyph that nudges on hover. */
  arrow?: boolean;
  /** Leading circular icon — used by the secondary hero CTA. */
  icon?: ReactNode;
  className?: string;
  ariaLabel?: string;
  night?: boolean;
};

/**
 * Hover and press states are Framer Motion (entrance/interaction layer).
 * Nothing here is scroll-linked, so GSAP never touches these elements.
 */
export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  arrow = false,
  icon,
  className = "",
  ariaLabel,
  night = false,
}: ButtonProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReduced = useFramerReducedMotion();

  // --- Magnetic pull -------------------------------------------------------
  // Deliberately small (max ~6px). Enough to feel responsive, not enough to
  // make the button feel like it is dodging the pointer.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 22, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 22, mass: 0.4 });

  const handleMove = (event: MouseEvent) => {
    if (prefersReduced || !ref.current) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const rect = ref.current.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-6, Math.min(6, relX * 0.18)));
    y.set(Math.max(-5, Math.min(5, relY * 0.22)));
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "group relative inline-flex items-center gap-2.5 rounded-full font-medium select-none";

  const variants: Record<Variant, string> = {
    primary: night
      ? "bg-[var(--color-night-ink)] text-[var(--color-night)] px-6 py-3.5 md:px-7 md:py-4 text-[0.9375rem]"
      : "bg-[var(--color-ink)] text-[var(--color-canvas)] px-6 py-3.5 md:px-7 md:py-4 text-[0.9375rem]",
    secondary: night
      ? "text-[var(--color-night-ink)] pr-4 text-[0.9375rem]"
      : "text-[var(--color-ink)] pr-4 text-[0.9375rem]",
    ghost: night
      ? "text-[var(--color-night-muted)] hover:text-[var(--color-night-ink)] px-4 py-2 text-[0.875rem]"
      : "text-[var(--color-muted)] hover:text-[var(--color-ink)] px-4 py-2 text-[0.875rem]",
  };

  const content = (
    <>
      {icon && (
        <span
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
            night
              ? "border-[var(--color-night-line)] group-hover:border-[var(--color-night-ink)]"
              : "border-[var(--color-line-strong)] group-hover:border-[var(--color-ink)]",
          ].join(" ")}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <span className="whitespace-nowrap">{children}</span>
      {arrow && (
        <ArrowUpRight
          className="h-[1.05em] w-[1.05em] shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      )}
    </>
  );

  const motionProps = {
    ref: ref as never,
    className: `${base} ${variants[variant]} ${className}`,
    style: { x: springX, y: springY },
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    whileTap: prefersReduced ? undefined : { scale: 0.975 },
    "data-cursor": "arrow" as const,
    "aria-label": ariaLabel,
  };

  if (href) {
    // Anything not starting with "/" is external, a hash, or a mailto.
    const internal = href.startsWith("/");

    if (internal) {
      return (
        <MotionLink href={href} {...motionProps}>
          {content}
        </MotionLink>
      );
    }

    return (
      <motion.a href={href} {...motionProps}>
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button type="button" onClick={onClick} {...motionProps}>
      {content}
    </motion.button>
  );
}
