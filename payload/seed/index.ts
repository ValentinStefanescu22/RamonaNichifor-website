/**
 * Fills Payload with the site's current content (content/data.ts, the copy approved in the mockup) and
 * a developer admin from .env.local. Idempotent: documents are matched by slug / filename / email and
 * updated, so running it twice changes nothing. Run with `npm run seed`.
 */
import path from "node:path";
import { getPayload, type Payload, type Where } from "payload";
import config from "@payload-config";
import { counselling, featuredBook, homeArtworks, site, universes } from "../../content/data";
import { about, bookmarks, booksPage, community, contactPage, counsellingPage, deck, flutureProducts, kindCopy, legalTemplates, specsSoon } from "../../content/pages-data";
import { slugify } from "../fields";
import { assertInBucket, assertSameFilename, headObject } from "./media-check";

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

/** Pages-data holds each text as { ro, en }: these split a whole structure into one language's Payload data */
const isL = (v: unknown): v is L => !!v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 2 && "ro" in v && "en" in v;
const localize = (v: unknown, l: "ro" | "en"): unknown =>
  isL(v) ? v[l] : Array.isArray(v) ? v.map((x) => localize(x, l)) : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, localize(x, l)])) : v;
/** Array rows are shared by both locales: the English pass must name the rows the Romanian pass created (same index → same id) */
const withIds = (v: unknown, ref: unknown): unknown => {
  const r = ref as Record<string, unknown> | undefined;
  if (Array.isArray(v))
    return v.map((x, i) => {
      const rr = (ref as Record<string, unknown>[] | undefined)?.[i];
      const o = withIds(x, rr);
      return o && typeof o === "object" && !Array.isArray(o) && rr?.id ? { ...o, id: rr.id } : o;
    });
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, withIds(x, r?.[k])]));
  return v;
};
/** Rows of one text field: ["a", "b"] → [{ text: "a" }, { text: "b" }] */
const lines = (texts: L[]) => texts.map((text) => ({ text }));
/** Rich text in both languages from paragraph pairs */
const richL = (paragraphs: L[]) => ({ ro: rt(paragraphs.map((p) => p.ro)), en: rt(paragraphs.map((p) => p.en)) });

async function upsertMedia(payload: Payload, file: string, alt: L, illustration: boolean) {
  const filename = path.basename(file);
  const found = await payload.find({ collection: "media", where: { filename: { equals: filename } }, limit: 1, context });
  const doc = found.docs[0]
    ?? (await payload.create({ collection: "media", data: { alt: alt.ro, illustration }, filePath: path.join(root, file), locale: "ro", context }));
  assertSameFilename(doc, filename);
  if (process.env.S3_BUCKET) await assertInBucket(filename, headObject);
  await payload.update({ collection: "media", id: doc.id, data: { alt: alt.ro, illustration }, locale: "ro", context });
  await payload.update({ collection: "media", id: doc.id, data: { alt: alt.en }, locale: "en", context });
  return doc.id;
}

type Collection = "universes" | "books" | "artworks" | "products" | "events" | "partners" | "legal-pages";

/** Create or update a localized document found by `where` (in RO); `ro`/`en` hold the per-locale fields */
async function upsertWhere(
  payload: Payload,
  collection: Collection,
  where: Where,
  shared: Record<string, unknown>,
  ro: Record<string, unknown>,
  en: Record<string, unknown>,
) {
  const found = await payload.find({ collection, where, locale: "ro", limit: 1, draft: true, context });
  const data = { ...shared, ...ro, _status: "published" as const };
  const doc = found.docs[0]
    ? await payload.update({ collection, id: found.docs[0].id, data: data as never, locale: "ro", context })
    : await payload.create({ collection, data: data as never, locale: "ro", context });
  const saved = await payload.findByID({ collection, id: doc.id, locale: "ro", draft: true, context });
  await payload.update({ collection, id: doc.id, data: { ...(withIds(en, saved) as object), _status: "published" } as never, locale: "en", context });
  return doc.id;
}
const upsert = (payload: Payload, collection: Collection, slugRo: string, shared: Record<string, unknown>, ro: Record<string, unknown>, en: Record<string, unknown>) =>
  upsertWhere(payload, collection, { slug: { equals: slugRo } }, shared, ro, en);

