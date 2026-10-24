import type { CSSProperties } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getBookSlugs, getSiteSettings, getUniverseSlugs } from "@/content";
import { ChromeShell } from "@/components/site/ChromeShell";
import { Creature } from "@/components/ui/creatures";
import { ArrowRight } from "@/components/ui/icons";
import { PillLink, TextLink } from "@/components/ui/links";

const wash = "radial-gradient(ellipse 60% 55% at 70% 40%, #000 30%, transparent 100%)";
const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;
// Musca's tint (content data: universe „musca”)
const tint = ["#E3EBDA", "#A9BE95", "#56704A"] as const;

export default async function NotFound() {
  const locale = (await getLocale()) as Locale;
  const [t, site, universes, books] = await Promise.all([getTranslations("notFound"), getSiteSettings(locale), getUniverseSlugs(), getBookSlugs()]);
  return (
    <ChromeShell contacts={site.contacts} souls={site.souls} slugs={{ universes, books }}>
      <title>{`${t("metaTitle")} · Ramona Nichifor`}</title>
      <main>
        <section className="relative isolate overflow-hidden" style={{ background: "linear-gradient(180deg, var(--color-mist) 0%, var(--color-cream) 70%)" }}>
          <img
            loading="lazy"
            src="/img/wash.webp"
            alt=""
            aria-hidden="true"
            className="wash-in pointer-events-none absolute -top-[6%] -right-[34%] -z-10 h-[78%] w-auto max-w-none opacity-55 mix-blend-multiply sm:-right-[10%]"
            style={{ maskImage: wash, WebkitMaskImage: wash }}
          />
          <div className="mx-auto grid max-w-[75rem] items-center gap-10 px-4 pt-28 pb-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-36 lg:pb-28">
            <div className="min-w-0">
              <h1 className="display text-[clamp(2.6rem,11vw,5.4rem)] font-[380] text-ink">
                <span className="block overflow-hidden pb-[0.06em]">
                  <span className="rise block" style={d(0.1)}>
                    {t("title")}
                  </span>
                </span>
                <span className="block overflow-hidden pb-[0.12em] pl-[0.6em] sm:pl-[0.9em]">
                  <span className="rise display-wonk block italic text-violet" style={d(0.22)}>
                    {t("italic")}
                  </span>
                </span>
              </h1>
              <p className="fade-up mt-5 max-w-[46ch] text-[1.08rem] leading-relaxed text-ink-soft" style={d(0.5)}>
                {t("lead")}
              </p>
              <div className="fade-up mt-7 flex flex-wrap items-center gap-x-6 gap-y-3" style={d(0.6)}>
                <PillLink href="/" icon={<ArrowRight size={18} />}>
                  {t("home")}
                </PillLink>
                <TextLink href="/universuri">{t("universes")}</TextLink>
              </div>
            </div>
            <div className="fade-up relative mx-auto grid aspect-square w-full max-w-[20rem] place-items-center" style={d(0.35)} aria-hidden="true">
              <span
                className="paint-edge absolute inset-[6%] rounded-full opacity-80"
                style={{ background: `radial-gradient(circle at 40% 35%, ${tint[0]}, ${tint[1]} 70%)` }}
              />
              <Creature id="musca" size={150} className="relative" style={{ color: tint[2] }} />
            </div>
          </div>
        </section>
      </main>
    </ChromeShell>
  );
}
