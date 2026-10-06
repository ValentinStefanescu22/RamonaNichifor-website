import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "motion/react";
import { img } from "../../shared/assets";
import { art, nav, ui } from "../../shared/content";
import { artPage, artworks, type ArtKind, type Artwork } from "../../shared/content-pages";
import { ArrowRight, Close } from "../../shared/icons";
import { useLang } from "../../shared/lang";
import { PageOpener, PillLink, SiteShell, TextLink } from "../../site/Layout";
import { Wash } from "../../site/Painted";

type Filter = "all" | ArtKind;

/** `decorative` when a caption beside it already names the work (e.g. inside the gallery button) */
function Picture({ a, className = "", decorative = false }: { a: Artwork; className?: string; decorative?: boolean }) {
  const { t } = useLang();
  const label = decorative ? undefined : t(a.title);
  if (a.src) {
    return <img src={img(a.src)} alt={label ?? ""} className={`w-full object-cover ${className}`} style={{ aspectRatio: a.ratio }} />;
  }
  return (
    <div role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} className={className} style={{ aspectRatio: a.ratio }}>
      <Wash colors={a.wash!} seed={a.id} className="h-full w-full" />
    </div>
  );
}

const dotColor: Record<Artwork["availability"], string> = { preorder: "#6f8a5a", sold: "rgb(52 34 74 / 0.35)", onRequest: "#7a5fb0" };

function Availability({ a }: { a: Artwork }) {
  const { t } = useLang();
  return (
    // two short lines, never broken mid-phrase in a narrow column: the state, then the price
    <span className="flex flex-col gap-0.5 text-[0.9rem] text-ink-soft">
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <span className="size-2 rounded-full" style={{ background: dotColor[a.availability] }} aria-hidden="true" />
        {t(artPage.availability[a.availability])}
      </span>
      {a.availability === "preorder" && (
        <span className="pl-3.5 whitespace-nowrap">{t(a.price ? { ro: a.price, en: a.price } : artPage.priceSoon)}</span>
      )}
    </span>
  );
}

/** The opener's signature: one framed work hanging from a nail on the wall */
function HangingFrame() {
  return (
    <div className="relative mx-auto w-[min(74vw,360px)] pt-14" aria-hidden="true">
      <svg viewBox="0 0 200 60" className="absolute inset-x-[18%] top-0 h-14 w-[64%] overflow-visible">
        <path d="M2 58 L100 6 L198 58" fill="none" stroke="rgb(52 34 74 / 0.45)" strokeWidth="1.2" />
        <circle cx="100" cy="5" r="4" fill="#5e4a75" />
      </svg>
      <div className="origin-top rotate-[1.2deg] rounded-[3px] bg-[#fffdf9] p-3.5 shadow-soft sm:p-4">
        <img src={img("cover-fluturele.webp")} alt="" className="aspect-[766/1120] w-full object-cover" />
      </div>
    </div>
  );
}

