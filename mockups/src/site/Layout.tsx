import { useCallback, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { img } from "../shared/assets";
import { ui } from "../shared/content";
import { useLang } from "../shared/lang";
import { easeOut } from "../shared/motion";
import { StatusChip } from "./StatusChip";
import { FloatingBar, MenuSheet, PaintDefs, TopBar, washMask } from "./Chrome";
import { Footer, type Ground } from "./Footer";
import type { PageId } from "./pages";

export const delay = (s: number) => ({ "--d": `${s}s` }) as CSSProperties;

/**
 * Every page: the header over the page's own ground, the floating bar and phone menu,
 * the page itself, and the shared footer landing on the meadow.
 */
export function SiteShell({
  current,
  ground = "cream",
  floatAfter,
  children,
}: {
  current: PageId;
  ground?: Ground;
  floatAfter?: number;
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = useCallback(() => setMenuOpen((o) => !o), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  return (
    <>
      <PaintDefs />
      <FloatingBar current={current} menuOpen={menuOpen} onMenu={toggleMenu} after={floatAfter} />
      <MenuSheet current={current} open={menuOpen} onClose={closeMenu} />
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-40">
          <TopBar current={current} menuOpen={menuOpen} onMenu={toggleMenu} />
        </div>
        {children}
      </div>
      <Footer current={current} ground={ground} />
    </>
  );
}

/**
 * The top of every inner page: one display title (with an optional italic second line, the way
 * the home page sets „Ramona / Nichifor”), a tagline, a lead, actions, and the page's own
 * signature element beside it.
 */
export function PageOpener({
  title,
  italic,
  tagline,
  lead,
  background,
  aside,
  children,
  className = "",
}: {
  title: string;
  italic?: string;
  tagline?: string;
  lead?: ReactNode;
  background: string;
  aside?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative isolate overflow-hidden ${className}`} style={{ background }}>
      <img
        src={img("wash.webp")}
        alt=""
        aria-hidden="true"
        className="wash-in pointer-events-none absolute -top-[6%] -right-[34%] -z-10 h-[78%] w-auto max-w-none opacity-55 mix-blend-multiply sm:-right-[10%]"
        style={washMask("ellipse 60% 55% at 70% 40%")}
      />
      <div className="mx-auto grid max-w-[75rem] items-center gap-10 px-4 pt-28 pb-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:pt-36 lg:pb-20">
        <div className="min-w-0">
          <h1 className="display text-[clamp(3.1rem,14vw,6.4rem)] font-[380] text-ink">
            <span className="block overflow-hidden pb-[0.06em]">
              <span className="rise block" style={delay(0.1)}>
                {title}
              </span>
            </span>
            {italic && (
              <span className="block overflow-hidden pb-[0.12em] pl-[0.6em] sm:pl-[0.9em]">
                <span className="rise display-wonk block italic text-violet" style={delay(0.22)}>
                  {italic}
                </span>
              </span>
            )}
          </h1>
          {tagline && (
            <p className="fade-up display mt-5 max-w-[24ch] text-[clamp(1.3rem,4.6vw,1.8rem)] leading-[1.2] italic text-ink-soft" style={delay(0.4)}>
              {tagline}
            </p>
          )}
          {lead && (
            <div className="fade-up mt-4 max-w-[46ch] text-[1.08rem] leading-relaxed text-ink-soft" style={delay(0.5)}>
              {lead}
            </div>
          )}
          {children && (
            <div className="fade-up mt-7" style={delay(0.6)}>
              {children}
            </div>
          )}
        </div>
        {aside && (
          <div className="fade-up min-w-0" style={delay(0.35)}>
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}

/** Section heading used inside pages: the same headline role as the home sections. */
export function SectionTitle({ children, lead, className = "" }: { children: ReactNode; lead?: ReactNode; className?: string }) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <h2 className="display text-[clamp(2.2rem,8.5vw,3.8rem)] font-[380] text-ink">{children}</h2>
      {lead && <div className="mt-4 max-w-[52ch] text-[1.08rem] leading-relaxed text-ink-soft">{lead}</div>}
    </div>
  );
}

/** The ink pill with a seed circle: the site's primary action. */
export function PillLink({
  href,
  children,
  icon,
  external = false,
  className = "",
}: {
  href: string;
  children: ReactNode;
  icon: ReactNode;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`group inline-flex min-h-12 items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-5 font-medium text-cream shadow-soft transition-transform duration-150 active:scale-[0.97] ${className}`}
    >
      {children}
      <span className="grid size-9 place-items-center rounded-full bg-cream/15 transition-transform duration-300 group-hover:translate-x-0.5">
        {icon}
      </span>
    </a>
  );
}

/** Underlined text link with a moving arrow: the site's secondary action. */
export function TextLink({ href, children, className = "", external = false }: { href: string; children: ReactNode; className?: string; external?: boolean }) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`group inline-flex min-h-11 items-center gap-2 font-semibold text-ink underline decoration-lilac decoration-2 underline-offset-[6px] ${className}`}
    >
      {children}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
        <path d="M4.5 12h14.5M13.5 6.5 19 12l-5.5 5.5" />
      </svg>
    </a>
  );
}

/** Where a buy button will go: no book can be ordered online yet, so say so plainly and offer a note instead */
export function BuySoon({ link = true, className = "" }: { link?: boolean; className?: string }) {
  const { t } = useLang();
  return (
    <div className={`flex flex-wrap items-center gap-x-6 gap-y-2 ${className}`}>
      <p className="flex flex-wrap items-center gap-2.5 text-[1rem] text-ink-soft">
        <StatusChip>{t(ui.comingSoon)}</StatusChip>
        {t(ui.buySoon)}
      </p>
      {link && <TextLink href="contact.html#carte">{t(ui.writeToMe)}</TextLink>}
    </div>
  );
}

/** A paragraph that settles into place as it reaches the reader: fade and 14px, once, staggered within its movement */
export function Reveal({ i, children, className = "" }: { i: number; children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const transition: Transition = { duration: 0.8, ease: easeOut, delay: Math.min(i, 4) * 0.06 };
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, transform: "translateY(14px)" }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

