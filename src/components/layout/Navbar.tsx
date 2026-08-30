"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { navigation, person } from "@/data/portfolio";
import { heroNav, EASE_OUT_EXPO } from "@/lib/animations";
import { anchorOffset } from "@/lib/navigation";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { useNavTone } from "@/hooks/useNavTone";
import { useSmoothScroll } from "@/components/layout/SmoothScroll";

/**
 * Fixed, deliberately light-weight. It is rendered as a sibling of the shell
 * rather than inside it, so the shell's `overflow: clip` can never interfere
 * with a fixed element.
 *
 * Entrance + hover + menu are Framer Motion. Nothing here is scroll-scrubbed;
 * the only scroll input is a boolean "has the page moved" flag.
 */
export function Navbar() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [scrolledSection, setScrolledSection] = useState("home");
  const { scrollTo, setLocked } = useSmoothScroll();
  const pathname = usePathname();
  const router = useRouter();
  /** Homepage anchors only resolve on the homepage. */
  const onHome = pathname === "/";
  /*
   * Derived, not stored: off the homepage there is no section to be "in", and
   * writing that emptiness into state from an effect would mean an extra
   * render on every navigation for a value already known during this one.
   */
  const activeId = onHome ? scrolledSection : "";
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  /*
   * The bar is fixed over scenes that alternate between paper and charcoal, so
   * it inverts rather than sitting dark-on-dark. Colours move on a transition
   * long enough to read as a dissolve, not a flicker.
   */
  const tone = useNavTone();
  const night = tone === "night";
  const swatch = {
    ink: night ? "var(--color-night-ink)" : "var(--color-ink)",
    muted: night ? "var(--color-night-muted)" : "var(--color-muted)",
    line: night ? "var(--color-night-line)" : "var(--color-line)",
    surface: night ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)",
    ctaBg: night ? "var(--color-night-ink)" : "var(--color-ink)",
    ctaInk: night ? "var(--color-night)" : "var(--color-canvas)",
  };
  const COLOR_FADE = "color 450ms ease, background-color 450ms ease, border-color 450ms ease";

  /* Compact state — a threshold, not a scrub. ----------------------------- */
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /*
   * Active section — orientation for the reader.
   *
   * Derived from scroll position rather than IntersectionObserver: the page
   * has scenes that are not nav destinations (the horizontal run, the toolkit)
   * and an observer simply reports nothing while they are on screen, leaving
   * the highlight stuck on whatever came last. Walking the list and taking the
   * final section the reader has passed always gives a sensible answer.
   *
   * Section tops are corrected by the same curtain offset the anchors use, so
   * a scene counts as reached when its content arrives, not when its box does.
   */
  useEffect(() => {
    if (!onHome) return;

    const ids = navigation.map((item) => item.href.slice(1));
    let frame = 0;

    const measure = () => {
      frame = 0;
      const line = window.scrollY + window.innerHeight * 0.4;

      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const curtainVh = el.getAttribute("data-anchor-offset-vh");
        const offset = curtainVh
          ? (window.innerHeight * parseFloat(curtainVh)) / 100
          : 0;
        if (el.offsetTop + offset <= line) current = id;
      }

      setScrolledSection((prev) => (prev === current ? prev : current));
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
  }, [onHome]);

  /*
   * While the menu is open: the page beneath is frozen, Escape closes it, and
   * focus moves into the panel and returns to the trigger on close — the
   * minimum a dialog owes a keyboard user.
   */
  useEffect(() => {
    if (!open) return;

    setLocked(true);
    // Captured now: by cleanup time the ref may point somewhere else.
    const trigger = triggerRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    menuRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      setLocked(false);
      window.removeEventListener("keydown", onKey);
      (previouslyFocused ?? trigger)?.focus?.();
    };
  }, [open, setLocked]);

  const go = useCallback(
    (href: string) => (event: React.MouseEvent) => {
      event.preventDefault();
      setOpen(false);

      // Off the homepage the target section does not exist in the document,
      // so the same link has to navigate there instead of scrolling.
      if (!onHome) {
        router.push(`/${href}`);
        return;
      }

      scrollTo(href, anchorOffset(href));
    },
    [scrollTo, onHome, router],
  );

  return (
    <>
      <motion.header
        variants={heroNav}
        initial="hidden"
        animate="show"
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className="relative mx-auto w-[calc(100vw-var(--shell-inset)*2)] max-w-[1700px]"
          style={{ transition: "padding 500ms cubic-bezier(0.16,1,0.3,1)" }}
        >
          {/*
            Once the page has moved, a soft scrim slides in behind the bar. It
            is a gradient that fades to nothing at its lower edge rather than a
            solid band, so the bar keeps reading as floating type over the page
            rather than becoming a conventional header — while text passing
            underneath stays legible.

            Width-matched to the shell: a full-bleed scrim would paint a dark
            bar across the grey margin outside the rounded container.
          */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[7.5rem]"
            style={{
              opacity: compact ? 1 : 0,
              background: night
                ? "linear-gradient(to bottom, rgba(17,17,17,0.94) 0%, rgba(17,17,17,0.74) 45%, rgba(17,17,17,0) 100%)"
                : "linear-gradient(to bottom, rgba(237,236,233,0.94) 0%, rgba(237,236,233,0.72) 45%, rgba(237,236,233,0) 100%)",
              transition:
                "opacity 500ms cubic-bezier(0.16,1,0.3,1), background 450ms ease",
            }}
          />
          <nav
            aria-label="Primary"
            className="gutter flex items-center justify-between transition-[padding-block] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ paddingBlock: compact ? "0.75rem" : "1.4rem" }}
          >
            {/* Left — availability -------------------------------------- */}
            <div className="flex items-center">
              <div className="hidden sm:block">
                <AvailabilityBadge night={night} />
              </div>
              <a
                href={onHome ? "#home" : "/"}
                onClick={go("#home")}
                className="text-[0.9375rem] font-semibold tracking-[-0.02em] sm:hidden"
                style={{ color: swatch.ink, transition: COLOR_FADE }}
              >
                RK
                <span className="sr-only"> — {person.fullName}, home</span>
              </a>
            </div>

            {/* Centre — links ------------------------------------------- */}
            <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
              {navigation.map((item) => {
                const id = item.href.slice(1);
                const isActive = activeId === id;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={go(item.href)}
                      aria-current={isActive ? "true" : undefined}
                      className="group relative block px-3.5 py-2 text-[0.875rem] font-medium"
                    >
                      <span
                        className="transition-colors duration-300 group-hover:!text-(--hover-ink)"
                        style={
                          {
                            color: isActive ? swatch.ink : swatch.muted,
                            transition: COLOR_FADE,
                            "--hover-ink": swatch.ink,
                          } as React.CSSProperties
                        }
                      >
                        {item.label}
                      </span>
                      {/* Line reveal — wipes out from the left on hover. */}
                      <span
                        aria-hidden="true"
                        className={[
                          "absolute bottom-1 left-3.5 h-px transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]",
                          "w-[calc(100%-1.75rem)] origin-left",
                          isActive
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100",
                        ].join(" ")}
                        style={{ backgroundColor: swatch.ink }}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Right — CTA + menu --------------------------------------- */}
            <div className="flex items-center gap-2">
              <a
                href="#contact"
                onClick={go("#contact")}
                data-cursor="arrow"
                className="group hidden items-center gap-2 rounded-full transition-[padding] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:inline-flex"
                style={{
                  paddingInline: compact ? "1.1rem" : "1.35rem",
                  paddingBlock: compact ? "0.6rem" : "0.75rem",
                  backgroundColor: swatch.ctaBg,
                  color: swatch.ctaInk,
                  transition: `${COLOR_FADE}, padding 500ms cubic-bezier(0.16,1,0.3,1)`,
                }}
              >
                <span className="text-[0.875rem] font-medium whitespace-nowrap">
                  Let&rsquo;s Talk
                </span>
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px] group-hover:-translate-y-[3px]"
                >
                  ↗
                </span>
              </a>

              <button
                ref={triggerRef}
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                className="flex h-10 w-10 items-center justify-center rounded-full border lg:hidden"
                style={{
                  borderColor: swatch.line,
                  backgroundColor: swatch.surface,
                  transition: COLOR_FADE,
                }}
              >
                <span className="sr-only">Menu</span>
                <span aria-hidden="true" className="flex flex-col gap-[5px]">
                  <span
                    className="block h-px w-4"
                    style={{ backgroundColor: swatch.ink }}
                  />
                  <span
                    className="block h-px w-4"
                    style={{ backgroundColor: swatch.ink }}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* Full-screen menu ------------------------------------------------ */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            ref={menuRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            className="fixed inset-0 z-[60] bg-[var(--color-night)] text-[var(--color-night-ink)] on-night"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
          >
            <div className="gutter flex h-full flex-col justify-between py-6">
              <div className="flex items-center justify-between">
                <span className="eyebrow text-[var(--color-night-muted)]">
                  {person.fullName}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-night-line)]"
                >
                  <span aria-hidden="true" className="relative block h-4 w-4">
                    <span className="absolute top-1/2 left-0 block h-px w-4 rotate-45 bg-current" />
                    <span className="absolute top-1/2 left-0 block h-px w-4 -rotate-45 bg-current" />
                  </span>
                </button>
              </div>

              <ul className="flex flex-col gap-1">
                {navigation.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.08 + i * 0.055,
                      ease: EASE_OUT_EXPO,
                    }}
                  >
                    <a
                      href={item.href}
                      onClick={go(item.href)}
                      className="block py-2 text-[clamp(2.25rem,11vw,3.5rem)] leading-[1.05] font-semibold tracking-[-0.035em]"
                    >
                      {item.label}
                    </a>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-col gap-5"
              >
                <SocialLinks layout="row" night />
                <AvailabilityBadge night />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
