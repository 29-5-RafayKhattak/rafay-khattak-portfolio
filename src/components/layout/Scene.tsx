"use client";

import type { CSSProperties, ReactNode } from "react";

import { CURTAIN, sceneHeight } from "@/lib/scene";

type SceneProps = {
  id?: string;
  ariaLabel?: string;
  /** Scroll budget for this scene's choreography, in viewport heights. */
  content: number;
  /** Stack order — see LAYER in lib/scene.ts. */
  layer: number;
  /** False for the first scene, which has nothing above it to slide away. */
  curtain?: boolean;
  /** Rounded top edge, for a light scene emerging from a dark one. */
  roundedTop?: boolean;
  /** Applied to the <section>: background and colour scope. */
  className?: string;
  /** Applied to the pinned stage inside it. */
  stageClassName?: string;
  /** Lets the navigation bar know whether to invert over this scene. */
  tone?: "day" | "night";
  /** Renders as ordinary static content — no pinning, no negative margin. */
  reducedMotion: boolean;
  /** Static layout used when reduced motion is on. */
  fallback?: ReactNode;
  children: ReactNode;
  sectionRef?: React.Ref<HTMLElement>;
};

/**
 * The structural half of a pinned scene: height, overlap, stack order and the
 * sticky stage. The animation half lives in each section component.
 *
 * Pinning is CSS `position: sticky`, not ScrollTrigger's `pin: true`. Sticky
 * needs no pin-spacer, survives a mid-page refresh with no re-measurement, and
 * cannot leave the page in a broken state if a ScrollTrigger fails to
 * initialise — the layout is correct even with JavaScript disabled. GSAP is
 * then used purely to read scroll progress and write transforms.
 */
export function Scene({
  id,
  ariaLabel,
  content,
  layer,
  curtain = true,
  roundedTop = false,
  className = "",
  stageClassName = "",
  tone = "day",
  reducedMotion,
  fallback,
  children,
  sectionRef,
}: SceneProps) {
  const style: CSSProperties = reducedMotion
    ? {}
    : {
        height: sceneHeight(content, curtain),
        marginTop: curtain ? `-${CURTAIN}vh` : undefined,
        zIndex: layer,
      };

  if (roundedTop) {
    style.borderTopLeftRadius = "clamp(1.25rem, 2.6vw, 2.25rem)";
    style.borderTopRightRadius = "clamp(1.25rem, 2.6vw, 2.25rem)";
  }

  return (
    <section
      id={id}
      ref={sectionRef}
      aria-label={ariaLabel}
      className={`relative ${className}`}
      style={style}
      data-tone={tone}
      // Anchors need to skip the reveal to land on the content. See
      // lib/navigation.ts.
      data-anchor-offset-vh={
        !reducedMotion && curtain && id ? CURTAIN : undefined
      }
    >
      {reducedMotion ? (
        <div className="gutter py-[clamp(4rem,10vh,7rem)]">
          {fallback ?? children}
        </div>
      ) : (
        <div
          className={`sticky top-0 h-[100svh] overflow-hidden ${stageClassName}`}
        >
          {children}
        </div>
      )}
    </section>
  );
}
