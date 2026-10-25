import { readdirSync, readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import type { Page } from "@playwright/test";
import { allow404, expect, hasSideScroll, test } from "./fixtures";

// Contact (spec §5.8), the legal pages and the 404 (§5.9). The form's rules are pinned in tests/unit/contact.test.ts; here the
// page itself. Locally the server runs with CONTACT_TRANSPORT=log and Turnstile's always-pass test keys (playwright.config.ts).
// Every valid send uses its own x-forwarded-for, so the 5-per-10-minutes limit never trips across projects and reruns.

const TEST_SITEKEY = "1x00000000000000000000AA";
const remote = !!process.env.BASE_URL; // the preview: real Resend and real Turnstile, so nothing is ever sent from here

/** The page has hydrated: the send button is enabled */
async function open(page: Page, path = "/contact") {
  await page.goto(path);
  await expect(page.getByRole("button", { name: /Trimite mesajul|Send message/ })).toBeEnabled();
}

async function fill(page: Page, message: string) {
  await page.getByLabel("Numele tău").fill("Ana Pop");
  await page.getByLabel("Adresa de email").fill("ana@example.com");
  await page.getByRole("radio", { name: "O carte" }).check();
  await page.getByLabel("Mesajul tău").fill(message);
  await page.getByRole("checkbox").check();
}

test.describe("/contact", () => {
  test("h1, her tagline, every field labelled; the consent links to the privacy page", async ({ page }) => {
    await open(page);
    await expect(page.locator("h1")).toHaveText("Contact");
    await expect(page.locator("main")).toContainText("Îmi poți scrie despre o carte, o lucrare, o ședință sau o întâlnire.");
    for (const label of ["Numele tău", "Adresa de email", "Mesajul tău"]) await expect(page.getByLabel(label)).toBeVisible();
    await expect(page.getByRole("group", { name: "Despre ce vrei să vorbim?" }).getByRole("radio")).toHaveCount(5);
    await expect(page.getByRole("radio", { name: "Altceva" })).toBeChecked();
    const consent = page.getByRole("checkbox", { name: /Am cel puțin 16 ani și sunt de acord ca Ramona să folosească aceste date doar pentru a-mi răspunde\./ });
    await expect(consent).toBeVisible();
    await expect(page.getByRole("link", { name: "aceste date" })).toHaveAttribute("href", "/confidentialitate");
    // the honeypot is out of sight and out of the tab order
    const trap = page.locator('input[name="website"]');
    await expect(trap).toHaveAttribute("tabindex", "-1");
    expect((await trap.boundingBox())!.x).toBeLessThan(-1000);

    await open(page, "/en/contact");
    await expect(page.getByLabel("Your name")).toBeVisible();
    await expect(page.getByRole("link", { name: "these details" })).toHaveAttribute("href", "/en/privacy");
  });

  test("?subiect=arta&lucrare=… (the artwork page's link) preselects Artă and starts the message", async ({ page }) => {
    await open(page, "/contact?subiect=arta&lucrare=Poiana+fluturelui");
    await expect(page.getByRole("radio", { name: "Artă" })).toBeChecked();
    await expect(page.getByLabel("Mesajul tău")).toHaveValue("Bună, Ramona! Aș vrea să aflu mai multe despre lucrarea „Poiana fluturelui”.");
    await open(page, "/en/contact?subiect=comunitate");
    await expect(page.getByRole("radio", { name: "Community" })).toBeChecked();
    await expect(page.getByLabel("Your message")).toHaveValue("");
    await open(page, "/contact?subiect=nimic");
    await expect(page.getByRole("radio", { name: "Altceva" })).toBeChecked();
  });

  test("an empty send shows the inline errors and focuses the first field; they clear as they are fixed", async ({ page }) => {
    await open(page);
    await page.getByRole("button", { name: "Trimite mesajul" }).click();
    await expect(page.locator("form").getByRole("alert")).toHaveText("Mai sunt câteva câmpuri de completat.");
    await expect(page.getByLabel("Numele tău")).toBeFocused();
    const form = page.locator("form");
    for (const e of ["Scrie-mi cum te numești.", "Adresa de email pare incompletă.", "Scrie câteva cuvinte", "Bifează confirmarea"]) await expect(form).toContainText(e);
    await expect(page.getByLabel("Numele tău")).toHaveAttribute("aria-invalid", "true");
    await page.getByLabel("Numele tău").fill("Ana");
    await expect(form).not.toContainText("Scrie-mi cum te numești.");
    await expect(page.getByLabel("Numele tău")).not.toHaveAttribute("aria-invalid");
    await page.getByLabel("Adresa de email").fill("ana@");
    await page.getByRole("button", { name: "Trimite mesajul" }).click();
    await expect(page.getByLabel("Adresa de email")).toBeFocused();
  });

  test("an address the server would refuse (a trailing comma) is caught inline, before sending", async ({ page }) => {
    await open(page);
    await fill(page, "Bună!");
    await page.getByLabel("Adresa de email").fill("ana@gmail.com,");
    await page.getByRole("button", { name: "Trimite mesajul" }).click();
    await expect(page.getByLabel("Adresa de email")).toBeFocused();
    await expect(page.getByLabel("Adresa de email")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("form")).toContainText("Adresa de email pare incompletă.");
    await expect(page.locator("form").getByRole("alert")).toHaveText("Mai sunt câteva câmpuri de completat.");
  });

  test("an error only the server finds shows inline like any other, and clears once the field changes", async ({ page }) => {
    test.skip(remote, "needs the local test keys for the token");
    await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.${[0, 0, 0].map(() => Math.floor(Math.random() * 250)).join(".")}` });
    await open(page);
    await fill(page, "Bună!");
    // a name made only of a bidi override: the form lets it through, the server strips it to nothing
    await page.getByLabel("Numele tău").fill("\u202E");
    await page.waitForTimeout(3_200);
    await page.getByRole("button", { name: "Trimite mesajul" }).click();
    const name = page.getByLabel("Numele tău");
    await expect(name).toHaveAttribute("aria-invalid", "true", { timeout: 20_000 });
    await expect(name).toBeFocused();
    await expect(page.locator("form")).toContainText("Scrie-mi cum te numești.");
    await expect(page.locator("form").getByRole("alert")).toHaveText("Mai sunt câteva câmpuri de completat.");
    await name.fill("Ana Pop");
    await expect(name).not.toHaveAttribute("aria-invalid");
    await expect(page.locator("form")).not.toContainText("Scrie-mi cum te numești.");
  });

  test("metadata: „Contact · Ramona Nichifor”, a self canonical, its own description", async ({ page }) => {
    for (const path of ["/contact", "/en/contact"]) {
      await page.goto(path);
      await expect(page).toHaveTitle("Contact · Ramona Nichifor");
      expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toMatch(new RegExp(`${path}$`));
      expect(await page.locator('meta[name="description"]').getAttribute("content")).toMatch(path.startsWith("/en") ? /^Write to Ramona Nichifor/ : /^Scrie-i Ramonei Nichifor/);
    }
  });

  test("a valid message shows the designed thank-you note, and the mail goes out escaped", async ({ page }) => {
    test.skip(remote, "never sends a real email from the preview");
    await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.${[0, 0, 0].map(() => Math.floor(Math.random() * 250)).join(".")}` });
    await open(page);
    await expect(page.locator(`[data-sitekey="${TEST_SITEKEY}"]`), "the local server runs with the test keys").toHaveCount(1);
    const id = randomUUID();
    await fill(page, `Bună! <b>${id}</b>`);
    await page.waitForTimeout(3_200); // the time trap: a person takes more than 3 s
    await page.getByRole("button", { name: "Trimite mesajul" }).click();
    const note = page.getByRole("heading", { level: 2, name: "Mulțumesc!" });
    await expect(note).toBeVisible({ timeout: 20_000 });
    await expect(note).toBeFocused();
    await expect(page.locator("main")).toContainText("Mesajul tău a ajuns la mine.");
    // the logged mail (CONTACT_TRANSPORT=log): one, escaped, Ramona's subject line, replying to the sender
    const mails = readdirSync("reports/mail").map((f) => JSON.parse(readFileSync(`reports/mail/${f}`, "utf8"))).filter((m) => m.html.includes(id));
    expect(mails).toHaveLength(1);
    expect(mails[0]).toMatchObject({ subject: "[Site] Carte · Ana Pop", replyTo: "ana@example.com" });
    expect(mails[0].html).toContain(`&lt;b&gt;${id}&lt;/b&gt;`);
    // „Scrie alt mesaj” opens the form again with the name kept and the message empty
    await page.getByRole("button", { name: "Scrie alt mesaj" }).click();
    await expect(page.getByLabel("Numele tău")).toHaveValue("Ana Pop");
    await expect(page.getByLabel("Mesajul tău")).toHaveValue("");
  });

  test("when the send fails, the error says what to do and the visitor's text survives", async ({ page, errors }) => {
    await open(page);
    await page.route("**/contact", (r) => (r.request().method() === "POST" ? r.abort() : r.continue()));
    await fill(page, "Textul meu, scris cu grijă.");
    await page.getByRole("button", { name: "Trimite mesajul" }).click();
    await expect(page.locator('[data-status="failed"]')).toContainText("Mesajul nu a plecat.");
    await expect(page.locator('[data-status="failed"]')).toContainText("scrie-mi direct pe email");
    await expect(page.getByLabel("Mesajul tău")).toHaveValue("Textul meu, scris cu grijă.");
    await expect(page.getByLabel("Numele tău")).toHaveValue("Ana Pop");
    // the aborted request is the point of this test, not an error
    for (let i = errors.length - 1; i >= 0; i--) if (/ERR_FAILED|Load failed|Failed to fetch|cancelled/i.test(errors[i])) errors.splice(i, 1);
  });

  test("the email is selectable text with a copy button; WhatsApp, Instagram and Facebook are there", async ({ page }) => {
    await open(page);
    const main = page.locator("main");
    const email = main.locator(".select-all");
    await expect(email).toHaveText(/@/);
    await expect(main.getByRole("button", { name: "Copiază" })).toBeVisible();
    for (const [name, href] of [["WhatsApp", /wa\.me|whatsapp/], ["Instagram", /instagram\.com/], ["Facebook", /facebook\.com/]] as const)
      await expect(main.getByRole("link", { name: new RegExp(name) })).toHaveAttribute("href", href);
  });

  test("320 px: no side scroll", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    for (const path of ["/contact", "/en/contact", "/confidentialitate", "/en/privacy", "/termeni", "/en/terms"]) {
      await page.goto(path);
      expect(await hasSideScroll(page), path).toBe(false);
    }
  });
});

