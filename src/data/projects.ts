import type { CSSProperties } from "react";

/**
 * -----------------------------------------------------------------------------
 * PROJECTS — the single source for the homepage showcase AND case-study pages
 * -----------------------------------------------------------------------------
 * A project with a `caseStudy` gets a page at /work/<slug>; one without simply
 * appears in the homepage sequence. Adding a real project later means adding an
 * object here — no component needs to change.
 *
 * SECURITY NOTE
 * Several projects here are private or commercial. Where a case study was
 * written from a repository, it was written from that repository's own
 * documentation at Rafay's direction — never by lifting configuration,
 * content or data out of it. The rule that survives either way is the one
 * that matters: no environment variables, credentials, secret names, internal
 * URLs, endpoints, schema definitions, customer records or infrastructure
 * identifiers appear anywhere below. Each project restates the rule in its own
 * terms above its entry.
 * -----------------------------------------------------------------------------
 */

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export type ProjectVisualVariant =
  | "system"
  | "modules"
  | "relations"
  | "pipeline"
  | "grid"
  | "orbit"
  | "scan"
  | "strata"
  | "flow"
  | "edge"
  | "topology";

/**
 * A project's own restrained palette.
 *
 * The portfolio is the master design system; a project may carry its own
 * accents inside it. Every component reads these through CSS variables with a
 * fallback to the portfolio token, so a project without a palette renders
 * exactly as it always did and nothing outside the project is affected.
 */
export type ProjectPalette = {
  /** Primary project accent. */
  accent: string;
  /** Deeper variant, for solid backgrounds. */
  accentDeep: string;
  /** Secondary lines, inactive nodes. */
  muted: string;
  /** Pale tinted surface. */
  surface: string;
  /** A second pale surface in the project's other hue, for alternating bands. */
  surfaceAlt?: string;
  /** An even lighter tint, for a section that should barely lift off paper. */
  surfaceSoft?: string;
  /** Warm secondary accent — active nodes, indices. */
  warm: string;
  /** Type and surfaces on the deep background. */
  cream: string;
};

/** A labelled fact in the case-study hero's metadata column. */
export type MetaEntry = { label: string; value: string };

/**
 * The visual that accompanies a section, looked up in the figure registry in
 * CaseStudy.tsx. Keeping this a key rather than a component keeps the data
 * layer free of JSX and lets two projects share a figure with different
 * content.
 */
export type FigureKey =
  | "relation"
  | "architecture"
  | "techniques"
  | "responsibility"
  | "disclosure"
  | "domain"
  | "stack"
  | "infrastructure"
  | "status"
  | "growth"
  | "tradeoff"
  | "gap"
  | "proof"
  | "phases"
  | "research-architecture"
  | "metrics"
  | "planned"
  | "process-topology"
  | "aggregation"
  | "capabilities"
  | "limits";

export type CaseStudySection = {
  /** Anchor id, also the key used by the contents nav and progress rail. */
  id: string;
  number: string;
  title: string;
  /**
   * The section's prose. A single string is one paragraph; an array is several,
   * set as separate paragraphs in the same measure. Sections that need to
   * explain a system rather than name it were previously forced to compress
   * everything into one paragraph or drop the detail.
   */
  body: string | string[];
  /** Background treatment. Defaults to paper. */
  tone?: SectionTone;
  /** Optional accompanying visual. */
  figure?: FigureKey;
};

/** One horizontal band of the architecture diagram. */
export type ArchitectureLayer = { id: string; label: string; note?: string };

export type CaseStudy = {
  /** The one-sentence thesis, repeated from the homepage sequence. */
  statement: string;
  /**
   * Optional split of the title for the hero, so part of it can take the
   * project accent. Purely presentational — the project's actual name is
   * unchanged and is what every other surface uses.
   *
   * `accent` names which half is coloured rather than the halves being fixed
   * in order: "DataPulse" wants the second word carrying the accent, and
   * "WLE Website" the first.
   */
  wordmark?: { lead: string; tail: string; accent: "lead" | "tail" };
  meta: MetaEntry[];
  /**
   * A short qualifier set opposite the index in the hero — used where the
   * terms a project is published under should be stated before anything else
   * on the page. Optional: without it the hero keeps its default arrangement.
   */
  heroNote?: string;
  /**
   * Four or so hard facts about the build, set under the hero lede.
   *
   * The hero's two columns are independent, so a project with a long metadata
   * list leaves a column of dead paper beside it. These fill that space with
   * something worth reading rather than with more air. Counts and states only
   * — anything that would need verifying does not belong here.
   */
  highlights?: { label: string; value: string }[];
  disciplines: string[];
  technologies: string[];
  technicalSummary: string;
  repository: string;
  publicArtifacts: string;
  evidence: { supported: string; notOverstated: string };
  sections: CaseStudySection[];
  /** Editorial keywords for the interaction-layer section. */
  techniques?: string[];
  /**
   * Everyone who worked on the project. Present whenever the work was not
   * solo — attribution is not optional on a shared project.
   */
  contributors?: string[];
  /**
   * Public repository URL, where one exists. Distinct from `repository`, which
   * is the human label shown under Technical Notes.
   *
   * PUBLIC REPOSITORIES ONLY. A private project must not carry one, even
   * though the address is known and the case study already says the repository
   * is private. GitHub answers a private repository with a 404 for anyone
   * without access, so the link would read as broken to every visitor it was
   * shown to — and publishing the address puts a private client repository's
   * name on a public page for no reader benefit. The two private projects here
   * are deliberately without this field; do not add one.
   */
  repositoryUrl?: string;
  /** Rows for the current-status section. */
  status?: { label: string; value: string; available: boolean }[];
  /** Overrides the description used for page metadata. */
  seoDescription?: string;
  responsibility?: { stages: string[]; caveat: string };
  disclosure?: { canShow: string[]; withheld: string[] };
  technicalNotes: { title: string; items: string[] }[];
  architecture?: {
    /** Parallel entry points that all feed the first layer of the stack. */
    heads?: ArchitectureLayer[];
    /** Top-to-bottom request path. */
    stack: ArchitectureLayer[];
    /** Services that sit beside the path rather than in it. */
    aside?: ArchitectureLayer[];
  };
  /** A second, independent flow — used for the deployment path. */
  infrastructure?: { stack: ArchitectureLayer[] };
  /**
   * Nodes and edges for the relational-domain figure.
   *
   * Coordinates live here rather than in the component: the figure was
   * originally hardwired to one project's entity names, which meant a second
   * project could not use it at all. `x`/`y` are in the figure's own 900x560
   * space, and `stage` is the scroll step at which a node appears.
   */
  domain?: {
    nodes: { id: string; label: string; stage: number; x: number; y: number }[];
    edges: [string, string][];
  };

  /** Ordered stages for the "how it grew" progression. */
  growth?: { number: string; label: string; note: string }[];

  /**
   * The two sides of a deliberate presentation compromise, plus the editorial
   * words that carry the section visually.
   */
  tradeoff?: {
    /** Both columns are optional: a section may be carried by the words
     *  alone, where there is no two-sided argument to set side by side. */
    left?: { title: string; items: string[] };
    right?: { title: string; items: string[] };
    words: string[];
  };

  /**
   * Phases of work, with what is actually finished marked as finished.
   *
   * `complete` is the whole point of the type: a phase list that renders
   * planned work identically to delivered work reads as a finished project,
   * which is the single easiest way for a research page to overstate itself.
   */
  phases?: {
    number: string;
    label: string;
    complete: boolean;
    items: string[];
  }[];

  /** Named source modules — packages, services — behind the architecture. */
  packages?: { name: string; note: string }[];

  /** Named flows across the messaging layer: what travels, and where to. */
  dataFlows?: { label: string; carries: string; topic: string; to: string }[];

  /** Measurable targets, grouped. Targets — not results. */
  metrics?: { title: string; items: string[] }[];

  /** Tooling that exists, described by what it can produce. */
  tooling?: { title: string; items: string[] }[];

  /**
   * What the system actually does for the people using it, grouped.
   *
   * Distinct from `metrics`, which shares a component but carries a fixed
   * caveat about targets rather than results. A delivered system needs to be
   * able to list its capabilities without that disclaimer attached.
   */
  capabilities?: { groups: { title: string; items: string[] }[]; note: string };

  /** Rows for a direction that is planned rather than delivered. */
  planned?: { label: string; value: string; available: boolean }[];

  /**
   * The disciplines this project genuinely touches, out of the full axis.
   *
   * Without it every discipline lights up, which claims breadth a focused
   * project does not have. Named disciplines activate; the rest stay on the
   * rule as context.
   */
  covers?: string[];

  /**
   * A run of processes and the primitives between them, walked on scroll.
   * `kind` is what the step *is* — a process, an IPC channel, memory — so the
   * figure can say that a boundary is being crossed, not just that a box
   * follows a box.
   */
  topology?: {
    steps: { id: string; label: string; kind: string }[];
    support: { label: string; note: string }[];
  };

  /** Low-level primitives, set large. */
  primitives?: string[];

  /** A grouping transformation, named at label level with no invented values. */
  aggregation?: {
    source: string;
    groupBy: string;
    measures: string[];
    output: string;
    note: { title: string; body: string; formula: string };
  };

  /** What is verified and what is not, for a project that states both. */
  limits?: { verified: string[]; notVerified: string[] };

  /** Steps that would raise confidence — none of them taken yet. */
  nextProof?: string[];

  /** Named people and their roles, where a flat name list is not enough. */
  credits?: { name: string; role: string }[];

  /** A gap stated plainly rather than designed around. */
  gap?: { label: string; subject: string; status: string; next: string };

  /**
   * Concrete repository support, plus the chain a single test actually walks.
   *
   * `chain` carries stage names only — never values, thresholds or results.
   * The claim being made is that the test exists and what it checks, which is
   * verifiable from public source; anything numeric would be invented.
   */
  proof?: { points: string[]; chain: string[]; note: string };

  /**
   * High-level access and audit concepts. Deliberately concept-level only:
   * no permission matrices, role identifiers, route structures or anything
   * else that would help someone attack the system.
   */
  accessModel?: { title: string; items: string[]; note: string };
  /**
   * Real, approved screenshots — once redaction and review are complete.
   *
   * Deliberately empty until then, and nothing invented stands in for them:
   * the case study renders no media section at all while this is empty. To
   * publish, drop files into /public/images/projects/<slug>/ and add entries
   * here; <ProjectMedia /> appears on its own. No component change needed.
   */
  media: { src: string; alt: string; caption?: string; width: number; height: number }[];
};

export type Project = {
  id: string;
  slug: string;
  /** Two-digit index rendered as oversized typography. */
  index: string;
  name: string;
  category: string;
  /** Employer or client, where the work was commercial. */
  company?: string;
  year: string;
  description: string;
  visual: ProjectVisualVariant;
  /** Optional. Without one, the project uses the portfolio palette. */
  palette?: ProjectPalette;
  /**
   * The project's own accent. Every mark inside its generated visual, its
   * oversized index and its meta separator take this colour, so the sequence
   * shifts hue as you scroll rather than repeating one brown five times.
   *
   * All five are deliberately siblings of the site accent — same muted,
   * mid-dark register — so the section gains variety without turning into a
   * different design language. Project 01 keeps the house brown.
   */
  accent: string;
  tags: string[];
  /** Present only on projects with a published case study. */
  caseStudy?: CaseStudy;
};

/* -------------------------------------------------------------------------- */
/* WLE WEBSITE — real, and the only project here that is not placeholder       */
/* -------------------------------------------------------------------------- */

/*
 * SOURCE AND DISCLOSURE
 * The repository is private. Rafay owns it and directed this case study to be
 * written from the project's own `/docs` set, so what follows is drawn from
 * that documentation rather than supplied paragraph by paragraph.
 *
 * That makes the disclosure rule sharper, not looser. This page is public, so
 * everything below stays at architecture and technique level. There are
 * deliberately no environment variable names, credentials, secrets, database
 * or bucket identifiers, hosting project names, admin or API paths, migration
 * filenames, schema field definitions, client contact details, or references
 * to third-party repositories anywhere in this file. Decisions and the
 * reasoning behind them are publishable; the operational surface is not.
 */

const WLE_STATEMENT =
  "A public website and self-hosted CMS for an independent wireline and well-testing company, built on a strict contract between the people who publish content and the code that renders it.";

