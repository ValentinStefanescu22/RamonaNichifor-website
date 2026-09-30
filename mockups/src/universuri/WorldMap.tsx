import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { Butterfly } from "../shared/Butterfly";
import type { Universe, UniverseId } from "../shared/content";
import { ui, universes } from "../shared/content";
import { Creature } from "../shared/creatures";
import { useLang } from "../shared/lang";

type Spot = { x: number; y: number; s: number };
/** "dusk" = concept C's night sky; "day" = the Poiana-palette sky chosen for the real site */
type Tone = "dusk" | "day";
// Orb centres as fractions of the map box; s = diameter as a fraction of map width.
const PHONE: { aspect: number; spots: Spot[] } = {
  aspect: 1.2,
  spots: [
    { x: 0.66, y: 0.15, s: 0.44 },
    { x: 0.24, y: 0.4, s: 0.28 },
    { x: 0.74, y: 0.6, s: 0.28 },
    { x: 0.28, y: 0.83, s: 0.28 },
  ],
};
// Day sky: every world has the same size; only the one being looked at grows. Labels are set in
// Fraunces (two lines), and a grown orb rises about 20% of its size, so same-side worlds sit far
// enough apart that a grown orb never reaches the label above it.
const PHONE_DAY: { aspect: number; spots: Spot[] } = {
  aspect: 1.3,
  spots: [
    { x: 0.66, y: 0.12, s: 0.32 },
    { x: 0.26, y: 0.35, s: 0.32 },
    { x: 0.72, y: 0.6, s: 0.32 },
    { x: 0.28, y: 0.85, s: 0.32 },
  ],
};
const WIDE_DAY: { aspect: number; spots: Spot[] } = {
  aspect: 1.05,
  spots: [
    { x: 0.3, y: 0.18, s: 0.26 },
    { x: 0.76, y: 0.3, s: 0.26 },
    { x: 0.3, y: 0.64, s: 0.26 },
    { x: 0.74, y: 0.78, s: 0.26 },
  ],
};
const WIDE: { aspect: number; spots: Spot[] } = {
  aspect: 0.98,
  spots: [
    { x: 0.3, y: 0.3, s: 0.4 },
    { x: 0.78, y: 0.2, s: 0.27 },
    { x: 0.76, y: 0.66, s: 0.27 },
    { x: 0.32, y: 0.8, s: 0.27 },
  ],
};

// Day sky: each world drifts on its own slow Lissajous loop (x, y and a slight tilt). The periods
// are deliberately incommensurate so the four worlds never fall into step.
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

type FocusState = "on" | "off" | "idle";

function useHoverCapable() {
  const query = "(hover: hover)";
  const [capable, setCapable] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setCapable(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return capable;
}

function smoothPath(points: { x: number; y: number }[]) {
  // Catmull-Rom through the points, written as cubic Béziers
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

/** The watercolour orb itself; shared by the map and the universe page so the morph lines up. */
export function OrbArt({
  u,
  size,
  orbRef,
  className = "",
  style,
}: {
  u: Universe;
  size: number | string;
  orbRef?: (el: HTMLDivElement | null) => void;
  className?: string;
  style?: CSSProperties;
}) {
  const live = u.status === "available";
  return (
    <div
      ref={orbRef}
      data-orb
      className={`relative grid aspect-square place-items-center rounded-full ${className}`}
      style={{ width: size, ...style }}
    >
      <span
        className={`absolute -inset-[18%] rounded-full blur-2xl ${live ? "orb-glow" : "opacity-40"}`}
        style={{ background: `radial-gradient(circle, ${u.tint[1]} 0%, transparent 68%)` }}
        aria-hidden="true"
      />
      <span
        className="paint-edge absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle at 36% 30%, #fff8f1 0%, ${u.tint[0]} 30%, ${u.tint[1]} 88%)`,
          boxShadow: `inset -10px -14px 30px ${u.tint[2]}33, inset 8px 10px 24px #ffffff80`,
        }}
        aria-hidden="true"
      />
      <span className="relative grid w-[64%] place-items-center">
        {live ? <Butterfly width="100%" tempo={1.1} /> : <Creature id={u.id as "buburuza"} size="78%" style={{ color: u.tint[2] }} />}
      </span>
    </div>
  );
}

