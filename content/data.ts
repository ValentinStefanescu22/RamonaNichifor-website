// Local stand-in for the Payload documents (M2 imports this through the seed script). Copy from
// mockups/src/shared/content.ts, exactly as Ramona wrote it. Localized fields are { ro, en }.
// English book titles and the slugs of the unreleased universes are working copy awaiting her approval.
import type { Locale } from "@/i18n/routing";

type L = Record<Locale, string>;
const t = (ro: string, en: string): L => ({ ro, en });

export const site = {
  name: "Ramona Nichifor",
  roles: t("Autor · Ilustrator · Consilier pentru dezvoltare personală", "Author · Illustrator · Personal development counsellor"),
  rolesShort: t("Autor · Ilustrator · Consilier", "Author · Illustrator · Counsellor"),
  series: t("Magia suntem noi", "The Magic Is Us"),
  seriesLead: t(
    "O serie de povești blânde despre acceptare, iubire, curiozitate și emoții adevărate.",
    "A series of gentle stories about acceptance, love, curiosity and honest feelings.",
  ),
  souls: t("Povești pentru suflete mici și mari", "Stories for young and grown-up souls"),
  whisper: t("O poveste pentru copii… o șoaptă pentru adulți", "A story for children… a whisper for grown-ups"),
  intro: t(
    "Scriu povești, le pictez și însoțesc oameni în drumul spre ei înșiși.",
    "I write stories, paint them, and walk alongside people on their way back to themselves.",
  ),
  manifesto: [
    { before: t("Între rațiune și ", "Between reason and "), emphasis: t("intuiție", "intuition"), after: t(".", ".") },
    { before: t("Între cuvânt și ", "Between word and "), emphasis: t("imagine", "image"), after: t(".", ".") },
    { before: t("Între ceea ce știm și ceea ce ", "Between what we know and what we "), emphasis: t("simțim", "feel"), after: t(".", ".") },
  ],
  pillars: {
    books: {
      title: t("Cărți și universuri", "Books & universes"),
      line: t(
        "Povești ilustrate în acuarelă, fiecare cu universul ei de obiecte.",
        "Watercolour stories, each with its own universe of keepsakes.",
      ),
    },
    art: {
      title: t("Artă", "Art"),
      line: t(
        "Picturi originale și printuri, de aceeași mână care scrie poveștile.",
        "Original paintings and prints, by the same hand that writes the stories.",
      ),
    },
    counselling: {
      title: t("Consiliere", "Counselling"),
      line: t("Ședințe de dezvoltare personală, online sau față în față.", "Personal development sessions, online or in person."),
    },
  },
  contacts: {
    email: "ramona_nichifor@yahoo.com",
    whatsapp: { href: "https://wa.me/40730775132", number: "+40 730 775 132" },
    instagram: { href: "https://www.instagram.com/ramonanichifor.creations/", handle: "@ramonanichifor.creations" },
    facebook: { href: "https://www.facebook.com/ramona.nichifor/", handle: "Ramona Nichifor" },
  },
  portrait: { src: "/img/portrait.webp", alt: t("Ramona Nichifor", "Ramona Nichifor"), width: 899, height: 1599 },
  artTeaser: {
    title: t("Artă", "Art"),
    lead: t(
      "Originale și printuri. Fiecare lucrare pleacă de la o emoție, la fel ca poveștile.",
      "Originals and prints. Every piece starts from a feeling, just like the stories.",
    ),
  },
};