const wleWebsite: Project = {
  id: "wle-website",
  slug: "wle-website",
  index: "01",
  name: "WLE Website",
  category: "Professional Work",
  company: "Well Logging Energy",
  year: "2026",
  description: WLE_STATEMENT,
  visual: "system",
  accent: "#a97956", // the portfolio's house brown — a sibling of WLE's copper

  /*
   * Graphite and copper — WLE's own two scales, rather than a palette invented
   * for the portfolio. Graphite carries the deep bands, copper the indices and
   * active marks, and the two pale tints alternate underneath. Both sit in the
   * same muted, mid-dark register as every other project here.
   */
  palette: {
    /* The deep band has to sit as dark as every other project's does — copper
       set on a mid graphite fell to roughly 2.6:1, well under the ~3.9:1 the
       rest of the sequence holds its indices at. */
    accent: "#22282b", // graphite, deep
    accentDeep: "#171b1d",
    muted: "#8d9297", // graphite mid
    /* WLE is the one project whose pale bands alternate warm and cool: a
       copper tint against a graphite tint. That, rather than the deep tone,
       is what makes the page read as this client's and not another's. */
    surface: "#e9eae9", // graphite tint
    surfaceAlt: "#f4ece3", // copper tint
    surfaceSoft: "#f7f6f4", // barely off paper
    warm: "#bd7433", // copper — indices, wordmark, active marks
    cream: "#f6f3ef",
  },
  tags: ["Next.js", "Payload CMS", "PostgreSQL", "Railway"],

  caseStudy: {
    statement: WLE_STATEMENT,
    wordmark: { lead: "WLE", tail: "Website", accent: "lead" },
    heroNote: "Private repository · described at architecture level only",
    seoDescription:
      "WLE Website — a public site and self-hosted Payload CMS for an independent wireline and well-testing company, built on a declared contract between content and presentation.",

    meta: [
      { label: "Context", value: "Well Logging Energy · Professional work" },
      {
        label: "Client",
        value:
          "Independent wireline and well-testing services, Pakistan onshore fields",
      },
      { label: "Period", value: "June 2026 — Present" },
      {
        label: "Role",
        value: "Requirements, architecture, constraints, direction and review",
      },
      {
        label: "Shape",
        value: "One Next.js application carrying both the public site and its CMS",
      },
      {
        label: "Status",
        value: "In development · CMS connected, content migration in progress",
      },
      {
        label: "Visibility",
        value: "Private repository · no source, screens or client data shown",
      },
    ],

    /* Counts and states, all of them checkable from the repository itself.
       Nothing here is a performance, traffic or business claim. */
    highlights: [
      { label: "Public routes", value: "22 approved" },
      { label: "Content model", value: "16 collections · 13 globals" },
      { label: "Animation libraries", value: "None" },
      { label: "Pinned scroll sequences", value: "Two" },
    ],

    disciplines: [
      "Systems Programming",
      "Data",
      "Databases",
      "Interface",
      "Product",
      "People",
    ],

    /*
     * The pills shown in the hero. Object storage is deliberately not here —
     * it is infrastructure rather than something the reader recognises at a
     * glance, and it is still named in full under Technical Notes.
     */
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Payload CMS",
      "PostgreSQL",
      "Tailwind CSS",
      "Railway",
      "Cloudflare Turnstile",
    ],

    technicalSummary:
      "The public site and its CMS ship as one Next.js application, backed by managed PostgreSQL and a private S3-compatible bucket whose objects are served through access-checked proxies. Schema moves only through committed migrations, applied in a pre-deploy step before a release is promoted.",

    repository: "Private",
    publicArtifacts:
      "Approved screenshots and diagrams will be added after redaction and review.",

    evidence: {
      supported:
        "I can account for the architecture in detail: the content and presentation contract and why it exists, the shape of the CMS model, the hand-written motion system and its two pinned sequences, and the migration, access and delivery discipline around them.",
      notOverstated:
        "The repository is private and the site has not launched publicly, so none of this is independently verifiable from outside. I show no source, screens, internal content or client records, and I claim no traffic, business or commercial outcome.",
    },

    sections: [
      {
        id: "problem",
        number: "01",
        title: "The problem",
        tone: "paper",
        figure: "relation",
        body: [
          "WLE is an independent wireline and well-testing contractor working Pakistan's onshore oil and gas fields. Its public presence had to do two unrelated jobs at once: present the company to operators evaluating a service provider, and give the people inside it a way to keep that presentation current.",
          "Those two audiences pull in opposite directions. A visitor wants a site that reads as considered and specific — real photography, real evidence of how the company works safely, a clear account of what it actually does. An editor wants to correct a phone number without waiting on a deployment.",
          "So the brief was never a set of pages. It was a system in which the public surface and the publishing surface could each move at their own speed without breaking the other.",
        ],
      },
      {
        id: "contract",
        number: "02",
        title: "One contract, two sides",
        tone: "soft",
        figure: "architecture",
        body: [
          "The decision the rest of the project rests on is that no component knows where its content comes from. Every section and card is presentational and receives its data as props. Pages are the composition layer, and the only place aware that an origin exists.",
          "Between the two sits a single typed contract module — the declared shape of every piece of content the site can render. A mapping layer converts CMS documents into those contracts, and is the only runtime code permitted to import generated CMS types. Let components read CMS types directly and they are coupled to the CMS exactly as they were once coupled to placeholder files.",
          "The payoff arrived when the CMS was connected: it was a change in the page files and nothing else. Before the boundary existed, roughly two dozen components imported placeholder content directly, and swapping in real data would have meant editing every one of them.",
          "One rule keeps it from eroding. Contracts are declared explicitly, never inferred from sample data. A type derived from a fixture only describes that fixture, and silently changes shape the moment the fixture does — so typing a prop as \"whatever this placeholder happens to be\" is banned outright.",
          "The same discipline covers imagery. The media reference type treats a photograph that does not exist yet as a first-class case: the source is optional, the alt text is not. A picture nobody has taken is still described, still laid out and still accessible — it renders as an intentional placeholder rather than a broken image or a silent gap.",
        ],
      },
      {
        id: "model",
        number: "03",
        title: "The content model",
        tone: "sage",
        figure: "domain",
        body: [
          "Payload runs self-hosted inside the same Next application rather than as a separate service, so the site and its administration share one deployment, one type system and one build. The trade is that the admin brings its own document shell — which is why the application has no single root layout, and instead gives the public site and the CMS a root each.",
          "The model splits along a line that matters. Reusable business entities are collections; page-specific editorial structure lives in globals. People, locations, departments, policies, standards, news, job openings and enquiries are things the organization has. A page's headings and section order are things a page has.",
          "Nothing is stored as a catch-all block of page JSON. Repeating structures are real relational child tables, which is what makes them queryable, migratable and safe to change deliberately rather than by overwriting a blob.",
          "Everything public carries a draft, published and archived lifecycle plus revision history. An anonymous reader sees published records; a signed-in editor sees the whole workflow. Media and documents are separate taxonomies with separate access rules, so a private CV never inherits the behaviour of a public photograph.",
        ],
      },
      {
        id: "motion",
        number: "04",
        title: "Motion without a library",
        tone: "deep",
        figure: "techniques",
        body: [
          "There is no animation library on the public site, and adding one would be a regression. Motion is CSS transitions and keyframes triggered by a single IntersectionObserver wrapper with a forward or pop variant and a delay for stagger. That covers the entrance reveals carrying most of the site, at no dependency cost.",
          "Two sequences go further and are built as pinned, scrubbed experiences: the company mark unwinding act by act over a field of formation strata with a depth-log readout, and a head-to-toe inspection of protective equipment annotated across eight acts.",
          "Both follow the same shape. A pure function maps scroll progress, zero to one, onto opacity, transform and state. Because it is pure, the timeline can be verified numerically without a browser — and both were. The component that plays it writes results straight to the DOM through refs on each animation frame, so scrolling never triggers a React render.",
          "Reduced motion is not a degraded version of that. When the preference is set, a static summary renders instead: the same information, arranged to be read rather than played. The preference is honoured live, not only at first paint.",
        ],
      },
      {
        id: "scroll",
        number: "05",
        title: "When to take the scroll",
        tone: "deep",
        figure: "tradeoff",
        body: [
          "The two pinned sequences answer the same question in opposite ways, and the difference is the point. The homepage sequence captures the scroll. It is the first thing a visitor meets, it is the company's own mark being explained, and it earns a moment that advances act by act rather than by distance.",
          "The safety-equipment sequence does not capture anything. It sits on a page someone may have reached looking for one specific fact, and an information page should not fight a reader who wants to leave it. The same engine drives both; only the decision about whose gesture wins is different.",
        ],
      },
      {
        id: "invariants",
        number: "06",
        title: "Invariants",
        tone: "soft",
        figure: "proof",
        body: [
          "A design system on a real project erodes through small exceptions, so a few things are held as invariants rather than conventions — enforced by removing the escape hatch, not by asking people not to use it.",
          "Every public hero shares one typographic contract. A route may vary its photography, crop, height, motion and copy; it cannot quietly change a hero's font, size, weight, leading or tracking. The per-page typography overrides that once made that possible were deleted rather than deprecated.",
          "Header height is a single derived token instead of a number repeated in a dozen places. It is computed from a viewport unit, bounded, and read by everything that depends on it — viewport-fitted heroes, pinned stage padding, section snap offsets. The rule is capability-based: nothing sniffs an operating system or a browser. Display scaling and extra browser chrome shrink the usable height, and the geometry follows instead of diverging from it.",
          "The brand values the animations paint with — strand colours, stage background — stay in code and are explicitly not editable through the CMS. An editor changing a background would break the contrast the sequence is tuned against, and it would surface as a bug rather than as a content change.",
        ],
      },
      {
        id: "growth",
        number: "07",
        title: "How it grew",
        tone: "alt",
        figure: "growth",
        body: [
          "The order was deliberate. The content boundary was extracted and every component moved onto props before any CMS existed, which meant the integration later had somewhere to land instead of somewhere to invade.",
          "Work that is finished but not currently on the site is parked rather than deleted: kept restorable, excluded from the type-check, lint and build, and held outside the application source. A long-form leadership sequence lives there now — one crew photograph panned and zoomed person to person across roughly fifteen screens of pinned, scrubbed scroll.",
          "Parking it paid for itself. Two bugs found while building it apply to the two live sequences, and are written down beside it where they will be found again: a viewport height reading as zero in a hidden tab, and a scrubbed timeline taking its duration from its last step rather than from its intended runway.",
        ],
      },
      {
        id: "delivery",
        number: "08",
        title: "Delivery discipline",
        tone: "deep",
        figure: "infrastructure",
        body: [
          "Schema changes are committed migrations in every environment, with the CMS's development-mode auto-push disabled everywhere including locally. The build compiles without database access at all; migrations run afterwards as a separate pre-deploy step on the private network, and the release is promoted only if they succeed.",
          "That arrangement is fail-closed without coupling compilation to a database. A bad migration stops a deployment instead of half-applying itself to a live schema, and a database that is briefly unreachable cannot break a build.",
          "Uploads go to a private object store and reach the browser through server-side proxies that apply access checks and immutable caching, rather than being exposed directly. Public imagery and access-controlled documents travel separate paths on purpose. Retired routes are permanent redirects, so old bookmarks keep working without unapproved pages staying in the sitemap.",
        ],
      },
      {
        id: "responsibility",
        number: "09",
        title: "My responsibility",
        tone: "paper",
        figure: "responsibility",
        body: [
          "I gathered requirements from the people who would use the site on both sides, shaped the architecture and the constraints it had to hold, directed AI-assisted implementation against them, tested the working system, reviewed changes and iterated on weak behaviour.",
          "The constraints are the part I would point at. That components may not import content. That contracts are declared rather than inferred. That schema moves only through committed migrations. That an information page does not take the reader's scroll. Those decisions are what the codebase is still holding, and they are why a section can be added now without renegotiating the whole system.",
        ],
      },
      {
        id: "disclosure",
        number: "10",
        title: "What I can show",
        tone: "sage",
        figure: "disclosure",
        body: [
          "The repository is private and the site is a client's, so this page describes the system rather than displaying it. Everything above is architecture and reasoning: decisions, boundaries, the shape of the model and why each one is there.",
          "What is not here is the operational surface — no source, no credentials or secret names, no database or storage identifiers, no admin or API paths, no schema definitions, and no client records or contact details. Approved screenshots would extend the first list; they would not shorten the second.",
        ],
      },
      {
        id: "status",
        number: "11",
        title: "Current status",
        tone: "paper",
        figure: "status",
        body: [
          "The route hierarchy and responsive navigation are complete, and the content routes read through the mapping layer from a connected CMS. The committed migrations are applied, and the production asset library is in place behind its proxy.",
          "Real company content is partially migrated: the homepage and the company overview and vision pages carry supplied photography and copy, while the remaining pages still render approved placeholders. That is the honest reason this case study describes a system rather than a finished website.",
        ],
      },
    ],

    techniques: [
      "Entrance reveals",
      "Pinned scroll sequences",
      "Pure-function timelines",
      "Per-frame DOM writes",
      "Reduced-motion alternates",
      "Keyboard-accessible gallery",
    ],

    responsibility: {
      stages: [
        "Requirements",
        "Architecture",
        "Constraints",
        "AI-assisted Development",
        "Testing",
        "Review",
        "Iteration",
      ],
      caveat: "I do not claim that I manually wrote every line.",
    },

    disclosure: {
      canShow: [
        "Client and project name",
        "Technology stack",
        "Architecture and its rationale",
        "Content model at concept level",
        "Motion and interaction techniques",
        "Delivery and access discipline",
        "Approved screenshots when available",
      ],
      withheld: [
        "Source code",
        "Credentials and secret names",
        "Database and storage identifiers",
        "Admin and API paths",
        "Schema definitions",
        "Internal and client records",
      ],
    },

    /*
     * Entities the reader can already infer from a public website — a
     * leadership page implies people, a policy register implies policies. No
     * field names, slugs, table names or relationship cardinalities appear
     * here; the figure states that the model is normalized, not what is in it.
     */
    domain: {
      nodes: [
        { id: "media", label: "MEDIA", stage: 1, x: 300, y: 88 },
        { id: "documents", label: "DOCUMENTS", stage: 1, x: 620, y: 88 },
        { id: "people", label: "PEOPLE", stage: 2, x: 160, y: 214 },
        { id: "news", label: "NEWS", stage: 2, x: 450, y: 214 },
        { id: "policies", label: "POLICIES", stage: 2, x: 740, y: 214 },
        { id: "roles", label: "ROLES", stage: 3, x: 160, y: 340 },
        { id: "jobs", label: "JOBS", stage: 3, x: 450, y: 340 },
        { id: "standards", label: "STANDARDS", stage: 3, x: 740, y: 340 },
        { id: "departments", label: "DEPARTMENTS", stage: 4, x: 250, y: 466 },
        { id: "locations", label: "LOCATIONS", stage: 4, x: 470, y: 466 },
        { id: "inquiries", label: "ENQUIRIES", stage: 5, x: 700, y: 466 },
      ],
      edges: [
        ["people", "media"],
        ["people", "roles"],
        ["roles", "departments"],
        ["news", "media"],
        ["policies", "documents"],
        ["standards", "policies"],
        ["jobs", "departments"],
        ["jobs", "locations"],
        ["jobs", "inquiries"],
      ],
    },

    tradeoff: {
      left: {
        title: "Scroll captured — the homepage",
        items: [
          "The first thing a visitor meets",
          "The company's own mark, explained",
          "Advances by act, not by distance",
          "A held moment is the whole point",
        ],
      },
      right: {
        title: "Scroll left alone — the safety page",
        items: [
          "Reached by people after one fact",
          "Pinned and scrubbed, never hijacked",
          "Leaves at the reader's pace",
          "Same engine, different authority",
        ],
      },
      words: ["Attention", "or", "Autonomy"],
    },

    growth: [
      {
        number: "01",
        label: "Route hierarchy",
        note: "The approved sitemap built out against placeholder content, with responsive navigation.",
      },
      {
        number: "02",
        label: "The boundary",
        note: "Content contracts declared and every component moved onto props — before any CMS existed.",
      },
      {
        number: "03",
        label: "CMS foundation",
        note: "Payload self-hosted in the same application, with auth, lifecycle, revisions and migration-driven schema.",
      },
      {
        number: "04",
        label: "Connection",
        note: "Page files switched to CMS reads through the mapping layer. No component changed.",
      },
      {
        number: "05",
        label: "Real content",
        note: "Company photography, contact details and page copy migrated in. The remaining pages still carry placeholders.",
      },
    ],

    /*
     * Invariants the codebase holds, not measurements. Nothing numeric appears
     * here — no build times, bundle sizes, Lighthouse or accessibility scores,
     * none of which have been verified for publication.
     */
    proof: {
      points: [
        "One typographic contract for every public hero",
        "Per-page typography overrides removed, not deprecated",
        "Header height derived once and consumed everywhere",
        "Capability-based sizing — no operating system or browser sniffing",
        "Animation brand values held in code, outside the CMS",
        "Schema reachable only through committed migrations",
      ],
      chain: [
        "Viewport unit",
        "Bounded range",
        "Header token",
        "Hero height",
        "Stage padding",
        "Snap offsets",
      ],
      note: "The chain is how one measurement propagates, named at stage level only. No values, breakpoints or thresholds are published here.",
    },

    accessModel: {
      title: "Publishing and access",
      items: [
        "Anonymous visitors read published records only",
        "Signed-in editors see draft, published and archived states",
        "Writes require authentication; destructive administration is separated again",
        "Public enquiries are never written straight to a collection — a validated handler stands in front",
        "A honeypot field, a per-address rate window and optional bot verification guard that handler",
        "Uploaded documents carry their own access checks, independent of public media",
      ],
      note: "Concept level only. No roles, permissions, routes, endpoints or field names are published here.",
    },

    technicalNotes: [
      {
        title: "Core stack",
        items: [
          "Next.js (App Router)",
          "React",
          "TypeScript (strict)",
          "Payload CMS",
          "PostgreSQL",
        ],
      },
      {
        title: "Interface",
        items: [
          "Tailwind CSS",
          "CSS keyframes + IntersectionObserver",
          "No animation library",
        ],
      },
      {
        title: "Data & media",
        items: [
          "Migration-driven schema",
          "Private S3-compatible object storage",
          "Access-checked media proxies",
        ],
      },
      {
        title: "Deployment & services",
        items: [
          "Railway",
          "Pre-deploy migration step",
          "Permanent redirects for retired routes",
        ],
      },
      {
        title: "Security & integrations",
        items: [
          "Cloudflare Turnstile",
          "Honeypot and rate-limited submissions",
          "Server-side validation of every public form",
        ],
      },
    ],

    architecture: {
      heads: [
        { id: "visitors", label: "Public visitors", note: "Read" },
        { id: "editors", label: "Content editors", note: "Publish" },
      ],
      stack: [
        { id: "routes", label: "Next.js routes", note: "Composition layer" },
        { id: "contracts", label: "Content contracts", note: "Declared types" },
        { id: "mapping", label: "Mapping layer", note: "CMS → contracts" },
        { id: "cms", label: "Payload CMS", note: "Collections & globals" },
        { id: "db", label: "PostgreSQL", note: "Migration-driven schema" },
      ],
      aside: [
        {
          id: "components",
          label: "Presentational components",
          note: "Props only",
        },
        { id: "storage", label: "Private object storage", note: "Proxied media" },
      ],
    },

    infrastructure: {
      stack: [
        { id: "client", label: "Client" },
        { id: "platform", label: "Railway", note: "Build and runtime" },
        { id: "build", label: "Build", note: "Compiles without database access" },
        { id: "migrate", label: "Pre-deploy migrations", note: "Private network" },
        { id: "app", label: "Next.js + Payload", note: "One deployment" },
        { id: "db", label: "PostgreSQL" },
      ],
    },

    status: [
      { label: "Route hierarchy", value: "Complete", available: true },
      { label: "Responsive navigation", value: "Complete", available: true },
      { label: "CMS connected to content routes", value: "Complete", available: true },
      { label: "Content model & migrations", value: "Applied", available: true },
      { label: "Production asset library", value: "In place", available: true },
      { label: "Real company content", value: "Partially migrated", available: false },
      { label: "Public launch", value: "Pending client sign-off", available: false },
    ],

    media: [],
  },
};


/* -------------------------------------------------------------------------- */
/* INTERNAL MANAGEMENT SYSTEM — real, private, internal                        */
/* -------------------------------------------------------------------------- */

/*
 * SOURCE AND DISCLOSURE
 * This is a live internal system holding incident reports, employee medical
 * records, attendance and operational job data. The repository is private;
 * Rafay owns it and directed this case study to be written from it.
 *
 * The page is public, so what follows describes the system at architecture and
 * domain level only. There are deliberately no employee names, incident
 * records, medical entries, job records, audit entries, client names, role
 * identifiers, route structures, environment variable names, credentials,
 * storage endpoints, bucket names or deployment URLs anywhere in this object,
 * and no invented screenshots stand in for the real ones.
 *
 * Client names in particular stay out: the system's customer directory holds
 * real operating companies, and naming them here would publish a client list
 * that is not mine to publish.
 */

const IMS_STATEMENT =
  "An internal operations system for a wireline company — incident reporting, crews, equipment, attendance and medical readiness — held together by one permission model and the test suite that guards it.";

