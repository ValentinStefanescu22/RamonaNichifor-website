import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { Butterfly } from "../shared/Butterfly";

type Pt = { x: number; y: number };
type Geometry = { pts: Pt[]; startW: number; endW: number; range: [number, number] };

function catmullRom(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const t2 = t * t;
  const t3 = t2 * t;
  const f = (a: number, b: number, c: number, d: number) =>
    0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
  return { x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) };
}

function pathAt(pts: Pt[], t: number): Pt {
  const segs = pts.length - 1;
  const s = Math.min(segs - 1e-6, Math.max(0, t * segs));
  const i = Math.floor(s);
  const local = s - i;
  const p = catmullRom(pts[Math.max(0, i - 1)], pts[i], pts[i + 1], pts[Math.min(segs, i + 2)], local);
  // A flutter that settles as she comes in to land
  const settle = 1 - t;
  return { x: p.x + Math.sin(t * 19) * 14 * settle, y: p.y + Math.sin(t * 27) * 10 * settle };
}

/**
 * The butterfly leaves the hero, drifts down the page with the scroll and lands on the
 * Universul Fluturelui window, where a perched twin takes over (so it scrolls with the card row).
 */
export function Flight({
  zoneRef,
  startRef,
  endRef,
  onLanded,
}: {
  zoneRef: RefObject<HTMLDivElement | null>;
  startRef: RefObject<HTMLDivElement | null>;
  endRef: RefObject<HTMLDivElement | null>;
  onLanded: (landed: boolean) => void;
}) {
  const reduce = useReducedMotion();
  const geo = useRef<Geometry | null>(null);
  const [ready, setReady] = useState(false);
  const [landed, setLanded] = useState(false);
  const [moving, setMoving] = useState(false);

  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, (y) => {
    const g = geo.current;
    if (!g) return 0;
    const [a, b] = g.range;
    return Math.min(1, Math.max(0, (y - a) / (b - a)));
  });
  const smooth = useSpring(progress, { stiffness: 70, damping: 18, mass: 0.7 });

  const x = useTransform(smooth, (t) => (geo.current ? pathAt(geo.current.pts, t).x - geo.current.startW / 2 : 0));
  const y = useTransform(smooth, (t) => (geo.current ? pathAt(geo.current.pts, t).y - geo.current.startW * 0.45 : 0));
  const scale = useTransform(smooth, (t) => {
    const g = geo.current;
    if (!g) return 1;
    return 1 + (g.endW / g.startW - 1) * Math.pow(t, 1.6);
  });
  const rotate = useTransform(smooth, (t) => {
    const g = geo.current;
    if (!g || t <= 0 || t >= 1) return 0;
    const a = pathAt(g.pts, Math.max(0, t - 0.01));
    const b = pathAt(g.pts, Math.min(1, t + 0.01));
    const dx = b.x - a.x;
    const len = Math.hypot(dx, b.y - a.y) || 1;
    return Math.max(-28, Math.min(28, (dx / len) * 34)) * (1 - t);
  });

  useMotionValueEvent(smooth, "change", (t) => {
    const isLanded = t > 0.992;
    setLanded((prev) => {
      if (prev !== isLanded) onLanded(isLanded);
      return isLanded;
    });
    setMoving(Math.abs(t - progress.get()) > 0.004);
  });

  useLayoutEffect(() => {
    const measure = () => {
      const zone = zoneRef.current;
      const start = startRef.current;
      const end = endRef.current;
      if (!zone || !start || !end) return;
      const z = zone.getBoundingClientRect();
      const s = start.getBoundingClientRect();
      const e = end.getBoundingClientRect();
      const p0 = { x: s.left + s.width / 2 - z.left, y: s.top + s.height * 0.45 - z.top };
      const p3 = { x: e.left + e.width / 2 - z.left, y: e.top + e.height * 0.45 - z.top };
      const w = z.width;
      const pts = [
        p0,
        { x: w * 0.2, y: p0.y + (p3.y - p0.y) * 0.34 },
        { x: w * 0.8, y: p0.y + (p3.y - p0.y) * 0.7 },
        p3,
      ];
      const endAbs = e.top + window.scrollY;
      geo.current = {
        pts,
        startW: s.width,
        endW: e.width,
        range: [0, Math.max(200, endAbs - window.innerHeight * 0.42)],
      };
      smooth.jump(progress.get());
      setReady(true);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (zoneRef.current) ro.observe(zoneRef.current);
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [zoneRef, startRef, endRef, progress, smooth]);

  if (reduce) return null;

  return (
    <motion.div
      className="pointer-events-none absolute top-0 left-0 z-30 origin-center"
      style={{ x, y, scale, rotate, width: geo.current?.startW, opacity: ready && !landed ? 1 : 0 }}
      aria-hidden="true"
    >
      <motion.div
        initial={{ x: 180, y: 140, opacity: 0, rotate: -18 }}
        animate={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
        transition={{ delay: 0.5, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="animate-[bob_3.2s_cubic-bezier(0.45,0.05,0.55,0.95)_infinite]">
          <Butterfly width="100%" tempo={moving ? 0.16 : 0.34} />
        </div>
      </motion.div>
    </motion.div>
  );
}
