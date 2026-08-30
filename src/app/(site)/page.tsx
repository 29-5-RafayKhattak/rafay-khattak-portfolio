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
import {
  getAbout,
  getContact,
  getEducation,
  getEducationIntro,
  getExperience,
  getProjects,
  getSettings,
  getSocials,
  getStats,
  getTechnologies,
} from "@/lib/cms/queries";

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
 * academic foundation under it, then the tools both produced.
 *
 * The first four are pinned scenes and each is pulled up under the one before
 * it, so a scene sliding away is what reveals the next. See lib/scene.ts.
 *
 * COMPOSITION LAYER
 * This is the only place on the homepage that knows content comes from a
 * database. Every section below receives its data as props and is written
 * against the contracts in `src/data`, so the CMS can change shape without a
 * single section changing with it.
 */

/**
 * Rendered on demand, never at build.
 *
 * The deployment compiles without a database — Railway does not expose private
 * networking to a build — so a page that fetched at build time would fail the
 * build outright. Pinning content to build time would also mean every edit in
 * the admin needed a redeploy before anyone could see it.
 *
 * The render is dynamic; the data underneath it is cached by tag and
 * invalidated on publish, so this is not a database round trip per visitor.
 */
export const dynamic = "force-dynamic";

export default async function Home() {
  const [
    settings,
    about,
    stats,
    projects,
    experience,
    education,
    educationIntro,
    technologies,
    contact,
    socials,
  ] = await Promise.all([
    getSettings(),
    getAbout(),
    getStats(),
    getProjects(),
    getExperience(),
    getEducation(),
    getEducationIntro(),
    getTechnologies(),
    getContact(),
    getSocials(),
  ]);

  const labels = settings.sectionLabels;

  return (
    <>
      <main>
        <Hero
          person={settings.person}
          portrait={settings.portrait}
          aboutLabel={labels.about}
          socials={socials}
        />
        <AboutIntro about={about} label={labels.about} />
        <StatsSequence stats={stats} label={labels.stats} />
        <ProjectsShowcase projects={projects} label={labels.work} />
        <HorizontalStatement horizontalWords={settings.horizontalWords} />
        <ExperienceTimeline experience={experience} label={labels.experience} />
        <EducationSection
          education={education}
          intro={educationIntro}
          label={labels.education}
        />
        <Technologies technologies={technologies} label={labels.technologies} />
        <ContactCTA contact={contact} label={labels.contact} />
      </main>
      <Footer
        navigation={settings.navigation}
        person={settings.person}
        site={settings.site}
        socials={socials}
      />
    </>
  );
}
