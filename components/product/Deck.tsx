"use client";
import { useState } from "react";
import Image from "next/image";
import type { Media } from "@/content/types";
import { Reader, Thumb, useReader, type ReaderPage } from "@/components/page/Reader";

// Port of mockups/src/pages/produs/Deck.tsx. The page picks the pictures (by file number, components/product/images.ts) and
// passes them with their copy; every picture keeps its own proportions (cards 63×88, bookmarks 345×1036), so nothing is cropped.

const ease = "cubic-bezier(0.23,1,0.32,1)";

/** The inner pages' h2 with its lead (mockups/src/site/Layout.tsx SectionTitle) */
export function SectionTitle({ title, lead }: { title: string; lead?: string }) {
  return (
    <div className="max-w-2xl">
      <h2 className="display text-[clamp(2.2rem,8.5vw,3.8rem)] font-[380] text-ink">{title}</h2>
      {lead && <p className="mt-4 max-w-[52ch] text-[1.08rem] leading-relaxed text-ink-soft">{lead}</p>}
    </div>
  );
}

/**
 * A few items held like a hand of cards, the middle one on top. It opens wider under the pointer, or on a tap on phones;
 * transform only, each item a beat after the one nearer the middle.
 */
export function Fan({ images, label, width, card = false }: { images: Media[]; label: string; width: string; card?: boolean }) {
  const [open, setOpen] = useState(false);
  const mid = (images.length - 1) / 2;
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={open}
      onClick={() => setOpen((o) => !o)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      onContextMenu={(e) => e.preventDefault()}
      className="relative mx-auto block aspect-[1.4] w-[min(84vw,460px)] cursor-pointer"
    >
      {images.map((img, i) => {
        const k = i - mid;
        return (
          <Image
            key={img.src}
            src={img.src}
            alt=""
            width={img.width}
            height={img.height}
            sizes="(min-width: 1024px) 200px, 40vw"
            priority={k === 0}
            draggable={false}
            {...(card && { "data-card": "" })}
            className="art shadow-book absolute bottom-[2%] left-1/2 h-auto rounded-[8px]"
            style={{
              width,
              aspectRatio: `${img.width} / ${img.height}`,
              transformOrigin: "50% 115%",
              transform: `translateX(calc(-50% + ${k * (open ? 26 : 13)}%)) translateY(${k === 0 ? (open ? -7 : -3) : 0}%) rotate(${k * (open ? 14 : 8)}deg)`,
              transition: `transform 300ms ${ease} ${Math.abs(k) * 30}ms`,
              zIndex: 10 - Math.abs(k) * 2,
            }}
          />
        );
      })}
    </button>
  );
}

export type DeckCopy = {
  title: string;
  lead: string;
  winnerTitle: string;
  winnerName: string;
  winnerLine: string;
  rulesTitle: string;
  rules: string[];
  packTitle: string;
  pack: string[];
  rulesCard: string;
  prev: string;
  next: string;
};

/**
 * The two public pairs (only Broscuță–Broscoi and Ciripel–Ciripica: the deck is for buying, not printing), the winning card
 * and the rules; any card opens the full-screen reader. A card whose file is missing simply drops out (a pair needs both).
 */
export function DeckSections({ pairs, winner, rulesCard, copy }: { pairs: { name: string; cards: [Media, Media] }[]; winner?: Media; rulesCard?: Media; copy: DeckCopy }) {
  const pages: ReaderPage[] = [
    ...(winner ? [{ ...winner, label: copy.winnerName }] : []),
    ...pairs.flatMap((p) => p.cards.map((c) => ({ ...c, label: c.alt || p.name }))),
    ...(rulesCard ? [{ ...rulesCard, label: copy.rulesCard }] : []),
  ];
  const r = useReader(pages.length, "card");
  const card = (m: Media, tilt = 0, className = "") => {
    const i = pages.findIndex((p) => p.src === m.src);
    return <Thumb key={m.src} r={r} i={i} page={pages[i]} label={pages[i].label} radius="rounded-[7px]" tilt={tilt} sizes="(min-width: 1024px) 180px, 30vw" className={className} imgProps={{ "data-card": "" }} />;
  };

  return (
    <>
      <section className="bg-cream px-4 pt-6 pb-16 sm:px-6 lg:pb-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle title={copy.title} lead={copy.lead} />
          <ul className="mt-10 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-10 lg:gap-x-12">
            {pairs.map((p) => (
              <li key={p.name} data-pair className="flex flex-col items-center">
                <div className="flex w-full justify-center pt-2">
                  {card(p.cards[0], -4, "w-[56%]")}
                  {card(p.cards[1], 5, "-ml-[18%] w-[56%] translate-y-[6%]")}
                </div>
                <p className="mt-5 text-center text-[0.98rem] leading-snug font-medium text-ink">{p.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cream px-4 pb-20 sm:px-6 lg:pb-28">
        <div className="mx-auto grid max-w-6xl items-start gap-14 lg:grid-cols-2 lg:gap-20">
          {winner && (
            <div className="flex items-center gap-6 rounded-[2rem] bg-petal/60 p-6 sm:gap-8 sm:p-8">
              {card(winner, -3, "w-[38%] max-w-[180px] shrink-0")}
              <div className="min-w-0">
                <h2 className="display text-[clamp(1.6rem,5.5vw,2.2rem)] leading-tight font-[380] text-ink">{copy.winnerTitle}</h2>
                <p className="display mt-2 text-[1.2rem] leading-snug text-violet italic">{copy.winnerName}</p>
                <p className="mt-3 text-[1.02rem] leading-relaxed text-ink-soft">{copy.winnerLine}</p>
              </div>
            </div>
          )}

          <div className="min-w-0">
            <h2 className="display text-[clamp(2rem,7vw,3rem)] font-[380] text-ink">{copy.rulesTitle}</h2>
            <ol className="mt-6 flex flex-col gap-2.5 text-[1.05rem] text-ink">
              {copy.rules.map((rule, i) => (
                <li key={rule} className="flex gap-3">
                  <span className="display w-6 shrink-0 text-right text-violet italic tabular-nums" aria-hidden="true">
                    {i + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ol>
            <h3 className="mt-8 font-bold text-ink">{copy.packTitle}</h3>
            <ul className="mt-3 flex flex-col gap-2 text-[1.02rem] text-ink-soft">
              {copy.pack.map((x) => (
                <li key={x} className="flex items-baseline gap-3">
                  <span className="size-1.5 shrink-0 translate-y-[-0.2em] rounded-full bg-lilac" aria-hidden="true" />
                  {x}
                </li>
              ))}
            </ul>
            {rulesCard && (
              <div className="mt-6 flex items-center gap-4">
                {card(rulesCard, 0, "w-24 shrink-0")}
                <p className="text-[0.95rem] text-ink-soft">{copy.rulesCard}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Reader r={r} pages={pages} title={copy.title} frame="rounded-[12px]" labels={{ prev: copy.prev, next: copy.next }} />
    </>
  );
}
