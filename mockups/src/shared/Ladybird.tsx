import type { CSSProperties } from "react";
import { img } from "./assets";

// Buburuza, cut from page 9 of her book (she sits on a daisy there). `sway` is the length in seconds
// of a slow rock on her feet; 0 keeps her still. Reduced motion stops it globally (base.css).
export function Ladybird({
  width = 80,
  sway = 0,
  delay = 0,
  className = "",
  style,
}: {
  width?: number | string;
  sway?: number;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <img
      src={img("ladybird.webp")}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`ladybird block h-auto ${className}`}
      style={{ width, ...(sway ? { animation: `sway ${sway}s ease-in-out ${delay}s infinite` } : {}), ...style }}
    />
  );
}
