import "server-only";
import { draftMode } from "next/headers";
import { getPayload, type DataFromCollectionSlug, type Where } from "payload";
import config from "@payload-config";
import { routing, type Locale } from "@/i18n/routing";
import type { Artwork as ArtworkDoc, Book as BookDoc, Media as MediaDoc, Product as ProductDoc, Universe as UniverseDoc } from "@/payload-types";
import type {
  About,
  Artwork,
  ArtworkFull,
  Book,
  BookCard,
  BookFull,
  BooksPage,
  CommunityFull,
  ContactPage,
  Counselling,
  CounsellingPage,
  LegalPage,
  Media,
  Seo,
  ProductCard,
  ProductFull,
  RichTextData,
  SiteSettings,
  SlugPair,
  SlugPairs,
  Universe,
  UniverseFull,
} from "./types";

// The getters pages read from: Payload Local API calls, mapped to the M1 shapes (components don't change).
// Published content for visitors; the latest drafts while draft mode (Live Preview) is on.
// Errors are never swallowed: a failed read fails the render, so Next keeps serving the last good static page.

const read = async (locale: Locale) => ({
  payload: await getPayload({ config }),
  opts: { locale, depth: 2, draft: (await draftMode()).isEnabled },
});

/** Payload prefixes upload URLs with serverURL; next/image wants the local path for our own files. */
const origin = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");
const media = (m: number | MediaDoc | null | undefined): Media => {
  if (!m || typeof m !== "object" || !m.url) throw new Error("content: an image is missing or not populated");
  const src = origin && m.url.startsWith(origin) ? m.url.slice(origin.length) : m.url;
  return { src, alt: m.alt, width: m.width ?? 0, height: m.height ?? 0 };
};

type LexNode = { type?: string; text?: unknown; children?: LexNode[] };
const textOf = (n: LexNode): string => (typeof n.text === "string" ? n.text : (n.children ?? []).map(textOf).join(""));

/** The plain text of each top-level paragraph.
 *  ponytail: home shows plain paragraphs; links/bold in the blurb render in M3's book page (a real Lexical renderer). */
export const lexicalParagraphs = (rt: { root: { children: LexNode[] } } | null | undefined): string[] =>
  (rt?.root.children ?? []).filter((n) => n.type === "paragraph").map((n) => textOf(n).trim()).filter(Boolean);

export async function getSiteSettings(l: Locale): Promise<SiteSettings> {
  const { payload, opts } = await read(l);
  const s = await payload.findGlobal({ slug: "site-settings", ...opts });
  const { email, whatsapp, instagram, facebook } = s.contacts;
  return {
    name: s.name,
    roles: s.roles,
    rolesShort: s.rolesShort,
    souls: s.souls,
    whisper: s.whisper,
    intro: s.intro,
    series: s.series,
    seriesLead: s.seriesLead,
    manifesto: (s.manifesto ?? []).map((m) => ({ before: m.before, emphasis: m.emphasis, after: m.after ?? "" })),
    pillars: {
      books: { title: s.pillars.books.title, line: s.pillars.books.line },
      art: { title: s.pillars.art.title, line: s.pillars.art.line },
      counselling: { title: s.pillars.counselling.title, line: s.pillars.counselling.line },
    },
    contacts: {
      email,
      whatsapp: { href: whatsapp.href, number: whatsapp.number },
      instagram: { href: instagram.href, handle: instagram.handle },
      facebook: { href: facebook.href, handle: facebook.handle },
    },
    sameAs: (s.sameAs ?? []).map((r) => r.url),
    portrait: media(s.portrait),
    artTeaser: { title: s.artTeaser.title, lead: s.artTeaser.lead },
    seo: s.seo ? { description: s.seo.description || undefined, image: mediaOrNull(s.seo.shareImage) } : undefined,
  };
}

const universe = (u: UniverseDoc): Universe => ({
  slug: u.slug,
  name: u.name,
  bookTitle: u.bookTitle,
  hook: u.hook,
  status: u.status,
  tint: [u.tint.light, u.tint.mid, u.tint.deep],
  order: u.order ?? 0,
  homeWindow: u.homeWindow,
  scene: u.scene ? media(u.scene) : undefined,
  creature: u.creature ?? undefined,
});

