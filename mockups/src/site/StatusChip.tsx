import type { ReactNode } from "react";

/**
 * The one status chip (DESIGN.md "Status badges"): a soft plum tint for everything that is still
 * coming („În curând”, „În lucru”). A book that is out needs no chip: it shows its year.
 */
export function StatusChip({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex rounded-full px-2.5 py-0.5 text-[0.78rem] font-bold whitespace-nowrap"
      style={{ background: "rgb(52 34 74 / 0.1)", color: "var(--color-ink-soft)" }}
    >
      {children}
    </span>
  );
}
