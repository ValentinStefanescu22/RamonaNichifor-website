import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { motion } from "motion/react";
import type { Lang, Text } from "./content";
import { ui } from "./content";

const STORAGE_KEY = "rn-lang";

function readInitialLang(): Lang {
  if (typeof window === "undefined") return "ro";
  const hash = window.location.hash.replace("#", "").toLowerCase();
  if (hash === "en" || hash === "ro") return hash;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "ro") return stored;
  } catch {
    // Storage can be blocked (private mode, sandboxed previews); Romanian stays the default.
  }
  return "ro";
}

type LangContextValue = { lang: Lang; setLang: (next: Lang) => void; t: (text: Text) => string };

const LangContext = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    if (next === lang) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Not persisted; the switch still works for this visit.
    }
    const hash = window.location.hash.replace("#", "");
    if (hash === "en" || hash === "ro" || next === "en") {
      history.replaceState(null, "", next === "en" ? "#en" : window.location.pathname + window.location.search);
    }
    const apply = () => flushSync(() => setLangState(next));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (document.startViewTransition && !reduce) {
      // An aborted transition (hidden tab, rapid taps) still applies the update; swallow the rejection.
      const vt = document.startViewTransition(apply);
      vt.ready.catch(() => {});
      vt.finished.catch(() => {});
    } else apply();
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: (text: Text) => text[lang] }), [lang, setLang]);
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}

/**
 * RO | EN pill. Colours come from the concept's tokens:
 * --toggle-bg, --toggle-ink, --toggle-thumb, --toggle-thumb-ink.
 */
export function LangToggle({ className = "", id = "lang" }: { className?: string; id?: string }) {
  const { lang, setLang, t } = useLang();
  return (
    <div
      role="radiogroup"
      aria-label={t(ui.languageLabel)}
      className={`relative inline-flex h-11 items-center rounded-full p-1 text-[0.8rem] font-semibold tracking-[0.08em] ${className}`}
      style={{ background: "var(--toggle-bg)", color: "var(--toggle-ink)" }}
    >
      {(["ro", "en"] as const).map((code) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setLang(code)}
            className="relative z-0 grid h-9 min-w-11 place-items-center rounded-full px-3 uppercase transition-colors duration-300 after:absolute after:inset-x-0 after:-inset-y-1 after:content-['']"
            style={{ color: active ? "var(--toggle-thumb-ink)" : "var(--toggle-ink)" }}
          >
            {active && (
              <motion.span
                layoutId={`${id}-thumb`}
                className="absolute inset-0 -z-10 rounded-full"
                style={{ background: "var(--toggle-thumb)" }}
                transition={{ type: "spring", bounce: 0, duration: 0.35 }}
              />
            )}
            {code}
          </button>
        );
      })}
    </div>
  );
}