/** Fill a page global in both languages from one { ro, en } structure */
async function fillGlobal(payload: Payload, slug: "counselling-page" | "about-page" | "books-page" | "community-page" | "contact-page", data: Record<string, unknown>) {
  await payload.updateGlobal({ slug, locale: "ro", context, data: { ...(localize(data, "ro") as object), _status: "published" } as never });
  const saved = await payload.findGlobal({ slug, locale: "ro", draft: true, context });
  await payload.updateGlobal({ slug, locale: "en", context, data: { ...(withIds(localize(data, "en"), saved) as object), _status: "published" } as never });
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
  // The Fluture keepsakes (printer files, already stamped): bookmarks alt = their motto, cards alt = the character
  const cardNames = (n: number): L => (n === deck.winner.n ? deck.winner.name : n === deck.rulesCard ? deck.rulesCardLabel : t(deck.cardNames[n - 2], deck.cardNames[n - 2]));
  const cardIds: (number | string)[] = [];
  for (const n of [1, 2, 3, 4, 5, 14, 15, 23, 24])
    cardIds.push(await upsertMedia(payload, `mockups/public/img/${deck.card(n)}`, cardNames(n), true));
  const bookmarkIds: (number | string)[] = [];
  for (const [i, motto] of bookmarks.mottos.entries())
    bookmarkIds.push(await upsertMedia(payload, `mockups/public/img/${bookmarks.src(i + 1)}`, motto, true));
  log("media ready");

  // Universes
  const uni: Record<string, number> = {};
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

  // Keepsakes: four kinds per universe. Only the Fluture bookmarks and cards are real; the rest wait for Ramona („În curând”, no photos).
  const kinds = [
    { id: "semn", value: "semn-de-carte", gallery: "bookmarks" },
    { id: "carti", value: "carti-de-joc", gallery: "cards" },
    { id: "puzzle", value: "puzzle", gallery: null },
    { id: "joc", value: "joc-de-familie", gallery: null },
  ] as const;
  for (const u of universes) {
    const ids: number[] = [];
    for (const k of kinds) {
      const real = u.slug.ro === "fluturele" && (k.id === "semn" || k.id === "carti");
      const copy = real ? flutureProducts[k.id as "semn" | "carti"] : { description: kindCopy[k.id].description, specs: specsSoon };
      const name = kindCopy[k.id].name;
      const fields = { slug: t(slugify(name.ro), slugify(name.en)), name, description: richL(copy.description), specs: copy.specs };
      ids.push(
        await upsertWhere(
          payload,
          "products",
          { and: [{ universe: { equals: uni[u.slug.ro] } }, { kind: { equals: k.value } }] },
          { kind: k.value, status: "soon", universe: uni[u.slug.ro], images: real ? (k.id === "semn" ? bookmarkIds : cardIds) : [], gallery: real ? k.gallery : null },
          localize(fields, "ro") as Record<string, unknown>,
          localize(fields, "en") as Record<string, unknown>,
        ),
      );
    }
    await payload.update({ collection: "universes", id: uni[u.slug.ro], data: { products: ids }, context });
  }
  log("products ready");

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

  // The inner pages' texts (content/pages-data.ts)
  const patterns = counsellingPage.patterns;
  const right = counsellingPage.rightForYou;
  await fillGlobal(payload, "counselling-page", {
    tagline: counsellingPage.tagline,
    patterns: {
      title: patterns.title,
      questions: lines(patterns.questions),
      reactions: lines(patterns.reactions),
      thesis: patterns.thesis,
      path: patterns.path.map((label) => ({ label })),
      explain: patterns.explain,
      change: patterns.change,
      closer: patterns.closer,
      toward: lines(patterns.toward),
    },
    rightForYou: { title: right.title, maybe: lines(right.maybe), body: lines(right.body), simply: right.simply, here: right.here, offer: lines(right.offer), close: right.close },
    sessions: counsellingPage.prices.map((p) => ({ minutes: p.minutes, priceEur: p.eur })),
    steps: counsellingPage.steps.map((x) => ({ title: x.title, text: x.line })),
    faq: counsellingPage.faq.map((f) => ({ question: f.q, answer: richL([f.a]) })),
    ctaTitle: counsellingPage.ctaTitle,
  });
  await fillGlobal(payload, "about-page", {
    titleA: about.title[0],
    titleB: about.title[1],
    role: about.role,
    portrait: m.portrait,
    // her four movements as flat rows: „Pauză înainte” opens each movement after the first
    story: about.story.flatMap((movement, mi) =>
      movement.map((beat, i) => ({
        kind: beat.kind === "questions" ? "question" : beat.kind === "close" ? "closing" : "beat",
        breakBefore: mi > 0 && i === 0,
        text: beat.text,
      })),
    ),
    crafts: { title: about.crafts.title, items: about.crafts.items.map(({ name, line, href, tint }) => ({ name, line, href, tint })) },
  });
  const [ebook, audiobook] = booksPage.author.formats;
  await fillGlobal(payload, "books-page", {
    seriesNote: booksPage.seriesNote,
    author: {
      title: booksPage.author.title,
      paragraphs: lines(booksPage.author.paragraphs),
      statement: booksPage.author.statement,
      // the e-book's „În curând” is the status itself; the audiobook has her own sentence
      formats: [{ label: ebook.name, status: "soon" }, { label: audiobook.name, status: "planned", line: audiobook.line }],
    },
  });
  await fillGlobal(payload, "community-page", {
    titleA: community.title[0],
    titleB: community.title[1],
    tagline: community.tagline,
    lead: community.lead,
    intro: community.intro,
    eventsTitle: community.eventsTitle,
    eventsLead: community.eventsLead,
    projectsTitle: community.projectsTitle,
    projectsLead: community.projectsLead,
    partnersTitle: community.partnersTitle,
    partnersLead: lines(community.partnersLead),
    closing: community.closing,
    ctaTitle: community.ctaTitle,
    ctaLine: community.ctaLine,
  });
  await fillGlobal(payload, "contact-page", { tagline: contactPage.tagline });

  // The four kinds of gathering (no dates yet), her one partner (no logo), and the legal pages as marked drafts
  const eventKinds = { pictura: "atelier-pictura", lansari: "lansare", autografe: "autografe", citit: "atelier-citit" } as const;
  for (const e of community.events)
    await upsertWhere(
      payload,
      "events",
      { kind: { equals: eventKinds[e.id as keyof typeof eventKinds] } },
      { kind: eventKinds[e.id as keyof typeof eventKinds], status: "upcoming" },
      pick({ title: e.title, audience: e.audience }, "ro"),
      pick({ title: e.title, audience: e.audience }, "en"),
    );
  for (const p of community.partners)
    await upsertWhere(payload, "partners", { name: { equals: p.name } }, { name: p.name, handle: p.handle, url: p.url, order: 0 }, {}, {});
  for (const kind of ["privacy", "terms"] as const) {
    const lg = legalTemplates[kind];
    await upsertWhere(payload, "legal-pages", { kind: { equals: kind } }, { kind }, { title: lg.title.ro, body: rt(lg.body.map((p) => p.ro)) }, { title: lg.title.en, body: rt(lg.body.map((p) => p.en)) });
  }
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
