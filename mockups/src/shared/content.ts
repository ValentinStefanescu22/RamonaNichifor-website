// All mockup copy, shaped like the future CMS documents (site settings, universes,
// books, art, counselling). Every visible string is { ro, en }; Romanian is the default.
// English book titles are working titles awaiting Ramona's approval.
// Links, handles and the email address are placeholders until the client sends real ones.

export type Lang = "ro" | "en";
export type Text = Record<Lang, string>;

const t = (ro: string, en: string): Text => ({ ro, en });

export const site = {
  name: "Ramona Nichifor",
  roles: t(
    "Autor · Ilustrator · Antreprenor · Consilier pentru dezvoltare personală",
    "Author · Illustrator · Entrepreneur · Personal development counsellor",
  ),
  rolesShort: t("Autor · Ilustrator · Consilier", "Author · Illustrator · Counsellor"),
  series: t("Magia suntem noi", "The Magic Is Us"),
  seriesLead: t(
    "O serie de povești blânde despre acceptare, iubire, curiozitate și emoții adevărate.",
    "A series of gentle stories about acceptance, love, curiosity and honest feelings.",
  ),
  souls: t("Povești pentru suflete mici și mari", "Stories for small and grown-up souls"),
  whisper: t("O poveste pentru copii… o șoaptă pentru adulți", "A story for children… a whisper for grown-ups"),
  intro: t(
    "Scriu povești, le pictez în acuarelă și însoțesc oameni în drumul spre ei înșiși.",
    "I write stories, paint them in watercolour, and walk alongside people on their way back to themselves.",
  ),
  /** Three lines; the middle item of each triple is the emphasised word. */
  manifesto: [
    { ro: ["Între rațiune și ", "intuiție", "."], en: ["Between reason and ", "intuition", "."] },
    { ro: ["Între cuvânt și ", "imagine", "."], en: ["Between word and ", "image", "."] },
    { ro: ["Între ceea ce știm și ceea ce ", "simțim", "."], en: ["Between what we know and what we ", "feel", "."] },
  ] satisfies Record<Lang, [string, string, string]>[],
  contact: {
    email: "contact@ramonanichifor.ro",
    instagram: { handle: "@ramonanichifor", href: "https://instagram.com/" },
    facebook: { handle: "Ramona Nichifor", href: "https://facebook.com/" },
    whatsapp: { label: "WhatsApp", href: "https://wa.me/" },
  },
};

export const nav = {
  home: t("Acasă", "Home"),
  universes: t("Universuri", "Universes"),
  books: t("Cărți", "Books"),
  art: t("Artă", "Art"),
  counselling: t("Consiliere", "Counselling"),
  about: t("Despre mine", "About me"),
  contact: t("Contact", "Contact"),
  menu: t("Meniu", "Menu"),
  close: t("Închide", "Close"),
};

export const ui = {
  comingSoon: t("În curând", "Coming soon"),
  available: t("Disponibilă", "Available"),
  buyAt: t("Cumpără de pe", "Buy on"),
  discover: t("Descoperă universul", "Explore the universe"),
  enterStory: t("Intră în poveste", "Step into the story"),
  readMore: t("Citește mai mult", "Read more"),
  askAboutPiece: t("Întreabă de o lucrare", "Ask about a piece"),
  bookConversation: t("Programează o discuție", "Book a conversation"),
  writeToMe: t("Scrie-mi", "Write to me"),
  copy: t("Copiază", "Copy"),
  copied: t("Copiat", "Copied"),
  notifyMe: t("Anunță-mă când apare", "Tell me when it's out"),
  inThisUniverse: t("În acest univers", "In this universe"),
  allUniverses: t("Toate universurile", "All universes"),
  exampleNote: t("Exemplu: picturile reale vin în curând", "Example: real paintings coming soon"),
  languageLabel: t("Limba site-ului", "Site language"),
  formats: t("În curând și ca e-book și audiobook.", "E-book and audiobook coming soon."),
};

export type UniverseId = "fluture" | "buburuza" | "tantar" | "musca";

export type Universe = {
  id: UniverseId;
  name: Text;
  book: Text;
  hook: Text;
  status: "available" | "soon";
  /** Soft watercolor tint per universe: [light, mid, deep] */
  tint: [string, string, string];
  items: { name: Text; status: "available" | "soon" }[];
};

const soonItems = [
  { name: t("Semn de carte", "Bookmark"), status: "soon" as const },
  { name: t("Cărți de joc", "Playing cards"), status: "soon" as const },
  { name: t("Poster ilustrat", "Illustrated poster"), status: "soon" as const },
];

