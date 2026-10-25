import type { APIRequestContext, Page } from "@playwright/test";
import { allow404, expect, hasSideScroll, test } from "./fixtures";

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

// Artă with works the seed does not have (Review Focus 1): a print with a price and two pictures, a sold work, one on request with almost nothing filled in
test("artworks with a price, several pictures, sold and on request render every state", async ({ page, request }) => {
  const seeded = (await (await request.get("/api/artworks?where[slug][equals]=poiana-fluturelui&locale=ro&depth=0", { headers: auth })).json()).docs[0];
  const other = (await (await request.get("/api/artworks?where[slug][equals]=buburuza-rotunjoara&locale=ro&depth=0", { headers: auth })).json()).docs[0];
  const text = (t: string) => ({ root: { type: "root", format: "", indent: 0, version: 1, direction: "ltr", children: [{ type: "paragraph", format: "", indent: 0, version: 1, direction: "ltr", textFormat: 0, textStyle: "", children: [{ type: "text", version: 1, text: t, format: 0, mode: "normal", style: "", detail: 0 }] }] } });
  const make = async (data: Record<string, unknown>) => {
    const res = await request.post("/api/artworks?locale=ro", { headers: auth, data: { _status: "published", ...data } });
    expect(res.ok(), `create ${data.slug}`).toBeTruthy();
    return (await res.json()).doc.id as number;
  };
  const ids: number[] = [];
  try {
    ids.push(
      await make({ title: "Lucrare de probă A", slug: "lucrare-proba-a", kind: "print", availability: "preorder", price: 450, size: "A3", year: 2025, technique: "Print giclée", images: [seeded.images[0], other.images[0]], description: text("Un print de probă.") }),
      await make({ title: "Lucrare de probă B", slug: "lucrare-proba-b", kind: "original", availability: "sold", price: 900, technique: "Acuarelă pe hârtie", size: "30 × 40 cm", year: 2024, images: [other.images[0]] }),
      await make({ title: "Lucrare de probă C", slug: "lucrare-proba-c", kind: "original", availability: "onRequest", images: [seeded.images[0]] }),
    );
    const hrefOf = async (name: string) => {
      const href = (await page.getByRole("link", { name }).getAttribute("href"))!;
      const url = new URL(href, "http://x");
      return { path: url.pathname, subject: url.searchParams.get("subiect"), title: url.searchParams.get("lucrare") };
    };

    // the wall: Printuri narrows to the print, Toate shows five; the state and price lines follow each work
    await expect(async () => {
      await page.goto("/arta");
      await page.waitForLoadState("networkidle");
      await expect(page.locator(".gallery > li:visible")).toHaveCount(5, { timeout: 1000 });
    }).toPass(FRESH);
    await expect(page.getByRole("button", { name: /Printuri/ })).toContainText("1");
    await page.getByRole("button", { name: /Printuri/ }).click();
    const visible = page.locator(".gallery > li:visible");
    await expect(visible).toHaveCount(1);
    await expect(visible).toContainText("Lucrare de probă A");
    await expect(visible).toContainText("Print giclée · A3");
    await expect(visible).toContainText("450 lei");
    await expect(page.locator("[data-placeholder]", { hasText: "Lucrări în această categorie" })).toHaveCount(0);
    await page.getByRole("button", { name: /Originale/ }).click();
    await expect(visible).toHaveCount(4);
    await expect(page.locator(".gallery > li", { hasText: "Lucrare de probă B" })).toContainText("Vândută");
    await expect(page.locator(".gallery > li", { hasText: "Lucrare de probă B" })).not.toContainText("lei");
    await expect(page.locator(".gallery > li", { hasText: "Lucrare de probă C" })).toContainText("La cerere");
    await expect(page.locator(".gallery > li", { hasText: "Lucrare de probă C" })).not.toContainText("undefined");

    // A: price shown, pre-order link with the title, two pictures that swipe with dots on a phone
    await page.setViewportSize({ width: 393, height: 852 });
    await page.goto("/arta/lucrare-proba-a");
    await expect(page.locator("h1")).toHaveText("Lucrare de probă A");
    await expect(page.getByText("450 lei")).toBeVisible();
    await expect(page.getByText("Preț în curând")).toHaveCount(0);
    const pairs = await page.locator("main dl > div").evaluateAll((els) => els.map((e) => [e.querySelector("dt")!.textContent, e.querySelector("dd")!.textContent]));
    expect(pairs).toEqual([["Tehnică", "Print giclée"], ["Dimensiuni", "A3"], ["Anul", "2025"]]);
    await expect(page.getByText("Un print de probă.")).toBeVisible();
    expect(await hrefOf("Pre-comandă")).toEqual({ path: "/contact", subject: "arta", title: "Lucrare de probă A" });
    const row = page.locator("[data-swipe]");
    const dots = page.locator("[data-swipe] ~ div button");
    await expect(row.locator("img")).toHaveCount(2);
    await expect(dots).toHaveCount(2);
    await expect(dots.nth(0)).toHaveAttribute("aria-current", "true");
    expect(await row.evaluate((el) => getComputedStyle(el).scrollSnapType)).toContain("x");
    for (const img of await row.locator("img").all()) {
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      const r = await img.evaluate((el: HTMLImageElement) => el.getBoundingClientRect().width / el.getBoundingClientRect().height - el.naturalWidth / el.naturalHeight);
      expect(Math.abs(r)).toBeLessThanOrEqual(0.01);
    }
    await row.evaluate((el) => el.scrollTo({ left: el.clientWidth, behavior: "instant" }));
    await expect(dots.nth(1)).toHaveAttribute("aria-current", "true");
    await expect(dots.nth(0)).not.toHaveAttribute("aria-current", "true");
    await dots.nth(0).click();
    await expect(dots.nth(0)).toHaveAttribute("aria-current", "true");
    expect(await hasSideScroll(page)).toBe(false);
    const ld = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent!)));
    const art = ld.find((d) => d["@type"] === "VisualArtwork");
    expect(art).toMatchObject({ artform: "Print", dateCreated: "2025", offers: { price: 450, priceCurrency: "RON", availability: "https://schema.org/PreOrder" } });

    // B (sold): no price, no pre-order; asks instead, with the title
    await page.goto("/arta/lucrare-proba-b");
    await expect(page.getByText("Vândută")).toBeVisible();
    await expect(page.getByText("900")).toHaveCount(0);
    await expect(page.getByText("Preț în curând")).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Pre-comandă" })).toHaveCount(0);
    expect(await hrefOf("Întreabă de această lucrare")).toEqual({ path: "/contact", subject: "arta", title: "Lucrare de probă B" });
    await expect(page.locator("[data-swipe] ~ div button")).toHaveCount(0);

    // C (on request, almost nothing filled in): „În curând” rows, asks, no "undefined"
    await page.goto("/arta/lucrare-proba-c");
    await expect(page.getByText("La cerere")).toBeVisible();
    const empty = await page.locator("main dl > div").evaluateAll((els) => els.map((e) => [e.querySelector("dt")!.textContent, e.querySelector("dd")!.textContent]));
    expect(empty).toEqual([["Tehnică", "În curând"], ["Dimensiuni", "În curând"], ["Anul", "În curând"]]);
    expect(await hrefOf("Întreabă de această lucrare")).toEqual({ path: "/contact", subject: "arta", title: "Lucrare de probă C" });
    expect(await page.locator("main").textContent()).not.toMatch(/undefined|null|NaN/);

    // English has no title of its own: it falls back to Romanian instead of a blank
    const en = await page.goto("/en/art/lucrare-proba-c");
    expect(en?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText("Lucrare de probă C");
  } finally {
    for (const id of ids) await request.delete(`/api/artworks/${id}`, { headers: auth });
  }
});

