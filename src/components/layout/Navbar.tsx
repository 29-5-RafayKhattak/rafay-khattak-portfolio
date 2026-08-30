"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";

import type { SocialLink } from "@/data/portfolio";
import type { SiteSettings } from "@/lib/cms/content";
import {
  menuFoot,
  menuLabel,
  menuList,
  menuNumber,
  menuSurface,
  navLinkGroup,
  navLinkItem,
  navPart,
  navShell,
} from "@/lib/animations";
import { anchorOffset } from "@/lib/navigation";
import { AvailabilityBadge } from "@/components/ui/AvailabilityBadge";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { FINE_POINTER, useMediaQuery } from "@/hooks/useMediaQuery";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useNavTone } from "@/hooks/useNavTone";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSmoothScroll } from "@/components/layout/SmoothScroll";

/**
 * -----------------------------------------------------------------------------
 * NAVIGATION
 * -----------------------------------------------------------------------------
 * Three groups on one line — status, links, call to action — laid out on a
 * 1fr/auto/1fr grid so the link row is centred on the viewport rather than on
 * whatever is left after the other two. The two outer cells are free to be
 * different widths without the centre drifting.
 *
 * The bar is rendered as a sibling of the shell, not inside it, so the shell's
 * `overflow: clip` can never interfere with a fixed element.
 *
 * TWO STATES
 * At the top it is type on the hero: no ground, no border, generous padding.
 * Once the page has moved it becomes a floating surface — translucent, blurred,
 * hairlined, tighter. Everything between those states is a CSS transition on
 * the surface element, so the change is a dissolve rather than a class swap.
 *
 * ONE SCROLL PASS
 * Four things depend on scroll position: the compact state, the hide/reveal,
 * the progress line and which section is current. They share a single
 * rAF-throttled listener. The progress line is written straight to the DOM
 * rather than held in state — it changes every frame, and re-rendering the
 * whole bar sixty times a second to move a 1px rule would be the most
 * expensive thing on the page.
 *
 * WHY NOT IntersectionObserver
 * The page is a stack of pinned scenes: each is pulled up under the one before
 * it by a negative margin, so a section's box begins one full viewport before
 * its content is on screen, and two of the scenes between the nav destinations
 * (the horizontal run, the toolkit) are not destinations at all. An observer
 * reports nothing while those hold the frame, which strands the indicator on
 * whatever came last, and it has no way to apply the per-section curtain
 * correction the anchors already use. Walking the list once per frame and
 * taking the last section the reader has passed always gives an answer, and
 * costs six `offsetTop` reads inside a pass that is happening anyway.
 * -----------------------------------------------------------------------------
 */

type NavItem = SiteSettings["navigation"][number];

/** Vertical travel, in px, before the bar commits to hiding or revealing. */
const HIDE_DELTA = 6;
/** The bar stays put until the reader is this far down — the hero is sacred. */
const HIDE_ARM_VH = 1.25;