export const universes = [
  {
    slug: t("fluturele", "butterfly"),
    name: t("Universul Fluturelui", "The Butterfly Universe"),
    bookTitle: t("Fluturele dansator de step", "The Tap-Dancing Butterfly"),
    hook: t(
      "Un fluture care simte alt ritm decât ceilalți și învață să-și asculte vocea interioară.",
      "A butterfly who hears a different rhythm and learns to trust his inner voice.",
    ),
    status: "available",
    tint: ["#F8DCEB", "#E58FBF", "#9B3F7A"],
    order: 1,
    homeWindow: "meadow",
  },
  {
    slug: t("buburuza", "ladybird"),
    name: t("Universul Buburuzei", "The Ladybird Universe"),
    bookTitle: t("Buburuza rotunjoară", "The Roly-Poly Ladybird"),
    hook: t(
      "O buburuză rotunjoară care descoperă că adevărata magie izvorăște din iubirea și acceptarea de sine.",
      "A roly-poly ladybird who discovers that real magic springs from love and self-acceptance.",
    ),
    status: "available",
    tint: ["#FBE1DA", "#EE9B8C", "#A8483C"],
    order: 2,
    homeWindow: "scene",
    scene: { src: "/img/buburuza-scene.webp", alt: t("", ""), width: 720, height: 668 },
  },
  {
    slug: t("tantarul", "mosquito"),
    name: t("Universul Țânțarului", "The Mosquito Universe"),
    bookTitle: t("Țânțarul cu cizme de cauciuc", "The Mosquito in Rubber Boots"),
    hook: t("Povestea prinde contur în atelier.", "The story is taking shape in the studio."),
    status: "soon",
    tint: ["#DCE9F6", "#97BCE0", "#3F6A98"],
    order: 3,
    homeWindow: "creature",
    creature: "tantar",
  },
  {
    slug: t("musca", "fly"),
    name: t("Universul Muștei", "The Fly Universe"),
    bookTitle: t("Musca rătăcită", "The Wandering Fly"),
    hook: t("Povestea prinde contur în atelier.", "The story is taking shape in the studio."),
    status: "soon",
    tint: ["#E3EBDA", "#A9BE95", "#56704A"],
    order: 4,
    homeWindow: "creature",
    creature: "musca",
  },
] as const;

export const featuredBook = {
  slug: t("fluturele-dansator-de-step", "the-tap-dancing-butterfly"),
  title: t("Fluturele dansator de step", "The Tap-Dancing Butterfly"),
  subtitle: site.whisper,
  ageGroup: "copii",
  cover: { src: "/img/cover-fluturele.webp", alt: t("Fluturele dansator de step", "The Tap-Dancing Butterfly"), width: 766, height: 1120 },
  blurb: [
    t(
      "Într-o poiană magică și plină de culoare, un fluture simte un ritm diferit de al celorlalți. În timp ce toți se așteptau să zboare lin și grațios, inima lui visa la altceva.",
      "In a magical, colourful meadow, one butterfly feels a different rhythm from everyone else. While the others were expected to glide gently and gracefully, his heart dreamed of something else.",
    ),
    t(
      "Pentru copii, o poveste blândă despre încrederea în sine și curajul de a fi diferit. Pentru adulți, o reflecție despre a privi dincolo de frică, așteptări și tipare vechi.",
      "For children, a gentle story about self-belief and the courage to be different. For grown-ups, a reflection on looking past fear, expectations and old patterns.",
    ),
  ],
  year: 2026,
  isbn: "978-973-0-44382-0",
  storeLinks: [],
  universe: 0,
  status: "published",
} as const;

export const homeArtworks = [
  {
    slug: t("poiana-fluturelui", "the-butterflys-meadow"),
    title: t("Poiana fluturelui", "The butterfly's meadow"),
    technique: t("Ilustrația de copertă", "Cover illustration"),
    kind: "original",
    images: [{ src: "/img/cover-fluturele.webp", alt: t("Poiana fluturelui", "The butterfly's meadow"), width: 766, height: 1120 }],
  },
  {
    slug: t("buburuza-rotunjoara", "the-roly-poly-ladybird"),
    title: t("Buburuza rotunjoară", "The roly-poly ladybird"),
    technique: t("Ilustrația de copertă", "Cover illustration"),
    kind: "original",
    images: [{ src: "/img/cover-buburuza.webp", alt: t("Buburuza rotunjoară", "The roly-poly ladybird"), width: 758, height: 1120 }],
  },
] as const;

export const counselling = {
  teaserTitle: t("Consiliere pentru dezvoltare personală", "Personal development counselling"),
  teaserLead: t(
    "Un spațiu liniștit în care să te asculți. Lucrăm împreună, în ritmul tău, cu blândețe și claritate.",
    "A quiet space to listen to yourself. We work together, at your pace, with gentleness and clarity.",
  ),
  formats: [
    { kind: "online", title: t("Online", "Online"), line: t("Prin apel video, de oriunde ai fi.", "By video call, wherever you are.") },
    { kind: "inPerson", title: t("Față în față", "In person"), line: t("Într-un cadru cald și discret.", "In a warm, private setting.") },
  ],
} as const;
