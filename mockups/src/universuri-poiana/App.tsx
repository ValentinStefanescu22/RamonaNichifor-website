import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import { useReducedMotion } from "motion/react";
import { img } from "../shared/assets";
import type { UniverseId } from "../shared/content";
import { book, nav, site, ui, universes } from "../shared/content";
import { ArrowRight, ArrowUpRight, Instagram } from "../shared/icons";
import { LangToggle, useLang } from "../shared/lang";
import { Pollen } from "../universuri/Pollen";
import { OrbArt, WorldMap } from "../universuri/WorldMap";

// Design-validation page for the real site's Universuri: concept C's motion, Poiana's palette,
// a sky instead of the meadow. Each world opens into its own (tinted) page via the orb morph.

const MORPH = "universe-orb";
const copy = {
  label: { ro: "Pagina Universuri · propunere pe paleta Poiana", en: "Universes page · proposal in the Meadow palette" },
  back: { ro: "Înapoi la Poiana", en: "Back to the Meadow" },
  tap: { ro: "Atinge o lume ca s-o deschizi", en: "Tap a world to open it" },
  allWorlds: { ro: "Universuri", en: "Universes" },
  others: { ro: "Alte universuri", en: "Other universes" },
};

function morph(update: () => void) {
  const start = document.startViewTransition?.bind(document);
  if (!start) {
    update();
    return null;
  }
  let vt: ViewTransition;
  try {
    vt = start({ update, types: ["morph"] });
  } catch {
    vt = start(update);
  }
  vt.ready.catch(() => {});
  vt.finished.catch(() => {});
  return vt;
}