export function Navbar({
  navigation,
  person,
  socials,
  tagline,
}: {
  navigation: SiteSettings["navigation"];
  person: SiteSettings["person"];
  socials: SocialLink[];
  /** One line of context for the utility strip. CMS copy, never invented. */
  tagline: string;
}) {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolledSection, setScrolledSection] = useState("home");

  const { scrollTo, setLocked } = useSmoothScroll();
  const pathname = usePathname();
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const finePointer = useMediaQuery(FINE_POINTER);
  /*
   * From `lg` the bar is an opaque raised card, so the translucent blurred
   * surface underneath it has nothing to show — and a backdrop-filter behind
   * an opaque panel is a full-viewport blur composited on every scroll frame
   * for no visible result. False during SSR and the first client render, which
   * is correct: the small-screen form is the one that needs those styles.
   */
  const cardMode = useMediaQuery("(min-width: 1024px)");
  /** Magnetism is a pointer affordance; it has no meaning without a pointer. */
  const magnetic = finePointer && !reducedMotion;

  const onHome = pathname === "/";
  /*
   * Derived, not stored. Off the homepage there is no section to be "in", but
   * a case study is unambiguously part of Work, so the indicator rests there
   * rather than vanishing — which reads as the bar losing track of the reader.
   */
  const activeId = onHome
    ? scrolledSection
    : pathname.startsWith("/work/")
      ? "work"
      : "";

  const progressRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  /*
   * The bar floats over scenes that alternate between paper and charcoal, so
   * it inverts rather than sitting dark-on-dark. While the menu is open the
   * ground underneath is the menu's own cream, whatever the page behind says.
   */
  const tone = useNavTone();
  const night = tone === "night" && !open;

  const ink = night ? "var(--color-night-ink)" : "var(--color-ink)";
  const muted = night ? "var(--color-night-muted)" : "var(--color-muted)";
  const COLOR_FADE =
    "color 450ms ease, background-color 450ms ease, border-color 450ms ease";

  /* ---------------------------------------------------------------- scroll */
  const ids = useMemo(
    () => navigation.map((item) => item.href.slice(1)),
    [navigation],
  );

  useEffect(() => {
    let frame = 0;
    let lastY = window.scrollY;

    const measure = () => {
      frame = 0;
      const y = window.scrollY;
      const vh = window.innerHeight;

      // --- progress: written straight to the node, never through React ----
      const max = document.documentElement.scrollHeight - vh;
      const node = progressRef.current;
      if (node) {
        const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
        node.style.transform = `scaleX(${p})`;
      }

      setCompact((prev) => (prev === y > 40 ? prev : y > 40));

      // --- hide / reveal ---------------------------------------------------
      const delta = y - lastY;
      if (y <= vh * HIDE_ARM_VH) {
        // Through the hero the bar is simply always there.
        setHidden((prev) => (prev ? false : prev));
        lastY = y;
      } else if (Math.abs(delta) > HIDE_DELTA) {
        const next = delta > 0;
        setHidden((prev) => (prev === next ? prev : next));
        lastY = y;
      }

      // --- current section -------------------------------------------------
      if (onHome) {
        // A little above centre: a section reads as current once its opening
        // has settled into the upper half, not once its box touches the fold.
        const line = y + vh * 0.4;
        let current = ids[0];
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          // A pinned scene starts one curtain before its content appears; the
          // anchors correct for it, and so must this.
          const curtain = el.getAttribute("data-anchor-offset-vh");
          const offset = curtain ? (vh * parseFloat(curtain)) / 100 : 0;
          if (el.offsetTop + offset <= line) current = id;
        }
        setScrolledSection((prev) => (prev === current ? prev : current));
      }
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
  }, [ids, onHome]);

  /* ------------------------------------------------------- active indicator */
  /*
   * `null` until it has been measured, and the mark is not rendered at all
   * until then. The first paint would otherwise carry a dot at x=0 with the
   * measurement arriving a frame later, which Framer reads as a change worth
   * animating — so every page load began with the indicator sliding in from
   * the left edge of the row. Mounting it already measured means the first
   * value it ever holds is the right one, and only genuine section changes
   * animate after that.
   */
  const [dotX, setDotX] = useState<number | null>(null);

  const measureDot = useCallback(() => {
    const li = itemRefs.current.get(activeId);
    if (!li || !listRef.current) {
      setDotX(null);
      return;
    }
    setDotX(li.offsetLeft + li.offsetWidth / 2);
  }, [activeId]);

  useIsomorphicLayoutEffect(measureDot, [measureDot]);

  useEffect(() => {
    window.addEventListener("resize", measureDot);
    // Label widths move when the webfont swaps, which shifts every centre.
    document.fonts?.ready.then(measureDot).catch(() => {});
    return () => window.removeEventListener("resize", measureDot);
  }, [measureDot]);

  /* ------------------------------------------------------------------ menu */
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
      /*
       * The trigger first, not whatever happened to hold focus when the menu
       * opened. Those are usually the same element, but not always — a menu
       * opened from a keyboard shortcut, or by a click that never focused the
       * button, leaves `document.activeElement` as <body>, and focusing that
       * is a silent no-op that drops the reader back to the top of the tab
       * order. The trigger is where the menu came from, so it is where focus
       * belongs.
       */
      (trigger ?? previouslyFocused)?.focus?.();
    };
  }, [open, setLocked]);

  /*
   * The bar must never be hidden while its own menu is open — and under
   * reduced motion it never hides at all. Removing only the transition would
   * leave it teleporting off the top of the screen, which is a worse thing to
   * show someone who has asked for less movement than simply leaving it there.
   */
  const shown = !hidden || open || reducedMotion;

  /*
   * The href itself, not just the click handler. Off the homepage `#work` is a
   * fragment that does not exist in this document: the handler routes
   * correctly, but the attribute is what a middle-click, a right-click "open
   * in new tab", a copied link and a page with its JavaScript still loading
   * all use — and all four would land on nothing.
   */
  const hrefFor = useCallback(
    (href: string) => (onHome ? href : `/${href}`),
    [onHome],
  );

  const navigateTo = useCallback(
    (href: string) => {
      // Off the homepage the section does not exist in this document, so the
      // same link has to route to it rather than scroll to it.
      if (!onHome) {
        router.push(`/${href}`);
        return;
      }
      scrollTo(href, anchorOffset(href));
    },
    [onHome, router, scrollTo],
  );

  const go = useCallback(
    (href: string) => (event: ReactMouseEvent) => {
      event.preventDefault();

      if (!open) {
        navigateTo(href);
        return;
      }

      /*
       * Closing and scrolling in the same tick does not work: Lenis owns the
       * scroll position and is currently stopped, so a scrollTo issued before
       * it restarts is swallowed and the reader is left on the section they
       * started from. Release the lock here rather than waiting for the effect
       * cleanup, then move on the next frame.
       */
      setOpen(false);
      setLocked(false);
      requestAnimationFrame(() => navigateTo(href));
    },
    [open, navigateTo, setLocked],
  );

  return (
    <>
      <motion.header
        variants={navShell}
        initial="hidden"
        animate="show"
        className="fixed inset-x-0 top-0 z-[70]"
        style={{
          paddingTop: "var(--safe-top)",
          // The reveal is the only thing on the bar that moves the whole
          // element, so it is a transform and nothing else.
          transform: shown ? "translateY(0)" : "translateY(-110%)",
          transition: reducedMotion
            ? "none"
            : "transform 620ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/*
          UTILITY STRIP
          The quiet row above the card: status and one line of context on the
          left, the off-site links on the right, separated by hairlines rather
          than boxes. It exists only at the top of the page — once the reader
          has moved, it collapses and the card alone travels with them, which
          is what keeps a two-row header from costing two rows of height for
          the whole visit.
        */}
        <div
          className="hidden overflow-hidden lg:block"
          style={{
            height: compact ? 0 : "2.875rem",
            opacity: compact ? 0 : 1,
            borderTop: `1px solid ${
              night
                ? "rgba(244,242,238,0.12)"
                : "color-mix(in srgb, var(--color-accent-lift) 34%, transparent)"
            }`,
            transition:
              "height 520ms cubic-bezier(0.16,1,0.3,1), opacity 380ms ease, border-color 450ms ease",
          }}
        >
          <div className="mx-auto w-[calc(100vw-var(--shell-inset)*2)] max-w-[1700px]">
            <motion.div
              variants={navPart}
              className="gutter flex h-[2.875rem] items-center justify-between"
            >
              <div className="flex min-w-0 items-center gap-5">
                <AvailabilityBadge
                  availability={person.availability}
                  night={night}
                />
                <span
                  aria-hidden="true"
                  className="h-4 w-px shrink-0"
                  style={{
                    backgroundColor: night
                      ? "var(--color-night-line)"
                      : "var(--color-line-strong)",
                  }}
                />
                {/* Context, not decoration — the line the contact section
                    already opens with, said once at the top of the page. */}
                <p
                  className="truncate text-[0.875rem]"
                  style={{ color: muted, transition: COLOR_FADE }}
                >
                  {tagline}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-4">
                <span
                  aria-hidden="true"
                  className="h-4 w-px"
                  style={{
                    backgroundColor: night
                      ? "var(--color-night-line)"
                      : "var(--color-line-strong)",
                  }}
                />
                <SocialLinks socials={socials} layout="bare" night={night} />
                <span
                  aria-hidden="true"
                  className="h-4 w-px"
                  style={{
                    backgroundColor: night
                      ? "var(--color-night-line)"
                      : "var(--color-line-strong)",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mx-auto w-[calc(100vw-var(--shell-inset)*2)] max-w-[1700px]">
          <div
            /*
             * The surface. Below `lg` it stays what it was — nothing at the top
             * of the page, a translucent blurred bar once scrolled. From `lg`
             * the `.nav-card` class takes over and it becomes an opaque raised
             * panel at every scroll position, which is why the values below are
             * scoped to the small-screen form.
             */
            className="relative overflow-hidden rounded-[20px] lg:mt-2 lg:rounded-[24px] lg:border-0 lg:bg-none lg:shadow-none"
            style={
              cardMode
                ? { transition: "box-shadow 520ms ease" }
                : {
                    backgroundColor: compact
                      ? night
                        ? "rgba(17,17,17,0.72)"
                        : "rgba(248,247,244,0.82)"
                      : "rgba(248,247,244,0)",
                    boxShadow: compact
                      ? "0 1px 2px rgba(17,17,17,0.03), 0 18px 40px -32px rgba(17,17,17,0.28)"
                      : "0 0 0 rgba(17,17,17,0)",
                    backdropFilter: compact ? "blur(16px) saturate(1.4)" : "none",
                    WebkitBackdropFilter: compact
                      ? "blur(16px) saturate(1.4)"
                      : "none",
                    outline: compact
                      ? `1px solid ${night ? "rgba(244,242,238,0.10)" : "rgba(17,17,17,0.06)"}`
                      : "1px solid transparent",
                    outlineOffset: "-1px",
                    transition:
                      "background-color 520ms ease, box-shadow 520ms ease, outline-color 520ms ease, backdrop-filter 520ms ease",
                  }
            }
          >
            {/* The raised panel, from lg up. Separate element so the shared
                surface above can keep owning the small-screen states. */}
            <span
              aria-hidden="true"
              className="nav-card pointer-events-none absolute inset-0 hidden rounded-[24px] lg:block"
            />

            <nav
              aria-label="Primary"
              className="gutter relative grid grid-cols-[auto_1fr_auto] items-center gap-4 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:px-[clamp(1.25rem,2vw,2rem)]"
              style={{
                paddingBlock: compact
                  ? "var(--nav-pad-compact)"
                  : "var(--nav-pad)",
                transition: "padding 520ms cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              {/* LEFT — identity ---------------------------------------- */}
              <motion.div variants={navPart} className="flex min-w-0 items-center">
                {/*
                  The monogram and the name are one link, not two: they name
                  the same destination, and splitting them would put two
                  home links a centimetre apart.
                */}
                <a
                  href={onHome ? "#home" : "/"}
                  onClick={go("#home")}
                  className="tap group hidden min-w-0 items-center gap-[clamp(0.75rem,1.2vw,1.125rem)] lg:flex"
                >
                  {/*
                    The mark itself, not two letters set in a serif. `alt` is
                    empty on purpose: the link already carries its own name
                    from the wordmark beside it and the sr-only suffix below,
                    and a second reading of "RK" would announce the same
                    destination twice.
                  */}
                  <Image
                    src="/images/rk-monogram.png"
                    alt=""
                    width={192}
                    height={192}
                    priority
                    unoptimized
                    className="h-[clamp(2.25rem,3vw,2.875rem)] w-[clamp(2.25rem,3vw,2.875rem)] shrink-0"
                  />
                  {/*
                    The name and the role only appear from `xl`. Between `lg`
                    and `xl` the six links and the button already claim the
                    row: measured at 1024 the identity had 16px of slack and
                    was ellipsing its own name, which is worse than not
                    setting it. The monogram carries the identity there, and
                    the full lockup returns as soon as there is room for it.
                  */}
                  <span
                    aria-hidden="true"
                    className="hidden h-[2.5rem] w-px shrink-0 xl:block"
                    style={{ backgroundColor: "var(--color-line-strong)" }}
                  />
                  <span className="hidden min-w-0 xl:block">
                    <span className="block truncate text-[clamp(0.8125rem,1vw,0.9375rem)] font-semibold tracking-[0.17em] whitespace-nowrap text-[var(--color-ink)] uppercase">
                      {person.fullName}
                    </span>
                    <span className="mt-1 block truncate text-[clamp(0.6875rem,0.85vw,0.8125rem)] whitespace-nowrap text-[var(--color-muted)]">
                      {person.titleShort}
                    </span>
                  </span>
                  <span className="sr-only">— home</span>
                </a>

                {/* Below lg the identity is the monogram alone. */}
                <a
                  href={onHome ? "#home" : "/"}
                  onClick={go("#home")}
                  className="tap tap-square flex items-center lg:hidden"
                >
                  <Image
                    src="/images/rk-monogram.png"
                    alt=""
                    width={192}
                    height={192}
                    priority
                    unoptimized
                    className="h-[2.125rem] w-[2.125rem] shrink-0"
                  />
                  <span className="sr-only">{person.fullName} — home</span>
                </a>
              </motion.div>

              {/* CENTRE — the links ------------------------------------- */}
              <motion.ul
                ref={listRef}
                variants={navLinkGroup}
                className="relative col-start-2 hidden items-center justify-center gap-x-[clamp(0.25rem,0.9vw,1rem)] lg:flex"
              >
                {navigation.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    href={hrefFor(item.href)}
                    active={activeId === item.href.slice(1)}
                    ink={ink}
                    muted={muted}
                    magnetic={magnetic}
                    onSelect={go(item.href)}
                    register={(el) => {
                      const id = item.href.slice(1);
                      if (el) itemRefs.current.set(id, el);
                      else itemRefs.current.delete(id);
                    }}
                  />
                ))}

                {/*
                  The active mark. One element that travels, rather than a dot
                  per item being shown and hidden — the movement between two
                  sections is the whole point of it, and cross-fading two dots
                  reads as a glitch at this size.
                */}
                {dotX !== null && (
                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-2 left-0 block h-[5px] w-[5px] rounded-full"
                    initial={false}
                    animate={{ x: dotX - 2.5 }}
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 36,
                      mass: 0.8,
                    }}
                    style={{ backgroundColor: "var(--color-accent-lift)" }}
                  />
                )}
              </motion.ul>

              {/* RIGHT — call to action, or the menu trigger ------------ */}
              <motion.div
                variants={navPart}
                className="col-start-3 flex items-center justify-end"
              >
                {/*
                  The glow is a sibling of the button, not a child of it. As a
                  child it painted *above* the button's own black ground —
                  a negative z-index only escapes an ancestor that is not
                  itself a stacking context, and the button has to be one for
                  the sweep to clip. Out here it lands on the card behind, which
                  is where a bloom belongs.
                */}
                <span className="relative hidden lg:inline-flex">
                  <span aria-hidden="true" className="cta-glow" />
                  <CallToAction
                    href={hrefFor("#contact")}
                    night={night}
                    magnetic={magnetic}
                    onSelect={go("#contact")}
                  />
                </span>

                <MenuTrigger
                  ref={triggerRef}
                  open={open}
                  ink={ink}
                  onClick={() => setOpen((v) => !v)}
                />
              </motion.div>
            </nav>

            {/*
              READING POSITION
              A single hairline along the foot of the surface. Not a progress
              bar — there is no track, no container and no colour until it has
              something to report, so at the top of the page it is literally
              invisible. Driven by transform from the scroll pass above.
            */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
            >
              <span
                ref={progressRef}
                className="block h-full w-full origin-left"
                style={{
                  backgroundColor: "var(--color-accent-lift)",
                  transform: "scaleX(0)",
                  opacity: compact ? 0.9 : 0.55,
                  transition: "opacity 520ms ease",
                }}
              />
            </span>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <MobileMenu
            ref={menuRef}
            navigation={navigation}
            person={person}
            hrefFor={hrefFor}
            onSelect={go}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ========================================================================== */
/* ONE LINK                                                                    */
/* ========================================================================== */

/**
 * Two things happen here that the parent must not own: the label swap, which
 * is CSS on hover, and the magnetic offset, which is a spring per link. Both
 * are per-element state, so each link keeps its own rather than the bar
 * holding six of everything.
 */
function NavLink({
  item,
  href,
  active,
  ink,
  muted,
  magnetic,
  onSelect,
  register,
}: {
  item: NavItem;
  href: string;
  active: boolean;
  ink: string;
  muted: string;
  magnetic: boolean;
  onSelect: (event: ReactMouseEvent) => void;
  register: (el: HTMLLIElement | null) => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 24, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 300, damping: 24, mass: 0.35 });

  /*
   * Deliberately tiny — 3px across and 2px down at the extremes. Enough that
   * the row feels alive under the pointer, not enough for anyone to be able to
   * say what moved. Listeners are attached to the link, so nothing runs
   * except while a pointer is actually over one of six small boxes.
   */
  const onMove = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!magnetic) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-3, Math.min(3, relX * 0.22)));
    y.set(Math.max(-2, Math.min(2, relY * 0.22)));
  };

  const release = () => {
    x.set(0);
    y.set(0);
  };

  return (
    /*
     * A motion element, not a plain <li>: variants only propagate to Framer
     * components, so the row's stagger stops dead at the first ordinary node.
     * The entrance lives out here and the magnetic springs live on the anchor
     * inside, which keeps the two off the same element — Framer would
     * otherwise read the spring's transform as the entrance's start value.
     */
    <motion.li ref={register} variants={navLinkItem} className="shrink-0">
      <motion.a
        href={href}
        onClick={onSelect}
        onMouseMove={magnetic ? onMove : undefined}
        onMouseLeave={magnetic ? release : undefined}
        aria-current={active ? "true" : undefined}
        className={[
          "nav-link tap block rounded-full text-[0.9375rem] tracking-[0.005em]",
          "px-[clamp(0.625rem,1vw,1.05rem)] py-[0.65rem]",
          active ? "nav-chip font-medium" : "font-normal",
        ].join(" ")}
        style={{
          x: springX,
          y: springY,
          color: active ? ink : muted,
          // The chip is a background, so it can arrive without shifting the
          // label by a pixel.
          transition: "color 450ms ease, background-color 450ms ease",
        }}
      >
        <span className="nav-swap">
          <span className="nav-swap-in">{item.label}</span>
          {/* The arriving copy is decoration; the row must read once. */}
          <span aria-hidden="true" className="nav-swap-out">
            {item.label}
          </span>
        </span>
      </motion.a>
    </motion.li>
  );
}

