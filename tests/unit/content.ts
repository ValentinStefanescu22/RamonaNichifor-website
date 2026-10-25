/**
 * The content getters against the seeded local database (run `npm run seed` first).
 * Run with `npx payload run tests/unit/content.ts` (part of `npm run test:unit`); exits 1 on failure.
 */
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { getPayload } from "payload";
import config from "@payload-config";
import { getPathname } from "../../i18n/navigation";
import { localizeDynamicPath } from "../../lib/routes";
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
  ["a never-published doc is in no slug list (sitemap, language switch, static params)", async () => {
    const payload = await getPayload({ config });
    const universe = (await payload.find({ collection: "universes", limit: 1, depth: 0 })).docs[0];
    const made: { collection: "universes" | "products"; id: number }[] = [];
    try {
      // draft: true skips required-field validation and saves _status "draft"; neither doc was ever published
      const u = await payload.create({ collection: "universes", draft: true, data: { slug: "unit-draft-universe" } as never });
      made.push({ collection: "universes", id: u.id });
      const pr = await payload.create({ collection: "products", draft: true, data: { slug: "unit-draft-product", universe: universe.id } as never });
      made.push({ collection: "products", id: pr.id });
      assert.ok(!(await c.getSlugPairs("universes")).some((x) => x.ro === "unit-draft-universe"));
      assert.ok(!(await c.getSlugPairs("products")).some((x) => x.ro === "unit-draft-product"));
      assert.ok(!(await c.getSlugDocs("universes")).some((x) => x.pair.ro === "unit-draft-universe"));
      assert.ok(!(await c.getProductPaths()).some((x) => x.product.ro === "unit-draft-product"));
      // nor is it served: its page 404s, and the map of worlds leaves it out
      assert.equal(await c.getUniverse("ro", "unit-draft-universe"), null);
      assert.equal(await c.getProduct("ro", universe.slug, "unit-draft-product"), null);
      assert.ok(!(await c.getUniverses("ro")).some((x) => x.slug === "unit-draft-universe"));
    } finally {
      for (const d of made) await payload.delete({ collection: d.collection, id: d.id });
    }
  }],
  ["a never-published book, artwork, event, project or partner is on no public list; a product under an unpublished universe is not in the sitemap paths", async () => {
    const payload = await getPayload({ config });
    const made: { collection: "books" | "artworks" | "events" | "projects" | "partners" | "universes" | "products"; id: number }[] = [];
    const draft = async (collection: (typeof made)[number]["collection"], data: Record<string, unknown>) => {
      const d = await payload.create({ collection, draft: true, locale: "ro", data: data as never });
      made.push({ collection, id: d.id });
      return d;
    };
    try {
      await draft("books", { title: "Carte nepublicată", slug: "unit-draft-book" });
      await draft("artworks", { title: "Pictură nepublicată", slug: "unit-draft-art" });
      await draft("events", { title: "Eveniment nepublicat", kind: "lansare" });
      await draft("projects", { title: "Proiect nepublicat" });
      await draft("partners", { name: "Partener nepublicat" });
      assert.ok(!(await c.getBooks("ro")).some((b) => b.slug === "unit-draft-book"), "book");
      assert.ok(!(await c.getArtworks("ro")).some((a) => a.slug === "unit-draft-art"), "artwork");
      const community = await c.getCommunity("ro");
      assert.ok(!community.events.some((e) => e.title === "Eveniment nepublicat"), "event");
      assert.ok(!community.projects.some((p) => p.title === "Proiect nepublicat"), "project");
      assert.ok(!community.partners.some((p) => p.name === "Partener nepublicat"), "partner");
      // a published product whose universe was never published: no sitemap route (its page 404s)
      const u = await draft("universes", { slug: "unit-draft-universe-2", name: "U", bookTitle: "B", hook: "h" });
      const pr = await payload.create({ collection: "products", locale: "ro", data: { slug: "unit-pub-product", kind: "puzzle", name: "P", universe: u.id, _status: "published" } as never, context: { seeding: true } });
      made.push({ collection: "products", id: pr.id });
      assert.ok(!(await c.getProductPaths()).some((x) => x.product.ro === "unit-pub-product"));
    } finally {
      for (const d of made.reverse()) await payload.delete({ collection: d.collection, id: d.id });
    }
  }],
  ["an orphaned or url-less image is dropped, not a render error (artwork, book leaf pages)", async () => {
    const payload = await getPayload({ config });
    const sharp = (await import("sharp")).default;
    const data = await sharp({ create: { width: 40, height: 40, channels: 3, background: "#d8c4a0" } }).jpeg().toBuffer();
    const file = { data, mimetype: "image/jpeg", name: "unit-orphan.jpg", size: data.length };
    const ctx = { skipStamp: true, seeding: true };
    const m = await payload.create({ collection: "media", data: { alt: "x" }, file, context: ctx });
    const a = await payload.create({ collection: "artworks", locale: "ro", context: ctx, data: { title: "Cu poză orfană", slug: "unit-orphan-art", kind: "original", availability: "preorder", images: [m.id], _status: "published" } as never });
    try {
      // the media row loses its url (as when its file was removed): the artwork still renders, with no picture
      await (payload.db as unknown as { pool: { query: (q: string, v: unknown[]) => Promise<unknown> } }).pool.query("update media set filename = null, url = null where id = $1", [m.id]);
      const art = (await c.getArtworks("ro")).find((x) => x.slug === "unit-orphan-art");
      assert.ok(art, "artwork still listed");
      assert.deepEqual(art.images, []);
      assert.equal((await c.getArtwork("ro", "unit-orphan-art"))?.images.length, 0);
    } finally {
      await payload.delete({ collection: "artworks", id: a.id });
      await payload.delete({ collection: "media", id: m.id });
    }
  }],
  ["Live Preview opens the page a document shows on (page globals, community docs, legal pages, a product with only a universe id)", async () => {
    const payload = await getPayload({ config });
    const url = payload.config.admin.livePreview.url as unknown as (a: unknown) => Promise<string>;
    const open = async (a: Record<string, unknown>) => new URL(await url({ locale: { code: "ro" }, ...a, req: { origin: "http://x", payload } })).searchParams.get("path");
    const universe = (await payload.find({ collection: "universes", where: { slug: { equals: "fluturele" } }, locale: "ro", limit: 1, depth: 0 })).docs[0];
    assert.equal(await open({ globalConfig: { slug: "counselling-page" }, data: {} }), "/consiliere");
    assert.equal(await open({ globalConfig: { slug: "about-page" }, data: {}, locale: { code: "en" } }), "/en/about");
    assert.equal(await open({ collectionConfig: { slug: "events" }, data: { id: 1 } }), "/comunitate");
    assert.equal(await open({ collectionConfig: { slug: "legal-pages" }, data: { kind: "terms" }, locale: { code: "en" } }), "/en/terms");
    assert.equal(await open({ collectionConfig: { slug: "products" }, data: { slug: "puzzle", universe: universe.id } }), "/universuri/fluturele/puzzle");
    assert.equal(await open({ collectionConfig: { slug: "products" }, data: { slug: "puzzle", universe: { slug: "fluturele" } } }), "/universuri/fluturele/puzzle");
    assert.equal(await open({ collectionConfig: { slug: "books" }, data: { slug: "x" } }), "/carti/x");
  }],
  ["an OG card whose upload is missing renders text-only instead of failing the build", async () => {
    const { renderOg } = await import("../../lib/og");
    const warn = console.warn;
    const warned: string[] = [];
    console.warn = (m: string) => warned.push(m);
    try {
      const res = await renderOg({ title: "Titlu", image: "/api/media/file/nu-exista-deloc.webp" });
      assert.equal(res.status, 200);
      assert.equal(res.headers.get("content-type"), "image/png");
      assert.ok(warned.some((w) => w.includes("text-only card")));
    } finally {
      console.warn = warn;
    }
  }],
  ["keepsake photos play their part by file number, not by their place in the list", async () => {
    const { byNumber, fanOf, pickNumbered } = await import("../../components/product/images");
    const m = (src: string) => ({ src, alt: "", width: 460, height: 644 });
    const photos = ["/api/media/file/fluturele-05.webp", "/api/media/file/fluturele-01-1.webp", "/api/media/file/fluturele-03.webp", "/x/other.webp"].map(m);
    assert.equal(byNumber(photos, 1)?.src, "/api/media/file/fluturele-01-1.webp"); // Payload's suffix for a second upload
    assert.deepEqual(fanOf("cards", photos).map((p) => p.src), ["/api/media/file/fluturele-03.webp", "/api/media/file/fluturele-01-1.webp", "/api/media/file/fluturele-05.webp"]);
    assert.deepEqual(pickNumbered([m("/a.webp"), m("/b.webp")], [7, 8, 9]).map((p) => p.src), ["/a.webp", "/b.webp"]); // no numbers: stored order
    assert.equal(byNumber(photos, 24), undefined);
  }],
  ["an internal admin link to a page with a slug localizes (RichText)", async () => {
    const slugs = await c.getAllSlugPairs();
    const en = (url: string) => {
      const href = localizeDynamicPath(url, "en", slugs);
      return href && getPathname({ locale: "en", href: href as never });
    };
    assert.equal(en("/universuri/fluturele"), "/en/universes/butterfly");
    // getPathname drops the hash; <Link> keeps it (seen rendered as /carti#fluturele), so only the hash field is pinned here
    assert.equal(en("/universuri/fluturele#carti"), "/en/universes/butterfly");
    assert.equal(localizeDynamicPath("/universuri/fluturele#carti", "en", slugs)?.hash, "carti");
    assert.equal(en("/universuri/fluturele/semn-de-carte"), "/en/universes/butterfly/bookmark");
    assert.equal(en("/carti/fluturele-dansator-de-step"), "/en/books/the-tap-dancing-butterfly");
    assert.equal(getPathname({ locale: "ro", href: localizeDynamicPath("/arta/poiana-fluturelui", "ro", slugs) as never }), "/arta/poiana-fluturelui");
    assert.equal(en("/universuri/nu-exista"), null, "unknown slug: the caller keeps the path as written");
    assert.equal(en("/carti"), null, "a static page is the Link's own job");
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
