import { motion, useReducedMotion } from "motion/react";
import { img } from "../../shared/assets";
import { Butterfly } from "../../shared/Butterfly";
import { Ladybird } from "../../shared/Ladybird";

/**
 * Gathering: the real cover butterflies fly in from every side and settle above the meadow inside an
 * arch window, the way people gather around a story; then Buburuza and two friends (cut from page 9 of
 * her book) land on the flower line. Butterflies keep their slow wingbeat and drift; ladybirds rock on
 * their feet. Under reduced motion everyone is simply there, still.
 */

// left/top in % of the window, width in %, resting tilt, where it comes in from (px), wingbeat
const butterflies = [
  { left: 50, top: 20, w: 34, tilt: -6, from: [0, -120], tempo: 0.62 },
  { left: 20, top: 40, w: 21, tilt: 12, from: [-160, -30], tempo: 0.48 },
  { left: 80, top: 34, w: 23, tilt: -14, from: [170, -40], tempo: 0.55 },
  { left: 60, top: 49, w: 14, tilt: -8, from: [150, 60], tempo: 0.42 },
];
// ladybirds land low on the flowers, from the sides; sway = seconds of one rock
const ladybirds = [
  { left: 31, top: 73, w: 19, tilt: -6, from: [-190, -110], sway: 5.6 },
  { left: 70, top: 78, w: 15, tilt: 7, from: [200, -90], sway: 6.2 },
  { left: 86, top: 66, w: 10, tilt: -3, from: [120, -140], sway: 5.1 },
];

export function GatheringCircle() {
  const reduce = useReducedMotion();
  const settle = { type: "spring", bounce: 0 } as const;
  return (
    <div className="relative mx-auto w-[min(80vw,400px)]" aria-hidden="true">
      <div
        className="arch relative aspect-[4/5] overflow-hidden shadow-soft"
        style={{ background: "linear-gradient(180deg, #dbe7f4 0%, #ece6f5 45%, #f6e2ea 70%, var(--color-cream) 100%)" }}
      >
        <img
          src={img("meadow.webp")}
          alt=""
          className="absolute inset-x-0 bottom-0 h-[46%] w-full object-cover object-[50%_100%]"
          style={{ maskImage: "linear-gradient(180deg, transparent 0%, #000 30%)", WebkitMaskImage: "linear-gradient(180deg, transparent 0%, #000 30%)" }}
        />
        {butterflies.map((b, i) => (
          <motion.div
            key={`b${i}`}
            className="absolute"
            style={{ left: `${b.left}%`, top: `${b.top}%`, width: `${b.w}%`, translate: "-50% -50%" }}
            initial={reduce ? false : { x: b.from[0], y: b.from[1], opacity: 0, rotate: b.tilt + 24 }}
            animate={{ x: 0, y: 0, opacity: 1, rotate: b.tilt }}
            transition={{ ...settle, duration: 1.8, delay: 0.25 + i * 0.22 }}
          >
            {/* once settled, each drifts on its own slow breath */}
            <div style={reduce ? undefined : { animation: `bob ${4.2 + i * 0.6}s ease-in-out ${i * -0.9}s infinite` }}>
              <Butterfly width="100%" tempo={b.tempo} />
            </div>
          </motion.div>
        ))}
        {ladybirds.map((l, i) => (
          <motion.div
            key={`l${i}`}
            className="absolute"
            style={{ left: `${l.left}%`, top: `${l.top}%`, width: `${l.w}%`, translate: "-50% -50%" }}
            initial={reduce ? false : { x: l.from[0], y: l.from[1], opacity: 0, rotate: l.tilt + (l.from[0] < 0 ? -18 : 18) }}
            animate={{ x: 0, y: 0, opacity: 1, rotate: l.tilt }}
            // sideways first, then down: the horizontal spring settles sooner than the vertical one, so the
            // path curves into a landing instead of a straight slide
            transition={{
              x: { ...settle, duration: 1.4, delay: 1.15 + i * 0.28 },
              y: { ...settle, duration: 1.9, delay: 1.15 + i * 0.28 },
              rotate: { ...settle, duration: 1.9, delay: 1.15 + i * 0.28 },
              opacity: { duration: 0.5, ease: "easeOut", delay: 1.15 + i * 0.28 },
            }}
          >
            <Ladybird width="100%" sway={reduce ? 0 : l.sway} delay={i * -1.7} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
