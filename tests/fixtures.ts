import { test as base, expect } from "@playwright/test";

// WebKit reports a Next.js prefetch (?_rsc=) that the next navigation cancels as an error; it is not one.
// Chromium logs a cross-document view transition (globals.css) that a new navigation interrupts; the page is fine.
const benignBrowserLog = (text: string) =>
  (text.includes("_rsc=") && text.includes("due to access control checks")) ||
  text.startsWith("Transition was aborted because of invalid state");

/** Every test fails on a console error or an uncaught page error. */
export const test = base.extend<{ errors: string[] }>({
  errors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("console", (m) => {
        if (m.type() !== "error") return;
        if (benignBrowserLog(m.text())) return;
        errors.push(`${m.text()} (${m.location().url})`);
      });
      page.on("pageerror", (e) => !benignBrowserLog(e.message) && errors.push(e.message));
      await use(errors);
      expect(errors, "console / page errors").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** Drops the console error a browser logs for a document that is meant to be a 404 (the test asserts the status itself). */
export const allow404 = (errors: string[]) => {
  for (let i = errors.length - 1; i >= 0; i--) if (errors[i].includes("status of 404") && !errors[i].includes("_rsc=")) errors.splice(i, 1);
};

/** True when the page scrolls sideways (it never should). */
export const hasSideScroll = (page: import("@playwright/test").Page) =>
  page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
