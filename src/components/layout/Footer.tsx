"use client";

import { usePathname, useRouter } from "next/navigation";

import { navigation, person, site } from "@/data/portfolio";
import { anchorOffset } from "@/lib/navigation";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { useSmoothScroll } from "@/components/layout/SmoothScroll";

/**
 * Closes the page on the same two words it opened with — outlined above,
 * solid below — so the last thing seen is the first thing seen.
 */
export function Footer() {
  const { scrollTo } = useSmoothScroll();
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";
  /*
   * Every page here is statically prerendered, so the HTML carries the year
   * the BUILD ran in while the client renders the year the visitor is in. Those
   * agree until a deployment outlives a New Year, at which point hydration
   * finds a text mismatch and React logs an error in production.
   *
   * The value is intentionally time-dependent, which is exactly what
   * `suppressHydrationWarning` is for. A redeploy refreshes the prerendered
   * year; nothing else about the footer depends on it.
   */
  const year = new Date().getFullYear();

  return (
    <footer
      data-tone="night"
      className="on-night relative z-0 bg-[var(--color-night)]"
    >
      <div className="gutter pb-[clamp(1.75rem,4vh,2.75rem)]">
        <div
          className="mb-[clamp(2rem,5vh,3.5rem)] h-px w-full bg-[var(--color-night-line)]"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      // Same link, different job depending on where we are.
                      if (!onHome) {
                        router.push(`/${item.href}`);
                        return;
                      }
                      scrollTo(item.href, anchorOffset(item.href));
                    }}
                    className="group relative inline-block py-1 text-[0.9375rem] text-[var(--color-night-muted)] transition-colors duration-300 hover:text-[var(--color-night-ink)]"
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[var(--color-night-ink)] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <SocialLinks layout="row" night />
        </div>

        {/* The sign-off ------------------------------------------------- */}
        <div className="mt-[clamp(2.5rem,7vh,5rem)]">
          <p className="name-line name-outline-night text-center leading-[0.82]">
            {person.firstName}
          </p>
          <p className="name-line name-solid-night text-center leading-[0.82]">
            {person.lastName}
          </p>
        </div>

        <div className="mt-[clamp(2rem,5vh,3.5rem)] flex flex-col gap-2 text-[0.8125rem] text-[var(--color-night-muted)] sm:flex-row sm:items-center sm:justify-between">
          <p>{site.builtBy}</p>
          <p>
            © <span suppressHydrationWarning>{year}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