const internalManagementSystem: Project = {
  id: "internal-management-system",
  slug: "internal-management-system",
  index: "02",
  name: "Internal Management System",
  category: "Professional Work",
  company: "Well Logging Energy",
  year: "July 2026 — Present",
  description: IMS_STATEMENT,
  visual: "modules",
  accent: "#a97956",

  /*
   * Graphite blue and slate — an internal-operations identity. Same muted,
   * mid-dark register as WLE's graphite and RideFlow's navy, so the three read
   * as siblings rather than as three different design languages.
   */
  palette: {
    accent: "#1e2a35", // deep graphite blue
    accentDeep: "#151d25",
    muted: "#73808b", // muted slate
    surface: "#e7edf0", // light background
    surfaceAlt: "#eef0ea", // a faint sage cast, for the alternating band
    surfaceSoft: "#f5f7f8", // pale cool gray
    warm: "#b0834f", // brass — indices, wordmark, active marks
    cream: "#f8f7f4",
  },
  tags: ["Next.js", "TypeScript", "PostgreSQL", "Drizzle", "Zod"],

  caseStudy: {
    statement: IMS_STATEMENT,
    wordmark: { lead: "Internal", tail: "Management System", accent: "lead" },
    heroNote: "Live internal system · no records, routes or screens published",
    seoDescription:
      "An internal operations system for Well Logging Energy: incident reporting, field jobs, equipment, fleet, attendance and medical readiness over one permission model, with a committed test suite.",

    meta: [
      { label: "Context", value: "Well Logging Energy · Professional work" },
      {
        label: "Replaces",
        value:
          "Printed incident forms, planning sheets and monthly paper registers",
      },
      { label: "Period", value: "July 2026 — Present" },
      {
        label: "Role",
        value: "Requirements, architecture, constraints, direction and review",
      },
      {
        label: "Shape",
        value: "Nine workspaces over one schema and one permission model",
      },
      {
        label: "Status",
        value: "Deployed internally · under active development",
      },
      {
        label: "Visibility",
        value: "Private repository · no records, routes or screens shown",
      },
    ],

    /* Counts, all of them checkable from the repository. Nothing here is a
       usage, performance or business claim. */
    highlights: [
      { label: "Relational tables", value: "26" },
      { label: "Permissions", value: "32 · 7 baseline profiles" },
      { label: "Feature modules", value: "13, sliced by domain" },
      { label: "Committed test files", value: "33" },
    ],

    disciplines: [
      "Systems Programming",
      "Data",
      "Databases",
      "Security",
      "Product",
      "People",
    ],

    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Drizzle ORM",
      "Zod",
      "Cloudflare Turnstile",
    ],

    technicalSummary:
      "The system runs as one Next.js application over PostgreSQL, with private S3-compatible object storage reachable only through in-app routes that re-check permissions per request. Data moves in and out as spreadsheet workbooks, field photographs are normalized on upload, and every write that changes a record's state is transactional and audited.",

    repository: "Private",
    publicArtifacts:
      "Approved public artifacts will be added after redaction and review.",

    evidence: {
      supported:
        "I can show explicit feature boundaries, a permission model of 32 named permissions with baseline profiles and direct grants, server-side authorization carrying its own regression suite, transactional writes paired with per-record audit timelines, private media delivery behind access checks, and 33 committed test files covering domain rules, validation, permissions, workflows and workbook import and export.",
      notOverstated:
        "This is a live internal system, so no records, routes, screens, client names or role identifiers appear here. I do not claim production scale, quantified business impact, or a security review by anyone other than me. Schema is applied by push rather than by committed migrations, and the tests are not yet run by continuous integration.",
    },

    sections: [
      {
        id: "problem",
        number: "01",
        title: "The problem",
        tone: "soft",
        figure: "domain",
        body: [
          "The company ran its operations on paper. Incident and hazard reports on printed forms, field work on a standard operations planning sheet, attendance and equipment utilisation on monthly grids, medical fitness on certificates in a folder.",
          "Each of those has a different audience and a different rule about who may see it. A safety report is not an attendance register is not a medical certificate, and the people allowed near one are frequently not allowed near another. On paper that separation is enforced by which filing cabinet a document sits in.",
          "So the replacement could not be one dashboard over one table. It had to be several workspaces sharing an organization, a permission model and an audit trail, without leaking across the boundaries between them — which is the part that actually determines whether a system like this can be trusted with medical records at all.",
        ],
      },
      {
        id: "system",
        number: "02",
        title: "The system",
        tone: "sage",
        figure: "architecture",
        body: [
          "The code is sliced by feature rather than by technical layer. Each workspace owns its domain rules, its validation, its permission checks and its components in one place, so a change to how attendance works stays inside attendance instead of rippling through a shared controllers folder.",
          "Underneath, everything leans on one organization module — people, departments, teams — because every other workspace is ultimately about someone or something that belongs to the company. Getting that spine right early is what let the later workspaces be small.",
          "Writes go through a single wrapper that resolves the caller, checks authority, runs the mutation and records the audit event inside one transaction. A state change and the record of that change either both land or neither does. An audit trail that can silently disagree with the data it describes is worse than no audit trail, because it is trusted.",
        ],
      },
      {
        id: "authority",
        number: "03",
        title: "Who may do what",
        tone: "deep",
        figure: "techniques",
        body: [
          "Authorization is its own module rather than a check scattered through routes. It resolves what a caller may do from 32 named permissions, seven baseline profiles, and any direct grants layered on top of a profile for the person who is a genuine exception.",
          "The check runs on the server on every request. Route gating is the first boundary, not the only one — a workspace the navigation never offers is still refused when it is requested directly, and hiding a control is treated as presentation, never as protection.",
          "It is also the one part of the system carrying a regression suite of its own. Permission logic is exactly the code where a quiet change is expensive and invisible: nothing breaks, nothing errors, and someone can suddenly read a colleague's medical record. The tests exist so that a widened boundary fails loudly instead.",
        ],
      },
      {
        id: "workspaces",
        number: "04",
        title: "What it actually does",
        tone: "soft",
        figure: "capabilities",
        body: [
          "Nine workspaces are in internal use, each replacing something that used to be printed, photocopied or kept in a spreadsheet on one person's machine.",
          "Two details shaped more of the build than their size suggests. Intake is bilingual, Urdu and English, because the people closest to a hazard are not always the people most comfortable reporting it in English — and a safety system that quietly filters by language is not collecting the reports that matter most.",
          "The second is that spreadsheets had to keep working. Registers import from and export to workbooks, and reports print to a clean A4 page, because the system has to interoperate with the paper process it is replacing rather than demand everyone abandon it on the same day.",
        ],
      },
      {
        id: "registers",
        number: "05",
        title: "A month at a glance",
        tone: "alt",
        figure: "aggregation",
        body: [
          "The attendance and utilisation workspaces are the same shape: one entry per subject per day, folded into a month-wide grid an operations lead can read across in a single pass.",
          "The grid deliberately stops at recording. It says which state an asset or a person was in on each day; it does not compute a utilisation percentage, an efficiency score or a ranking. Those numbers would be easy to add and easy to misread, and nobody has asked for a measure whose definition has not been agreed.",
        ],
      },
      {
        id: "proof",
        number: "06",
        title: "What the tests hold",
        tone: "sage",
        figure: "proof",
        body: [
          "There are 33 committed test files, and they sit beside the code they cover rather than in a separate tree — a workspace's domain rules, validation, permissions and workflow tests live in the workspace.",
          "They run on Node's own test runner, so the suite adds no test framework to the dependency list. That was a deliberate constraint on a system one person maintains: every dependency is something that will eventually need upgrading, and a test suite is not worth a second toolchain.",
          "The shapes worth naming are the permission tests on every workspace that has a boundary, the round-trip tests on workbook import and export, and one end-to-end test that walks a record through its whole lifecycle. Coverage is not measured, so no coverage figure appears here.",
        ],
      },
      {
        id: "delivery",
        number: "07",
        title: "How it is served",
        tone: "deep",
        figure: "infrastructure",
        body: [
          "The application sits behind a reverse proxy that terminates TLS, and talks to PostgreSQL through a bounded connection pool. Sessions are database-backed, sign-in is rate-limited and bot-checked, and passwords are stored with a salted key-derivation function rather than a plain hash.",
          "Private media never has a public URL. Field photographs, portraits and medical certificates are held in a private bucket and reached only through in-app routes that re-check the caller's permissions on the way past — a link that leaks is a link that stops working for whoever it leaked to.",
          "Photographs arrive from phones, which means they arrive large and occasionally in formats a browser will not display. They are converted and resized on upload, so the storage cost and the load time are settled once at intake rather than paid on every read.",
        ],
      },
      {
        id: "growth",
        number: "08",
        title: "How it grew",
        tone: "soft",
        figure: "growth",
        body: [
          "The order was driven by which piece of paper was costing the most, not by which module was most interesting to build.",
          "Reporting came first because an incident form that goes missing is the one failure with a genuine safety cost. The organization spine came second, because every workspace after it needed somewhere for a person to belong. The permission model was hardened once there was enough in the system to be worth protecting properly.",
        ],
      },
      {
        id: "tradeoff",
        number: "09",
        title: "The tradeoff",
        tone: "deep",
        figure: "tradeoff",
        body: [
          "My strongest engineering evidence on this project sits in exactly the places I cannot show: domain rules, permission resolution, transactional behaviour and the relationships between records.",
          "On this page I would rather describe those honestly and abstractly than manufacture a realistic-looking screen full of invented employees. A fake dashboard would show more and prove less, and anyone who has built one of these can tell the difference.",
        ],
      },
      {
        id: "limits",
        number: "10",
        title: "What holds, and what does not",
        tone: "sage",
        figure: "limits",
        body: [
          "The previous version of this case study said the repository had no committed tests. That is no longer true — there are 33 files — so the claim has been replaced rather than quietly dropped.",
          "What is genuinely outstanding is narrower and less flattering. Schema reaches the database by push rather than through committed, versioned migrations, which means there is no migration history to review or roll back. The tests run when someone runs them; no continuous integration runs them on a change. Both are known, both are mine, and neither is hard — they are simply not done.",
        ],
      },
      {
        id: "status",
        number: "11",
        title: "Current status",
        tone: "paper",
        figure: "status",
        body: [
          "The system is deployed internally and in daily use across its nine workspaces, and remains under active development.",
          "The rows below separate what is in place from what is not, on the same terms as the section above: nothing planned is listed as though it were delivered.",
        ],
      },
    ],

    /*
     * The domains the system covers and how they depend on each other. Safe
     * labels only: these are the names of feature boundaries, not records, and
     * the organization module sits at the centre because every other workspace
     * ultimately hangs off it.
     */
    domain: {
      nodes: [
        { id: "organization", label: "ORGANIZATION", stage: 1, x: 450, y: 275 },
        { id: "people", label: "PEOPLE", stage: 2, x: 450, y: 95 },
        { id: "clients", label: "CLIENTS", stage: 2, x: 150, y: 95 },
        { id: "access", label: "ACCESS", stage: 2, x: 750, y: 95 },
        { id: "medical", label: "MEDICAL", stage: 3, x: 150, y: 275 },
        { id: "jobs", label: "JOBS", stage: 3, x: 750, y: 275 },
        { id: "attendance", label: "ATTENDANCE", stage: 4, x: 150, y: 455 },
        { id: "incidents", label: "INCIDENTS", stage: 4, x: 450, y: 455 },
        { id: "assets", label: "ASSETS", stage: 4, x: 750, y: 455 },
      ],
      edges: [
        ["organization", "people"],
        ["organization", "clients"],
        ["organization", "access"],
        ["organization", "medical"],
        ["organization", "jobs"],
        ["organization", "incidents"],
        ["organization", "attendance"],
        ["people", "access"],
        ["people", "medical"],
        ["jobs", "assets"],
        ["incidents", "jobs"],
      ],
    },

    /*
     * The request path, from an entry point down to the database. Named at
     * role and technology level only — no route structures, no role
     * identifiers, nothing that would help someone probe the real system.
     */
    architecture: {
      heads: [
        { id: "intake", label: "Intake form", note: "Unauthenticated" },
        { id: "portal", label: "Staff portal", note: "Signed in" },
        { id: "self", label: "Self-service", note: "Own records only" },
      ],
      stack: [
        { id: "gate", label: "Route gating", note: "First boundary" },
        { id: "authz", label: "Authorization module", note: "Permissions resolved" },
        { id: "features", label: "Feature modules", note: "Sliced by domain" },
        { id: "actions", label: "Transactional actions", note: "Write and audit together" },
        { id: "db", label: "PostgreSQL", note: "26 relational tables" },
      ],
      aside: [
        {
          id: "org",
          label: "Organization module",
          note: "People, departments, teams",
        },
        { id: "audit", label: "Audit log", note: "Per-record timelines" },
        { id: "media", label: "Private media", note: "Access-checked routes" },
      ],
    },

    infrastructure: {
      stack: [
        { id: "client", label: "Client" },
        { id: "proxy", label: "Reverse proxy", note: "TLS termination" },
        { id: "app", label: "Next.js application", note: "Server Components" },
        { id: "pool", label: "Connection pool", note: "Bounded" },
        { id: "db", label: "PostgreSQL" },
        {
          id: "storage",
          label: "Private object storage",
          note: "Reached only through the app",
        },
      ],
    },

    techniques: [
      "Named permissions",
      "Baseline profiles",
      "Direct grants",
      "Server-side checks",
      "Route gating",
      "Audited writes",
    ],

    capabilities: {
      groups: [
        {
          title: "Safety & compliance",
          items: [
            "Incident and hazard reporting",
            "Bilingual intake, Urdu and English",
            "Triage, routing, investigation, closure",
            "Medical readiness and expiry tracking",
          ],
        },
        {
          title: "Operations",
          items: [
            "Field job planning",
            "Crew assignment",
            "Stage progression",
            "Customer directory",
          ],
        },
        {
          title: "Assets",
          items: [
            "Equipment register",
            "Monthly utilisation grid",
            "Fleet register and status logs",
            "Odometer readings",
          ],
        },
        {
          title: "Workforce",
          items: [
            "Employee records",
            "Self-service profiles",
            "Departments and teams",
            "Monthly attendance register",
          ],
        },
        {
          title: "Administration",
          items: [
            "Access control",
            "Permission profiles",
            "Branding held in the database",
            "Activity log",
          ],
        },
        {
          title: "In and out",
          items: [
            "Workbook import",
            "Workbook export",
            "Print-ready reports",
            "Field photographs normalized on upload",
          ],
        },
      ],
      note: "Every workspace listed here is in internal use. Nothing is named at record, route, client or role level, and no screen is shown.",
    },

    /*
     * Deliberately a register rather than a metric. The measures below are the
     * grid's own dimensions — no utilisation rate, efficiency score or derived
     * index is computed, and none is invented here.
     */
    aggregation: {
      source: "One status entry per subject, per day",
      groupBy: "Subject × calendar month",
      measures: [
        "One code per cell",
        "Up to 31 day columns",
        "One row per person or asset",
      ],
      output: "A month-wide grid, exportable as a workbook",
      note: {
        title: "A register, not a score",
        body: "The grid records which state something was in on a given day. Turning that into a percentage would mean agreeing what counts as available, what counts as productive and what a good number looks like — decisions that belong to the operations team, not to the schema.",
        formula: "subject × day → state",
      },
    },

    /*
     * Claims about the test suite, stated as what exists rather than as a
     * quality measure. Coverage has not been measured, so no coverage figure
     * appears — and the chain names stages only, never assertions or data.
     */
    proof: {
      points: [
        "33 test files committed alongside the code they cover",
        "Authorization carries both a core suite and a regression suite",
        "Every workspace with a permission boundary has a permissions test",
        "Workbook import and export are tested as a round trip",
        "One end-to-end test walks a record through its whole lifecycle",
        "Node's built-in test runner — no test framework dependency",
      ],
      chain: [
        "Sign-in",
        "Permissions resolved",
        "Workspace entered",
        "Record created",
        "State advanced",
        "Audit event written",
      ],
      note: "The chain names the stages one end-to-end test walks, not its assertions, fixtures or data. No coverage percentage is reported here, because none has been measured.",
    },

    growth: [
      {
        number: "01",
        label: "Reporting core",
        note: "Structured incident and hazard reporting, replacing the printed form.",
      },
      {
        number: "02",
        label: "Organization spine",
        note: "People, departments and teams — something for every later workspace to hang off.",
      },
      {
        number: "03",
        label: "Job planning",
        note: "The operations planning sheet digitized, with crews and lifecycle stages.",
      },
      {
        number: "04",
        label: "Assets and workforce",
        note: "Equipment, fleet, monthly utilisation and attendance, with workbooks in and out.",
      },
      {
        number: "05",
        label: "Permission model",
        note: "Named permissions, baseline profiles and direct grants, resolved server-side.",
      },
      {
        number: "06",
        label: "Test suite",
        note: "Domain, validation, permission and workflow tests committed beside the code.",
      },
    ],

    tradeoff: {
      left: {
        title: "Where the engineering is",
        items: [
          "Domain rules",
          "Permission resolution",
          "Transactional writes",
          "Audit behaviour",
          "Data relationships",
        ],
      },
      right: {
        title: "What may be published",
        items: [
          "Sanitized diagrams",
          "Architecture only",
          "No records, routes or clients",
          "Approved screenshots when available",
        ],
      },
      words: [
        "Private system",
        "Public case study",
        "Safe abstraction",
        "Engineering evidence",
      ],
    },

    limits: {
      verified: [
        "Domain rules and validation, by committed tests",
        "Permission resolution, by a dedicated regression suite",
        "Workbook import and export, as a round trip",
        "Type-checking and a production build, on every change",
      ],
      notVerified: [
        "Schema history — the database is pushed, not migrated",
        "Continuous integration — tests run on demand, not automatically",
        "Behaviour under load or real concurrency",
        "Any security review by someone other than me",
      ],
    },

    nextProof: [
      "Versioned migrations",
      "CI on every push",
      "A restore rehearsal",
      "An external review",
    ],

    accessModel: {
      title: "Access & audit model",
      items: [
        "Authority derived from named permissions, not from job titles",
        "Baseline profiles, with direct grants for genuine exceptions",
        "Server-side checks on every request, not only at the route",
        "Database-backed sessions, rate-limited and bot-checked sign-in",
        "Transactional mutations that write the record and its audit event together",
        "Per-record audit timelines, plus a separate administrative activity log",
        "Private media reachable only through access-checked in-app routes",
      ],
      note: "Described at concept level only. Permission matrices, role identifiers, route structures and implementation detail are deliberately withheld.",
    },

    status: [
      { label: "Nine workspaces", value: "In internal use", available: true },
      {
        label: "Permission model",
        value: "32 permissions · 7 profiles",
        available: true,
      },
      { label: "Automated tests", value: "33 files committed", available: true },
      {
        label: "Backup & restore procedure",
        value: "Documented",
        available: true,
      },
      {
        label: "Versioned migrations",
        value: "Not yet — schema is pushed",
        available: false,
      },
      {
        label: "Continuous integration",
        value: "Not configured",
        available: false,
      },
    ],

    technicalNotes: [
      {
        title: "Core stack",
        items: [
          "Next.js (App Router)",
          "React Server Components",
          "TypeScript",
          "PostgreSQL",
          "Drizzle ORM",
        ],
      },
      {
        title: "Domain & safety",
        items: [
          "Schema validation at every boundary",
          "Transactional server actions",
          "Typed domain errors",
        ],
      },
      {
        title: "Data in & out",
        items: [
          "Workbook import",
          "Workbook export",
          "Print-ready reports",
        ],
      },
      {
        title: "Media",
        items: [
          "Private S3-compatible object storage",
          "Access-checked media routes",
          "Conversion and resizing on upload",
        ],
      },
      {
        title: "Security",
        items: [
          "Salted key-derivation password hashing",
          "Database-backed sessions",
          "Rate-limited sign-in",
          "Cloudflare Turnstile",
        ],
      },
      {
        title: "Testing",
        items: [
          "Node's built-in test runner",
          "33 committed test files",
          "Authorization regression suite",
        ],
      },
    ],

    media: [],
  },
};


