import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";

import type { EducationStage, Experience, SocialLink, Stat } from "@/data/portfolio";
import type { Project } from "@/data/projects";
import type { About, Contact, SiteSettings } from "@/lib/cms/content";
import { toProject } from "@/lib/cms/projects";
import { unlist } from "@/lib/cms/shape";
import { TAGS } from "@/lib/cms/tags";

/**
 * -----------------------------------------------------------------------------
 * CONTENT QUERIES
 * -----------------------------------------------------------------------------
 * The only module that talks to Payload at request time. Everything above it
 * receives the contracts from `src/data`, so a component cannot accidentally
 * couple itself to a CMS document shape.
 *
 * TWO LAYERS OF CACHING, DOING DIFFERENT JOBS
 *   unstable_cache — across requests, keyed by tag. This is what stops every
 *                    visitor costing a database round trip, and what a publish
 *                    invalidates.
 *   cache()        — within a single render. The homepage asks for settings
 *                    from the layout, the page and the metadata; this collapses
 *                    that to one call.
 * -----------------------------------------------------------------------------
 */

const client = cache(async () => getPayload({ config }));

/** Cached across requests under `tag`, and deduplicated within one render. */
const cached = <T>(key: string, tag: string, fn: () => Promise<T>) =>
  cache(unstable_cache(fn, [key], { tags: [tag] }));

/* ------------------------------------------------------------------ work */

/** `depth: 2` resolves media relationships inside case-study media rows. */
export const getProjects = cached(
  "projects",
  TAGS.projects,
  async (): Promise<Project[]> => {
    const payload = await client();
    const { docs } = await payload.find({
      collection: "projects",
      limit: 100,
      sort: "order",
      depth: 2,
      overrideAccess: false,
    });
    return docs.map(toProject);
  },
);

export const getProject = async (slug: string): Promise<Project | undefined> => {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug);
};

export const getCaseStudyProjects = async (): Promise<Project[]> =>
  (await getProjects()).filter((p) => p.caseStudy);

/** The next case study in the sequence, wrapping at the end. */
export const getNextProject = async (slug: string) => {
  const list = await getCaseStudyProjects();
  const i = list.findIndex((p) => p.slug === slug);
  if (i === -1) return undefined;
  return list[(i + 1) % list.length];
};

/* -------------------------------------------------------------- timeline */

export const getExperience = cached(
  "experience",
  TAGS.experience,
  async (): Promise<Experience[]> => {
    const payload = await client();
    const { docs } = await payload.find({
      collection: "experience",
      limit: 100,
      sort: "order",
      depth: 1,
      overrideAccess: false,
    });
    return docs.map((d) => ({
      role: d.role,
      company: d.company,
      year: d.year,
      period: d.period,
      type: d.type,
      location: d.location ?? undefined,
      summary: d.summary ?? undefined,
      logo:
        d.logo && typeof d.logo !== "number" && d.logo.url ? d.logo.url : undefined,
      skills: unlist(d.skills),
    }));
  },
);

export const getEducation = cached(
  "education",
  TAGS.education,
  async (): Promise<EducationStage[]> => {
    const payload = await client();
    const { docs } = await payload.find({
      collection: "education",
      limit: 100,
      sort: "order",
      overrideAccess: false,
    });
    return docs.map((d) => ({
      id: String(d.id),
      number: d.number,
      tag: d.tag,
      qualification: d.qualification,
      institution: d.institution ?? undefined,
      institutionShort: d.institutionShort ?? undefined,
      description: d.description,
      status: d.status ?? undefined,
      progress: d.progress ?? undefined,
      semestersCompleted: d.semestersCompleted ?? undefined,
      display:
        d.display?.outline && d.display.solid
          ? {
              lead: d.display.lead ?? "",
              outline: d.display.outline,
              solid: d.display.solid,
            }
          : undefined,
      grades: d.grades?.length ? unlist(d.grades) : undefined,
      gradeTally:
        typeof d.gradeTally?.aStars === "number"
          ? { aStars: d.gradeTally.aStars, aGrades: d.gradeTally.aGrades ?? 0 }
          : undefined,
      achievement: d.achievement ?? undefined,
    }));
  },
);

