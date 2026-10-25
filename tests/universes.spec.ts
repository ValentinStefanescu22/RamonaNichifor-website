import type { Page } from "@playwright/test";
import { allow404, expect, hasSideScroll, test } from "./fixtures";

// Universuri (the map of worlds), a universe page and a product page, with the orb → page morph (spec §5.2, §5.3).
// Seeded content (npm run seed): Fluturele and Buburuza have their book out, Țânțarul and Musca are „în curând”.

const isPhone = (name: string) => name === "phone";
const orbLinks = (page: Page) => page.locator("main a[data-orb-link]");

/** The scale of an element's computed transform (1 when none) */
const scaleOf = (page: Page, selector: string) =>
  page.$$eval(selector, (els) =>
    els.map((el) => {
      const m = new DOMMatrix(getComputedStyle(el).transform);
      return Math.hypot(m.a, m.b);
    }),
  );

test.describe("/universuri", () => {
  test("title, four worlds that open their page, with their status", async ({ page }) => {
    await page.goto("/universuri");
    await expect(page.locator("h1")).toHaveText("Universuri");
    const links = orbLinks(page);
    await expect(links).toHaveCount(4);
    const hrefs = await links.evaluateAll((els) => els.map((a) => a.getAttribute("href")));
    expect(hrefs).toEqual(["/universuri/fluturele", "/universuri/buburuza", "/universuri/tantarul", "/universuri/musca"]);
    await expect(links.nth(0)).toContainText("Cartea a apărut");
    await expect(links.nth(1)).toContainText("Cartea a apărut");
    await expect(links.nth(2)).toContainText("În curând");
    await expect(links.nth(3)).toContainText("În curând");
    expect(await hasSideScroll(page)).toBe(false);
  });

  test("EN: the same four worlds under /en/universes", async ({ page }) => {
    await page.goto("/en/universes");
    await expect(page.locator("h1")).toHaveText("Universes");
    const hrefs = await orbLinks(page).evaluateAll((els) => els.map((a) => a.getAttribute("href")));
    expect(hrefs).toEqual(["/en/universes/butterfly", "/en/universes/ladybird", "/en/universes/mosquito", "/en/universes/fly"]);
  });

  test("phone: all four worlds fit on the first screen", async ({ page }, info) => {
    test.skip(!isPhone(info.project.name), "phone only");
    await page.emulateMedia({ reducedMotion: "reduce" }); // no entrance or drift: the orbs at rest
    await page.goto("/universuri");
    const vh = page.viewportSize()!.height;
    const orbs = page.locator("main [data-orb]");
    await expect(orbs).toHaveCount(4);
    for (const box of await orbs.evaluateAll((els) => els.map((e) => e.getBoundingClientRect().toJSON() as DOMRect)))
      expect(box.y + box.height).toBeLessThanOrEqual(vh);
  });

  test("laptop: the world under the mouse grows, the others step back", async ({ page }, info) => {
    test.skip(isPhone(info.project.name), "hover is for mouse and pen");
    await page.goto("/universuri");
    await page.waitForTimeout(1600); // the orbs paint in
    await page.locator("main [data-orb]").nth(1).hover({ force: true });
    await page.waitForTimeout(900); // 0.6s glide
    const scales = await scaleOf(page, "main .orb-grow");
    expect(scales[1]).toBeCloseTo(1.22, 2);
    for (const [i, s] of scales.entries()) if (i !== 1) expect(s).toBeLessThanOrEqual(0.9001);
  });

  test("reduced motion: the pollen is a still frame", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/universuri");
    const canvas = page.locator("canvas[data-pollen]");
    await expect(canvas).toHaveCount(1);
    await page.waitForTimeout(300);
    const a = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
    await page.waitForTimeout(700);
    const b = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
    expect(a.length).toBeGreaterThan(1000); // something is drawn
    expect(a === b).toBe(true);
  });

  test("the pollen moves when motion is allowed", async ({ page }) => {
    await page.goto("/universuri");
    const canvas = page.locator("canvas[data-pollen]");
    await page.waitForTimeout(300);
    const a = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
    await page.waitForTimeout(500);
    const b = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
    expect(a === b).toBe(false);
  });
});

