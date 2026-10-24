import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import type { SiteSettings } from "@/content/types";

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

/** ro / en / x-default (→ RO) for one page. Slug routes pass `hrefs`, because the slug differs per locale. */
export function languageAlternates(href: Href, hrefs?: Partial<Record<Locale, Href>>) {
  const urls = Object.fromEntries(routing.locales.map((l) => [l, absoluteUrl(l, hrefs?.[l] ?? href)])) as Record<Locale, string>;
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
 * Full metadata for one page: self canonical, hreflang alternates, Open Graph with its URL.
 * Next merges metadata shallowly, so this repeats every key it sets in full (openGraph, twitter, robots).
 */
export function pageMetadata({
  locale,
  href,
  hrefs,
  title,
  description,
  image,
}: {
  locale: Locale;
  href: Href;
  hrefs?: Partial<Record<Locale, Href>>;
  /** Used as is (absolute), without the „ · Ramona Nichifor” template. */
  title?: string;
  description?: string;
  /** Defaults to the home card of the locale until pages get their own (M3). */
  image?: ReturnType<typeof ogImage>;
}): Metadata {
  const languages = languageAlternates(href, hrefs);
  const url = languages[locale];
  const images = [image ?? ogImage(locale, title ?? "Ramona Nichifor")];
  return {
    metadataBase: new URL(siteUrl()),
    ...(title && { title: { absolute: title } }),
    ...(description && { description }),
    alternates: { canonical: url, languages },
    openGraph: {
      type: "website",
      siteName: "Ramona Nichifor",
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      url,
      ...(title && { title }),
      ...(description && { description }),
      images,
    },
    twitter: { card: "summary_large_image", ...(title && { title }), ...(description && { description }), images },
    robots: { index: isIndexable(), follow: isIndexable() },
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
