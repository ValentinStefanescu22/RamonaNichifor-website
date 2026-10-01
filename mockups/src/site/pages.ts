import { nav, type Text } from "../shared/content";

// Every page of the site, in menu order. Hrefs are relative so the pages work both locally and
// when published side by side in the artifact.
export type PageId = "home" | "universuri" | "carti" | "despre" | "arta" | "consiliere" | "comunitate" | "contact";

export const pages: { id: Exclude<PageId, "home">; label: Text; href: string }[] = [
  { id: "universuri", label: nav.universes, href: "universuri.html" },
  { id: "carti", label: nav.books, href: "carti.html" },
  { id: "despre", label: nav.about, href: "despre.html" },
  { id: "arta", label: nav.art, href: "arta.html" },
  { id: "consiliere", label: nav.counselling, href: "consiliere.html" },
  { id: "comunitate", label: nav.community, href: "comunitate.html" },
  { id: "contact", label: nav.contact, href: "contact.html" },
];

export const homeHref = "index.html";