test.describe("orb → universe page", () => {
  test("a click on an orb opens its universe (client navigation)", async ({ page }) => {
    await page.goto("/universuri");
    await page.evaluate(() => ((window as unknown as { __spa: number }).__spa = 1));
    await page.waitForLoadState("networkidle"); // hydrated: the click is a client navigation, not a document load
    await orbLinks(page).first().click({ force: true }); // the worlds drift forever: never "stable"
    await expect(page).toHaveURL(/\/universuri\/fluturele$/);
    await expect(page.locator("h1")).toHaveText("Universul Fluturelui");
    expect(await page.evaluate(() => (window as unknown as { __spa?: number }).__spa)).toBe(1);
    expect(await page.evaluate(() => scrollY)).toBe(0);
  });

  test("without View Transitions the click still navigates", async ({ page }) => {
    await page.addInitScript(() => {
      delete (Document.prototype as Partial<Document>).startViewTransition;
    });
    await page.goto("/en/universes");
    expect(await page.evaluate(() => "startViewTransition" in document)).toBe(false);
    await page.waitForLoadState("networkidle"); // hydrated: the click is a client navigation, not a document load
    await orbLinks(page).first().click({ force: true }); // the worlds drift forever: never "stable"
    await expect(page).toHaveURL(/\/en\/universes\/butterfly$/);
    await expect(page.locator("h1")).toHaveText("The Butterfly Universe");
  });

  test("the click starts a view transition typed morph, the orb named by its Romanian slug", async ({ page }) => {
    // record each call: its types and the view-transition names on the page when React captures the old state
    await page.addInitScript(() => {
      const calls: { types: string[]; names: string[] }[] = ((window as unknown as { __vt: unknown[] }).__vt = []) as never;
      const original = Document.prototype.startViewTransition;
      if (!original) return;
      Document.prototype.startViewTransition = function (this: Document, arg: unknown) {
        const names = [...document.querySelectorAll("*")].map((el) => getComputedStyle(el).viewTransitionName).filter((n) => n && n !== "none");
        calls.push({ types: [...((arg as { types?: string[] })?.types ?? [])], names });
        return original.call(this, arg as never);
      } as typeof original;
    });
    await page.goto("/en/universes");
    await page.waitForLoadState("networkidle"); // hydrated: the click is a client navigation, not a document load
    await orbLinks(page).first().click({ force: true }); // the worlds drift forever: never "stable"
    await expect(page.locator("h1")).toHaveText("The Butterfly Universe");
    const calls = await page.evaluate(() => (window as unknown as { __vt: { types: string[]; names: string[] }[] }).__vt);
    const morph = calls.find((c) => c.types.includes("morph"));
    expect(morph, JSON.stringify(calls)).toBeTruthy();
    expect(morph!.names).toContain("orb-fluturele");
  });
});

