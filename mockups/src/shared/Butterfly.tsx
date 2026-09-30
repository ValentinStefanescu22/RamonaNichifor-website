import type { CSSProperties } from "react";
import { useReducedMotion } from "motion/react";
import { img } from "./assets";

// Ramona's butterfly, cut from the Fluturele cover and split at the body so each
// wing can hinge in 3D. `flap` pauses the wings (e.g. when it has landed).
export function Butterfly({
  width = 120,
  flap = true,
  tempo = 0.34,
  className = "",
  style,
}: {
  width?: number | string;
  flap?: boolean;
  tempo?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <div
      className={`butterfly ${className}`}
      data-flap={flap && !reduce ? "on" : "off"}
      style={{ width, ["--flap-tempo" as string]: `${tempo}s`, ...style }}
      aria-hidden="true"
    >
      <img src={img("butterfly-wing-l.webp")} alt="" className="wing wing-l" draggable={false} />
      <img src={img("butterfly-wing-r.webp")} alt="" className="wing wing-r" draggable={false} />
    </div>
  );
}
