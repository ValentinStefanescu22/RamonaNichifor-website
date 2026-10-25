import type { Locator, Page } from "@playwright/test";
import { allow404, expect, hasSideScroll, test } from "./fixtures";

// Cărți (the shelf by age) and the book page with Răsfoiește (spec §5.4).
// Seeded content (npm run seed): Fluturele and Buburuza are out, with no store links yet; Adolescenți and Adulți are empty.

const BOOK = "/carti/fluturele-dansator-de-step";
const isPhone = (name: string) => name === "phone";

/** True when an <img> shows its picture whole: the box has the file's own proportions (±0.01) */
const wholeImage = (img: Locator) =>
  img.evaluate((el: HTMLImageElement) => {
    const box = el.getBoundingClientRect();
    return { box: box.width / box.height, natural: el.naturalWidth / el.naturalHeight, w: box.width };
  });

const radio = (page: Page, name: string | RegExp) => page.getByRole("radio", { name });

test.describe("/carti", () => {
  test("title and a radiogroup Copii · Adolescenți · Adulți that works with the arrow keys", async ({ page }) => {
    await page.goto("/carti");
    await expect(page.locator("h1")).toHaveText("Cărți");
    const group = page.getByRole("radiogroup", { name: "Cărți" });
    await expect(group.getByRole("radio")).toHaveText([/Copii/, /Adolescenți/, /Adulți/]);
    await expect(radio(page, /Copii/)).toBeChecked();
    await page.waitForLoadState("networkidle"); // hydrated: the keys are handled by the client
    await radio(page, /Copii/).focus();
    await page.keyboard.press("ArrowRight");
    await expect(radio(page, /Adolescenți/)).toBeChecked();
    await expect(radio(page, /Adolescenți/)).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(radio(page, /Adulți/)).toBeChecked();
    await page.keyboard.press("ArrowRight"); // wraps around
    await expect(radio(page, /Copii/)).toBeChecked();
    await page.keyboard.press("ArrowLeft");
    await expect(radio(page, /Adulți/)).toBeChecked();
    await expect(radio(page, /Adulți/)).toBeFocused();
    await page.keyboard.press("Home");
    await expect(radio(page, /Copii/)).toBeChecked();
    await page.keyboard.press("End");
    await expect(radio(page, /Adulți/)).toBeChecked();
    await expect(group.getByRole("radio", { checked: true })).toHaveCount(1);
    expect(await hasSideScroll(page)).toBe(false);
  });

  test("Copii: Fluturele and Buburuza with their covers (whole) and years, all in the HTML", async ({ page, request }) => {
    // the other age groups are in the server HTML too: the filter is client state over rendered lists
    const html = await (await request.get("/carti")).text();
    expect(html).toContain("Primele titluri sunt în lucru.");

    await page.goto("/carti");
    const shelf = page.locator("[data-shelf]:visible");
    const items = shelf.locator("li");
    await expect(items).toHaveCount(2);
    await expect(items.nth(0).getByRole("heading", { level: 3 })).toHaveText("Fluturele dansator de step");
    await expect(items.nth(1).getByRole("heading", { level: 3 })).toHaveText("Buburuza rotunjoară");
    await expect(items.nth(0).locator("a")).toHaveAttribute("href", BOOK);
    await expect(items.nth(1).locator("a")).toHaveAttribute("href", "/carti/buburuza-rotunjoara");
    await expect(items.nth(0)).toContainText("2026");
    await expect(items.nth(1)).toContainText("2026");
    await expect(shelf).toContainText("„Magia suntem noi”");
    for (const img of await items.locator("img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      const r = await wholeImage(img);
      expect(Math.abs(r.box - r.natural)).toBeLessThanOrEqual(0.01);
    }
  });

  test("Adolescenți and Adulți: the designed „în lucru” state, never an empty box", async ({ page }) => {
    await page.goto("/carti");
    await page.waitForLoadState("networkidle");
    for (const age of [/Adolescenți/, /Adulți/]) {
      await radio(page, age).click();
      const shelf = page.locator("[data-shelf]:visible");
      await expect(shelf).toHaveCount(1);
      await expect(shelf).toContainText("În lucru");
      await expect(shelf).toContainText("Primele titluri sunt în lucru.");
      await expect(shelf.locator("li")).toHaveCount(0);
      await expect(shelf.locator("a")).toHaveCount(0);
    }
    await radio(page, /Copii/).click();
    await expect(page.locator("[data-shelf]:visible li")).toHaveCount(2);
  });

  test("„Despre autor” closes the page, with the e-book „în curând” and the audiobook „planificată”", async ({ page }) => {
    await page.goto("/carti");
    const sections = page.locator("main > section");
    const last = sections.last();
    await expect(last.getByRole("heading", { level: 2 })).toHaveText("Despre autor");
    await expect(last).toContainText("Ramona Nichifor este autor și artist vizual");
    await expect(last.getByRole("link", { name: "Povestea mea" })).toHaveAttribute("href", "/despre");
    const where = page.locator("main section", { has: page.getByRole("heading", { name: "Unde găsești cărțile" }) });
    await expect(where).toContainText("Comenzile online se pregătesc.");
    await expect(where.getByText("E-book", { exact: true })).toBeVisible();
    await expect(where.locator("dd").first()).toHaveText("În curând");
    await expect(where.getByText("Audiobook", { exact: true })).toBeVisible();
    await expect(where.locator("dd").nth(1)).toContainText("planificată");
    expect(await page.locator("main").textContent()).not.toMatch(/undefined|null|NaN/);
  });

  test("EN: /en/books", async ({ page }) => {
    await page.goto("/en/books");
    await expect(page.locator("h1")).toHaveText("Books");
    await expect(page.getByRole("radiogroup", { name: "Books" }).getByRole("radio")).toHaveText([/Children/, /Teens/, /Adults/]);
    const hrefs = await page.locator("[data-shelf]:visible li a").evaluateAll((els) => els.map((a) => a.getAttribute("href")));
    expect(hrefs).toEqual(["/en/books/the-tap-dancing-butterfly", "/en/books/the-roly-poly-ladybird"]);
    await expect(page.getByRole("heading", { name: "About the author" })).toBeVisible();
  });

  test("a book opens at the top of its page", async ({ page }) => {
    await page.goto("/carti");
    await page.waitForLoadState("networkidle");
    await page.locator("[data-shelf]:visible li a").first().click();
    await expect(page).toHaveURL(new RegExp(`${BOOK}$`));
    await expect(page.locator("h1")).toHaveText("Fluturele dansator de step");
    expect(await page.evaluate(() => scrollY)).toBe(0);
  });
});

test.describe("book page", () => {
  test("h1 is the title, followed by the subtitle; the meta; no store → „În curând”", async ({ page }) => {
    await page.goto(BOOK);
    const h1 = page.locator("h1");
    await expect(h1).toHaveText("Fluturele dansator de step");
    await expect(h1.locator("xpath=following-sibling::p[1]")).toHaveText("O poveste pentru copii… o șoaptă pentru adulți");
    const meta = page.locator("main dl").first();
    const pairs = await meta.locator("> div").evaluateAll((els) => els.map((e) => [e.querySelector("dt")!.textContent, e.querySelector("dd")!.textContent]));
    expect(pairs).toEqual([
      ["Vârstă", "1–10 ani"],
      ["Anul", "2026"],
      ["Pagini", "40"],
      ["Format", "A4, copertă cartonată lucioasă"],
      ["ISBN", "978-973-0-44382-0"],
    ]);
    await expect(page.getByText("Comenzile online se pregătesc.")).toBeVisible();
    await expect(page.getByText("În curând").first()).toBeVisible();
    // no store link and no buy control until a real one exists
    await expect(page.getByRole("link", { name: /cumpără|comandă|buy/i })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /cumpără|comandă|buy/i })).toHaveCount(0);
    expect(await hasSideScroll(page)).toBe(false);
  });

  test("a link to its universe, and a series of the other books", async ({ page }) => {
    await page.goto(BOOK);
    const universe = page.getByRole("link", { name: /Universul Fluturelui/ });
    await expect(universe).toHaveAttribute("href", "/universuri/fluturele");
    await expect(universe).toContainText("Descoperă universul");
    const series = page.getByRole("heading", { name: "Din aceeași serie" });
    await expect(series).toBeVisible();
    await expect(page.locator("main section").last().getByRole("link", { name: /Buburuza rotunjoară/ })).toHaveAttribute("href", "/carti/buburuza-rotunjoara");
  });

  test("EN: /en/books/the-tap-dancing-butterfly", async ({ page }) => {
    await page.goto("/en/books/the-tap-dancing-butterfly");
    await expect(page.locator("h1")).toHaveText("The Tap-Dancing Butterfly");
    await expect(page.getByText("Online orders are being set up.")).toBeVisible();
    await expect(page.getByRole("link", { name: /Explore the universe/ })).toHaveAttribute("href", "/en/universes/butterfly");
    await expect(page.getByRole("heading", { name: "Leaf through" })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Back cover/ })).toBeVisible();
  });

  test("a slug that is not the doc's own in that language is one redirect to its own URL (Ruling 6)", async ({ request, page }) => {
    const res = await request.get("/en/books/fluturele-dansator-de-step", { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers().location).toMatch(/\/en\/books\/the-tap-dancing-butterfly$/);
    await page.goto("/en/books/the-tap-dancing-butterfly");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/en\/books\/the-tap-dancing-butterfly$/);
    const alternates = await page.locator('link[rel="alternate"]').evaluateAll((els) => els.map((e) => [e.getAttribute("hreflang"), e.getAttribute("href")]));
    expect(alternates).toEqual(
      expect.arrayContaining([
        ["ro", expect.stringMatching(/\/carti\/fluturele-dansator-de-step$/)],
        ["en", expect.stringMatching(/\/en\/books\/the-tap-dancing-butterfly$/)],
      ]),
    );
  });

  test("an unknown book is a 404", async ({ page, errors }) => {
    const res = await page.goto("/carti/nu-exista");
    expect(res?.status()).toBe(404);
    allow404(errors);
  });

  test("JSON-LD Book: name, author, isbn, image, inLanguage and url", async ({ page }) => {
    await page.goto(BOOK);
    const all = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent!)));
    const book = all.find((d) => d["@type"] === "Book");
    expect(book).toMatchObject({
      name: "Fluturele dansator de step",
      author: { name: "Ramona Nichifor" },
      isbn: "978-973-0-44382-0",
      inLanguage: "ro",
      url: expect.stringMatching(/\/carti\/fluturele-dansator-de-step$/),
      image: expect.stringMatching(/^https?:\/\/.+\.(webp|png|jpe?g)/),
    });
    const crumbs = all.find((d) => d["@type"] === "BreadcrumbList");
    expect(crumbs.itemListElement.map((i: { name: string }) => i.name)).toEqual(["Acasă", "Cărți", "Fluturele dansator de step"]);
  });

  test("OG image is 1200×630", async ({ page, request }) => {
    await page.goto(BOOK);
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(og).toMatch(/opengraph-image/);
    const res = await request.get(new URL(og!).pathname + new URL(og!).search, { maxRedirects: 0 });
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/png");
  });
});