export function Orb({
  u,
  size,
  onOpen,
  delay,
  orbRef,
  tone = "dusk",
  focus,
  onFocusChange,
}: {
  u: Universe;
  size: number;
  onOpen: (id: UniverseId, el: HTMLElement) => void;
  delay: number;
  orbRef: (el: HTMLDivElement | null) => void;
  tone?: Tone;
  /** Day sky only: whether this world is the one being looked at */
  focus?: FocusState;
  onFocusChange?: (id: UniverseId | null) => void;
}) {
  const { t } = useLang();
  const live = u.status === "available";
  const day = tone === "day";
  const style = day
    ? driftVars(delay)
    : ({ "--float": `${5.2 + delay * 1.3}s`, "--float-delay": `${-delay * 1.7}s` } as CSSProperties);
  return (
    <button
      type="button"
      onClick={(e) => onOpen(u.id, e.currentTarget.querySelector("[data-orb]") as HTMLElement)}
      // Hover grows a world on mouse and pen; touch uses the scroll-driven focus in WorldMap
      onPointerEnter={(e) => e.pointerType !== "touch" && onFocusChange?.(u.id)}
      onPointerLeave={(e) => e.pointerType !== "touch" && onFocusChange?.(null)}
      onFocus={() => onFocusChange?.(u.id)}
      onBlur={() => onFocusChange?.(null)}
      data-focus={focus}
      className="group flex w-full flex-col items-center text-center"
      aria-haspopup="dialog"
    >
      <div className="orb-in" style={{ "--d": `${0.35 + delay * 0.15}s` } as CSSProperties}>
        <div className={day ? "drift-r" : "orb-float"} style={style}>
          {day ? (
            <div className="orb-grow">
              <OrbArt u={u} size={size} orbRef={orbRef} className="transition-transform duration-150 group-active:scale-[0.97]" />
            </div>
          ) : (
            <OrbArt
              u={u}
              size={size}
              orbRef={orbRef}
              className="transition-transform duration-500 ease-(--ease-glide) group-hover:scale-[1.04] group-active:scale-[0.97]"
            />
          )}
        </div>
      </div>
      <span
        className={`display relative mt-2.5 rounded-full px-3 py-0.5 text-[1.05rem] leading-tight backdrop-blur-sm sm:text-[1.25rem] ${
          day ? "orb-label bg-cream/80 text-ink ring-1 ring-ink/5" : "bg-night/55 font-semibold text-cream"
        }`}
      >
        {t(u.name)}
      </span>
      <span
        className={`relative mt-1.5 rounded-full px-2.5 py-0.5 text-[0.78rem] font-bold ${day ? "orb-label" : ""}`}
        style={
          day
            ? live
              ? { background: "var(--color-magenta)", color: "var(--color-cream)" }
              : { background: "rgb(52 34 74 / 0.1)", color: "var(--color-ink-soft)" }
            : live
              ? { background: "var(--color-pollen)", color: "var(--color-night)" }
              : { background: "rgb(36 27 61 / 0.6)", color: "var(--color-cream)" }
        }
      >
        {t(live ? ui.available : ui.comingSoon)}
      </span>
    </button>
  );
}

