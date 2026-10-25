import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { permanentRedirect } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getBook, getBooks, getSiteSettings, getSlugPairs, getWorlds } from "@/content";
import type { BookFull } from "@/content/types";
import { absoluteUrl, breadcrumbLd, pageMetadata, siteUrl } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { BackPill } from "@/components/page/BackPill";
import { Painted } from "@/components/page/Painted";
import { RichText } from "@/components/page/RichText";
import { OrbArt } from "@/components/universe/OrbArt";
import { BuySoon } from "@/components/ui/BuySoon";
import { StatusChip } from "@/components/ui/StatusChip";
import { ArrowRight, ArrowUpRight, Instagram } from "@/components/ui/icons";
import { PillLink, TextLink } from "@/components/ui/links";
import { Link } from "@/i18n/navigation";
import { BookCover } from "@/components/books/BookCover";
import { Leaf } from "@/components/books/Leaf";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

// slugs are edited in the admin: one published after the build renders on first visit (unknown ones 404 below)
export const dynamicParams = true;

export async function generateStaticParams() {
  const pairs = await getSlugPairs("books");
  return routing.locales.flatMap((locale) => pairs.map((p) => ({ locale, slug: p[locale] })));
}

/** Each locale's own slug of this book (canonical, hreflang) */
const slugsOf = async (locale: Locale, b: BookFull) => {
  const pair = (await getSlugPairs("books")).find((p) => p[locale] === b.slug) ?? { ro: b.slug, en: b.slug };
  return Object.fromEntries(routing.locales.map((l) => [l, { slug: pair[l] }]));
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const [b, t] = await Promise.all([getBook(locale, slug), getTranslations({ locale, namespace: "books" })]);
  if (!b) return {};
  return pageMetadata({
    locale,
    path: "/carti/[slug]",
    params: await slugsOf(locale, b),
    title: b.title,
    description: b.blurb[0] || b.subtitle || t("placeholderBlurb"),
    seo: b.seo,
  });
}