export async function getUniverses(l: Locale): Promise<Universe[]> {
  const { payload, opts } = await read(l);
  const { docs } = await payload.find({ collection: "universes", ...opts, sort: "order", pagination: false, ...(opts.draft ? {} : { where: published }) });
  return docs.map(universe);
}

/** The universes with `id` = their Romanian slug: the same in both languages, it names the orb morph */
export async function getWorlds(l: Locale): Promise<(Universe & { id: string })[]> {
  const [list, pairs] = await Promise.all([getUniverses(l), getSlugPairs("universes")]);
  return list.map((u) => ({ ...u, id: pairs.find((p) => p[l] === u.slug)?.[routing.defaultLocale] ?? u.slug }));
}

const book = (b: number | BookDoc | null | undefined): Book => {
  if (!b || typeof b !== "object") throw new Error("content: site-settings.home.featuredBook is not set");
  return {
    slug: b.slug,
    title: b.title,
    subtitle: b.subtitle ?? "",
    ageGroup: b.ageGroup,
    cover: media(b.cover),
    blurb: lexicalParagraphs(b.blurb),
    year: b.year ?? 0,
    isbn: b.isbn ?? "",
    storeLinks: (b.storeLinks ?? []).map((s) => ({ store: s.store, url: s.url })),
    universeSlug: b.universe && typeof b.universe === "object" ? b.universe.slug : "",
    status: b.status,
  };
};

export async function getFeaturedBook(l: Locale): Promise<Book> {
  const { payload, opts } = await read(l);
  const s = await payload.findGlobal({ slug: "site-settings", ...opts });
  return book(s.home?.featuredBook);
}

export async function getHomeArtworks(l: Locale): Promise<Artwork[]> {
  const { payload, opts } = await read(l);
  const s = await payload.findGlobal({ slug: "site-settings", ...opts });
  return (s.home?.artworks ?? [])
    .filter((a) => typeof a === "object")
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      technique: a.technique ?? "",
      kind: a.kind,
      images: a.images.map(media),
    }));
}

export async function getCounsellingPage(l: Locale): Promise<CounsellingPage> {
  const { payload, opts } = await read(l);
  const c = await payload.findGlobal({ slug: "counselling-page", ...opts });
  return {
    teaserTitle: c.teaserTitle,
    teaserLead: c.teaserLead,
    formats: (c.formats ?? []).map((f) => ({ kind: f.kind, title: f.title, line: f.line })),
  };
}

/** `draft: false` alone still returns docs that were never published (their latest version is a draft), so slug lists filter on _status too */
const published: Where = { _status: { equals: "published" } };

type SlugCollection = "universes" | "books" | "artworks" | "products";

/** Every locale's published slug of each doc (with locale "all" a slug is { ro, en }); a missing one falls back to RO.
 *  Products repeat their slugs under every universe, so identical pairs collapse into one (use getProductPaths for routes). */
export async function getSlugPairs(collection: SlugCollection): Promise<SlugPair[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({ collection, locale: "all", where: published, draft: false, depth: 0, pagination: false, select: { slug: true } });
  const pairs = docs.map((d) => toPair(d.slug));
  return [...new Map(pairs.map((p) => [routing.locales.map((l) => p[l]).join("|"), p])).values()];
}
const toPair = (slug: unknown): SlugPair => {
  const s = slug as Partial<Record<Locale, string>>;
  const ro = s[routing.defaultLocale] ?? "";
  return Object.fromEntries(routing.locales.map((l) => [l, s[l] || ro])) as SlugPair;
};

/** Every collection the language switch maps between (universes, books, artworks, products) */
export async function getAllSlugPairs(): Promise<SlugPairs> {
  const [universes, books, artworks, products] = await Promise.all([
    getSlugPairs("universes"),
    getSlugPairs("books"),
    getSlugPairs("artworks"),
    getSlugPairs("products"),
  ]);
  return { universes, books, artworks, products };
}

/** Every locale's slug for one universe, so the language switch and static params can map between them */
export const getUniverseSlugs = () => getSlugPairs("universes");
export const getBookSlugs = () => getSlugPairs("books");

