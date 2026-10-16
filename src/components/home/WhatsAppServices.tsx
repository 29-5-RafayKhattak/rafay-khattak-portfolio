import Link from "next/link";
import { ArrowUpRight, Database, MessageCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { whatsappProject, whatsappServices as content } from "@/data/whatsapp";

export function WhatsAppServices({ email }: { email: string }) {
  const enquiryHref = `mailto:${email}?subject=${encodeURIComponent("WhatsApp chatbot for my business")}&body=${encodeURIComponent(content.enquiry)}`;

  return (
    <section id="services" aria-labelledby="services-title" data-tone="paper" className="relative z-0 scroll-mt-28 bg-[var(--color-cream)]">
      <div className="gutter py-[clamp(4rem,10vw,8rem)]">
        <SectionLabel>{content.label}</SectionLabel>
        <div className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div>
            <h2 id="services-title" className="max-w-[18ch] text-[length:var(--step-h2)] font-medium leading-[1.05] tracking-[-0.045em]">
              {content.headline}
            </h2>
            <p className="mt-6 max-w-[48ch] text-[length:var(--step-lead)] leading-relaxed text-[var(--color-muted)]">
              {content.intro}
            </p>
            <div className="mt-8">
              <Button href={enquiryHref} arrow>{content.cta}</Button>
              <p className="mt-4 max-w-[45ch] text-sm leading-relaxed text-[var(--color-muted)]">{content.nextStep}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-[#183d32] p-6 text-[#f0f3ed] sm:p-9">
            <p className="eyebrow text-[#c1d4c7]">How it connects</p>
            <ol className="mt-7 space-y-5">
              {[
                { icon: MessageCircle, title: "Your customer asks", note: "A question, order or service request" },
                { icon: Database, title: "Your business data connects", note: "Software, spreadsheets or business information" },
                { icon: Send, title: "Your chatbot responds", note: "Answers and next steps through WhatsApp" },
              ].map(({ icon: Icon, title, note }) => (
                <li key={title} className="flex gap-4 border-b border-white/15 pb-5 last:border-0 last:pb-0">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25"><Icon size={19} aria-hidden="true" /></span>
                  <div><p className="font-medium">{title}</p><p className="mt-1 text-sm leading-relaxed text-[#c1d4c7]">{note}</p></div>
                </li>
              ))}
            </ol>
            <div className="mt-8 border-t border-white/25 pt-6">
              <p className="eyebrow text-[#c1d4c7]">{content.proofLabel}</p>
              <p className="mt-3 leading-relaxed">{content.proof}</p>
              <Link href={`/work/${whatsappProject.slug}`} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-medium underline underline-offset-4">
                Explore WhatsApp chatbot integrations <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-8 border-t border-[var(--color-line-strong)] pt-8 md:grid-cols-3 lg:mt-20 lg:gap-12">
          {content.offerings.map((offering) => (
            <article key={offering.number}>
              <p className="eyebrow text-[var(--color-accent)]">{offering.number}</p>
              <h3 className="mt-4 text-xl font-medium tracking-tight">{offering.title}</h3>
              <p className="mt-3 leading-relaxed text-[var(--color-muted)]">{offering.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
