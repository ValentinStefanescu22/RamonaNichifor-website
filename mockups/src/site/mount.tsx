import { StrictMode, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import { LangProvider } from "../shared/lang";

/**
 * Every page opens at its top. The published artifact's host runtime saves the scroll position under
 * ONE sessionStorage key shared by all pages ("__frame_scroll") and restores it at DOMContentLoaded and
 * again when the viewer promotes the frame, so without this every page would open where the previous
 * one was left: usually the footer. Page code runs before DOMContentLoaded, so forgetting that key here
 * leaves the host nothing to restore. Browser scroll restoration is off too, and in-page anchors
 * (Consiliere's „Programează” → #programare) are clicks, not loads, so they still glide.
 */
const HOST_SCROLL_KEY = "__frame_scroll";
const forgetHostScroll = () => {
  try {
    sessionStorage.removeItem(HOST_SCROLL_KEY);
  } catch {
    // storage blocked: the host cannot restore anything either
  }
};

/** Jump (never glide) to the top of the page and of any frame wrapping it */
export function toTop() {
  window.scrollTo({ top: 0, behavior: "instant" });
  document.documentElement.scrollIntoView({ block: "start", behavior: "instant" });
}

function openAtTop() {
  forgetHostScroll();
  // the host flushes the position on pagehide; ours runs after it, so the next page starts clean too
  addEventListener("pagehide", forgetHostScroll);
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  // once the visitor scrolls on their own, a late load event must never yank them back up
  let moved = false;
  for (const type of ["wheel", "touchstart", "keydown", "pointerdown"]) addEventListener(type, () => (moved = true), { once: true, passive: true });
  const top = () => {
    if (!moved) toTop();
  };
  top();
  requestAnimationFrame(top);
  window.addEventListener("load", top, { once: true });
  // back/forward cache brings the old page back as it was; start it at the top too
  window.addEventListener("pageshow", (e) => {
    if (!e.persisted) return;
    moved = false;
    top();
  });
}

/** Boots a page: language, reduced-motion preference and the app. */
export function mount(App: ComponentType) {
  openAtTop();
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <LangProvider>
          <App />
        </LangProvider>
      </MotionConfig>
    </StrictMode>,
  );
}