/** Every published product with its universe's slug pair: the routes /universuri/<universe>/<product> */
export async function getProductPaths(): Promise<{ universe: SlugPair; product: SlugPair; updatedAt: string }[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({ collection: "products", locale: "all", where: published, draft: false, depth: 1, pagination: false, select: { slug: true, universe: true, updatedAt: true } });
  return docs.flatMap((d) => (d.universe && typeof d.universe === "object" ? [{ universe: toPair(d.universe.slug), product: toPair(d.slug), updatedAt: d.updatedAt }] : []));
}

/** Published docs with their slug pair and last edit, for the sitemap (products are in getProductPaths: their routes need the universe too) */
export async function getSlugDocs(collection: Exclude<SlugCollection, "products">): Promise<{ pair: SlugPair; updatedAt: string }[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({ collection, locale: "all", where: published, draft: false, depth: 0, pagination: false, select: { slug: true, updatedAt: true } });
  return docs.map((d) => ({ pair: toPair(d.slug), updatedAt: d.updatedAt }));
}

/* ------------------------------------------------------------------ M3: inner pages */

const rich = (r: unknown) => (r ?? null) as RichTextData | null;
const rows = <T extends { text: string }>(r: T[] | null | undefined) => (r ?? []).map((x) => x.text);
const mediaOrNull = (m: number | MediaDoc | null | undefined) => (m && typeof m === "object" ? media(m) : null);
/** A doc's `seo` group; empty strings are dropped so pageMetadata falls back to the page's own text */
const seoOf = (g: { title?: string | null; description?: string | null; image?: number | MediaDoc | null } | null | undefined): Seo | undefined =>
  g ? { title: g.title || undefined, description: g.description || undefined, image: mediaOrNull(g.image) } : undefined;

type FindOpts = Awaited<ReturnType<typeof read>>["opts"];
type Visible = { _status?: "draft" | "published" | null };
/** Populated relations only (depth ran out → a bare id), and no unpublished doc for a visitor */
const populated = <T extends object>(list: (number | T)[] | null | undefined, opts: FindOpts): T[] =>
  (list ?? []).filter((x): x is T => typeof x === "object" && (opts.draft || (x as Visible)._status !== "draft"));

/** A doc by its slug in `l`. A slug not yet translated (the switch then offers the RO one) is looked up in RO and shown in `l`. */
async function bySlug<C extends "universes" | "books" | "artworks" | "products">(
  collection: C,
  l: Locale,
  slug: string,
  extra?: Where,
): Promise<DataFromCollectionSlug<C> | null> {
  const { payload, opts } = await read(l);
  // a visitor never gets a doc that was never published (`draft: false` alone still returns it): it 404s
  const where = (s: string) => ({ and: [{ slug: { equals: s } }, ...(extra ? [extra] : []), ...(opts.draft ? [] : [published])] }) as Where;
  const own = await payload.find({ collection, ...opts, where: where(slug), limit: 1 });
  if (own.docs[0]) return own.docs[0] as DataFromCollectionSlug<C>;
  if (l === routing.defaultLocale) return null;
  const ro = await payload.find({ collection, locale: routing.defaultLocale, draft: opts.draft, depth: 0, where: where(slug), limit: 1, select: { slug: true } });
  const id = (ro.docs[0] as { id: number } | undefined)?.id;
  if (id === undefined) return null;
  return (await payload.findByID({ collection, id, ...opts })) as DataFromCollectionSlug<C>;
}

const KIND_ORDER = ["semn-de-carte", "carti-de-joc", "puzzle", "joc-de-familie"];

const productCard = (p: ProductDoc, universeSlug: string): ProductCard => ({
  slug: p.slug,
  kind: p.kind,
  name: p.name,
  status: p.status,
  universeSlug,
  image: mediaOrNull((p.images ?? [])[0]),
  images: (p.images ?? []).filter((m) => typeof m === "object").map(media),
  gallery: p.gallery ?? null,
});

const bookFull = (b: BookDoc): BookFull => ({
  ...book(b),
  pages: b.pages ?? null,
  format: b.format ?? "",
  formats: (b.formats ?? []).map((f) => ({ label: f.label, status: f.status ?? "soon" })),
  leafPages: (b.leafPages ?? []).map((p) => ({ ...media(p.image), label: p.label ?? "" })),
  blurbRich: rich(b.blurb),
  seo: seoOf(b.seo),
});

