"use client";
import { useTranslations } from "next-intl";
import { Reader, Thumb, useReader, type ReaderPage } from "@/components/page/Reader";

const FRAME = "rounded-[3px_8px_8px_3px]";

/**
 * „Răsfoiește”: a few real pages of the book laid out like pages on a table (a snapping row on phones, three columns from
 * 1024px). A tap lifts one into the full-screen reader. The back cover comes first, as printed; every picture is whole.
 */
export function Leaf({ pages, title }: { pages: ReaderPage[]; title: string }) {
  const t = useTranslations("books");
  const r = useReader(pages.length, "leaf");
  return (
    <div data-leaf>
      <ul className="snap-row mt-8 flex gap-5 overflow-x-auto px-[max(1rem,calc((100vw-72rem)/2))] pb-6 sm:px-[max(1.5rem,calc((100vw-72rem)/2))] lg:mx-auto lg:grid lg:max-w-6xl lg:grid-cols-3 lg:gap-10 lg:overflow-visible lg:px-6">
        {pages.map((p, i) => (
          <li key={p.src} className="w-[66vw] max-w-[320px] shrink-0 lg:w-auto lg:max-w-none">
            <Thumb r={r} i={i} page={p} label={`${p.label}, ${title}`} radius={FRAME} sizes="(min-width: 1024px) 30vw, 66vw" className="w-full text-left" />
            <span className="mt-3 block text-[0.95rem] font-medium text-ink-soft" aria-hidden="true">
              {p.label}
            </span>
          </li>
        ))}
      </ul>
      <Reader r={r} pages={pages} title={title} frame={FRAME} labels={{ prev: t("prev"), next: t("next") }} />
    </div>
  );
}
