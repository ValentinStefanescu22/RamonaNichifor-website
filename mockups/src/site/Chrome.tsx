import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { img } from "../shared/assets";
import { nav, site } from "../shared/content";
import { Facebook, Instagram, WhatsApp } from "../shared/icons";
import { LangToggle, useLang } from "../shared/lang";
import { easeOut } from "../shared/motion";
import { homeHref, pages, type PageId } from "./pages";

/** SVG filters for the watercolour edges; rendered once per page. */
export function PaintDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <filter id="paint-edge" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="paint-bloom" x="-30%" y="-30%" width="160%" height="160%">
        <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="4" seed="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="60" xChannelSelector="R" yChannelSelector="B" result="warp" />
        <feGaussianBlur in="warp" stdDeviation="6" />
      </filter>
    </svg>
  );
}

export function MenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  const { t } = useLang();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={t(open ? nav.close : nav.menu)}
      className="relative grid size-11 place-items-center rounded-full bg-ink text-cream transition-transform duration-150 active:scale-[0.94] xl:hidden"
    >
      <span
        className="absolute h-[1.5px] w-5 rounded-full bg-current transition-transform duration-500 ease-(--ease-bloom)"
        style={{ transform: open ? "rotate(45deg)" : "translateY(-4px)" }}
      />
      <span
        className="absolute h-[1.5px] w-5 rounded-full bg-current transition-transform duration-500 ease-(--ease-bloom)"
        style={{ transform: open ? "rotate(-45deg)" : "translateY(4px)" }}
      />
    </button>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <a href={homeHref} className={`display display-wonk inline-flex min-h-11 items-center italic leading-none whitespace-nowrap text-ink ${className}`}>
      Ramona Nichifor
    </a>
  );
}

/** The page's own header; sits over the top of each page's ground. */
export function TopBar({ current, menuOpen, onMenu }: { current: PageId; menuOpen: boolean; onMenu: () => void }) {
  const { t } = useLang();
  return (
    <header className="relative z-30 mx-auto flex max-w-[75rem] items-center justify-between gap-4 px-4 pt-4 sm:px-6 lg:pt-6">
      <Wordmark className="text-[1.35rem] sm:text-2xl" />
      <nav aria-label="Principal" className="hidden items-center gap-6 text-[0.95rem] font-medium text-ink-soft xl:flex">
        {pages.map((p) => (
          <a
            key={p.id}
            href={p.href}
            aria-current={p.id === current ? "page" : undefined}
            className="inline-flex min-h-11 items-center decoration-lilac decoration-2 underline-offset-[6px] hover:text-ink hover:underline aria-[current=page]:text-ink aria-[current=page]:underline"
          >
            {t(p.label)}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-2">
        <LangToggle id="top" />
        <MenuButton open={menuOpen} onClick={onMenu} />
      </div>
    </header>
  );
}

/** A floating pill that takes over from the top bar once the page has scrolled away from it. */
export function FloatingBar({
  current,
  menuOpen,
  onMenu,
  after = 0.85,
}: {
  current: PageId;
  menuOpen: boolean;
  onMenu: () => void;
  /** Show after scrolling this many viewport heights */
  after?: number;
}) {
  const { t } = useLang();
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > window.innerHeight * after));

  return (
    <AnimatePresence>
      {(show || menuOpen) && (
        <motion.div
          initial={{ y: -24, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -24, opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: easeOut }}
          className="fixed inset-x-0 z-50 flex justify-center px-3"
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 10px)" }}
        >
          <div className="flex w-full max-w-3xl items-center xl:max-w-5xl justify-between gap-3 rounded-full bg-cream/75 py-1.5 pr-1.5 pl-5 shadow-soft ring-1 ring-ink/5 backdrop-blur-xl backdrop-saturate-150">
            <Wordmark className="text-lg" />
            <nav aria-label="Secțiuni" className="hidden items-center gap-5 text-[0.9rem] font-medium text-ink-soft xl:flex">
              {pages.map((p) => (
                <a
                  key={p.id}
                  href={p.href}
                  aria-current={p.id === current ? "page" : undefined}
                  className="inline-flex min-h-11 items-center hover:text-ink aria-[current=page]:text-ink"
                >
                  {t(p.label)}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-1.5">
              <LangToggle id="float" />
              <MenuButton open={menuOpen} onClick={onMenu} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function MenuSheet({ current, open, onClose }: { current: PageId; open: boolean; onClose: () => void }) {
  const { t } = useLang();

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

  const items = [{ id: "home" as const, label: nav.home, href: homeHref }, ...pages];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="sheet"
          role="dialog"
          aria-modal="true"
          aria-label={t(nav.menu)}
          className="fixed inset-0 z-[45] overflow-y-auto bg-cream xl:hidden"
          initial={{ clipPath: "circle(0% at calc(100% - 38px) 38px)" }}
          animate={{ clipPath: "circle(150% at calc(100% - 38px) 38px)" }}
          exit={{ clipPath: "circle(0% at calc(100% - 38px) 38px)" }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <img src={img("wash.webp")} alt="" className="pointer-events-none absolute top-0 right-0 h-full w-auto opacity-70" />
          <img src={img("meadow.webp")} alt="" className="pointer-events-none absolute inset-x-0 bottom-0 w-full" />
          <nav className="relative flex min-h-full flex-col px-6 pt-24 pb-56">
            <ul className="flex flex-col">
              {items.map((p, i) => (
                <motion.li
                  key={p.id}
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.045, duration: 0.6, ease: easeOut }}
                >
                  <a
                    href={p.href}
                    onClick={onClose}
                    aria-current={p.id === current ? "page" : undefined}
                    className="display block py-1.5 text-[2.35rem] text-ink aria-[current=page]:italic aria-[current=page]:text-violet"
                  >
                    {t(p.label)}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.div
              className="mt-8 flex items-center gap-2 text-ink-soft"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <SocialLinks />
            </motion.div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SocialLinks({ className = "" }: { className?: string }) {
  const links = [
    { label: "Instagram", href: site.contact.instagram.href, Icon: Instagram },
    { label: "Facebook", href: site.contact.facebook.href, Icon: Facebook },
    { label: "WhatsApp", href: site.contact.whatsapp.href, Icon: WhatsApp },
  ];
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {links.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="grid size-11 place-items-center rounded-full ring-1 ring-current/25 transition-colors hover:bg-ink hover:text-cream"
          >
            <Icon size={19} />
          </a>
        </li>
      ))}
    </ul>
  );
}
