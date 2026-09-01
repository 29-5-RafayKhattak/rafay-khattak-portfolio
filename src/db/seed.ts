import path from "path";
import { fileURLToPath } from "url";

import { getPayload } from "payload";
import config from "@payload-config";

import {
  about,
  contact,
  education,
  educationIntro,
  experience,
  horizontalWords,
  navigation,
  person,
  portrait,
  sectionLabels,
  site,
  socials,
  stats,
  technologies,
} from "@/data/portfolio";
import { projects } from "@/data/projects";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(dirname, "../../public");

/**
 * -----------------------------------------------------------------------------
 * SEED
 * -----------------------------------------------------------------------------
 * Moves the content that used to be the runtime source into the database, and
 * leaves `src/data/*` as what it now is: the repeatable input this script reads
 * and the type contracts the presentation layer is written against.
 *
 * IDEMPOTENT BY DESIGN
 * Every write is keyed on something stable — a slug, a label, a title — so
 * running this twice updates rather than duplicates. A seed that can only be
 * run against an empty database is a seed nobody dares run.
 *
 * SHAPE TRANSLATION
 * Payload stores a list of strings as a child table of `{ value }` rows, and
 * reserves `id` on every row, so the TypeScript shapes do not map across
 * one-to-one. The helpers below do that translation in one place rather than
 * at forty call sites.
 * -----------------------------------------------------------------------------
 */

/** string[] -> [{ value }] */
const list = (values?: readonly string[]) =>
  (values ?? []).map((value) => ({ value }));

/** Diagram layers: `id` is reserved by Payload, so it is stored as `layerId`. */
const layers = (rows?: readonly { id: string; label: string; note?: string }[]) =>
  (rows ?? []).map((r) => ({ layerId: r.id, label: r.label, note: r.note }));

/** Titled groups of labels. */
const groups = (rows?: readonly { title: string; items: string[] }[]) =>
  (rows ?? []).map((r) => ({ title: r.title, items: list(r.items) }));

