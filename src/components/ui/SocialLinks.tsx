"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { socials, type SocialIcon } from "@/data/portfolio";
import { heroSocialGroup, heroSocialItem } from "@/lib/animations";

const ICONS: Record<SocialIcon, LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
};

type Props = {
  /** `stack` is the vertical hero rail; `row` is used in the footer. */
  layout?: "stack" | "row";
  night?: boolean;
  /** Stagger in as part of the hero load sequence. */
  animated?: boolean;
  className?: string;
};

/**
 * Pills invert on hover — white → black, with the label sliding open on the
 * vertical rail so the resting state stays as quiet as an icon row.
 */
export function SocialLinks({
  layout = "stack",
  night = false,
  animated = false,
  className = "",
}: Props) {
  const Wrapper = animated ? motion.ul : "ul";
  const Item = animated ? motion.li : "li";

  const wrapperProps = animated
    ? {
        variants: heroSocialGroup,
        initial: "hidden" as const,
        animate: "show" as const,
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={[
        "flex",
        layout === "stack" ? "flex-col items-end gap-2" : "flex-row flex-wrap gap-2",
        className,
      ].join(" ")}
    >
      {socials.map((social) => {
        const Icon = ICONS[social.icon];
        /*
         * Leaves the site, so it opens in its own tab and drops the opener
         * reference. Derived from the href rather than stored as a flag: a
         * placeholder that later becomes a real URL should not also need
         * somebody to remember a second field. `mailto:` hands off to a mail
         * client and stays in place.
         */
        const external = social.href.startsWith("http");

        return (
          <Item key={social.label} variants={animated ? heroSocialItem : undefined}>
            <a
              href={social.href}
              aria-label={social.label}
              data-cursor="arrow"
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className={[
                "group flex items-center gap-2 rounded-full border px-3 py-2 transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                night
                  ? "border-[var(--color-night-line)] bg-white/[0.04] text-[var(--color-night-ink)] hover:border-[var(--color-night-ink)] hover:bg-[var(--color-night-ink)] hover:text-[var(--color-night)]"
                  : "border-[var(--color-line)] bg-[var(--color-white)]/70 text-[var(--color-ink)] hover:border-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-canvas)]",
              ].join(" ")}
            >
              <Icon
                className="h-[15px] w-[15px] shrink-0"
                strokeWidth={1.6}
                aria-hidden="true"
              />
              <span
                className={[
                  "overflow-hidden text-[0.75rem] font-medium tracking-[0.02em] whitespace-nowrap",
                  layout === "stack"
                    ? // Collapsed at rest, opens on hover/focus. max-width is the
                      // only non-transform property animated here and it is
                      // confined to a small pill, so the layout cost is trivial.
                      "max-w-0 opacity-0 transition-[max-width,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-w-[7rem] group-hover:opacity-100 group-focus-visible:max-w-[7rem] group-focus-visible:opacity-100"
                    : "",
                ].join(" ")}
              >
                {social.label}
              </span>
            </a>
          </Item>
        );
      })}
    </Wrapper>
  );
}
