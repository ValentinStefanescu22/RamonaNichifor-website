import { expect, hasSideScroll, test } from "./fixtures";

test("book", async ({ page }) => {
  await page.goto("/");
  const book = page.locator("#carte");
  const h2 = book.getByRole("heading", { level: 2, name: "Fluturele dansator de step" });
  await expect(h2).toBeVisible();
  await expect(book.getByText("O poveste pentru copii… o șoaptă pentru adulți")).toBeVisible();
  const meta = book.getByText("Pentru copii · 2026 · „Magia suntem noi”");
  await expect(meta).toBeVisible();
  const [h, m] = [await h2.boundingBox(), await meta.boundingBox()];
  expect(m!.y).toBeGreaterThan(h!.y + h!.height);
  await expect(book.getByText("În curând")).toBeVisible();
  await expect(book.getByText("Comenzile online se pregătesc.")).toBeVisible();
  await expect(book.getByText("ISBN 978-973-0-44382-0")).toBeVisible();
  await expect(book.getByRole("link", { name: "Despre carte" })).toHaveAttribute("href", "/carti/fluturele-dansator-de-step");
  // no store links yet: the only link in the section is „Despre carte”
  await expect(book.getByRole("link")).toHaveCount(1);
  expect(await hasSideScroll(page)).toBe(false);
});

test("art never cropped", async ({ page }) => {
  await page.goto("/");
  const arts = page.locator("img.art");
  const n = await arts.count();
  expect(n).toBeGreaterThanOrEqual(3); // book cover + two paintings
  for (let i = 0; i < n; i++) {
    const img = arts.nth(i);
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    const diff = await img.evaluate(
      (el: HTMLImageElement) => Math.abs(el.naturalWidth / el.naturalHeight - el.clientWidth / el.clientHeight),
    );
    expect(diff, `img.art #${i} cropped`).toBeLessThan(0.01);
  }
  const prevented = await arts.first().evaluate((el) => {
    const e = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
    el.dispatchEvent(e);
    return e.defaultPrevented;
  });
  expect(prevented).toBe(true);
});

test("manifesto", async ({ page }) => {
  await page.goto("/");
  const q = page.locator("#consiliere blockquote");
  await expect(q.locator(":scope > span")).toHaveCount(3);
  await expect(q.locator("em")).toHaveText(["intuiție", "imagine", "simțim"]);
  await page.goto("/en");
  await expect(page.locator("#consiliere blockquote em")).toHaveText(["intuition", "image", "feel"]);
});

test("counselling teaser", async ({ page }) => {
  await page.goto("/");
  const wa = page.locator('#consiliere a[href="https://wa.me/40730775132"]');
  await expect(wa).toHaveAttribute("target", "_blank");
  await expect(wa).toHaveAttribute("rel", /noreferrer/);
  await expect(page.locator("#consiliere").getByText("ramona_nichifor@yahoo.com")).toBeVisible();
  await expect(page.locator("#consiliere").getByRole("link", { name: "Cum lucrez" })).toHaveAttribute("href", "/consiliere");
});

test("EN copy", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 2, name: "About me" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "The Tap-Dancing Butterfly" })).toBeVisible();
  await expect(page.locator("#arta").getByRole("link", { name: "See the whole gallery" })).toBeVisible();
  await expect(page.locator("#despre").getByRole("link", { name: "My story" })).toHaveAttribute("href", "/en/about");
  expect(await hasSideScroll(page)).toBe(false);
});
