import { expect, hasSideScroll, test } from "./fixtures";

// Consiliere (spec §5.6). Booking itself is M4: #programare is an honest placeholder (BookingSoon).
// Seeded content (npm run seed): sessions 60/90/120 min · 25/40/50 €, five steps, four FAQ questions.

const WA = "https://wa.me/40730775132";

test.describe("/consiliere", () => {
  test("hero: the tagline and both session formats with the prices from the CMS", async ({ page }) => {
    await page.goto("/consiliere");
    await expect(page.locator("h1")).toHaveText("Consiliere");
    await expect(page.getByText("Un spațiu liniștit în care să te asculți.", { exact: true })).toBeVisible();
    const formats = page.locator("main > section").first().locator("ul > li");
    await expect(formats).toHaveCount(2);
    await expect(formats.nth(0)).toContainText("Online");
    await expect(formats.nth(1)).toContainText("Față în față");
    for (const li of await formats.all()) {
      await expect(li).toContainText("60 min · 25 €");
      await expect(li).toContainText("90 min · 40 €");
      await expect(li).toContainText("120 min · 50 €");
    }
    expect(await hasSideScroll(page)).toBe(false);
  });

  test("the primary button „Programează o ședință” glides to #programare, WhatsApp is the secondary link", async ({ page }) => {
    await page.goto("/consiliere");
    const hero = page.locator("main > section").first();
    const primary = hero.getByRole("link", { name: "Programează o ședință" });
    await expect(primary).toHaveAttribute("href", "#programare");
    const wa = hero.getByRole("link", { name: "Scrie-mi pe WhatsApp" });
    await expect(wa).toHaveAttribute("href", WA);
    // the primary comes first (it is the page's one main action)
    const order = await hero.locator("a").evaluateAll((as) => as.map((a) => a.textContent?.trim()));
    expect(order.indexOf("Programează o ședință")).toBeLessThan(order.indexOf("Scrie-mi pe WhatsApp"));

    await page.waitForLoadState("networkidle");
    await primary.click();
    await expect(page).toHaveURL(/\/consiliere#programare$/);
    // it moved down to the section and stopped under the header
    await expect
      .poll(() => page.evaluate(() => Math.round(document.getElementById("programare")!.getBoundingClientRect().top)), { timeout: 5000 })
      .toBeLessThan(200);
    expect(await page.evaluate(() => scrollY)).toBeGreaterThan(500);
  });

  test("no manifesto on this page (it lives on the home)", async ({ page }) => {
    await page.goto("/consiliere");
    await expect(page.locator("blockquote")).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText("Între rațiune și intuiție");
    await page.goto("/en/counselling");
    await expect(page.locator("main")).not.toContainText("Between reason and intuition");
  });

  test("the sections come in order: patterns, right for you, how it goes (an <ol>), #programare, FAQ", async ({ page }) => {
    await page.goto("/consiliere");
    const y = (loc: ReturnType<typeof page.locator>) => loc.first().evaluate((el) => el.getBoundingClientRect().top + scrollY);
    const patterns = page.getByRole("heading", { level: 2, name: "Ce se repetă în viața ta?" });
    const right = page.getByRole("heading", { level: 2, name: "Cum știi dacă este pentru tine?" });
    const steps = page.getByRole("heading", { level: 2, name: "Cum decurge" });
    const booking = page.locator("section#programare");
    const faq = page.getByRole("heading", { level: 2, name: "Întrebări frecvente" });
    const ys = [await y(patterns), await y(right), await y(steps), await y(booking), await y(faq)];
    expect(ys).toEqual([...ys].sort((a, b) => a - b));
    expect(new Set(ys).size).toBe(5);
    // „Cum decurge” is an ordered list
    const list = page.locator("ol", { has: page.getByRole("heading", { level: 3, name: "Îmi scrii" }) });
    await expect(list.locator(":scope > li")).toHaveCount(4);
    await expect(list.locator(":scope > li").first()).toContainText("Îmi scrii");
    // the path from patterns to conscious choice is an ordered list too, in her order
    const path = page.getByRole("list", { name: "Drumul, pas cu pas" });
    await expect(path.locator(":scope > li")).toHaveText(["tipare", "nevoi", "credințe", "reacții automate", "conștientizare", "alegere conștientă"]);
  });

  test("Ramona's texts are all there, in her words", async ({ page }) => {
    await page.goto("/consiliere");
    const main = page.locator("main");
    await expect(main).toContainText("Unde te simți blocat?");
    await expect(main).toContainText("Te ghidez să faci această diferență importantă");
    await expect(main).toContainText("Înseamnă să te apropii de tine.");
    await expect(main).toContainText("Să faci alegeri care au sens pentru tine.");
    await expect(main).toContainText("Poți fi un rebel, care sfidează limitele și autoritatea.");
    await expect(main).toContainText("Primul pas e o conversație.");
  });

  test("#programare is an honest placeholder: online booking opens soon, WhatsApp and the free 15-minute call; no calendar, no form", async ({ page }) => {
    await page.goto("/consiliere");
    const sec = page.locator("section#programare");
    await expect(sec.getByRole("heading", { level: 2, name: "Programează o ședință" })).toBeVisible();
    await expect(sec).toContainText("În curând");
    await expect(sec).toContainText("Programările online se deschid în curând");
    await expect(sec).toContainText("15 min, telefonic");
    await expect(sec).toContainText("fără cost");
    await expect(sec.locator(`a[href="${WA}"]`).first()).toBeVisible();
    // nothing to book with yet
    await expect(sec.locator("form, input, select, textarea, table, [role=grid], [role=gridcell], button")).toHaveCount(0);
    await expect(sec).not.toContainText(/\b\d{1,2}:\d{2}\b/);
  });

  test("FAQ: native disclosure, one summary per question, the keyboard opens and closes it, answers stay in the HTML", async ({ page }) => {
    await page.goto("/consiliere");
    await page.waitForLoadState("networkidle");
    const items = page.locator(".faq details");
    await expect(items).toHaveCount(4);
    await expect(page.locator(".faq summary")).toHaveCount(4);
    // all answers are in the HTML while closed
    const answers = await items.evaluateAll((els) => els.map((el) => el.textContent ?? ""));
    expect(answers[0]).toContain("între 60 și 120 de minute");
    expect(answers[1]).toContain("25 €");
    await expect(items.first()).not.toHaveAttribute("open", "");

    const first = page.locator(".faq summary").first();
    await first.focus();
    await page.keyboard.press("Enter");
    await expect(items.first()).toHaveAttribute("open", "");
    await expect(page.getByText("între 60 și 120 de minute")).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(items.first()).not.toHaveAttribute("open", "");
    await page.keyboard.press("Space");
    await expect(items.first()).toHaveAttribute("open", "");
    // the next question is one Tab away and opens on its own
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await expect(items.nth(1)).toHaveAttribute("open", "");
    await expect(items.first()).toHaveAttribute("open", "");
  });

  test("JSON-LD: FAQPage with one Question per summary, answers as plain text; and the breadcrumb", async ({ page }) => {
    await page.goto("/consiliere");
    const all = await page.locator('script[type="application/ld+json"]').evaluateAll((els) => els.map((e) => JSON.parse(e.textContent!)));
    const faq = all.find((d) => d["@type"] === "FAQPage");
    const questions = await page.locator(".faq summary").count();
    expect(questions).toBe(4);
    expect(faq.mainEntity).toHaveLength(questions);
    expect(faq.mainEntity[0]).toMatchObject({ "@type": "Question", name: "Cât durează o ședință?", acceptedAnswer: { "@type": "Answer" } });
    for (const q of faq.mainEntity) {
      expect(q.acceptedAnswer.text).toMatch(/\S/);
      expect(q.acceptedAnswer.text).not.toMatch(/[<>]/);
    }
    expect(faq.mainEntity[1].acceptedAnswer.text).toContain("25 €");
    const crumbs = all.find((d) => d["@type"] === "BreadcrumbList");
    expect(crumbs.itemListElement.map((i: { name: string }) => i.name)).toEqual(["Acasă", "Consiliere"]);
  });

  test("metadata: title, description, canonical, hreflang, a 1200×630 OG card; indexing stays off on previews", async ({ page, request }) => {
    await page.goto("/consiliere");
    await expect(page).toHaveTitle("Consiliere · Ramona Nichifor");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{20,}/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/consiliere$/);
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", /\/en\/counselling$/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    const res = await request.get(new URL(og!).pathname + new URL(og!).search);
    expect(res.status()).toBe(200);
    const png = await res.body();
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
  });

  test("320px: no sideways scroll and no clipped heading", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    for (const path of ["/consiliere", "/en/counselling"]) {
      await page.goto(path);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      expect(await hasSideScroll(page), path).toBe(false);
      const clipped = await page.locator("main h1, main h2, main h3").evaluateAll((els) => els.filter((el) => el.scrollWidth > el.clientWidth + 1).map((el) => el.textContent));
      expect(clipped, path).toEqual([]);
    }
  });

  test("reduced motion: every text is on the page and visible, the lines and steps simply stand", async ({ browser, baseURL }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce", baseURL });
    const page = await ctx.newPage();
    await page.goto("/consiliere");
    for (const text of ["Unde te simți blocat?", "alegere conștientă", "Îmi scrii", "Cât durează o ședință?"]) {
      await expect(page.getByText(text).first()).toBeAttached();
      expect(await page.getByText(text).first().evaluate((el) => Number(getComputedStyle(el).opacity)), text).toBe(1);
    }
    expect(await page.getByRole("list", { name: "Drumul, pas cu pas" }).evaluate((el) => getComputedStyle(el.querySelector("li")!).opacity)).toBe("1");
    await ctx.close();
  });

  test("without JavaScript every text is in the page", async ({ browser, baseURL }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false, baseURL });
    const page = await ctx.newPage();
    await page.goto("/consiliere");
    await expect(page.locator("main")).toContainText("Unde te simți blocat?");
    await expect(page.locator("main")).toContainText("Îmi scrii");
    await expect(page.locator("#programare")).toContainText("Programările online se deschid în curând");
    await ctx.close();
  });
});

test.describe("/en/counselling", () => {
  test("English: title, tagline, prices, the placeholder, the FAQ", async ({ page }) => {
    await page.goto("/en/counselling");
    await expect(page.locator("h1")).toHaveText("Counselling");
    await expect(page.getByText("A quiet space to listen to yourself.", { exact: true })).toBeVisible();
    await expect(page.locator("main > section").first()).toContainText("60 min · 25 €");
    await expect(page.getByRole("heading", { level: 2, name: "What keeps repeating in your life?" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "How it goes" })).toBeVisible();
    const hero = page.locator("main > section").first();
    await expect(hero.getByRole("link", { name: "Book a session" })).toHaveAttribute("href", "#programare");
    await expect(hero.getByRole("link", { name: "Message me on WhatsApp" })).toHaveAttribute("href", WA);
    await expect(page.locator("section#programare")).toContainText("Online booking opens soon");
    await expect(page.locator(".faq summary")).toHaveCount(4);
    await expect(page).toHaveTitle("Counselling · Ramona Nichifor");
    expect(await hasSideScroll(page)).toBe(false);
  });
});
