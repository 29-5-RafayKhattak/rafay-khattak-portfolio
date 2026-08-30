import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { getContact, getSettings, getSocials } from "@/lib/cms/queries";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Cursor } from "@/components/ui/Cursor";

import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});


/*
 * Metadata is resolved per request from the CMS, so changing the name, the
 * strapline or the production origin in the admin reaches the document head
 * without a redeploy.
 *
 * ONE ORIGIN, RESOLVED ONCE
 * `metadataBase` is the only place a domain is read, and every URL below is
 * written relative to it — "/" here, "/work/<slug>" on a case study. Next
 * resolves them against the base when it renders the head, so the domain
 * appears in exactly one expression in the codebase and moving the site is a
 * single edit in `src/data/portfolio.ts`.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { person, site } = await getSettings();

  const title = `${person.fullName} — ${person.titleShort}`;

  return {
    metadataBase: site.url ? new URL(site.url) : undefined,
    title: {
      default: title,
      template: `%s — ${person.fullName}`,
    },
    description: site.description,
    authors: [{ name: person.fullName }],
    // Relative, and deliberately so: resolved against metadataBase above.
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description: site.description,
      type: "website",
      url: "/",
      siteName: person.fullName,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: site.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#edece9",
  colorScheme: "light",
  /*
   * The shell runs edge to edge below 640px, so on a notched phone the
   * default (`auto`) leaves the page inset inside letterbox bars — the dark
   * rooms stop short of the screen edge and read as a panel rather than a
   * full-bleed surface. `cover` paints to the physical edges; every element
   * that actually sits on one takes its clearance back from --safe-top /
   * --safe-bottom in globals.css, which are 0px on any device without insets.
   */
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [settings, socials, contact] = await Promise.all([
    getSettings(),
    getSocials(),
    getContact(),
  ]);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <MotionProvider>
          <SmoothScroll>
            <Cursor />
            {/*
              Navigation lives outside .shell so the shell's `overflow: clip`
              can never interfere with a fixed element. It mirrors the shell's
              width so the two stay optically aligned.
            */}
            <Navbar
              navigation={settings.navigation}
              person={settings.person}
              socials={socials}
              tagline={contact.subline}
            />
            <div className="shell">{children}</div>
          </SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  );
}
