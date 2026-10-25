import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, permanentRedirect } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getProduct, getProductPaths, getSiteSettings, getUniverse } from "@/content";
import type { Media, ProductFull } from "@/content/types";
import { deck } from "@/content/pages-data";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Painted } from "@/components/page/Painted";
import { RichText } from "@/components/page/RichText";
import { BookmarkSections } from "@/components/product/BookmarkFan";
import { DeckSections, Fan } from "@/components/product/Deck";
import { byNumber, pickNumbered } from "@/components/product/images";
import { ArrowRight, ArrowUpRight, Instagram } from "@/components/ui/icons";
import { PillLink, TextLink } from "@/components/ui/links";
import { BuySoon } from "@/components/ui/BuySoon";
import { StatusChip } from "@/components/ui/StatusChip";
import { UniverseItems } from "@/components/universe/UniverseItems";

type Props = { params: Promise<{ locale: Locale; slug: string; product: string }> };

// a product published after the build renders on first visit; unknown ones 404
export const dynamicParams = true;

export async function generateStaticParams() {
  const paths = await getProductPaths();
  return routing.locales.flatMap((locale) => paths.map((p) => ({ locale, slug: p.universe[locale], product: p.product[locale] })));
}

/** Each locale's own slugs of this product and its universe (canonical, hreflang) */
const slugsOf = async (locale: Locale, p: ProductFull) => {
  const path = (await getProductPaths()).find((x) => x.universe[locale] === p.universe.slug && x.product[locale] === p.slug);
  return Object.fromEntries(routing.locales.map((l) => [l, { slug: path?.universe[l] ?? p.universe.slug, product: path?.product[l] ?? p.slug }]));
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, product } = await params;
  const p = await getProduct(locale, slug, product);
  if (!p) return {};
  return pageMetadata({
    locale,
    path: "/universuri/[slug]/[product]",
    params: await slugsOf(locale, p),
    title: `${p.name} · ${p.universe.name}`,
    description: p.paragraphs[0] || `${p.name} · ${p.universe.name}`,
  });
}

// The deck's two public pairs (Ramona, 2026-10-13: only these two are shown) by card number: 2–3 and 4–5; 1 is the winner, 24 the rules
const PAIRS = [
  [2, 3],
  [4, 5],
] as const;