function ArtworkSheet({ a, onClose }: { a: Artwork; onClose: () => void }) {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const drag = useDragControls();
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Keep keyboard focus inside the sheet; Esc closes it
  const onKey = (e: ReactKeyboardEvent) => {
    if (e.key === "Escape") return onClose();
    if (e.key !== "Tab" || !panel.current) return;
    const items = panel.current.querySelectorAll<HTMLElement>("a[href], button");
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

  const rows = [
    { label: artPage.labels.technique, value: t(a.technique) },
    { label: artPage.labels.size, value: a.size },
    { label: artPage.labels.year, value: String(a.year) },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center lg:items-center lg:p-8" onKeyDown={onKey}>
      <motion.div
        className="absolute inset-0 bg-ink/35 backdrop-blur-[3px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="artwork-title"
        className="relative max-h-[92svh] w-full overflow-y-auto overscroll-contain rounded-t-[2rem] bg-cream pb-[calc(env(safe-area-inset-bottom,0px)+1.5rem)] shadow-soft lg:grid lg:max-w-5xl lg:grid-cols-[1.1fr_0.9fr] lg:overflow-hidden lg:rounded-[2rem] lg:pb-0"
        initial={reduce ? { opacity: 0 } : { y: "100%" }}
        animate={reduce ? { opacity: 1 } : { y: 0 }}
        exit={reduce ? { opacity: 0 } : { y: "100%" }}
        transition={{ type: "spring", bounce: 0, duration: 0.5 }}
        drag={reduce ? false : "y"}
        dragControls={drag}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.7 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 110 || info.velocity.y > 600) onClose();
        }}
      >
        {/* grab handle: drag the sheet down to put it away (phones) */}
        <div className="flex touch-none justify-center pt-3 pb-1 lg:hidden" onPointerDown={(e) => drag.start(e)} aria-hidden="true">
          <span className="h-1.5 w-12 rounded-full bg-ink/20" />
        </div>
        <div className="grid place-items-center bg-mist p-6 lg:p-10">
          <div className="w-full max-w-[420px] rounded-[3px] bg-[#fffdf9] p-3 shadow-soft">
            <Picture a={a} />
          </div>
        </div>
        <div className="relative px-6 pt-6 lg:px-10 lg:pt-12 lg:pb-10">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t(artPage.close)}
            className="absolute top-4 right-4 grid size-11 place-items-center rounded-full bg-white/70 text-ink ring-1 ring-ink/10"
          >
            <Close size={18} />
          </button>
          <p className="text-[0.95rem] text-ink-soft">{t(artPage.kind[a.kind])}</p>
          <h2 id="artwork-title" className="display mt-1 pr-12 text-[clamp(2rem,7vw,2.8rem)] font-[380] text-ink">
            {t(a.title)}
          </h2>
          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[1rem]">
            {rows.map((r) => (
              <div key={r.label.ro} className="contents">
                <dt className="text-ink-soft">{t(r.label)}</dt>
                <dd className="text-ink tabular-nums">{r.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5">
            <Availability a={a} />
          </div>
          {a.availability === "preorder" ? (
            <>
              <PillLink href="contact.html#arta" icon={<ArrowRight size={17} />} className="mt-8">
                {t(artPage.preorder)}
              </PillLink>
              <p className="mt-3 max-w-[40ch] text-[0.95rem] leading-relaxed text-ink-soft">{t(artPage.preorderNote)}</p>
            </>
          ) : (
            <PillLink href="contact.html#arta" icon={<ArrowRight size={17} />} className="mt-8">
              {t(artPage.ask)}
            </PillLink>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function App() {
  const { t } = useLang();
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const triggers = useRef<Record<string, HTMLButtonElement | null>>({});
  const shown = artworks.filter((a) => filter === "all" || a.kind === filter);
  const open = artworks.find((a) => a.id === openId) ?? null;

  const show = (id: string) => {
    history.pushState({ artwork: id }, "", `#${id}`);
    setOpenId(id);
  };
  const close = useCallback(() => {
    if (history.state?.artwork) history.back();
    else setOpenId(null);
  }, []);

  // Back closes the sheet; focus returns to the frame that opened it
  useEffect(() => {
    const onPop = () =>
      setOpenId((current) => {
        if (current) requestAnimationFrame(() => triggers.current[current]?.focus());
        return null;
      });
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (artworks.some((a) => a.id === id)) setOpenId(id);
  }, []);

  return (
    <SiteShell current="arta" ground="mist">
      <main>
        <PageOpener
          title={t(nav.art)}
          tagline={t(artPage.tagline)}
          lead={<p>{t(art.lead)}</p>}
          background="linear-gradient(180deg, #e2ecf7 0%, var(--color-mist) 60%)"
          aside={<HangingFrame />}
        />

        <section className="bg-mist px-4 pt-4 pb-20 sm:px-6 lg:pb-28">
          <div className="mx-auto max-w-6xl">
            <div role="group" aria-label={t(nav.art)} className="flex flex-wrap gap-2">
              {artPage.filters.map((f) => {
                const on = f.id === filter;
                const count = f.id === "all" ? artworks.length : artworks.filter((a) => a.kind === f.id).length;
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFilter(f.id)}
                    className="relative z-0 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[0.98rem] font-medium ring-1 ring-ink/12 transition-colors duration-300"
                    style={{ color: on ? "var(--color-cream)" : "var(--color-ink-soft)" }}
                  >
                    {on && <motion.span layoutId="art-filter" className="absolute inset-0 -z-10 rounded-full bg-ink" transition={{ type: "spring", bounce: 0, duration: 0.4 }} />}
                    {t(f.label)}
                    <span className="text-[0.8rem] tabular-nums opacity-70">{count}</span>
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.ul
                key={filter}
                className="gallery mt-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {shown.map((a, i) => (
                  <li key={a.id} className={`mb-8 ${i % 3 === 1 ? "md:mt-10" : ""}`}>
                    <button
                      ref={(el) => {
                        triggers.current[a.id] = el;
                      }}
                      type="button"
                      onClick={() => show(a.id)}
                      aria-haspopup="dialog"
                      className="group block w-full text-left"
                    >
                      <div className="rounded-[3px] bg-[#fffdf9] p-2.5 shadow-soft transition-transform duration-500 ease-(--ease-bloom) group-hover:-translate-y-1 group-hover:rotate-[0.6deg] sm:p-3">
                        <Picture a={a} decorative />
                      </div>
                      <div className="px-0.5 pt-3">
                        <span className="display block text-[1.2rem] leading-tight text-ink">{t(a.title)}</span>
                        <span className="mt-0.5 block text-[0.9rem] text-ink-soft">
                          {t(a.technique)} · {a.size}
                        </span>
                        <span className="mt-1 block">
                          <Availability a={a} />
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </section>

        <section className="bg-mist px-4 pb-16 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 border-t border-ink/10 pt-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="display text-[1.9rem] text-ink">{t(artPage.commissionTitle)}</h2>
              <p className="mt-3 max-w-[56ch] text-[1.05rem] leading-relaxed text-ink-soft">{t(artPage.commission)}</p>
            </div>
            <TextLink href="contact.html#arta">{t(ui.writeToMe)}</TextLink>
          </div>
        </section>
      </main>

      <AnimatePresence>{open && <ArtworkSheet key={open.id} a={open} onClose={close} />}</AnimatePresence>
    </SiteShell>
  );
}