test.describe("legal pages", () => {
  for (const [path, h1, text] of [
    ["/confidentialitate", "Confidențialitate", "Text în lucru, de aprobat de Ramona."],
    ["/termeni", "Termeni", "Text în lucru, de aprobat de Ramona."],
    ["/en/privacy", "Privacy", "Text in progress, to be approved by Ramona."],
    ["/en/terms", "Terms", "Text in progress, to be approved by Ramona."],
  ] as const)
    test(`${path}: h1 „${h1}” and the CMS text`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("h1")).toHaveText(h1);
      await expect(page.locator("main")).toContainText(text);
      await expect(page).toHaveTitle(`${h1} · Ramona Nichifor`);
      expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toMatch(new RegExp(`${path}$`));
      // no date was set in the CMS, so none is shown (tests/cms.spec.ts sets one)
      await expect(page.locator("main time")).toHaveCount(0);
    });
});

test.describe("404", () => {
  for (const [path, title, home, universes] of [
    ["/nu-exista", "Pagina asta s-a rătăcit, ca Musca", "Înapoi acasă", "Vezi universurile"],
    ["/en/nope", "This page wandered off, like the Fly", "Back home", "See the universes"],
  ] as const)
    test(`${path} answers 404 with Musca and the way back`, async ({ page, errors }) => {
      expect((await page.goto(path))?.status()).toBe(404);
      await expect(page.locator("h1")).toHaveText(title);
      const main = page.locator("main");
      await expect(main.getByRole("link", { name: home })).toHaveAttribute("href", path.startsWith("/en") ? "/en" : "/");
      await expect(main.getByRole("link", { name: universes })).toHaveAttribute("href", path.startsWith("/en") ? "/en/universes" : "/universuri");
      allow404(errors);
    });
});
