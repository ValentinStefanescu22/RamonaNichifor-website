import type { ReactNode } from "react";

/** The home sections' h2 (larger than the inner pages' title) with an optional lead. */
export function SectionTitle({ children, lead, className = "" }: { children: ReactNode; lead?: ReactNode; className?: string }) {
  return (
    <div className={`max-w-2xl ${className}`}>
      <h2 className="display text-[clamp(2.4rem,9vw,4.2rem)] font-[380] text-ink">{children}</h2>
      {lead && <div className="mt-4 max-w-[52ch] text-[1.08rem] leading-relaxed text-ink-soft">{lead}</div>}
    </div>
  );
}
