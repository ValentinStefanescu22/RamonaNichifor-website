import { expect, hasSideScroll, test } from "./fixtures";

const locales = [
  {
    path: "/",
    souls: "Povești pentru suflete mici și mari",
    roles: "Autor · Ilustrator · Consilier pentru dezvoltare personală",
    cta: "Intră în poveste",
    paths: ["/carti", "/arta", "/consiliere"],
    names: ["Universul Fluturelui", "Universul Buburuzei", "Universul Țânțarului", "Universul Muștei"],
    windows: ["/universuri/fluturele", "/universuri/buburuza", "/universuri/tantarul", "/universuri/musca"],
  },
  {
    path: "/en",
    souls: "Stories for young and grown-up souls",
    roles: "Author · Illustrator · Personal development counsellor",
    cta: "Step into the story",
    paths: ["/en/books", "/en/art", "/en/counselling"],
    names: ["The Butterfly Universe", "The Ladybird Universe", "The Mosquito Universe", "The Fly Universe"],
    windows: ["/en/universes/butterfly", "/en/universes/ladybird", "/en/universes/mosquito", "/en/universes/fly"],
  },
];

for (const l of locales) {
  test.describe(l.path, () => {
    test("hero text", async ({ page }) => {
      await page.goto(l.path);
      await expect(page.locator("h1")).toHaveText(/Ramona\s*Nichifor/);
      await expect(page.locator("#top").getByText(l.souls, { exact: true })).toBeVisible();
      await expect(page.locator("#top").getByText(l.roles, { exact: true })).toBeVisible();
      await expect(page.getByRole("link", { name: l.cta })).toBeVisible();
    });

    test("three path chips", async ({ page }) => {
      await page.goto(l.path);
      const chips = page.locator("#top nav a");
      await expect(chips).toHaveCount(3);
      for (const [i, href] of l.paths.entries()) await expect(chips.nth(i)).toHaveAttribute("href", href);
    });

    test("four windows", async ({ page }, info) => {
      await page.goto(l.path);
      const windows = page.locator("#universuri li a");
      await expect(windows).toHaveCount(4);
      for (const [i, href] of l.windows.entries()) {
        await expect(windows.nth(i)).toHaveAttribute("href", href);
        await expect(windows.nth(i).locator("h3")).toHaveText(l.names[i]);
      }
      if (info.project.name === "phone") {
        const row = page.locator("#universuri ul");
        const scrolled = await row.evaluate((el) => {
          el.scrollLeft = 200;
          return el.scrollWidth > el.clientWidth && el.scrollLeft > 0;
        });
        expect(scrolled).toBe(true);
      }
      expect(await hasSideScroll(page)).toBe(false);
    });
  });
}

test("server HTML has the content", async ({ request }) => {
  const html = await (await request.get("/")).text();
  for (const s of ["Povești pentru suflete mici și mari", "Universul Fluturelui", "Fluturele dansator de step"]) expect(html).toContain(s);
});

test("CTA glides to #universuri", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Intră în poveste" }).click();
  await page.waitForTimeout(1500);
  const top = await page.locator("#universuri").evaluate((el) => el.getBoundingClientRect().top);
  expect(top).toBeGreaterThanOrEqual(0);
  expect(top).toBeLessThanOrEqual(120);
  expect(new URL(page.url()).hash).toBe("#universuri");
});

test("butterfly lands", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-flight]")).toHaveCount(1);
  // Bring the window's perch well past the landing line (42% of the viewport)
  await page.locator("[data-perch=window]").evaluate((el) =>
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3, behavior: "instant" }),
  );
  await page.waitForTimeout(2000);
  await expect(page.locator("[data-perch=window]")).toHaveCSS("opacity", "1");
});

test("reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await page.locator("h1").evaluate((el) => getComputedStyle(el).opacity)).toBe("1");
  await expect(page.locator("[data-perch=hero]")).toBeVisible();
  await page.locator("[data-perch=window]").scrollIntoViewIfNeeded();
  await expect(page.locator("[data-perch=window]")).toBeVisible();
  await expect(page.locator("[data-perch=window]")).toHaveCSS("opacity", "1");
  await page.waitForTimeout(500);
  await expect(page.locator("[data-flight]")).toHaveCount(0);
});