test.describe("Răsfoiește", () => {
  const thumbs = (page: Page) => page.locator("[data-leaf] button[aria-haspopup=dialog]");

  test("the first thumbnail is the back cover; every page shows whole", async ({ page }) => {
    await page.goto(BOOK);
    await expect(thumbs(page)).toHaveCount(3);
    await expect(thumbs(page).first()).toHaveAccessibleName(/^Coperta spate/);
    await expect(thumbs(page).nth(1)).toHaveAccessibleName(/^Pagina 4/);
    await expect(thumbs(page).nth(2)).toHaveAccessibleName(/^Pagina 9/);
    for (const img of await page.locator("[data-leaf] img").all()) {
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      const r = await wholeImage(img);
      expect(Math.abs(r.box - r.natural), "thumbnail ratio").toBeLessThanOrEqual(0.01);
    }
    expect(await hasSideScroll(page)).toBe(false);
  });

  test("a click opens a full-screen reader: dialog, focus trapped, arrows page through, Escape returns focus", async ({ page }, info) => {
    await page.goto(BOOK);
    await page.waitForLoadState("networkidle");
    const first = thumbs(page).first();
    await first.scrollIntoViewIfNeeded();
    await first.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute("aria-modal", "true");
    await expect(dialog).toContainText("Coperta spate");
    await expect(dialog).toContainText("1 din 3");
    // focus starts inside and Tab never leaves (WebKit/Safari does not Tab to buttons at all: the phone project checks the start only)
    await expect(dialog.getByRole("button", { name: "Închide" })).toBeFocused();
    if (!isPhone(info.project.name)) {
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press("Tab");
        expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
      }
      for (let i = 0; i < 6; i++) {
        await page.keyboard.press("Shift+Tab");
        expect(await dialog.evaluate((d) => d.contains(document.activeElement))).toBe(true);
      }
    }
    await page.keyboard.press("ArrowRight");
    await expect(dialog).toContainText("Pagina 4");
    await expect(dialog).toContainText("2 din 3");
    await page.keyboard.press("ArrowRight");
    await expect(dialog).toContainText("Pagina 9");
    await page.keyboard.press("ArrowRight"); // wraps to the back cover
    await expect(dialog).toContainText("1 din 3");
    await page.keyboard.press("ArrowLeft"); // and back
    await expect(dialog).toContainText("Pagina 9");
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(thumbs(page).nth(2)).toBeFocused(); // the page last shown flies back into its thumbnail, and focus goes there
  });

  test("Escape returns focus to the thumbnail that opened the reader", async ({ page }) => {
    await page.goto(BOOK);
    await page.waitForLoadState("networkidle");
    const second = thumbs(page).nth(1);
    await second.scrollIntoViewIfNeeded();
    await second.click();
    await expect(page.getByRole("dialog")).toContainText("Pagina 4");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(second).toBeFocused();
  });

  test("in the reader every page is shown whole, at its own proportions", async ({ page }) => {
    await page.goto(BOOK);
    await page.waitForLoadState("networkidle");
    const first = thumbs(page).first();
    await first.scrollIntoViewIfNeeded();
    await first.click();
    const dialog = page.getByRole("dialog");
    for (let i = 0; i < 3; i++) {
      const img = dialog.locator("img");
      await expect(img).toHaveCount(1); // the crossfade has finished
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      await page.waitForTimeout(400); // the shared layout has landed
      const r = await wholeImage(img);
      expect(Math.abs(r.box - r.natural), `reader page ${i + 1}`).toBeLessThanOrEqual(0.01);
      // it fits the screen
      const vp = page.viewportSize()!;
      const b = (await img.boundingBox())!;
      expect(b.x).toBeGreaterThanOrEqual(-0.5);
      expect(b.x + b.width).toBeLessThanOrEqual(vp.width + 0.5);
      expect(b.y).toBeGreaterThanOrEqual(-0.5);
      expect(b.y + b.height).toBeLessThanOrEqual(vp.height + 0.5);
      await page.keyboard.press("ArrowRight");
    }
  });

  test("320px: no sideways scroll and the reader still shows the page whole", async ({ page }, info) => {
    test.skip(!isPhone(info.project.name), "phone only");
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto("/carti/buburuza-rotunjoara");
    expect(await hasSideScroll(page)).toBe(false);
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForLoadState("networkidle");
    await thumbs(page).first().scrollIntoViewIfNeeded();
    await thumbs(page).first().click();
    const img = page.getByRole("dialog").locator("img");
    await expect(img).toHaveCount(1);
    await page.waitForTimeout(500);
    const r = await wholeImage(img);
    expect(Math.abs(r.box - r.natural)).toBeLessThanOrEqual(0.01);
  });

  test("reduced motion: the reader still opens, turns and closes", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(BOOK);
    await page.waitForLoadState("networkidle");
    await thumbs(page).first().scrollIntoViewIfNeeded();
    await thumbs(page).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(dialog).toContainText("Pagina 4");
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });
});
