import { Hero } from "@/components/home/Hero";
import { AboutIntro } from "@/components/home/AboutIntro";
import { StatsSequence } from "@/components/home/StatsSequence";
import { ProjectsShowcase } from "@/components/home/ProjectsShowcase";
import { HorizontalStatement } from "@/components/home/HorizontalStatement";
import { ExperienceTimeline } from "@/components/home/ExperienceTimeline";
import { EducationSection } from "@/components/home/EducationSection";
import { Technologies } from "@/components/home/Technologies";
import { ContactCTA } from "@/components/home/ContactCTA";
import { Footer } from "@/components/layout/Footer";

/**
 * The homepage is one continuous scroll. Sections are ordered so the page
 * alternates between light and dark rooms:
 *
 *   Hero (light) → About (dark) → Metrics (dark)
 *     → Work (light) → Statement (light) → Experience (light)
 *     → Education (light) → Toolkit (light)
 *     → Contact (dark) → Footer (dark)
 *
 * Education follows Experience: the professional record first, then the
 * academic foundation under it, then the tools both produced. It sits on the
 * raised surface rather than the canvas its two neighbours use, so it reads as
 * its own room without a hard boundary.
 *
 * The first four are pinned scenes and each is pulled up under the one before
 * it, so a scene sliding away is what reveals the next. See lib/scene.ts.
 */
export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <AboutIntro />
        <StatsSequence />
        <ProjectsShowcase />
        <HorizontalStatement />
        <ExperienceTimeline />
        <EducationSection />
        <Technologies />
        <ContactCTA />
      </main>
      <Footer />
    </>
  );
}
