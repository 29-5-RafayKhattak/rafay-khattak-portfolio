import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { getSettings, getSocials } from "@/lib/cms/queries";
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
 * `metadataBase` still comes from one value — `site.url` in Settings. While
 * that is empty it stays undefined and Next emits relative URLs, which is the
 * behaviour the site has today. A domain that is not serving the site would be
 * worse than none: crawlers and link previews follow absolute URLs.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { person, site } = await getSettings();

  return {
    metadataBase: site.url ? new URL(site.url) : undefined,
    title: {
      default: `${person.fullName} — ${person.titleShort}`,
      template: `%s — ${person.fullName}`,
    },
    description: site.description,
    authors: [{ name: person.fullName }],
    openGraph: {
      title: `${person.fullName} — ${person.titleShort}`,
      description: site.description,
      type: "website",
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
  const [settings, socials] = await Promise.all([getSettings(), getSocials()]);

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
            />
            <div className="shell">{children}</div>
          </SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  );
}
