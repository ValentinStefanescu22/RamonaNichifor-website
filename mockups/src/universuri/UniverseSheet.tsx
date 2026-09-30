import { useEffect, useRef } from "react";
import { motion, useDragControls, useReducedMotion } from "motion/react";
import { img } from "../shared/assets";
import { Butterfly } from "../shared/Butterfly";
import type { UniverseId } from "../shared/content";
import { book, nav, site, ui, universes } from "../shared/content";
import { Creature } from "../shared/creatures";
import { ArrowUpRight, Instagram } from "../shared/icons";
import { useLang } from "../shared/lang";

export function UniverseSheet({ id, onClose }: { id: UniverseId; onClose: () => void }) {
  const { t } = useLang();
  const drag = useDragControls();
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const u = universes.find((x) => x.id === id)!;
  const live = u.status === "available";

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:p-8">
      <div className="absolute inset-0 bg-night/55 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={t(u.name)}
        className="relative flex max-h-[88svh] w-full max-w-xl flex-col overflow-hidden rounded-t-[2rem] shadow-2xl lg:rounded-[2rem]"
        style={{ viewTransitionName: "universe-sheet", background: `linear-gradient(180deg, ${u.tint[0]} 0%, var(--color-cream) 46%)` }}
        drag={reduce ? false : "y"}
        dragListener={false}
        dragControls={drag}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.04, bottom: 0.85 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 120 || info.velocity.y > 650) onClose();
        }}
      >
        <div
          className="flex h-9 shrink-0 cursor-grab touch-none items-center justify-center active:cursor-grabbing lg:hidden"
          onPointerDown={(e) => drag.start(e)}
        >
          <span className="h-1.5 w-11 rounded-full bg-ink/20" />
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label={t(nav.close)}
          className="absolute top-3 right-3 z-10 grid size-11 place-items-center rounded-full bg-cream/80 text-ink transition-transform active:scale-95"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <div className="overflow-y-auto overscroll-contain px-6 pb-[calc(env(safe-area-inset-bottom,0px)+28px)] lg:pt-8">
          <div className="flex items-center gap-5">
            <div className="relative grid size-24 shrink-0 place-items-center rounded-full" style={{ background: `radial-gradient(circle at 36% 30%, #fff8f1, ${u.tint[1]} 90%)` }}>
              <span className="w-[66%]">{live ? <Butterfly width="100%" tempo={0.9} /> : <Creature id={u.id as "buburuza"} size={56} style={{ color: u.tint[2] }} />}</span>
            </div>
            <div className="min-w-0">
              <h2 className="display text-[2rem] font-semibold text-ink">{t(u.name)}</h2>
              <p className="mt-1 text-[1rem] text-ink-soft italic">{t(u.book)}</p>
            </div>
          </div>
          <p className="mt-5 text-[1.05rem] text-ink-soft">{t(u.hook)}</p>

          <h3 className="mt-7 text-[0.9rem] font-bold text-ink">{t(ui.inThisUniverse)}</h3>
          <ul className="mt-3 divide-y divide-ink/10 rounded-2xl bg-white/60 ring-1 ring-ink/5">
            {u.items.map((item, i) => {
              const ready = item.status === "available";
              return (
                <li key={i} className="flex items-center gap-4 px-4 py-3.5">
                  {ready && live && i === 0 ? (
                    <img src={img("cover-fluturele.webp")} alt="" className="h-16 w-11 rounded-[3px] object-cover shadow-md" />
                  ) : (
                    <span className="grid h-16 w-11 place-items-center rounded-[4px]" style={{ background: u.tint[0] }} aria-hidden="true">
                      <span className="size-3 rounded-full" style={{ background: u.tint[1] }} />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-ink">{t(item.name)}</span>
                    <span className="text-[0.9rem] text-ink-soft">{t(ready ? ui.available : ui.comingSoon)}</span>
                  </span>
                </li>
              );
            })}
          </ul>

          {live ? (
            <div className="mt-6">
              <p className="text-[0.9rem] font-bold text-ink">{t(ui.buyAt)}</p>
              <div className="mt-2 grid grid-cols-2 gap-3">
                {book.stores.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-night px-5 font-bold text-cream transition-transform active:scale-[0.97]"
                  >
                    {s.name}
                    <ArrowUpRight size={17} />
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <a
              href={site.contact.instagram.href}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-night px-5 font-bold text-cream transition-transform active:scale-[0.97]"
            >
              <Instagram size={18} />
              {t(ui.notifyMe)}
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}
