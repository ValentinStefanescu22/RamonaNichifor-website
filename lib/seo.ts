import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale, type Pathname } from "@/i18n/routing";
import type { RichTextData, SiteSettings } from "@/content/types";

export type Href = Parameters<typeof getPathname>[0]["href"];

const OG_LOCALE: Record<Locale, string> = { ro: "ro_RO", en: "en_US" };

/** Canonical origin, no trailing slash. */
export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL ?? "https://ramonanichifor.com").replace(/\/+$/, "");

/** Previews stay out of search engines; indexing turns on at launch (M5) with SITE_INDEXABLE=1. */
export const isIndexable = () => process.env.SITE_INDEXABLE === "1";

/** Absolute URL of a typed route in a locale (RO home → https://ramonanichifor.com, EN → …/en).
 *  No trailing slash on the root: Next writes the canonical/hreflang that way, so the sitemap matches it. */
export function absoluteUrl(locale: Locale, href: Href) {
  const path = getPathname({ locale, href });
  return siteUrl() + (path === "/" ? "" : path);
}

/** The page's path in each locale. `params` carries each locale's own values for a dynamic route (the slug differs per
 *  language), so a canonical or hreflang never reuses the slug of the URL that was requested. */
export type LocaleParams = Partial<Record<Locale, Record<string, string>>>;
const hrefOf = (path: Pathname, params?: Record<string, string>) => (params ? { pathname: path, params } : path) as Href;

/** ro / en / x-default (→ RO) for one page. */
export function languageAlternates(path: Pathname, params?: LocaleParams) {
  const urls = Object.fromEntries(routing.locales.map((l) => [l, absoluteUrl(l, hrefOf(path, params?.[l]))])) as Record<Locale, string>;
  return { ...urls, "x-default": urls[routing.defaultLocale] };
}

/** The home OG card of a locale (static PNG made by scripts/make-og.mjs). */
export const ogImage = (locale: Locale, alt: string) => ({ url: `/og/home-${locale}.png`, width: 1200, height: 630, alt, type: "image/png" });

/** Site-wide defaults every page inherits from app/[locale]/layout.tsx (no canonical: that is per page). */
export function baseMetadata({ locale, title, description }: { locale: Locale; title: string; description: string }): Metadata {
  const image = ogImage(locale, title);
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: "%s · Ramona Nichifor" },
    description,
    robots: { index: isIndexable(), follow: isIndexable() },
    openGraph: {
      type: "website",
      siteName: "Ramona Nichifor",
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: [image],
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

/**
 * Full metadata for one page: „{title} · Ramona Nichifor”, a self canonical, hreflang ro/en/x-default and Open Graph with its URL.
 * Next merges metadata shallowly, so this repeats every key it sets in full (openGraph, twitter, robots).
 *
 * - `path` is the typed pathname (`"/despre"`, `"/universuri/[slug]"`). For a dynamic route pass `params` for EACH locale
 *   (`{ ro: { slug: "fluturele" }, en: { slug: "butterfly" } }`): canonical and hreflang use the doc's own slug per language.
 * - `seo` is the doc's `seo` group; a filled title / description / image replaces the page's own.
 * - `ogPath` is the image: the route's own card (`ogRoute(locale, "/despre")`), or a static file such as the home card.
 */
export function pageMetadata({
  locale,
  path,
  params,
  title,
  description,
  seo,
  ogPath,
  absoluteTitle = false,
}: {
  locale: Locale;
  path: Pathname;
  params?: LocaleParams;
  title: string;
  description: string;
  seo?: { title?: string | null; description?: string | null; image?: { src: string } | null } | null;
  ogPath?: string;
  /** The title is already complete (the home), so „ · Ramona Nichifor” is not added. */
  absoluteTitle?: boolean;
}): Metadata {
  const languages = languageAlternates(path, params);
  const url = languages[locale];
  const name = seo?.title || title;
  const full = absoluteTitle ? name : `${name} · Ramona Nichifor`;
  const summary = seo?.description || description;
  const src = seo?.image?.src ?? ogPath;
  const images = src ? [{ url: src, width: 1200, height: 630, alt: full }] : undefined;
  return {
    metadataBase: new URL(siteUrl()),
    title: { absolute: full },
    description: summary,
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      siteName: "Ramona Nichifor",
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      url,
      title: full,
      description: summary,
      ...(images && { images }),
    },
    twitter: { card: "summary_large_image", title: full, description: summary, ...(images && { images }) },
    robots: { index: isIndexable(), follow: isIndexable() },
  };
}

const HOME_CRUMB: Record<Locale, string> = { ro: "Acasă", en: "Home" }; // = messages nav.home

/** schema.org BreadcrumbList for an inner page: Acasă / Home first, then each step (names already in the page's language). */
export function breadcrumbLd(locale: Locale, trail: { name: string; path: Href }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: HOME_CRUMB[locale], path: "/" as Href }, ...trail].map((step, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: step.name,
      item: absoluteUrl(locale, step.path),
    })),
  };
}

/** Site-wide JSON-LD: WebSite + Person (spec §8). */
export function siteGraph(settings: SiteSettings, locale: Locale) {
  const url = siteUrl();
  const home = absoluteUrl(locale, "/");
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${url}/#website`, name: settings.name, url: home, inLanguage: locale, publisher: { "@id": `${url}/#person` } },
      {
        "@type": "Person",
        "@id": `${url}/#person`,
        name: settings.name,
        url: home,
        image: url + settings.portrait.src,
        jobTitle: settings.roles.split(" · "),
        description: settings.intro,
        sameAs: settings.sameAs,
      },
    ],
  };
}

type LexNode = { type?: string; text?: string; children?: LexNode[] };
const inlineText = (n: LexNode): string => (n.type === "linebreak" ? " " : (n.text ?? (n.children ?? []).map(inlineText).join(n.type === "list" ? " " : "")));
/** A Lexical text as plain text: blocks (paragraphs, list items) separated by a space, no markup. */
export const plainText = (d: RichTextData) => d.root.children.map((b) => inlineText(b as LexNode)).join(" ").replace(/\s+/g, " ").trim();

/** schema.org FAQPage: one Question per entry, the answer as plain text (the page shows the same questions). */
export function faqLd(items: { question: string; answer: RichTextData }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((q) => ({ "@type": "Question", name: q.question, acceptedAnswer: { "@type": "Answer", text: plainText(q.answer) } })),
  };
}
