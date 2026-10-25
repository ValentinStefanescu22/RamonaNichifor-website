import { routing, type Locale } from "@/i18n/routing";
import type { SlugPairs } from "@/content/types";

/** The routes with [params], and which collection's slugs each param holds. Products repeat under every universe, so both are looked up. */
export const dynamicRoutes: Record<string, Record<string, keyof SlugPairs>> = {
  "/universuri/[slug]": { slug: "universes" },
  "/universuri/[slug]/[product]": { slug: "universes", product: "products" },
  "/carti/[slug]": { slug: "books" },
  "/arta/[slug]": { slug: "artworks" },
};

const patterns = Object.entries(dynamicRoutes).map(([pathname, shape]) => ({
  pathname,
  params: Object.keys(shape),
  regex: new RegExp(`^${pathname.replace(/\[\w+\]/g, "([^/]+)")}$`),
  shape,
}));

/** A link written in the admin ("/universuri/fluturele#x", always the Romanian path and slugs) that points at a dynamic page. */
export const isDynamicPath = (url: string) => patterns.some((p) => p.regex.test(url.split("#")[0]));

/**
 * The typed href of such a link in `locale`: the pathname with each slug swapped for the doc's own slug in that language
 * (next-intl cannot localize a plain "/universuri/fluturele": it is not a key of routing.pathnames). Null when it is not a
 * dynamic route or a slug matches no published doc; the caller then falls back to the path as written.
 */
export function localizeDynamicPath(url: string, locale: Locale, slugs: SlugPairs) {
  const [path, hash] = url.split("#");
  for (const { pathname, params, regex, shape } of patterns) {
    const m = regex.exec(path);
    if (!m) continue;
    const found = params.map((param, i) => slugs[shape[param]].find((p) => p[routing.defaultLocale] === m[i + 1])?.[locale]);
    if (found.some((v) => !v)) return null;
    return { pathname, params: Object.fromEntries(params.map((param, i) => [param, found[i]!])), ...(hash && { hash }) };
  }
  return null;
}
