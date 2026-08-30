"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";

import type { SocialLink } from "@/data/portfolio";
import type { SiteSettings } from "@/lib/cms/content";
import {
  heroCta,
  heroDescription,
  heroNameFirst,
  heroNameLast,
  heroPortrait,
  heroRole,
  heroScrollHint,
} from "@/lib/animations";
import { anchorOffset } from "@/lib/navigation";
import { LAYER, SCENE, sceneHeight, sceneTrigger } from "@/lib/scene";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSmoothScroll } from "@/components/layout/SmoothScroll";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";

/**
 * -----------------------------------------------------------------------------
 * HERO — and the cinematic hand-off into ABOUT
 * -----------------------------------------------------------------------------
 * A single sticky stage carries the whole opening, so the hero and its exit are
 * one continuous scene rather than two stacked ones.
 *
 * Layer order, back to front:
 *   canvas → night wash → RAFAY → portrait → KHATTAK → hero UI → chapter card
 * which is what lets the name read as if it sits behind the shoulders.
 *
 * ANIMATION OWNERSHIP
 *   Framer Motion  — the load sequence. Fires once, animates opacity + y on
 *                    the OUTER wrapper of each element.
 *   GSAP + scrub   — the scroll transformation. Animates x / y / scale /
 *                    opacity on the INNER element.
 *
 * These must stay on SEPARATE DOM nodes. Where they share one, GSAP records
 * Framer's `initial` as its own start value and pins the element there — the
 * element then never appears, and a matchMedia rebuild on resize makes it
 * reappear at the wrong opacity. Every `hero-*` class below is therefore on a
 * plain element, never on a `motion.*` one.
 * -----------------------------------------------------------------------------
 */
