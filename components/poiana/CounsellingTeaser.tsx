import { useTranslations } from "next-intl";
import type { CounsellingPage, SiteSettings } from "@/content/types";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Armchair, Video, WhatsApp } from "@/components/ui/icons";
import { PillLink, TextLink } from "@/components/ui/links";

export function CounsellingTeaser({ site, counselling }: { site: SiteSettings; counselling: CounsellingPage }) {
  const t = useTranslations("ui");
  return (
    <section id="consiliere" className="relative scroll-mt-20 bg-sage px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <blockquote className="display max-w-[20ch] text-[clamp(1.9rem,7.4vw,3.6rem)] leading-[1.12] font-[360] text-ink">
          {site.manifesto.map((line, i) => (
            <span key={i} className="block">
              {line.before}
              <em className="display-wonk text-magenta">{line.emphasis}</em>
              {line.after}
            </span>
          ))}
        </blockquote>
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div className="min-w-0">
            <h2 className="display text-[clamp(1.9rem,6.5vw,2.8rem)] leading-[1.08] font-[380] text-ink">{counselling.teaserTitle}</h2>
            <p className="mt-4 max-w-[48ch] text-[1.06rem] leading-relaxed text-ink-soft">{counselling.teaserLead}</p>
          </div>
          <div className="min-w-0">
            <ul className="grid gap-5 sm:grid-cols-2">
              {counselling.formats.map((f) => {
                const Icon = f.kind === "online" ? Video : Armchair;
                return (
                  <li key={f.kind} className="flex gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-cream text-leaf">
                      <Icon size={20} />
                    </span>
                    <span>
                      <span className="display block text-[1.25rem] text-ink">{f.title}</span>
                      <span className="text-[0.98rem] leading-snug text-ink-soft">{f.line}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-8 flex flex-col items-start gap-3">
              <PillLink href={site.contacts.whatsapp.href} external icon={<WhatsApp size={18} />}>
                {t("bookConversation")}
              </PillLink>
              <CopyEmail email={site.contacts.email} className="text-[0.98rem] text-ink-soft [&_button]:bg-cream/70 [&_button]:text-ink" />
              <TextLink href="/consiliere">{t("howIWork")}</TextLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
