/** The public page a document shows on, in the admin's current locale (mirrors the next-intl pathnames in i18n/routing.ts). */
export type PreviewTarget = { collection?: string; global?: string; slug?: unknown; kind?: unknown; universeSlug?: string; locale: string };

const PATHS = {
  universes: ["/universuri", "/universes"],
  books: ["/carti", "/books"],
  artworks: ["/arta", "/art"],
  community: ["/comunitate", "/community"],
  counselling: ["/consiliere", "/counselling"],
  about: ["/despre", "/about"],
  contact: ["/contact", "/contact"],
  privacy: ["/confidentialitate", "/privacy"],
  terms: ["/termeni", "/terms"],
} as const;

export function previewPath({ collection, global, slug, kind, universeSlug, locale }: PreviewTarget): string {
  const i = locale === "en" ? 1 : 0;
  const at = (k: keyof typeof PATHS) => (i ? "/en" : "") + PATHS[k][i];
  const home = i ? "/en" : "/";
  const page = { "counselling-page": "counselling", "about-page": "about", "books-page": "books", "community-page": "community", "contact-page": "contact" } as const;
  if (global) return global in page ? at(page[global as keyof typeof page]) : home;
  // events, projects and partners are sections of the community page; a legal page is found by its kind
  if (collection === "events" || collection === "projects" || collection === "partners") return at("community");
  if (collection === "legal-pages") return kind === "privacy" || kind === "terms" ? at(kind) : home;
  if (typeof slug !== "string" || !slug) return home;
  if (collection === "universes" || collection === "books" || collection === "artworks") return `${at(collection)}/${slug}`;
  // a product lives under its universe
  if (collection === "products" && universeSlug) return `${at("universes")}/${universeSlug}/${slug}`;
  return home;
}
