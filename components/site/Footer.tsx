"use client";
import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import type { SiteSettings } from "@/content/types";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Link } from "@/i18n/navigation";
import { menu, type PageId } from "@/lib/menu";
import { SocialLinks } from "./SocialLinks";

/**
 * One footer for the whole site. Every page lands on the same meadow; only the light above it
 * changes, picking up the page's own ground so the page flows into the footer without a seam.
 */
export type Ground = "cream" | "sky" | "sage" | "mist" | "petal";

const grounds: Record<Ground, { bg: string; chip: string }> = {
  cream: { bg: "var(--color-cream)", chip: "color-mix(in oklab, var(--color-petal) 70%, transparent)" },
  // Universuri: the sky page ends in cream, and the footer opens back into sky above the meadow
  sky: {
    bg: "linear-gradient(180deg, var(--color-cream) 0%, #ece6f5 38%, #dbe7f4 78%, #d6e6f5 100%)",
    chip: "rgb(255 255 255 / 0.6)",
  },
  // Consiliere closes on a pale sage band, so the footer starts from that same pale sage
  sage: { bg: "linear-gradient(180deg, #eef2e8 0%, var(--color-cream) 80%)", chip: "rgb(255 255 255 / 0.65)" },
  mist: { bg: "linear-gradient(180deg, var(--color-mist) 0%, var(--color-cream) 78%)", chip: "color-mix(in oklab, var(--color-sky) 70%, transparent)" },
  petal: { bg: "linear-gradient(180deg, var(--color-petal) 0%, var(--color-cream) 80%)", chip: "rgb(255 255 255 / 0.65)" },
};

const meadowFade = "linear-gradient(180deg, transparent 0%, #000 34%)";

export function Footer({
  current,
  ground = "cream",
  contacts,
  souls,
}: {
  current?: PageId;
  ground?: Ground;
  contacts: SiteSettings["contacts"];
  souls: string;
}) {
  const t = useTranslations();
  const g = grounds[ground];
  return (
    <footer className="relative isolate overflow-hidden pt-20" style={{ background: g.bg }}>
      <div className="mx-auto max-w-[75rem] px-4 sm:px-6">
        <p className="display text-[clamp(2.6rem,11vw,5rem)] leading-none font-[380] text-ink">
          Ramona <span className="display-wonk italic text-violet">Nichifor</span>
        </p>
        <p className="display mt-3 text-[1.3rem] italic text-ink-soft">{souls}</p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2" style={{ "--chip": g.chip } as CSSProperties}>
          <div className="space-y-3 text-ink">
            <SocialLinks contacts={contacts} />
            <CopyEmail email={contacts.email} className="text-[0.98rem] text-ink-soft [&_button]:bg-(--chip) [&_button]:text-ink" />
          </div>
          <nav aria-label={t("nav.footer")} className="grid grid-flow-col grid-cols-2 grid-rows-4 gap-x-6 text-[1rem] text-ink-soft">
            {menu.map((p) => (
              <Link
                key={p.id}
                href={p.href}
                aria-current={p.id === current ? "page" : undefined}
                className="flex min-h-11 items-center hover:text-ink aria-[current=page]:font-medium aria-[current=page]:text-ink"
              >
                {t(`nav.${p.labelKey}`)}
              </Link>
            ))}
          </nav>
        </div>
        <p className="relative z-10 mt-10 pb-3 text-[0.85rem] text-ink-soft">© 2026 Ramona Nichifor · {t("footer.placeholders")}</p>
      </div>
      <img
        loading="lazy"
        src="/img/meadow-wide.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none -mt-10 h-[180px] w-full object-cover object-bottom sm:h-[240px]"
        style={{ maskImage: meadowFade, WebkitMaskImage: meadowFade }}
      />
    </footer>
  );
}
