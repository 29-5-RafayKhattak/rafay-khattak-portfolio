import { SITE_ORIGIN } from "@/lib/site-origin";

/**
 * -----------------------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH FOR ALL PORTFOLIO CONTENT
 * -----------------------------------------------------------------------------
 * Every component reads from this file. No copy is hardcoded in the UI layer,
 * so content can be replaced here without touching a single component.
 *
 * CONFIRMED  — verified information supplied by Rafay Khattak.
 * PLACEHOLDER — temporary invented content, awaiting real data.
 * -----------------------------------------------------------------------------
 */

/* ========================================================================== */
/* IDENTITY — CONFIRMED                                                        */
/* ========================================================================== */

export const person = {
  /** Always rendered in these exact two tokens. Never re-cased or abbreviated. */
  firstName: "RAFAY",
  lastName: "KHATTAK",
  fullName: "RAFAY KHATTAK",
  title: "AI ENGINEER · SOFTWARE DEVELOPER",
  /** Short-form title used where the interpunct is too wide (mobile, footer). */
  titleShort: "AI Engineer & Software Developer",
  intro:
    "I build intelligent digital products, AI-powered systems and modern software experiences.",
  availability: "Open for New Projects",
  /* Confirmed indirectly and safely: FAST-NUCES is a Pakistani university
     and the client operates in Pakistan's onshore fields. Kept at country
     level — no city has been stated. */
  location: "Pakistan",
} as const;

export const portrait = {
  /** Transparent cutout — used in the hero so typography can sit behind it. */
  cutout: "/images/rafay-portrait-cutout.png",
  /** The original supplied portrait, unmodified. */
  original: "/images/rafay-portrait.png",
  alt: "Portrait of Rafay Khattak",
  cutoutWidth: 985,
  cutoutHeight: 1038,
} as const;

/* ========================================================================== */
/* CONTACT — email confirmed by Rafay                                          */
/* ========================================================================== */

export const contact = {
  email: "rafeh.ktk@gmail.com",
  headline: ["LET'S BUILD", "SOMETHING", "INTELLIGENT."],
  subline: "Have a project, idea or opportunity?",
  sublineAccent: "Let's talk.",
  cta: "Start a Conversation",
} as const;

/* ========================================================================== */
/* NAVIGATION                                                                  */
/* ========================================================================== */

export type NavItem = { label: string; href: string };

export const navigation: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Contact", href: "#contact" },
];

/* ========================================================================== */
/* SOCIAL LINKS — all confirmed by Rafay                                       */
/* ========================================================================== */

export type SocialIcon = "github" | "linkedin" | "mail";

export type SocialLink = {
  label: string;
  href: string;
  icon: SocialIcon;
};

export const socials: SocialLink[] = [
  /*
   * The profile URL, not github.com/repos — that path is only reachable while
   * signed in and redirects everyone else to a GitHub login page, so it looks
   * like a working link to its owner and to nobody else.
   */
  { label: "GitHub", href: "https://github.com/29-5-RafayKhattak", icon: "github" },
  {
    label: "LinkedIn",
    // Stored without the trailing slash, which is the form LinkedIn's own
    // redirect canonicalises to.
    href: "https://www.linkedin.com/in/muhammad-rafay-mir-khattak-a709ab277",
    icon: "linkedin",
  },
  { label: "Email", href: "mailto:rafeh.ktk@gmail.com", icon: "mail" },
];

/* ========================================================================== */
/* ABOUT — statement is CONFIRMED direction, paragraph written from confirmed  */
/* facts: the degree, the two pieces of professional work, the project range.  */
/* ========================================================================== */

