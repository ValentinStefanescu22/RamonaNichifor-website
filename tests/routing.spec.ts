import type { Page } from "@playwright/test";
import { test, expect, allow404 } from "./fixtures";

// Port of mockups/scripts/check-routing.js: every internal link opens its page at the top (also after
// a scroll down to reach the link), stays there 1.2s later, and Back returns to where the visitor was.

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
  const startY = await scrollY(page);

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
  if (Math.abs(back - startY) > 2) fails.push(`${where}: scrollY ${back} after Back, was ${startY}`);
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

test("Back and Forward return to where the visitor was; new pages open at the top", async ({ page }) => {
  const bottom = () => page.evaluate(() => (window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }), Math.round(window.scrollY)));
  await page.goto("/carti");
  const cartiY = await bottom();
  expect(cartiY).toBeGreaterThan(200);
  await page.locator("footer").getByRole("link", { name: "Contact" }).click();
  await page.waitForURL(/\/contact$/);
  await page.waitForTimeout(300);
  expect(await scrollY(page)).toBe(0);
  const contactY = await bottom();
  await page.goBack();
  await page.waitForURL(/\/carti$/);
  await page.waitForTimeout(300);
  expect(await scrollY(page)).toBe(cartiY);
  await page.goForward();
  await page.waitForURL(/\/contact$/);
  await page.waitForTimeout(300);
  expect(await scrollY(page)).toBe(contactY);
});

// The language switch replaces the history entry (Back skips it), so the document-load case is another
// site or a typed URL (page.goto), and a reload.
test("Back from a document load, and a reload, return to where the visitor was", async ({ page }) => {
  await page.goto("/");
  await page.locator("#despre").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const y = await scrollY(page);
  expect(y).toBeGreaterThan(200);
  await page.goto("/carti");
  expect(await scrollY(page)).toBe(0);
  await page.goBack();
  await page.waitForTimeout(500);
  expect(new URL(page.url()).pathname).toBe("/");
  expect(Math.abs((await scrollY(page)) - y)).toBeLessThanOrEqual(2);
  await page.reload();
  await page.waitForTimeout(500);
  expect(Math.abs((await scrollY(page)) - y)).toBeLessThanOrEqual(2);
});