test.describe("/universuri/[slug]", () => {
  test("back pill, items, other universes, JSON-LD", async ({ page }) => {
    await page.goto("/universuri/fluturele");
    await expect(page.locator("h1")).toHaveText("Universul Fluturelui");
    expect(await hasSideScroll(page)).toBe(false);

    const items = page.locator("[data-items] a");
    await expect(items).toHaveCount(5);
    expect(await items.evaluateAll((els) => els.map((a) => a.getAttribute("href")))).toEqual([
      "/carti/fluturele-dansator-de-step",
      "/universuri/fluturele/semn-de-carte",
      "/universuri/fluturele/carti-de-joc",
      "/universuri/fluturele/puzzle",
      "/universuri/fluturele/joc-de-familie",
    ]);
    // a keepsake not made yet: the status chip and the paper stand-in
    for (const slug of ["puzzle", "joc-de-familie"]) {
      const tile = page.locator(`[data-items] a[href$="/${slug}"]`);
      await expect(tile.getByText("În curând").first()).toBeVisible();
      await expect(tile.locator("[data-placeholder]")).toHaveCount(1);
    }

    const others = page.getByRole("navigation", { name: "Alte universuri" }).getByRole("link");
    await expect(others).toHaveCount(3);

    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join("\n");
    expect(ld).toContain('"BreadcrumbList"');
    expect(ld).toContain('"Book"');

    await page.locator("main").getByRole("link", { name: "Universuri", exact: true }).click();
    await expect(page).toHaveURL(/\/universuri$/);
    await expect(page.locator("h1")).toHaveText("Universuri");
  });

  test("a universe „în curând”: no Book, and „Anunță-mă când apare” → Instagram", async ({ page }) => {
    await page.goto("/universuri/tantarul");
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join("\n");
    expect(ld).toContain('"BreadcrumbList"');
    expect(ld).not.toContain('"Book"');
    const cta = page.locator("main").getByRole("link", { name: "Anunță-mă când apare" });
    await expect(cta).toHaveAttribute("href", /instagram\.com/);
  });

  test("an English URL with the Romanian slug redirects to the English slug", async ({ page }) => {
    const res = await page.request.get("/en/universes/fluturele", { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers().location).toMatch(/\/en\/universes\/butterfly$/);
    const product = await page.request.get("/en/universes/fluturele/semn-de-carte", { maxRedirects: 0 });
    expect(product.status()).toBe(308);
    expect(product.headers().location).toMatch(/\/en\/universes\/butterfly\/bookmark$/);
    await page.goto("/en/universes/fluturele");
    await expect(page).toHaveURL(/\/en\/universes\/butterfly$/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/en\/universes\/butterfly$/);
  });
});

test.describe("/universuri/[slug]/[product]", () => {
  test("playing cards: only the two public pairs, cards uncropped, no buy button", async ({ page }) => {
    await page.goto("/universuri/fluturele/carti-de-joc");
    await expect(page.locator("h1")).toContainText("Cărți de joc");
    expect(await hasSideScroll(page)).toBe(false);

    const pairs = page.locator("[data-pair]");
    await expect(pairs).toHaveCount(2);
    await expect(pairs.nth(0)).toContainText("Broscuță și Broscoi");
    await expect(pairs.nth(1)).toContainText("Ciripel și Ciripica");

    const cards = page.locator("main img[data-card]");
    expect(await cards.count()).toBeGreaterThan(4);
    for (const ratio of await cards.evaluateAll((els) => els.map((e) => (e as HTMLElement).offsetWidth / (e as HTMLElement).offsetHeight)))
      expect(Math.abs(ratio - 63 / 88)).toBeLessThanOrEqual(0.01);

    await expect(page.getByText("Preț în curând")).toBeVisible();
    await expect(page.locator("main").getByRole("link", { name: /^Anunță-mă/ })).toHaveAttribute("href", /instagram\.com/);
    await expect(page.locator("main").getByRole("button", { name: /cumpără|comandă|adaugă în coș/i })).toHaveCount(0);
  });

  test("a card opens the reader; Escape closes it", async ({ page }) => {
    await page.goto("/universuri/fluturele/carti-de-joc");
    await page.locator("[data-pair] button").first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(dialog).toContainText("3 din 6"); // the winner is card 1, Broscuță 2, Broscoi 3
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });

  test("bookmarks: the language switch lands on the Romanian bookmark page", async ({ page }) => {
    await page.goto("/en/universes/butterfly/bookmark");
    await expect(page.locator("h1")).toContainText("Bookmark");
    await page.locator("header").getByRole("radio", { name: "ro" }).click();
    await expect(page).toHaveURL(/\/universuri\/fluturele\/semn-de-carte$/);
    await expect(page.locator("h1")).toContainText("Semn de carte");
  });

  test("a keepsake not made yet: placeholder, „Detalii în curând”, back to its universe", async ({ page }) => {
    await page.goto("/universuri/tantarul/puzzle");
    await expect(page.locator("main [data-placeholder]").first()).toBeVisible();
    await expect(page.getByText("Detalii în curând")).toBeVisible();
    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).join("\n");
    expect(ld).toContain('"BreadcrumbList"');
    await page.locator("main").getByRole("link", { name: "Universul Țânțarului" }).first().click();
    await expect(page).toHaveURL(/\/universuri\/tantarul$/);
  });

  test("an unknown product is a 404", async ({ page, errors }) => {
    expect((await page.goto("/universuri/fluturele/nu-exista"))?.status()).toBe(404);
    allow404(errors);
  });
});