export async function getUniverse(l: Locale, slug: string): Promise<UniverseFull | null> {
  const u = await bySlug("universes", l, slug);
  if (!u) return null;
  const { opts } = await read(l);
  return {
    ...universe(u),
    story: rich(u.story),
    seo: seoOf(u.seo),
    books: populated<BookDoc>(u.books, opts).map(book),
    products: populated<ProductDoc>(u.products, opts)
      .map((p) => productCard(p, u.slug))
      .sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind)),
  };
}

export async function getProduct(l: Locale, universeSlug: string, slug: string): Promise<ProductFull | null> {
  const u = await bySlug("universes", l, universeSlug);
  if (!u) return null;
  const p = await bySlug("products", l, slug, { universe: { equals: u.id } });
  if (!p) return null;
  return {
    ...productCard(p, u.slug),
    description: rich(p.description),
    paragraphs: lexicalParagraphs(p.description),
    specs: (p.specs ?? []).map((s) => ({ label: s.label, value: s.value })),
    price: p.price ?? null,
    externalLink: p.externalLink || null,
    universe: universe(u),
    seo: seoOf(p.seo),
  };
}

export async function getBooks(l: Locale): Promise<BookCard[]> {
  const { payload, opts } = await read(l);
  const { docs } = await payload.find({ collection: "books", ...opts, sort: "createdAt", pagination: false });
  return docs.map(book);
}

export async function getBook(l: Locale, slug: string): Promise<BookFull | null> {
  const b = await bySlug("books", l, slug);
  return b ? bookFull(b) : null;
}

const artwork = (a: ArtworkDoc): ArtworkFull => ({
  slug: a.slug,
  title: a.title,
  technique: a.technique ?? "",
  kind: a.kind,
  images: a.images.map(media),
  availability: a.availability,
  size: a.size ?? "",
  year: a.year ?? null,
  price: a.price ?? null,
  description: rich(a.description),
  seo: seoOf(a.seo),
});

export async function getArtworks(l: Locale): Promise<ArtworkFull[]> {
  const { payload, opts } = await read(l);
  const { docs } = await payload.find({ collection: "artworks", ...opts, sort: "createdAt", pagination: false });
  return docs.map(artwork);
}

export async function getArtwork(l: Locale, slug: string): Promise<ArtworkFull | null> {
  const a = await bySlug("artworks", l, slug);
  return a ? artwork(a) : null;
}

export async function getCounselling(l: Locale): Promise<Counselling> {
  const { payload, opts } = await read(l);
  const c = await payload.findGlobal({ slug: "counselling-page", ...opts });
  const p = c.patterns;
  const r = c.rightForYou;
  return {
    teaserTitle: c.teaserTitle,
    teaserLead: c.teaserLead,
    formats: (c.formats ?? []).map((f) => ({ kind: f.kind, title: f.title, line: f.line })),
    tagline: c.tagline ?? "",
    intro: rich(c.intro),
    approach: rich(c.approach),
    patterns: {
      title: p?.title ?? "",
      questions: rows(p?.questions),
      reactions: rows(p?.reactions),
      thesis: p?.thesis ?? "",
      path: (p?.path ?? []).map((x) => x.label),
      explain: p?.explain ?? "",
      change: p?.change ?? "",
      closer: p?.closer ?? "",
      toward: rows(p?.toward),
    },
    rightForYou: {
      title: r?.title ?? "",
      maybe: rows(r?.maybe),
      body: rows(r?.body),
      simply: r?.simply ?? "",
      here: r?.here ?? "",
      offer: rows(r?.offer),
      close: r?.close ?? "",
    },
    sessions: (c.sessions ?? []).map((s) => ({ minutes: s.minutes, priceEur: s.priceEur ?? null })),
    steps: (c.steps ?? []).map((s) => ({ title: s.title, text: s.text ?? "" })),
    faq: (c.faq ?? []).map((f) => ({ question: f.question, answer: rich(f.answer) })),
    ctaTitle: c.ctaTitle ?? "",
  };
}