/* ========================================================================== */
/* CALL TO ACTION                                                              */
/* ========================================================================== */

function CallToAction({
  href,
  night,
  magnetic,
  onSelect,
}: {
  href: string;
  night: boolean;
  magnetic: boolean;
  onSelect: (event: ReactMouseEvent) => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 22, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 22, mass: 0.4 });

  const onMove = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (!magnetic) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(
      Math.max(-3, Math.min(3, (event.clientX - (rect.left + rect.width / 2)) * 0.14)),
    );
    y.set(
      Math.max(-2, Math.min(2, (event.clientY - (rect.top + rect.height / 2)) * 0.18)),
    );
  };

  const release = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      onClick={onSelect}
      onMouseMove={magnetic ? onMove : undefined}
      onMouseLeave={magnetic ? release : undefined}
      className="nav-cta group relative hidden h-[3.125rem] items-center gap-3 overflow-hidden rounded-full pr-1.5 pl-6 lg:inline-flex"
      style={{
        x: springX,
        y: springY,
        backgroundColor: night ? "var(--color-night-ink)" : "var(--color-ink)",
        color: night ? "var(--color-night)" : "var(--color-canvas)",
        transition: "background-color 450ms ease, color 450ms ease",
      }}
    >
      {/* The warm ground, wiped across from the left. */}
      <span aria-hidden="true" className="cta-sweep" />

      <span className="relative z-10 text-[0.8125rem] font-medium tracking-[0.005em] whitespace-nowrap transition-colors duration-300 group-hover:text-white">
        Let&rsquo;s Talk
      </span>

      {/*
        The arrow gets its own ground rather than floating beside the words —
        a small disc reads as a control, a bare glyph reads as punctuation.
      */}
      <span
        aria-hidden="true"
        className="relative z-10 flex h-[2.375rem] w-[2.375rem] shrink-0 items-center justify-center rounded-full transition-colors duration-300"
        style={{
          backgroundColor: night ? "rgba(17,17,17,0.10)" : "rgba(255,255,255,0.12)",
        }}
      >
        <ArrowUpRight
          className="h-[1.05rem] w-[1.05rem] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-hover:text-white"
          strokeWidth={1.9}
        />
      </span>
    </motion.a>
  );
}

