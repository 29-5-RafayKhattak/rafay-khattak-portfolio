/**
 * Cache tags, one per content area.
 *
 * The pages render on demand rather than at build — Railway builds without
 * database access, so a page that fetched at build time would fail the build
 * outright, and pinning content to build time would mean every edit in the
 * admin needed a redeploy to appear.
 *
 * Instead the render is dynamic and the *data* is cached, keyed by these tags.
 * A publish invalidates only the tag it touched, so editing one project does
 * not throw away the settings, the education timeline or the media.
 */
export const TAGS = {
  projects: "cms:projects",
  experience: "cms:experience",
  education: "cms:education",
  stats: "cms:stats",
  technologies: "cms:technologies",
  socials: "cms:socials",
  settings: "cms:settings",
  about: "cms:about",
  contact: "cms:contact",
  educationIntro: "cms:education-intro",
} as const;

/** Which tag a given collection or global invalidates when it changes. */
export const TAG_FOR: Record<string, string> = {
  projects: TAGS.projects,
  experience: TAGS.experience,
  education: TAGS.education,
  stats: TAGS.stats,
  technologies: TAGS.technologies,
  socials: TAGS.socials,
  media: TAGS.projects,
  "media-kinds": TAGS.projects,
  settings: TAGS.settings,
  about: TAGS.about,
  contact: TAGS.contact,
  "education-intro": TAGS.educationIntro,
};