/* -------------------------------------------------------------------------- */
/* RIDEFLOW — real, public, and collaborative                                  */
/* -------------------------------------------------------------------------- */

const RIDEFLOW_STATEMENT =
  "A multi-role ride-hailing simulation where the business rules live in MySQL — procedures, triggers and constraints — rather than in the Express layer above them.";

/*
 * ATTRIBUTION
 * This project has two contributors. Statements about the system are written
 * in the third person ("the project", "the schema") rather than the first,
 * because the split of work between them is not documented and inventing one
 * would misrepresent a collaborator. Only claims that are actually supported —
 * what can be shown, and what was checked — are made in the first person.
 *
 * SOURCE
 * The repository is public and owned by Muhammad Umar Nadeem. Everything below
 * was read from it, which is also why this page can afford to be concrete: a
 * reader can open the source and check every count and every claim. The one
 * thing deliberately left out is the bootstrap administrator credential the
 * README publishes for demo purposes — repeating it here would serve nobody.
 */
const rideflow: Project = {
  id: "rideflow",
  slug: "rideflow",
  index: "03",
  name: "RideFlow",
  category: "Relational Systems",
  year: "2026",
  description: RIDEFLOW_STATEMENT,
  visual: "relations",
  accent: "#a97956",

  /* Navy and steel — a transport-systems identity, deliberately distinct from
   * WLE's graphite while sharing the same muted, mid-dark register so both
   * still read as this portfolio. */
  palette: {
    accent: "#152634", // deep navy
    accentDeep: "#0d1a24",
    muted: "#607d94", // steel blue
    surface: "#e6edf1", // light project background
    surfaceAlt: "#eef0ef", // a cooler grey band, for alternating
    surfaceSoft: "#f1f4f5", // very light blue-grey
    warm: "#b4794c", // amber — indices, wordmark, active marks
    cream: "#f8f7f4",
  },
  tags: ["Express", "JavaScript", "MySQL", "Railway"],

  caseStudy: {
    statement: RIDEFLOW_STATEMENT,
    wordmark: { lead: "Ride", tail: "Flow", accent: "lead" },
    heroNote: "Public repository · two contributors",
    seoDescription:
      "RideFlow is a multi-role ride-hailing simulation built around a MySQL schema that enforces its own rules — stored procedures, triggers, views and constraints — behind an Express API and three role surfaces.",

    meta: [
      { label: "Context", value: "Academic project · public repository" },
      {
        label: "Contributors",
        value: "Rafay Khattak & Muhammad Umar Nadeem",
      },
      { label: "Period", value: "May 2026" },
      {
        label: "Shape",
        value: "One Express service, three role surfaces, one MySQL schema",
      },
      {
        label: "Where the rules live",
        value: "In the database — procedures, triggers, views and constraints",
      },
      {
        label: "Status",
        value: "Public prototype · the hosted demo no longer responds",
      },
      {
        label: "Visibility",
        value: "Public · every count on this page is checkable in source",
      },
    ],

    /* Counts read straight out of the public repository. Nothing here is a
       usage, performance or scale claim — none of that has been measured. */
    highlights: [
      { label: "Tables", value: "16 · 29 foreign keys" },
      { label: "Database logic", value: "2 procedures · 8 triggers · 6 views" },
      { label: "API routes", value: "43" },
      { label: "Runtime dependencies", value: "Four — no ORM" },
    ],

    contributors: ["Rafay Khattak", "Muhammad Umar Nadeem"],
    repositoryUrl: "https://github.com/umrndem/rideflow",

    disciplines: [
      "Systems Programming",
      "Data",
      "Databases",
      "Interface",
      "Product",
      "People",
    ],

    technologies: [
      "Express",
      "Node.js",
      "JavaScript",
      "MySQL 8",
      "SQL",
      "Railway",
      "Aiven",
    ],

    technicalSummary:
      "The project runs as a single Express service that serves three role surfaces and talks to MySQL 8 over TLS. Fare calculation, driver assignment, commission splits, rating averages and ride archival are stored procedures and triggers rather than application code. It was previously deployed on Railway against managed MySQL; that demo no longer responds, and the bundled initialization script can still bring up a fresh database from the committed SQL.",

    repository: "Public",
    publicArtifacts:
      "The repository publishes its entity-relationship diagram. Screenshots of the rider, driver and admin surfaces can be added here once captured.",

    evidence: {
      supported:
        "The repository is public, so everything on this page can be checked directly: 16 tables joined by 29 foreign keys, two stored procedures, eight triggers, six reporting views, a scheduled event, four database roles with distinct grants, and 43 Express routes serving three role surfaces.",
      notOverstated:
        "The hosted demo no longer responds. There are no automated tests — verification is a set of SQL queries run by hand — and no load, concurrency or scale testing exists anywhere in the project. The split of work between Rafay Khattak and Muhammad Umar Nadeem is not documented, so no division of credit is claimed here.",
    },

    sections: [
      {
        id: "domain",
        number: "01",
        title: "The domain",
        tone: "soft",
        figure: "domain",
        body: [
          "A ride-hailing platform is a deceptively good relational problem. Two parties who do not know each other are matched by a third, money moves in one direction and settles in the other, and every step has to leave a record that can be argued about later.",
          "So the project starts from the schema rather than the screens. Riders, drivers, vehicles, locations, fare rules and promotions exist before a ride does; rides produce payments, ratings and complaints; payments feed wallets, and wallets feed payouts. Sixteen tables, joined by twenty-nine foreign keys.",
          "The states are declared rather than implied. A driver is pending, verified or rejected. A payment is pending, paid, failed or refunded. A complaint is open, under review, resolved or rejected. Writing those as enumerated columns means an impossible state is rejected by the store, not merely avoided by the code that happens to be writing at the time.",
        ],
      },
      {
        id: "stack",
        number: "02",
        title: "The stack",
        tone: "sage",
        figure: "architecture",
        body: [
          "Above the schema sits a single Express service — 43 routes across roughly 2,500 lines — that handles sessions, checks the caller's role, serves the static front end and talks to MySQL through a connection pool.",
          "It leans on four runtime dependencies and no ORM. Queries are SQL, and the calls that matter invoke stored procedures directly. On a project whose subject is relational design, an ORM would have hidden exactly the thing being demonstrated.",
          "The front end is vanilla JavaScript organised as one shared application shell — API wrapper, auth flow, state, UI helpers, device detection — with per-role feature modules layered on top. Which audience a visitor gets is resolved from the path, so all three dashboards ship from one service rather than three deployments.",
        ],
      },
      {
        id: "database",
        number: "03",
        title: "Rules in the database",
        tone: "deep",
        figure: "techniques",
        body: [
          "This is the decision the project is really about. The business rules are not in the Express layer; they are in MySQL, as procedures, triggers, constraints and views.",
          "Two stored procedures carry the operations that must not be got wrong: calculating a fare, and requesting a ride. Eight triggers hold the invariants around them — validating a driver assignment before a ride row is written or updated, computing the driver's net share before a payment lands, finalising a payment once it is marked paid, recalculating rating averages when a rating arrives, maintaining trip counts, and archiving a ride into history when it reaches a terminal state.",
          "The trigger names are worth a mention on their own: each one states its table, its timing, its operation and its purpose. Reading the list tells you what the database guarantees without opening a single body — which is the difference between logic that lives in the store and logic that merely happens to be stored there.",
          "A scheduled event expires promotional codes overnight, so a promotion ending is a property of the data rather than a job somebody has to remember to run.",
        ],
      },
      {
        id: "lifecycle",
        number: "04",
        title: "One ride, end to end",
        tone: "soft",
        figure: "proof",
        body: [
          "The lifecycle is where the design has to hold together. A rider requests a trip against a fare estimate; a driver is offered it and accepts, or the rejection is recorded so the same offer is not made again; the trip progresses through its live states; a payment settles and the platform's commission is split from the driver's share; both sides rate each other; and the completed ride is archived.",
          "Every one of those transitions has something enforcing it underneath — a constraint, a trigger, or a procedure — rather than an application function that a second caller could bypass.",
        ],
      },
      {
        id: "reporting",
        number: "05",
        title: "Reporting in SQL",
        tone: "alt",
        figure: "aggregation",
        body: [
          "The admin dashboard's numbers are not assembled in JavaScript. Six views define them in SQL: active rides, top drivers, a per-city driver leaderboard, revenue by city and day, revenue by payment method, and refund and dispute totals.",
          "The benefit is that a definition exists once. \"Revenue by city\" means one thing, written in one place, and the reporting screen cannot quietly disagree with any other question asked of the same data.",
        ],
      },
      {
        id: "tradeoff",
        number: "06",
        title: "What that choice costs",
        tone: "deep",
        figure: "tradeoff",
        body: [
          "Putting the rules in the database is not free, and the project is a fair place to see both sides of it. Constraints and triggers apply to every caller — including a future one written by somebody who never read the API — and they survive an application bug rather than being defeated by it.",
          "The cost is that the system's logic is split across two languages, that a trigger is markedly harder to unit-test than a function, and that debugging a rejected write means crossing a boundary to find out which layer said no.",
          "For a project whose subject is relational design, the trade lands on the right side. For a system expected to change weekly, it would be a harder argument to make.",
        ],
      },
      {
        id: "surfaces",
        number: "07",
        title: "Three surfaces",
        tone: "sage",
        figure: "capabilities",
        body: [
          "Each role gets its own dashboard rather than one interface with things hidden. A rider books and pays; a driver works and earns; an administrator verifies, prices, adjudicates and reports. The workflows barely overlap, and pretending otherwise would have produced a screen that served none of them well.",
          "Underneath they share a shell, an API wrapper and a state module, so the three surfaces stay consistent without being the same page wearing different navigation.",
        ],
      },
      {
        id: "deployment",
        number: "08",
        title: "Deployment practice",
        tone: "deep",
        figure: "infrastructure",
        body: [
          "The project was deployed as one Node service on Railway, connected over TLS to managed MySQL at Aiven, with the certificate supplied as configuration rather than committed to the repository.",
          "A bundled initialization script applies the committed SQL — schema, then procedures and triggers, then the bootstrap reference data — against whichever database is configured. That is what makes the project restartable: the database is reproducible from source rather than from a backup somebody has to still be holding.",
          "This is evidence that the project can be connected to hosted infrastructure. It is not a claim of production operations experience, and the hosted demo is currently offline.",
        ],
      },
      {
        id: "growth",
        number: "09",
        title: "How it grew",
        tone: "soft",
        figure: "growth",
        body: [
          "The order followed the dependency, not the demo. The schema and its constraints came before any endpoint existed, the procedures and triggers before the API that calls them, and the dashboards last — because a surface built over rules that are not yet settled has to be rebuilt when they are.",
        ],
      },
      {
        id: "limits",
        number: "10",
        title: "What holds, and what does not",
        tone: "sage",
        figure: "limits",
        body: [
          "Because the repository is public, the left column below is unusually strong for a portfolio: none of it has to be taken on trust. Anyone can open the SQL and count.",
          "The right column is the honest other half. There are no automated tests — the committed verification is a file of SQL queries run by hand — nothing has been measured under load or concurrency, the hosted demo no longer answers, and the contribution split between the two authors is not written down anywhere, so it is not asserted here either.",
        ],
      },
      {
        id: "status",
        number: "11",
        title: "Current status",
        tone: "paper",
        figure: "status",
        body: [
          "The repository, its schema, its SQL logic and its entity-relationship diagram are all public and available. The hosted demo is not: all three role entry points return a 404, which I checked rather than assumed.",
          "The project can still be brought up from a clean start. The committed SQL and the bundled initialization script establish a fresh database, after which a local or hosted instance can be pointed at it.",
        ],
      },
    ],

    /* Staged in dependency order: the reference data a ride needs, the two
     * actors, the ride that joins them, the money that follows, and finally
     * everything a completed ride leaves behind. */
    domain: {
      nodes: [
        { id: "users", label: "USERS", stage: 2, x: 190, y: 80 },
        { id: "fares", label: "FARE RULES", stage: 1, x: 450, y: 80 },
        { id: "drivers", label: "DRIVERS", stage: 2, x: 710, y: 80 },
        { id: "locations", label: "LOCATIONS", stage: 1, x: 190, y: 213 },
        { id: "rides", label: "RIDES", stage: 3, x: 450, y: 213 },
        { id: "vehicles", label: "VEHICLES", stage: 3, x: 710, y: 213 },
        { id: "wallets", label: "WALLETS", stage: 4, x: 190, y: 346 },
        { id: "payments", label: "PAYMENTS", stage: 4, x: 450, y: 346 },
        { id: "ratings", label: "RATINGS", stage: 5, x: 710, y: 346 },
        { id: "payouts", label: "PAYOUTS", stage: 5, x: 190, y: 479 },
        { id: "complaints", label: "COMPLAINTS", stage: 5, x: 450, y: 479 },
        { id: "history", label: "HISTORY", stage: 5, x: 710, y: 479 },
      ],
      edges: [
        ["users", "rides"],
        ["drivers", "rides"],
        ["fares", "rides"],
        ["locations", "rides"],
        ["vehicles", "rides"],
        ["drivers", "vehicles"],
        ["rides", "payments"],
        ["rides", "ratings"],
        ["rides", "history"],
        ["payments", "wallets"],
        ["payments", "complaints"],
        ["wallets", "payouts"],
      ],
    },

    architecture: {
      heads: [
        { id: "rider-ui", label: "Rider surface", note: "Booking" },
        { id: "driver-ui", label: "Driver surface", note: "Trips" },
        { id: "admin-ui", label: "Admin surface", note: "Oversight" },
      ],
      stack: [
        { id: "shell", label: "Shared app shell", note: "Audience by path" },
        { id: "api", label: "Express API", note: "43 routes" },
        { id: "session", label: "Sessions & role checks", note: "Per request" },
        { id: "sql", label: "Procedures & triggers", note: "Rules in SQL" },
        { id: "db", label: "MySQL 8", note: "16 tables · 29 foreign keys" },
      ],
      aside: [
        { id: "views", label: "Reporting views", note: "Six, read directly" },
        { id: "roles", label: "Database roles", note: "Four, distinct grants" },
        { id: "event", label: "Scheduled event", note: "Nightly promo expiry" },
      ],
    },

    infrastructure: {
      stack: [
        { id: "client", label: "Browser", note: "Three role entry points" },
        { id: "railway", label: "Railway", note: "Single Node service" },
        { id: "app", label: "Express server", note: "API and static files" },
        { id: "pool", label: "Connection pool", note: "TLS to the provider" },
        { id: "aiven", label: "Aiven", note: "Managed database" },
        { id: "mysql", label: "MySQL 8" },
      ],
    },

    techniques: [
      "Stored procedures",
      "Row-level triggers",
      "Reporting views",
      "Scheduled events",
      "Foreign-key constraints",
      "Enumerated states",
    ],

    /*
     * A public repository is the one case where a proof section can be
     * literal: each point is a count anyone can verify. The chain is the ride
     * lifecycle, taken from the schema's own status values — no timings,
     * volumes or throughput figures, none of which have been measured.
     */
    proof: {
      points: [
        "16 tables joined by 29 foreign keys",
        "Two stored procedures — fare calculation and ride request",
        "Eight triggers covering assignment, payment, rating and archival",
        "Six reporting views, plus a nightly promotion-expiry event",
        "Four database roles with distinct grants",
        "Lifecycle states declared as enumerated columns, not conventions",
      ],
      chain: [
        "Requested",
        "Assigned",
        "Accepted",
        "In progress",
        "Completed",
        "Paid",
        "Rated",
      ],
      note: "The chain names the states a ride moves through, read from the schema itself. Nothing here is a performance, throughput or usage claim — the repository shows a design, not a workload.",
    },

    capabilities: {
      groups: [
        {
          title: "Rider",
          items: [
            "Booking with fare estimate",
            "Wallet and top-ups",
            "Ride history",
            "Rating and complaints",
          ],
        },
        {
          title: "Driver",
          items: [
            "Incoming ride offers",
            "Live trip progression",
            "Earnings and wallet activity",
            "Payout requests",
          ],
        },
        {
          title: "Administrator",
          items: [
            "Driver and vehicle verification",
            "Fare and city rules",
            "Complaints and refunds",
            "Payout processing",
          ],
        },
        {
          title: "Money",
          items: [
            "Wallet ledger",
            "Commission tracking",
            "Driver earning credits",
            "Payout workflow",
          ],
        },
        {
          title: "Trust & safety",
          items: [
            "Mutual ratings",
            "Complaint review",
            "Refunds",
            "Review flags",
          ],
        },
        {
          title: "Shared shell",
          items: [
            "One API wrapper",
            "Shared client state",
            "Automatic refresh",
            "Path-based audience detection",
          ],
        },
      ],
      note: "Three role surfaces served by one Express application. The repository is public, so this list is checkable rather than asserted.",
    },

    /*
     * The reporting views, described by shape. The relationship below is the
     * one the payment trigger encodes; no commission rate, fare figure or
     * revenue number appears here, and none is invented.
     */
    aggregation: {
      source: "Completed rides and their settled payments",
      groupBy: "City × day, and by payment method",
      measures: [
        "Fare collected",
        "Platform commission",
        "Driver net",
        "Refunds and disputes",
      ],
      output: "Six views the admin dashboard reads directly",
      note: {
        title: "One definition, in SQL",
        body: "A view means the meaning of a number is written once. The reporting screen cannot drift from any other question asked of the same rows, because there is no second implementation for it to drift away from.",
        formula: "fare − commission → driver net",
      },
    },

    tradeoff: {
      left: {
        title: "Rules in the database",
        items: [
          "Applied to every caller",
          "Survive an application bug",
          "One definition, written in SQL",
          "Invalid state rejected at the store",
        ],
      },
      right: {
        title: "What it costs",
        items: [
          "Logic split across two languages",
          "A trigger is hard to unit-test",
          "Schema changes are SQL files",
          "Debugging crosses a boundary",
        ],
      },
      words: ["Constraints", "over", "Convention"],
    },

    growth: [
      {
        number: "01",
        label: "Schema first",
        note: "Sixteen tables and twenty-nine foreign keys, before any endpoint existed.",
      },
      {
        number: "02",
        label: "Rules in SQL",
        note: "Procedures, triggers and constraints, so invalid state is rejected at the store.",
      },
      {
        number: "03",
        label: "The API",
        note: "An Express layer over the procedures, with sessions and role checks.",
      },
      {
        number: "04",
        label: "Three surfaces",
        note: "Rider, driver and admin dashboards over one shared client shell.",
      },
      {
        number: "05",
        label: "Reporting",
        note: "Views for revenue, leaderboards and disputes, read straight by the admin screens.",
      },
      {
        number: "06",
        label: "Deployment",
        note: "A single Node service on Railway against managed MySQL, reproducible from committed SQL.",
      },
    ],

    limits: {
      verified: [
        "The schema, procedures, triggers and views — the repository is public",
        "The full ride lifecycle, from request through settlement to rating",
        "Database-side roles and their differing grants",
        "That the database is reproducible from committed SQL",
      ],
      notVerified: [
        "Any workload — no load, concurrency or scale testing exists",
        "Automated tests — verification is SQL queries run by hand",
        "The hosted demo, which no longer responds",
        "The split of work between the two contributors",
      ],
    },

    nextProof: [
      "Automated tests",
      "A seeded load run",
      "A restored demo",
    ],

    status: [
      { label: "Public repository", value: "Available", available: true },
      { label: "Schema & SQL logic", value: "Available", available: true },
      {
        label: "Entity-relationship diagram",
        value: "Published in the repository",
        available: true,
      },
      {
        label: "Database initialization",
        value: "Supported from committed SQL",
        available: true,
      },
      { label: "Hosted demo", value: "Offline — returns 404", available: false },
      { label: "Automated tests", value: "None committed", available: false },
    ],

    technicalNotes: [
      {
        title: "Core stack",
        items: ["Express", "Node.js", "JavaScript", "MySQL 8"],
      },
      {
        title: "Database logic",
        items: [
          "Stored procedures",
          "Triggers",
          "Reporting views",
          "Scheduled event",
          "Roles and grants",
        ],
      },
      {
        title: "Front end",
        items: [
          "Vanilla JavaScript modules",
          "One shared shell",
          "Path-based audience detection",
        ],
      },
      {
        title: "Deployment & services",
        items: ["Railway", "Aiven", "TLS to the database", "Scripted initialization"],
      },
    ],

    media: [],
  },
};