export const about = {
  /** Rendered one line at a time as the section scrolls. */
  statement: [
    { text: "I BUILD", accent: false },
    { text: "INTELLIGENT", accent: true },
    { text: "DIGITAL", accent: false },
    { text: "SYSTEMS.", accent: false },
  ],
  /*
   * Written from confirmed facts only: the degree and its progress, the two
   * pieces of professional work, and the range the six case studies actually
   * cover. No years-of-experience figure, no project count and no claim about
   * anything running in production — none of that has been established.
   *
   * The client is described rather than named. The case studies name Well
   * Logging Energy where that is the subject; here it would read as a
   * credential being cashed rather than work being described.
   */
  paragraph:
    "I'm four semesters into a Data Science degree at FAST-NUCES, building software professionally alongside it — a public site and self-hosted CMS, and an internal operations system a wireline company runs its reporting, crews and compliance on. Beyond that: relational systems, analytics and forecasting, edge-AI research, and systems programming. What carries across is a preference for boundaries written down rather than assumed.",
  label: "About",
} as const;

/* ========================================================================== */
/* STATISTICS — every figure verified against source                           */
/*                                                                             */
/* The previous set was invented, and one line of it was contradicted by this  */
/* site's own case studies: it claimed eight AI systems running in production, */
/* where the research project reports no results at all and the forecasting    */
/* one is explicitly unevaluated. It also claimed 24 projects against six, and */
/* fifteen technologies against a confirmed five.                              */
/*                                                                             */
/* Each figure below was counted from the thing it describes, and the last one */
/* is the point of the section: a number here can be checked.                  */
/* ========================================================================== */

export type Stat = {
  value: string;
  label: string;
  caption: string;
};

export const stats: Stat[] = [
  {
    value: "06",
    label: "Case Studies",
    caption: "Each written up in full, including what it has not proven.",
  },
  {
    value: "02",
    label: "Professional Systems",
    caption: "Built for a wireline company. One runs its daily operations.",
  },
  {
    value: "04",
    label: "Semesters Completed",
    caption: "Toward a Data Science degree at FAST-NUCES.",
  },
  {
    value: "33",
    label: "Committed Tests",
    caption: "Domain, permission and workflow files on the internal system.",
  },
  {
    value: "04",
    label: "Public Repositories",
    caption: "Four of the six open to read, so the claims can be checked.",
  },
];

/* ========================================================================== */
/* PROJECTS                                                                    */
/* Moved to data/projects.ts, which also carries the case-study content. Re-   */
/* exported here so `@/data/portfolio` stays a single import for consumers.    */
/* ========================================================================== */

export type {
  Project,
  ProjectVisualVariant,
  CaseStudy,
  CaseStudySection,
} from "@/data/projects";
export {
  projects,
  caseStudyProjects,
  getProject,
  getNextProject,
} from "@/data/projects";

/* ========================================================================== */
/* HORIZONTAL STATEMENT — the words that travel sideways as you scroll         */
/* ========================================================================== */

export const horizontalWords = [
  "AI",
  "SOFTWARE",
  "AUTOMATION",
  "DATA",
  "SYSTEMS",
] as const;

/* ========================================================================== */
/* EXPERIENCE — CONFIRMED                                                      */
/*                                                                             */
/* Roles, employers, dates, employment type, locations and logos are Rafay's    */
/* own. Summaries are marked individually: those from Rafay's own account of    */
/* the work, and those still DRAFT — written only from the job title, the       */
/* employer's field and the listed skills, containing no projects,              */
/* technologies, metrics or outcomes, because those are not mine to assert.     */
/*                                                                             */
/* `skills` follows the same rule. Junior Coderz's tags are Rafay's own, from   */
/* his profile. The rest are derived from the job title and what he has said    */
/* about the work — they name the shape of the role, NOT a tech stack, because  */
/* the stack has not been shared. Replacing them with real tools would make     */
/* this section considerably more useful.                                       */
/* ========================================================================== */

export type Experience = {
  /** Start year, set as oversized type in the left column. */
  year: string;
  /** Month range beneath the year — the year itself is not repeated. */
  period: string;
  role: string;
  company: string;
  /** Full-time · Part-time · Internship. */
  type: string;
  /** Employer mark, supplied by Rafay. Square, transparent background. */
  logo?: string;
  /** Omitted where it was not stated. */
  location?: string;
  /** DRAFT — describes the shape of the role only. Rafay to confirm. */
  summary?: string;
  skills?: string[];
};