export default async function Page({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const b = await getBook(locale, slug);
  if (!b) notFound();
  // the RO slug under /en (the lookup falls back to RO) or an old spelling: one URL per page, the doc's own (Ruling 6)
  // ponytail: on the FIRST (uncached) request Next 16 sends this 308 with the `location` header twice, the same value (the render
  // sets it and the stored response headers add it again; `curl -sI /en/books/fluturele-dansator-de-step` shows two). From the
  // second request (x-nextjs-cache: HIT) there is one. Browsers accept identical duplicates; no clean fix on our side.
  if (b.slug !== slug) permanentRedirect({ href: { pathname: "/carti/[slug]", params: { slug: b.slug } }, locale });

  const [t, site, books, worlds] = await Promise.all([getTranslations(), getSiteSettings(locale), getBooks(locale), getWorlds(locale)]);
  const world = worlds.find((w) => w.slug === b.universeSlug);
  const live = b.status === "published";
  const soon = t("ui.comingSoon");
  const related = books.filter((x) => x.slug !== b.slug && (b.universeSlug ? x.universeSlug : x.ageGroup === b.ageGroup)).slice(0, 3);
  const tintOf = (slug: string) => worlds.find((w) => w.slug === slug)?.tint ?? ["#F8DCEB", "#E58FBF", "#9B3F7A"] as [string, string, string];
  const stores = b.storeLinks;

  // a field she has not filled stays „în curând” (age is always known); pages and ISBN are shown only once they exist
  const meta = [
    { label: t("books.labels.age"), value: t(`books.ageRange.${b.ageGroup}`) },
    { label: t("books.labels.year"), value: b.year > 0 ? String(b.year) : soon },
    ...(b.pages ? [{ label: t("books.labels.pages"), value: String(b.pages) }] : []),
    { label: t("books.labels.format"), value: b.format || soon },
    ...(b.isbn ? [{ label: t("books.labels.isbn"), value: b.isbn }] : []),
  ];

  const ld = [
    breadcrumbLd(locale, [
      { name: t("nav.books"), path: "/carti" },
      { name: b.title, path: { pathname: "/carti/[slug]", params: { slug: b.slug } } },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Book",
      name: b.title,
      ...(b.subtitle && { alternativeHeadline: b.subtitle }),
      ...(b.blurb[0] && { description: b.blurb[0] }),
      author: { "@type": "Person", "@id": `${siteUrl()}/#person`, name: "Ramona Nichifor" },
      illustrator: { "@id": `${siteUrl()}/#person` },
      image: new URL(b.cover.src, siteUrl()).href,
      url: absoluteUrl(locale, { pathname: "/carti/[slug]", params: { slug: b.slug } }),
      inLanguage: "ro",
      ...(b.isbn && { isbn: b.isbn }),
      // where it can be bought (only real links exist here)
      ...(stores.length && { sameAs: stores.map((s) => s.url) }),
      ...(b.pages && { numberOfPages: b.pages }),
      ...(live && b.year > 0 && { datePublished: String(b.year) }),
    },
  ];

  return (
    <main>
      {ld.map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <section className="relative isolate overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:pt-32 lg:pb-24" style={{ background: "linear-gradient(180deg, #f9e8ef 0%, var(--color-petal) 55%, var(--color-cream) 100%)" }}>
        <div className="mx-auto max-w-6xl">
          <BackPill href="/carti" label={t("books.back")} />
          <div className="mt-6 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div className="fade-up" style={{ "--d": "0.1s" } as CSSProperties}>
              <BookCover cover={b.cover} title={b.title} />
            </div>
            <div className="min-w-0">
              <h1 className="rise display text-[clamp(2.6rem,10vw,4.6rem)] font-[380] text-balance text-ink" style={{ "--d": "0.2s" } as CSSProperties}>
                {b.title}
              </h1>
              {b.subtitle && (
                <p className="fade-up display mt-3 text-[1.35rem] leading-snug text-ink-soft italic" style={{ "--d": "0.3s" } as CSSProperties}>
                  {b.subtitle}
                </p>
              )}
              <p className="fade-up mt-4 flex flex-wrap items-center gap-2 text-[0.95rem] text-ink-soft" style={{ "--d": "0.35s" } as CSSProperties}>
                {/* a book that is out just says when; one still coming says so */}
                {live ? b.year > 0 && <span className="tabular-nums">{b.year}</span> : <StatusChip>{t(`books.status.${b.status}`)}</StatusChip>}
                {live && b.year > 0 && b.universeSlug && <span aria-hidden="true">·</span>}
                {b.universeSlug && <>„{site.series}”</>}
              </p>
              <div className="fade-up mt-6 max-w-[58ch] text-[1.06rem] leading-[1.75] text-ink-soft" style={{ "--d": "0.4s" } as CSSProperties}>
                {b.blurb.length ? (
                  <RichText data={b.blurbRich} className="space-y-4" />
                ) : (
                  <div className="space-y-4">
                    {world && <p>{world.hook}</p>}
                    <p>{t("books.placeholderBlurb")}</p>
                  </div>
                )}
              </div>
              <div className="fade-up mt-8" style={{ "--d": "0.5s" } as CSSProperties}>
                {!live ? (
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <PillLink href={site.contacts.instagram.href} external icon={<Instagram size={18} />}>
                      {t("universes.notifyMe")}
                    </PillLink>
                    <TextLink href={{ pathname: "/contact", query: { subiect: "carte" } }}>{t("ui.writeToMe")}</TextLink>
                  </div>
                ) : stores.length ? (
                  <div className="flex flex-wrap gap-3">
                    {stores.map((s) => (
                      <PillLink key={s.url} href={s.url} external icon={<ArrowUpRight size={18} />}>
                        {s.store}
                      </PillLink>
                    ))}
                  </div>
                ) : (
                  <BuySoon />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream px-4 py-14 sm:px-6">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-6 border-y border-ink/10 py-8 sm:grid-cols-3 lg:grid-cols-5">
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="text-[0.9rem] text-ink-soft">{m.label}</dt>
              <dd className="mt-1 font-medium text-ink tabular-nums">{m.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="bg-cream pb-16 lg:pb-24">
        <div className="mx-auto max-w-[75rem] px-4 sm:px-6">
          <h2 className="display text-[clamp(2rem,7vw,3rem)] font-[380] text-ink">{t("books.leaf")}</h2>
          <p className="mt-2 flex flex-wrap items-center gap-3 text-ink-soft">
            {b.leafPages.length ? (
              t("books.leafHint")
            ) : (
              <>
                <StatusChip>{t("ui.comingSoon")}</StatusChip>
                {t("books.leafNote")}
              </>
            )}
          </p>
        </div>
        {b.leafPages.length > 0 && <Leaf pages={b.leafPages} title={b.title} />}
      </section>

      <section className="bg-cream px-4 pb-24 sm:px-6">
        <div className={`mx-auto grid max-w-6xl gap-12 ${world ? "lg:grid-cols-[0.8fr_1.2fr] lg:gap-20" : ""}`}>
          {world && (
            <Link
              href={{ pathname: "/universuri/[slug]", params: { slug: world.slug } }}
              className="group flex items-center gap-6 self-start rounded-[2rem] p-6 ring-1 ring-ink/5"
              style={{ background: `color-mix(in oklab, ${world.tint[0]} 60%, white)` }}
            >
              <OrbArt u={world} size="112px" className="shrink-0 transition-transform duration-500 group-hover:scale-[1.04]" />
              <span className="min-w-0">
                <span className="block text-[0.95rem] text-ink-soft">{t("books.universe")}</span>
                <span className="display mt-1 block text-[1.6rem] leading-tight text-ink">{world.name}</span>
                <span className="mt-2 inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink underline decoration-lilac decoration-2 underline-offset-[6px]">
                  {t("ui.discover")}
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </span>
            </Link>
          )}
          {related.length > 0 && (
            <div className="min-w-0">
              <h2 className="display text-[1.9rem] text-ink">{t(b.universeSlug ? "books.series" : "books.moreBooks")}</h2>
              <ul className="mt-5 grid grid-cols-3 gap-4 sm:gap-6 lg:max-w-3xl">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={{ pathname: "/carti/[slug]", params: { slug: r.slug } }} className="group block">
                      <div className="transition-transform duration-500 ease-(--ease-bloom) group-hover:-translate-y-1.5" aria-hidden="true">
                        <Painted variant="book" title={r.title} cover={r.cover} tint={tintOf(r.universeSlug)} sizes="(min-width: 1024px) 200px, 28vw" />
                      </div>
                      <p className="display mt-3 text-[1rem] leading-tight text-ink sm:text-[1.1rem]">{r.title}</p>
                      <p className="mt-1 text-[0.85rem] text-ink-soft tabular-nums">{r.status === "published" ? r.year || null : t(`books.status.${r.status}`)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