/* -------------------------------------------------------------------------- */
/* DATAPULSE — real, public, analytics                                         */
/* -------------------------------------------------------------------------- */

/*
 * ATTRIBUTION
 * Two contributors. The split of work between them is not documented, so none
 * is implied: both are named at equal weight and the evidence boundary says
 * outright that the split is not stated. The repository is owned by Muhammad
 * Umar Nadeem and is public; everything below was read from it.
 *
 * CLAIM DISCIPLINE
 * This project carries a forecasting path and a language-model assistant,
 * either of which makes it easy to overstate. Nothing here calls it AI
 * research, a machine-learning platform or a production system. No forecast
 * accuracy, model score, dataset statistic or repository metric appears
 * anywhere below, because none has been verified. The two tests are claimed
 * only as existing and as what they check; their values are absent, and the
 * page says plainly that two is the whole suite.
 *
 * The assistant is described by what its code does — constrained generation,
 * independent validation, an enforced row limit — and by what nothing in the
 * repository establishes: whether its answers are correct.
 */

const DATAPULSE_STATEMENT =
  "A business analytics dashboard that turns any sales CSV into KPIs, charts and forecasts — pointed at a new dataset by editing a column mapping rather than the code.";

const datapulse: Project = {
  id: "datapulse",
  slug: "datapulse",
  index: "04",
  name: "DataPulse",
  category: "Analytics",
  year: "May 2026",
  description: DATAPULSE_STATEMENT,
  visual: "pipeline",
  accent: "#a97956",

  /* Plum and muted violet — an analytics identity. Same muted, mid-dark
   * register as the others, so the set still reads as one portfolio. */
  palette: {
    accent: "#35222f", // deep plum
    accentDeep: "#241722",
    muted: "#7e6a7b", // muted violet
    surface: "#f0ebf0", // light project background
    surfaceAlt: "#f2eeea", // a warmer band, for alternating
    surfaceSoft: "#f7f4f6", // very light neutral
    warm: "#b07d55", // clay — indices, wordmark, active marks
    cream: "#f8f7f4",
  },
  tags: ["Python", "Pandas", "Streamlit", "Plotly", "Prophet"],

  caseStudy: {
    statement: DATAPULSE_STATEMENT,
    wordmark: { lead: "Data", tail: "Pulse", accent: "tail" },
    heroNote: "Public repository · two contributors",
    seoDescription:
      "DataPulse is a Streamlit business analytics dashboard covering CSV ingestion, transformation, KPIs, Plotly charts, CSV export, Prophet forecasting and a schema-aware SQL assistant.",

    meta: [
      { label: "Context", value: "Public project · two contributors" },
      {
        label: "Contributors",
        value: "Rafay Khattak & Muhammad Umar Nadeem",
      },
      { label: "Period", value: "May 2026" },
      {
        label: "Shape",
        value: "One Streamlit application over a managed Postgres database",
      },
      {
        label: "Configured by",
        value: "Column mapping — a new dataset needs no code change",
      },
      {
        label: "Status",
        value: "Public prototype · hosted deployment unresolved",
      },
      {
        label: "Visibility",
        value: "Public repository · every claim here is checkable in source",
      },
    ],

    /* Structural counts read from the public repository. Deliberately nothing
       measured: no forecast error, no assistant accuracy, no coverage. */
    highlights: [
      { label: "Pipeline", value: "Ingest · transform · forecast" },
      { label: "Service modules", value: "Five, one job each" },
      { label: "Forecasting", value: "Prophet" },
      { label: "Automated tests", value: "Two" },
    ],

    contributors: ["Rafay Khattak", "Muhammad Umar Nadeem"],
    repositoryUrl: "https://github.com/umrndem/DataPulse",

    disciplines: [
      "Data",
      "Databases",
      "Forecasting",
      "Interface",
      "Product",
      "People",
    ],

    technologies: [
      "Python",
      "Pandas",
      "Streamlit",
      "Plotly",
      "Prophet",
      "SQLAlchemy",
      "Supabase",
      "Gemini",
    ],

    technicalSummary:
      "The application is a single Streamlit process reading and writing a Supabase-hosted Postgres database through SQLAlchemy. Ingestion loads CSVs and normalizes their headers, transformation folds them into one analytics table, and Prophet produces the forecast from it. It was deployed through Streamlit Community Cloud; whether that deployment is still live is unresolved, so it is not presented here as a running demo.",

    repository: "Public",
    publicArtifacts:
      "Dashboard, KPI, chart, export, forecast and assistant screenshots can be added here once captured from a running instance.",

    evidence: {
      supported:
        "The repository is public. It shows a layered application — pages, services, pipeline components, configuration and shared UI, each with one job — a configurable column mapping that onboards a new dataset without touching application logic, a Prophet forecasting path, two separated roles, and a Gemini-backed assistant that turns questions into guarded SELECT statements against the analytics schema.",
      notOverstated:
        "Forecast quality is not evaluated anywhere: no baseline, no held-out period, no error metric. The assistant's SQL is guarded but not measured — nothing checks how often its answers are right. Two automated tests exist, which is two. Role enforcement, data provenance and whether the deployment remains live are unverified, and the contribution split between Rafay Khattak and Muhammad Umar Nadeem is not documented, so none is claimed.",
    },

    sections: [
      {
        id: "product",
        number: "01",
        title: "The product shape",
        tone: "soft",
        figure: "architecture",
        body: [
          "DataPulse is written to be used rather than read. Its own documentation opens by saying so — a business owner or an examiner should be able to work the thing without opening a Python file — and that framing decides most of what follows.",
          "The path through it is a pipeline. CSVs land in a raw folder; ingestion normalizes their headers and loads them; transformation folds several raw tables into one business-ready analytics table; the dashboard reads from that table, and forecasting hangs off the same one.",
          "The code is layered to match. Pages render, services hold the business logic — authentication, data access, KPI calculation, forecasting — pipeline components do the loading and reshaping, configuration holds the dataset mapping, and a shared UI module owns styling and chart helpers. Each file has one job, which is what keeps a project this size legible.",
        ],
      },
      {
        id: "surfaces",
        number: "02",
        title: "Two roles, six pages",
        tone: "sage",
        figure: "capabilities",
        body: [
          "There are two kinds of person in the system. An administrator manages users, sets business targets, runs the pipeline and triggers forecasts; a viewer sees the dashboard and the reports and cannot reach any of that.",
          "That split is why the settings and pipeline pages exist separately at all. Deleting data, resetting the system and changing who has access are precisely the actions you do not want one click away from a read-only dashboard.",
        ],
      },
      {
        id: "mapping",
        number: "03",
        title: "Business-agnostic, for real",
        tone: "alt",
        figure: "aggregation",
        body: [
          "The product claim is that DataPulse works for any business, and the column mapping is what makes that true rather than aspirational. A dataset needs a date column, a value column and a unique record ID; a customer column is optional.",
          "Pointing the application at a different business means editing that mapping — in a Python config or a YAML file, both of which are committed — so the names in the system line up with the names in the CSV. No application logic changes. It is a small idea, and it is the entire difference between a dashboard for one dataset and a dashboard for any.",
          "Everything downstream reads the mapped names and neither knows nor cares what the source file called them. The KPIs fall out of that table: revenue, order count, average order value, and the trend across whatever date range the reader selects.",
        ],
      },
      {
        id: "forecast",
        number: "04",
        title: "Forecasting, and what it is not",
        tone: "deep",
        figure: "tradeoff",
        body: [
          "The forecasting path fits Prophet to the historical series in the analytics table and renders the result beside the actuals, which is genuinely useful for the planning conversations the product is aimed at.",
          "What the project does not do is evaluate it. There is no held-out period, no baseline to compare against, and no error metric reported anywhere. A forecast chart that looks plausible is not a measured forecast, and that distinction is the whole reason this page calls the work analytics with forecasting rather than machine learning.",
          "That is a gap in the evidence rather than a criticism of the choice. Prophet is a reasonable tool for a small business series. It simply has not been shown to be right here — and showing it would be cheap: one held-out window and one baseline would settle the question.",
        ],
      },
      {
        id: "assistant",
        number: "05",
        title: "The assistant that writes SQL",
        tone: "deep",
        figure: "techniques",
        body: [
          "There is a feature in the repository its documentation never mentions: a conversational assistant that answers questions about the data by writing SQL against it.",
          "The flow is careful. It reads live column metadata for the analytics tables and builds a compact schema description, decides whether the question is a data question at all, asks the model for a single SELECT constrained to those tables, runs it, and then asks the model again to turn the returned rows into a sentence.",
          "The part worth pointing at is that it does not trust the model. The prompt asks for a SELECT with no semicolons — and then the code independently checks that the statement begins with SELECT, contains none of a list of write and schema-modifying keywords, and carries no semicolon, and appends a row limit if the model did not set one. A prompt instruction is a request; the guard is what actually holds.",
          "It is a keyword denylist and a row cap rather than a sandbox, and nothing in the repository measures how often the generated SQL answers the question asked. Both of those sit in the limits below rather than being glossed over here.",
        ],
      },
      {
        id: "proof",
        number: "06",
        title: "What is actually tested",
        tone: "soft",
        figure: "proof",
        body: [
          "There are two automated tests. One checks a KPI calculation against known data; the other checks that the application can load data from the database.",
          "Two is a small number, and this page says so rather than describing them as a suite. What they do cover is the seam most likely to fail silently — a KPI that quietly computes the wrong thing looks exactly like a KPI that works — so as a first test to have written, it is the right one.",
        ],
      },
      {
        id: "deployment",
        number: "07",
        title: "How it was served",
        tone: "deep",
        figure: "infrastructure",
        body: [
          "The application ran on Streamlit Community Cloud against a Supabase-hosted Postgres database, reached through SQLAlchemy with the connection string supplied as an environment value. An example environment file is committed; the real one is not.",
          "Whether that deployment is still live is unresolved, so it is not presented here as a running demo. What is reproducible is the local path: the repository carries a development container definition and a pinned requirements file, so the environment is described rather than assumed.",
        ],
      },
      {
        id: "limits",
        number: "08",
        title: "What holds, and what does not",
        tone: "sage",
        figure: "limits",
        body: [
          "The repository is public, so the left column below can be checked rather than taken on trust — the structure, the mapping, the forecasting path and the SQL guards are all there to read.",
          "The right column is where this would have to grow to be a data-science case study rather than an application one. None of it is difficult. None of it is done.",
        ],
      },
      {
        id: "growth",
        number: "09",
        title: "What would strengthen it",
        tone: "soft",
        figure: "growth",
        body: [
          "Not a roadmap — the specific things that would turn this from an application into evidence. Each one converts a claim on this page from an assertion into a number.",
        ],
      },
      {
        id: "status",
        number: "10",
        title: "Current status",
        tone: "paper",
        figure: "status",
        body: [
          "The repository and everything in it are public and available: the layered source, both mapping formats, the forecasting path, the assistant and the two tests.",
          "What is not available is any evaluation, and the hosted deployment's state is unresolved. The rows below keep those apart rather than folding them into a summary that would read as finished.",
        ],
      },
    ],

    /* The pipeline, walked stage by stage as the section is scrolled. */
    architecture: {
      heads: [
        { id: "admin", label: "Administrator", note: "Runs the pipeline" },
        { id: "viewer", label: "Viewer", note: "Reads the dashboard" },
      ],
      stack: [
        { id: "ingestion", label: "Ingestion", note: "CSV, headers normalized" },
        { id: "transformation", label: "Transformation", note: "One analytics table" },
        { id: "kpi", label: "KPI service", note: "Business measures" },
        { id: "visualization", label: "Visualization", note: "Plotly" },
        { id: "forecasting", label: "Forecasting", note: "Prophet" },
      ],
      aside: [
        { id: "config", label: "Column mapping", note: "Python or YAML" },
        { id: "assistant", label: "Assistant", note: "Question to SQL" },
        { id: "db", label: "Supabase Postgres", note: "Via SQLAlchemy" },
      ],
    },

    capabilities: {
      groups: [
        {
          title: "Pages",
          items: [
            "Login",
            "Analytics hub",
            "Business insights",
            "Data pipeline",
            "Settings",
            "Assistant",
          ],
        },
        {
          title: "Administrator only",
          items: [
            "User management",
            "Business targets",
            "Pipeline runs",
            "Forecast runs",
            "System logs",
            "Data reset",
          ],
        },
        {
          title: "Viewer",
          items: [
            "Dashboard",
            "Charts and KPI cards",
            "Date range filter",
            "CSV export",
          ],
        },
        {
          title: "Insights",
          items: [
            "Revenue",
            "Order count",
            "Average order value",
            "Trend over time",
            "Forecast chart",
            "Progress against target",
          ],
        },
        {
          title: "Pipeline",
          items: [
            "CSV ingestion",
            "Header normalization",
            "Transformation to one table",
            "Standalone forecast run",
          ],
        },
        {
          title: "Services",
          items: [
            "Authentication",
            "Data access",
            "KPI calculation",
            "Forecasting",
            "Assistant",
          ],
        },
      ],
      note: "Six pages over five service modules. The repository is public, so this list is checkable rather than asserted.",
    },

    aggregation: {
      source: "One analytics table, built from the mapped CSVs",
      groupBy: "The selected date range",
      measures: [
        "Revenue",
        "Order count",
        "Average order value",
        "Progress against target",
      ],
      output: "KPI cards, trend charts and a downloadable CSV",
      note: {
        title: "Mapping, not migration",
        body: "Changing which business the dashboard serves is a configuration edit, not a schema change. The mapping names which CSV column plays each role, and everything downstream — the KPI service, the charts, the forecast — reads those roles rather than the source file's own column names.",
        formula: "revenue ÷ orders → average order value",
      },
    },

    tradeoff: {
      left: {
        title: "What the forecast is",
        items: [
          "Prophet fitted to the historical series",
          "Refitted as more data is loaded",
          "Rendered beside the actuals",
          "Useful for a planning conversation",
        ],
      },
      right: {
        title: "What it is not",
        items: [
          "Evaluated against a held-out period",
          "Compared to any baseline",
          "Reported with an error metric",
          "A machine-learning result",
        ],
      },
      words: ["Analytics", "with forecasting", "not", "AI research"],
    },

    techniques: [
      "Schema from live metadata",
      "Question routing",
      "Constrained generation",
      "Independent SQL validation",
      "Enforced row limit",
      "Model fallback",
    ],

    proof: {
      points: [
        "A KPI calculation checked against known data",
        "A database integration check on the application's data path",
        "Configurable column mapping, committed in both Python and YAML",
        "Ingestion, transformation and prediction as separate components",
        "Five service modules with one responsibility each",
        "An example environment file committed; the real one is not",
      ],
      chain: ["Source", "Transform", "Expected KPI", "Test", "Pass"],
      note: "The chain names what the KPI test walks, not what it returns; its inputs and values are not reproduced here. Two tests is the entire suite — no coverage figure is claimed, and none has been measured.",
    },

    infrastructure: {
      stack: [
        { id: "browser", label: "Browser" },
        {
          id: "cloud",
          label: "Streamlit Community Cloud",
          note: "Application hosting",
        },
        { id: "app", label: "Streamlit application", note: "Pages and services" },
        { id: "orm", label: "SQLAlchemy", note: "Connection from environment" },
        { id: "supabase", label: "Supabase", note: "Managed Postgres" },
      ],
    },

    limits: {
      verified: [
        "The layered structure — pages, services, components, configuration",
        "Column mapping that onboards a dataset without a code change",
        "A Prophet forecasting path, end to end",
        "Independent validation and a row cap on the assistant's SQL",
      ],
      notVerified: [
        "Forecast quality — no baseline, no held-out period, no error metric",
        "Assistant accuracy — nothing measures whether its SQL answers the question",
        "Role enforcement — the separation exists but no test asserts it",
        "Whether the hosted deployment is still live",
      ],
    },

    nextProof: [
      "A held-out window",
      "A stated baseline",
      "An assistant answer set",
      "Role tests",
    ],

    accessModel: {
      title: "Roles and guards",
      items: [
        "Two roles — administrator and viewer — with different pages reachable",
        "User management, targets, pipeline runs and data reset are administrator-only",
        "Passwords are hashed by the authentication service rather than stored as given",
        "The assistant's generated SQL is validated independently of the prompt",
        "Generated queries carry a row limit whether or not the model set one",
        "Database credentials come from the environment; an example file is committed, the real one is not",
      ],
      note: "Concept level, and checkable — the repository is public. The separation is not covered by any test, which the limits section states rather than hides.",
    },

    /* Not a roadmap. What would make the evidence stronger than it is. */
    growth: [
      {
        number: "01",
        label: "Public-safe dataset",
        note: "A reproducible dataset published beside the work, so a reader can run it.",
      },
      {
        number: "02",
        label: "Runtime validation",
        note: "Checks that run with the pipeline rather than beside it.",
      },
      {
        number: "03",
        label: "Baseline comparison",
        note: "A stated baseline for any forecast to be measured against.",
      },
      {
        number: "04",
        label: "Error metrics",
        note: "Explicit forecast error, reported rather than implied.",
      },
      {
        number: "05",
        label: "Assistant evaluation",
        note: "A fixed set of questions with known answers, so accuracy is a number rather than an impression.",
      },
      {
        number: "06",
        label: "Role tests",
        note: "Tests that assert a viewer cannot reach an administrator's actions.",
      },
    ],

    status: [
      { label: "Public repository", value: "Available", available: true },
      { label: "Layered source", value: "Available", available: true },
      {
        label: "Column mapping",
        value: "Python and YAML, both committed",
        available: true,
      },
      { label: "Forecasting path", value: "Implemented", available: true },
      {
        label: "SQL assistant",
        value: "Implemented · undocumented upstream",
        available: true,
      },
      { label: "Automated tests", value: "Two committed", available: true },
      { label: "Forecast evaluation", value: "None", available: false },
      {
        label: "Hosted deployment",
        value: "Unresolved",
        available: false,
      },
    ],

    technicalNotes: [
      {
        title: "Core stack",
        items: ["Python", "Pandas", "Streamlit", "Plotly", "Prophet"],
      },
      {
        title: "Data",
        items: [
          "SQLAlchemy",
          "Supabase Postgres",
          "CSV ingestion",
          "Column mapping in Python or YAML",
        ],
      },
      {
        title: "Assistant",
        items: [
          "Google Gemini",
          "Schema-aware prompting",
          "SELECT-only validation",
          "Enforced row limit",
        ],
      },
      {
        title: "Deployment & environment",
        items: [
          "Streamlit Community Cloud",
          "Pinned requirements",
          "Development container",
        ],
      },
      {
        title: "Testing",
        items: ["pytest", "Two committed tests"],
      },
    ],

    media: [],
  },
};


