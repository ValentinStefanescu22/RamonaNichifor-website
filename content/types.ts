// The shapes Payload will return (M2) once a locale is resolved: every localized field is a plain string here.
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
