import "server-only";
import type { Locale } from "@/i18n/routing";
import { counselling, featuredBook, homeArtworks, site, universes } from "./data";
import type { Artwork, Book, CounsellingPage, Media, SiteSettings, Universe } from "./types";

// The getters pages read from. In M2 each body becomes a Payload Local API call with { locale };
// the signatures and return shapes stay.

type Loc = Record<Locale, string>;
const media = (m: { src: string; alt: Loc; width: number; height: number }, l: Locale): Media => ({ ...m, alt: m.alt[l] });

export async function getSiteSettings(l: Locale): Promise<SiteSettings> {
  const { contacts } = site;
  return {
    name: site.name,
    roles: site.roles[l],
    rolesShort: site.rolesShort[l],
    souls: site.souls[l],
    whisper: site.whisper[l],
    intro: site.intro[l],
    series: site.series[l],
    seriesLead: site.seriesLead[l],
    manifesto: site.manifesto.map((m) => ({ before: m.before[l], emphasis: m.emphasis[l], after: m.after[l] })),
    pillars: {
      books: { title: site.pillars.books.title[l], line: site.pillars.books.line[l] },
      art: { title: site.pillars.art.title[l], line: site.pillars.art.line[l] },
      counselling: { title: site.pillars.counselling.title[l], line: site.pillars.counselling.line[l] },
    },
    contacts,
    sameAs: [contacts.instagram.href, contacts.facebook.href],
    portrait: media(site.portrait, l),
    artTeaser: { title: site.artTeaser.title[l], lead: site.artTeaser.lead[l] },
  };
}

export async function getUniverses(l: Locale): Promise<Universe[]> {
  return universes
    .map((u) => ({
      slug: u.slug[l],
      name: u.name[l],
      bookTitle: u.bookTitle[l],
      hook: u.hook[l],
      status: u.status,
      tint: [...u.tint] as Universe["tint"],
      order: u.order,
      homeWindow: u.homeWindow,
      scene: "scene" in u ? media(u.scene, l) : undefined,
      creature: "creature" in u ? u.creature : undefined,
    }))
    .sort((a, b) => a.order - b.order);
}

export async function getFeaturedBook(l: Locale): Promise<Book> {
  const b = featuredBook;
  return {
    slug: b.slug[l],
    title: b.title[l],
    subtitle: b.subtitle[l],
    ageGroup: b.ageGroup,
    cover: media(b.cover, l),
    blurb: b.blurb.map((p) => p[l]),
    year: b.year,
    isbn: b.isbn,
    storeLinks: [],
    universeSlug: universes[b.universe].slug[l],
    status: b.status,
  };
}

export async function getHomeArtworks(l: Locale): Promise<Artwork[]> {
  return homeArtworks.map((a) => ({
    slug: a.slug[l],
    title: a.title[l],
    technique: a.technique[l],
    kind: a.kind,
    images: a.images.map((m) => media(m, l)),
  }));
}

export async function getCounsellingPage(l: Locale): Promise<CounsellingPage> {
  return {
    teaserTitle: counselling.teaserTitle[l],
    teaserLead: counselling.teaserLead[l],
    formats: counselling.formats.map((f) => ({ kind: f.kind, title: f.title[l], line: f.line[l] })),
  };
}

/** Every locale's slug for one universe, so the language switch and static params can map between them */
export async function getUniverseSlugs(): Promise<Record<Locale, string>[]> {
  return universes.map((u) => ({ ...u.slug }));
}

export async function getBookSlugs(): Promise<Record<Locale, string>[]> {
  return [{ ...featuredBook.slug }];
}
