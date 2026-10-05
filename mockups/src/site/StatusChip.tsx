import type { ReactNode } from "react";

/**
 * The one status chip (DESIGN.md "Status badges"): magenta only for what is available now,
 * a soft plum tint for everything that is coming. No ring, no border.
 */
export function StatusChip({ live = false, tint, children }: { live?: boolean; tint?: string; children: ReactNode }) {
  return (
    <span
      className="inline-flex rounded-full px-2.5 py-0.5 text-[0.78rem] font-bold whitespace-nowrap"
      style={
        tint
          ? { background: tint, color: "var(--color-cream)" } // a book that is out, in its universe's deep tint
          : live
            ? { background: "var(--color-magenta)", color: "var(--color-cream)" }
            : { background: "rgb(52 34 74 / 0.1)", color: "var(--color-ink-soft)" }
      }
    >
      {children}
    </span>
  );
}
