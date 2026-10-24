import Image from "next/image";
import { useTranslations } from "next-intl";
import type { SiteSettings } from "@/content/types";
import { TextLink } from "@/components/ui/links";
import { SectionTitle } from "./SectionTitle";

export function AboutTeaser({ site }: { site: SiteSettings }) {
  const t = useTranslations();
  const p = site.portrait;
  return (
    <section id="despre" className="relative scroll-mt-20 bg-cream px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="relative mx-auto w-[min(78vw,360px)]">
          <span className="paint-edge absolute -inset-4 rounded-[999px_999px_2.5rem_2.5rem] bg-lilac/45" aria-hidden="true" />
          {/* a photo, not artwork: framed in the arch, so it may be cropped */}
          <Image
            src={p.src}
            alt={p.alt}
            width={p.width}
            height={p.height}
            sizes="min(78vw, 360px)"
            className="arch relative aspect-[4/5] w-full object-cover object-[50%_22%]"
          />
        </div>
        <div className="min-w-0">
          <SectionTitle>{t("nav.about")}</SectionTitle>
          <p className="display mt-6 max-w-[26ch] text-[clamp(1.4rem,5vw,2rem)] leading-[1.25] font-[360] text-ink">{site.intro}</p>
          <p className="mt-5 max-w-[52ch] text-[1.02rem] text-ink-soft">{site.roles}</p>
          <TextLink href="/despre" className="mt-6">
            {t("ui.myStory")}
          </TextLink>
        </div>
      </div>
    </section>
  );
}
