import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { img } from "../../shared/assets";
import type { Text } from "../../shared/content";
import { deck } from "../../shared/content-pages";
import { useLang } from "../../shared/lang";
import { spring } from "../../shared/motion";
import { Reveal, SectionTitle } from "../../site/Layout";
import { Reader, type Page } from "../carte/Leaf";

const ease = "cubic-bezier(0.23,1,0.32,1)";

/** Every card in printer order, named for alt text and the reader's caption */
const cards: Page[] = Array.from({ length: 24 }, (_, i) => {
  const n = i + 1;
  const label: Text =
    n === deck.winner.n ? deck.winner.name : n === deck.rulesCard ? deck.rulesCardLabel : { ro: deck.cardNames[n - 2], en: deck.cardNames[n - 2] };
  return { src: deck.card(n), label };
});

/**
 * The deck held like a hand of cards: the winner in the middle, two pairs either side. It opens
 * wider under the pointer, or on a tap on phones; transform only, each card a beat after the last.
 */
export function DeckFan() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const hand = [3, 14, 1, 15, 23];
  return (
    <button
      type="button"
      aria-label={t(deck.fanLabel)}
      aria-pressed={open}
      onClick={() => setOpen((o) => !o)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      className="relative mx-auto block aspect-[1.4] w-[min(84vw,460px)] cursor-pointer"
    >
      {hand.map((n, i) => {
        const k = i - 2; // -2 … 2
        const angle = k * (open ? 14 : 8);
        const shift = k * (open ? 26 : 13);
        return (
          <img
            key={n}
            src={img(deck.card(n))}
            alt=""
            draggable={false}
            className="shadow-book absolute bottom-[2%] left-1/2 w-[42%] rounded-[8px]"
            style={{
              aspectRatio: "63 / 88",
              transformOrigin: "50% 115%",
              transform: `translateX(calc(-50% + ${shift}%)) translateY(${k === 0 ? (open ? -7 : -3) : 0}%) rotate(${angle}deg)`,
              transition: `transform 300ms ${ease} ${Math.abs(k) * 30}ms`,
              zIndex: k === 0 ? 3 : 2 - Math.abs(k) + 1,
            }}
          />
        );
      })}
    </button>
  );
}

/** The pairs, the winning card and the rules; any card opens the full-screen reader */
export function DeckSections() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(null);
  const [turning, setTurning] = useState(false);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  const show = (i: number) => {
    setTurning(false);
    setOpen(i);
  };
  const close = () => {
    const at = open;
    setTurning(false);
    setOpen(null);
    if (at !== null) requestAnimationFrame(() => triggers.current[at]?.focus());
  };
  const turn = (step: number) => {
    setTurning(true);
    setOpen((i) => (i === null ? i : (i + step + cards.length) % cards.length));
  };
  const layout = (i: number) => (reduce ? undefined : `card-${i}`);
  const layoutTransition = { layout: turning ? { duration: 0 } : spring };

  /** One card you can tap: n is the printer's card number */
  // a render helper, not a component, so thumbnails keep their identity across renders (the shared-layout morph needs that)
  const card = (n: number, tilt = 0, className = "") => {
    const i = n - 1;
    return (
      <button
        key={n}
        ref={(el) => {
          triggers.current[i] = el;
        }}
        type="button"
        onClick={() => show(i)}
        aria-haspopup="dialog"
        aria-label={t(cards[i].label)}
        className={`group block ${className}`}
      >
        {/* the lift lives on the wrapper so it never fights the shared-layout transform */}
        <span className="block transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:-translate-y-1.5" style={{ rotate: `${tilt}deg` }}>
          <motion.span layoutId={layout(i)} transition={layoutTransition} className="shadow-book block overflow-hidden rounded-[7px] bg-[#fffdf9]">
            <img src={img(cards[i].src)} alt="" loading="lazy" className="block aspect-[63/88] w-full object-cover" />
          </motion.span>
        </span>
      </button>
    );
  };

  return (
    <>
      <section className="bg-cream px-4 pt-6 pb-16 sm:px-6 lg:pb-24">
        <div className="mx-auto max-w-6xl">
          <SectionTitle lead={t(deck.lead)}>{t(deck.title)}</SectionTitle>
          <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-10 lg:gap-y-14">
            {deck.pairs.map((name, p) => {
              const a = 2 + p * 2;
              return (
                <li key={a}>
                  <Reveal i={p % 4} className="flex flex-col items-center">
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
              {deck.rules.map((r, i) => (
                <li key={r.ro} className="flex gap-3">
                  <span className="display w-6 shrink-0 text-right text-violet italic tabular-nums">{i + 1}</span>
                  <span>{t(r)}</span>
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
        {open !== null && (
          <Reader
            key="reader"
            pages={cards}
            index={open}
            title={t(deck.title)}
            layoutId={layout(open)}
            layoutTransition={layoutTransition}
            onClose={close}
            onTurn={turn}
            ratio="63 / 88"
            frame="rounded-[12px]"
            labels={{ prev: deck.prev, next: deck.next }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
