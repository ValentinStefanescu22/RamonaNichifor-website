import type { Page } from "@playwright/test";
import { test, expect, allow404 } from "./fixtures";

// Port of mockups/scripts/check-routing.js: every internal link opens its page at the top (also after
// a scroll down to reach the link), stays there 1.2s later, and Back lands at the top again.

type Region = "header" | "footer" | "main" | "sheet";
const roots: Record<Region, string> = { header: "header", footer: "footer", main: "main", sheet: "[role=dialog]" };

const openSheet = (page: Page) => page.locator("header [data-menu-button]").click();

/** Unique internal hrefs visible in a region of the page */
async function hrefsIn(page: Page, region: Region) {
  if (region === "sheet") await openSheet(page);
  const hrefs = await page.locator(roots[region]).evaluateAll((els) =>
    els.flatMap((root) =>
      [...root.querySelectorAll("a[href]")]
        .filter((a) => a.getClientRects().length > 0 && !a.getAttribute("target"))
        .map((a) => a.getAttribute("href")!)
        .filter((h) => h.startsWith("/") || h.startsWith("#")),
    ),
  );
  if (region === "sheet") await page.keyboard.press("Escape");
  return [...new Set(hrefs)];
}

const scrollY = (page: Page) => page.evaluate(() => Math.round(window.scrollY));

async function checkLink(page: Page, start: string, region: Region, href: string, fails: string[]) {
  const where = `${start} ${region} → ${href}`;
  await page.goto(start);
  if (region === "sheet") {
    await openSheet(page);
    await expect(page.getByRole("dialog")).toBeVisible();
  }
  const link = page.locator(roots[region]).locator(`a[href="${href}"]`).filter({ visible: true }).first();
  await link.scrollIntoViewIfNeeded();
  const startUrl = page.url();

  if (href.startsWith("#") || new URL(href, startUrl).pathname === new URL(startUrl).pathname && href.includes("#")) {
    // in-page anchor: glides to its target and is never reset to the top
    await link.click();
    await page.waitForTimeout(1200);
    const targetTop = await page.evaluate((id) => document.getElementById(id)?.getBoundingClientRect().top ?? null, href.split("#")[1]);
    if (targetTop === null) fails.push(`${where}: anchor target missing`);
    else if (Math.abs(targetTop) > 80 && (await scrollY(page)) === 0) fails.push(`${where}: anchor reset to the top`);
    return;
  }

  const target = new URL(href, startUrl);
  await link.click();
  await page.waitForURL((u) => u.pathname === target.pathname && u.hash === target.hash);
  await page.waitForLoadState("load");
  const now = await scrollY(page);
  if (now !== 0 && !target.hash) fails.push(`${where}: scrollY ${now} after load`);
  await page.waitForTimeout(1200);
  const later = await scrollY(page);
  if (later !== 0 && !target.hash) fails.push(`${where}: scrollY ${later} 1.2s later`);
  if (page.url() === startUrl) return; // same page: nothing to go back to
  await page.goBack();
  await page.waitForURL(startUrl);
  await page.waitForTimeout(300);
  const back = await scrollY(page);
  if (back !== 0) fails.push(`${where}: scrollY ${back} after Back`);
}

async function crawl(page: Page, start: string, regions: Region[]) {
  const fails: string[] = [];
  await page.goto(start);
  for (const region of regions) {
    for (const href of await hrefsIn(page, region)) {
      const res = await page.request.get(new URL(href.split("#")[0] || start, page.url()).toString());
      if (res.status() >= 400) fails.push(`${start} ${region} → ${href}: HTTP ${res.status()}`);
      await checkLink(page, start, region, href, fails);
      await page.goto(start);
    }
  }
  expect(fails).toEqual([]);
}

const phone = (name: string) => name === "phone";

for (const start of ["/", "/en"]) {
  test(`every chrome and body link from ${start}`, async ({ page }, info) => {
    test.setTimeout(240_000);
    await crawl(page, start, phone(info.project.name) ? ["sheet", "footer", "main"] : ["header", "footer", "main"]);
  });
}

const stubs = [
  "/universuri", "/universuri/fluturele", "/carti", "/carti/fluturele-dansator-de-step", "/consiliere", "/despre", "/comunitate", "/contact", "/confidentialitate", "/termeni", "/arta",
  "/en/universes", "/en/universes/butterfly", "/en/books", "/en/books/the-tap-dancing-butterfly", "/en/counselling", "/en/about", "/en/community", "/en/contact", "/en/privacy", "/en/terms", "/en/art",
];

test("every stub page opens at its top and its body links work", async ({ page, errors }) => {
  test.setTimeout(240_000);
  const fails: string[] = [];
  for (const path of stubs) {
    const res = await page.goto(path);
    if ((res?.status() ?? 500) >= 400) fails.push(`${path}: HTTP ${res?.status()}`);
    if ((await scrollY(page)) !== 0) fails.push(`${path}: not at top`);
  }
  expect(fails).toEqual([]);
  await crawl(page, "/carti", ["main"]);
  await crawl(page, "/nu-exista", ["main"]);
  allow404(errors);
});

test("Back from a scrolled page lands at the top", async ({ page }) => {
  await page.goto("/carti");
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  await page.locator("footer").getByRole("link", { name: "Contact" }).click();
  await page.waitForURL(/\/contact$/);
  expect(await scrollY(page)).toBe(0);
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
  await page.goBack();
  await page.waitForURL(/\/carti$/);
  await page.waitForTimeout(300);
  expect(await scrollY(page)).toBe(0);
  await page.goForward();
  await page.waitForURL(/\/contact$/);
  await page.waitForTimeout(300);
  expect(await scrollY(page)).toBe(0);
});
