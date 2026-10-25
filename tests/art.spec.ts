import type { Locator } from "@playwright/test";
import { allow404, expect, hasSideScroll, test } from "./fixtures";

// Artă (the gallery wall with filters) and the artwork page (spec §5.5).
// Seeded content (npm run seed): two works, both originals, pre-order, with no price, size or year yet.
// Works with a price, a sold or on-request state, several pictures or a print are covered in tests/cms.spec.ts (they need extra docs).

const WORK = "/arta/poiana-fluturelui";

/** True when an <img> shows its picture whole: the box has the file's own proportions (±0.01) */
const wholeImage = (img: Locator) =>
  img.evaluate((el: HTMLImageElement) => {
    const box = el.getBoundingClientRect();
    return { box: box.width / box.height, natural: el.naturalWidth / el.naturalHeight };
  });

const chip = (page: import("@playwright/test").Page, name: RegExp) => page.getByRole("button", { name });

test.describe("/arta", () => {
  test("title, tagline and the commission offer with one clear action", async ({ page }) => {
    await page.goto("/arta");
    await expect(page.locator("h1")).toHaveText("Artă");
    await expect(page.getByText("Originale și printuri.", { exact: true })).toBeVisible();
    const commission = page.locator("section", { has: page.getByRole("heading", { name: "Lucrări la comandă" }) }).first();
    await expect(commission.getByRole("link", { name: "Comandă o lucrare" })).toHaveAttribute("href", "/contact?subiect=arta");
    expect(await hasSideScroll(page)).toBe(false);
  });

  test("filter chips Toate · Originale · Printuri (aria-pressed) narrow the wall", async ({ page }) => {
    await page.goto("/arta");
    await page.waitForLoadState("networkidle");
    const chips = page.getByRole("group", { name: "Artă" }).getByRole("button");
    await expect(chips).toHaveText([/Toate/, /Originale/, /Printuri/]);
    await expect(chip(page, /Toate/)).toHaveAttribute("aria-pressed", "true");
    await expect(chip(page, /Originale/)).toHaveAttribute("aria-pressed", "false");
    const visible = page.locator(".gallery > li:visible");
    await expect(visible).toHaveCount(2);

    await chip(page, /Originale/).click();
    await expect(chip(page, /Originale/)).toHaveAttribute("aria-pressed", "true");
    await expect(chip(page, /Toate/)).toHaveAttribute("aria-pressed", "false");
    await expect(visible).toHaveCount(2);

    await chip(page, /Printuri/).click();
    await expect(chip(page, /Printuri/)).toHaveAttribute("aria-pressed", "true");
    await expect(visible).toHaveCount(0);

    await chip(page, /Toate/).click();
    await expect(visible).toHaveCount(2);
  });

  test("a filter with no works shows the designed „În curând” state, never an empty wall", async ({ page }) => {
    await page.goto("/arta");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("Lucrări în această categorie, în curând.")).toHaveCount(0);
    await chip(page, /Printuri/).click();
    const empty = page.locator("[data-placeholder]", { hasText: "Lucrări în această categorie, în curând." });
    await expect(empty).toBeVisible();
    await expect(empty).toContainText("În curând");
    await chip(page, /Originale/).click();
    await expect(empty).toHaveCount(0);
    expect(await page.locator("main").textContent()).not.toMatch(/undefined|null|NaN/);
  });

  test("captions show the title and technique, the state and the price", async ({ page }) => {
    await page.goto("/arta");
    const items = page.locator(".gallery > li");
    await expect(items).toHaveCount(2);
    await expect(items.nth(0).getByRole("heading", { level: 3 })).toHaveText("Poiana fluturelui");
    await expect(items.nth(0)).toContainText("Ilustrația de copertă");
    await expect(items.nth(0)).toContainText("Pre-comandă");
    await expect(items.nth(0)).toContainText("Preț în curând");
    await expect(items.nth(1).getByRole("heading", { level: 3 })).toHaveText("Buburuza rotunjoară");
    await expect(items.nth(0).locator("a")).toHaveAttribute("href", WORK);
    await expect(items.nth(1).locator("a")).toHaveAttribute("href", "/arta/buburuza-rotunjoara");
  });

  test("every image is uncropped (rendered ratio = natural ratio)", async ({ page }) => {
    await page.goto("/arta");
    for (const img of await page.locator(".gallery img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      const r = await wholeImage(img);
      expect(Math.abs(r.box - r.natural)).toBeLessThanOrEqual(0.01);
    }
  });

  test("at 320px: no sideways scroll, nothing cut off, pictures still whole", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/arta");
    for (const img of await page.locator(".gallery img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      const r = await wholeImage(img);
      expect(Math.abs(r.box - r.natural)).toBeLessThanOrEqual(0.01);
    }
    expect(await hasSideScroll(page)).toBe(false);
  });

  test("EN: /en/art", async ({ page }) => {
    await page.goto("/en/art");
    await expect(page.locator("h1")).toHaveText("Art");
    await expect(page.getByRole("group", { name: "Art" }).getByRole("button")).toHaveText([/All/, /Originals/, /Prints/]);
    await expect(page.getByRole("link", { name: "Commission a piece" })).toHaveAttribute("href", "/en/contact?subiect=arta");
    await expect(page.locator(".gallery > li").first().locator("a")).toHaveAttribute("href", "/en/art/the-butterflys-meadow");
    await expect(page.locator(".gallery > li").first()).toContainText("Price coming soon");
  });

  test("a work opens at the top of its page", async ({ page }) => {
    await page.goto("/arta");
    await page.waitForLoadState("networkidle");
    await page.locator(".gallery > li a").first().click();
    await expect(page).toHaveURL(new RegExp(`${WORK}$`));
    await expect(page.locator("h1")).toHaveText("Poiana fluturelui");
    expect(await page.evaluate(() => scrollY)).toBe(0);
  });

  test("OG image is a 1200×630 PNG", async ({ page, request }) => {
    await page.goto("/arta");
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(og).toMatch(/opengraph-image/);
    const res = await request.get(new URL(og!).pathname + new URL(og!).search, { maxRedirects: 0 });
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/png");
  });
});

