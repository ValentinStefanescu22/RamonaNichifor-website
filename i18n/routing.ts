import { defineRouting } from "next-intl/routing";

// RO at "/", EN under "/en". No locale cookie and no Accept-Language redirects (spec §11: no visitor cookies),
// so "/" is always Romanian. Every URL from spec §4 is declared now so the language switch keeps the page.
export const routing = defineRouting({
  locales: ["ro", "en"],
  defaultLocale: "ro",
  localePrefix: "as-needed",
  localeCookie: false,
  localeDetection: false,
  alternateLinks: false,
  pathnames: {
    "/": "/",
    "/universuri": { ro: "/universuri", en: "/universes" },
    "/universuri/[slug]": { ro: "/universuri/[slug]", en: "/universes/[slug]" },
    "/carti": { ro: "/carti", en: "/books" },
    "/carti/[slug]": { ro: "/carti/[slug]", en: "/books/[slug]" },
    "/arta": { ro: "/arta", en: "/art" },
    "/arta/[slug]": { ro: "/arta/[slug]", en: "/art/[slug]" },
    "/consiliere": { ro: "/consiliere", en: "/counselling" },
    "/despre": { ro: "/despre", en: "/about" },
    "/comunitate": { ro: "/comunitate", en: "/community" },
    "/contact": "/contact",
    "/confidentialitate": { ro: "/confidentialitate", en: "/privacy" },
    "/termeni": { ro: "/termeni", en: "/terms" },
  },
});

export type Locale = (typeof routing.locales)[number];
export type Pathname = keyof typeof routing.pathnames;
