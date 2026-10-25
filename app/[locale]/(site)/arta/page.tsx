import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getArtworks, getSiteSettings } from "@/content";
import type { Media } from "@/content/types";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PageHero } from "@/components/page/PageHero";
import { PaperPlaceholder } from "@/components/page/PaperPlaceholder";
import { Gallery } from "@/components/art/Gallery";
import { Brush } from "@/components/ui/icons";
import { PillLink } from "@/components/ui/links";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const [t, site] = await Promise.all([getTranslations({ locale, namespace: "nav" }), getSiteSettings(locale)]);
  return pageMetadata({ locale, path: "/arta", title: t("art"), description: site.artTeaser.lead });
}

/** The opener's signature: one framed work hanging from a nail on the wall */
function HangingFrame({ image }: { image: Media | null }) {
  return (
    <div className="relative mx-auto w-[min(74vw,360px)] pt-14" aria-hidden="true">
      <svg viewBox="0 0 200 60" className="absolute inset-x-[18%] top-0 h-14 w-[64%] overflow-visible">
        <path d="M2 58 L100 6 L198 58" fill="none" stroke="rgb(52 34 74 / 0.45)" strokeWidth="1.2" />
        <circle cx="100" cy="5" r="4" fill="#5e4a75" />
      </svg>
      <div className="origin-top rotate-[1.2deg] rounded-[3px] bg-[#fffdf9] p-3.5 shadow-soft sm:p-4">
        {image ? (
          <Image src={image.src} alt="" width={image.width} height={image.height} sizes="(min-width: 1024px) 360px, 74vw" priority draggable={false} className="art block h-auto w-full" />
        ) : (
          <PaperPlaceholder ratio={3 / 4} />
        )}
      </div>
    </div>
  );
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, site, works] = await Promise.all([getTranslations(), getSiteSettings(locale), getArtworks(locale)]);

  return (
    <main>
      <JsonLd data={breadcrumbLd(locale, [{ name: t("nav.art"), path: "/arta" }])} />
      <PageHero tone="mist" title={t("nav.art")} tagline={t("art.tagline")} lead={<p>{site.artTeaser.lead}</p>} aside={<HangingFrame image={works[0]?.images[0] ?? null} />}>
        {/* commissions, up where a visitor decides (client, 2026-10-13): her offer and one clear action */}
        <div className="max-w-[30rem] rounded-[1.75rem] bg-cream/80 p-5 shadow-soft ring-1 ring-ink/5 backdrop-blur-sm sm:p-6">
          <h2 className="display text-[1.55rem] leading-tight text-ink">{t("art.commissionTitle")}</h2>
          <p className="mt-2 text-[1.02rem] leading-relaxed text-ink-soft">{t("art.commission")}</p>
          <PillLink
            href={{ pathname: "/contact", query: { subiect: "arta" } }}
            icon={<Brush size={18} />}
            className="mt-5 text-[1.05rem] transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-12px_rgb(52_34_74/0.55)] [&>span]:bg-magenta"
          >
            {t("art.commissionCta")}
          </PillLink>
        </div>
      </PageHero>

      <section className="bg-mist px-4 pt-4 pb-20 sm:px-6 lg:pb-28">
        <div className="mx-auto max-w-6xl">
          <Gallery works={works.map((w) => ({ slug: w.slug, title: w.title, technique: w.technique, size: w.size, kind: w.kind, availability: w.availability, price: w.price, image: w.images[0] ?? null }))} />
        </div>
      </section>
    </main>
  );
}