/** Most recent first. The first two run concurrently. */
export const experience: Experience[] = [
  {
    year: "2026",
    period: "AUG — PRESENT",
    role: "Software Engineer",
    company: "Well Logging Energy Technology (Pvt.) Ltd",
    logo: "/images/companies/well-logging-energy-technology.png",
    type: "Full-time",
    location: "South Asia · Remote",
    // Rafay's own wording, verbatim (article corrected: "a Oil" -> "an Oil").
    summary:
      "Building software and internal systems for an Oil and Gas service provider company — taking its operations digital, and continuing to.",
    // Stack confirmed by Rafay; the trailing three restate what he said the
    // work involves, not claims of my own.
    skills: [
      "Python", "FastAPI", "PostgreSQL", "Next.js", "Docker",
      "Software Engineering",
      "Internal Systems",
      "Digital Transformation",
    ],
  },
  {
    year: "2026",
    period: "MAR — PRESENT",
    role: "Data Scientist",
    company: "Syzo",
    logo: "/images/companies/syzo.png",
    type: "Part-time",
    location: "Pakistan · Remote",
    summary:
      "Part-time data science — exploration, modelling, and the analysis work that turns raw data into something decisions can rest on.",
    /*
     * Scoped to the discipline. Next.js was dropped — Rafay named one stack
     * for both roles, but a front-end framework says nothing about data work.
     * Python, FastAPI, PostgreSQL and Docker all carry over: the language, the
     * way a model gets served, the store it reads from, and the environment it
     * runs in. The last three name the discipline itself; "Machine Learning"
     * follows from Rafay's own stated direction as an AI engineer rather than
     * from anything he has said about this role specifically.
     */
    skills: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "Docker",
      "Machine Learning",
      "Statistical Modelling",
      "Data Analysis",
    ],
  },
  {
    year: "2025",
    period: "JUL — MAR 2026",
    role: "STEM Trainer",
    company: "Junior Coderz",
    logo: "/images/companies/junior-coderz.png",
    type: "Part-time",
    summary:
      "Teaching programming to young learners: Python from first principles, and the patience to explain it well.",
    // First two are Rafay's own, from his profile; the rest follow from the
    // job title at a children's coding school.
    skills: ["Python", "Communication", "Teaching", "STEM Education", "Mentoring"],
  },
  {
    year: "2023",
    period: "JUNE",
    role: "Python Intern",
    company: "COMSATS University Islamabad",
    logo: "/images/companies/comsats-university-islamabad.png",
    type: "Internship",
    location: "Islamabad, Pakistan · On-site",
    summary:
      "A first month inside a working engineering environment, spent putting Python fundamentals to practical use.",
    // The role title names the language; the second is what a one-month
    // intern position implies. Nothing beyond that is claimed.
    skills: ["Python", "Programming Fundamentals"],
  },
];

/* ========================================================================== */
/* EDUCATION — CONFIRMED                                                       */
/*                                                                             */
/* Everything here was supplied by Rafay. Nothing is inferred, and the gaps    */
/* are deliberate: there is no GPA, no start or graduation year, no school or  */
/* college name for the A and O Level stages, no subject list, no                */
/* specialisation and no total number of semesters in the degree. Each of      */
/* those was withheld rather than estimated, and the components are built so   */
/* that none of them is needed — the semester track shows what is completed    */
/* and stops, because implying a remaining count would require a total nobody  */
/* has stated.                                                                 */
/*                                                                             */
/* The institution name is written out in full exactly once and abbreviated    */
/* as FAST-NUCES. It is NOT the National University of Sciences and Technology */
/* (NUST), which is a different institution.                                   */
/* ========================================================================== */

