"use client";
import type { CSSProperties } from "react";

// Ramona's butterfly, cut from the Fluturele cover and split at the body so each
// wing can hinge in 3D. `flap` pauses the wings (e.g. when it has landed).
// The wings load lazily: a hidden perch never fetches them, and they stay out of the first-paint bytes.
// Reduced motion is handled in CSS (wings open), so server and client render the same markup.
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
  return (
    <div
      className={`butterfly ${className}`}
      data-flap={flap ? "on" : "off"}
      style={{ width, ["--flap-tempo" as string]: `${tempo}s`, ...style }}
      aria-hidden="true"
    >
      <img src="/img/butterfly-wing-l.webp" alt="" loading="lazy" width={194} height={406} className="wing wing-l" draggable={false} />
      <img src="/img/butterfly-wing-r.webp" alt="" loading="lazy" width={253} height={406} className="wing wing-r" draggable={false} />
    </div>
  );
}