export default async function Page({ params }: Props) {
  const { locale, slug, product } = await params;
  setRequestLocale(locale);
  const p = await getProduct(locale, slug, product); // null too when its universe is not published
  if (!p) notFound();
  if (p.universe.slug !== slug || p.slug !== product)
    permanentRedirect({ href: { pathname: "/universuri/[slug]/[product]", params: { slug: p.universe.slug, product: p.slug } }, locale });

  const [t, site, u] = await Promise.all([getTranslations(), getSiteSettings(locale), getUniverse(locale, p.universe.slug)]);
  if (!u) notFound();
  const soon = p.status === "soon";
  const tint = u.tint;
  const universeHref = { pathname: "/universuri/[slug]" as const, params: { slug: u.slug } };

  // the pictures by file number (never by their place in the admin list), see components/product/images.ts
  const cards = p.gallery === "cards";
  const marks = p.gallery === "bookmarks";
  const pairs = cards
    ? PAIRS.flatMap((pair, i) => {
        const [a, b] = pair.map((n) => byNumber(p.images, n));
        return a && b ? [{ name: deck.pairs[i][locale], cards: [a, b] as [Media, Media] }] : [];
      })
    : [];

  const visual = cards ? (
    <Fan images={pickNumbered(p.images, [3, 14, 1, 15, 23])} label={t("product.deck.fan")} width="42%" card />
  ) : marks ? (
    <Fan images={pickNumbered(p.images, [1, 6, 4])} label={t("product.bookmarks.fan")} width="24%" />
  ) : (
    <Painted variant="product" kind={p.kind} tint={tint} images={p.images.slice(0, 1)} className="mx-auto w-[min(78vw,420px)]" />
  );

  const ld = breadcrumbLd(locale, [
    { name: t("nav.universes"), path: "/universuri" },
    { name: u.name, path: universeHref },
    { name: p.name, path: { pathname: "/universuri/[slug]/[product]", params: { slug: u.slug, product: p.slug } } },
  ]);

  return (
    <main>
      <JsonLd data={ld} />
      <section
        className="relative isolate overflow-hidden px-4 pt-24 pb-16 sm:px-6 lg:pt-32 lg:pb-24"
        style={{ background: `linear-gradient(180deg, color-mix(in oklab, ${tint[0]} 55%, white) 0%, ${tint[0]} 52%, var(--color-cream) 100%)` }}
      >
        <div className="mx-auto max-w-6xl">
          <Link href={universeHref} className="inline-flex min-h-11 items-center gap-2 font-medium text-ink-soft hover:text-ink">
            <ArrowRight size={17} className="rotate-180" />
            {u.name}
          </Link>
          <div className="mt-6 grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <div className="fade-up" style={{ "--d": "0.1s" } as CSSProperties}>
              {visual}
            </div>
            <div className="min-w-0">
              <h1 className="display text-[clamp(2.6rem,10vw,4.6rem)] font-[380] text-balance text-ink">
                <span className="rise block" style={{ "--d": "0.2s" } as CSSProperties}>
                  {p.name}
                </span>
                <span className="rise display-wonk mt-1 block pl-[0.4em] text-[0.62em] text-violet italic" style={{ "--d": "0.28s" } as CSSProperties}>
                  {u.name}
                </span>
              </h1>
              <p className="fade-up mt-5 flex flex-wrap items-center gap-3 text-[0.95rem] text-ink-soft" style={{ "--d": "0.35s" } as CSSProperties}>
                {soon && <StatusChip>{t("ui.comingSoon")}</StatusChip>}
                <span>{p.price ? t("product.price", { price: p.price }) : t("product.priceSoon")}</span>
              </p>
              <div className="fade-up mt-6 max-w-[56ch]" style={{ "--d": "0.4s" } as CSSProperties}>
                <RichText data={p.description} className="space-y-4 text-[1.06rem] leading-[1.75] text-ink-soft" />
              </div>
              {p.specs.length > 0 && (
                <dl className="fade-up mt-6 grid max-w-md grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[1rem]" style={{ "--d": "0.45s" } as CSSProperties}>
                  {p.specs.map((sp) => (
                    <div key={sp.label} className="contents">
                      <dt className="text-ink-soft">{sp.label}</dt>
                      <dd className="text-ink">{sp.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              <div className="fade-up mt-8" style={{ "--d": "0.5s" } as CSSProperties}>
                {soon ? (
                  // nothing to buy yet: „Anunță-mă” (Instagram, for now) instead of a buy button
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <PillLink href={site.contacts.instagram.href} external icon={<Instagram size={18} />}>
                      {t("universes.notifyMe")}
                    </PillLink>
                    <TextLink href="/contact">{t("ui.writeToMe")}</TextLink>
                  </div>
                ) : p.externalLink ? (
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <PillLink href={p.externalLink} external icon={<ArrowUpRight size={18} />}>
                      {t("product.buy")}
                    </PillLink>
                    <TextLink href="/contact">{t("ui.writeToMe")}</TextLink>
                  </div>
                ) : (
                  // available but no shop link yet: say so plainly, like a book that is out
                  <BuySoon />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {cards && pairs.length > 0 && (
        <DeckSections
          pairs={pairs}
          winner={byNumber(p.images, deck.winner.n)}
          rulesCard={byNumber(p.images, deck.rulesCard)}
          copy={{
            title: t("product.deck.title"),
            lead: t("product.deck.lead"),
            winnerTitle: t("product.deck.winnerTitle"),
            winnerName: deck.winner.name[locale],
            winnerLine: deck.winnerLine[locale],
            rulesTitle: t("product.deck.rulesTitle"),
            rules: deck.rules.map((r) => r[locale]),
            packTitle: t("product.deck.packTitle"),
            pack: deck.pack.map((x) => x[locale]),
            rulesCard: t("product.deck.rulesCard"),
            prev: t("product.deck.prev"),
            next: t("product.deck.next"),
          }}
        />
      )}
      {marks && p.images.length > 0 && (
        <BookmarkSections
          marks={p.images.map((m) => ({ ...m, label: m.alt }))}
          copy={{ title: t("product.bookmarks.title"), lead: t("product.bookmarks.lead"), prev: t("product.bookmarks.prev"), next: t("product.bookmarks.next") }}
        />
      )}

      <section className="bg-cream px-4 pt-6 pb-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="display text-[clamp(2rem,7vw,3rem)] font-[380] text-ink">{t("product.sameUniverse")}</h2>
          <UniverseItems u={u} variant="product" exclude={p.slug} />
        </div>
      </section>
    </main>
  );
}
