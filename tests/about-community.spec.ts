import type { Page } from "@playwright/test";
import { expect, hasSideScroll, test } from "./fixtures";

// Despre (spec §5.7) and Comunitate cu sens (§5.7b). Seeded content (npm run seed): her story in four movements, three crafts,
// four kinds of gathering without dates, no projects, one partner (AVA Art & Soul). The test that gives an event a date edits the
// CMS, so it lives in cms.spec.ts (it must not run beside these).

const jsonLd = (page: Page) => page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent!)));
const IG = "https://www.instagram.com/ava.art.soul/";

test.describe("/despre", () => {
  test("h1 „Despre mine”, then her role line; EN „About me”", async ({ page }) => {
    await page.goto("/despre");
    await expect(page.locator("h1")).toHaveText("Despre mine");
    const hero = page.locator("main > section").first();
    const role = hero.getByText("Consilier pentru dezvoltare personală, jurist, autor și ilustrator.", { exact: true });
    await expect(role).toBeVisible();
    const top = (l: ReturnType<typeof page.locator>) => l.first().evaluate((el) => el.getBoundingClientRect().top);
    expect(await top(page.locator("h1"))).toBeLessThan(await top(role));
    await page.goto("/en/about");
    await expect(page.locator("h1")).toHaveText("About me");
    await expect(page.locator("main")).toContainText("Personal development counsellor, lawyer, author and illustrator.");
  });

  test("the portrait sits in an arch (4:5, the photo's own pixels, loaded)", async ({ page }) => {
    await page.goto("/despre");
    const img = page.locator("main > section").first().locator("img.arch");
    await expect(img).toBeVisible();
    await expect(img).toHaveAttribute("alt", /Ramona Nichifor/);
    const box = (await img.boundingBox())!;
    expect(box.width / box.height).toBeCloseTo(0.8, 1);
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  });

  test("her story: four movements in her order, her questions one per line, the closing words", async ({ page }) => {
    await page.goto("/despre");
    await expect(page.getByRole("heading", { level: 2, name: "Povestea mea" })).toBeVisible();
    const moves = page.locator("[data-movement]");
    await expect(moves).toHaveCount(4);
    const starts = ["Din copilărie, picturile", "Dorința de a studia psihologia", "Ca angajat, antreprenor și jurist", "Astăzi pictez, scriu"];
    for (const [i, s] of starts.entries()) await expect(moves.nth(i)).toContainText(s);
    // the questions arrive one per line
    const asked = moves.nth(2).locator("[data-kind=question] > span");
    expect(await asked.count()).toBeGreaterThanOrEqual(3);
    await expect(asked.first()).toHaveText("Cine sunt?");
    await expect(moves.nth(3).locator("[data-kind=closing]")).toContainText("Îmi onorez natura creatoare");
    // the page is those four, nothing from another page
    await expect(page.locator("main")).not.toContainText("În curând");
  });

  test("EN: her own paragraph breaks inside a beat become paragraphs", async ({ page }) => {
    await page.goto("/en/about");
    const first = page.locator("[data-movement]").first().locator("[data-kind=beat]").nth(2);
    expect(await first.locator("p").count()).toBeGreaterThanOrEqual(3);
    await expect(first).toContainText("Yet life led me elsewhere.");
  });

  test("the signature is set in Parisienne", async ({ page }) => {
    await page.goto("/despre");
    const sig = page.locator("main").getByText("Ramona", { exact: true });
    await expect(sig).toBeVisible();
    expect(await sig.evaluate((el) => getComputedStyle(el).fontFamily)).toContain("Parisienne");
  });

  test("three crafts link to Cărți, Artă and Consiliere", async ({ page }) => {
    await page.goto("/despre");
    const crafts = page.getByRole("list", { name: "Trei meșteșuguri, o singură mână" }).locator(":scope > li > a");
    await expect(crafts).toHaveCount(3);
    await expect(crafts).toHaveText([/Povești/, /Pictură/, /Consiliere/]);
    expect(await crafts.evaluateAll((as) => as.map((a) => a.getAttribute("href")))).toEqual(["/carti", "/arta", "/consiliere"]);
    await page.goto("/en/about");
    const en = page.getByRole("list", { name: "Three crafts, one hand" }).locator(":scope > li > a");
    expect(await en.evaluateAll((as) => as.map((a) => a.getAttribute("href")))).toEqual(["/en/books", "/en/art", "/en/counselling"]);
  });

  test("the profile links are the Person's sameAs, and the JSON-LD is a ProfilePage whose mainEntity is that Person", async ({ page }) => {
    await page.goto("/despre");
    const ld = await jsonLd(page);
    const profile = ld.find((d) => d["@type"] === "ProfilePage");
    expect(profile.mainEntity["@type"]).toBe("Person");
    expect(profile.mainEntity.name).toBe("Ramona Nichifor");
    const graph = ld.find((d) => d["@graph"])["@graph"].find((n: { "@type": string }) => n["@type"] === "Person");
    expect(profile.mainEntity.sameAs.length).toBeGreaterThanOrEqual(2);
    expect(profile.mainEntity.sameAs).toEqual(graph.sameAs);
    expect(profile.mainEntity["@id"]).toBe(graph["@id"]);

    const links = page.getByRole("list", { name: "Unde mă găsești" }).locator("a");
    expect(await links.evaluateAll((as) => as.map((a) => a.getAttribute("href")))).toEqual(profile.mainEntity.sameAs);
    for (const a of await links.all()) await expect(a).toHaveAttribute("target", "_blank");
    expect(ld.find((d) => d["@type"] === "BreadcrumbList").itemListElement.at(-1).name).toBe("Despre mine");
  });

  test("metadata: its own description, a self canonical, hreflang and a 1200×630 card", async ({ page, request }) => {
    for (const [path, title] of [["/despre", "Despre mine · Ramona Nichifor"], ["/en/about", "About me · Ramona Nichifor"]] as const) {
      await page.goto(path);
      await expect(page).toHaveTitle(title);
      const desc = await page.locator('meta[name="description"]').getAttribute("content");
      expect(desc!.length).toBeGreaterThan(60);
      expect(desc).not.toBe("Despre mine");
      expect(desc).not.toBe("About me");
      expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toMatch(new RegExp(`${path}$`));
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(3);
      const og = await page.locator('meta[property="og:image"]').getAttribute("content");
      expect(await page.locator('meta[property="og:image:width"]').getAttribute("content")).toBe("1200");
      const res = await request.get(new URL(og!).pathname + new URL(og!).search);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("image/png");
    }
  });

  test("nothing scrolls sideways, at 320 px either", async ({ page }) => {
    for (const path of ["/despre", "/en/about"]) {
      await page.goto(path);
      expect(await hasSideScroll(page)).toBe(false);
    }
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/despre");
    expect(await hasSideScroll(page)).toBe(false);
  });

  test("without motion every paragraph is already there and the crafts are drawn", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/despre");
    const op = await page.locator("[data-movement] .reveal").evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
    expect(op.length).toBeGreaterThan(8);
    expect(new Set(op)).toEqual(new Set(["1"]));
    const sig = page.getByText("Ramona", { exact: true });
    expect(await sig.evaluate((el) => getComputedStyle(el).clipPath)).not.toMatch(/inset\([^)]*100%/);
  });
});

