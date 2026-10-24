"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Every page opens at its top: on first load, on every route change (the real URL, so a language
 * switch counts too), on back/forward and when the bfcache brings a page back. Never when the URL
 * targets an anchor, and never once the visitor has scrolled on their own (the `moved` guard), so a
 * late load event cannot yank them back up. In-page anchors are clicks, not route changes: they still glide.
 */
export function OpenAtTop() {
  const pathname = usePathname();
  const moved = useRef(false);
  const top = useRef(() => {
    if (moved.current || location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  });

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const mark = () => (moved.current = true);
    const types = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    for (const type of types) addEventListener(type, mark, { passive: true });
    const onShow = (e: PageTransitionEvent) => {
      if (!e.persisted) return;
      moved.current = false;
      top.current();
    };
    const onLoad = () => top.current();
    // a link to the page already open is not a route change: jump to its top here (Next's Link calls
    // preventDefault on every internal click, so defaultPrevented says nothing here)
    const onClick = (e: MouseEvent) => {
      const a = e.target instanceof Element ? e.target.closest("a[href]") : null;
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const url = new URL((a as HTMLAnchorElement).href);
      if (url.origin === location.origin && url.pathname === location.pathname && !url.hash) {
        // jump even when the URL still carries an old #anchor: the link drops it
        const jump = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        jump();
        requestAnimationFrame(jump);
      }
    };
    addEventListener("pageshow", onShow);
    addEventListener("click", onClick);
    addEventListener("load", onLoad, { once: true });
    return () => {
      for (const type of types) removeEventListener(type, mark);
      removeEventListener("pageshow", onShow);
      removeEventListener("click", onClick);
      removeEventListener("load", onLoad);
    };
  }, []);

  useEffect(() => {
    // the click or key that started this navigation does not count as scrolling
    moved.current = false;
    top.current();
    const raf = requestAnimationFrame(top.current);
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return null;
}