/* ========================================================================== */
/* MENU TRIGGER                                                                */
/* ========================================================================== */

/**
 * A word and a mark, not a hamburger. The plus rotates 45° into a cross, which
 * is the same two strokes reading as open and closed — nothing is added or
 * removed, so there is no icon swap to mistime.
 */
function MenuTrigger({
  ref,
  open,
  ink,
  onClick,
}: {
  ref: React.Ref<HTMLButtonElement>;
  open: boolean;
  ink: string;
  onClick: () => void;
}) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="site-menu"
      className="tap -mr-1 flex items-center gap-2.5 py-2 pr-1 pl-2 lg:hidden"
      style={{ color: ink, transition: "color 450ms ease" }}
    >
      <span className="font-mono text-[0.6875rem] font-medium tracking-[0.16em] uppercase">
        {open ? "Close" : "Menu"}
      </span>
      <span
        aria-hidden="true"
        className="relative block h-3.5 w-3.5 transition-transform duration-[450ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
      >
        <span className="absolute top-1/2 left-0 block h-px w-full -translate-y-1/2 bg-current" />
        <span className="absolute top-0 left-1/2 block h-full w-px -translate-x-1/2 bg-current" />
      </span>
    </button>
  );
}

/* ========================================================================== */
/* MOBILE MENU                                                                 */
/* ========================================================================== */

