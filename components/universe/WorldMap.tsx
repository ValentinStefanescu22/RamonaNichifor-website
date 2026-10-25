"use client";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Universe } from "@/content/types";
import { MorphOrb, OrbArt, type OrbUniverse } from "./OrbArt";

export type MapWorld = OrbUniverse & Pick<Universe, "slug" | "name">;

// The map is pure CSS, so the server sends it laid out (every world a real link, no JS needed): positions are fractions of
// the map's width (cqw), so they scale with it. Phones: orbs 25% of the width in a gentle zig-zag, same-side worlds one label
// stack plus air apart, so all four worlds, labels and badges included, end inside the first screen of a 393×659 iPhone
// (tests/universes.spec.ts). Laptops (≥1024): the mockup's spots (map 1.05 × width, orbs 26%).
const STACK = 80; // px under an orb: the name pill (two lines of Fraunces) and the status badge
const AIR = 12; // px between a badge and the orb below it on the same side
type Spot = { x: number; top: string };
const PHONE: Spot[] = [
  { x: 0.72, top: "0cqw" },
  { x: 0.28, top: "8cqw" },
  { x: 0.72, top: `calc(25cqw + ${STACK + AIR}px)` },
  { x: 0.28, top: `calc(33cqw + ${STACK + AIR}px)` },
];
const PHONE_HEIGHT = `calc(58cqw + ${2 * STACK + AIR}px)`;
const WIDE: Spot[] = [0.18, 0.3, 0.64, 0.78].map((y, i) => ({ x: [0.3, 0.76, 0.3, 0.74][i], top: `${(y * 105 - 13).toFixed(1)}cqw` }));

// Each world drifts on its own slow Lissajous loop (x, y and a slight tilt); the periods never fall into step (DESIGN.md Orb drift)
const DRIFT = [
  { x: 7.3, y: 5.1, r: 9.7 },
  { x: 8.9, y: 6.3, r: 11.3 },
  { x: 6.7, y: 5.8, r: 10.1 },
  { x: 9.4, y: 7.1, r: 12.2 },
];
const driftVars = (i: number) => {
  const d = DRIFT[i % DRIFT.length];
  return {
    "--dx": `${d.x}s`,
    "--dx-delay": `${-d.x * (0.3 + i * 0.17)}s`,
    "--dy": `${d.y}s`,
    "--dy-delay": `${-d.y * (0.6 + i * 0.11)}s`,
    "--dr": `${d.r}s`,
    "--dr-delay": `${-d.r * (0.2 + i * 0.23)}s`,
  } as CSSProperties;
};

/**
 * The map of worlds (port of mockups/src/universuri/WorldMap.tsx). The world being looked at grows and the others step back
 * (DESIGN.md Orb focus): mouse/pen hover or keyboard focus where hover exists; on touch screens, once the visitor scrolls,
 * the world nearest the middle of the screen. Each orb is a link typed "morph": React morphs it into the universe's hero orb.
 */
export function WorldMap({ worlds }: { worlds: MapWorld[] }) {
  const t = useTranslations("ui");
  const [focusId, setFocusId] = useState<string | null>(null);
  const [canHover, setCanHover] = useState(true);
  const orbs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Touch: nothing grows at rest; after the first scroll, the world nearest mid-screen (within 45% of the viewport),
  // with a 24px margin so the focus never flickers between two worlds almost equally close
  const pickNearest = useCallback(() => {
    const mid = window.innerHeight / 2;
    const distance = (id: string) => {
      const r = orbs.current[id]?.getBoundingClientRect();
      return r ? Math.abs(r.top + r.height / 2 - mid) : Infinity;
    };
    setFocusId((current) => {
      let best: string | null = null;
      let bestD = Infinity;
      for (const w of worlds) {
        const d = distance(w.id);
        if (d < bestD) [best, bestD] = [w.id, d];
      }
      let next = bestD < window.innerHeight * 0.45 ? best : null;
      if (current && next && next !== current && bestD > distance(current) - 24) next = current;
      return next;
    });
  }, [worlds]);

  useEffect(() => {
    if (canHover) return;
    let raf = 0;
    const onScroll = () => {
      if (scrollY <= 8) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(pickNearest);
    };
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [canHover, pickNearest]);

  const focusOf = (id: string) => (focusId === null ? "idle" : focusId === id ? "on" : "off");
  const look = (id: string | null) => canHover && setFocusId(id);

  return (
    <div className="@container w-full">
      <ul className="relative h-(--map-h) w-full lg:h-[105cqw]" style={{ "--map-h": PHONE_HEIGHT } as CSSProperties}>
        {worlds.map((w, i) => {
          const live = w.status === "available";
          return (
            <li
              key={w.id}
              className="absolute top-(--top) left-(--x) w-[max(var(--orb),144px)] -translate-x-1/2 [--orb:25cqw] lg:top-(--top-wide) lg:left-(--x-wide) lg:[--orb:26cqw]"
              style={
                {
                  "--x": `${PHONE[i % 4].x * 100}cqw`,
                  "--top": PHONE[i % 4].top,
                  "--x-wide": `${WIDE[i % 4].x * 100}cqw`,
                  "--top-wide": WIDE[i % 4].top,
                  zIndex: focusId === w.id ? 2 : 1,
                } as CSSProperties
              }
            >
              <div className="drift-x" style={driftVars(i)}>
                <div className="drift-y">
                  <Link
                    href={{ pathname: "/universuri/[slug]", params: { slug: w.slug } }}
                    transitionTypes={["morph"]}
                    data-orb-link
                    data-focus={focusOf(w.id)}
                    onPointerEnter={(e) => e.pointerType !== "touch" && look(w.id)}
                    onPointerLeave={(e) => e.pointerType !== "touch" && look(null)}
                    onFocus={() => look(w.id)}
                    onBlur={() => look(null)}
                    className="group flex w-full flex-col items-center rounded-[2rem] text-center outline-offset-4"
                  >
                    <div className="orb-in" style={{ "--d": `${0.35 + i * 0.15}s` } as CSSProperties}>
                      <div className="drift-r" style={driftVars(i)}>
                        <div
                          className="orb-grow"
                          ref={(el) => {
                            orbs.current[w.id] = el;
                          }}
                        >
                          <MorphOrb id={w.id}>
                            <OrbArt u={w} size="var(--orb)" className="transition-transform duration-150 group-active:scale-[0.97]" />
                          </MorphOrb>
                        </div>
                      </div>
                    </div>
                    <span className="display orb-label relative mt-2.5 rounded-full bg-cream/80 px-3 py-0.5 text-[1.05rem] leading-tight text-ink ring-1 ring-ink/5 backdrop-blur-sm sm:text-[1.25rem]">
                      {w.name}
                    </span>
                    <span
                      className="orb-label relative mt-1.5 rounded-full px-2.5 py-0.5 text-[0.78rem] font-bold"
                      // each world's own deep tint, so two published books never compete as two magenta sparks
                      style={live ? { background: w.tint[2], color: "var(--color-cream)" } : { background: "rgb(52 34 74 / 0.1)", color: "var(--color-ink-soft)" }}
                    >
                      {t(live ? "bookOut" : "comingSoon")}
                    </span>
                  </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