/* -------------------------------------------------------------------------- */
/* DISTRIBUTED AI MICROMOUSE — real, research, in progress                     */
/* -------------------------------------------------------------------------- */

/*
 * ATTRIBUTION
 * A team research project with a named maintainer. Nothing below is written as
 * sole authorship: system-level statements say "the project" or "the
 * repository", and the credits name Muhammad Adil Khan as maintainer. No
 * contribution split or percentage is stated, because none is documented. The
 * maintainer's email address appears in the repository README and is
 * deliberately not repeated here.
 *
 * CLAIM DISCIPLINE
 * Phases 1 and 2 are complete; phase 3 is not. That distinction is carried
 * structurally rather than in prose — the phase track, the status list and the
 * limits section all mark unfinished work as unfinished, and the federated
 * section renders its items as planned rather than delivered. There are no
 * benchmark numbers, no accuracy figures, no claim that either algorithm wins,
 * and no claim of publication, hardware validation or federated convergence
 * anywhere here.
 *
 * The sharpest version of that discipline is stated on the page itself: the
 * repository's benchmark tool can render a complete, publication-styled
 * comparison from synthetic data. Any figure this project produces therefore
 * has to say which it is, and none is reproduced here at all.
 */

const MICROMOUSE_STATEMENT =
  "A research project comparing tabular Q-Learning against Deep Q-Learning on resource-constrained edge hardware, built as five ROS2 packages around maze-solving microrobots.";