/** Fades a watercolour wash out on every side so no image edge ever shows */
function washMask(shape: string): CSSProperties {
  const m = `radial-gradient(${shape}, #000 30%, transparent 100%)`;
  return { maskImage: m, WebkitMaskImage: m };
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

function UniversePage({ id, onBack, onSwitch }: { id: UniverseId; onBack: () => void; onSwitch: (id: UniverseId) => void }) {
  const { t } = useLang();
  const u = universes.find((x) => x.id === id)!;
  const live = u.status === "available";
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onBack();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [id, onBack]);

  return (
    <div
      ref={scroller}
      role="dialog"
      aria-modal="true"
      aria-label={t(u.name)}
      className="sky-tint fixed inset-0 z-50 overflow-y-auto overscroll-contain"
      style={{ "--tint": u.tint[0] } as CSSProperties}
    >
      <Pollen className="pointer-events-none fixed inset-0 h-full w-full" colors={[hexToRgb(u.tint[1]), "201, 184, 230"]} strength={0.55} />
      <div className="relative mx-auto max-w-5xl px-4 pt-[calc(env(safe-area-inset-top,0px)+14px)] pb-24 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-cream/80 pr-4 pl-3 font-medium text-ink shadow-soft ring-1 ring-ink/5 backdrop-blur-sm transition-transform active:scale-[0.97]"
          >
            <ArrowRight size={17} className="rotate-180" />
            {t(copy.allWorlds)}
          </button>
          <LangToggle id="page" />
        </div>

        <header className="mt-8 flex flex-col items-center text-center">
          <OrbArt u={u} size="min(64vw, 300px)" style={{ viewTransitionName: MORPH }} />
          <h1 className="display mt-7 text-[clamp(2.6rem,10vw,4.6rem)] font-[380] text-ink">{t(u.name)}</h1>
          <p className="display mt-2 text-[1.3rem] italic text-ink-soft">{t(u.book)}</p>
          <span
            className="mt-4 rounded-full px-3 py-1 text-[0.85rem] font-bold"
            style={live ? { background: "var(--color-magenta)", color: "var(--color-cream)" } : { background: "rgb(52 34 74 / 0.1)", color: "var(--color-ink-soft)" }}
          >
            {t(live ? ui.available : ui.comingSoon)}
          </span>
          <p className="mt-5 max-w-[46ch] text-[1.1rem] leading-relaxed text-ink-soft">{t(u.hook)}</p>
        </header>

        <section className="mt-14">
          <h2 className="display text-[1.8rem] text-ink">{t(ui.inThisUniverse)}</h2>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {u.items.map((item, i) => {
              const ready = item.status === "available";
              return (
                <li key={i} className="overflow-hidden rounded-[1.5rem] bg-cream/80 ring-1 ring-ink/5 backdrop-blur-sm">
                  <div className="grid aspect-[4/5] place-items-center" style={{ background: `color-mix(in oklab, ${u.tint[0]} 70%, white)` }}>
                    {ready && live && i === 0 ? (
                      <img src={img("cover-fluturele.webp")} alt="" className="h-[86%] w-auto rounded-[3px] shadow-book" />
                    ) : (
                      <span className="size-10 rounded-full opacity-70" style={{ background: u.tint[1] }} aria-hidden="true" />
                    )}
                  </div>
                  <div className="px-4 py-3">
                    <p className="font-bold text-ink">{t(item.name)}</p>
                    <p className="text-[0.9rem] text-ink-soft">{t(ready ? ui.available : ui.comingSoon)}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          {live ? (
            <div className="mt-6">
              <p className="text-[0.95rem] font-bold text-ink">{t(ui.buyAt)}</p>
              <div className="mt-2 flex flex-wrap gap-3">
                {book.stores.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 font-medium text-cream shadow-soft transition-transform active:scale-[0.97]"
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
              className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-6 font-medium text-cream shadow-soft transition-transform active:scale-[0.97]"
            >
              <Instagram size={18} />
              {t(ui.notifyMe)}
            </a>
          )}
        </section>

        <nav aria-label={t(copy.others)} className="mt-16">
          <h2 className="display text-[1.8rem] text-ink">{t(copy.others)}</h2>
          <ul className="mt-5 grid grid-cols-3 gap-3">
            {universes
              .filter((x) => x.id !== id)
              .map((o) => (
                <li key={o.id}>
                  <button type="button" onClick={() => onSwitch(o.id)} className="group flex w-full flex-col items-center gap-2 text-center">
                    <OrbArt u={o} size="min(22vw, 120px)" className="transition-transform duration-500 group-hover:scale-[1.05]" />
                    <span className="display text-[1rem] leading-tight text-ink">{t(o.name)}</span>
                  </button>
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default function App() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<UniverseId | null>(null);
  const orbRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const open = useCallback(
    (id: UniverseId, orb: HTMLElement) => {
      history.pushState({ universe: id }, "", `#${id}`);
      if (reduce) return setActive(id);
      orb.style.viewTransitionName = MORPH;
      const vt = morph(() => {
        orb.style.viewTransitionName = "";
        flushSync(() => setActive(id));
      });
      if (!vt) orb.style.viewTransitionName = "";
    },
    [reduce],
  );

  const closeTo = useCallback(
    (from: UniverseId | null) => {
      const orb = from ? orbRefs.current[from] : null;
      if (reduce || !orb) return setActive(null);
      const vt = morph(() => {
        flushSync(() => setActive(null));
        orb.style.viewTransitionName = MORPH;
      });
      const clear = () => (orb.style.viewTransitionName = "");
      if (vt) vt.finished.then(clear, clear);
      else clear();
    },
    [reduce],
  );

  // A shared link like universuri-poiana.html#fluture opens straight into that world
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (universes.some((u) => u.id === id)) setActive(id as UniverseId);
  }, []);

  // Browser back closes the world, like leaving a real page
  useEffect(() => {
    const onPop = () => closeTo(active);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [active, closeTo]);

  const back = useCallback(() => {
    if (history.state?.universe) history.back();
    else closeTo(active);
  }, [active, closeTo]);

  const switchTo = useCallback((id: UniverseId) => {
    history.replaceState({ universe: id }, "", `#${id}`);
    morph(() => flushSync(() => setActive(id)));
  }, []);

  return (
    <>

      <div className="relative z-40" style={{ background: "var(--color-ink)", color: "var(--color-cream)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 text-[0.78rem] sm:px-6">
          <p className="py-2 font-semibold">{t(copy.label)}</p>
          <a href="poiana.html" className="inline-flex min-h-11 shrink-0 items-center gap-1.5 font-semibold hover:underline">
            {t(copy.back)} <ArrowRight size={14} />
          </a>
        </div>
      </div>

      <div className="sky-day relative isolate min-h-svh overflow-hidden">
        <Pollen className="absolute inset-0 -z-10 h-full w-full" colors={["184, 70, 138", "122, 95, 176"]} strength={0.5} />
        <img
          src={img("wash.webp")}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -top-[4%] -right-[30%] -z-10 h-[70%] w-auto max-w-none opacity-60 mix-blend-multiply sm:-right-[8%]"
          style={washMask("ellipse 60% 55% at 72% 38%")}
        />
        <img
          src={img("wash.webp")}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 -left-[35%] -z-10 h-[55%] w-auto max-w-none scale-x-[-1] opacity-45 mix-blend-multiply sm:-left-[12%]"
          style={washMask("ellipse 58% 52% at 68% 62%")}
        />

        <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-4 sm:px-6 lg:pt-6">
          <a href="poiana.html" className="display display-wonk inline-flex min-h-11 items-center text-[1.35rem] italic text-ink sm:text-2xl">
            Ramona Nichifor
          </a>
          <LangToggle id="head" />
        </header>

        {/* Phones pick the world nearest mid-screen, so the page needs room for the last world to reach the middle */}
        <main className="mx-auto grid max-w-6xl gap-6 px-4 pt-8 pb-[45svh] sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:pt-16 lg:pb-24">
          <div className="lg:sticky lg:top-16 lg:self-start lg:pt-10">
            <h1 className="fade-up display text-[clamp(3rem,13vw,6rem)] font-[380] text-ink" style={{ "--d": "0.1s" } as CSSProperties}>
              {t(nav.universes)}
            </h1>
            <p className="fade-up display mt-3 text-[1.35rem] italic text-violet" style={{ "--d": "0.2s" } as CSSProperties}>
              „{t(site.series)}”
            </p>
            <p className="fade-up mt-2 max-w-[36ch] text-[1.05rem] text-ink-soft" style={{ "--d": "0.3s" } as CSSProperties}>
              {t(site.seriesLead)}
            </p>
            <p className="fade-up mt-4 flex items-center gap-2 text-[0.95rem] font-bold text-magenta" style={{ "--d": "0.4s" } as CSSProperties}>
              <span className="size-2 animate-pulse rounded-full bg-magenta" aria-hidden="true" />
              {t(copy.tap)}
            </p>
          </div>
          <WorldMap tone="day" onOpen={open} orbRefs={orbRefs} />
        </main>
      </div>

      {active && <UniversePage id={active} onBack={back} onSwitch={switchTo} />}
    </>
  );
}
