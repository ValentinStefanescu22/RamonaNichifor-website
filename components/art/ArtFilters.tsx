"use client";
import { m } from "motion/react";

export type ArtFilter = "all" | "original" | "print";
export type ArtFilterTab = { id: ArtFilter; label: string; count: number };

/** Toate · Originale · Printuri: toggle buttons (`aria-pressed`), the ink pill slides to the choice (mockup pages/arta/App.tsx). */
export function ArtFilters({ filters, value, onChange, label }: { filters: ArtFilterTab[]; value: ArtFilter; onChange: (id: ArtFilter) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {filters.map((f) => {
        const on = f.id === value;
        return (
          <button
            key={f.id}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(f.id)}
            className="relative z-0 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[0.98rem] font-medium ring-1 ring-ink/12 transition-colors duration-300"
            style={{ color: on ? "var(--color-cream)" : "var(--color-ink-soft)" }}
          >
            {on && <m.span layoutId="art-filter" className="absolute inset-0 -z-10 rounded-full bg-ink" transition={{ type: "spring", bounce: 0, duration: 0.4 }} />}
            {f.label}
            <span className="text-[0.8rem] tabular-nums opacity-70">{f.count}</span>
          </button>
        );
      })}
    </div>
  );
}