/*
 * Top-level await rather than a floating `main().catch()`.
 *
 * `payload run` tears the process down once module evaluation finishes, so a
 * promise started at module scope and merely `.catch()`-ed never resolves: the
 * script exits 0 having done nothing, with no error to explain it. Awaiting at
 * the top keeps the module alive until the work is actually done.
 */
{
  const payload = await getPayload({ config });
  const log = (...m: unknown[]) => console.log("  ", ...m);

  /*
   * SEED ONLY AN EMPTY DATABASE, UNLESS FORCED.
   *
   * This runs as a pre-deploy step, so without this guard every deployment
   * would overwrite whatever had been edited in the admin since the last one —
   * the CMS would appear to work and then silently revert on the next push.
   * `--force` is there for deliberately resetting a database back to the
   * committed content, which is a thing you sometimes want and never want by
   * accident.
   */
  const force = process.argv.includes("--force");
  const existingProjects = await payload.count({ collection: "projects" });

  if (existingProjects.totalDocs > 0 && !force) {
    console.log(
      `Database already holds ${existingProjects.totalDocs} projects — skipping seed.`,
    );
    console.log("Re-run with --force to overwrite it with the committed content.");
    process.exit(0);
  }

  /* ---------------------------------------------------------------- media */
  const kinds = [
    { slug: "portrait", label: "Portrait", description: "Photographs of Rafay." },
    { slug: "logo", label: "Company mark", description: "Employer and client logos." },
    { slug: "screenshot", label: "Screenshot", description: "Approved product screens." },
  ];

  // Postgres ids are numeric in this adapter; the media relationships expect that.
  const kindIds: Record<string, number> = {};
  for (const kind of kinds) {
    const existing = await payload.find({
      collection: "media-kinds",
      where: { slug: { equals: kind.slug } },
      limit: 1,
    });
    const doc = existing.docs[0]
      ? await payload.update({
          collection: "media-kinds",
          id: existing.docs[0].id,
          data: kind,
        })
      : await payload.create({ collection: "media-kinds", data: kind });
    kindIds[kind.slug] = doc.id as number;
  }
  log(`media kinds: ${kinds.length}`);

  /** Upload a file from /public once, keyed on its alt text. */
  const upload = async (
    relPath: string,
    alt: string,
    kindSlug: keyof typeof kindIds,
  ) => {
    const filename = path.basename(relPath);
    const existing = await payload.find({
      collection: "media",
      where: { filename: { equals: filename } },
      limit: 1,
    });
    if (existing.docs[0]) return existing.docs[0].id as number;

    const doc = await payload.create({
      collection: "media",
      data: { alt, kind: kindIds[kindSlug] },
      filePath: path.join(publicDir, relPath),
    });
    return doc.id as number;
  };

  const portraitCutoutId = await upload(
    "images/rafay-portrait-cutout.png",
    portrait.alt,
    "portrait",
  );
  const portraitOriginalId = await upload(
    "images/rafay-portrait.png",
    portrait.alt,
    "portrait",
  );

  const logoIds = new Map<string, number>();
  for (const item of experience) {
    if (!item.logo) continue;
    const rel = item.logo.replace(/^\//, "");
    logoIds.set(item.logo, await upload(rel, `${item.company} logo`, "logo"));
  }
  log(`media uploaded: ${2 + logoIds.size}`);

  /* ------------------------------------------------------------- globals */
  await payload.updateGlobal({
    slug: "settings",
    data: {
      person: {
        firstName: person.firstName,
        lastName: person.lastName,
        title: person.title,
        titleShort: person.titleShort,
        intro: person.intro,
        availability: person.availability,
        location: person.location,
      },
      portrait: { cutout: portraitCutoutId, original: portraitOriginalId },
      site: {
        description: site.description,
        builtBy: site.builtBy,
        // Intentionally empty until the production origin is settled.
        url: site.url ?? undefined,
      },
      sectionLabels: { ...sectionLabels },
      horizontalWords: list(horizontalWords),
      navigation: navigation.map((n) => ({ label: n.label, href: n.href })),
    },
  });

  await payload.updateGlobal({
    slug: "about",
    data: {
      statement: about.statement.map((l) => ({ text: l.text, accent: l.accent })),
      paragraph: about.paragraph,
    },
  });

  await payload.updateGlobal({
    slug: "contact",
    data: {
      email: contact.email,
      headline: list(contact.headline),
      subline: contact.subline,
      sublineAccent: contact.sublineAccent,
      cta: contact.cta,
    },
  });

  await payload.updateGlobal({
    slug: "education-intro",
    data: {
      statement: list(educationIntro.statement),
      lede: educationIntro.lede,
    },
  });
  log("globals: settings, about, contact, education-intro");

  /* --------------------------------------------------------- collections */
  /** Replace-by-key so a rerun updates instead of duplicating. */
  type SimpleCollection =
    | "experience"
    | "education"
    | "stats"
    | "technologies"
    | "socials";

  /*
   * Payload types `create`/`update` per collection slug, so a helper that takes
   * a union of slugs cannot satisfy any single overload. The cast is contained
   * here rather than spread across five call sites — the row shapes themselves
   * are still checked against the collections above at the point they are built.
   */
  const sync = async (
    collection: SimpleCollection,
    key: string,
    rows: Record<string, unknown>[],
  ) => {
    for (const data of rows) {
      const existing = await payload.find({
        collection,
        where: { [key]: { equals: data[key] } },
        limit: 1,
      });
      if (existing.docs[0]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await payload.update({ collection, id: existing.docs[0].id, data } as any);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await payload.create({ collection, data } as any);
      }
    }
    log(`${collection}: ${rows.length}`);
  };

  await sync(
    "experience",
    "role",
    experience.map((e, i) => ({
      order: i,
      role: e.role,
      company: e.company,
      year: e.year,
      period: e.period,
      type: e.type,
      location: e.location,
      summary: e.summary,
      logo: e.logo ? logoIds.get(e.logo) : undefined,
      skills: list(e.skills),
    })),
  );

  await sync(
    "education",
    "qualification",
    education.map((e, i) => ({
      order: i,
      number: e.number,
      tag: e.tag,
      qualification: e.qualification,
      institution: e.institution,
      institutionShort: e.institutionShort,
      description: e.description,
      status: e.status,
      progress: e.progress,
      semestersCompleted: e.semestersCompleted,
      display: e.display,
      grades: list(e.grades),
      gradeTally: e.gradeTally,
      achievement: e.achievement,
    })),
  );

  await sync(
    "stats",
    "label",
    stats.map((s, i) => ({
      order: i,
      value: s.value,
      label: s.label,
      caption: s.caption,
    })),
  );

  await sync(
    "technologies",
    "name",
    technologies.map((name, i) => ({ order: i, name })),
  );

  await sync(
    "socials",
    "label",
    socials.map((s, i) => ({
      order: i,
      label: s.label,
      href: s.href,
      icon: s.icon,
    })),
  );

  /* ------------------------------------------------------------ projects */
  for (const [i, p] of projects.entries()) {
    const cs = p.caseStudy;

    const data = {
      order: i,
      slug: p.slug,
      index: p.index,
      name: p.name,
      category: p.category,
      company: p.company,
      year: p.year,
      description: p.description,
      visual: p.visual,
      accent: p.accent,
      tags: list(p.tags),
      palette: p.palette
        ? { enabled: true, ...p.palette }
        : { enabled: false },
      caseStudy: cs
        ? {
            hasCaseStudy: true,
            statement: cs.statement,
            seoDescription: cs.seoDescription,
            heroNote: cs.heroNote,
            wordmark: cs.wordmark,
            meta: cs.meta,
            highlights: cs.highlights,
            disciplines: list(cs.disciplines),
            covers: list(cs.covers),
            technologies: list(cs.technologies),
            technicalSummary: cs.technicalSummary,
            repository: cs.repository,
            repositoryUrl: cs.repositoryUrl,
            publicArtifacts: cs.publicArtifacts,
            evidence: cs.evidence,
            sections: cs.sections.map((s) => ({
              sectionId: s.id,
              number: s.number,
              title: s.title,
              tone: s.tone ?? "paper",
              figure: s.figure,
              body: list(Array.isArray(s.body) ? s.body : [s.body]),
            })),
            techniques: list(cs.techniques),
            contributors: list(cs.contributors),
            credits: cs.credits,
            status: cs.status,
            planned: cs.planned,
            responsibility: cs.responsibility
              ? {
                  stages: list(cs.responsibility.stages),
                  caveat: cs.responsibility.caveat,
                }
              : undefined,
            disclosure: cs.disclosure
              ? {
                  canShow: list(cs.disclosure.canShow),
                  withheld: list(cs.disclosure.withheld),
                }
              : undefined,
            technicalNotes: groups(cs.technicalNotes),
            architecture: cs.architecture
              ? {
                  heads: layers(cs.architecture.heads),
                  stack: layers(cs.architecture.stack),
                  aside: layers(cs.architecture.aside),
                }
              : undefined,
            infrastructure: cs.infrastructure
              ? { stack: layers(cs.infrastructure.stack) }
              : undefined,
            domain: cs.domain
              ? {
                  nodes: cs.domain.nodes.map((n) => ({
                    nodeId: n.id,
                    label: n.label,
                    stage: n.stage,
                    x: n.x,
                    y: n.y,
                  })),
                  edges: cs.domain.edges.map(([from, to]) => ({ from, to })),
                }
              : undefined,
            growth: cs.growth,
            tradeoff: cs.tradeoff
              ? {
                  left: cs.tradeoff.left
                    ? { title: cs.tradeoff.left.title, items: list(cs.tradeoff.left.items) }
                    : undefined,
                  right: cs.tradeoff.right
                    ? { title: cs.tradeoff.right.title, items: list(cs.tradeoff.right.items) }
                    : undefined,
                  words: list(cs.tradeoff.words),
                }
              : undefined,
            phases: cs.phases?.map((ph) => ({
              number: ph.number,
              label: ph.label,
              complete: ph.complete,
              items: list(ph.items),
            })),
            packages: cs.packages,
            dataFlows: cs.dataFlows,
            metrics: groups(cs.metrics),
            tooling: groups(cs.tooling),
            capabilities: cs.capabilities
              ? { groups: groups(cs.capabilities.groups), note: cs.capabilities.note }
              : undefined,
            topology: cs.topology
              ? {
                  steps: cs.topology.steps.map((s) => ({
                    stepId: s.id,
                    label: s.label,
                    kind: s.kind,
                  })),
                  support: cs.topology.support,
                }
              : undefined,
            primitives: list(cs.primitives),
            aggregation: cs.aggregation
              ? {
                  source: cs.aggregation.source,
                  groupBy: cs.aggregation.groupBy,
                  measures: list(cs.aggregation.measures),
                  output: cs.aggregation.output,
                  note: cs.aggregation.note,
                }
              : undefined,
            limits: cs.limits
              ? {
                  verified: list(cs.limits.verified),
                  notVerified: list(cs.limits.notVerified),
                }
              : undefined,
            nextProof: list(cs.nextProof),
            gap: cs.gap,
            proof: cs.proof
              ? {
                  points: list(cs.proof.points),
                  chain: list(cs.proof.chain),
                  note: cs.proof.note,
                }
              : undefined,
            accessModel: cs.accessModel
              ? {
                  title: cs.accessModel.title,
                  items: list(cs.accessModel.items),
                  note: cs.accessModel.note,
                }
              : undefined,
            // Deliberately empty: no approved screenshots exist yet.
            media: [],
          }
        : { hasCaseStudy: false },
    };

    const existing = await payload.find({
      collection: "projects",
      where: { slug: { equals: p.slug } },
      limit: 1,
    });

    if (existing.docs[0]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.update({ collection: "projects", id: existing.docs[0].id, data: data as any });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.create({ collection: "projects", data: data as any });
    }
  }
  log(`projects: ${projects.length}`);

  console.log("\nSeed complete.");
}

process.exit(0);
