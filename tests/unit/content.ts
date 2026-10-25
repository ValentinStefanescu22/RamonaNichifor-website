/**
 * The content getters against the seeded local database (run `npm run seed` first).
 * Run with `npx payload run tests/unit/content.ts` (part of `npm run test:unit`); exits 1 on failure.
 */
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { counsellingPage } from "../../content/pages-data";

// The getters are server-only and read Next's draft mode; outside a request neither exists, so stub both (published content, as for a visitor)
registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "server-only") return { url: "data:text/javascript,", shortCircuit: true };
    if (specifier === "next/headers") return { url: "data:text/javascript,export const draftMode = async () => ({ isEnabled: false })", shortCircuit: true };
    return next(specifier, context);
  },
});
const c = await import("../../content");

// The mockup's invented artworks (content-pages.ts, after its "PLACEHOLDER" banner): none of them may reach Payload.
// „Poiana fluturelui” is not among them: the real cover illustration with that title comes from the M2 seed.
const mockupPlaceholders = [
  "Lumină de dimineață", "Morning light", "Ploaie de lavandă", "Lavender rain", "Liniștea dinaintea zborului", "The quiet before flight",
  "Grădina bunicii", "Grandma's garden", "Norul timid", "The shy cloud", "Poiana la apus", "Meadow at dusk",
];