test.describe("artwork page", () => {
  test("title, technique, size and year (unknown ones are „În curând”), kind and state", async ({ page }) => {
    await page.goto(WORK);
    await expect(page.locator("h1")).toHaveText("Poiana fluturelui");
    await expect(page.getByText("Original", { exact: true })).toBeVisible();
    const pairs = await page.locator("main dl > div").evaluateAll((els) => els.map((e) => [e.querySelector("dt")!.textContent, e.querySelector("dd")!.textContent]));
    expect(pairs).toEqual([
      ["Tehnică", "Ilustrația de copertă"],
      ["Dimensiuni", "În curând"],
      ["Anul", "În curând"],
    ]);
    expect(await page.locator("main").textContent()).not.toMatch(/undefined|null|NaN/);
    expect(await hasSideScroll(page)).toBe(false);
  });

  test("Pre-comandă links to the contact form with the subject Artă and this title; no price → „Preț în curând”", async ({ page }) => {
    await page.goto(WORK);
    await expect(page.getByText("Preț în curând")).toBeVisible();
    await expect(page.getByText("Plata și livrarea le stabilim împreună.")).toBeVisible();
    const preorder = page.getByRole("link", { name: "Pre-comandă" });
    await expect(preorder).toHaveCount(1);
    const href = (await preorder.getAttribute("href"))!;
    const url = new URL(href, "http://x");
    expect(url.pathname).toBe("/contact");
    expect(url.searchParams.get("subiect")).toBe("arta");
    expect(url.searchParams.get("lucrare")).toBe("Poiana fluturelui");
    expect(href).not.toContain(" ");
    await expect(page.getByRole("link", { name: "Întreabă de această lucrare" })).toHaveCount(0);
  });

  test("the picture is whole and a single picture has no dots", async ({ page }) => {
    await page.goto(WORK);
    const img = page.locator("[data-swipe] img");
    await expect(img).toHaveCount(1);
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    const r = await wholeImage(img);
    expect(Math.abs(r.box - r.natural)).toBeLessThanOrEqual(0.01);
    await expect(page.locator("[data-swipe] ~ div button")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Toată arta" })).toHaveAttribute("href", "/arta");
  });

  test("at 320px a long title and the picture fit", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto(WORK);
    await expect(page.locator("h1")).toBeVisible();
    const img = page.locator("[data-swipe] img");
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    const r = await wholeImage(img);
    expect(Math.abs(r.box - r.natural)).toBeLessThanOrEqual(0.01);
    expect(await hasSideScroll(page)).toBe(false);
  });

  test("EN: /en/art/the-butterflys-meadow", async ({ page }) => {
    await page.goto("/en/art/the-butterflys-meadow");
    await expect(page.locator("h1")).toHaveText("The butterfly's meadow");
    await expect(page.getByText("Price coming soon")).toBeVisible();
    await expect(page.getByRole("link", { name: "All art" })).toHaveAttribute("href", "/en/art");
    const href = (await page.getByRole("link", { name: "Pre-order" }).getAttribute("href"))!;
    expect(href).toMatch(/^\/en\/contact\?/);
    expect(new URL(href, "http://x").searchParams.get("lucrare")).toBe("The butterfly's meadow");
  });

  test("JSON-LD: VisualArtwork (name, creator, absolute image, no invented offer) and the breadcrumb", async ({ page }) => {
    await page.goto(WORK);
    const all = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent!)));
    const art = all.find((d) => d["@type"] === "VisualArtwork");
    expect(art).toMatchObject({
      name: "Poiana fluturelui",
      creator: { name: "Ramona Nichifor" },
      artMedium: "Ilustrația de copertă",
      url: expect.stringMatching(/\/arta\/poiana-fluturelui$/),
      image: expect.stringMatching(/^https?:\/\/.+/),
    });
    expect(art.offers).toBeUndefined();
    const crumbs = all.find((d) => d["@type"] === "BreadcrumbList");
    expect(crumbs.itemListElement.map((i: { name: string }) => i.name)).toEqual(["Acasă", "Artă", "Poiana fluturelui"]);
  });

  test("one URL per work: the other language's slug redirects (308), canonical and hreflang are the doc's own", async ({ page, request }) => {
    const res = await request.get("/en/art/poiana-fluturelui", { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers().location).toMatch(/\/en\/art\/the-butterflys-meadow$/);
    await page.goto("/en/art/the-butterflys-meadow");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/en\/art\/the-butterflys-meadow$/);
    const alternates = await page.locator('link[rel="alternate"]').evaluateAll((els) => els.map((e) => [e.getAttribute("hreflang"), e.getAttribute("href")]));
    expect(alternates).toEqual(
      expect.arrayContaining([
        ["ro", expect.stringMatching(/\/arta\/poiana-fluturelui$/)],
        ["en", expect.stringMatching(/\/en\/art\/the-butterflys-meadow$/)],
      ]),
    );
    await expect(page).toHaveTitle("The butterfly's meadow · Ramona Nichifor");
  });

  test("an unknown work is a 404", async ({ page, errors }) => {
    const res = await page.goto("/arta/nu-exista");
    expect(res?.status()).toBe(404);
    allow404(errors);
  });

  test("OG image is a 1200×630 PNG", async ({ page, request }) => {
    await page.goto(WORK);
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(og).toMatch(/opengraph-image/);
    const res = await request.get(new URL(og!).pathname + new URL(og!).search, { maxRedirects: 0 });
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/png");
  });
});
