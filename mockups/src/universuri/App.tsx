import { useCallback, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useReducedMotion } from "motion/react";
import { ConceptStrip } from "../shared/ConceptStrip";
import type { UniverseId } from "../shared/content";
import { site, ui } from "../shared/content";
import { useLang } from "../shared/lang";
import { Pollen } from "./Pollen";
import { About, ArtAndCounselling, BooksByAge, Dock, Footer, Header } from "./Sections";
import { UniverseSheet } from "./UniverseSheet";
import { WorldMap } from "./WorldMap";

const MORPH = "universe-sheet";

/** Runs a DOM update as a named-element morph where the View Transitions API exists. */
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

export default function App() {
  const { t } = useLang();
  const reduce = useReducedMotion();
  const [active, setActive] = useState<UniverseId | null>(null);
  const orbRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const open = useCallback(
    (id: UniverseId, orb: HTMLElement) => {
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

  const close = useCallback(() => {
    const orb = active ? orbRefs.current[active] : null;
    if (reduce || !orb) return setActive(null);
    const vt = morph(() => {
      flushSync(() => setActive(null));
      orb.style.viewTransitionName = MORPH;
    });
    const clear = () => (orb.style.viewTransitionName = "");
    if (vt) vt.finished.then(clear, clear);
    else clear();
  }, [active, reduce]);

  return (
    <>
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <filter id="orb-edge" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="3" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="6" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <ConceptStrip concept="universuri" />
      <div className="relative">
        <div className="absolute inset-x-0 top-0 z-20">
          <Header />
        </div>
        <main>
          <div className="sky relative isolate overflow-hidden" id="top">
            <Pollen className="absolute inset-0 -z-10 h-full w-full" />
            <section id="universuri" className="relative mx-auto grid max-w-6xl scroll-mt-4 gap-6 px-4 pt-20 pb-28 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-6 lg:pt-24 lg:pb-36">
              <div className="lg:sticky lg:top-24 lg:self-start lg:pt-10">
                <h1 className="fade-up display text-[clamp(3rem,13vw,6.4rem)] font-semibold text-cream" style={{ ["--d" as string]: "0.1s" }}>
                  {t(site.series)}.
                </h1>
                <p className="fade-up mt-5 max-w-[30ch] text-[1.15rem] leading-snug text-lilac-soft" style={{ ["--d" as string]: "0.25s" }}>
                  {t(site.souls)}, {t({ ro: "de", en: "by" })} <span className="font-bold text-cream">Ramona Nichifor</span>.
                </p>
                <p className="fade-up mt-4 flex items-center gap-2 text-[0.95rem] font-bold text-pollen lg:mt-6" style={{ ["--d" as string]: "0.4s" }}>
                  <span className="size-2 animate-pulse rounded-full bg-pollen" aria-hidden="true" />
                  {t(tapHint)}
                </p>
              </div>
              <WorldMap onOpen={open} orbRefs={orbRefs} />
            </section>
          </div>
          <BooksByAge />
          <ArtAndCounselling />
          <About />
        </main>
      </div>
      <Footer />
      <Dock />
      {active && <UniverseSheet id={active} onClose={close} />}
      <span className="sr-only" aria-live="polite">
        {active ? t(ui.inThisUniverse) : ""}
      </span>
    </>
  );
}

const tapHint = { ro: "Atinge o lume ca s-o deschizi", en: "Tap a world to open it" };