const checks: [string, () => Promise<void>][] = [
  ["a universe has its book and its four keepsakes, in shop order", async () => {
    const u = await c.getUniverse("ro", "fluturele");
    assert.ok(u);
    assert.equal(u.books.length, 1);
    assert.deepEqual(u.products.map((p) => p.kind), ["semn-de-carte", "carti-de-joc", "puzzle", "joc-de-familie"]);
    assert.equal(u.products[0].image !== null && u.products[2].image === null, true, "bookmark has photos, puzzle has none yet");
  }],
  ["every universe has four products, none twice", async () => {
    for (const slug of ["fluturele", "buburuza", "tantarul", "musca"]) assert.equal((await c.getUniverse("ro", slug))?.products.length, 4, slug);
  }],
  ["a product opens under its universe, in both languages", async () => {
    const p = await c.getProduct("en", "butterfly", "bookmark");
    assert.ok(p);
    assert.equal(p.images.length, 9);
    assert.equal(p.gallery, "bookmarks");
    assert.equal(p.universe.slug, "butterfly");
    assert.deepEqual(p.specs.map((s) => s.value), ["9 designs", "6 × 17 cm"]);
    assert.equal((await c.getProduct("ro", "fluturele", "carti-de-joc"))?.gallery, "cards");
    assert.equal((await c.getProduct("ro", "buburuza", "semn-de-carte"))?.images.length, 0);
    assert.equal(await c.getProduct("ro", "buburuza", "nu-exista"), null);
  }],
  ["the same product slug under another universe is another product", async () => {
    const a = await c.getProduct("ro", "fluturele", "puzzle");
    const b = await c.getProduct("ro", "buburuza", "puzzle");
    assert.ok(a && b);
    assert.notEqual(a.universe.slug, b.universe.slug);
  }],
  ["a book's Răsfoiește starts with the back cover", async () => {
    const b = await c.getBook("ro", "fluturele-dansator-de-step");
    assert.ok(b);
    assert.match(b.leafPages[0].alt, /coperta spate/i);
    assert.equal(b.leafPages.length, 3);
    assert.equal(b.pages, 40);
    assert.ok(b.blurbRich);
    assert.equal((await c.getBooks("ro")).length >= 2, true);
  }],
  ["artworks keep only the real ones (no mockup placeholder)", async () => {
    const titles = (await c.getArtworks("ro")).map((a) => a.title).concat((await c.getArtworks("en")).map((a) => a.title));
    for (const t of mockupPlaceholders) assert.ok(!titles.includes(t), `placeholder "${t}" was seeded`);
    assert.ok(titles.includes("Poiana fluturelui"));
    const a = await c.getArtwork("ro", "poiana-fluturelui");
    assert.equal(a?.price, null);
  }],
  ["counselling carries Ramona's patterns, prices, steps and FAQ", async () => {
    const x = await c.getCounselling("en");
    assert.equal(x.patterns.questions.length, counsellingPage.patterns.questions.length);
    assert.equal(x.patterns.questions.length, 5);
    assert.equal(x.patterns.reactions.length, 7);
    assert.equal(x.patterns.path.length, 6);
    assert.deepEqual(x.sessions, [{ minutes: 60, priceEur: 25 }, { minutes: 90, priceEur: 40 }, { minutes: 120, priceEur: 50 }]);
    assert.equal(x.steps.length, 4);
    assert.equal(x.faq.length, 4);
    assert.ok(x.faq[0].answer);
    assert.equal(x.rightForYou.maybe.length, 4);
    assert.equal(x.ctaTitle, counsellingPage.ctaTitle.en);
    assert.equal(x.teaserTitle.length > 0 && x.formats.length === 2, true, "the M2 teaser survives");
  }],
  ["about: four movements, her question and closing beats, three crafts", async () => {
    const a = await c.getAbout("ro");
    assert.equal(a.story.length, 4);
    assert.equal(a.story.flat().filter((b) => b.kind === "question").length, 1);
    assert.equal(a.story[3][0].kind, "closing");
    assert.equal(a.crafts.items.length, 3);
    assert.deepEqual(a.crafts.items.map((i) => i.href), ["/carti", "/arta", "/consiliere"]);
    assert.ok(a.portrait);
    assert.match((await c.getAbout("en")).story[0][2].text, /\n\n/, "EN keeps her paragraph breaks");
  }],
  ["books page, contact page and community page", async () => {
    const b = await c.getBooksPage("ro");
    assert.equal(b.author.paragraphs.length, 4);
    assert.deepEqual(b.author.formats.map((f) => f.status), ["soon", "planned"]);
    assert.equal((await c.getContactPage("en")).tagline.length > 0, true);
    const m = await c.getCommunity("ro");
    assert.equal(m.events.length, 4);
    assert.ok(m.events.every((e) => e.startsAt === null), "no invented dates");
    assert.equal(m.partners.length, 1);
    assert.equal(m.partners[0].name, "AVA Art & Soul");
    assert.equal(m.partners[0].logo, null);
    assert.equal(m.partnersLead.length, 2);
    assert.equal(m.projects.length, 0);
  }],
  ["legal pages are clearly marked as drafts", async () => {
    const p = await c.getLegal("ro", "privacy");
    assert.ok(p?.body);
    assert.match(JSON.stringify(p.body), /Text în lucru, de aprobat de Ramona\./);
    assert.match(JSON.stringify((await c.getLegal("en", "terms"))?.body), /Text in progress, to be approved by Ramona\./);
  }],
  ["slug pairs map every locale, products included", async () => {
    assert.ok((await c.getSlugPairs("products")).some((p) => p.ro === "semn-de-carte" && p.en === "bookmark"));
    assert.ok((await c.getSlugPairs("universes")).some((p) => p.ro === "fluturele" && p.en === "butterfly"));
    assert.ok((await c.getSlugPairs("books")).some((p) => p.en === "the-tap-dancing-butterfly"));
    assert.ok((await c.getSlugPairs("artworks")).some((p) => p.ro === "poiana-fluturelui"));
    const paths = await c.getProductPaths();
    assert.equal(paths.length, 16);
    assert.ok(paths.some((p) => p.universe.en === "butterfly" && p.product.en === "playing-cards"));
  }],
  ["an EN slug not yet translated still opens (looked up in RO)", async () => {
    // simulates the fallback by asking the EN getter for the RO slug of a doc whose EN slug differs: it must not 404 silently into a blank
    assert.equal((await c.getUniverse("en", "butterfly"))?.name, "The Butterfly Universe");
    assert.equal((await c.getUniverse("en", "fluturele"))?.name, "The Butterfly Universe");
    assert.equal(await c.getUniverse("en", "nu-exista"), null);
  }],
];

let failed = 0;
for (const [name, run] of checks) {
  try {
    await run();
    console.log(`✔ ${name}`);
  } catch (err) {
    failed++;
    console.error(`✖ ${name}\n`, err);
  }
}
console.log(failed ? `${failed} of ${checks.length} failed` : `all ${checks.length} passed`);
process.exit(failed ? 1 : 0);