// Database down (Review Focus 5) is not here: stopping Postgres would break the other databases on this machine.

// Comunitate: an event with a date shows it, its place and the sign-up link, and gets Event JSON-LD; dated events come first, soonest first
test("an event given a date shows it with a sign-up link and Event JSON-LD, and goes back to „Datele, în curând”", async ({ page, request }) => {
  const docs = (await (await request.get("/api/events?locale=ro&depth=0&limit=20&sort=createdAt", { headers: auth })).json()).docs;
  const byKind = (k: string) => docs.find((d: { kind: string }) => d.kind === k);
  const pictura = byKind("atelier-pictura");
  const lansare = byKind("lansare");
  const save = async (doc: { id: number }, data: Record<string, unknown>) => {
    const res = await request.patch(`/api/events/${doc.id}?locale=ro`, { headers: auth, data: { ...data, _status: "published" } });
    expect(res.ok(), "save event").toBeTruthy();
  };
  const rows = (heading = "Întâlniri") => page.locator("section", { has: page.getByRole("heading", { level: 2, name: heading }) }).locator("ul > li");
  const ld = () => page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent!)));
  try {
    await save(pictura, { startsAt: "2030-06-20T14:00:00.000Z", place: "Casa de Cultură, Cluj" });
    await save(lansare, { startsAt: "2030-05-17T09:30:00.000Z", place: "Librăria de probă" });
    await expect(async () => {
      await page.goto("/comunitate");
      await expect(rows().first()).toContainText("17 mai 2030", { timeout: 1000 });
    }).toPass(FRESH);

    // soonest first (the launch, though created second), then the other dated one, then the two without a date
    await expect(rows().getByRole("heading", { level: 3 })).toHaveText(["Lansări de carte", "Ateliere de pictură", "Sesiuni de autografe", "Ateliere de citit"]);
    const first = rows().first();
    await expect(first.locator("time")).toHaveAttribute("datetime", "2030-05-17T09:30:00.000Z");
    await expect(first).toContainText("12:30"); // Bucharest summer time
    await expect(first).toContainText("Librăria de probă");
    await expect(first).not.toContainText("Datele, în curând");
    await expect(first.getByRole("link", { name: "Vreau să particip" })).toHaveAttribute("href", "/contact?subiect=comunitate");
    await expect(rows().nth(2)).toContainText("Datele, în curând");
    await expect(rows().nth(2).locator("a")).toHaveCount(0);

    const events = (await ld()).filter((d) => d["@type"] === "Event");
    expect(events).toHaveLength(2);
    expect(events[0]).toMatchObject({
      "@type": "Event",
      name: "Lansări de carte",
      startDate: "2030-05-17T09:30:00.000Z",
      location: { "@type": "Place", name: "Librăria de probă" },
      organizer: { "@type": "Person", name: "Ramona Nichifor" },
    });
    expect(events[0].eventAttendanceMode).toContain("OfflineEventAttendanceMode");

    await expect(async () => {
      await page.goto("/en/community");
      await expect(rows("Gatherings").first()).toContainText("17 May 2030", { timeout: 1000 });
    }).toPass(FRESH);
  } finally {
    await save(pictura, { startsAt: null, place: pictura.place ?? "" });
    await save(lansare, { startsAt: null, place: lansare.place ?? "" });
  }
  await expect(async () => {
    await page.goto("/comunitate");
    await expect(rows().first()).toContainText("Datele, în curând", { timeout: 1000 });
  }).toPass(FRESH);
  await expect(rows().getByRole("heading", { level: 3 })).toHaveText(["Ateliere de pictură", "Lansări de carte", "Sesiuni de autografe", "Ateliere de citit"]);
  expect((await ld()).filter((d) => d["@type"] === "Event")).toHaveLength(0);
});

