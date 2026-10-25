"use client";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import type { Media } from "@/content/types";
import { ArrowRight, Close } from "@/components/ui/icons";

// Port of the mockup's full-screen reader (mockups/src/pages/carte/Leaf.tsx Reader): the deck and the bookmarks use it here,
// the book's Răsfoiește can reuse it. A thumbnail grows into it (shared layout), arrows / a swipe / ← → turn, Esc closes,
// focus stays inside and goes back to the thumbnail it came from. Every picture is shown whole, in its own proportions.

export type ReaderPage = Media & { label: string };

const easeOut = [0.16, 1, 0.3, 1] as const;
const spring = { type: "spring", bounce: 0, duration: 0.45 } as const;
const ratioOf = (p: Media) => `${p.width} / ${p.height}`;

/** Open / turn / close state, plus the thumbnails' layout ids (none under reduced motion: the reader just fades) */
export function useReader(count: number, prefix: string) {
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
export type ReaderState = ReturnType<typeof useReader>;

/** A tappable thumbnail that grows into the reader. `data` attributes go on the image (tests read `data-card`). */
export function Thumb({
  r,
  i,
  page,
  label,
  radius,
  tilt = 0,
  sizes,
  className = "",
  imgProps,
}: {
  r: ReaderState;
  i: number;
  page: ReaderPage;
  label: string;
  radius: string;
  tilt?: number;
  sizes: string;
  className?: string;
  imgProps?: Record<`data-${string}`, string>;
}) {
  return (
    <button
      ref={(el) => {
        r.triggers.current[i] = el;
      }}
      type="button"
      onClick={() => r.show(i)}
      onContextMenu={(e) => e.preventDefault()}
      aria-haspopup="dialog"
      aria-label={label}
      className={`group block ${className}`}
    >
      {/* the lift lives on the wrapper so it never fights the shared-layout transform */}
      <span className="block transition-transform duration-300 ease-(--ease-bloom) group-hover:-translate-y-1.5" style={{ rotate: `${tilt}deg` }}>
        <m.span layoutId={r.layout(i)} transition={r.layoutTransition} className={`shadow-book block overflow-hidden bg-paper-mat ${radius}`}>
          <Image
            src={page.src}
            alt=""
            width={page.width}
            height={page.height}
            sizes={sizes}
            draggable={false}
            className="art block h-auto w-full"
            style={{ aspectRatio: ratioOf(page) }}
            {...imgProps}
          />
        </m.span>
      </span>
    </button>
  );
}

export function Reader({
  r,
  pages,
  title,
  frame,
  labels,
}: {
  r: ReaderState;
  pages: ReaderPage[];
  title: string;
  /** corner radius classes of the picture */
  frame: string;
  labels: { prev: string; next: string };
}) {
  return <AnimatePresence>{r.open !== null && <Panel key="reader" r={r} index={r.open} pages={pages} title={title} frame={frame} labels={labels} />}</AnimatePresence>;
}

function Panel({ r, index, pages, title, frame, labels }: { r: ReaderState; index: number; pages: ReaderPage[]; title: string; frame: string; labels: { prev: string; next: string } }) {
  const t = useTranslations("product");
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const page = pages[index];
  const layoutId = r.layout(index);

  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Esc closes, ← → turn, and Tab stays inside the reader
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") return r.close();
    if (e.key === "ArrowRight") return r.turn(1);
    if (e.key === "ArrowLeft") return r.turn(-1);
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
  const button = (step: number, label: string, icon: ReactNode) => (
    <button type="button" onClick={() => r.turn(step)} aria-label={label} className={roundBtn}>
      {icon}
    </button>
  );

  return (
    <div
      ref={panel}
      role="dialog"
      aria-modal="true"
      aria-label={`${title}: ${page.label}`}
      onKeyDown={onKey}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 px-4 pt-[calc(env(safe-area-inset-top,0px)+4.5rem)] pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)]"
    >
      <m.div {...fade} className="absolute inset-0 bg-[rgb(52_34_74/0.72)] backdrop-blur-md" onClick={r.close} aria-hidden="true" />

      <m.div {...fade} className="absolute top-[calc(env(safe-area-inset-top,0px)+14px)] right-4">
        <button ref={closeRef} type="button" onClick={r.close} aria-label={t("close")} className={roundBtn}>
          <Close size={18} />
        </button>
      </m.div>

      {/* The frame takes the largest size of the picture's own proportions that fits this box (width, height, 78% of the screen):
          with both a height and a max-width the frame would squeeze to a narrower ratio on a phone and letterbox the picture. */}
      <div className="relative flex min-h-0 w-full max-w-5xl flex-1 items-center justify-center" style={{ containerType: "size" }}>
        <m.div
          layoutId={layoutId}
          transition={layoutId ? r.layoutTransition : fade.transition}
          className={`shadow-book relative overflow-hidden bg-paper-mat ${frame}`}
          style={{ aspectRatio: ratioOf(page), width: `min(100cqw, calc(min(100cqh, 78svh, 1300px) * ${page.width / page.height}))` }}
          drag={reduce ? false : "x"}
          dragSnapToOrigin
          dragElastic={0.35}
          onDragEnd={(_, info) => {
            if (info.offset.x < -70 || info.velocity.x < -500) r.turn(1);
            else if (info.offset.x > 70 || info.velocity.x > 500) r.turn(-1);
          }}
          {...(layoutId ? {} : { initial: fade.initial, animate: fade.animate, exit: fade.exit })}
        >
          {/* a quick crossfade between pictures; the frame itself stays put */}
          <AnimatePresence initial={false}>
            <m.div key={page.src} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15, ease: "easeOut" }}>
              <Image src={page.src} alt={page.alt || `${title}: ${page.label}`} fill sizes="(min-width: 1024px) 60vw, 92vw" draggable={false} className="art object-contain" />
            </m.div>
          </AnimatePresence>
        </m.div>
      </div>

      <m.div {...fade} className="relative flex items-center gap-4 text-cream">
        {button(-1, labels.prev, <ArrowRight size={18} className="rotate-180" />)}
        <p className="min-w-[9.5rem] text-center text-[1rem]" aria-live="polite">
          <span className="font-bold">{page.label}</span>
          <span className="tabular-nums">
            {" · "}
            {index + 1} {t("of")} {pages.length}
          </span>
        </p>
        {button(1, labels.next, <ArrowRight size={18} />)}
      </m.div>
    </div>
  );
}
