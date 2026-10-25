import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { permanentRedirect } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getArtwork, getSlugPairs } from "@/content";
import type { ArtworkFull } from "@/content/types";
import { absoluteUrl, breadcrumbLd, pageMetadata, siteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { BackPill } from "@/components/page/BackPill";
import { RichText } from "@/components/page/RichText";
import { Availability } from "@/components/art/Availability";
import { ArtworkSwipe } from "@/components/art/ArtworkSwipe";
import { ArrowRight } from "@/components/ui/icons";
import { PillLink } from "@/components/ui/links";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

// slugs are edited in the admin: one published after the build renders on first visit (unknown ones 404 below)
export const dynamicParams = true;

export async function generateStaticParams() {
  const pairs = await getSlugPairs("artworks");
  return routing.locales.flatMap((locale) => pairs.map((p) => ({ locale, slug: p[locale] })));
}

/** Each locale's own slug of this work (canonical, hreflang) */
const slugsOf = async (locale: Locale, a: ArtworkFull) => {
  const pair = (await getSlugPairs("artworks")).find((p) => p[locale] === a.slug) ?? { ro: a.slug, en: a.slug };
  return Object.fromEntries(routing.locales.map((l) => [l, { slug: pair[l] }]));
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const [a, t] = await Promise.all([getArtwork(locale, slug), getTranslations({ locale, namespace: "art" })]);
  if (!a) return {};
  return pageMetadata({
    locale,
    path: "/arta/[slug]",
    params: await slugsOf(locale, a),
    title: a.title,
    description: `${a.title}. ${[t(`kind.${a.kind}`), a.technique, a.size].filter(Boolean).join(" · ")}.`,
    seo: a.seo,
  });
}

const schemaAvailability = { preorder: "https://schema.org/PreOrder", sold: "https://schema.org/SoldOut", onRequest: undefined } as const;

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const a = await getArtwork(locale, slug);
  if (!a) notFound();
  // the RO slug under /en (the lookup falls back to RO) or an old spelling: one URL per page, the doc's own (Ruling 6)
  // (see the ponytail note in carti/[slug]/page.tsx about the doubled Location header on a first request)
  if (a.slug !== slug) permanentRedirect({ href: { pathname: "/arta/[slug]", params: { slug: a.slug } }, locale });

  const t = await getTranslations();
  const soon = t("ui.comingSoon");
  const rows = [
    { label: t("art.labels.technique"), value: a.technique || soon },
    { label: t("art.labels.size"), value: a.size || soon },
    { label: t("art.labels.year"), value: a.year ? String(a.year) : soon },
  ];
  // pre-order and ask both go to the contact form with the subject Artă and this work's title (the form reads the query)
  const contact = { pathname: "/contact", query: { subiect: "arta", lucrare: a.title } } as const;
  const d = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

  const ld = [
    breadcrumbLd(locale, [
      { name: t("nav.art"), path: "/arta" },
      { name: a.title, path: { pathname: "/arta/[slug]", params: { slug: a.slug } } },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "VisualArtwork",
      name: a.title,
      creator: { "@type": "Person", "@id": `${siteUrl()}/#person`, name: "Ramona Nichifor" },
      url: absoluteUrl(locale, { pathname: "/arta/[slug]", params: { slug: a.slug } }),
      ...(a.images[0] && { image: new URL(a.images[0].src, siteUrl()).href }),
      artform: a.kind === "print" ? "Print" : "Painting",
      ...(a.technique && { artMedium: a.technique }),
      ...(a.year && { dateCreated: String(a.year) }),
      // an offer only once there is a real price (never an invented one)
      ...(a.price && {
        offers: { "@type": "Offer", price: a.price, priceCurrency: "RON", ...(schemaAvailability[a.availability] && { availability: schemaAvailability[a.availability] }) },
      }),
    },
  ];

  return (
    <main className="bg-mist">
      {ld.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <section className="px-4 pt-24 pb-20 sm:px-6 lg:pt-32 lg:pb-28" style={{ background: "linear-gradient(180deg, #e2ecf7 0%, var(--color-mist) 60%)" }}>
        <div className="mx-auto max-w-6xl">
          <BackPill href="/arta" label={t("art.back")} />
          <div className="mt-6 grid items-start gap-8 overflow-hidden rounded-[2rem] bg-cream shadow-soft lg:grid-cols-[1.1fr_0.9fr]">
            <div className="fade-up min-w-0" style={d(0.1)}>
              <ArtworkSwipe images={a.images} title={a.title} />
            </div>
            <div className="fade-up min-w-0 px-6 pb-10 lg:px-10 lg:pt-12" style={d(0.2)}>
              <p className="text-[0.95rem] text-ink-soft">{t(`art.kind.${a.kind}`)}</p>
              <h1 className="display mt-1 text-[clamp(2rem,9vw,2.8rem)] font-[380] text-balance text-ink [overflow-wrap:anywhere]">{a.title}</h1>
              <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[1rem]">
                {rows.map((r) => (
                  <div key={r.label} className="contents">
                    <dt className="text-ink-soft">{r.label}</dt>
                    <dd className="text-ink tabular-nums">{r.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5">
                <Availability availability={a.availability} price={a.price} />
              </div>
              {a.availability === "preorder" ? (
                <>
                  <PillLink href={contact} icon={<ArrowRight size={17} />} className="mt-8">
                    {t("art.preorder")}
                  </PillLink>
                  <p className="mt-3 max-w-[40ch] text-[0.95rem] leading-relaxed text-ink-soft">{t("art.preorderNote")}</p>
                </>
              ) : (
                <PillLink href={contact} icon={<ArrowRight size={17} />} className="mt-8">
                  {t("art.ask")}
                </PillLink>
              )}
              {a.description && <RichText data={a.description} className="mt-8 max-w-[58ch]" />}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
