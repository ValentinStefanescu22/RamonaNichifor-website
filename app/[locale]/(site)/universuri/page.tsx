import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getSiteSettings, getWorlds } from "@/content";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Pollen } from "@/components/universe/Pollen";
import { WorldMap } from "@/components/universe/WorldMap";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const [t, site] = await Promise.all([getTranslations({ locale, namespace: "nav" }), getSiteSettings(locale)]);
  return pageMetadata({ locale, path: "/universuri", title: t("universes"), description: `„${site.series}”: ${site.seriesLead}` });
}

const wash = (mask: string): CSSProperties => ({ maskImage: `radial-gradient(${mask}, #000 30%, transparent 100%)`, WebkitMaskImage: `radial-gradient(${mask}, #000 30%, transparent 100%)` });
const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

// Port of mockups/src/universuri-poiana/App.tsx: the Poiana sky, drifting pollen and the map of worlds (spec §5.2).
export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, site, worlds] = await Promise.all([getTranslations(), getSiteSettings(locale), getWorlds(locale)]);
  return (
    <main className="sky-day relative isolate overflow-clip">
      <JsonLd data={breadcrumbLd(locale, [{ name: t("nav.universes"), path: "/universuri" }])} />
      <Pollen colors={["#b8468a", "#7a5fb0"]} strength={0.5} />
      <img
        src="/img/wash.webp"
        alt=""
        aria-hidden="true"
        className="wash-in pointer-events-none absolute -top-[4%] -right-[30%] -z-10 h-[70%] w-auto max-w-none opacity-60 mix-blend-multiply sm:-right-[8%]"
        style={wash("ellipse 60% 55% at 72% 38%")}
      />
      {/* its mask fades out before the bottom edge, so no line shows above the footer */}
      <img
        src="/img/wash.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute bottom-0 -left-[35%] -z-10 h-[55%] w-auto max-w-none scale-x-[-1] opacity-45 mix-blend-multiply sm:-left-[12%]"
        style={wash("ellipse 58% 44% at 68% 52%")}
      />
      {/* phones pick the world nearest mid-screen, so the page leaves room for the last world to reach the middle */}
      {/* a compact intro on phones (pt-24, gap-3), so the four worlds fit on the first screen */}
      <div className="mx-auto grid max-w-[75rem] gap-3 px-4 pt-24 pb-[45svh] sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-6 lg:pt-36 lg:pb-24">
        <div className="lg:sticky lg:top-16 lg:self-start lg:pt-10">
          <h1 className="fade-up display text-[clamp(3rem,13vw,6rem)] font-[380] text-ink" style={d(0.1)}>
            {t("nav.universes")}
          </h1>
          <p className="fade-up display mt-2 text-[1.35rem] text-violet italic lg:mt-3" style={d(0.2)}>
            „{site.series}”
          </p>
          <p className="fade-up mt-2 max-w-[36ch] text-[1.05rem] text-ink-soft" style={d(0.3)}>
            {t("universes.lead")}
          </p>
          <p className="fade-up mt-3 flex items-center gap-2 text-[0.95rem] font-bold text-magenta lg:mt-4" style={d(0.4)}>
            <span className="size-2 animate-pulse rounded-full bg-magenta" aria-hidden="true" />
            {t("universes.tap")}
          </p>
        </div>
        <WorldMap worlds={worlds.map(({ id, slug, name, status, tint, creature }) => ({ id, slug, name, status, tint, creature }))} />
      </div>
    </main>
  );
}
