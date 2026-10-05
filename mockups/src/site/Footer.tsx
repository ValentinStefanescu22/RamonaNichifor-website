import type { CSSProperties } from "react";
import { img } from "../shared/assets";
import { mockupNote, site } from "../shared/content";
import { CopyEmail } from "../shared/CopyEmail";
import { useLang } from "../shared/lang";
import { SocialLinks } from "./Chrome";
import { menu, type PageId } from "./pages";

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

export function Footer({ current, ground = "cream" }: { current: PageId; ground?: Ground }) {
  const { t } = useLang();
  const g = grounds[ground];
  const links = menu;
  return (
    <footer className="relative isolate overflow-hidden pt-20" style={{ background: g.bg } as CSSProperties}>
      <div className="mx-auto max-w-[75rem] px-4 sm:px-6">
        <p className="display text-[clamp(2.6rem,11vw,5rem)] leading-none font-[380] text-ink">
          Ramona <span className="display-wonk italic text-violet">Nichifor</span>
        </p>
        <p className="display mt-3 text-[1.3rem] italic text-ink-soft">{t(site.souls)}</p>
        <div className="mt-10 grid gap-8 sm:grid-cols-2" style={{ "--chip": g.chip } as CSSProperties}>
          <div className="space-y-3 text-ink">
            <SocialLinks />
            <CopyEmail className="text-[0.98rem] text-ink-soft [&_button]:bg-(--chip) [&_button]:text-ink" />
          </div>
          <nav aria-label="Subsol" className="grid grid-flow-col grid-cols-2 grid-rows-4 gap-x-6 text-[1rem] text-ink-soft">
            {links.map((p) => (
              <a
                key={p.id}
                href={p.href}
                aria-current={p.id === current ? "page" : undefined}
                className="flex min-h-11 items-center hover:text-ink aria-[current=page]:font-medium aria-[current=page]:text-ink"
              >
                {t(p.label)}
              </a>
            ))}
          </nav>
        </div>
        <p className="relative z-10 mt-10 pb-3 text-[0.85rem] text-ink-soft">
          © 2026 Ramona Nichifor · {t(mockupNote.placeholders)}
        </p>
      </div>
      <img
        src={img("meadow-wide.webp")}
        alt=""
        aria-hidden="true"
        className="pointer-events-none -mt-10 h-[180px] w-full object-cover object-bottom sm:h-[240px]"
        style={{ maskImage: "linear-gradient(180deg, transparent 0%, #000 34%)", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 34%)" }}
      />
    </footer>
  );
}
