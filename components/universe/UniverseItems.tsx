import { getTranslations } from "next-intl/server";
import type { UniverseFull } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { Painted } from "@/components/page/Painted";
import { fanOf } from "@/components/product/images";
import { ArrowRight } from "@/components/ui/icons";
import { StatusChip } from "@/components/ui/StatusChip";

/**
 * A universe's items: its book(s) first, then its keepsakes in shop order; every one opens its own page (the book the same
 * page Cărți links to). `universe`: the glass tiles of „În acest univers” (2 · 3 from 640 · 5 from 1024). `product`:
 * „Din același univers” under a product page, without the product itself (2 · 4 from 640).
 */
export async function UniverseItems({ u, variant, exclude }: { u: UniverseFull; variant: "universe" | "product"; exclude?: string }) {
  const t = await getTranslations();
  const items = [
    ...u.books.map((b) => ({
      key: `book-${b.slug}`,
      href: { pathname: "/carti/[slug]" as const, params: { slug: b.slug } },
      name: b.title,
      art: (
        <div className={variant === "universe" ? "w-[52%]" : "w-[56%]"}>
          <Painted variant="book" title={b.title} cover={b.cover} tint={u.tint} sizes="(min-width: 1024px) 120px, 26vw" />
        </div>
      ),
      // a book that is out shows its year, not a badge (DESIGN.md Status badges)
      status: b.status === "published" ? <span className="tabular-nums">{b.year || null}</span> : <StatusChip>{t(b.status === "writing" ? "ui.inProgress" : "ui.comingSoon")}</StatusChip>,
    })),
    ...u.products
      .filter((p) => p.slug !== exclude)
      .map((p) => ({
        key: `product-${p.slug}`,
        href: { pathname: "/universuri/[slug]/[product]" as const, params: { slug: u.slug, product: p.slug } },
        name: p.name,
        art: <Painted variant="product" kind={p.kind} tint={u.tint} images={fanOf(p.gallery, p.images)} className="w-full" />,
        status: p.status === "available" ? <span>{t("universes.available")}</span> : <StatusChip>{t("ui.comingSoon")}</StatusChip>,
      })),
  ];

  if (variant === "product")
    return (
      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 lg:gap-8">
        {items.map((item) => (
          <li key={item.key}>
            <Link href={item.href} className="group block">
              <div
                className="grid aspect-[4/5] place-items-center overflow-hidden rounded-[1.5rem] transition-transform duration-500 ease-(--ease-bloom) group-hover:-translate-y-1.5"
                style={{ background: `color-mix(in oklab, ${u.tint[0]} 60%, white)` }}
              >
                {item.art}
              </div>
              <p className="display mt-3 text-[1.05rem] leading-tight text-ink sm:text-[1.2rem]">{item.name}</p>
              <p className="mt-1.5 text-[0.88rem] text-ink-soft">{item.status}</p>
            </Link>
          </li>
        ))}
      </ul>
    );

  return (
    <ul data-items className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
      {items.map((item) => (
        <li key={item.key}>
          <Link
            href={item.href}
            className="group block h-full overflow-hidden rounded-[1.5rem] bg-cream/80 ring-1 ring-ink/5 backdrop-blur-sm transition-transform duration-500 ease-(--ease-bloom) hover:-translate-y-1 active:scale-[0.98]"
          >
            <div className="grid aspect-[4/5] place-items-center" style={{ background: `color-mix(in oklab, ${u.tint[0]} 70%, white)` }}>
              {item.art}
            </div>
            <div className="flex items-end justify-between gap-2 px-4 py-3">
              <span className="min-w-0">
                <span className="block font-bold text-ink">{item.name}</span>
                <span className="mt-1 block text-[0.9rem] text-ink-soft">{item.status}</span>
              </span>
              <ArrowRight size={17} className="mb-1 shrink-0 text-ink-soft transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-ink" />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
