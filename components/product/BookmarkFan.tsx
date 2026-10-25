"use client";
import { Reader, Thumb, useReader, type ReaderPage } from "@/components/page/Reader";
import { SectionTitle } from "./Deck";

/** All the bookmarks standing in a row (in the order set in the admin), each with its motto; any one opens the reader. */
export function BookmarkSections({ marks, copy }: { marks: ReaderPage[]; copy: { title: string; lead: string; prev: string; next: string } }) {
  const r = useReader(marks.length, "mark");
  return (
    <section className="bg-cream pt-6 pb-16 lg:pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionTitle title={copy.title} lead={copy.lead} />
      </div>
      <ul className="snap-row mt-10 flex gap-4 overflow-x-auto px-[max(1rem,calc((100vw-72rem)/2))] pb-6 sm:px-[max(1.5rem,calc((100vw-72rem)/2))] lg:mx-auto lg:grid lg:max-w-6xl lg:grid-cols-9 lg:gap-4 lg:overflow-visible lg:px-6">
        {marks.map((m, i) => (
          <li key={m.src} className="w-[28vw] max-w-[130px] shrink-0 lg:w-auto lg:max-w-none">
            <Thumb r={r} i={i} page={m} label={`${m.label} (${i + 1})`} radius="rounded-[6px]" sizes="(min-width: 1024px) 120px, 28vw" className="w-full" />
          </li>
        ))}
      </ul>
      <Reader r={r} pages={marks} title={copy.title} frame="rounded-[8px]" labels={{ prev: copy.prev, next: copy.next }} />
    </section>
  );
}
