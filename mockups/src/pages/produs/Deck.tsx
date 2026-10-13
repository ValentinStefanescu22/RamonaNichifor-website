import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { img } from "../../shared/assets";
import type { Text } from "../../shared/content";
import { bookmarks, deck } from "../../shared/content-pages";
import { useLang } from "../../shared/lang";
import { spring } from "../../shared/motion";
import { Reveal, SectionTitle } from "../../site/Layout";
import { Reader, type Page } from "../carte/Leaf";

const ease = "cubic-bezier(0.23,1,0.32,1)";
const noMenu = (e: MouseEvent) => e.preventDefault();

/**
 * A few items held like a hand of cards, the middle one on top. It opens wider under the pointer,
 * or on a tap on phones; transform only, each item a beat after the one nearer the middle.
 */
export function Fan({ srcs, ratio, label, width = "38%" }: { srcs: string[]; ratio: string; label: Text; width?: string }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const mid = (srcs.length - 1) / 2;
  return (
    <button
      type="button"
      aria-label={t(label)}
      aria-pressed={open}
      onClick={() => setOpen((o) => !o)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      onContextMenu={noMenu}
      className="relative mx-auto block aspect-[1.4] w-[min(84vw,460px)] cursor-pointer"
    >
      {srcs.map((src, i) => {
        const k = i - mid;
        const angle = k * (open ? 14 : 8);
        const shift = k * (open ? 26 : 13);
        return (
          <img
            key={src}
            src={img(src)}
            alt=""
            draggable={false}
            className="art shadow-book absolute bottom-[2%] left-1/2 rounded-[8px]"
            style={{
              width,
              aspectRatio: ratio,
              transformOrigin: "50% 115%",
              transform: `translateX(calc(-50% + ${shift}%)) translateY(${k === 0 ? (open ? -7 : -3) : 0}%) rotate(${angle}deg)`,
              transition: `transform 300ms ${ease} ${Math.abs(k) * 30}ms`,
              zIndex: 10 - Math.abs(k) * 2,
            }}
          />
        );
      })}
    </button>
  );
}

/** Open / turn / close for the full-screen reader, with focus going back to the thumbnail it came from */
function useReader(count: number, prefix: string) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(null);
  const [turning, setTurning] = useState(false);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  return {
    open,
    triggers,
    show: (i: number) => {
      setTurning(false);
      setOpen(i);
    },
    close: () => {
      const at = open;
      setTurning(false);
      setOpen(null);
      if (at !== null) requestAnimationFrame(() => triggers.current[at]?.focus());
    },
    turn: (step: number) => {
      setTurning(true);
      setOpen((i) => (i === null ? i : (i + step + count) % count));
    },
    layout: (i: number) => (reduce ? undefined : `${prefix}-${i}`),
    layoutTransition: { layout: turning ? { duration: 0 } : spring },
  };
}