/**
 * Cream rather than charcoal. The page opens onto its own paper instead of
 * dropping a dark panel over itself, which keeps the menu inside the
 * portfolio's world — and a near-black overlay under a bar that also inverts
 * to near-black would have left the trigger fighting its own background.
 *
 * Numbers are small and warm; labels are large and near-black. That ordering
 * is the whole layout: the index is data, the label is the destination.
 */
function MobileMenu({
  ref,
  navigation,
  person,
  hrefFor,
  onSelect,
}: {
  ref: React.Ref<HTMLDivElement>;
  navigation: SiteSettings["navigation"];
  person: SiteSettings["person"];
  hrefFor: (href: string) => string;
  onSelect: (href: string) => (event: ReactMouseEvent) => void;
}) {
  return (
    <motion.div
      id="site-menu"
      ref={ref}
      variants={menuSurface}
      initial="hidden"
      animate="show"
      exit="exit"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      className="fixed inset-0 z-[60] bg-[var(--color-surface)] text-[var(--color-ink)]"
      style={{
        paddingTop: "calc(var(--safe-top) + 5.5rem)",
        paddingBottom: "calc(var(--safe-bottom) + 1.75rem)",
      }}
    >
      <div className="gutter flex h-full flex-col justify-between gap-10 overflow-y-auto">
        <motion.ul variants={menuList} className="flex flex-col">
          {navigation.map((item, i) => (
            <li
              key={item.href}
              className="border-t border-[var(--color-line)] last:border-b"
            >
              <a
                href={hrefFor(item.href)}
                onClick={onSelect(item.href)}
                className="tap flex items-baseline gap-5 py-[clamp(0.75rem,2.2vh,1.15rem)]"
              >
                <motion.span
                  variants={menuNumber}
                  className="eyebrow w-6 shrink-0 text-[var(--color-accent-lift)]"
                >
                  {String(i + 1).padStart(2, "0")}
                </motion.span>
                {/* The label lifts out of a mask — the one real gesture here. */}
                <span className="block overflow-hidden">
                  <motion.span
                    variants={menuLabel}
                    className="block text-[clamp(1.875rem,9vw,2.75rem)] leading-[1.12] font-semibold tracking-[-0.035em]"
                  >
                    {item.label}
                  </motion.span>
                </span>
              </a>
            </li>
          ))}
        </motion.ul>

        <motion.div variants={menuFoot} className="flex flex-col gap-6">
          <AvailabilityBadge availability={person.availability} size="md" />

          <a
            href={hrefFor("#contact")}
            onClick={onSelect("#contact")}
            className="group inline-flex h-[3.25rem] w-full items-center justify-between gap-3 rounded-full bg-[var(--color-ink)] pr-1.5 pl-6 text-[var(--color-canvas)]"
          >
            <span className="text-[0.9375rem] font-medium tracking-[0.005em]">
              Let&rsquo;s Talk
            </span>
            <span
              aria-hidden="true"
              className="flex h-[2.5rem] w-[2.5rem] shrink-0 items-center justify-center rounded-full bg-white/12"
            >
              <ArrowUpRight className="h-[1.1rem] w-[1.1rem]" strokeWidth={1.9} />
            </span>
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}
