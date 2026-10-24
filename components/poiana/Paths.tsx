import type { SiteSettings } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { Armchair, ArrowRight, Brush, OpenBook } from "@/components/ui/icons";

// The three paths again below the hero, with equal weight: books, art, counselling
export function Paths({ site }: { site: SiteSettings }) {
  const rows = [
    { href: "/carti", icon: OpenBook, tint: "var(--color-petal)", ...site.pillars.books },
    { href: "/arta", icon: Brush, tint: "#dce8f5", ...site.pillars.art },
    { href: "/consiliere", icon: Armchair, tint: "var(--color-sage)", ...site.pillars.counselling },
  ] as const;
  return (
    <section aria-label={site.rolesShort} className="relative bg-cream px-4 pt-14 pb-20 sm:px-6 lg:pt-24">
      <div className="mx-auto max-w-6xl">
        <p className="display max-w-[24ch] text-[clamp(1.6rem,6vw,2.6rem)] leading-[1.15] font-[360] text-ink">{site.intro}</p>
        <ul className="mt-10 grid gap-3 lg:mt-14 lg:grid-cols-3 lg:gap-6">
          {rows.map(({ href, icon: Icon, tint, title, line }) => (
            <li key={href}>
              <Link
                href={href}
                className="group relative flex min-h-24 items-center gap-4 rounded-[1.75rem] py-4 pr-4 pl-4 transition-colors duration-300 hover:bg-white/60 lg:flex-col lg:items-start lg:gap-5 lg:p-6"
              >
                <span className="relative grid size-14 shrink-0 place-items-center text-ink">
                  <span className="paint-edge absolute inset-0 rounded-full" style={{ background: tint }} />
                  <Icon size={24} className="relative" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="display block text-[1.55rem] leading-tight text-ink">{title}</span>
                  <span className="mt-1 block text-[0.98rem] leading-snug text-ink-soft">{line}</span>
                </span>
                <ArrowRight size={20} className="shrink-0 text-violet transition-transform duration-300 group-hover:translate-x-1 lg:absolute lg:top-7 lg:right-6" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
