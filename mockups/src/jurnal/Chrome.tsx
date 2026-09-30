import { useEffect, useState } from "react";
import { AnimatePresence, motion, useDragControls, useMotionValueEvent, useScroll } from "motion/react";
import { nav, site } from "../shared/content";
import { Facebook, Instagram, WhatsApp } from "../shared/icons";
import { LangToggle, useLang } from "../shared/lang";
import { easeOut, springSheet } from "../shared/motion";
import { chapters, words } from "./journal";

/** Which chapter is under the reading line */
export function useCurrentChapter() {
  const [current, setCurrent] = useState<string | null>(null);
  useEffect(() => {
    const els = chapters.map((c) => document.getElementById(c.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const top = new IntersectionObserver(([e]) => e.isIntersecting && setCurrent(null), { rootMargin: "0px 0px -60% 0px" });
    const hero = document.getElementById("despre");
    if (hero) top.observe(hero);
    return () => {
      io.disconnect();
      top.disconnect();
    };
  }, []);
  return current;
}

export function Header({ onContents }: { onContents: () => void }) {
  const { t } = useLang();
  return (
    <header className="relative z-20 mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8 lg:py-5">
      <a href="#despre" className="display inline-flex min-h-11 items-center text-[1.55rem] italic">
        R. Nichifor
      </a>
      <div className="flex items-center gap-2">
        <LangToggle id="head" />
        <button
          type="button"
          onClick={onContents}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-[0.95rem] text-paper transition-transform duration-150 active:scale-[0.96]"
        >
          <span className="flex flex-col gap-[3px]" aria-hidden="true">
            <span className="h-px w-4 bg-current" />
            <span className="h-px w-4 bg-current" />
            <span className="h-px w-2.5 bg-current" />
          </span>
          {t(words.contents)}
        </button>
      </div>
    </header>
  );
}

/** Phone: a ribbon bookmark drops in once you are past page one and names the chapter you're in. */
export function Ribbon({ current, onOpen }: { current: string | null; onOpen: () => void }) {
  const { t } = useLang();
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > window.innerHeight * 0.9));
  const chapter = chapters.find((c) => c.id === current);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={onOpen}
          aria-label={t(words.contents)}
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={springSheet}
          className="ribbon fixed right-5 z-40 flex w-12 flex-col items-center bg-hand pt-[calc(env(safe-area-inset-top,0px)+10px)] pb-6 text-paper shadow-lg lg:hidden"
          style={{ top: 0 }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={chapter?.num ?? "0"}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.35, ease: easeOut }}
              className="display text-[1.35rem] leading-none"
            >
              {chapter?.num ?? "·"}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/**
 * Wide laptops: divider tabs sticking out of the right edge of the chapter pages
 * (max-w-5xl, so the edge sits at 50% + 32rem). Hidden on page one, where the spread is wider.
 */
export function IndexTabs({ current }: { current: string | null }) {
  const { t } = useLang();
  const tapes = ["var(--color-tape-lilac)", "var(--color-tape-blush)", "#cfe0f0", "var(--color-tape-sage)"];
  return (
    <nav
      aria-label={t(words.contents)}
      className="fixed top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-2 transition-opacity duration-500 min-[1360px]:flex"
      style={{ left: "calc(50% + 32rem)", opacity: current ? 1 : 0, pointerEvents: current ? "auto" : "none" }}
    >
      {chapters.map((c, i) => {
        const active = current === c.id;
        return (
          <a
            key={c.id}
            href={`#${c.id}`}
            className="flex h-11 items-center gap-2 rounded-r-lg pl-3 text-[0.95rem] text-ink shadow-[4px_2px_8px_-4px_rgb(47_35_64/0.35)] transition-[padding] duration-500 ease-(--ease-ink)"
            style={{ background: tapes[i], paddingRight: active ? "1.4rem" : "0.9rem" }}
          >
            <span className="display text-[1.2rem]">{c.num}</span>
            <span className={active ? "" : "opacity-70"}>{t(c.title)}</span>
          </a>
        );
      })}
    </nav>
  );
}

export function ContentsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLang();
  const drag = useDragControls();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-ink/35"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t(words.contents)}
            className="paper fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg rounded-t-[1.75rem] px-6 pt-3 pb-[calc(env(safe-area-inset-bottom,0px)+28px)] shadow-2xl"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={springSheet}
            drag="y"
            dragListener={false}
            dragControls={drag}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.9 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose();
            }}
          >
            <div
              className="mx-auto flex h-8 w-24 cursor-grab touch-none items-center justify-center active:cursor-grabbing"
              onPointerDown={(e) => drag.start(e)}
            >
              <span className="h-1.5 w-11 rounded-full bg-ink/20" />
            </div>
            <div className="flex items-center justify-between gap-3 pt-2">
              <p className="display text-[2.2rem]">{t(words.contents)}</p>
              <LangToggle id="sheet" />
            </div>
            <ol className="mt-5">
              <li>
                <a href="#despre" onClick={onClose} className="flex min-h-12 items-end gap-2 text-[1.15rem]">
                  <span className="display w-8 text-[1.3rem] text-hand">·</span>
                  <span>{t(nav.about)}</span>
                  <span className="leader" />
                  <span className="tabular-nums text-ink-soft">1</span>
                </a>
              </li>
              {chapters.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} onClick={onClose} className="flex min-h-12 items-end gap-2 text-[1.15rem]">
                    <span className="display w-8 text-[1.3rem] text-hand">{c.num}</span>
                    <span>{t(c.title)}</span>
                    <span className="leader" />
                    <span className="tabular-nums text-ink-soft">{c.page}</span>
                  </a>
                </li>
              ))}
            </ol>
            <div className="mt-6 flex items-center gap-2 text-ink-soft">
              <Socials />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function Socials() {
  const links = [
    { label: "Instagram", href: site.contact.instagram.href, Icon: Instagram },
    { label: "Facebook", href: site.contact.facebook.href, Icon: Facebook },
    { label: "WhatsApp", href: site.contact.whatsapp.href, Icon: WhatsApp },
  ];
  return (
    <ul className="flex items-center gap-2">
      {links.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="grid size-11 place-items-center rounded-full border border-ink/20 transition-colors hover:bg-ink hover:text-paper"
          >
            <Icon size={19} />
          </a>
        </li>
      ))}
    </ul>
  );
}
