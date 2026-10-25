import { expect, test } from "./fixtures";

const SITE = "https://ramonanichifor.com"; // NEXT_PUBLIC_SITE_URL is unset in the test build
const home = {
  ro: { path: "/", url: SITE, title: "Ramona Nichifor · Autoare, ilustratoare și consilier pentru dezvoltare personală" },
  en: { path: "/en", url: `${SITE}/en`, title: "Ramona Nichifor · Author, illustrator and personal development counsellor" },
} as const;

for (const [locale, h] of Object.entries(home)) {
  test(`${locale} title`, async ({ page }) => {
    await page.goto(h.path);
    await expect(page).toHaveTitle(h.title);
  });

  test(`${locale} hreflang + canonical`, async ({ page }) => {
    await page.goto(h.path);
    const href = (sel: string) => page.locator(sel).getAttribute("href");
    expect(await href('link[rel="canonical"]')).toBe(h.url);
    expect(await href('link[rel="alternate"][hreflang="ro"]')).toBe(home.ro.url);
    expect(await href('link[rel="alternate"][hreflang="en"]')).toBe(home.en.url);
    expect(await href('link[rel="alternate"][hreflang="x-default"]')).toBe(home.ro.url);
  });

  test(`${locale} og image`, async ({ page, request }) => {
    await page.goto(h.path);
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(og).toBe(`${SITE}/og/home-${locale}.png`);
    expect(await page.locator('meta[property="og:image:alt"]').getAttribute("content")).toBe(h.title);
    expect(await page.locator('meta[name="twitter:card"]').getAttribute("content")).toBe("summary_large_image");
    const res = await request.get(new URL(og!).pathname);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/png");
  });
}

test("json-ld", async ({ page }) => {
  await page.goto("/");
  const ld = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent())!);
  const graph: Record<string, unknown>[] = ld["@graph"];
  const person = graph.find((n) => n["@type"] === "Person") as Record<string, unknown>;
  expect(person.name).toBe("Ramona Nichifor");
  expect(person.sameAs).toEqual(
    expect.arrayContaining(["https://www.instagram.com/ramonanichifor.creations/", "https://www.facebook.com/ramona.nichifor/"]),
  );
  expect(person.jobTitle).toHaveLength(3);
  // the portrait is a Payload upload since M2
  expect(person.image).toBe(`${SITE}/api/media/file/portrait.webp`);
  expect(graph.find((n) => n["@type"] === "WebSite")).toMatchObject({ name: "Ramona Nichifor", url: SITE, inLanguage: "ro" });
});

test("preview is noindex", async ({ page, request }) => {
  await page.goto("/");
  expect(await page.locator('meta[name="robots"]').getAttribute("content")).toContain("noindex");
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/^Disallow: \/$/m);
});

test("sitemap", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const h of Object.values(home)) expect(xml).toContain(`<loc>${h.url}</loc>`);
  expect(xml).toContain(`<xhtml:link rel="alternate" hreflang="en" href="${home.en.url}" />`);
  expect(xml).toContain(`<xhtml:link rel="alternate" hreflang="x-default" href="${home.ro.url}" />`);
});

test("icons", async ({ page, request }) => {
  await page.goto("/");
  for (const rel of ["icon", "apple-touch-icon"]) {
    const href = await page.locator(`link[rel="${rel}"]`).first().getAttribute("href");
    const res = await request.get(href!);
    expect(res.status(), rel).toBe(200);
  }
});

// An inner page: „{Page} · Ramona Nichifor”, a self canonical, hreflang ro/en/x-default and its own 1200×630 card.
const about = {
  ro: { path: "/despre", url: `${SITE}/despre`, title: "Despre mine · Ramona Nichifor" },
  en: { path: "/en/about", url: `${SITE}/en/about`, title: "About me · Ramona Nichifor" },
} as const;

for (const [locale, p] of Object.entries(about)) {
  test(`${locale} inner page: title, canonical, hreflang`, async ({ page }) => {
    await page.goto(p.path);
    await expect(page).toHaveTitle(p.title);
    const href = (sel: string) => page.locator(sel).getAttribute("href");
    expect(await href('link[rel="canonical"]')).toBe(p.url);
    expect(await page.locator('link[rel="alternate"][hreflang]').count()).toBe(3);
    expect(await href('link[rel="alternate"][hreflang="ro"]')).toBe(about.ro.url);
    expect(await href('link[rel="alternate"][hreflang="en"]')).toBe(about.en.url);
    expect(await href('link[rel="alternate"][hreflang="x-default"]')).toBe(about.ro.url);
    expect(await page.locator('meta[property="og:url"]').getAttribute("content")).toBe(p.url);
    expect(await page.locator('meta[property="og:title"]').getAttribute("content")).toBe(p.title);
  });

  test(`${locale} inner page: og:image is a 1200×630 png`, async ({ page, request }) => {
    await page.goto(p.path);
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(og).toMatch(/opengraph-image/);
    expect(await page.locator('meta[name="twitter:image"]').getAttribute("content")).toBe(og);
    const res = await request.get(new URL(og!).pathname, { maxRedirects: 0 }); // no redirect on the way: crawlers get the image at once
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toBe("image/png");
    const png = await res.body();
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
  });
}

test("sitemap lists every page in both languages, with alternates and the doc's last edit", async ({ request }) => {
  const xml = await (await request.get("/sitemap.xml")).text();
  for (const path of ["/universuri", "/carti", "/arta", "/consiliere", "/despre", "/comunitate", "/contact", "/confidentialitate", "/termeni"]) {
    expect(xml, path).toContain(`<loc>${SITE}${path}</loc>`);
  }
  for (const path of ["/en/universes", "/en/books", "/en/art", "/en/counselling", "/en/about", "/en/community", "/en/contact", "/en/privacy", "/en/terms"]) {
    expect(xml, path).toContain(`<loc>${SITE}${path}</loc>`);
  }
  // a doc: each language's own slug in loc and alternates, and a lastmod
  const universe = xml.match(/<url>\s*<loc>https:\/\/ramonanichifor\.com\/universuri\/fluturele<\/loc>[\s\S]*?<\/url>/)?.[0];
  expect(universe, "universe entry").toBeTruthy();
  expect(universe).toContain(`hreflang="en" href="${SITE}/en/universes/butterfly"`);
  expect(universe).toMatch(/<lastmod>\d{4}-\d\d-\d\dT/);
  // a product route carries the universe and the product slug of each language
  expect(xml).toContain(`<loc>${SITE}/en/universes/butterfly/bookmark</loc>`);
  expect(xml).toContain(`<loc>${SITE}/universuri/fluturele/semn-de-carte</loc>`);
  // the 404 and the admin are not pages
  expect(xml).not.toContain("/admin");
});
