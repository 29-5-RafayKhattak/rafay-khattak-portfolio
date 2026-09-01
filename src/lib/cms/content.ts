/**
 * Presentation contracts for the two globals whose shape is not already
 * declared in `src/data`. Everything else reuses the types that were the
 * contract before the CMS existed — the components were written against those,
 * and the whole point of the mapping layer is that they still are.
 */

export type About = {
  statement: { text: string; accent: boolean }[];
  paragraph: string;
};

export type Contact = {
  email: string;
  /** May be empty — the contact block renders it only when there is one. */
  phone: string;
  headline: string[];
  subline: string;
  sublineAccent: string;
  cta: string;
};

/** The resolved settings shape, as the presentation layer sees it. */
export type SiteSettings = {
  person: {
    firstName: string;
    lastName: string;
    fullName: string;
    title: string;
    titleShort: string;
    intro: string;
    availability: string;
    location: string;
  };
  portrait: {
    cutout: string;
    original: string;
    alt: string;
    cutoutWidth: number;
    cutoutHeight: number;
  };
  site: { description: string; builtBy: string; url: string | null };
  sectionLabels: Record<
    "about" | "stats" | "work" | "experience" | "education" | "technologies" | "contact",
    string
  >;
  horizontalWords: string[];
  navigation: { label: string; href: string }[];
};