export async function getAbout(l: Locale): Promise<About> {
  const { payload, opts } = await read(l);
  const a = await payload.findGlobal({ slug: "about-page", ...opts });
  // flat rows → her movements: a row with „Pauză înainte” starts the next one
  const story: About["story"] = [];
  for (const [i, row] of (a.story ?? []).entries()) {
    if (i === 0 || row.breakBefore) story.push([]);
    story[story.length - 1].push({ kind: row.kind, text: row.text });
  }
  return {
    titleA: a.titleA ?? "",
    titleB: a.titleB ?? "",
    role: a.role ?? "",
    portrait: mediaOrNull(a.portrait),
    bio: rich(a.bio),
    highlights: (a.highlights ?? []).map((h) => h.text),
    story,
    crafts: {
      title: a.crafts?.title ?? "",
      items: (a.crafts?.items ?? []).map((i) => ({ name: i.name, line: i.line, href: i.href, tint: i.tint })),
    },
  };
}

export async function getBooksPage(l: Locale): Promise<BooksPage> {
  const { payload, opts } = await read(l);
  const b = await payload.findGlobal({ slug: "books-page", ...opts });
  return {
    seriesNote: b.seriesNote ?? "",
    author: {
      title: b.author?.title ?? "",
      paragraphs: rows(b.author?.paragraphs),
      statement: b.author?.statement ?? "",
      formats: (b.author?.formats ?? []).map((f) => ({ label: f.label, status: f.status, line: f.line ?? "" })),
    },
  };
}

export async function getCommunity(l: Locale): Promise<CommunityFull> {
  const { payload, opts } = await read(l);
  const [c, events, projects, partners] = await Promise.all([
    payload.findGlobal({ slug: "community-page", ...opts }),
    payload.find({ collection: "events", ...opts, sort: "createdAt", pagination: false }), // ties (no date yet) keep the order they were made in
    payload.find({ collection: "projects", ...opts, sort: "order", pagination: false }),
    payload.find({ collection: "partners", ...opts, sort: "order", pagination: false }),
  ]);
  return {
    titleA: c.titleA ?? "",
    titleB: c.titleB ?? "",
    tagline: c.tagline ?? "",
    lead: c.lead ?? "",
    intro: c.intro ?? "",
    eventsTitle: c.eventsTitle ?? "",
    eventsLead: c.eventsLead ?? "",
    projectsTitle: c.projectsTitle ?? "",
    projectsLead: c.projectsLead ?? "",
    partnersTitle: c.partnersTitle ?? "",
    partnersLead: rows(c.partnersLead),
    closing: c.closing ?? "",
    ctaTitle: c.ctaTitle ?? "",
    ctaLine: c.ctaLine ?? "",
    // soonest first, events without a date last (Array.sort is stable)
    events: events.docs
      .sort((a, b) => (a.startsAt ? Date.parse(a.startsAt) : Infinity) - (b.startsAt ? Date.parse(b.startsAt) : Infinity) || 0)
      .map((e) => ({
      id: String(e.id),
      kind: e.kind,
      title: e.title,
      audience: e.audience ?? "",
      startsAt: e.startsAt ?? null,
      place: e.place ?? "",
      online: Boolean(e.online),
      image: mediaOrNull(e.image),
      signUpNote: e.signUpNote ?? "",
      timing: e.status ?? "upcoming",
    })),
    projects: projects.docs.map((p) => ({ id: String(p.id), title: p.title, line: p.line ?? "", image: mediaOrNull(p.image), stage: p.status ?? "idee" })),
    partners: partners.docs.map((p) => ({ id: String(p.id), name: p.name, handle: p.handle ?? "", url: p.url ?? "", line: p.line ?? "", logo: mediaOrNull(p.logo) })),
  };
}

export async function getContactPage(l: Locale): Promise<ContactPage> {
  const { payload, opts } = await read(l);
  const c = await payload.findGlobal({ slug: "contact-page", ...opts });
  return { tagline: c.tagline ?? "" };
}

export async function getLegal(l: Locale, kind: "privacy" | "terms"): Promise<LegalPage | null> {
  const { payload, opts } = await read(l);
  const { docs } = await payload.find({ collection: "legal-pages", ...opts, where: { kind: { equals: kind } }, limit: 1 });
  const d = docs[0];
  return d ? { kind: d.kind, title: d.title, body: rich(d.body), lastUpdated: d.lastUpdated ?? null } : null;
}
