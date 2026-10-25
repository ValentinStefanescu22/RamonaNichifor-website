import type { APIRequestContext, Page } from "@playwright/test";
import { allow404, expect, test } from "./fixtures";

// Payload → public site, driven through Payload's REST API with the seeded admin (.env.local, loaded by the config).
// Runs in its own "cms" project, after every other one: it edits the texts and slugs the other suites read.
// Every test restores what it changed in `finally`, even when it fails.

test.describe.configure({ mode: "serial" });

const SOULS = { ro: "Povești pentru suflete mici și mari", en: "Stories for young and grown-up souls" };
// publishes re-render the site stale-while-revalidate (payload/hooks/revalidate.ts): reload until the new page arrives
const FRESH = { timeout: 60_000, intervals: [500, 1000, 2000] };

let auth: Record<string, string>;

test.beforeAll(async ({ request }) => {
  const res = await request.post("/api/users/login", {
    data: { email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD },
  });
  expect(res.ok(), "admin login").toBeTruthy();
  auth = { Authorization: `JWT ${(await res.json()).token}` };
});

async function saveSettings(request: APIRequestContext, locale: "ro" | "en", data: Record<string, unknown>, draft = false) {
  const res = await request.post(`/api/globals/site-settings?locale=${locale}${draft ? "&draft=true" : ""}`, {
    headers: auth,
    data: { ...data, _status: draft ? "draft" : "published" },
  });
  expect(res.ok(), `save site-settings (${locale})`).toBeTruthy();
}

/** The hero motto, after reloading until it shows `text` */
async function heroShows(page: Page, path: string, text: string) {
  await expect(async () => {
    await page.goto(path);
    await expect(page.locator("#top").getByText(text, { exact: true })).toBeVisible({ timeout: 1000 });
  }).toPass(FRESH);
}

test("a published change reaches the public home", async ({ page, request }) => {
  try {
    await saveSettings(request, "ro", { souls: "Povești TEST" });
    await heroShows(page, "/", "Povești TEST");
  } finally {
    await saveSettings(request, "ro", { souls: SOULS.ro });
  }
  await heroShows(page, "/", SOULS.ro);
});

test("a draft stays private, and shows in preview", async ({ page, request }) => {
  try {
    await saveSettings(request, "ro", { souls: "Ciornă TEST" }, true);
    // the public page, even once re-rendered, keeps the published text
    for (let i = 0; i < 3; i++) {
      await page.goto("/");
      await expect(page.locator("#top").getByText(SOULS.ro, { exact: true })).toBeVisible();
      await page.waitForTimeout(700);
    }

    // a wrong secret or a foreign redirect is refused
    expect((await request.get("/api/preview?secret=wrong&path=/", { maxRedirects: 0 })).status()).toBe(401);
    const foreign = await request.get(`/api/preview?secret=${process.env.PREVIEW_SECRET}&path=//evil.example`, { maxRedirects: 0 });
    expect(foreign.status()).toBe(400);

    await page.goto(`/api/preview?secret=${encodeURIComponent(process.env.PREVIEW_SECRET ?? "")}&path=/`);
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("#top").getByText("Ciornă TEST", { exact: true })).toBeVisible();

    await page.goto("/api/exit-preview?path=/");
    await expect(page.locator("#top").getByText(SOULS.ro, { exact: true })).toBeVisible();
  } finally {
    // publish the original so the draft doesn't linger
    await saveSettings(request, "ro", { souls: SOULS.ro });
  }
  await heroShows(page, "/", SOULS.ro);
});

// `souls` is required in both languages (the admin refuses it empty), so this uses an optional field shown on Acasă:
// the featured book's subtitle
test("an empty English field falls back to Romanian", async ({ page, request }) => {
  const ro = (await (await request.get("/api/books?where[slug][equals]=fluturele-dansator-de-step&locale=ro&depth=0", { headers: auth })).json()).docs[0];
  const en = await (await request.get(`/api/books/${ro.id}?locale=en&depth=0`, { headers: auth })).json();
  expect(ro.subtitle).not.toBe(en.subtitle);
  const setSubtitle = async (subtitle: string) => {
    const res = await request.patch(`/api/books/${ro.id}?locale=en`, { headers: auth, data: { subtitle, _status: "published" } });
    expect(res.ok(), "save book subtitle (en)").toBeTruthy();
  };
  const subtitleShows = (text: string) =>
    expect(async () => {
      await page.goto("/en");
      await expect(page.locator("#carte").getByText(text, { exact: true })).toBeVisible({ timeout: 1000 });
    }).toPass(FRESH);

  try {
    await setSubtitle("");
    await subtitleShows(ro.subtitle);
  } finally {
    await setSubtitle(en.subtitle);
  }
  await subtitleShows(en.subtitle);
});