const micromouse: Project = {
  id: "distributed-ai-micromouse",
  slug: "distributed-ai-micromouse",
  index: "05",
  name: "Distributed AI Micromouse",
  category: "Edge AI Research",
  year: "2026 — Present",
  description:
    "A research platform comparing Q-Learning and Deep Q-Learning for resource-constrained edge AI, with simulation, real-time training, telemetry, and future federated-learning experiments.",
  visual: "edge",
  accent: "#a97956",

  /* Indigo and teal — a research identity, and the same muted, mid-dark
   * register as the other four. */
  palette: {
    /* Deepened from the original indigo: the sand accent only clears the
       ~4:1 the rest of the sequence holds its indices at once the band goes
       this dark, and brightening the sand instead would have cost the hero
       index its contrast against paper. */
    accent: "#232a4d", // deep indigo
    accentDeep: "#191e38",
    muted: "#7a819b", // muted blue-gray
    surface: "#eceef4", // light indigo background
    surfaceSoft: "#f5f6f9", // barely off paper
    surfaceAlt: "#edf4f2", // pale teal
    warm: "#b08050", // warm sand — indices, wordmark, active marks
    cream: "#f8f7f4",
  },
  tags: ["Python", "ROS2", "PyTorch", "ESP32", "TensorFlow Lite"],

  caseStudy: {
    statement: MICROMOUSE_STATEMENT,
    wordmark: { lead: "Distributed AI", tail: "Micromouse", accent: "tail" },
    heroNote: "Public repository · research in progress · no results reported",
    seoDescription:
      "A research project comparing Q-Learning and Deep Q-Learning for edge AI on ESP32 hardware, built as five ROS2 packages with simulation, training, telemetry and a federated-aggregation contract.",

    meta: [
      { label: "Context", value: "University research · AI systems course" },
      { label: "Maintainer", value: "Muhammad Adil Khan" },
      { label: "Period", value: "2026 — Present" },
      {
        label: "Research direction",
        value:
          "Q-Learning vs Deep Q-Learning on resource-constrained edge devices",
      },
      {
        label: "Shape",
        value: "Five ROS2 packages · nine nodes · one declared message contract",
      },
      {
        label: "Status",
        value: "Phases 1 and 2 complete · experiments not yet run",
      },
      {
        label: "Visibility",
        value: "Public repository · MIT licensed · no results reported",
      },
    ],

    /* Structural counts, all readable from the public repository. Deliberately
       nothing measured — no accuracy, latency, memory or benchmark figure
       appears anywhere on this page, because none has been produced. */
    highlights: [
      { label: "ROS2 packages", value: "Five" },
      { label: "Nodes", value: "Nine, across four packages" },
      { label: "Message contract", value: "6 messages · 4 services · 1 action" },
      { label: "Phases complete", value: "Two of three" },
    ],

    credits: [
      { name: "Rafay Khattak", role: "Portfolio project contributor / researcher" },
      { name: "Muhammad Adil Khan", role: "Maintainer" },
    ],

    disciplines: [
      "Systems Programming",
      "Machine Learning",
      "Data",
      "Embedded",
      "Product",
      "People",
    ],

    technologies: [
      "Python",
      "ROS2",
      "PyTorch",
      "NumPy",
      "Streamlit",
      "TensorFlow Lite",
      "ESP32",
    ],

    /*
     * The supplied documentation carries setup paths for two different ROS2
     * releases. Presenting either as authoritative would be inventing a fact
     * the source does not settle, so the inconsistency is stated instead.
     */
    technicalSummary:
      "The project builds as five ROS2 packages with colcon, holding QoS profiles and training hyperparameters in committed YAML rather than in code. The documentation currently names two different ROS2 releases across its setup paths, and several of the guides its README links to are not committed; the reproducible research environment should be standardized and recorded before any result is published.",

    repository: "Public",
    repositoryUrl: "https://github.com/29-5-RafayKhattak/AIPROJECT",
    publicArtifacts:
      "Architecture figures, simulation screenshots, robot images, dashboard captures, Q-table plots and benchmark plots can be added once produced from real runs — and should be labelled as such when they are.",

    evidence: {
      supported:
        "The repository is public. It shows a five-package ROS2 architecture with a declared message, service and action contract; both a Deep Q-Learning and a tabular Q-Learning training path; a model manager; a physics-based simulator and a synthetic data generator; a Streamlit dashboard; PyTorch to TensorFlow Lite conversion with a converted model committed; verification scripts; and publication-quality plotting tools.",
      notOverstated:
        "No comparative result is reported, because none has been run and recorded. The hardware experiments, the multi-robot federated experiments and the generalization analysis are all outstanding. The benchmark tool can render a finished-looking comparison from synthetic data, so no figure from this project should be read as a finding. I claim no publication, and no contribution split is stated because none is documented.",
    },

    sections: [
      {
        id: "research-question",
        number: "01",
        title: "The research question",
        tone: "soft",
        figure: "phases",
        body: [
          "How do tabular Q-Learning and Deep Q-Learning compare on a genuinely resource-constrained device — not just in how well they learn, but in what they cost to run: compute, memory, inference time, communication, and how well a policy transfers to a maze it has not seen.",
          "The framing matters because the two are usually compared on the learning axis alone, where the neural method wins by construction. On a microcontroller the interesting question is different: a table that fits in flash and needs no floating-point inference may be the better engineering answer even when it generalizes worse.",
          "The longer-term direction is to extend that comparison across several robots learning at once, and to measure what the coordination itself costs. The phases below mark what is built and what is not.",
        ],
      },
      {
        id: "architecture",
        number: "02",
        title: "System architecture",
        tone: "sage",
        figure: "research-architecture",
        body: [
          "The project is organized as five ROS2 packages: shared messages, training, dashboard, robot control, and simulation. A robot — simulated or physical — publishes over ROS2 topics to a training server, which produces models and metrics that the dashboard reads.",
          "Splitting messages into their own package is the load-bearing decision. Every other package depends on the contract rather than on each other, which is what allows the simulated robot and a physical one to be interchangeable from the training server's point of view.",
          "The three flows run at different rates for good reason: state is frequent because it drives control, experience is less frequent because it drives learning, and telemetry is slow because nobody needs battery voltage ten times a second. Quality-of-service profiles are configuration rather than code, which is what a lossy radio link to a microcontroller eventually requires.",
        ],
      },
      {
        id: "contract",
        number: "03",
        title: "The interface, declared",
        tone: "soft",
        figure: "capabilities",
        body: [
          "The interface between parts is written down as message, service and action definitions rather than left as whatever the publisher happened to send. Six message types, four services and one long-running action.",
          "Three of those four services exist for a single purpose: moving a model between a trainer and a device. One uploads weights, one fetches the current global model, and one fetches it in chunks. That third call is the whole federated design in miniature — a microcontroller cannot receive a model the way a workstation can, so the contract admits it up front.",
        ],
      },
      {
        id: "algorithms",
        number: "04",
        title: "Q-Learning vs Deep Q-Learning",
        tone: "deep",
        figure: "tradeoff",
        body: [
          "Both training paths are implemented. The tabular trainer discretizes state, explores with an epsilon-greedy schedule, and persists a table small enough to live in the device's own flash. The deep trainer approximates the same values with a network, stabilized by a replay buffer and a target network, trained in PyTorch on a workstation.",
          "They trade compute against generalization, which is precisely what the experiments are meant to measure. A table is fast, cheap and specific to the maze it learned; a network is expensive to train, needs floating-point inference, and stands a chance of transferring to a maze it has never seen.",
          "Which one suits a constrained device better is a question this project has not answered yet. No winner is declared here, and no comparative figure is reported, because the comparison has not been run and recorded.",
        ],
      },
      {
        id: "edge",
        number: "05",
        title: "Getting it onto the device",
        tone: "deep",
        figure: "infrastructure",
        body: [
          "Deploying a policy to a microcontroller is its own problem, and the repository treats it as one rather than as a final step. A model trained in PyTorch is converted to TensorFlow Lite, versioned by a model manager, and fetched by the device — in pieces, through the chunked service, because it cannot hold the transfer in memory otherwise.",
          "The tabular path needs none of that. A Q-table is small enough to write straight to flash, which is the practical half of the comparison: not only which algorithm learns better, but which one can actually be deployed and updated on the hardware in question, and what each update costs in flash wear.",
          "A firmware sketch is committed and a converted model sits in the repository, so the path exists end to end in source. The hardware experiments themselves have not been run.",
        ],
      },
      {
        id: "metrics",
        number: "06",
        title: "What would be measured",
        tone: "paper",
        figure: "metrics",
        body: [
          "The instrumentation is in place and the measures are chosen. Hardware telemetry covers processor load, free memory, battery voltage, inference time and flash write cycles; training telemetry covers loss, episode reward, exploration decay and buffer size; and three maze layouts of increasing difficulty are defined for testing transfer.",
          "These are targets, not findings. They describe what the experiments are designed to capture, and no value for any of them is reported on this page.",
        ],
      },
      {
        id: "synthetic",
        number: "07",
        title: "What the tooling can and cannot prove",
        tone: "sage",
        figure: "proof",
        body: [
          "The analysis tooling is genuinely built: a Q-table visualizer producing heatmaps, coverage maps, per-action panels and policy views; a comparative benchmark tool producing learning curves, resource comparisons and performance tables; and a dashboard showing all of it live. Everything renders at publication resolution.",
          "It also has a mode that generates all of that from synthetic data, alongside a synthetic data generator in the simulation package. That exists for good reasons — you cannot develop a plotting pipeline while waiting on hardware — but it means a finished-looking comparison from this repository is not evidence of anything until it says which data produced it.",
          "That is why no figure from this project appears on this page, and why any that is published later should carry its provenance on its face.",
        ],
      },
      {
        id: "federated",
        number: "08",
        title: "The federated direction",
        tone: "alt",
        figure: "planned",
        body: [
          "The federated work is a direction with a contract, not a completed result. The service definitions for uploading weights and distributing a global model exist; the intended arrangement is several simulated robots alongside one physical one, with local adaptation on each and aggregation at the centre.",
          "The measure that would make it research rather than plumbing is communication efficiency — what the coordination costs relative to what it buys. Nothing below has been run, and every row is marked accordingly.",
        ],
      },
      {
        id: "reproducibility",
        number: "09",
        title: "The environment is the result",
        tone: "soft",
        figure: "gap",
        body: [
          "For a project whose output is meant to be research, the environment is not setup detail — it is part of the finding. A comparison of memory use and inference time means very little if a reader cannot determine which toolchain and which versions produced it.",
          "Two things need settling before any number is published. The setup instructions name two different ROS2 releases in different places, and several of the guides the README links to are not in the repository. Neither is difficult to fix, and both would undermine a published figure if left as they are.",
        ],
      },
      {
        id: "limits",
        number: "10",
        title: "What holds, and what does not",
        tone: "sage",
        figure: "limits",
        body: [
          "The repository is public, so the left column below can be checked rather than trusted: the packages, the nodes, the declared contract, both training paths, the conversion utility and the committed converted model are all there to read.",
          "The right column is the part that keeps this a project rather than a paper. No comparative run has been recorded, no hardware measurement taken, no federated experiment performed, and no maze held out to test transfer. The gap between a system that could produce results and results is exactly the work that remains.",
        ],
      },
      {
        id: "status",
        number: "11",
        title: "Current status",
        tone: "paper",
        figure: "status",
        body: [
          "Phases 1 and 2 are complete: the architecture, both training paths, the simulation, the dashboard and the analysis tooling all exist and run.",
          "Phase 3 — hardware integration, the comparative experiments, the federated work and the analysis that would follow — is ahead. It is listed here as outstanding rather than folded into a summary that would read as finished.",
        ],
      },
    ],

    phases: [
      {
        number: "01",
        label: "Foundation",
        complete: true,
        items: [
          "Project architecture",
          "ROS2 package setup",
          "DQN training node",
          "Dashboard",
          "Simulation environment",
        ],
      },
      {
        number: "02",
        label: "Tabular path & benchmarking",
        complete: true,
        items: [
          "Tabular Q-Learning trainer",
          "Flash persistence strategy",
          "State discretization",
          "Epsilon-greedy exploration",
          "Q-table visualization",
          "DQN vs Q-Learning benchmark tooling",
        ],
      },
      {
        number: "03",
        label: "Hardware & experiments",
        complete: false,
        items: [
          "ESP32 hardware integration",
          "Real-world comparative experiments",
          "Multi-robot federated learning",
          "Generalization analysis",
          "Publication-ready performance analysis",
        ],
      },
    ],

    packages: [
      { name: "micromouse_msgs_package", note: "Shared message types" },
      { name: "training_package", note: "DQN and Q-Learning trainers" },
      { name: "dashboard_package", note: "Streamlit monitoring surface" },
      { name: "robot_package", note: "Robot-side control" },
      { name: "simulation_package", note: "Physics-based environment" },
    ],

    architecture: {
      stack: [
        { id: "robot", label: "Robot / simulation", note: "Publisher" },
        { id: "topics", label: "ROS2 topics", note: "Messaging layer" },
        { id: "training", label: "Training server", note: "PC-side" },
        { id: "model", label: "Model / metrics", note: "Versioned artifacts" },
        { id: "dashboard", label: "Dashboard", note: "Analysis surface" },
      ],
      aside: [
        { id: "replay", label: "Experience replay", note: "Sampling buffer" },
        { id: "models", label: "Model manager", note: "Versioning" },
        { id: "experiments", label: "Experiment manager", note: "Run control" },
      ],
    },

    dataFlows: [
      {
        label: "State",
        carries: "Position and sensor readings",
        topic: "/mouse/state",
        to: "Training server",
      },
      {
        label: "Experience",
        carries: "State, action, reward, next state, done",
        topic: "/mouse/experience",
        to: "Model updates",
      },
      {
        label: "Telemetry",
        carries: "Processor load, free memory, battery",
        topic: "/mouse/telemetry",
        to: "Dashboard",
      },
    ],

    capabilities: {
      groups: [
        {
          title: "Messages",
          items: [
            "State",
            "Action command",
            "Experience",
            "Telemetry",
            "Training metrics",
            "Model version",
          ],
        },
        {
          title: "Services",
          items: [
            "Reset maze",
            "Upload weights",
            "Get global model",
            "Get model chunk",
          ],
        },
        { title: "Actions", items: ["Run episode"] },
        {
          title: "Training nodes",
          items: [
            "Training server — deep",
            "Q-Learning trainer — tabular",
            "Model manager — versioning",
          ],
        },
        {
          title: "Robot & simulation",
          items: [
            "Robot coordinator",
            "Experiment manager",
            "Physics simulator",
            "Synthetic data generator",
          ],
        },
        {
          title: "Dashboard",
          items: ["Metrics bridge", "Streamlit interface"],
        },
      ],
      note: "The interface is declared rather than assumed. Three of the four services exist specifically to move a model between a trainer and a device — upload, fetch, and fetch in chunks.",
    },

    infrastructure: {
      stack: [
        { id: "train", label: "Training server", note: "PyTorch, on a workstation" },
        { id: "model", label: "Trained model", note: "Versioned by the model manager" },
        { id: "convert", label: "Conversion", note: "PyTorch → TensorFlow Lite" },
        { id: "chunk", label: "Chunked transfer", note: "A service call per piece" },
        { id: "device", label: "ESP32", note: "Inference at the edge" },
        { id: "flash", label: "Flash storage", note: "Where the tabular path lives" },
      ],
    },

    tradeoff: {
      left: {
        title: "Q-Learning",
        items: [
          "Tabular method",
          "Lower compute requirements",
          "Suitable for constrained devices",
          "Fast in known, discrete environments",
          "Limited generalization",
          "Persists to device flash",
        ],
      },
      right: {
        title: "Deep Q-Learning",
        items: [
          "Neural-network Q approximation",
          "Replay buffer",
          "Target network",
          "Higher resource requirements",
          "Stronger generalization potential",
          "Trained on a workstation, converted for the edge",
        ],
      },
      words: ["Tabular", "vs", "Neural", "Edge constraints", "Generalization"],
    },

    metrics: [
      {
        title: "Hardware",
        items: [
          "Processor load",
          "Free memory",
          "Battery voltage",
          "Inference time",
          "Flash write cycles",
        ],
      },
      {
        title: "Training",
        items: [
          "Loss",
          "Episode reward",
          "Exploration decay",
          "Replay buffer size",
        ],
      },
      {
        title: "Generalization scenarios",
        items: ["Simple maze", "Complex maze", "Open maze"],
      },
    ],

    /*
     * What the repository demonstrably contains — and, in the last point, the
     * single most important caveat on the whole page. The chain names the
     * stages of one training loop, with no rates, durations or values.
     */
    proof: {
      points: [
        "Both training paths implemented — deep and tabular",
        "A conversion utility, and a converted edge model committed",
        "A physics-based simulator, plus a synthetic data generator",
        "Verification scripts for the system and for the data flow",
        "Publication-resolution plotting for Q-tables and comparisons",
        "The benchmark tool runs on recorded sessions or on synthetic data",
      ],
      chain: [
        "Episode run",
        "Experience published",
        "Replay buffer",
        "Model updated",
        "Metrics recorded",
        "Figure generated",
      ],
      note: "The last point is the one that matters when reading any figure from this project: the benchmark tool can produce a complete, publication-styled comparison from synthetic data. No plot made that way is a result, and no result from either training path is reported here.",
    },

    tooling: [
      {
        title: "Q-table visualization",
        items: [
          "Max Q-value heatmap",
          "Exploration coverage map",
          "Per-action Q-value panels",
          "Greedy policy visualization",
          "Convergence statistics",
        ],
      },
      {
        title: "Benchmark comparison",
        items: [
          "Learning curves",
          "Deep vs tabular comparison",
          "Memory use",
          "Inference time",
          "Model size",
          "Runs on recorded or synthetic data",
        ],
      },
      {
        title: "Dashboard",
        items: [
          "Loss curves",
          "Reward plots",
          "Hardware metrics",
          "Maze heatmaps",
          "Model version tracking",
        ],
      },
    ],

    planned: [
      { label: "Simulated robots", value: "4 · planned", available: false },
      { label: "Physical robot", value: "1 · planned", available: false },
      { label: "Centralized aggregation", value: "Contract only", available: false },
      { label: "Local adaptation / probing", value: "Planned", available: false },
      {
        label: "Communication-efficiency analysis",
        value: "Planned",
        available: false,
      },
    ],

    limits: {
      verified: [
        "The five-package structure and its declared message contract",
        "Both training paths exist and are implemented",
        "Simulation, dashboard and conversion tooling are present",
        "A converted edge model and a firmware sketch are committed",
      ],
      notVerified: [
        "Any comparative result — no benchmark has been run and recorded",
        "Hardware behaviour — the device experiments have not been run",
        "Federated aggregation — the contract exists, the experiment does not",
        "Generalization — the maze scenarios are defined, not executed",
      ],
    },

    nextProof: [
      "A pinned environment",
      "One recorded run",
      "Hardware measurements",
      "A held-out maze",
    ],

    gap: {
      label: "Known gap",
      subject: "A reproducible research environment",
      status:
        "Setup paths name two different ROS2 releases, and several guides the README links are not committed",
      next: "Pin one release, commit the build guide, and record exact versions before publishing any figure",
    },

    status: [
      { label: "Phase 1", value: "Complete", available: true },
      { label: "Phase 2", value: "Complete", available: true },
      { label: "Analysis tooling", value: "Built", available: true },
      { label: "Phase 3", value: "Upcoming", available: false },
      { label: "Hardware validation", value: "Pending", available: false },
      { label: "Federated experiments", value: "Pending", available: false },
      { label: "Reported results", value: "None", available: false },
    ],

    technicalNotes: [
      {
        title: "Core stack",
        items: [
          "Python",
          "ROS2",
          "PyTorch",
          "NumPy",
          "Pandas",
          "Streamlit",
          "TensorFlow Lite",
        ],
      },
      {
        title: "Interface contract",
        items: [
          "Six message types",
          "Four services",
          "One action",
          "QoS profiles in committed YAML",
        ],
      },
      {
        title: "Edge & hardware",
        items: [
          "ESP32",
          "Chunked model transfer",
          "Flash persistence",
          "Firmware sketch committed",
        ],
      },
      {
        title: "Simulation & build",
        items: [
          "Physics-based robot simulator",
          "Synthetic data generator",
          "colcon",
          "Verification scripts",
        ],
      },
      {
        title: "Analysis",
        items: [
          "Q-table visualizer",
          "Benchmark comparison",
          "Recorded-session processor",
          "Publication-resolution output",
        ],
      },
    ],

    media: [],
  },
};


/* -------------------------------------------------------------------------- */
/* FINANCIAL TICK DATA PIPELINE — real, public, collaborative                  */
/* -------------------------------------------------------------------------- */

/*
 * ATTRIBUTION
 * Two contributors. The implementation sentence in the evidence boundary is
 * kept in the first person because it is a claim about what Rafay implemented,
 * but nothing here is expanded into ownership of the whole project:
 * system-level statements say "the pipeline" or "the project", and no split or
 * percentage is stated because none is documented. The repository is owned by
 * Muhammad Umar Nadeem and is public; everything below was read from it.
 *
 * CLAIM DISCIPLINE
 * This handles financial records; it is not a financial product. Nothing below
 * calls it a trading system, an exchange component or a high-frequency
 * anything, and there are no throughput figures, latency numbers, dataset
 * sizes or repository metrics — none of that has been measured or checked. The
 * hero says so outright rather than leaving it to the limits section.
 *
 * CORRECTION
 * An earlier version of this entry named CMake as the build system. The
 * repository has a plain Makefile and its wrapper script checks for `make`;
 * there is no CMake anywhere in it. Corrected throughout.
 */

const TICK_STATEMENT =
  "A four-process Linux pipeline in C++17 that turns tick CSV records into per-symbol summaries through FIFOs, shared memory and a worker pool — and cleans up every resource it creates.";

