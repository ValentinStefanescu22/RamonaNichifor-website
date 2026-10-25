// The shapes the getters in content/index.ts return once a locale is resolved: every localized field is a plain string here.
import type { SerializedEditorState } from "lexical";
import type { Locale } from "@/i18n/routing";

/** Lexical state as Payload stores it; `components/page/RichText.tsx` renders it */
export type RichTextData = SerializedEditorState;
/** One doc's slug in every locale: the language switch maps between them */
export type SlugPair = Record<Locale, string>;

export type Media = { src: string; alt: string; width: number; height: number };

export type CreatureId = "buburuza" | "tantar" | "musca";

export type SiteSettings = {
  name: string;
  roles: string;
  rolesShort: string;
  souls: string;
  whisper: string;
  intro: string;
  series: string;
  seriesLead: string;
  /** Three lines; `emphasis` is the word set in magenta WONK italic */
  manifesto: { before: string; emphasis: string; after: string }[];
  /** The three paths below the hero */
  pillars: Record<"books" | "art" | "counselling", { title: string; line: string }>;
  contacts: {
    email: string;
    whatsapp: { href: string; number: string };
    instagram: { href: string; handle: string };
    facebook: { href: string; handle: string };
  };
  /** Every profile of hers, for Person.sameAs */
  sameAs: string[];
  portrait: Media;
  /** The home Artă section */
  artTeaser: { title: string; lead: string };
};

export type Universe = {
  slug: string;
  name: string;
  bookTitle: string;
  hook: string;
  status: "available" | "soon";
  /** Watercolour tint: [light, mid, deep] */
  tint: [string, string, string];
  order: number;
  /** What the home arch window shows: the hero meadow (the butterfly's perch), her cover scene, or the line creature */
  homeWindow: "meadow" | "scene" | "creature";
  scene?: Media;
  creature?: CreatureId;
};

export type Book = {
  slug: string;
  title: string;
  subtitle: string;
  ageGroup: "copii" | "adolescenti" | "adulti";
  cover: Media;
  blurb: string[];
  year: number;
  isbn: string;
  /** Empty until real store links exist („Comenzile online se pregătesc.”) */
  storeLinks: { store: string; url: string }[];
  universeSlug: string;
  status: "published" | "soon" | "writing";
};

export type Artwork = {
  slug: string;
  title: string;
  technique: string;
  kind: "original" | "print";
  images: Media[];
};

export type CounsellingPage = {
  teaserTitle: string;
  teaserLead: string;
  formats: { kind: "online" | "inPerson"; title: string; line: string }[];
};

/* ------------------------------------------------------------------ M3: inner pages */

export type BookCard = Book;
export type BookFull = Book & {
  pages: number | null;
  /** „A4, copertă cartonată lucioasă”; empty when not set */
  format: string;
  formats: { label: string; status: "available" | "soon" | "planned" }[];
  /** Răsfoiește: the back cover first, then the pages she chose (each whole, never cropped) */
  leafPages: (Media & { label: string })[];
  blurbRich: RichTextData | null;
};

export type ProductKind = "semn-de-carte" | "carti-de-joc" | "puzzle" | "joc-de-familie";
export type ProductCard = {
  slug: string;
  kind: ProductKind;
  name: string;
  status: "available" | "soon";
  universeSlug: string;
  /** The first photo; null while there are none („Imagine în curând”) */
  image: Media | null;
};
export type ProductFull = ProductCard & {
  description: RichTextData | null;
  paragraphs: string[];
  specs: { label: string; value: string }[];
  images: Media[];
  /** bookmarks → the fan of bookmarks, cards → the deck; null → plain images */
  gallery: "bookmarks" | "cards" | null;
  price: number | null;
  externalLink: string | null;
  universe: Universe;
};

export type UniverseFull = Universe & {
  story: RichTextData | null;
  /** The universe's book first, then its keepsakes, in the order of the shop */
  books: BookCard[];
  products: ProductCard[];
};

export type ArtworkFull = Artwork & {
  availability: "preorder" | "sold" | "onRequest";
  size: string;
  year: number | null;
  /** lei; null → „Preț în curând” */
  price: number | null;
  description: RichTextData | null;
};

export type Counselling = CounsellingPage & {
  tagline: string;
  intro: RichTextData | null;
  approach: RichTextData | null;
  patterns: {
    title: string;
    questions: string[];
    reactions: string[];
    thesis: string;
    path: string[];
    explain: string;
    change: string;
    closer: string;
    toward: string[];
  };
  rightForYou: { title: string; maybe: string[]; body: string[]; simply: string; here: string; offer: string[]; close: string };
  /** Empty price → shown without one */
  sessions: { minutes: number; priceEur: number | null }[];
  steps: { title: string; text: string }[];
  faq: { question: string; answer: RichTextData | null }[];
  ctaTitle: string;
};

export type About = {
  titleA: string;
  titleB: string;
  role: string;
  portrait: Media | null;
  bio: RichTextData | null;
  highlights: string[];
  /** Her story in its movements (usually four); a beat's text keeps „\n\n” where she broke the paragraph */
  story: { kind: "beat" | "question" | "closing"; text: string }[][];
  crafts: { title: string; items: { name: string; line: string; href: string; tint: string }[] };
};

export type BooksPage = {
  seriesNote: string;
  author: {
    title: string;
    paragraphs: string[];
    statement: string;
    formats: { label: string; status: "soon" | "planned"; line: string }[];
  };
};

export type CommunityEvent = {
  id: string;
  kind: "atelier-pictura" | "lansare" | "autografe" | "atelier-citit";
  title: string;
  audience: string;
  /** ISO date; null → „Datele, în curând” */
  startsAt: string | null;
  place: string;
  online: boolean;
  image: Media | null;
  signUpNote: string;
  timing: "upcoming" | "past";
};
export type CommunityProject = {
  id: string;
  title: string;
  line: string;
  image: Media | null;
  stage: "idee" | "in-pregatire" | "in-desfasurare" | "incheiat";
};
export type Partner = { id: string; name: string; handle: string; url: string; line: string; logo: Media | null };

export type CommunityPage = {
  titleA: string;
  titleB: string;
  tagline: string;
  lead: string;
  intro: string;
  eventsTitle: string;
  eventsLead: string;
  projectsTitle: string;
  projectsLead: string;
  partnersTitle: string;
  partnersLead: string[];
  closing: string;
  ctaTitle: string;
  ctaLine: string;
};
export type CommunityFull = CommunityPage & { events: CommunityEvent[]; projects: CommunityProject[]; partners: Partner[] };

export type ContactPage = { tagline: string };

export type LegalPage = { kind: "privacy" | "terms"; title: string; body: RichTextData | null; lastUpdated: string | null };
