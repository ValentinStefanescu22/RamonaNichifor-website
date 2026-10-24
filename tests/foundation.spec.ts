import { expect, test } from "./fixtures";

test("/ serves Romanian", async ({ page }) => {
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);
  await expect(page.locator("html")).toHaveAttribute("lang", "ro");
});

test("/en serves English", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("no visitor cookies", async ({ page, context }) => {
  await page.goto("/");
  await page.goto("/en");
  expect(await context.cookies()).toEqual([]);
});

test("fonts carry Romanian diacritics in every face", async ({ page }) => {
  await page.goto("/");
  const ok = await page.evaluate(async () => {
    await document.fonts.ready;
    const text = "Țânțarului Poveștile ăâîșț ĂÂÎȘȚ";
    const family = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).split(",")[0].trim();
    const faces = [
      `380 1em ${family("--font-fraunces")}`,
      `italic 380 1em ${family("--font-fraunces")}`,
      `400 1em ${family("--font-alegreya")}`,
      `500 1em ${family("--font-alegreya")}`,
      `700 1em ${family("--font-alegreya")}`,
      `italic 400 1em ${family("--font-alegreya")}`,
      `400 1em ${family("--font-parisienne")}`,
    ];
    await Promise.all(faces.map((f) => document.fonts.load(f, text)));
    return faces.map((f) => [f, document.fonts.check(f, text)]);
  });
  for (const [face, loaded] of ok) expect(loaded, String(face)).toBe(true);
});

test("no 600 font weight anywhere", async ({ page }) => {
  for (const path of ["/", "/en"]) {
    await page.goto(path);
    const bad = await page.evaluate(() =>
      [...document.querySelectorAll("body *")].filter((e) => getComputedStyle(e).fontWeight === "600").map((e) => e.outerHTML.slice(0, 80)),
    );
    expect(bad).toEqual([]);
  }
});

test("banned tagline never appears", async ({ page }) => {
  for (const path of ["/", "/en"]) {
    await page.goto(path);
    const text = await page.locator("body").innerText();
    expect(text).not.toContain("Bine ai revenit acasă");
    expect(text.toLowerCase()).not.toContain("welcome home");
  }
});
