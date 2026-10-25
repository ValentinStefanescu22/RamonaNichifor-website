/**
 * Fills Payload with the site's current content (content/data.ts, the copy approved in the mockup) and
 * a developer admin from .env.local. Idempotent: documents are matched by slug / filename / email and
 * updated, so running it twice changes nothing. Run with `npm run seed`.
 */
import path from "node:path";
import { getPayload, type Payload } from "payload";
import config from "@payload-config";
import { counselling, featuredBook, homeArtworks, site, universes } from "../../content/data";

type L = { ro: string; en: string };
const t = (ro: string, en: string): L => ({ ro, en });
const root = process.cwd();
// skipStamp: these files already carry the © stamp; seeding: no revalidation while seeding
const context = { skipStamp: true, seeding: true };

/** Lexical rich text from plain paragraphs */
const rt = (paragraphs: string[]) => ({
  root: {
    type: "root",
    format: "" as const,
    indent: 0,
    version: 1,
    direction: "ltr" as const,
    children: paragraphs.map((text) => ({
      type: "paragraph",
      format: "" as const,
      indent: 0,
      version: 1,
      direction: "ltr" as const,
      textFormat: 0,
      textStyle: "",
      children: [{ type: "text", text, format: 0, detail: 0, mode: "normal", style: "", version: 1 }],
    })),
  },
});

const pick = <T extends Record<string, unknown>>(obj: T, l: "ro" | "en") =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v && typeof v === "object" && "ro" in v && "en" in v ? (v as L)[l] : v]));

async function upsertMedia(payload: Payload, file: string, alt: L, illustration: boolean) {
  const filename = path.basename(file);
  const found = await payload.find({ collection: "media", where: { filename: { equals: filename } }, limit: 1, context });
  const doc = found.docs[0]
    ?? (await payload.create({ collection: "media", data: { alt: alt.ro, illustration }, filePath: path.join(root, file), locale: "ro", context }));
  await payload.update({ collection: "media", id: doc.id, data: { alt: alt.ro, illustration }, locale: "ro", context });
  await payload.update({ collection: "media", id: doc.id, data: { alt: alt.en }, locale: "en", context });
  return doc.id;
}

/** Create or update a localized document matched by its RO slug; `ro`/`en` hold the per-locale fields */
async function upsert(
  payload: Payload,
  collection: "universes" | "books" | "artworks",
  slugRo: string,
  shared: Record<string, unknown>,
  ro: Record<string, unknown>,
  en: Record<string, unknown>,
) {
  const found = await payload.find({ collection, where: { slug: { equals: slugRo } }, locale: "ro", limit: 1, draft: true, context });
  const data = { ...shared, ...ro, _status: "published" as const };
  const doc = found.docs[0]
    ? await payload.update({ collection, id: found.docs[0].id, data: data as never, locale: "ro", context })
    : await payload.create({ collection, data: data as never, locale: "ro", context });
  await payload.update({ collection, id: doc.id, data: { ...en, _status: "published" } as never, locale: "en", context });
  return doc.id;
}

