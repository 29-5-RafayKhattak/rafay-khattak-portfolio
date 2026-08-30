"use client";

import { motion } from "framer-motion";
import { useCallback, useState } from "react";

import type { EducationStage as EducationStageData } from "@/data/portfolio";
import { fadeUp, IN_VIEW_SOFT, staggerGroup } from "@/lib/animations";
import { DistinctionMoment } from "@/components/education/DistinctionMoment";
import { EducationStage } from "@/components/education/EducationStage";
import { GradeReveal } from "@/components/education/GradeReveal";
import { SemesterTrack } from "@/components/education/SemesterTrack";
import { SectionLabel } from "@/components/ui/SectionLabel";

/**
 * -----------------------------------------------------------------------------
 * EDUCATION
 * -----------------------------------------------------------------------------
 * Three stages, read newest first, each carried by a different oversized
 * element: the degree by its own title set as display type, A Levels by three
 * grades arriving in sequence, O Levels by a tally that hands over to the
 * distinction. Laying all three out identically would have produced the row of
 * résumé cards this section exists not to be.
 *
 * NOT PINNED, ON PURPOSE
 * The page's four pinned scenes are a stack: each is pulled up under the one
 * before it by a negative margin and revealed as that one slides away, which
 * is why they own the LAYER/SCENE budgets in lib/scene.ts. Everything after
 * the statement — experience, toolkit, contact — hands scroll back to the
 * reader. A fifth pinned scene dropped in among them would have to re-enter
 * that stack and re-pace the whole page. So this reads as a column, and the
 * storytelling comes from scroll-linked reveals inside it instead: markers
 * filling, grades arriving one at a time, and the ground warming under the
 * distinction.
 *
 * NO SECOND HORIZONTAL SCROLL
 * A horizontal "science → computing → data" line was considered and dropped:
 * the page already spends a pinned scene on exactly that interaction in the
 * statement section directly above. The progression is stated once here as a
 * static line instead, which says the same thing without repeating the gesture.
 *
 * ANIMATION OWNERSHIP
 *   Framer Motion — the once-only entrances, on wrappers.
 *   GSAP          — discrete scroll-position toggles inside the child parts.
 *   CSS           — the transitions those toggles drive.
 * Under reduced motion the GSAP layer is never built and every part renders in
 * its finished state, so no information depends on a scroll position.
 * -----------------------------------------------------------------------------
 */
export function EducationSection({
  education,
  intro,
  label,
}: {
  education: EducationStageData[];
  intro: { statement: string[]; lede: string };
  label: string;
}) {
  const [distinctionHolding, setDistinctionHolding] = useState(false);

  // Stable, so the child's reduced-motion release effect does not re-run.
  const handleFocus = useCallback((active: boolean) => {
    setDistinctionHolding(active);
  }, []);

  const [current, ...earlier] = education;

  return (
    <section
      id="education"
      aria-label={label}
      className="relative z-0 bg-[var(--color-surface)]"
    >
      <div className="gutter py-[clamp(4.5rem,12vh,9rem)]">
        <SectionLabel index="05" className="mb-[clamp(2.5rem,7vh,5rem)]">
          {label}
        </SectionLabel>

        {/* Intro ------------------------------------------------------- */}
        <motion.div
          variants={staggerGroup(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={IN_VIEW_SOFT}
          className="max-w-[46rem]"
        >
          <h2 className="text-[clamp(1.875rem,5vw,3.75rem)] leading-[1.05] font-semibold tracking-[-0.04em] text-balance">
            {intro.statement.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  variants={fadeUp}
                  className="block"
                  style={{ color: i === 0 ? "var(--color-ink)" : undefined }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h2>

          <motion.p
            variants={fadeUp}
            className="mt-[clamp(1.5rem,4vh,2.25rem)] max-w-[54ch] text-[length:var(--step-body)] leading-[1.65] text-[var(--color-muted)]"
          >
            {intro.lede}
          </motion.p>

          {/* The progression, stated once and held still. */}
          <motion.p
            variants={fadeUp}
            className="mt-[clamp(1.5rem,4vh,2.25rem)] flex flex-wrap items-center gap-x-3 gap-y-2"
            aria-label="Science to computing to data"
          >
            {["Science", "Computing", "Data"].map((word, i) => (
              <span key={word} className="flex items-center gap-3">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="h-px w-6 bg-[var(--color-line-strong)]"
                  />
                )}
                <span
                  className="eyebrow"
                  style={{
                    color:
                      i === 2
                        ? "var(--color-accent)"
                        : "var(--color-muted)",
                  }}
                >
                  {word}
                </span>
              </span>
            ))}
          </motion.p>
        </motion.div>

        {/* Stages ------------------------------------------------------ */}
        <ol
          className="mt-[clamp(3rem,9vh,6rem)] transition-opacity duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ opacity: distinctionHolding ? 0.32 : 1 }}
        >
          {/* 01 — the current stage, and the most prominent. */}
          <EducationStage stage={current} emphasis>
            {current.display && (
              <div aria-hidden="true">
                <p className="eyebrow text-[var(--color-muted)]">
                  {current.display.lead}
                </p>
                <p className="edu-display mt-[clamp(0.75rem,2vh,1.25rem)]">
                  <span className="edu-outline block">
                    {current.display.outline}
                  </span>
                  <span className="edu-solid block">
                    {current.display.solid}
                  </span>
                </p>
              </div>
            )}

            {current.semestersCompleted && (
              <div className="mt-[clamp(2rem,5vh,3rem)] max-w-[26rem]">
                <SemesterTrack completed={current.semestersCompleted} />
              </div>
            )}
          </EducationStage>

          {/* 02 and 03 — carried by their results. */}
          {earlier.map((stage) => (
            <EducationStage key={stage.id} stage={stage}>
              {stage.grades && <GradeReveal grades={stage.grades} />}

              {stage.gradeTally && (
                <GradeReveal
                  grades={[
                    `${stage.gradeTally.aStars} A*`,
                    `${stage.gradeTally.aGrades} A`,
                  ]}
                />
              )}
            </EducationStage>
          ))}
        </ol>

        {/* The closing moment. ----------------------------------------- */}
        {education.find((stage) => stage.achievement) && (
          <div className="mt-[clamp(2rem,6vh,4rem)]">
            <DistinctionMoment
              words={["National", "Distinction"]}
              caption={
                education.find((stage) => stage.achievement)?.description
              }
              onFocus={handleFocus}
            />
          </div>
        )}

        {/* Hand-off into the next section. ----------------------------- */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={IN_VIEW_SOFT}
          className="mt-[clamp(2.5rem,7vh,4.5rem)] flex items-center gap-5"
        >
          <span
            aria-hidden="true"
            className="h-px flex-1 bg-[var(--color-line)]"
          />
          <span className="eyebrow text-[var(--color-muted)]">
            And the tools it turned into
          </span>
        </motion.div>
      </div>
    </section>
  );
}
