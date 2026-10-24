"use client";
import { useEffect } from "react";

/** No „Save image as…” menu on her illustrations (img.art); the © stamp and screen-sized files do the rest. */
export function ArtGuard() {
  useEffect(() => {
    const block = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest("img.art")) e.preventDefault();
    };
    addEventListener("contextmenu", block);
    return () => removeEventListener("contextmenu", block);
  }, []);
  return null;
}
