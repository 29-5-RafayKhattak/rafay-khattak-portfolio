import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { person, site } from "@/data/portfolio";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Navbar } from "@/components/layout/Navbar";
import { Cursor } from "@/components/ui/Cursor";

import "./globals.css";

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
 * Every absolute URL the document emits — Open Graph, canonicals — resolves
 * against this one value, which comes from `site.url` in data/portfolio.ts.
 *
 * While that is null this stays undefined, which is exactly the behaviour the
 * site has today: Next emits relative URLs and warns about nothing. The moment
 * the real origin is filled in, every route starts emitting correct absolute
 * URLs without a second change.
 */
const metadataBase = site.url ? new URL(site.url) : undefined;

export const metadata: Metadata = {
  metadataBase,
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

export const viewport: Viewport = {
  themeColor: "#edece9",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
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
            <Navbar />
            <div className="shell">{children}</div>
          </SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  );
}
