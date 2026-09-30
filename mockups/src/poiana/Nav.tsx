import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { nav, site } from "../shared/content";
import { Facebook, Instagram, WhatsApp } from "../shared/icons";
import { LangToggle, useLang } from "../shared/lang";
import { easeOut } from "../shared/motion";
import { img } from "../shared/assets";

// "Universuri" is its own page; the other entries are sections of this page
export const sections: { id: string; label: (typeof nav)[keyof typeof nav]; href?: string }[] = [
  { id: "universuri", label: nav.universes, href: "universuri-poiana.html" },
  { id: "carte", label: nav.books },
  { id: "despre", label: nav.about },
  { id: "arta", label: nav.art },
  { id: "consiliere", label: nav.counselling },
  { id: "contact", label: nav.contact },
];

export const sectionHref = (s: (typeof sections)[number]) => s.href ?? `#${s.id}`;

export function MenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  const { t } = useLang();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={t(open ? nav.close : nav.menu)}
      className="relative grid size-11 place-items-center rounded-full bg-ink text-cream transition-transform duration-150 active:scale-[0.94] lg:hidden"
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

function Wordmark({ className = "" }: { className?: string }) {
  return (
    <a href="#top" className={`display display-wonk inline-flex min-h-11 items-center italic leading-none text-ink ${className}`}>
      Ramona Nichifor
    </a>
  );
}

export function TopBar({ menuOpen, onMenu }: { menuOpen: boolean; onMenu: () => void }) {
  const { t } = useLang();
  return (
    <header className="relative z-30 mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-4 sm:px-6 lg:pt-6">
      <Wordmark className="text-[1.35rem] sm:text-2xl" />
      <nav aria-label="Principal" className="hidden items-center gap-7 text-[0.95rem] font-medium text-ink-soft lg:flex">
        {sections.map((s) => (
          <a key={s.id} href={sectionHref(s)} className="underline-offset-[6px] decoration-lilac decoration-2 hover:text-ink hover:underline">
            {t(s.label)}
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

/** A floating pill that takes over from the top bar once the hero has scrolled away. */
export function FloatingBar({ menuOpen, onMenu }: { menuOpen: boolean; onMenu: () => void }) {
  const { t } = useLang();
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setShow(y > window.innerHeight * 0.85));

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
          <div className="flex w-full max-w-3xl items-center justify-between gap-3 rounded-full bg-cream/75 py-1.5 pr-1.5 pl-5 shadow-soft ring-1 ring-ink/5 backdrop-blur-xl backdrop-saturate-150">
            <Wordmark className="text-lg" />
            <nav aria-label="Secțiuni" className="hidden items-center gap-5 text-[0.9rem] font-medium text-ink-soft lg:flex">
              {sections.slice(0, 5).map((s) => (
                <a key={s.id} href={sectionHref(s)} className="hover:text-ink">
                  {t(s.label)}
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

export function MenuSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="sheet"
          role="dialog"
          aria-modal="true"
          aria-label={t(nav.menu)}
          className="fixed inset-0 z-[45] overflow-y-auto bg-cream lg:hidden"
          initial={{ clipPath: "circle(0% at calc(100% - 38px) 38px)" }}
          animate={{ clipPath: "circle(150% at calc(100% - 38px) 38px)" }}
          exit={{ clipPath: "circle(0% at calc(100% - 38px) 38px)" }}
          transition={{ duration: 0.7, ease: easeOut }}
        >
          <img src={img("wash.webp")} alt="" className="pointer-events-none absolute top-0 right-0 h-full w-auto opacity-70" />
          <img src={img("meadow.webp")} alt="" className="pointer-events-none absolute inset-x-0 bottom-0 w-full" />
          <nav className="relative flex min-h-full flex-col px-6 pt-28 pb-56">
            <ul className="flex flex-col gap-1">
              {sections.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ y: 28, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.12 + i * 0.05, duration: 0.6, ease: easeOut }}
                >
                  <a href={sectionHref(s)} onClick={onClose} className="display block py-2 text-[2.6rem] text-ink">
                    {t(s.label)}
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
