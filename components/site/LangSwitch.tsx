"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { m } from "motion/react";
import { getPathname, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import type { SlugPairs } from "@/content/types";

export type { SlugPairs };

type Href = Parameters<typeof getPathname>[0]["href"];

/** The routes with [params], and which collection's slugs each param holds. Products repeat under every universe, so both are looked up. */
const dynamicRoutes: Record<string, Record<string, keyof SlugPairs>> = {
  "/universuri/[slug]": { slug: "universes" },
  "/universuri/[slug]/[product]": { slug: "universes", product: "products" },
  "/carti/[slug]": { slug: "books" },
  "/arta/[slug]": { slug: "artworks" },
};

/** RO | EN pill: the URL is the persisted choice (no cookie, no storage). */
export function LangSwitch({ id, slugs, className = "" }: { id: string; slugs: SlugPairs; className?: string }) {
  const t = useTranslations("ui");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const params = useParams<Record<string, string>>();
  // the thumb starts sliding to the chosen language while the other page loads
  const [chosen, setChosen] = useState(locale);

  const hrefFor = (next: Locale): Href => {
    if (!(pathname in routing.pathnames)) return "/"; // the 404: nothing to translate, go home
    const shape = dynamicRoutes[pathname];
    if (!shape) return pathname as Href;
    // each param is looked up by the slug of THIS language and carried over as the slug of the other one (a doc's slugs are edited in the admin)
    const target = Object.entries(shape).map(([param, collection]) => [param, slugs[collection].find((p) => p[locale] === params[param])?.[next]] as const);
    return (target.every(([, v]) => v) ? { pathname, params: Object.fromEntries(target) } : "/") as Href;
  };

  // A full document load, not router.replace: in Next 16.4 a client-side switch of the root layout's [locale]
  // leaves the segment prefetch cache keyed to the old locale (hundreds of ?_rsc prefetches a second and 404s).
  // The cross-fade comes from the cross-document view transition in globals.css (skipped under reduced motion).
  const go = (next: Locale) => {
    if (next === locale) return;
    setChosen(next);
    location.replace(getPathname({ href: hrefFor(next), locale: next }));
  };

  return (
    <div
      role="radiogroup"
      aria-label={t("languageLabel")}
      className={`relative inline-flex h-11 items-center rounded-full p-1 text-[0.8rem] font-bold tracking-[0.08em] ${className}`}
      style={{ background: "var(--toggle-bg)", color: "var(--toggle-ink)" }}
    >
      {routing.locales.map((code) => {
        const active = code === chosen;
        return (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={active}
            lang={code}
            onClick={() => go(code)}
            className="relative z-0 grid h-9 min-w-11 place-items-center rounded-full px-3 uppercase transition-colors duration-300 after:absolute after:inset-x-0 after:-inset-y-1 after:content-['']"
            style={{ color: active ? "var(--toggle-thumb-ink)" : "var(--toggle-ink)" }}
          >
            {active && (
              <m.span
                layoutId={`${id}-thumb`}
                className="absolute inset-0 -z-10 rounded-full"
                style={{ background: "var(--toggle-thumb)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              />
            )}
            {code}
          </button>
        );
      })}
    </div>
  );
}
