import { test, expect, hasSideScroll, allow404 } from "./fixtures";

const RO = ["Acasă", "Despre mine", "Consiliere", "Cărți", "Artă", "Universuri", "Comunitate", "Contact"];
const EN = ["Home", "About me", "Counselling", "Books", "Art", "Universes", "Community", "Contact"];
const isPhone = (name: string) => name === "phone";

test("menu order", async ({ page }, info) => {
  for (const [path, labels] of [["/", RO], ["/en", EN]] as const) {
    await page.goto(path);
    expect(await page.locator("footer nav a").allInnerTexts()).toEqual(labels);
    if (isPhone(info.project.name)) {
      await page.locator("header [data-menu-button]").click();
      await expect(page.getByRole("dialog")).toBeVisible();
      expect((await page.getByRole("dialog").locator("nav > ul > li > a").allInnerTexts()).map((s) => s.trim())).toEqual(labels);
    } else {
      expect(await page.locator("header nav a").allInnerTexts()).toEqual(labels);
    }
  }
});

test("desktop nav fits on one line", async ({ page }, info) => {
  test.skip(isPhone(info.project.name), "laptop only");
  await page.goto("/carti");
  const bars = async (root: string) =>
    page.locator(root).evaluate((el) => ({
      height: el.getBoundingClientRect().height,
      links: [...el.querySelectorAll("nav a")].map((a) => a.getBoundingClientRect()).map((r) => ({ h: r.height, top: Math.round(r.top) })),
    }));
  const top = await bars("header");
  expect(top.height).toBeLessThan(80);
  expect(top.links).toHaveLength(8);
  for (const l of top.links) expect(l.h).toBeGreaterThanOrEqual(44);
  expect(new Set(top.links.map((l) => l.top)).size).toBe(1);
  expect(await hasSideScroll(page)).toBe(false);

  // the floating bar carries the same links
  await page.evaluate(() => (document.querySelector("main")!.style.minHeight = "300vh"));
  await page.evaluate(() => window.scrollTo({ top: innerHeight * 1.2, behavior: "instant" }));
  await expect(page.locator("[data-floating-bar]")).toBeVisible();
  const float = await bars("[data-floating-bar]");
  expect(float.height).toBeLessThan(80);
  expect(float.links).toHaveLength(8);
  for (const l of float.links) expect(l.h).toBeGreaterThanOrEqual(44);
  expect(new Set(float.links.map((l) => l.top)).size).toBe(1);
  expect(await hasSideScroll(page)).toBe(false);
});

test("wordmark hidden on home, shown on /carti", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("header").getByText("Ramona Nichifor")).toHaveCount(0);
  await page.goto("/carti");
  await expect(page.locator("header").getByText("Ramona Nichifor")).toBeVisible();
});

test("menu sheet traps focus and closes on Escape", async ({ page }) => {
  await page.goto("/");
  const button = page.locator("header [data-menu-button]");
  await button.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => !!document.activeElement?.closest("[role=dialog], [data-floating-bar]"))).toBe(true);
  }
  await page.keyboard.press("Shift+Tab");
  expect(await page.evaluate(() => !!document.activeElement?.closest("[role=dialog], [data-floating-bar]"))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(button).toBeFocused();
  expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
});

test("menu sheet closes on link click", async ({ page }) => {
  await page.goto("/");
  await page.locator("header [data-menu-button]").click();
  await page.getByRole("dialog").getByRole("link", { name: "Cărți" }).click();
  await expect(page).toHaveURL(/\/carti$/);
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(page.locator("h1")).toHaveText("Cărți");
});

test("floating bar appears after the hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-floating-bar]")).toHaveCount(0);
  await page.evaluate(() => (document.querySelector("main")!.style.minHeight = "300vh"));
  await page.evaluate(() => window.scrollTo({ top: innerHeight * 0.9, behavior: "instant" }));
  await expect(page.locator("[data-floating-bar]")).toBeVisible();
  await expect(page.locator("[data-floating-bar]").getByText("Ramona Nichifor")).toBeVisible();
});

test("lang switch keeps the page", async ({ page }) => {
  await page.goto("/carti");
  await page.locator("header").getByRole("radio", { name: "en" }).click();
  await expect(page).toHaveURL(/\/en\/books$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("h1")).toHaveText("Books");
  expect(await page.evaluate(() => scrollY)).toBe(0);

  await page.goto("/en/universes/butterfly");
  await page.locator("header").getByRole("radio", { name: "ro" }).click();
  await expect(page).toHaveURL(/\/universuri\/fluturele$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ro");
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

test("lang switch maps a doc's own slug in the other language", async ({ page }) => {
  await page.goto("/carti/fluturele-dansator-de-step");
  await page.locator("header").getByRole("radio", { name: "en" }).click();
  await expect(page).toHaveURL(/\/en\/books\/the-tap-dancing-butterfly$/);
  await page.locator("header").getByRole("radio", { name: "ro" }).click();
  await expect(page).toHaveURL(/\/carti\/fluturele-dansator-de-step$/);
});

test("copy email", async ({ page, context, browserName }) => {
  if (browserName === "chromium") await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const button = page.locator("footer").getByRole("button", { name: "Copiază" });
  await button.click();
  await expect(page.locator("footer").getByRole("button", { name: "Copiat" })).toBeVisible();
});

test("404 is localized", async ({ page, errors }) => {
  const ro = await page.goto("/nu-exista");
  expect(ro?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "ro");
  await expect(page.locator("h1")).toContainText("s-a rătăcit");
  await expect(page.locator("header").getByText("Ramona Nichifor")).toBeVisible();

  const en = await page.goto("/en/missing");
  expect(en?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("h1")).toContainText("wandered off");

  expect((await page.goto("/universuri/nu-exista"))?.status()).toBe(404);
  // the RO slug under /en is not a 404: it redirects to the English slug (Ruling 6, tests/universes.spec.ts)
  expect((await page.goto("/universuri/fluturele/nu-exista"))?.status()).toBe(404);
  allow404(errors);
});

test("stub pages are noindex and say „În curând”", async ({ page }) => {
  await page.goto("/consiliere");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.locator("main")).toContainText("În curând");
  await expect(page.locator("main")).toContainText("Pagina aceasta se pregătește.");
});