test("an edited English slug keeps the language switch working", async ({ page, request, errors }) => {
  const found = await request.get("/api/universes?where[slug][equals]=fluturele&locale=ro&depth=0", { headers: auth });
  const doc = (await found.json()).docs[0];
  const original = (await (await request.get(`/api/universes/${doc.id}?locale=en&depth=0`, { headers: auth })).json()).slug;
  const setSlug = async (slug: string) => {
    const res = await request.patch(`/api/universes/${doc.id}?locale=en`, { headers: auth, data: { slug, _status: "published" } });
    expect(res.ok(), "save universe slug").toBeTruthy();
  };
  const switchLandsOn = async (path: string) =>
    expect(async () => {
      await page.goto("/universuri/fluturele");
      await page.locator("header").getByRole("radio", { name: "en" }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`), { timeout: 3000 });
      expect((await page.request.get(path)).status()).toBe(200);
    }).toPass(FRESH);

  try {
    await setSlug("butterfly-test");
    await switchLandsOn("/en/universes/butterfly-test");
  } finally {
    await setSlug(original);
  }
  await switchLandsOn(`/en/universes/${original}`);
  // stale-while-revalidate: while the pages re-render, a switch may land once on a slug that no longer (or not yet)
  // exists and get its 404, then Chrome aborts the cross-document view transition. The retries above end on a 200.
  allow404(errors);
  for (let i = errors.length - 1; i >= 0; i--) if (errors[i].startsWith("Transition was aborted")) errors.splice(i, 1);
});

// Review Focus 1: a book with almost nothing filled in shows its designed „în curând” states, never an empty box or "undefined"
test("a book with no year, pages, ISBN, pages to leaf through or text still renders whole", async ({ page, request }) => {
  const fluturele = (await (await request.get("/api/books?where[slug][equals]=fluturele-dansator-de-step&locale=ro&depth=0", { headers: auth })).json()).docs[0];
  const created = await request.post("/api/books?locale=ro", {
    headers: auth,
    data: { title: "Carte de probă", slug: "carte-de-proba", ageGroup: "adolescenti", status: "soon", cover: fluturele.cover, _status: "published" },
  });
  expect(created.ok(), "create the test book").toBeTruthy();
  const id = (await created.json()).doc.id;
  try {
    await expect(async () => {
      await page.goto("/carti/carte-de-proba");
      await expect(page.locator("h1")).toHaveText("Carte de probă", { timeout: 1000 });
    }).toPass(FRESH);
    const main = page.locator("main");
    // age is always known; year and format wait; pages and ISBN are left out, never shown empty
    const meta = await main.locator("dl").first().locator("> div").evaluateAll((els) => els.map((e) => [e.querySelector("dt")!.textContent, e.querySelector("dd")!.textContent]));
    expect(meta).toEqual([
      ["Vârstă", "12–16 ani"],
      ["Anul", "În curând"],
      ["Format", "În curând"],
    ]);
    await expect(main.getByText("Povestea prinde contur în atelier.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Anunță-mă când apare" })).toBeVisible();
    await expect(main.getByText("Pagini din carte, în curând.")).toBeVisible();
    await expect(page.locator("[data-leaf]")).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Descoperă universul/ })).toHaveCount(0);
    expect(await main.textContent()).not.toMatch(/undefined|null|NaN/);

    // the shelf lists it under Adolescenți with the „în curând” chip, and the group is no longer „în lucru” only
    await expect(async () => {
      await page.goto("/carti");
      await page.waitForLoadState("networkidle");
      await page.getByRole("radio", { name: /Adolescenți/ }).click();
      const item = page.locator("[data-shelf]:visible li");
      await expect(item).toHaveCount(1, { timeout: 1000 });
      await expect(item).toContainText("Carte de probă");
      await expect(item).toContainText("În curând");
    }).toPass(FRESH);

    // English has no title of its own: it falls back to Romanian instead of a blank
    const en = await page.goto("/en/books/carte-de-proba");
    expect(en?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText("Carte de probă");
  } finally {
    await request.delete(`/api/books/${id}`, { headers: auth });
  }
});

// A book with a real store link, its own SEO texts and leaf pages she left unlabelled: metadata, JSON-LD and names follow
test("a book's SEO group, store link (sameAs) and unlabelled leaf pages reach the page", async ({ page, request }) => {
  const fluturele = (await (await request.get("/api/books?where[slug][equals]=fluturele-dansator-de-step&locale=ro&depth=0", { headers: auth })).json()).docs[0];
  const image = fluturele.leafPages[1].image;
  const created = await request.post("/api/books?locale=ro", {
    headers: auth,
    data: {
      title: "Carte cu magazin",
      slug: "carte-cu-magazin",
      ageGroup: "copii",
      status: "published",
      year: 2026,
      cover: fluturele.cover,
      storeLinks: [{ store: "Librăria de probă", url: "https://example.com/carte-de-proba" }],
      leafPages: [{ image }, { image }],
      seo: { title: "Titlu SEO de probă", description: "Descriere SEO de probă pentru carte." },
      _status: "published",
    },
  });
  expect(created.ok(), "create the test book").toBeTruthy();
  const id = (await created.json()).doc.id;
  try {
    await expect(async () => {
      await page.goto("/carti/carte-cu-magazin");
      await expect(page.locator("h1")).toHaveText("Carte cu magazin", { timeout: 1000 });
    }).toPass(FRESH);
    // the doc's SEO group wins over the page's own title and description
    await expect(page).toHaveTitle("Titlu SEO de probă · Ramona Nichifor");
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Titlu SEO de probă · Ramona Nichifor");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", "Descriere SEO de probă pentru carte.");
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute("content", "Descriere SEO de probă pentru carte.");
    // a real store link: a pill, not „în curând”; JSON-LD says where it is sold, with an absolute image
    await expect(page.getByRole("link", { name: "Librăria de probă" })).toHaveAttribute("href", "https://example.com/carte-de-proba");
    await expect(page.getByText("Comenzile online se pregătesc.")).toHaveCount(0);
    const ld = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent!)));
    const book = ld.find((d) => d["@type"] === "Book");
    expect(book.sameAs).toEqual(["https://example.com/carte-de-proba"]);
    expect(book.image).toMatch(/^https?:\/\//);
    // leaf pages without a label are still named: the back cover first, then „Pagina N”
    const leaf = page.locator("[data-leaf] button[aria-haspopup=dialog]");
    await expect(leaf).toHaveCount(2);
    await expect(leaf.nth(0)).toHaveAccessibleName("Coperta spate, Carte cu magazin");
    await expect(leaf.nth(1)).toHaveAccessibleName("Pagina 2, Carte cu magazin");
    await expect(page.locator("[data-leaf] li span[aria-hidden]")).toHaveText(["Coperta spate", "Pagina 2"]);
  } finally {
    await request.delete(`/api/books/${id}`, { headers: auth });
  }
});

test("a universe's SEO title reaches its page and goes away when emptied", async ({ page, request }) => {
  const doc = (await (await request.get("/api/universes?where[slug][equals]=fluturele&locale=ro&depth=0", { headers: auth })).json()).docs[0];
  const setSeo = async (title: string) => {
    const res = await request.patch(`/api/universes/${doc.id}?locale=ro`, { headers: auth, data: { seo: { title }, _status: "published" } });
    expect(res.ok(), "save universe seo").toBeTruthy();
  };
  const titleIs = (text: string) =>
    expect(async () => {
      await page.goto("/universuri/fluturele");
      await expect(page).toHaveTitle(text, { timeout: 1000 });
    }).toPass(FRESH);
  try {
    await setSeo("Univers SEO de probă");
    await titleIs("Univers SEO de probă · Ramona Nichifor");
  } finally {
    await setSeo("");
  }
  await titleIs("Universul Fluturelui · Ramona Nichifor");
});

// Database down (Review Focus 5) is not here: stopping Postgres would break the other databases on this machine.