export function WorldMap({
  onOpen,
  orbRefs,
  tone = "dusk",
}: {
  onOpen: (id: UniverseId, el: HTMLElement) => void;
  orbRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  tone?: Tone;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 340, wide: false });
  const day = tone === "day";
  const canHover = useHoverCapable();
  const [focusId, setFocusId] = useState<UniverseId | null>(null);
  const focusRef = useRef<UniverseId | null>(null);
  focusRef.current = focusId;

  // Phones: the world nearest the middle of the screen is the one "looked at". A small margin
  // stops the focus flickering between two worlds that are almost equally close.
  // At rest every world is the same size; the mid-screen world only grows once the visitor scrolls.
  const scrolledRef = useRef(false);
  const pickNearest = useCallback(() => {
    if (!day || canHover || !scrolledRef.current) return;
    const mid = window.innerHeight / 2;
    const distance = (id: string) => {
      const el = orbRefs.current[id];
      if (!el) return Infinity;
      const r = el.getBoundingClientRect();
      return Math.abs(r.top + r.height / 2 - mid);
    };
    let best: UniverseId | null = null;
    let bestD = Infinity;
    for (const u of universes) {
      const d = distance(u.id);
      if (d < bestD) {
        bestD = d;
        best = u.id;
      }
    }
    const current = focusRef.current;
    let next: UniverseId | null = bestD < window.innerHeight * 0.45 ? best : null;
    if (current && next && next !== current && bestD > distance(current) - 24) next = current;
    if (next !== current) setFocusId(next);
  }, [day, canHover, orbRefs]);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    if (y > 8) scrolledRef.current = true;
    pickNearest();
  });
  useEffect(() => {
    pickNearest();
    window.addEventListener("resize", pickNearest);
    return () => window.removeEventListener("resize", pickNearest);
  }, [pickNearest]);

  const focusOf = (id: UniverseId): FocusState | undefined =>
    !day ? undefined : focusId === null ? "idle" : focusId === id ? "on" : "off";
  const onFocusChange = day && canHover ? setFocusId : undefined;

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => setDims({ w: el.clientWidth, wide: window.innerWidth >= 1024 });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const layout = day ? (dims.wide ? WIDE_DAY : PHONE_DAY) : dims.wide ? WIDE : PHONE;
  const w = dims.w;
  const h = w * layout.aspect;
  const centers = layout.spots.map((s) => ({ x: s.x * w, y: s.y * h }));
  const d = smoothPath([{ x: dims.wide ? -w * 0.05 : w * 0.08, y: dims.wide ? h * 0.02 : -h * 0.02 }, ...centers]);

  const { scrollYProgress } = useScroll({ target: box, offset: ["start 0.9", "end 0.75"] });
  const drawn = useTransform(scrollYProgress, [0, 1], [0.22, 1]);

  return (
    <div ref={box} className="relative w-full" style={{ height: h }}>
      {/* The dusk concept keeps its dotted path; the day sky lets the worlds float free */}
      {!day && (
        <svg className="pointer-events-none absolute inset-0 overflow-visible" width={w} height={h} aria-hidden="true">
          <defs>
            <mask id="path-reveal" maskUnits="userSpaceOnUse" x={-w} y={-h} width={w * 3} height={h * 3}>
              <motion.path d={d} fill="none" stroke="#fff" strokeWidth="14" strokeLinecap="round" style={{ pathLength: drawn }} />
            </mask>
          </defs>
          <path d={d} fill="none" stroke="rgb(255 248 241 / 0.22)" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="0 11" />
          <path d={d} fill="none" stroke="var(--color-pollen)" strokeWidth="3.2" strokeLinecap="round" strokeDasharray="0 11" mask="url(#path-reveal)" />
        </svg>
      )}
      {universes.map((u, i) => {
        const s = layout.spots[i];
        const size = s.s * w;
        const orb = (
          <Orb
            u={u}
            size={size}
            delay={i}
            tone={tone}
            focus={focusOf(u.id)}
            onFocusChange={onFocusChange}
            onOpen={onOpen}
            orbRef={(el) => (orbRefs.current[u.id] = el)}
          />
        );
        return (
          <div
            key={u.id}
            className="absolute -translate-x-1/2"
            style={{ left: s.x * w, top: s.y * h - size / 2, width: Math.max(size, 144), zIndex: focusId === u.id ? 2 : 1 }}
          >
            {day ? (
              <div className="drift-x" style={driftVars(i)}>
                <div className="drift-y">{orb}</div>
              </div>
            ) : (
              orb
            )}
          </div>
        );
      })}
    </div>
  );
}
