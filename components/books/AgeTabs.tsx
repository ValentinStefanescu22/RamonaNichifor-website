"use client";
import { useRef, type KeyboardEvent } from "react";
import { m } from "motion/react";

export type AgeId = "copii" | "adolescenti" | "adulti";
export type AgeTab = { id: AgeId; label: string; count: number };

/**
 * Copii · Adolescenți · Adulți as a radiogroup (one choice, arrows move the choice and the focus, Home/End jump): the ink pill
 * slides to the choice on a critically damped spring (mockups/src/pages/carti/App.tsx AgeTabs).
 */
export function AgeTabs({ ages, value, onChange, label }: { ages: AgeTab[]; value: AgeId; onChange: (id: AgeId) => void; label: string }) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const onKey = (e: KeyboardEvent) => {
    const i = ages.findIndex((a) => a.id === value);
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown" ? i + 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? ages.length - 1 : null;
    if (next === null) return;
    e.preventDefault();
    const a = ages[(next + ages.length) % ages.length];
    onChange(a.id);
    refs.current[a.id]?.focus();
  };
  return (
    <div role="radiogroup" aria-label={label} onKeyDown={onKey} className="inline-flex rounded-full bg-white/60 p-1 ring-1 ring-ink/8 backdrop-blur-sm">
      {ages.map((a) => {
        const on = a.id === value;
        return (
          <button
            key={a.id}
            ref={(el) => {
              refs.current[a.id] = el;
            }}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(a.id)}
            className="relative z-0 inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[0.98rem] font-medium transition-colors duration-300 sm:px-5"
            style={{ color: on ? "var(--color-cream)" : "var(--color-ink-soft)" }}
          >
            {on && <m.span layoutId="age-pill" className="absolute inset-0 -z-10 rounded-full bg-ink" transition={{ type: "spring", bounce: 0, duration: 0.4 }} />}
            {a.label}
            {a.count > 0 && <span className="text-[0.8rem] tabular-nums opacity-70">{a.count}</span>}
          </button>
        );
      })}
    </div>
  );
}
