"use client";
import { useState, type MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, m, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { Link } from "@/i18n/navigation";
import { menu, type PageId } from "@/lib/menu";
import { LangSwitch, type SlugPairs } from "./LangSwitch";
import { MenuButton } from "./MenuButton";
import { Wordmark } from "./Wordmark";

const easeOut = [0.16, 1, 0.3, 1] as const;

/** A floating pill that takes over from the top bar once the page has scrolled away from it. */
export function FloatingBar({
  current,
  slugs,
  menuOpen,
  onMenu,
  after = 0.85,
}: {
  current?: PageId;
  slugs: SlugPairs;
  menuOpen: boolean;
  onMenu: (e: MouseEvent<HTMLButtonElement>) => void;
  /** Show after scrolling this many viewport heights */
  after?: number;
}) {
  const t = useTranslations("nav");
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > window.innerHeight * after));

  return (
    <AnimatePresence>
      {(show || menuOpen) && (
        <m.div
          data-floating-bar=""
          initial={{ y: -24, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -24, opacity: 0, filter: "blur(6px)" }}
          transition={reduce ? { duration: 0 } : { duration: 0.5, ease: easeOut }}
          className="fixed inset-x-0 z-50 flex justify-center px-3"
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 10px)" }}
        >
          <div className="flex w-full max-w-3xl items-center justify-between gap-3 rounded-full bg-cream/75 py-1.5 pr-1.5 pl-5 shadow-soft ring-1 ring-ink/5 backdrop-blur-xl backdrop-saturate-150 lg:max-w-5xl">
            <Wordmark className="text-[1.45rem]" />
            <nav aria-label={t("sections")} className="hidden items-center gap-5 text-[0.9rem] font-medium text-ink-soft lg:flex">
              {menu.map((p) => (
                <Link
                  key={p.id}
                  href={p.href}
                  aria-current={p.id === current ? "page" : undefined}
                  className="inline-flex min-h-11 items-center whitespace-nowrap hover:text-ink aria-[current=page]:text-ink"
                >
                  {t(p.labelKey)}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-1.5">
              <LangSwitch id="float" slugs={slugs} />
              <MenuButton open={menuOpen} onClick={onMenu} />
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
