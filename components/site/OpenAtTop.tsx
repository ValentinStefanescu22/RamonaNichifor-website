"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Scroll positions per URL, saved only when a page is left (link click, Back/Forward, document unload):
// no scroll listener. sessionStorage, so a full document load (language switch, reload) keeps them too.
// ponytail: keyed by URL, so the same page twice in one history stack shares one position; key by history entry if that matters.
const KEY = "rn-scroll:";
const here = () => location.pathname + location.search;
const save = (url: string) => {
  try {
    sessionStorage.setItem(KEY + url, String(Math.round(scrollY)));
  } catch {}
};
const saved = (url: string) => {
  try {
    const y = sessionStorage.getItem(KEY + url);
    return y === null ? 0 : Number(y) || 0;
  } catch {
    return 0;
  }
};

/**
 * A new page opens at its top: on first load and on every route change (the real URL, so a language switch
 * counts too). Back/Forward (and a reload) return to where the visitor was on that page instead. Never when
 * the URL targets an anchor, and never once the visitor has scrolled on their own (the `moved` guard), so a
 * late load event cannot yank them. In-page anchors are clicks, not route changes: they still glide.
 */
export function OpenAtTop() {
  const pathname = usePathname();
  const moved = useRef(false);
  const restoreTo = useRef<number | null>(null); // set by Back/Forward/reload, used by the next route effect
  const initialY = useRef<number | null>(null);
  const firstRoute = useRef(true);
  const lastUrl = useRef("");
  const goTo = useRef((y: number) => {
    if (moved.current || location.hash) return;
    window.scrollTo({ top: y, left: 0, behavior: "instant" });
  });

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type === "back_forward" || nav?.type === "reload") restoreTo.current = saved(here());
    initialY.current = restoreTo.current;

    const mark = () => (moved.current = true);
    const types = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    for (const type of types) addEventListener(type, mark, { passive: true });
    // the URL has already changed, the old page is still on screen: its position belongs to lastUrl
    const onPop = () => {
      if (here() === lastUrl.current) return; // only the #anchor changed: no route effect will run
      save(lastUrl.current);
      restoreTo.current = saved(here());
    };
    const onHide = () => save(here());
    // a fresh load already opens at the top (or the #anchor): only a restored position needs applying
    const onLoad = () => initialY.current !== null && goTo.current(initialY.current);
    // capture: runs before Next's Link starts the navigation, while this page is still the one scrolled
    const onClick = (e: MouseEvent) => {
      const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const url = new URL((a as HTMLAnchorElement).href);
      if (url.origin !== location.origin) return;
      save(here());
      // a link to the page already open is not a route change: jump to its top here, even when the URL
      // still carries an old #anchor (the link drops it)
      if (url.pathname === location.pathname && !url.hash) {
        const jump = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        jump();
        requestAnimationFrame(jump);
      }
    };
    addEventListener("popstate", onPop);
    addEventListener("pagehide", onHide);
    addEventListener("click", onClick, true);
    addEventListener("load", onLoad, { once: true });
    return () => {
      for (const type of types) removeEventListener(type, mark);
      removeEventListener("popstate", onPop);
      removeEventListener("pagehide", onHide);
      removeEventListener("click", onClick, true);
      removeEventListener("load", onLoad);
    };
  }, []);

  useEffect(() => {
    // the click or key that started this navigation does not count as scrolling
    moved.current = false;
    lastUrl.current = here();
    const first = firstRoute.current;
    firstRoute.current = false;
    // hydration of a fresh load: the browser has it at the top already, and the visitor may have scrolled
    if (first && restoreTo.current === null) return;
    const y = restoreTo.current ?? 0;
    restoreTo.current = null;
    goTo.current(y);
    // once more after layout settles, for a page that grows on its first frame
    const raf = requestAnimationFrame(() => goTo.current(y));
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