/* ---------------------------------------------------------------- pieces */

export const getStats = cached("stats", TAGS.stats, async (): Promise<Stat[]> => {
  const payload = await client();
  const { docs } = await payload.find({
    collection: "stats",
    limit: 100,
    sort: "order",
    overrideAccess: false,
  });
  return docs.map((d) => ({ value: d.value, label: d.label, caption: d.caption }));
});

export const getTechnologies = cached(
  "technologies",
  TAGS.technologies,
  async (): Promise<string[]> => {
    const payload = await client();
    const { docs } = await payload.find({
      collection: "technologies",
      limit: 100,
      sort: "order",
      overrideAccess: false,
    });
    return docs.map((d) => d.name);
  },
);

export const getSocials = cached(
  "socials",
  TAGS.socials,
  async (): Promise<SocialLink[]> => {
    const payload = await client();
    const { docs } = await payload.find({
      collection: "socials",
      limit: 100,
      sort: "order",
      overrideAccess: false,
    });
    return docs.map((d) => ({
      label: d.label,
      href: d.href,
      icon: d.icon as SocialLink["icon"],
    }));
  },
);

/* --------------------------------------------------------------- globals */

export const getSettings = cached(
  "settings",
  TAGS.settings,
  async (): Promise<SiteSettings> => {
    const payload = await client();
    const s = await payload.findGlobal({
      slug: "settings",
      depth: 2,
      overrideAccess: false,
    });
    const cutout = s.portrait?.cutout;
    const original = s.portrait?.original;
    const media = (m: typeof cutout) =>
      m && typeof m !== "number" ? m : undefined;

    return {
      person: {
        firstName: s.person.firstName,
        lastName: s.person.lastName,
        fullName: `${s.person.firstName} ${s.person.lastName}`,
        title: s.person.title,
        titleShort: s.person.titleShort,
        intro: s.person.intro,
        availability: s.person.availability,
        location: s.person.location ?? "",
      },
      portrait: {
        cutout: media(cutout)?.url ?? "",
        original: media(original)?.url ?? "",
        alt: media(cutout)?.alt ?? "Portrait",
        cutoutWidth: media(cutout)?.width ?? 985,
        cutoutHeight: media(cutout)?.height ?? 1038,
      },
      site: {
        description: s.site.description,
        builtBy: s.site.builtBy ?? "",
        url: s.site.url || null,
      },
      sectionLabels: s.sectionLabels,
      horizontalWords: unlist(s.horizontalWords),
      navigation: (s.navigation ?? []).map((n) => ({
        label: n.label,
        href: n.href,
      })),
    };
  },
);

export const getAbout = cached("about", TAGS.about, async (): Promise<About> => {
  const payload = await client();
  const a = await payload.findGlobal({ slug: "about", overrideAccess: false });
  return {
    statement: (a.statement ?? []).map((l) => ({
      text: l.text,
      accent: Boolean(l.accent),
    })),
    paragraph: a.paragraph,
  };
});

export const getContact = cached(
  "contact",
  TAGS.contact,
  async (): Promise<Contact> => {
    const payload = await client();
    const c = await payload.findGlobal({ slug: "contact", overrideAccess: false });
    return {
      email: c.email,
      headline: unlist(c.headline),
      subline: c.subline,
      sublineAccent: c.sublineAccent,
      cta: c.cta,
    };
  },
);

export const getEducationIntro = cached(
  "education-intro",
  TAGS.educationIntro,
  async () => {
    const payload = await client();
    const e = await payload.findGlobal({
      slug: "education-intro",
      overrideAccess: false,
    });
    return { statement: unlist(e.statement), lede: e.lede };
  },
);
