import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { permanentRedirect } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getSiteSettings, getSlugPairs, getUniverse, getWorlds } from "@/content";
import type { UniverseFull } from "@/content/types";
import { absoluteUrl, breadcrumbLd, pageMetadata, siteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PillLink } from "@/components/ui/links";
import { BuySoon } from "@/components/ui/BuySoon";
import { ArrowUpRight, Instagram } from "@/components/ui/icons";
import { OtherUniverses } from "@/components/universe/OtherUniverses";
import { Pollen } from "@/components/universe/Pollen";
import { UniverseHero } from "@/components/universe/UniverseHero";
import { UniverseItems } from "@/components/universe/UniverseItems";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

// slugs are edited in the admin: one published after the build renders on first visit (unknown ones 404 below)
export const dynamicParams = true;

export async function generateStaticParams() {
  const pairs = await getSlugPairs("universes");
  return routing.locales.flatMap((locale) => pairs.map((p) => ({ locale, slug: p[locale] })));
}

/** Each locale's own slug of this universe (canonical, hreflang) */
const slugsOf = async (locale: Locale, u: UniverseFull) => {
  const pair = (await getSlugPairs("universes")).find((p) => p[locale] === u.slug) ?? { ro: u.slug, en: u.slug };
  return Object.fromEntries(routing.locales.map((l) => [l, { slug: pair[l] }]));
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const u = await getUniverse(locale, slug);
  if (!u) return {};
  return pageMetadata({ locale, path: "/universuri/[slug]", params: await slugsOf(locale, u), title: u.name, description: u.hook });
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const u = await getUniverse(locale, slug);
  if (!u) notFound();
  // the RO slug under /en (the lookup falls back to RO) or an old spelling: one URL per page, the doc's own (Ruling 6)
  if (u.slug !== slug) permanentRedirect({ href: { pathname: "/universuri/[slug]", params: { slug: u.slug } }, locale });

  const [t, site, worlds] = await Promise.all([getTranslations(), getSiteSettings(locale), getWorlds(locale)]);
  const id = worlds.find((w) => w.slug === u.slug)?.id ?? u.slug;
  const live = u.status === "available";
  const book = u.books.find((b) => b.status === "published");
  const stores = book?.storeLinks ?? [];

  const ld = [
    breadcrumbLd(locale, [
      { name: t("nav.universes"), path: "/universuri" },
      { name: u.name, path: { pathname: "/universuri/[slug]", params: { slug: u.slug } } },
    ]),
    ...(book
      ? [
          {
            "@context": "https://schema.org",
            "@type": "Book",
            name: book.title,
            ...(book.subtitle && { alternativeHeadline: book.subtitle }),
            author: { "@type": "Person", "@id": `${siteUrl()}/#person`, name: "Ramona Nichifor" },
            illustrator: { "@id": `${siteUrl()}/#person` },
            image: siteUrl() + book.cover.src,
            url: absoluteUrl(locale, { pathname: "/carti/[slug]", params: { slug: book.slug } }),
            inLanguage: "ro",
            ...(book.isbn && { isbn: book.isbn }),
            ...(book.year && { datePublished: String(book.year) }),
          },
        ]
      : []),
  ];

  return (
    <main className="sky-tint relative isolate overflow-clip" style={{ "--tint": u.tint[0] } as CSSProperties}>
      {ld.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <Pollen colors={[u.tint[1], "#c9b8e6"]} strength={0.55} />
      <div className="relative mx-auto max-w-5xl px-4 pt-24 pb-24 sm:px-6 lg:pt-28">
        <UniverseHero u={u} id={id} />

        <section className="mt-14">
          <h2 className="display text-[1.8rem] text-ink">{t("universes.inThis")}</h2>
          <UniverseItems u={u} variant="universe" />
          {!live ? (
            <PillLink href={site.contacts.instagram.href} external icon={<Instagram size={18} />} className="mt-6">
              {t("universes.notifyMe")}
            </PillLink>
          ) : stores.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {stores.map((s) => (
                <PillLink key={s.url} href={s.url} external icon={<ArrowUpRight size={18} />}>
                  {s.store}
                </PillLink>
              ))}
            </div>
          ) : (
            <BuySoon className="mt-6" />
          )}
        </section>

        <OtherUniverses worlds={worlds.filter((w) => w.slug !== u.slug)} />
      </div>
    </main>
  );
}