export const universes: Universe[] = [
  {
    id: "fluture",
    name: t("Universul Fluturelui", "The Butterfly Universe"),
    book: t("Fluturele dansator de step", "The Tap-Dancing Butterfly"),
    hook: t(
      "Un fluture care simte alt ritm decât ceilalți și învață să-și asculte vocea interioară.",
      "A butterfly who hears a different rhythm and learns to trust his inner voice.",
    ),
    status: "available",
    tint: ["#F8DCEB", "#E58FBF", "#9B3F7A"],
    items: [{ name: t("Cartea", "The book"), status: "available" }, ...soonItems],
  },
  {
    id: "buburuza",
    name: t("Universul Buburuzei", "The Ladybird Universe"),
    book: t("Buburuza rotunjoară", "The Roly-Poly Ladybird"),
    hook: t("Povestea prinde contur în atelier.", "The story is taking shape in the studio."),
    status: "soon",
    tint: ["#FBE1DA", "#EE9B8C", "#A8483C"],
    items: [{ name: t("Cartea", "The book"), status: "soon" }, ...soonItems],
  },
  {
    id: "tantar",
    name: t("Universul Țânțarului", "The Mosquito Universe"),
    book: t("Țânțarul cu cizme de cauciuc", "The Mosquito in Rubber Boots"),
    hook: t("Povestea prinde contur în atelier.", "The story is taking shape in the studio."),
    status: "soon",
    tint: ["#DCE9F6", "#97BCE0", "#3F6A98"],
    items: [{ name: t("Cartea", "The book"), status: "soon" }, ...soonItems],
  },
  {
    id: "musca",
    name: t("Universul Muștei", "The Fly Universe"),
    book: t("Musca rătăcită", "The Wandering Fly"),
    hook: t("Povestea prinde contur în atelier.", "The story is taking shape in the studio."),
    status: "soon",
    tint: ["#E3EBDA", "#A9BE95", "#56704A"],
    items: [{ name: t("Cartea", "The book"), status: "soon" }, ...soonItems],
  },
];

export const book = {
  title: universes[0].book,
  subtitle: site.whisper,
  year: 2026,
  isbn: "978-973-0-44382-0",
  audience: t("Pentru copii", "For children"),
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
  stores: [
    { name: "eMAG", href: "https://www.emag.ro/" },
    { name: "Amazon", href: "https://www.amazon.com/" },
  ],
};

export const ages = [
  {
    id: "copii",
    label: t("Copii", "Children"),
    line: t("Povești ilustrate, de citit cu voce tare.", "Illustrated stories to read aloud."),
    count: 1,
  },
  {
    id: "adolescenti",
    label: t("Adolescenți", "Teens"),
    line: t("Primele titluri sunt în lucru.", "The first titles are in the works."),
    count: 0,
  },
  {
    id: "adulti",
    label: t("Adulți", "Adults"),
    line: t("Primele titluri sunt în lucru.", "The first titles are in the works."),
    count: 0,
  },
] as const;

export const pillars = {
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
};

export const art = {
  title: t("Artă", "Art"),
  lead: t(
    "Originale și printuri. Fiecare lucrare pleacă de la o emoție, la fel ca poveștile.",
    "Originals and prints. Every piece starts from a feeling, just like the stories.",
  ),
  pieces: [
    { src: "cover-fluturele.webp", title: t("Poiana fluturelui", "The butterfly's meadow"), kind: t("Ilustrația de copertă", "Cover illustration") },
    { src: "mug.webp", title: t("Cană din atelier", "Studio mug"), kind: t("Ceramică lucrată manual", "Handmade ceramic") },
    { src: "butterfly.webp", title: t("Fluturele", "The butterfly"), kind: t("Detaliu de copertă", "Cover detail") },
  ],
};

export const counselling = {
  title: t("Consiliere pentru dezvoltare personală", "Personal development counselling"),
  lead: t(
    "Un spațiu liniștit în care să te asculți. Lucrăm împreună, în ritmul tău, cu blândețe și claritate.",
    "A quiet space to listen to yourself. We work together, at your pace, with gentleness and clarity.",
  ),
  formats: [
    { title: t("Online", "Online"), line: t("Prin apel video, de oriunde ai fi.", "By video call, wherever you are.") },
    { title: t("Față în față", "In person"), line: t("Într-un cadru cald și discret.", "In a warm, private setting.") },
  ],
};

export type ConceptId = "poiana" | "jurnal" | "universuri";

export const concepts: { id: ConceptId; letter: string; name: Text; line: Text; href: string }[] = [
  {
    id: "poiana",
    letter: "A",
    name: t("Poiana", "The Meadow"),
    line: t(
      "Intri în poveste: poiana de pe copertă devine pagina, iar fluturele te conduce prin ea.",
      "You step into the story: the meadow from the cover becomes the page, and the butterfly leads you through it.",
    ),
    href: "poiana.html",
  },
  {
    id: "jurnal",
    letter: "B",
    name: t("Jurnalul", "The Journal"),
    line: t(
      "Pagini dintr-un jurnal de atelier: o fotografie lipită, note scrise de mână, capitole.",
      "Pages from a studio journal: a taped-in photo, handwritten notes, chapters.",
    ),
    href: "jurnal.html",
  },
  {
    id: "universuri",
    letter: "C",
    name: t("Universuri", "Universes"),
    line: t(
      "O hartă a lumilor: fiecare personaj e o lume pe care o deschizi cu o atingere.",
      "A map of worlds: each character is a world you open with a tap.",
    ),
    href: "universuri.html",
  },
];

export const mockupNote = {
  chip: t("machetă", "mockup"),
  all: t("Toate conceptele", "All concepts"),
  placeholders: t(
    "Linkurile, adresele și unele imagini sunt provizorii.",
    "Links, addresses and some images are placeholders.",
  ),
};
