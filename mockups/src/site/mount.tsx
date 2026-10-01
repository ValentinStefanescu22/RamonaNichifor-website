import { StrictMode, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import { LangProvider } from "../shared/lang";

/** Boots a page: language, reduced-motion preference and the app. */
export function mount(App: ComponentType) {
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