const tickPipeline: Project = {
  id: "financial-tick-data-pipeline",
  slug: "financial-tick-data-pipeline",
  index: "06",
  name: "Financial Tick Data Pipeline",
  category: "C++ & Operating Systems",
  year: "May 2026",
  description:
    "A compact Linux pipeline coordinating processes, POSIX IPC, worker threads, and aggregation to transform tick CSV records into per-symbol summaries.",
  visual: "topology",
  accent: "#a66f48",

  /* Charcoal, copper and taupe — a systems identity. The copper is a half-step
   * from the portfolio's own brown, so this reads as the most "material" of the
   * six without leaving the family. */
  palette: {
    accent: "#232323", // deep charcoal
    accentDeep: "#171717",
    muted: "#89796c", // muted taupe
    surface: "#f0ece8", // light project background
    surfaceAlt: "#eeeeec", // a cooler neutral, for alternating
    surfaceSoft: "#f7f5f2", // pale neutral
    warm: "#b0784e", // burnished copper
    cream: "#f8f7f4",
  },
  tags: ["C++17", "POSIX IPC", "pthreads", "Make"],

  caseStudy: {
    statement: TICK_STATEMENT,
    wordmark: {
      lead: "Financial Tick",
      tail: "Data Pipeline",
      accent: "tail",
    },
    heroNote: "Public repository · two contributors · nothing benchmarked",
    seoDescription:
      "A C++17 Linux pipeline using fork and exec, FIFOs, POSIX shared memory, named semaphores, a bounded queue and a worker pool to aggregate financial tick records per symbol.",

    meta: [
      { label: "Context", value: "Public academic project · two contributors" },
      {
        label: "Contributors",
        value: "Rafay Khattak & Muhammad Umar Nadeem",
      },
      { label: "Period", value: "May 2026" },
      {
        label: "Shape",
        value: "Four processes and one shared header, in roughly 32 KB of C++",
      },
      {
        label: "Built with",
        value: "A Makefile — C++17, warnings enabled, pthreads linked",
      },
      {
        label: "Status",
        value: "Complete · one commit, and nothing measured",
      },
      {
        label: "Visibility",
        value: "Public repository · every claim here is checkable in source",
      },
    ],

    /* The fourth row is deliberately a negative. On a project whose subject is
       performance primitives, a reader's first assumption is that something was
       benchmarked — saying otherwise belongs in the hero, not a footnote. */
    highlights: [
      { label: "Processes", value: "Four, plus a worker pool" },
      { label: "IPC primitives", value: "FIFO · shared memory · semaphores" },
      { label: "Source", value: "Five files, ~32 KB of C++" },
      { label: "Benchmarks", value: "None — nothing measured" },
    ],

    contributors: ["Rafay Khattak", "Muhammad Umar Nadeem"],
    repositoryUrl: "https://github.com/umrndem/financial-tick-data-pipeline",

    /* The full axis is shown for context; only what the project actually
       touches is activated. */
    disciplines: [
      "Systems Programming",
      "Data",
      "Databases",
      "Product",
      "People",
    ],
    covers: ["Systems Programming", "Data"],

    technologies: ["C++17", "POSIX IPC", "pthreads", "Make", "Linux"],

    technicalSummary:
      "The pipeline is a C++17 project built by a Makefile into four separate executables, targeting Linux and POSIX interprocess communication, compiled with warnings enabled and pthreads linked. It is an academic systems project rather than a financial product: no throughput, latency or dataset-scale figure has been measured, so none is reported.",

    repository: "Public",
    publicArtifacts:
      "Terminal output, a process topology diagram, source excerpts and aggregation results can be added once captured from a real run.",

    evidence: {
      supported:
        "I implemented fork and exec orchestration, FIFO and shared-memory transport, named semaphores, a bounded producer-consumer queue, a worker thread pool, signal handling, resource cleanup and volume-weighted aggregation. The repository is public, so the shared header, the four stage programs and the build are all readable.",
      notOverstated:
        "Nothing has been measured. There is no throughput benchmark, no large-input run, no profiling and no automated test, and the repository carries a single commit — so it shows a finished thing rather than how it was arrived at. No production, trading or high-frequency capability is claimed, and the contribution split between Rafay Khattak and Muhammad Umar Nadeem is not documented, so none is stated.",
    },

    sections: [
      {
        id: "topology",
        number: "01",
        title: "The topology",
        tone: "soft",
        figure: "process-topology",
        body: [
          "The pipeline is four separate programs rather than four functions, and that is the whole point of it. A dispatcher creates the IPC objects and forks the other three. An ingester walks a directory of CSVs and pushes framed chunks into a FIFO. A processor reads them, spreads the parsing across a worker pool, and writes an aggregate into shared memory. A reporter waits on a semaphore, reads that memory once it is signalled, and writes the output.",
          "Splitting the work across processes rather than threads is a deliberate constraint. Threads would share an address space and make most of this disappear; separate processes force every hand-off to cross a real operating-system boundary, which is the thing the project exists to demonstrate.",
          "Each stage is a small program with one job, and the shared header is the only thing all four agree on.",
        ],
      },
      {
        id: "contract",
        number: "02",
        title: "One shared header",
        tone: "sage",
        figure: "capabilities",
        body: [
          "The four programs share exactly one header, and it reads as a design document. It defines how a chunk is framed, what kinds of chunk exist, how the shared-memory region is laid out, and what every exit code means.",
          "Two magic numbers guard the boundaries — one on each chunk header, one on the shared-memory block — so a stage that receives something unexpected can say so rather than parsing garbage confidently. It is a cheap check that turns a silent corruption into a loud failure.",
          "The exit codes are named constants rather than numeric literals, and the signal cases follow the shell convention. That matters because the dispatcher is what reads them: a child that has died has to explain why through the only channel it has left.",
          "Everything in shared memory is fixed-capacity — a bounded table of per-symbol entries rather than a growing one — because a region has to have a size before anybody can map it.",
        ],
      },
      {
        id: "concurrency",
        number: "03",
        title: "Inside the processor",
        tone: "deep",
        figure: "techniques",
        body: [
          "Chunks arriving on the FIFO meet a classic bounded producer-consumer queue. Two counting semaphores track empty and full slots: the reader blocks when the queue is full, and workers block when it is empty.",
          "There are two mutexes, not one. The queue has its own and the aggregation map has its own, so a worker folding a symbol's running totals is not holding the lock the reader needs to enqueue the next chunk. A single global lock would have been simpler and would have serialized precisely the work the thread pool exists to parallelize.",
          "Workers are shut down with a poison pill — a chunk type that means stop — rather than a separate flag somebody has to remember to check. The drain travels the same queue as the data, so there is one shutdown mechanism instead of two that can disagree.",
          "The signal handler does the one thing a signal handler may safely do: set a flag of the correct type and return. Everything else happens back on the main path, where it is allowed to happen.",
        ],
      },
      {
        id: "io",
        number: "04",
        title: "The two functions that matter",
        tone: "soft",
        figure: "proof",
        body: [
          "The shared header carries two small helpers that say more about Unix experience than any amount of architecture: a write loop and a read loop.",
          "Neither assumes the kernel will move everything it was asked to move in one call. Both loop until the byte count is satisfied, and both retry rather than fail when a call is interrupted by a signal. A single write followed by optimism is the most common way a pipeline like this quietly corrupts data on a busy machine, and handling it is the difference between code that works on the sample file and code that works under load.",
          "The reports are produced by duplicating file descriptors rather than by opening a file and printing into it — the human-readable report is standard output, redirected — and each child's output and errors are routed to its own log. It is the same technique a shell uses, applied on purpose.",
        ],
      },
      {
        id: "run",
        number: "05",
        title: "One run, end to end",
        tone: "alt",
        figure: "growth",
        body: [
          "A single wrapper script carries a run from nothing to a report. It checks that a compiler and make are present before it does anything, builds the four executables, launches the dispatcher with whatever arguments it was given, and summarizes what happened.",
          "Worker count and queue size are both command-line options, which is the right shape for a project about concurrency: the two numbers a reader would most want to vary are the two the program asks for.",
          "A sample input file is committed, so the project runs on a clean checkout without anyone having to find data first — a small courtesy that a surprising number of systems projects skip.",
        ],
      },
      {
        id: "failure",
        number: "06",
        title: "When a run does not finish",
        tone: "deep",
        figure: "infrastructure",
        body: [
          "The more interesting path is the one where a run is interrupted. A pipeline that creates a FIFO in the filesystem, a named shared-memory object and a named semaphore has left three things behind that outlive the process, and on Linux they persist until something explicitly removes them.",
          "So the dispatcher cleans up on interruption as well as on success. A signal sets a flag, the stages wind down, every child is reaped with a wait rather than abandoned, and the three named objects are unlinked before exit. No zombies, and nothing left behind for the next run to collide with.",
          "The exit code carries the reason out. Bad arguments, an IPC failure, a child dying, an IO failure and each of the two termination signals all have their own named code, so a script — or a person — can tell what went wrong before opening a log.",
        ],
      },
      {
        id: "aggregation",
        number: "07",
        title: "Aggregation",
        tone: "soft",
        figure: "aggregation",
        body: [
          "The transformation itself is deliberately modest: group by symbol, and carry a handful of numbers per group.",
          "The one worth naming is the volume-weighted average price, which weights each observed price by the volume traded at it rather than treating every tick as equally informative. One share changing hands and ten thousand changing hands are not the same evidence about what something is worth.",
          "Computing it across a process boundary is what makes this a systems exercise rather than an arithmetic one. The shared entry stores the running price-volume sum and the running volume — not the average — because partial averages cannot be merged. The division happens once, at the end, in the process that writes the report.",
        ],
      },
      {
        id: "why",
        number: "08",
        title: "Why it matters",
        tone: "deep",
        figure: "tradeoff",
        body: [
          "The project is small — five files and roughly thirty kilobytes of C++ — and it is the most direct evidence in this portfolio of what I can do below the level of a framework.",
          "Processes, interprocess transport, memory that outlives the code that created it, synchronization primitives, cleanup on the path nobody tests, and an aggregation that has to stay correct across a boundary. None of that is visible in a web application, and all of it decides whether one behaves when it is under pressure.",
        ],
      },
      {
        id: "limits",
        number: "09",
        title: "Known limits",
        tone: "sage",
        figure: "limits",
        body: [
          "The repository is public, so the left column below can be read rather than taken on trust.",
          "The right column is short and unflattering. Nothing has been measured — no throughput, no behaviour on a large input, no profiling. There are no automated tests. And the repository carries a single commit, so its history shows a finished thing rather than how it came to be one.",
          "For a project whose whole subject is systems behaviour, the absence of a single measured number is the honest headline, which is why it also sits in the hero rather than only down here.",
        ],
      },
      {
        id: "status",
        number: "10",
        title: "Current status",
        tone: "paper",
        figure: "status",
        body: [
          "The project is complete as an academic exercise, the repository is public, and it runs on a clean checkout against the committed sample input.",
          "What it does not have is any measurement. The rows below keep that apart from what is genuinely there.",
        ],
      },
    ],

    topology: {
      steps: [
        { id: "dispatcher", label: "Dispatcher", kind: "Process" },
        { id: "ingester", label: "Ingester", kind: "Process" },
        { id: "fifo", label: "FIFO", kind: "IPC" },
        { id: "processor", label: "Processor", kind: "Process" },
        { id: "queue", label: "Bounded queue + workers", kind: "Threads" },
        { id: "shm", label: "Shared memory", kind: "Memory" },
        { id: "reporter", label: "Reporter", kind: "Process" },
        { id: "summary", label: "Per-symbol summary", kind: "Output" },
      ],
      support: [
        { label: "Named semaphores", note: "Access control" },
        { label: "Signals", note: "Shutdown" },
        { label: "Cleanup", note: "Resource release" },
      ],
    },

    primitives: [
      "fork / exec",
      "FIFO",
      "Shared memory",
      "Named semaphores",
      "pthreads",
      "Signals",
      "Resource cleanup",
      "Bounded queue",
    ],

    capabilities: {
      groups: [
        {
          title: "Chunk framing",
          items: [
            "Magic number",
            "Chunk type",
            "Chunk id",
            "Source file id",
            "Byte count",
          ],
        },
        {
          title: "Chunk types",
          items: ["Data", "End of file", "Poison pill"],
        },
        {
          title: "Shared memory layout",
          items: [
            "Magic number",
            "Entry count",
            "Total records",
            "Fixed entry table",
          ],
        },
        {
          title: "Per-symbol entry",
          items: [
            "Symbol",
            "Price-volume sum",
            "High",
            "Low",
            "Total volume",
            "Record count",
          ],
        },
        {
          title: "Named exit codes",
          items: [
            "Bad arguments",
            "IPC failure",
            "Child died",
            "IO failure",
            "Interrupted",
            "Terminated",
          ],
        },
        {
          title: "Command line",
          items: [
            "Input directory",
            "Output directory",
            "Worker count",
            "Queue size",
            "Clean",
            "Help",
          ],
        },
      ],
      note: "One header, shared by four programs. Every structure is fixed-capacity — a shared-memory region has to have a size before anyone can map it.",
    },

    techniques: [
      "Bounded buffer",
      "Counting semaphores",
      "Separate locks",
      "Worker pool",
      "Poison-pill shutdown",
      "Async-signal-safe handler",
    ],

    /*
     * Everything here is a property of the source, readable in a public
     * repository. The chain names the stages a record passes through — no
     * timing, volume or rate appears, because nothing has been measured.
     */
    proof: {
      points: [
        "Write and read loops that handle short transfers",
        "Both retry on interruption rather than failing",
        "Magic numbers validated at the chunk and shared-memory boundaries",
        "Reports written through file-descriptor redirection",
        "Each child's output and errors routed to its own log",
        "Log lines carry component, process id and parent process id",
      ],
      chain: [
        "Chunk framed",
        "Written in full",
        "Read in full",
        "Magic checked",
        "Parsed",
        "Aggregated",
      ],
      note: "The chain names the stages a record passes through, read from the source. No timing, volume or throughput figure appears anywhere on this page, because none has been measured.",
    },

    growth: [
      {
        number: "01",
        label: "Preflight",
        note: "The wrapper checks that a compiler and make are present before building anything.",
      },
      {
        number: "02",
        label: "Build",
        note: "One Makefile produces four separate executables.",
      },
      {
        number: "03",
        label: "Dispatch",
        note: "The dispatcher creates the FIFO, the shared-memory object and the semaphore, then forks and execs the three stages.",
      },
      {
        number: "04",
        label: "Ingest",
        note: "The ingester walks the input directory and sends framed chunks into the FIFO.",
      },
      {
        number: "05",
        label: "Process",
        note: "Workers drain the bounded queue, parse rows and fold them into per-symbol totals.",
      },
      {
        number: "06",
        label: "Publish",
        note: "The aggregate is written into shared memory and the reporter is signalled.",
      },
      {
        number: "07",
        label: "Report",
        note: "A human-readable report and a machine-readable summary are written out.",
      },
    ],

    /* The teardown path, which is the one that distinguishes this project. */
    infrastructure: {
      stack: [
        { id: "signal", label: "Signal received", note: "Interrupt or terminate" },
        { id: "flag", label: "Flag set", note: "All the handler does" },
        { id: "drain", label: "Stages wound down", note: "Poison pill through the queue" },
        { id: "reap", label: "Children reaped", note: "Waited on, never abandoned" },
        { id: "unlink", label: "IPC objects unlinked", note: "FIFO, memory, semaphore" },
        { id: "exit", label: "Named exit code", note: "The reason, carried out" },
      ],
    },

    /* Words only — this section has no two-sided argument to set in columns. */
    tradeoff: {
      words: [
        "Processes",
        "Threads",
        "Memory",
        "IPC",
        "Synchronization",
      ],
    },

    aggregation: {
      source: "Tick records — symbol, price, volume",
      groupBy: "Group by symbol",
      measures: [
        "Record count",
        "Total volume",
        "High",
        "Low",
        "Price-volume sum",
      ],
      output: "Per-symbol summary, as text and as CSV",
      note: {
        title: "VWAP",
        body: "Volume-weighted average price weights each observed price by its associated volume rather than treating every tick equally. The shared structure carries the running price-volume sum rather than the average, because partial averages cannot be merged — the division happens once, at the end, in the process that writes the report.",
        formula: "VWAP = Σ(price × volume) / Σ(volume)",
      },
    },

    limits: {
      verified: [
        "The four-process topology and its interprocess transport",
        "The bounded queue, its semaphores and the worker pool",
        "Short-transfer and interruption handling in the shared IO helpers",
        "Per-symbol aggregation and both output formats",
      ],
      notVerified: [
        "Throughput — nothing has been benchmarked",
        "Behaviour on a large input",
        "Automated tests — there are none",
        "Reliability under sustained load",
      ],
    },

    nextProof: [
      "A controlled dataset",
      "A throughput measurement",
      "A resource measurement",
      "Documented results",
    ],

    status: [
      { label: "Public repository", value: "Available", available: true },
      { label: "Source", value: "Five files, readable", available: true },
      { label: "Sample input", value: "Committed", available: true },
      {
        label: "Build",
        value: "One Makefile, four executables",
        available: true,
      },
      { label: "Reproducible run", value: "Wrapper script", available: true },
      { label: "Automated tests", value: "None", available: false },
      { label: "Benchmark", value: "None measured", available: false },
    ],

    technicalNotes: [
      {
        title: "Core stack",
        items: ["C++17", "POSIX IPC", "pthreads", "Make", "Linux"],
      },
      {
        title: "Processes & IPC",
        items: [
          "fork / exec",
          "FIFO",
          "POSIX shared memory",
          "Named semaphores",
          "Signal handling",
          "waitpid reaping",
        ],
      },
      {
        title: "Concurrency",
        items: [
          "Worker thread pool",
          "Bounded queue",
          "Counting semaphores",
          "Separate queue and aggregate locks",
        ],
      },
      {
        title: "IO discipline",
        items: [
          "Short-transfer loops",
          "Interruption retry",
          "Magic-number validation",
          "Descriptor redirection",
        ],
      },
      {
        title: "Data processing",
        items: [
          "Per-symbol aggregation",
          "Record count",
          "Total volume",
          "High and low",
          "VWAP",
        ],
      },
    ],

    media: [],
  },
};


/*
 * Order is the Work sequence, and it is also the numbering: 01 WLE Website,
 * 02 Internal Management System, 03 RideFlow, 04 DataPulse,
 * 05 Distributed AI Micromouse, 06 Financial Tick Data Pipeline.
 *
 * Every entry is now a real project. The invented placeholders that once held
 * the empty slots are gone rather than sitting at the end of a sequence of real
 * work, where they would read as five projects of which one happens to be
 * fictional.
 */
export const projects: Project[] = [
  wleWebsite,
  internalManagementSystem,
  rideflow,
  datapulse,
  micromouse,
  tickPipeline,
];

/* -------------------------------------------------------------------------- */
/* Lookups                                                                     */
/* -------------------------------------------------------------------------- */

export const caseStudyProjects = projects.filter((p) => p.caseStudy);

export const getProject = (slug: string) =>
  projects.find((project) => project.slug === slug);

/**
 * The next project in the sequence, or undefined at the end of it.
 *
 * Deliberately does not wrap. Looping the last project back to the first
 * presents the work as a carousel with no end, which reads as more projects
 * than there are; the case study shows an end-of-sequence note instead.
 */
export const getNextProject = (slug: string) => {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) return undefined;
  return projects[index + 1];
};

/* -------------------------------------------------------------------------- */
/* Theming                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Turns a project palette into CSS variables for a scoped container.
 *
 * Components read these as `var(--p-accent, var(--color-accent))`, so a project
 * without a palette silently uses the portfolio's own tokens and nothing
 * outside the themed container is affected.
 */
export const paletteVars = (palette?: ProjectPalette) =>
  palette
    ? ({
        "--p-accent": palette.accent,
        "--p-accent-deep": palette.accentDeep,
        "--p-muted": palette.muted,
        "--p-surface": palette.surface,
        "--p-surface-soft": palette.surfaceSoft ?? palette.surface,
        "--p-surface-alt": palette.surfaceAlt ?? palette.surface,
        "--p-warm": palette.warm,
        "--p-cream": palette.cream,
      } as CSSProperties)
    : undefined;

/** Background treatments a case-study section can take. */
export type SectionTone =
  | "paper"
  | "surface"
  | "sage"
  | "soft"
  | "alt"
  | "deep";
