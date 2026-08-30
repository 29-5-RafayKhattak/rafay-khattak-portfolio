import type { Variants, Transition } from "framer-motion";

/**
 * -----------------------------------------------------------------------------
 * FRAMER MOTION — ENTRANCE ANIMATION ONLY
 * -----------------------------------------------------------------------------
 * Everything in this file fires ONCE, on mount or on first viewport entry.
 * Anything driven by scroll position lives in GSAP ScrollTrigger instead, so
 * the two systems never animate the same property on the same element.
 * -----------------------------------------------------------------------------
 */

/** Expo-out. Deliberate, no overshoot — the brief explicitly rules out bounce. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;

export const transition = (
  duration = 0.9,
  delay = 0,
): Transition => ({
  duration,
  delay,
  ease: EASE_OUT_EXPO,
});

/* -------------------------------------------------------------------------- */
/* Hero load sequence                                                          */
/* Total run ≈ 1.45s. Ordering matches the brief: nav → role → RAFAY →         */
/* KHATTAK → portrait → description → CTA → socials.                          */
/* -------------------------------------------------------------------------- */

export const HERO_TIMELINE = {
  nav: 0.05,
  role: 0.2,
  nameFirst: 0.3,
  nameLast: 0.42,
  portrait: 0.34,
  description: 0.66,
  cta: 0.78,
  socials: 0.86,
  scrollHint: 1.0,
} as const;

export const heroNav: Variants = {
  hidden: { opacity: 0, y: -15 },
  show: { opacity: 1, y: 0, transition: transition(0.8, HERO_TIMELINE.nav) },
};

/* -------------------------------------------------------------------------- */
/* Navigation load sequence                                                    */
/*                                                                             */
/* Reads left to right, the way the bar is composed: the status line, then the */
/* links, then the call to action. Deliberately short — the whole run is done  */
/* inside 800ms, because navigation that animates in is navigation you cannot  */
/* click yet. Each part travels 8px on Y and nothing scales.                   */
/* -------------------------------------------------------------------------- */

const NAV_EASE = EASE_OUT_EXPO;

/** Parent of the three groups; children fire on the stagger below. */
export const navShell: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.06, staggerChildren: 0.08 } },
};

export const navPart: Variants = {
  hidden: { opacity: 0, y: -8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: NAV_EASE },
  },
};

/** The link row staggers its own items inside the second beat. */
export const navLinkGroup: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.14, staggerChildren: 0.045 } },
};

export const navLinkItem: Variants = {
  hidden: { opacity: 0, y: -8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: NAV_EASE } },
};

/* -------------------------------------------------------------------------- */
/* Mobile menu                                                                 */
/*                                                                             */
/* Four beats inside ~620ms: the ground arrives, then the numbers, then the    */
/* labels lift out of their masks, then the footer. The labels are the moment, */
/* so they get the longest travel and everything else is support.              */
/* -------------------------------------------------------------------------- */

export const menuSurface: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.34, ease: NAV_EASE, when: "beforeChildren" },
  },
  exit: { opacity: 0, transition: { duration: 0.26, ease: EASE_OUT_QUART } },
};

export const menuList: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.08, staggerChildren: 0.055 } },
  exit: { transition: { staggerChildren: 0.025, staggerDirection: -1 } },
};

/** The label rides up out of an overflow-hidden row. */
export const menuLabel: Variants = {
  hidden: { y: "105%" },
  show: { y: "0%", transition: { duration: 0.62, ease: NAV_EASE } },
  exit: { y: "105%", transition: { duration: 0.24, ease: EASE_OUT_QUART } },
};

export const menuNumber: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: NAV_EASE } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const menuFoot: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: NAV_EASE, delay: 0.34 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const heroRole: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transition(1, HERO_TIMELINE.role) },
};

export const heroNameFirst: Variants = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: transition(1.15, HERO_TIMELINE.nameFirst),
  },
};

export const heroNameLast: Variants = {
  hidden: { opacity: 0, y: 80 },
  show: {
    opacity: 1,
    y: 0,
    transition: transition(1.15, HERO_TIMELINE.nameLast),
  },
};

export const heroPortrait: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: transition(1.3, HERO_TIMELINE.portrait),
  },
};

export const heroDescription: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: transition(0.9, HERO_TIMELINE.description),
  },
};

export const heroCta: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: transition(0.85, HERO_TIMELINE.cta) },
};

export const heroSocialGroup: Variants = {
  hidden: {},
  show: {
    transition: {
      delayChildren: HERO_TIMELINE.socials,
      staggerChildren: 0.07,
    },
  },
};

export const heroSocialItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: transition(0.6) },
};

export const heroScrollHint: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: transition(0.8, HERO_TIMELINE.scrollHint),
  },
};

/* -------------------------------------------------------------------------- */
/* Generic in-view entrances                                                   */
/* -------------------------------------------------------------------------- */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: transition(0.85) },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: transition(0.9) },
};

export const staggerGroup = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/** Shared viewport config so reveals trigger consistently across sections. */
export const IN_VIEW = { once: true, amount: 0.3 } as const;
export const IN_VIEW_SOFT = { once: true, amount: 0.15 } as const;
