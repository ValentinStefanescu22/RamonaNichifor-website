import type { CSSProperties, ReactNode } from "react";

/** A block that settles into place (fade + 14px) as it scrolls in, `i` staggers a group. Pure CSS (.reveal in globals.css):
 *  server-rendered, visible without JavaScript, still under reduced motion. */
export function Reveal({ i = 0, className = "", children }: { i?: number; className?: string; children: ReactNode }) {
  return (
    <div className={`reveal ${className}`} style={{ "--i": Math.min(i, 4) } as CSSProperties}>
      {children}
    </div>
  );
}
