import "server-only";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import { routing, type Locale } from "@/i18n/routing";
import type { Book as BookDoc, Media as MediaDoc } from "@/payload-types";
import type { Artwork, Book, CounsellingPage, Media, SiteSettings, Universe } from "./types";

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
  };
}

export async function getUniverses(l: Locale): Promise<Universe[]> {
  const { payload, opts } = await read(l);
  const { docs } = await payload.find({ collection: "universes", ...opts, sort: "order", pagination: false });
  return docs.map((u) => ({
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
  }));
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

/** Every locale's published slug of each doc (with locale "all" a slug is { ro, en }); a missing one falls back to RO */
async function slugPairs(collection: "universes" | "books"): Promise<Record<Locale, string>[]> {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({ collection, locale: "all", draft: false, depth: 0, pagination: false, select: { slug: true } });
  return docs.map((d) => {
    const s = d.slug as unknown as Partial<Record<Locale, string>>;
    const ro = s[routing.defaultLocale] ?? "";
    return Object.fromEntries(routing.locales.map((l) => [l, s[l] || ro])) as Record<Locale, string>;
  });
}

/** Every locale's slug for one universe, so the language switch and static params can map between them */
export const getUniverseSlugs = () => slugPairs("universes");
export const getBookSlugs = () => slugPairs("books");