// Confidențialitate: the date Ramona last changed the text shows under the title, per language, and goes away when cleared
test("a legal page given a „last updated” date shows it, formatted per language", async ({ page, request }) => {
  const doc = (await (await request.get("/api/legal-pages?locale=ro&depth=0&where[kind][equals]=privacy", { headers: auth })).json()).docs[0];
  const save = async (lastUpdated: string | null) => {
    const res = await request.patch(`/api/legal-pages/${doc.id}?locale=ro`, { headers: auth, data: { lastUpdated, _status: "published" } });
    expect(res.ok(), "save legal page").toBeTruthy();
  };
  try {
    await save("2026-10-20T09:00:00.000Z");
    await expect(async () => {
      await page.goto("/confidentialitate");
      await expect(page.locator("main time")).toHaveText("Ultima actualizare: 20 octombrie 2026", { timeout: 1000 });
    }).toPass(FRESH);
    await expect(page.locator("main time")).toHaveAttribute("datetime", "2026-10-20T09:00:00.000Z");
    await expect(page.locator("main")).toContainText("Text în lucru, de aprobat de Ramona.");
    await expect(async () => {
      await page.goto("/en/privacy");
      await expect(page.locator("main time")).toHaveText("Last updated: 20 October 2026", { timeout: 1000 });
    }).toPass(FRESH);
  } finally {
    await save(doc.lastUpdated ?? null);
  }
  await expect(async () => {
    await page.goto("/confidentialitate");
    await expect(page.locator("main time")).toHaveCount(0, { timeout: 1000 });
  }).toPass(FRESH);
});
