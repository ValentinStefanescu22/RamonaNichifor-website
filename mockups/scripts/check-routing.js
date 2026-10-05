// Routing check: every page must open at its top. Run with playwright-cli against a served build:
//   npx vite preview --port 4173   (from mockups/)
//   cp scripts/frame-harness.html dist/__frame.html      (optional: also test inside a scrolling viewer frame)
//   playwright-cli open http://localhost:4173/            (desktop; or add --device="iPhone 15")
//   playwright-cli --raw run-code --filename=scripts/check-routing.js
// For each page it clicks every internal link once (from where the link sits, usually far down the
// page), then checks scrollY on the new page right after load and 1.2 s later. It also opens the phone
// menu, walks back/forward, and, if dist/__frame.html exists, repeats the footer links inside a viewer
// frame that scrolls itself (how the published artifact wraps the pages).
async (page) => {
  const base = new URL(page.url()).origin + "/";
  const pages = ["index.html", "despre.html", "consiliere.html", "carti.html", "carte.html", "carte.html#buburuza", "arta.html", "universuri.html", "comunitate.html", "contact.html", "produs.html#fluture-semn"];
  const fails = [];
  let checks = 0;
  const settle = (ms) => page.waitForTimeout(ms);
  const y = () => page.evaluate(() => Math.round(window.scrollY));

  const internal = () =>
    page.evaluate(() => {
      const seen = new Set();
      return [...document.querySelectorAll("a[href]")]
        .filter((a) => {
          const h = a.getAttribute("href");
          if (!h || /^(https?:|mailto:|tel:|#)/.test(h)) return false;
          const r = a.getBoundingClientRect();
          if (r.width === 0 || r.height === 0 || getComputedStyle(a).visibility === "hidden") return false;
          if (seen.has(h)) return false;
          seen.add(h);
          return true;
        })
        .map((a) => a.getAttribute("href"));
    });

  async function expectTop(label) {
    checks++;
    await settle(150); // a same-document hash change (another book) is handled one task after the click
    const y0 = await y();
    await settle(1200);
    const y1 = await y();
    if (y0 !== 0 || y1 !== 0) fails.push(`${label}: scrollY ${y0} → ${y1}`);
  }

  async function follow(from, href, label) {
    await page.goto(base + from);
    await settle(500);
    const link = page.locator(`a[href="${href}"]:visible`).first();
    await link.scrollIntoViewIfNeeded();
    await settle(150);
    const before = await y();
    await link.click();
    await page.waitForLoadState("load");
    await expectTop(`${label} ${from} → ${href} (clicked at y=${before})`);
  }

  // 1. every internal link on every page
  for (const from of pages) {
    await page.goto(base + from);
    await settle(700);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));
    await settle(500); // lets the floating bar in, so its links are counted too
    for (const href of await internal()) await follow(from, href, "link");
  }

  // 2. the phone menu (only where the burger is shown)
  const burger = page.getByRole("button", { name: /Meniu|Menu/ }).first();
  await page.goto(base + "contact.html");
  await settle(500);
  if (await burger.isVisible()) {
    const items = await page.evaluate(() => [...document.querySelectorAll('footer a[href$=".html"]')].map((a) => a.getAttribute("href")));
    for (const href of items) {
      await page.goto(base + "comunitate.html");
      await settle(400);
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await settle(500);
      await page.getByRole("button", { name: /Meniu|Menu/ }).first().click();
      await settle(800);
      await page.locator(`[role=dialog] a[href="${href}"]`).click();
      await page.waitForLoadState("load");
      await expectTop(`menu comunitate → ${href}`);
    }
  }

  // 3. back and forward land at the top as well
  await page.goto(base + "carti.html");
  await settle(500);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await settle(300);
  await page.locator('footer a[href="arta.html"]').click();
  await page.waitForLoadState("load");
  await settle(300);
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.goBack();
  await page.waitForLoadState("load");
  await expectTop("back arta → carti");
  await page.goForward();
  await page.waitForLoadState("load");
  await expectTop("forward carti → arta");

  // 4. inside a viewer frame that scrolls itself (the artifact's situation)
  const harness = await page.request.get(base + "__frame.html");
  if (harness.ok()) {
    for (const from of ["carti.html", "despre.html", "comunitate.html", "arta.html"]) {
      await page.goto(base + "__frame.html");
      await page.evaluate((src) => (document.getElementById("f").src = src), from);
      await settle(1500);
      const frame = page.frames().find((f) => f.url().endsWith(from));
      const hrefs = await frame.evaluate(() => [...document.querySelectorAll('footer a[href$=".html"]')].map((a) => a.getAttribute("href")));
      for (const href of hrefs) {
        await page.goto(base + "__frame.html");
        await page.evaluate((src) => (document.getElementById("f").src = src), from);
        await settle(1200);
        const fr = page.frames().find((f) => f.url().endsWith(from));
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await settle(300);
        await fr.locator(`footer a[href="${href}"]`).click();
        await settle(1800);
        checks++;
        const frameTop = await page.evaluate(() => Math.round(document.getElementById("f").getBoundingClientRect().top));
        // the page's own top must be on screen: the frame's top edge sits at or just below the viewer's top
        if (frameTop < -2 || frameTop > 80) fails.push(`frame ${from} → ${href}: page top at ${frameTop}px`);
      }
    }
  }

  return `${checks} checks, ${fails.length} failures${fails.length ? "\n" + fails.join("\n") : ""}`;
}
