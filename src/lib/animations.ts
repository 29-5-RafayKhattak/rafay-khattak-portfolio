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
