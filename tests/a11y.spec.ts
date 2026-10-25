import AxeBuilder from "@axe-core/playwright";
import { allow404, expect, test } from "./fixtures";
import { PAGES } from "./pages";

// WCAG 2.2 AA is the bar (spec §10): no violation of impact serious or critical on any page, in both languages.
// Reduced motion: entrances are skipped, so axe measures contrast on the settled page, not on a half-faded one.
test.use({ reducedMotion: "reduce" });

for (const { path, name, pending } of PAGES) {
  test(`axe: ${name} ${path}`, async ({ page, errors }) => {
    const res = await page.goto(path);
    if (pending && res?.status() === 404) {
      allow404(errors);
      test.skip(true, "page not built yet (tests/pages.ts)");
    }
    expect(res?.status()).toBe(200);
    // Turnstile (/contact) keeps a connection open, so the network never idles there
    await page.waitForLoadState("networkidle", { timeout: 5_000 }).catch(() => {});
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const bad = violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(
      bad.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`),
      "serious / critical axe violations",
    ).toEqual([]);
  });
}