test.describe("/comunitate", () => {
  test("h1 „Comunitate cu sens”, its tagline and lead", async ({ page }) => {
    await page.goto("/comunitate");
    await expect(page.locator("h1")).toHaveText("Comunitate cu sens");
    const hero = page.locator("main > section").first();
    await expect(hero).toContainText("Oameni care inspiră. Întâlniri care ne apropie.");
    await expect(hero).toContainText("Cred că fiecare om are ceva valoros de dăruit");
    await page.goto("/en/community");
    await expect(page.locator("h1")).toHaveText("Community with meaning");
  });

  test("the gathering circle: 6 butterflies settle inside the arch window", async ({ page }) => {
    await page.goto("/comunitate");
    const arch = page.locator("main > section").first().locator(".arch").first();
    await expect(arch).toBeVisible();
    const wings = arch.locator("[data-kind=butterfly]");
    expect(await wings.count()).toBeGreaterThanOrEqual(5);
    // the real cover butterfly (two hinged wings) at least three times over
    expect(await arch.locator(".butterfly").count()).toBeGreaterThanOrEqual(3);
    await page.waitForTimeout(3500); // the flight (≤ 2.3 s) is over
    const a = (await arch.boundingBox())!;
    for (const b of await wings.all()) {
      const box = (await b.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(a.x - 1);
      expect(box.x + box.width).toBeLessThanOrEqual(a.x + a.width + 1);
      expect(box.y).toBeGreaterThanOrEqual(a.y - 1);
      expect(box.y + box.height).toBeLessThanOrEqual(a.y + a.height + 1);
    }
    // the decorative circle is hidden from assistive tech
    expect(await page.locator("main > section").first().locator("[aria-hidden=true] .arch").count()).toBe(1);
  });

  test("reduced motion: the butterflies rest at their perches (no transform change between two frames)", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/comunitate");
    const perches = page.locator("[data-kind=butterfly], [data-kind=ladybird]");
    expect(await perches.count()).toBeGreaterThanOrEqual(8);
    const frame = () =>
      perches.evaluateAll((els) =>
        els.map((el) => [el, ...el.querySelectorAll("*")].map((n) => getComputedStyle(n).transform + "|" + getComputedStyle(n).opacity + "|" + getComputedStyle(n).animationName).join(";")),
      );
    const one = await frame();
    await page.waitForTimeout(700);
    const two = await frame();
    expect(two).toEqual(one);
    // and they are not left at the start of a flight (invisible or offset)
    expect(await perches.evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity))).toEqual(Array(await perches.count()).fill("1"));
    for (const e of await page.locator("[data-kind=butterfly] .butterfly").all()) {
      expect(await e.locator(".wing-l").evaluate((w) => getComputedStyle(w).animationName)).toBe("none");
    }
  });

  test("with motion the butterflies keep moving after they settle", async ({ page }) => {
    await page.goto("/comunitate");
    await page.waitForTimeout(3500);
    const wing = page.locator("[data-kind=butterfly] .butterfly .wing-l").first();
    const t = () => wing.evaluate((w) => getComputedStyle(w).transform);
    const seen = new Set<string>();
    for (let i = 0; i < 6; i++) {
      seen.add(await t());
      await page.waitForTimeout(90);
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  test("Întâlniri: four kinds, each „Datele, în curând”, no Event JSON-LD, no sign-up link without a date", async ({ page }) => {
    await page.goto("/comunitate");
    const section = page.locator("section", { has: page.getByRole("heading", { level: 2, name: "Întâlniri" }) });
    const rows = section.locator("ul > li");
    await expect(rows).toHaveCount(4);
    await expect(rows.getByRole("heading", { level: 3 })).toHaveText(["Ateliere de pictură", "Lansări de carte", "Sesiuni de autografe", "Ateliere de citit"]);
    for (const row of await rows.all()) {
      await expect(row).toContainText("Datele, în curând");
      await expect(row.locator("a")).toHaveCount(0);
    }
    await expect(rows.first()).toContainText("Acuarelă pentru copii și pentru adulți");
    expect((await jsonLd(page)).filter((d) => d["@type"] === "Event")).toHaveLength(0);
    await page.goto("/en/community");
    await expect(page.locator("main")).toContainText("Dates coming soon");
  });

  test("Proiecte cu sens: no project yet, so the title and a large „În curând”", async ({ page }) => {
    await page.goto("/comunitate");
    const section = page.locator("section", { has: page.getByRole("heading", { level: 2, name: "Proiecte cu sens" }) });
    const soon = section.getByText("În curând", { exact: true });
    await expect(soon).toBeVisible();
    expect(await soon.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(40);
    await expect(section).toContainText("Aici vei descoperi oameni și proiecte care merită cunoscute");
  });

  test("Parteneri: AVA Art & Soul opens Instagram in a new tab; „Vrei să fim parteneri?” goes to the contact form", async ({ page }) => {
    await page.goto("/comunitate");
    const section = page.locator("section", { has: page.getByRole("heading", { level: 2, name: "Parteneri" }) });
    const ava = section.getByRole("link", { name: /AVA Art & Soul/ });
    await expect(ava).toHaveAttribute("href", IG);
    await expect(ava).toHaveAttribute("target", "_blank");
    await expect(ava).toHaveAttribute("rel", /noopener/);
    await expect(ava).toContainText("@ava.art.soul");
    // no description or logo yet: a painted initial and an honest line
    await expect(ava).toContainText("Descriere în curând");
    await expect(ava.locator("img")).toHaveCount(0);
    await expect(section.getByRole("link", { name: "Vrei să fim parteneri? Scrie-mi" })).toHaveAttribute("href", "/contact?subiect=comunitate");
  });

  test("the close: „Vreau să aflu primul” → Instagram, „Propune un proiect” → contact", async ({ page }) => {
    await page.goto("/comunitate");
    await expect(page.locator("main")).toContainText("Bine ai venit în Comunitate cu sens!");
    const cta = page.locator("section", { has: page.getByRole("heading", { level: 2, name: "Vreau să aflu primul" }) });
    const follow = cta.getByRole("link", { name: "Urmărește pe Instagram" });
    await expect(follow).toHaveAttribute("href", /instagram\.com/);
    await expect(follow).toHaveAttribute("target", "_blank");
    await expect(cta.getByRole("link", { name: "Propune un proiect" })).toHaveAttribute("href", "/contact?subiect=comunitate");
    await page.goto("/en/community");
    await expect(page.getByRole("link", { name: "Suggest a project" })).toHaveAttribute("href", "/en/contact?subiect=comunitate");
  });

  test("metadata, breadcrumb, card; nothing scrolls sideways", async ({ page, request }) => {
    for (const [path, title] of [["/comunitate", "Comunitate cu sens · Ramona Nichifor"], ["/en/community", "Community with meaning · Ramona Nichifor"]] as const) {
      await page.goto(path);
      await expect(page).toHaveTitle(title);
      const desc = await page.locator('meta[name="description"]').getAttribute("content");
      expect(desc!.length).toBeGreaterThan(60);
      expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toMatch(new RegExp(`${path}$`));
      await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(3);
      const og = await page.locator('meta[property="og:image"]').getAttribute("content");
      expect((await request.get(new URL(og!).pathname + new URL(og!).search)).status()).toBe(200);
      expect(await hasSideScroll(page)).toBe(false);
      expect((await jsonLd(page)).some((d) => d["@type"] === "BreadcrumbList")).toBe(true);
    }
    await page.setViewportSize({ width: 320, height: 700 });
    await page.goto("/comunitate");
    expect(await hasSideScroll(page)).toBe(false);
  });

  test("the two pages have different descriptions", async ({ page }) => {
    const get = async (p: string) => {
      await page.goto(p);
      return page.locator('meta[name="description"]').getAttribute("content");
    };
    const [a, b, c, d] = [await get("/despre"), await get("/comunitate"), await get("/en/about"), await get("/en/community")];
    expect(new Set([a, b, c, d]).size).toBe(4);
  });
});