async function seed() {
  const payload = await getPayload({ config });
  const log = (m: string) => payload.logger.info(`seed: ${m}`);

  // Images. Covers and book pages are her illustrations (already stamped); scenes and portrait are not.
  const img = (f: string) => `public/img/${f}`;
  const pages = (f: string) => `mockups/public/img/pages/${f}`;
  const m = {
    portrait: await upsertMedia(payload, img("portrait.webp"), t("Ramona Nichifor", "Ramona Nichifor"), false),
    coverFluturele: await upsertMedia(payload, img("cover-fluturele.webp"), t("Coperta cărții Fluturele dansator de step", "Cover of The Tap-Dancing Butterfly"), true),
    coverBuburuza: await upsertMedia(payload, img("cover-buburuza.webp"), t("Coperta cărții Buburuza rotunjoară", "Cover of The Roly-Poly Ladybird"), true),
    buburuzaScene: await upsertMedia(payload, img("buburuza-scene.webp"), t("Buburuza în poiană, din coperta cărții", "The ladybird in the meadow, from the book cover"), false),
  };
  const leaf = async (book: "fluturele" | "buburuza", items: [string, L][]) =>
    Promise.all(
      items.map(async ([f, label]) => ({
        image: await upsertMedia(payload, pages(f), t(`${label.ro}, ${book === "fluturele" ? "Fluturele dansator de step" : "Buburuza rotunjoară"}`, `${label.en}, ${book === "fluturele" ? "The Tap-Dancing Butterfly" : "The Roly-Poly Ladybird"}`), true),
        label,
      })),
    );
  const leafFluturele = await leaf("fluturele", [
    ["fluturele-coperta-spate.webp", t("Coperta spate", "Back cover")],
    ["fluturele-p4.webp", t("Pagina 4", "Page 4")],
    ["fluturele-p9.webp", t("Pagina 9", "Page 9")],
  ]);
  const leafBuburuza = await leaf("buburuza", [
    ["buburuza-coperta-spate.webp", t("Coperta spate", "Back cover")],
    ["buburuza-p8.webp", t("Pagina 8", "Page 8")],
    ["buburuza-p12.webp", t("Pagina 12", "Page 12")],
  ]);
  log("media ready");

  // Universes
  const uni: Record<string, number | string> = {};
  for (const u of universes) {
    uni[u.slug.ro] = await upsert(
      payload,
      "universes",
      u.slug.ro,
      {
        status: u.status,
        order: u.order,
        tint: { light: u.tint[0], mid: u.tint[1], deep: u.tint[2] },
        homeWindow: u.homeWindow,
        scene: u.homeWindow === "scene" ? m.buburuzaScene : null,
        creature: "creature" in u ? u.creature : u.slug.ro === "buburuza" ? "buburuza" : null,
      },
      pick({ slug: u.slug, name: u.name, bookTitle: u.bookTitle, hook: u.hook }, "ro"),
      pick({ slug: u.slug, name: u.name, bookTitle: u.bookTitle, hook: u.hook }, "en"),
    );
  }
  log("universes ready");

  // Books (both are published; English titles are working titles)
  const format = t("A4, copertă cartonată lucioasă", "A4, glossy hardcover");
  const formats = [
    { label: "E-book", status: "soon" },
    { label: "Audiobook", status: "planned" },
  ];
  const bookFluturele = await upsert(
    payload,
    "books",
    featuredBook.slug.ro,
    { ageGroup: "copii", status: "published", cover: m.coverFluturele, year: 2026, pages: 40, isbn: featuredBook.isbn, universe: uni.fluturele, storeLinks: [] },
    { slug: featuredBook.slug.ro, title: featuredBook.title.ro, subtitle: featuredBook.subtitle.ro, blurb: rt(featuredBook.blurb.map((p) => p.ro)), format: format.ro, formats, leafPages: leafFluturele.map((p) => ({ image: p.image, label: p.label.ro })) },
    { slug: featuredBook.slug.en, title: featuredBook.title.en, subtitle: featuredBook.subtitle.en, blurb: rt(featuredBook.blurb.map((p) => p.en)) },
  );
  const buburuzaBlurb = [
    t(
      "O buburuză rotunjoară și drăgălașă începe să creadă că nu este suficient de frumoasă. Cuprinsă de gelozie, rușine și dorința de a fi altcineva, descoperă că adevărata magie izvorăște din iubirea și acceptarea de sine.",
      "A sweet, roly-poly ladybird begins to believe she isn't pretty enough. Caught up in jealousy, shame and the wish to be someone else, she discovers that real magic springs from love and self-acceptance.",
    ),
    t(
      "Parte din seria „Magia suntem noi”, această carte este creată pentru a fi citită cu voce tare, pentru a deschide conversații sensibile despre sentimente și emoții pe care copiii le simt, dar nu știu întotdeauna să le numească; despre identitate, apartenență și bucuria de a fi exact așa cum ești.",
      "Part of the „Magic Is Us” series, this book is made to be read aloud, to open gentle conversations about the feelings children have but cannot always name; about identity, belonging and the joy of being exactly who you are.",
    ),
    t(
      "O poveste ilustrată pentru copii dar și pentru adulții care își redescoperă copilul interior.",
      "An illustrated story for children, and for the grown-ups rediscovering their inner child.",
    ),
  ];
  const bookBuburuza = await upsert(
    payload,
    "books",
    "buburuza-rotunjoara",
    { ageGroup: "copii", status: "published", cover: m.coverBuburuza, year: 2026, pages: 28, isbn: "978-973-0-44383-7", universe: uni.buburuza, storeLinks: [] },
    { slug: "buburuza-rotunjoara", title: "Buburuza rotunjoară", subtitle: "O poveste șoptită inimii, acolo unde magia începe cu tine.", blurb: rt(buburuzaBlurb.map((p) => p.ro)), format: format.ro, formats, leafPages: leafBuburuza.map((p) => ({ image: p.image, label: p.label.ro })) },
    { slug: "the-roly-poly-ladybird", title: "The Roly-Poly Ladybird", subtitle: "A story whispered to the heart, where the magic begins with you.", blurb: rt(buburuzaBlurb.map((p) => p.en)) },
  );
  // English labels of the book pages (array rows keep their ids across locales)
  for (const id of [bookFluturele, bookBuburuza]) {
    const doc = await payload.findByID({ collection: "books", id, locale: "ro", context });
    const leafEn = id === bookFluturele ? leafFluturele : leafBuburuza;
    await payload.update({
      collection: "books",
      id,
      locale: "en",
      context,
      data: {
        format: format.en,
        leafPages: (doc.leafPages ?? []).map((p, i) => ({ id: p.id, image: typeof p.image === "object" ? p.image.id : p.image, label: leafEn[i].label.en })),
      } as never,
    });
  }
  await payload.update({ collection: "universes", id: uni.fluturele, data: { books: [bookFluturele] }, context });
  await payload.update({ collection: "universes", id: uni.buburuza, data: { books: [bookBuburuza] }, context });
  log("books ready");

  // The two covers shown as art on Acasă
  const art: (number | string)[] = [];
  for (const [i, a] of homeArtworks.entries()) {
    art.push(
      await upsert(
        payload,
        "artworks",
        a.slug.ro,
        { kind: a.kind, availability: "preorder", images: [i === 0 ? m.coverFluturele : m.coverBuburuza] },
        pick({ slug: a.slug, title: a.title, technique: a.technique }, "ro"),
        pick({ slug: a.slug, title: a.title, technique: a.technique }, "en"),
      ),
    );
  }
  log("artworks ready");

  // Site settings (both locales)
  const settings = (l: "ro" | "en") => ({
    name: site.name,
    roles: site.roles[l],
    rolesShort: site.rolesShort[l],
    souls: site.souls[l],
    whisper: site.whisper[l],
    intro: site.intro[l],
    series: site.series[l],
    seriesLead: site.seriesLead[l],
    pillars: {
      books: pick(site.pillars.books, l),
      art: pick(site.pillars.art, l),
      counselling: pick(site.pillars.counselling, l),
    },
    artTeaser: pick(site.artTeaser, l),
  });
  await payload.updateGlobal({
    slug: "site-settings",
    locale: "ro",
    context,
    data: {
      ...settings("ro"),
      manifesto: site.manifesto.map((r) => pick(r, "ro")),
      home: { featuredBook: bookFluturele, artworks: art },
      portrait: m.portrait,
      contacts: site.contacts,
      sameAs: [{ url: site.contacts.instagram.href }, { url: site.contacts.facebook.href }],
      _status: "published",
    } as never,
  });
  const ss = await payload.findGlobal({ slug: "site-settings", locale: "ro", context });
  await payload.updateGlobal({
    slug: "site-settings",
    locale: "en",
    context,
    data: {
      ...settings("en"),
      manifesto: (ss.manifesto ?? []).map((r, i) => ({ id: r.id, ...pick(site.manifesto[i], "en") })),
      _status: "published",
    } as never,
  });

  // Counselling teaser
  await payload.updateGlobal({
    slug: "counselling-page",
    locale: "ro",
    context,
    data: {
      teaserTitle: counselling.teaserTitle.ro,
      teaserLead: counselling.teaserLead.ro,
      formats: counselling.formats.map((f) => ({ kind: f.kind, title: f.title.ro, line: f.line.ro })),
      _status: "published",
    } as never,
  });
  const cp = await payload.findGlobal({ slug: "counselling-page", locale: "ro", context });
  await payload.updateGlobal({
    slug: "counselling-page",
    locale: "en",
    context,
    data: {
      teaserTitle: counselling.teaserTitle.en,
      teaserLead: counselling.teaserLead.en,
      formats: (cp.formats ?? []).map((f, i) => ({ id: f.id, kind: f.kind, title: counselling.formats[i].title.en, line: counselling.formats[i].line.en })),
      _status: "published",
    } as never,
  });
  log("globals ready");

  // Developer admin (local test account from .env.local; Ramona creates her own in M5)
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (email && password) {
    const found = await payload.find({ collection: "users", where: { email: { equals: email } }, limit: 1, context });
    if (!found.docs.length) await payload.create({ collection: "users", data: { email, password, name: "Developer" }, context });
    log("admin user ready");
  }
  log("done");
  process.exit(0);
}

await seed();
