import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { img } from "../../shared/assets";
import { nav, type Text } from "../../shared/content";
import { bookPage } from "../../shared/content-pages";
import { ArrowRight, Close } from "../../shared/icons";
import { easeOut, spring } from "../../shared/motion";
import { useLang } from "../../shared/lang";

type Page = { src: string; label: Text };

/**
 * „Răsfoiește”: a few real pages of the book, laid out like pages on a table. Tapping one lifts it
 * into a full-screen reader that grows out of the page itself (shared layout), where the arrows,
 * a swipe or ← → turn to the next one. Turning is instant plus a short crossfade; only opening
 * and closing travel, so the reader never makes you wait.
 */
export function Leaf({ pages, title }: { pages: Page[]; title: string }) {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState<number | null>(null);
  // While turning pages inside the reader, layout changes snap instead of flying back to the strip
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
    setOpen((i) => (i === null ? i : (i + step + pages.length) % pages.length));
  };

  const layout = (i: number) => (reduce ? undefined : `leaf-${i}`);
  const layoutTransition = { layout: turning ? { duration: 0 } : spring };

  return (
    <>
      <ul className="snap-row mt-8 flex gap-5 overflow-x-auto px-[max(1rem,calc((100vw-72rem)/2))] pb-6 sm:px-[max(1.5rem,calc((100vw-72rem)/2))] lg:mx-auto lg:grid lg:max-w-6xl lg:grid-cols-3 lg:gap-10 lg:overflow-visible lg:px-6">
        {pages.map((p, i) => (
          <li key={p.src} className="w-[66vw] max-w-[320px] shrink-0 lg:w-auto lg:max-w-none">
            <button
              ref={(el) => {
                triggers.current[i] = el;
              }}
              type="button"
              onClick={() => show(i)}
              aria-haspopup="dialog"
              aria-label={`${t(p.label)}, ${title}`}
              className="group block w-full text-left"
            >
              {/* the lift lives on the wrapper so it never fights the shared-layout transform below */}
              <div className={`transition-transform duration-500 ease-(--ease-bloom) group-hover:-translate-y-1.5 ${i % 2 ? "group-hover:rotate-[0.8deg]" : "group-hover:-rotate-[0.8deg]"}`}>
                <motion.div layoutId={layout(i)} transition={layoutTransition} className="shadow-book overflow-hidden rounded-[3px_8px_8px_3px] bg-[#fffdf9]">
                  <img src={img(p.src)} alt="" loading="lazy" className="aspect-[919/1300] w-full object-cover" />
                </motion.div>
              </div>
              <span className="mt-3 block text-[0.95rem] font-medium text-ink-soft group-hover:text-ink">{t(p.label)}</span>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open !== null && (
          <Reader key="reader" pages={pages} index={open} title={title} layoutId={layout(open)} layoutTransition={layoutTransition} onClose={close} onTurn={turn} />
        )}
      </AnimatePresence>
    </>
  );
}

function Reader({
  pages,
  index,
  title,
  layoutId,
  layoutTransition,
  onClose,
  onTurn,
}: {
  pages: Page[];
  index: number;
  title: string;
  layoutId?: string;
  layoutTransition: object;
  onClose: () => void;
  onTurn: (step: number) => void;
}) {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const page = pages[index];

  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Esc closes, ← → turn, and Tab stays inside the reader
  const onKey = (e: ReactKeyboardEvent) => {
    if (e.key === "Escape") return onClose();
    if (e.key === "ArrowRight") return onTurn(1);
    if (e.key === "ArrowLeft") return onTurn(-1);
    if (e.key !== "Tab" || !panel.current) return;
    const items = panel.current.querySelectorAll<HTMLElement>("button");
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.25, ease: easeOut } };
  const roundBtn = "grid size-11 place-items-center rounded-full bg-cream/85 text-ink shadow-soft ring-1 ring-ink/10 backdrop-blur-md transition-transform duration-150 active:scale-[0.94]";

  return (
    <div
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label={`${title}: ${t(page.label)}`}
      onKeyDown={onKey}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 px-4 pt-[calc(env(safe-area-inset-top,0px)+4.5rem)] pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)]"
    >
      <motion.div {...fade} className="absolute inset-0 bg-[rgb(52_34_74/0.72)] backdrop-blur-md" onClick={onClose} aria-hidden="true" />

      <motion.div {...fade} className="absolute top-[calc(env(safe-area-inset-top,0px)+14px)] right-4">
        <button ref={closeRef} type="button" onClick={onClose} aria-label={t(nav.close)} className={roundBtn}>
          <Close size={18} />
        </button>
      </motion.div>

      <div className="relative flex min-h-0 w-full max-w-5xl flex-1 items-center justify-center">
        <motion.div
          layoutId={layoutId}
          transition={layoutId ? layoutTransition : fade.transition}
          className="shadow-book relative h-full max-h-[min(78svh,1300px)] overflow-hidden rounded-[3px_8px_8px_3px] bg-[#fffdf9]"
          style={{ aspectRatio: "919 / 1300" }}
          drag={reduce ? false : "x"}
          dragSnapToOrigin
          dragElastic={0.35}
          onDragEnd={(_, info) => {
            if (info.offset.x < -70 || info.velocity.x < -500) onTurn(1);
            else if (info.offset.x > 70 || info.velocity.x > 500) onTurn(-1);
          }}
          {...(layoutId ? {} : { initial: fade.initial, animate: fade.animate, exit: fade.exit })}
        >
          {/* a quick crossfade between pages; the frame itself stays put */}
          <AnimatePresence initial={false}>
            <motion.img
              key={page.src}
              src={img(page.src)}
              alt={`${title}: ${t(page.label)}`}
              draggable={false}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            />
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.div {...fade} className="relative flex items-center gap-4 text-cream">
        <button type="button" onClick={() => onTurn(-1)} aria-label={t(bookPage.prev)} className={roundBtn}>
          <ArrowRight size={18} className="rotate-180" />
        </button>
        <p className="min-w-[9.5rem] text-center text-[1rem]" aria-live="polite">
          <span className="font-semibold">{t(page.label)}</span>
          <span className="tabular-nums">
            {" · "}
            {index + 1} {t(bookPage.pageOf)} {pages.length}
          </span>
        </p>
        <button type="button" onClick={() => onTurn(1)} aria-label={t(bookPage.next)} className={roundBtn}>
          <ArrowRight size={18} />
        </button>
      </motion.div>
    </div>
  );
}