export function Hero({
  person,
  portrait,
  aboutLabel,
  socials,
}: {
  person: SiteSettings["person"];
  portrait: SiteSettings["portrait"];
  aboutLabel: string;
  socials: SocialLink[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollTo } = useSmoothScroll();

  useIsomorphicLayoutEffect(() => {
    if (reducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ---------------------------------------------------------------
      // Desktop / tablet — the full storyboard.
      // ---------------------------------------------------------------
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: sceneTrigger(sectionRef.current!, {
            scrub: 0.6,
            curtain: false,
          }),
        });

        // 0.00 – 0.18 · rest. The hero simply is.
        // 0.18 – 0.52 · the name pulls apart, the portrait grows into frame.
        tl.to(".hero-rafay", { xPercent: -9, ease: "none" }, 0.18)
          .to(".hero-khattak", { xPercent: 9, ease: "none" }, 0.18)
          .to(".hero-portrait-inner", { scale: 1.08, ease: "none" }, 0.18)

          // 0.42 – 0.66 · supporting UI steps back.
          .to(
            [".hero-supporting", ".hero-role", ".hero-scroll-hint"],
            { opacity: 0, y: -18, ease: "none" },
            0.42,
          )
          .to(".hero-social-rail", { opacity: 0, x: 28, ease: "none" }, 0.44)

          // 0.50 – 0.78 · the room darkens; the name inverts to stay readable.
          .to(".hero-night", { opacity: 1, ease: "none" }, 0.5)
          .to(".hero-night-copy", { opacity: 1, ease: "none" }, 0.52)
          .to(".hero-day-copy", { opacity: 0, ease: "none" }, 0.52)

          // 0.55 – 0.84 · the portrait lifts and drifts out of the top.
          .to(
            ".hero-portrait-inner",
            { yPercent: -18, scale: 1.16, ease: "none" },
            0.55,
          )
          .to([".hero-portrait-inner", ".hero-halo"], { opacity: 0, ease: "none" }, 0.72)

          // 0.70 – 0.90 · the name dissolves.
          .to(
            [".hero-rafay", ".hero-khattak"],
            { opacity: 0, yPercent: -14, ease: "none" },
            0.7,
          )

          // 0.86 – 1.00 · the chapter card lands on an empty dark stage.
          .fromTo(
            ".hero-chapter",
            { opacity: 0, y: 26 },
            { opacity: 1, y: 0, ease: "none" },
            0.86,
          );
      });

      // ---------------------------------------------------------------
      // Mobile — the same story, told with less movement. No horizontal
      // travel (it fights the narrow viewport), no scale on the portrait.
      // ---------------------------------------------------------------
      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: sceneTrigger(sectionRef.current!, {
            scrub: 0.6,
            curtain: false,
          }),
        });

        tl.to(
          [".hero-supporting", ".hero-role", ".hero-scroll-hint"],
          { opacity: 0, ease: "none" },
          0.3,
        )
          .to(".hero-night", { opacity: 1, ease: "none" }, 0.42)
          .to(".hero-night-copy", { opacity: 1, ease: "none" }, 0.44)
          .to(".hero-day-copy", { opacity: 0, ease: "none" }, 0.44)
          .to(
            [".hero-portrait-inner", ".hero-halo"],
            { yPercent: -10, opacity: 0, ease: "none" },
            0.5,
          )
          .to([".hero-rafay", ".hero-khattak"], { opacity: 0, ease: "none" }, 0.62)
          .fromTo(
            ".hero-chapter",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, ease: "none" },
            0.8,
          );
      });

      return () => mm.revert();
    }, sectionRef);

    // Heights depend on the portrait finishing layout; re-measure once.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative"
      style={{
        height: reducedMotion ? "auto" : sceneHeight(SCENE.hero, false),
        zIndex: reducedMotion ? undefined : LAYER.hero,
      }}
      aria-label="Introduction"
    >
      {/*
        The wash spans the whole section rather than just the stage. The stage
        is one shell-inset shorter than the viewport, so a stage-only wash
        would leave a pale strip along the bottom edge once it is pinned.
      */}
      <div
        className="hero-night pointer-events-none absolute inset-0 z-0 bg-[var(--color-night)] opacity-0"
        aria-hidden="true"
      />

      {/*
        The hero darkens partway through its own scroll rather than at a
        section boundary, so it declares two tone zones instead of one. The
        split sits where the wash passes half opacity. See useNavTone.
      */}
      {!reducedMotion && (
        <>
          <span
            aria-hidden="true"
            data-tone="day"
            className="pointer-events-none absolute inset-x-0 top-0 h-[78vh]"
          />
          <span
            aria-hidden="true"
            data-tone="night"
            className="pointer-events-none absolute inset-x-0 top-[78vh] bottom-0"
          />
        </>
      )}

      {/*
        Reduced motion drops the pinning but keeps the stage at full height —
        the hero composition depends on it, and collapsing to `auto` would
        crush the name into the portrait.
      */}
      <div
        className={[
          "top-0 z-10 flex flex-col overflow-hidden",
          reducedMotion ? "relative" : "sticky",
        ].join(" ")}
        style={{ height: "var(--stage-height)" }}
      >

        {/* ---------------------------------------------------------------
            TOP — role line, clear of the fixed navigation.
        --------------------------------------------------------------- */}
        <div className="gutter relative z-40 flex shrink-0 items-baseline justify-between pt-[clamp(5rem,10vh,6.75rem)]">
          <motion.div variants={heroRole} initial="hidden" animate="show">
            <p className="hero-role eyebrow text-[var(--color-muted)]">
              {person.title}
            </p>
          </motion.div>
          <motion.div
            variants={heroRole}
            initial="hidden"
            animate="show"
            className="hidden sm:block"
          >
            <p className="hero-role eyebrow text-[var(--color-muted)]">
              Portfolio — 2026
            </p>
          </motion.div>
        </div>

        {/* ---------------------------------------------------------------
            CENTRE — the layered name / portrait composite.
        --------------------------------------------------------------- */}
        <div className="relative z-10 flex min-h-0 flex-1 items-center justify-center">
          <div
            className="relative w-full"
            style={{ transform: "translateY(var(--composite-shift))" }}
          >
            {/*
              A warm halo lifted from the portrait's own palette. It seats the
              cutout in the canvas instead of letting it float on flat paper,
              and is the only place the accent appears in the hero.
            */}
            <div
              aria-hidden="true"
              className="hero-halo pointer-events-none absolute left-1/2 z-0 -translate-x-1/2"
              style={{
                bottom: "var(--portrait-drop)",
                height: "calc(var(--portrait-height) * 1.25)",
                width: "calc(var(--portrait-height) * 1.5)",
                background:
                  "radial-gradient(50% 50% at 50% 55%, rgba(154,104,64,0.13) 0%, rgba(154,104,64,0.05) 45%, rgba(154,104,64,0) 72%)",
              }}
            />
            {/* RAFAY — behind the portrait ---------------------------- */}
            <motion.div
              variants={heroNameFirst}
              initial="hidden"
              animate="show"
              className="relative z-10"
            >
              <div className="hero-rafay relative text-center">
                <span className="hero-day-copy name-line name-outline block">
                  {person.firstName}
                </span>
                <span
                  aria-hidden="true"
                  className="hero-night-copy name-line name-outline-night absolute inset-x-0 top-0 block opacity-0"
                >
                  {person.firstName}
                </span>
              </div>
            </motion.div>

            {/* PORTRAIT — between the two words ----------------------- */}
            <motion.div
              variants={heroPortrait}
              initial="hidden"
              animate="show"
              className="pointer-events-none absolute left-1/2 z-20 -translate-x-1/2"
              style={{
                bottom: "var(--portrait-drop)",
                height: "var(--portrait-height)",
                width: "calc(var(--portrait-height) * 0.949)",
              }}
            >
              <div className="hero-portrait-inner relative h-full w-full gpu">
                <Image
                  src={portrait.cutout}
                  alt={portrait.alt}
                  width={portrait.cutoutWidth}
                  height={portrait.cutoutHeight}
                  priority
                  sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 620px"
                  className="h-full w-full object-contain object-bottom"
                  style={{
                    /*
                     * A whisper of a fade at the very bottom so the cutout
                     * settles into the page instead of ending on a hard cut.
                     * The face and hair are untouched.
                     */
                    maskImage:
                      "linear-gradient(to bottom, #000 0%, #000 74%, rgba(0,0,0,0.72) 89%, rgba(0,0,0,0) 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, #000 0%, #000 74%, rgba(0,0,0,0.72) 89%, rgba(0,0,0,0) 100%)",
                  }}
                />
              </div>
            </motion.div>

            {/* KHATTAK — in front of the portrait --------------------- */}
            <motion.div
              variants={heroNameLast}
              initial="hidden"
              animate="show"
              className="relative z-30"
              style={{ marginTop: "var(--name-gap)" }}
            >
              <div className="hero-khattak relative text-center">
                <span className="hero-day-copy name-line name-solid block">
                  {person.lastName}
                </span>
                <span
                  aria-hidden="true"
                  className="hero-night-copy name-line name-solid-night absolute inset-x-0 top-0 block opacity-0"
                >
                  {person.lastName}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ---------------------------------------------------------------
            SOCIAL RAIL — vertical, right edge. Desktop only; on smaller
            screens it would collide with the name, so it moves into the
            footer of the hero instead.
        --------------------------------------------------------------- */}
        <div className="hero-social-rail absolute top-1/2 right-[clamp(1rem,2.2vw,2.25rem)] z-40 hidden -translate-y-1/2 lg:block">
          <SocialLinks socials={socials} layout="stack" animated />
        </div>

        {/* ---------------------------------------------------------------
            BOTTOM — introduction, CTAs, scroll indicator.
        --------------------------------------------------------------- */}
        <div className="gutter relative z-40 shrink-0 pb-[clamp(1.25rem,3.5vh,2.5rem)]">
          <div className="hero-supporting flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-10">
            <div className="max-w-[30rem]">
              <motion.p
                variants={heroDescription}
                initial="hidden"
                animate="show"
                className="text-[length:var(--step-lead)] leading-[1.4] tracking-[-0.015em] text-balance text-[var(--color-ink)]"
              >
                {person.intro}
              </motion.p>

              <motion.div
                variants={heroCta}
                initial="hidden"
                animate="show"
                className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-3"
              >
                <Button href="#contact" arrow>
                  Let&rsquo;s Collaborate
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => scrollTo("#work", anchorOffset("#work"))}
                  icon={<ArrowDown className="h-4 w-4" strokeWidth={1.6} />}
                >
                  View My Work
                </Button>
              </motion.div>
            </div>

            {/* Socials, inline, below lg. */}
            <motion.div
              variants={heroCta}
              initial="hidden"
              animate="show"
              className="lg:hidden"
            >
              <SocialLinks socials={socials} layout="row" />
            </motion.div>

            {/* Scroll indicator -------------------------------------- */}
            <motion.div
              variants={heroScrollHint}
              initial="hidden"
              animate="show"
              className="hidden shrink-0 md:block"
            >
              <div className="hero-scroll-hint flex flex-col items-center gap-3">
                <span className="scroll-rail" aria-hidden="true" />
                <span className="eyebrow text-[var(--color-muted)]">Scroll</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ---------------------------------------------------------------
            CHAPTER CARD — the beat between the hero and the dark room.
        --------------------------------------------------------------- */}
        <div
          className="hero-chapter pointer-events-none absolute inset-0 z-30 flex items-center justify-center opacity-0"
          aria-hidden="true"
        >
          <div className="flex items-center gap-4">
            <span className="eyebrow text-[var(--color-accent)]">01</span>
            <span className="h-px w-14 bg-[var(--color-night-line)]" />
            <span className="eyebrow text-[var(--color-night-muted)]">
              {aboutLabel}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
