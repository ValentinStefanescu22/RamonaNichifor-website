import type { MetadataRoute } from "next";
import { getProductPaths, getSlugDocs } from "@/content";
import { routing, type Locale, type Pathname } from "@/i18n/routing";
import { absoluteUrl, type Href, type LocaleParams } from "@/lib/seo";

// Every page of spec §4 in both languages, each with its hreflang alternates. Slugs come from Payload, so a doc published in
// the admin joins the sitemap on the next build or revalidation; a doc's lastModified is its own updatedAt.
const staticPaths: Pathname[] = ["/", "/universuri", "/carti", "/arta", "/consiliere", "/despre", "/comunitate", "/contact", "/confidentialitate", "/termeni"];

const entry = (path: Pathname, params?: LocaleParams, updatedAt?: string): MetadataRoute.Sitemap => {
  const href = (l: Locale) => (params ? { pathname: path, params: params[l] } : path) as Href;
  const languages = Object.fromEntries(routing.locales.map((l) => [l, absoluteUrl(l, href(l))])) as Record<Locale, string>;
  const alternates = { languages: { ...languages, "x-default": languages[routing.defaultLocale] } };
  const lastModified = updatedAt ? new Date(updatedAt) : undefined;
  return routing.locales.map((l) => ({ url: languages[l], lastModified, alternates }));
};

const slugParams = (pair: Record<Locale, string>): LocaleParams => Object.fromEntries(routing.locales.map((l) => [l, { slug: pair[l] }]));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [universes, books, artworks, products] = await Promise.all([
    getSlugDocs("universes"),
    getSlugDocs("books"),
    getSlugDocs("artworks"),
    getProductPaths(),
  ]);
  return [
    ...staticPaths.flatMap((path) => entry(path)),
    ...universes.flatMap((d) => entry("/universuri/[slug]", slugParams(d.pair), d.updatedAt)),
    ...books.flatMap((d) => entry("/carti/[slug]", slugParams(d.pair), d.updatedAt)),
    ...artworks.flatMap((d) => entry("/arta/[slug]", slugParams(d.pair), d.updatedAt)),
    ...products.flatMap((d) =>
      entry(
        "/universuri/[slug]/[product]",
        Object.fromEntries(routing.locales.map((l) => [l, { slug: d.universe[l], product: d.product[l] }])),
        d.updatedAt,
      ),
    ),
  ];
}
