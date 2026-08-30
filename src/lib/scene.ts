/**
 * -----------------------------------------------------------------------------
 * SCROLL PACING
 * -----------------------------------------------------------------------------
 * Every pinned scene's scroll budget lives here, in viewport heights. This is
 * the one file to edit to re-pace the whole site.
 *
 * HOW A SCENE IS BUILT
 *
 *   height     = CURTAIN + content + 100vh
 *   marginTop  = −CURTAIN
 *
 * The negative margin pulls each scene up underneath the one before it. While
 * the previous scene is still pinned it covers this one (descending z-index),
 * and when it unpins it slides away like a curtain to reveal this scene —
 * already pinned and waiting behind it.
 *
 * That first CURTAIN slice of the range is spent on the reveal, so the scene's
 * own choreography starts at `top+=CURTAINvh top` rather than at `top top`.
 *
 * Costing nothing: a plain stacked section would spend the same 100vh scrolling
 * itself into view. The curtain spends it on something worth watching instead,
 * which is what keeps the page free of stretches where scrolling does nothing.
 * -----------------------------------------------------------------------------
 */

/** Viewport heights spent on one scene sliding away to reveal the next. */
export const CURTAIN = 100;

/**
 * Scroll spent on each project in the Work sequence.
 *
 * Derived rather than written down: a fixed total chosen for a five-project
 * sequence means every project added or removed silently re-paces the whole
 * run — four projects sharing a five-project budget scroll noticeably slower
 * than intended.
 *
 * Exported because the count now comes from the database at request time, so
 * the budget is multiplied out by the component that actually knows how many
 * projects it received rather than by this module at import time.
 */
export const PER_PROJECT = 38;

/** Scroll budget for a Work sequence of `count` projects. */
export const projectsSceneHeight = (count: number) => PER_PROJECT * count;

/** Scroll budget (in vh) each scene's own choreography gets. */
export const SCENE = {
  /** Hero → dark. The full storyboard. */
  hero: 120,
  /** Four statement lines. */
  about: 90,
  /** Five metrics, ~24vh each. */
  stats: 120,
  /* The Work sequence is not here: its length depends on how many projects the
     database returns, so it is computed per render by projectsSceneHeight(). */
  /** Horizontal word travel. */
  statement: 75,
} as const;

/**
 * Stack order. Higher sits in front, so each scene draws over the one that
 * follows it and can slide away to reveal it.
 */
export const LAYER = {
  hero: 50,
  about: 40,
  stats: 30,
  projects: 20,
  statement: 10,
} as const;

/** Total height of a scene: its own budget, plus the reveal, plus the stage. */
export const sceneHeight = (content: number, hasCurtain = true) =>
  `${content + 100 + (hasCurtain ? CURTAIN : 0)}vh`;

/**
 * Where a scene's choreography begins, once the curtain has cleared.
 *
 * Returned as a function rather than a string because ScrollTrigger does NOT
 * understand viewport units inside a `+=` offset — it reads `top+=100vh` as
 * 100 *pixels*, which silently starts every sequence while the previous scene
 * is still covering it. A function is re-evaluated on every refresh, so this
 * also stays correct across resizes.
 */
export const sceneStart = (hasCurtain = true) =>
  hasCurtain
    ? () => `top+=${window.innerHeight * (CURTAIN / 100)} top`
    : "top top";

export const vh = (value: number) => `${value}vh`;

/**
 * Shared ScrollTrigger options for a pinned scene.
 *
 * Beyond keeping `scrub` and `invalidateOnRefresh` consistent, this flips
 * `data-scene-active` on the section as it comes into and out of range. The
 * `.gpu` class in globals.css only promotes elements to their own compositor
 * layer while that flag is set, so a scene the reader is nowhere near costs
 * nothing in layer memory.
 */
export function sceneTrigger(
  scope: HTMLElement,
  options: { scrub?: number; curtain?: boolean; start?: string; end?: string } = {},
) {
  const { scrub = 0.6, curtain = true, start, end } = options;

  return {
    trigger: scope,
    start: start ?? sceneStart(curtain),
    end: end ?? "bottom bottom",
    scrub,
    invalidateOnRefresh: true,
    // onToggle covers transitions; onRefresh covers the initial state and
    // every resize, since a trigger that is already active when it is created
    // never fires a toggle.
    onToggle: (self: { isActive: boolean }) => {
      scope.dataset.sceneActive = String(self.isActive);
    },
    onRefresh: (self: { isActive: boolean }) => {
      scope.dataset.sceneActive = String(self.isActive);
    },
  };
}
