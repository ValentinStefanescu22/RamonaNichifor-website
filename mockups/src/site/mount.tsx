import { StrictMode, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import { LangProvider } from "../shared/lang";

/**
 * Every page opens at its top. The browser's own restoration, a hash with no target, or a viewer
 * that wraps the page in a scrolling frame (the published artifact) could otherwise keep the old
 * position and drop the visitor at the footer. scrollIntoView also scrolls those wrapping frames.
 * In-page anchors (Consiliere's „Programează” → #programare) are clicks, not loads, so they still glide.
 */
/** Jump (never glide) to the top of the page and of any frame wrapping it */
export function toTop() {
  window.scrollTo({ top: 0, behavior: "instant" });
  document.documentElement.scrollIntoView({ block: "start", behavior: "instant" });
}

function openAtTop() {
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