export type EducationStage = {
  id: string;
  /** Two-digit index, matching the numbering used across the site. */
  number: string;
  /** Small uppercase qualifier set beside the index. */
  tag: string;
  qualification: string;
  institution?: string;
  institutionShort?: string;
  /**
   * The oversized typographic element for this stage, where the qualification
   * itself is what should be set large. Only the degree uses it — the two
   * school stages are carried by their results instead, so the three stages
   * read as three compositions rather than one layout repeated.
   */
  display?: { lead: string; outline: string; solid: string };
  status?: string;
  progress?: string;
  /**
   * Semesters finished. There is deliberately no total: the length of the
   * degree has not been stated, and a progress figure would have to invent it.
   */
  semestersCompleted?: number;
  /** Individual grades, revealed in order. */
  grades?: string[];
  /** Aggregate grades, where naming each one would be noise rather than detail. */
  gradeTally?: { aStars: number; aGrades: number };
  achievement?: string;
  description: string;
};

export const education: EducationStage[] = [
  {
    id: "fast-data-science",
    number: "01",
    tag: "Current",
    qualification: "Bachelor's in Data Science",
    institution: "National University of Computer and Emerging Sciences",
    institutionShort: "FAST-NUCES",
    display: { lead: "Bachelor's in", outline: "Data", solid: "Science" },
    status: "Currently pursuing",
    progress: "4 semesters completed",
    semestersCompleted: 4,
    description:
      "Building foundations across data, programming, mathematics, statistics, databases, and intelligent systems.",
  },
  {
    id: "a-levels",
    number: "02",
    tag: "Computing-focused studies",
    qualification: "A Levels",
    grades: ["A*", "A*", "A"],
    description: "Advanced study with a computing-focused academic direction.",
  },
  {
    id: "o-levels",
    number: "03",
    tag: "Sciences",
    qualification: "O Levels",
    gradeTally: { aStars: 8, aGrades: 1 },
    achievement: "National Distinction",
    description:
      "A strong science foundation completed with 8 A* grades, 1 A, and a National Distinction.",
  },
];

/** The section's opening statement, split so each line can arrive on its own. */
export const educationIntro = {
  statement: ["From strong foundations", "to data-driven systems."],
  lede: "My academic path moved from a strong science foundation into computing and now into data science.",
} as const;

/* ========================================================================== */
/* TECHNOLOGIES — CONFIRMED                                                    */
/* The stack Rafay named. The previous list was invented and has been removed  */
/* rather than merged — add back anything real that is missing.                */
/* ========================================================================== */

export const technologies: string[] = [
  "Python",
  "FastAPI",
  "PostgreSQL",
  "Next.js",
  "Docker",
];

/* ========================================================================== */
/* SECTION LABELS                                                              */
/* ========================================================================== */

export const sectionLabels = {
  about: "About",
  stats: "By the numbers",
  work: "Selected Work",
  experience: "Experience",
  education: "Education",
  technologies: "Toolkit",
  contact: "Contact",
} as const;

/* ========================================================================== */
/* SITE META                                                                   */
/* ========================================================================== */

type Site = {
  name: string;
  description: string;
  builtBy: string;
  /**
   * Production origin — the ONE value the whole site derives absolute URLs
   * from. Origin only: scheme and host, no trailing slash and no path.
   *
   * `metadataBase`, every canonical, every Open Graph and Twitter URL, the
   * sitemap entries and the robots sitemap reference all resolve against this.
   * Nothing else anywhere names the domain, so moving the site is this line.
   *
   * It stays typed as nullable because the CMS may still return an empty
   * value, and the mapping layer treats the value here as the default rather
   * than as a fallback of last resort — see getSettings(). A wrong absolute
   * URL is worse than none: search engines and link previews follow it.
   */
  url: string | null;
};

export const site: Site = {
  name: person.fullName,
  /*
   * The search description, which is a different job from the hero sentence it
   * used to reuse. `person.intro` says what he builds; a result in a search
   * page also has to say who he is and what this page is, because it is read
   * with no surrounding context. Written once, plainly, and deliberately not
   * padded with the discipline names — those are carried by `knowsAbout` in
   * the structured data, where they belong.
   */
  description:
    "Rafay Khattak is an AI engineer and software developer working across intelligent systems, data science and full-stack products. Selected work and case studies.",
  builtBy: "Designed & Built by Rafay Khattak",
  url: SITE_ORIGIN,
};