/** A tappable thumbnail that grows into the reader (shared layout); a render helper so it keeps its identity */
function thumb(
  r: ReturnType<typeof useReader>,
  i: number,
  page: Page,
  opts: { label: string; ratio: string; radius: string; tilt?: number; className?: string },
): ReactNode {
  return (
    <button
      key={page.src}
      ref={(el) => {
        r.triggers.current[i] = el;
      }}
      type="button"
      onClick={() => r.show(i)}
      onContextMenu={noMenu}
      aria-haspopup="dialog"
      aria-label={opts.label}
      className={`group block ${opts.className ?? ""}`}
    >
      {/* the lift lives on the wrapper so it never fights the shared-layout transform */}
      <span className="block transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1.5" style={{ rotate: `${opts.tilt ?? 0}deg` }}>
        <motion.span layoutId={r.layout(i)} transition={r.layoutTransition} className={`shadow-book block overflow-hidden bg-[#fffdf9] ${opts.radius}`}>
          <img src={img(page.src)} alt="" loading="lazy" draggable={false} className="art block w-full object-cover" style={{ aspectRatio: opts.ratio }} />
        </motion.span>
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ playing cards */

// Only what the page shows goes into the reader: the winner, the two pairs, the rules card
const shown = [deck.winner.n, 2, 3, 4, 5, deck.rulesCard];
const cardName = (n: number): Text =>
  n === deck.winner.n ? deck.winner.name : n === deck.rulesCard ? deck.rulesCardLabel : { ro: deck.cardNames[n - 2], en: deck.cardNames[n - 2] };
const cards: Page[] = shown.map((n) => ({ src: deck.card(n), label: cardName(n) }));

export function DeckFan() {
  return <Fan srcs={[3, 14, 1, 15, 23].map(deck.card)} ratio="63 / 88" label={deck.fanLabel} width="42%" />;
}

/** The two pairs, the winning card and the rules; any card opens the full-screen reader */
export function DeckSections() {
  const { t } = useLang();
  const r = useReader(cards.length, "card");
  const card = (n: number, tilt = 0, className = "") => {
    const i = shown.indexOf(n);
    return thumb(r, i, cards[i], { label: t(cards[i].label), ratio: "63 / 88", radius: "rounded-[7px]", tilt, className });
  };

  return (
    <>
      <section className="bg-cream px-4 pt-6 pb-16 sm:px-6 lg:pb-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle lead={t(deck.lead)}>{t(deck.title)}</SectionTitle>
          <ul className="mt-10 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-10 lg:gap-x-12">
            {deck.pairs.map((name, p) => {
              const a = 2 + p * 2;
              return (
                <li key={a}>
                  <Reveal i={p} className="flex flex-col items-center">
                    <div className="flex w-full justify-center pt-2">
                      {card(a, -4, "w-[56%]")}
                      {card(a + 1, 5, "-ml-[18%] w-[56%] translate-y-[6%]")}
                    </div>
                    <p className="mt-5 text-center text-[0.98rem] leading-snug font-medium text-ink">{t(name)}</p>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="bg-cream px-4 pb-20 sm:px-6 lg:pb-28">
        <div className="mx-auto grid max-w-6xl items-start gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal i={0} className="flex items-center gap-6 rounded-[2rem] bg-petal/60 p-6 sm:gap-8 sm:p-8">
            {card(deck.winner.n, -3, "w-[38%] max-w-[180px] shrink-0")}
            <div className="min-w-0">
              <h2 className="display text-[clamp(1.6rem,5.5vw,2.2rem)] leading-tight font-[380] text-ink">{t(deck.winnerTitle)}</h2>
              <p className="display mt-2 text-[1.2rem] leading-snug text-violet italic">{t(deck.winner.name)}</p>
              <p className="mt-3 text-[1.02rem] leading-relaxed text-ink-soft">{t(deck.winnerLine)}</p>
            </div>
          </Reveal>

          <div className="min-w-0">
            <h2 className="display text-[clamp(2rem,7vw,3rem)] font-[380] text-ink">{t(deck.rulesTitle)}</h2>
            <ol className="mt-6 flex flex-col gap-2.5 text-[1.05rem] text-ink">
              {deck.rules.map((rule, i) => (
                <li key={rule.ro} className="flex gap-3">
                  <span className="display w-6 shrink-0 text-right text-violet italic tabular-nums">{i + 1}</span>
                  <span>{t(rule)}</span>
                </li>
              ))}
            </ol>
            <h3 className="mt-8 font-bold text-ink">{t(deck.packTitle)}</h3>
            <ul className="mt-3 flex flex-col gap-2 text-[1.02rem] text-ink-soft">
              {deck.pack.map((x) => (
                <li key={x.ro} className="flex items-baseline gap-3">
                  <span className="size-1.5 shrink-0 translate-y-[-0.2em] rounded-full bg-lilac" aria-hidden="true" />
                  {t(x)}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-4">
              {card(deck.rulesCard, 0, "w-24 shrink-0")}
              <p className="text-[0.95rem] text-ink-soft">{t(deck.rulesCardLabel)}</p>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {r.open !== null && (
          <Reader
            key="reader"
            pages={cards}
            index={r.open}
            title={t(deck.title)}
            layoutId={r.layout(r.open)}
            layoutTransition={r.layoutTransition}
            onClose={r.close}
            onTurn={r.turn}
            ratio="63 / 88"
            frame="rounded-[12px]"
            labels={{ prev: deck.prev, next: deck.next }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ bookmarks */

const marks: Page[] = bookmarks.mottos.map((m, i) => ({ src: bookmarks.src(i + 1), label: m }));

export function BookmarkFan() {
  return <Fan srcs={[1, 6, 4].map(bookmarks.src)} ratio={bookmarks.ratio} label={bookmarks.fanLabel} width="24%" />;
}

/** All nine bookmarks standing in a row; any one opens the full-screen reader */
export function BookmarkSections() {
  const { t } = useLang();
  const r = useReader(marks.length, "mark");
  return (
    <>
      <section className="bg-cream pt-6 pb-16 lg:pb-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionTitle lead={t(bookmarks.lead)}>{t(bookmarks.title)}</SectionTitle>
        </div>
        <ul className="snap-row mt-10 flex gap-4 overflow-x-auto px-[max(1rem,calc((100vw-72rem)/2))] pb-6 sm:px-[max(1.5rem,calc((100vw-72rem)/2))] lg:mx-auto lg:grid lg:max-w-6xl lg:grid-cols-9 lg:gap-4 lg:overflow-visible lg:px-6">
          {marks.map((m, i) => (
            <li key={m.src} className="w-[28vw] max-w-[130px] shrink-0 lg:w-auto lg:max-w-none">
              <Reveal i={i % 5}>{thumb(r, i, m, { label: `${t(m.label)} (${i + 1})`, ratio: bookmarks.ratio, radius: "rounded-[6px]", className: "w-full" })}</Reveal>
            </li>
          ))}
        </ul>
      </section>

      <AnimatePresence>
        {r.open !== null && (
          <Reader
            key="reader"
            pages={marks}
            index={r.open}
            title={t(bookmarks.title)}
            layoutId={r.layout(r.open)}
            layoutTransition={r.layoutTransition}
            onClose={r.close}
            onTurn={r.turn}
            ratio={bookmarks.ratio}
            frame="rounded-[8px]"
            labels={{ prev: bookmarks.prev, next: bookmarks.next }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
