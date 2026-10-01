import { motion, useReducedMotion } from "motion/react";
import { img } from "../../shared/assets";
import { Butterfly } from "../../shared/Butterfly";

/**
 * Butterflies gathering: the real cover butterfly, several times over, flies in from every side and
 * settles above the meadow inside an arch window, the way people gather around a story. Each one
 * keeps its own slow wingbeat and drift. Under reduced motion they are simply there, wings still.
 */

const flock = [
  // left/top in % of the window, width in %, resting tilt, where it flies in from (px)
  { left: 50, top: 20, w: 34, tilt: -6, from: [0, -120], tempo: 0.62 },
  { left: 20, top: 40, w: 21, tilt: 12, from: [-160, -30], tempo: 0.48 },
  { left: 80, top: 34, w: 23, tilt: -14, from: [170, -40], tempo: 0.55 },
  { left: 33, top: 63, w: 15, tilt: 6, from: [-140, 90], tempo: 0.42 },
  { left: 70, top: 62, w: 16, tilt: -8, from: [150, 100], tempo: 0.5 },
  { left: 56, top: 47, w: 12, tilt: 16, from: [60, 140], tempo: 0.38 },
];

export function GatheringCircle() {
  const reduce = useReducedMotion();
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
        {flock.map((b, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `${b.left}%`, top: `${b.top}%`, width: `${b.w}%`, translate: "-50% -50%" }}
            initial={reduce ? false : { x: b.from[0], y: b.from[1], opacity: 0, rotate: b.tilt + 24 }}
            animate={{ x: 0, y: 0, opacity: 1, rotate: b.tilt }}
            transition={{ type: "spring", bounce: 0, duration: 1.8, delay: 0.25 + i * 0.22 }}
          >
            {/* once settled, each drifts on its own slow breath */}
            <div style={reduce ? undefined : { animation: `bob ${4.2 + i * 0.6}s ease-in-out ${i * -0.9}s infinite` }}>
              <Butterfly width="100%" tempo={b.tempo} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
