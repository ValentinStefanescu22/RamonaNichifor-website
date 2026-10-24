import type { Pathname } from "@/i18n/routing";

/** Routes without a [slug]: the only ones a menu can link to directly */
type StaticPathname = Exclude<Pathname, `${string}[slug]`>;

export type PageId = "home" | "universuri" | "carti" | "despre" | "arta" | "consiliere" | "comunitate" | "contact";

/** The menu as the top bar, the floating bar, the sheet and the footer show it (client order, 2026-10-05). */
export const menu: { id: PageId; labelKey: "home" | "about" | "counselling" | "books" | "art" | "universes" | "community" | "contact"; href: StaticPathname }[] = [
  { id: "home", labelKey: "home", href: "/" },
  { id: "despre", labelKey: "about", href: "/despre" },
  { id: "consiliere", labelKey: "counselling", href: "/consiliere" },
  { id: "carti", labelKey: "books", href: "/carti" },
  { id: "arta", labelKey: "art", href: "/arta" },
  { id: "universuri", labelKey: "universes", href: "/universuri" },
  { id: "comunitate", labelKey: "community", href: "/comunitate" },
  { id: "contact", labelKey: "contact", href: "/contact" },
];

/** The menu entry an internal pathname belongs to ("/carti/[slug]" → carti); legal pages and the 404 have none. */
export function pageOf(pathname: string): PageId | undefined {
  if (pathname === "/") return "home";
  return menu.find((m) => m.href !== "/" && (pathname === m.href || pathname.startsWith(`${m.href}/`)))?.id;
}
