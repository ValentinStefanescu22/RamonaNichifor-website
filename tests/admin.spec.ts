import { expect, test } from "./fixtures";

// The Payload admin: Romanian, never indexed, its API closed to visitors.
test.describe("admin", () => {
  test.skip(({ isMobile }) => isMobile, "the admin is checked on a laptop");

  test("speaks Romanian and is noindex", async ({ page }) => {
    const res = await page.goto("/admin");
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator("html")).toHaveAttribute("lang", "ro");
    await expect(page.getByText(/Autentificare|Bine ați venit/).first()).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("the API is closed to visitors", async ({ request }) => {
    const me = await request.get("/api/users/me");
    expect(me.headers()["content-type"]).toContain("application/json");
    expect((await me.json()).user).toBeNull();
    const users = await request.get("/api/users");
    expect(users.status()).toBe(403);
  });
});
