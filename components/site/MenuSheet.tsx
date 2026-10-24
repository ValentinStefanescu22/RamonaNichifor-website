"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import type { SiteSettings } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { menu, type PageId } from "@/lib/menu";
import { SocialLinks } from "./SocialLinks";

const easeOut = [0.16, 1, 0.3, 1] as const;
const wash = "radial-gradient(ellipse 60% 55% at 70% 40%, #000 30%, transparent 100%)";
const meadowFade = "linear-gradient(180deg, transparent 0%, #000 26%)";
const washMask: CSSProperties = { maskImage: wash, WebkitMaskImage: wash };
const meadowMask: CSSProperties = { maskImage: meadowFade, WebkitMaskImage: meadowFade };

/** Everything the open menu owns: the sheet and the floating bar above it (its button closes the menu). */
const focusables = () =>
  [...document.querySelectorAll<HTMLElement>("[data-menu-scope] a[href], [data-menu-scope] button, [data-floating-bar] a[href], [data-floating-bar] button")].filter(
    (el) => el.getClientRects().length > 0,
  );

export function MenuSheet({
  current,
  contacts,
  open,
  onClose,
}: {
  current?: PageId;
  contacts: SiteSettings["contacts"];
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("nav");
  const reduce = useReducedMotion();
  const firstLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return onClose();
      if (e.key !== "Tab") return;
      // focus trap: Tab and Shift+Tab cycle through the menu only
      const list = focusables();
      if (!list.length) return;
      const i = list.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (i <= 0 ? list.length - 1 : i - 1) : i === -1 || i === list.length - 1 ? 0 : i + 1;
      e.preventDefault();
      list[next].focus();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLink.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <m.div
          key="sheet"
          role="dialog"
          aria-modal="true"
          aria-label={t("menu")}
          data-menu-scope=""
          className="fixed inset-0 z-[45] overflow-y-auto bg-cream"
          initial={{ clipPath: "circle(0% at calc(100% - 38px) 38px)" }}
          animate={{ clipPath: "circle(150% at calc(100% - 38px) 38px)" }}
          exit={{ clipPath: "circle(0% at calc(100% - 38px) 38px)" }}
          transition={reduce ? { duration: 0 } : { duration: 0.7, ease: easeOut }}
        >
          {/* the light of the page: the wash fades out on every side; the meadow is the last thing in the
              column, so on a short screen it moves below the words instead of behind them */}
          <img
            loading="lazy"
            src="/img/wash.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -top-[4%] -right-[30%] h-[72%] w-auto max-w-none opacity-55 mix-blend-multiply sm:-right-[6%]"
            style={washMask}
          />
          <div className="relative flex min-h-full flex-col">
            <nav className="relative mx-auto w-full max-w-[75rem] px-6 pt-24 pb-10 lg:pt-24">
              <ul className="flex flex-col">
                {menu.map((p, i) => (
                  <m.li
                    key={p.id}
                    initial={{ y: 28, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={reduce ? { duration: 0 } : { delay: 0.1 + i * 0.045, duration: 0.6, ease: easeOut }}
                  >
                    <Link
                      ref={i === 0 ? firstLink : undefined}
                      href={p.href}
                      onClick={onClose}
                      aria-current={p.id === current ? "page" : undefined}
                      className="group display block py-1.5 text-[2.35rem] text-ink aria-[current=page]:italic aria-[current=page]:text-violet lg:text-[2.6rem]"
                    >
                      {/* grows from its left edge: on hover where there is a mouse, while pressed on a phone */}
                      <span className="inline-block origin-left transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.08] group-active:scale-[1.08]">
                        {t(p.labelKey)}
                      </span>
                    </Link>
                  </m.li>
                ))}
              </ul>
              <m.div
                className="mt-8 flex items-center gap-2 text-ink-soft"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={reduce ? { duration: 0 } : { delay: 0.45, duration: 0.5 }}
              >
                <SocialLinks contacts={contacts} />
              </m.div>
            </nav>
            <picture className="mt-auto block">
              <source media="(min-width: 1024px)" srcSet="/img/meadow-wide.webp" />
              <img
                loading="lazy"
                src="/img/meadow.webp"
                alt=""
                aria-hidden="true"
                className="pointer-events-none block h-[28svh] w-full object-cover object-bottom lg:h-[30svh]"
                style={meadowMask}
              />
            </picture>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
