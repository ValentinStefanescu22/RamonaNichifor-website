import type { ReactNode } from "react";

/** The inner pages' h2 with its lead (mockups/src/site/Layout.tsx SectionTitle) */
export function SectionTitle({ children, lead, id }: { children: ReactNode; lead?: ReactNode; id?: string }) {
  return (
    <div className="max-w-2xl">
      <h2 id={id} className="display text-[clamp(2.2rem,8.5vw,3.8rem)] font-[380] text-ink">
        {children}
      </h2>
      {lead && <div className="mt-4 max-w-[52ch] text-[1.08rem] leading-relaxed text-ink-soft">{lead}</div>}
    </div>
  );
}
