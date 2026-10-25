"use client";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ArtworkFull, Media } from "@/content/types";
import { PaperPlaceholder } from "@/components/page/PaperPlaceholder";
import { StatusChip } from "@/components/ui/StatusChip";
import { Availability } from "./Availability";
import { ArtFilters, type ArtFilter } from "./ArtFilters";

export type GalleryWork = Pick<ArtworkFull, "slug" | "title" | "technique" | "size" | "kind" | "availability" | "price"> & { image: Media | null };

const FILTERS: ArtFilter[] = ["all", "original", "print"];

/**
 * The gallery wall: a masonry by columns, so portrait, square and landscape works keep their shape (every picture whole).
 * The filter is client state over a list the server already rendered; works outside the filter are `hidden`. A category with
 * no works shows the designed „În curând” state instead of an empty wall.
 */
export function Gallery({ works }: { works: GalleryWork[] }) {
  const t = useTranslations("art");
  const tNav = useTranslations("nav");
  const tUi = useTranslations("ui");
  const [filter, setFilter] = useState<ArtFilter>("all");
  const [chosen, setChosen] = useState(false);
  const count = (f: ArtFilter) => (f === "all" ? works.length : works.filter((w) => w.kind === f).length);
  const shown = (w: GalleryWork) => filter === "all" || w.kind === filter;

  return (
    <>
      <ArtFilters
        label={tNav("art")}
        value={filter}
        filters={FILTERS.map((id) => ({ id, label: t(`filters.${id}`), count: count(id) }))}
        onChange={(id) => {
          setFilter(id);
          setChosen(true);
        }}
      />
      {count(filter) === 0 && (
        <PaperPlaceholder ratio="4 / 3" className="mt-10 max-w-sm rounded-[3px]">
          <StatusChip>{tUi("comingSoon")}</StatusChip>
          <p className="text-[1rem] text-ink-soft">{t("emptyFilter")}</p>
        </PaperPlaceholder>
      )}
      <ul key={filter} className={`gallery mt-10 ${chosen ? "tab-in" : ""}`}>
        {works.map((w, i) => (
          <li key={w.slug} hidden={!shown(w)} data-kind={w.kind} className={`mb-8 ${i % 3 === 1 ? "md:mt-10" : ""}`}>
            <Link href={{ pathname: "/arta/[slug]", params: { slug: w.slug } }} className="group block">
              <div className="rounded-[3px] bg-[#fffdf9] p-2.5 shadow-soft transition-transform duration-500 ease-(--ease-bloom) group-hover:-translate-y-1 group-hover:rotate-[0.6deg] sm:p-3">
                {w.image ? (
                  <Image src={w.image.src} alt="" width={w.image.width} height={w.image.height} sizes="(min-width: 1152px) 360px, (min-width: 768px) 30vw, 44vw" draggable={false} className="art block h-auto w-full" />
                ) : (
                  <PaperPlaceholder ratio={3 / 4} />
                )}
              </div>
              <div className="px-0.5 pt-3">
                <h3 className="display block text-[1.2rem] leading-tight text-ink">{w.title}</h3>
                <span className="mt-0.5 block text-[0.9rem] text-ink-soft">{[w.technique, w.size].filter(Boolean).join(" · ")}</span>
                <span className="mt-1 block">
                  <Availability availability={w.availability} price={w.price} />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
