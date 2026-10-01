// Copy for the inner pages (Despre, Consiliere, Cărți, Artă, Contact, Comunitate), shaped like
// the future CMS documents. Every visible string is { ro, en }; Romanian is the default.
//
// PLACEHOLDER: everything flagged `placeholder: true` (and every block under a PLACEHOLDER banner)
// is stand-in content so the pages can be designed at real density. Replace it with Ramona's
// real texts, books, artworks, prices and dates; the components need no changes.

import { universes, type Text, type UniverseId } from "./content";

const t = (ro: string, en: string): Text => ({ ro, en });

/* ---------------------------------------------------------------- Despre mine */

export const about = {
  title: [t("Despre", "About"), t("mine", "me")] as const,
  // PLACEHOLDER: long bio
  bio: [
    t(
      "Am crescut printre cărți și creioane colorate, convinsă că orice emoție are o culoare și orice culoare are o poveste. Am păstrat convingerea asta și ca adult, chiar și atunci când viața m-a dus pe drumuri care păreau departe de pensule.",
      "I grew up among books and coloured pencils, convinced that every feeling has a colour and every colour has a story. I kept that belief as a grown-up, even when life took me down roads that seemed far from any brush.",
    ),
    t(
      "Am lucrat ani buni cu oameni, în echipe și proiecte, și am învățat că cele mai importante conversații sunt cele pe care le avem cu noi înșine. Așa am ajuns la dezvoltarea personală și, de acolo, la consiliere.",
      "For years I worked with people, in teams and projects, and learned that the most important conversations are the ones we have with ourselves. That is how I came to personal development and, from there, to counselling.",
    ),
    t(
      "Poveștile au venit apoi aproape de la sine. Le scriu pentru copii, dar le gândesc și pentru adulții care le citesc cu voce tare. Le pictez în acuarelă, pentru că acuarela, ca și emoțiile, nu se lasă controlată până la capăt.",
      "The stories came almost on their own after that. I write them for children, but I also write them for the grown-ups reading them aloud. I paint them in watercolour, because watercolour, like feelings, never lets itself be fully controlled.",
    ),
    t(
      "Astăzi, scrisul, pictura și consilierea sunt pentru mine trei feluri de a spune același lucru: că fiecare dintre noi are un ritm al lui și merită să fie ascultat.",
      "Today, writing, painting and counselling are three ways of saying the same thing: that each of us has a rhythm of our own and deserves to be heard.",
    ),
  ],
  bioPlaceholder: true,
  signature: "Ramona",
  crafts: {
    title: t("Trei meșteșuguri, o singură mână", "Three crafts, one hand"),
    items: [
      {
        id: "carti",
        name: t("Povești", "Stories"),
        line: t("Cărți ilustrate pentru copii, cu o șoaptă pentru adulți.", "Illustrated books for children, with a whisper for grown-ups."),
        href: "carti.html",
        tint: "#f3c9dc",
      },
      {
        id: "arta",
        name: t("Pictură", "Painting"),
        line: t("Acuarele, printuri și ceramică lucrată manual.", "Watercolours, prints and handmade ceramics."),
        href: "arta.html",
        tint: "#c8daf0",
      },
      {
        id: "consiliere",
        name: t("Consiliere", "Counselling"),
        line: t("Un spațiu liniștit în care să te asculți.", "A quiet space to listen to yourself."),
        href: "consiliere.html",
        tint: "#d4e2c6",
      },
    ],
  },
  findMe: t("Unde mă găsești", "Where to find me"),
};

/* ---------------------------------------------------------------- Consiliere */

export const counsellingPage = {
  tagline: t("Un spațiu liniștit în care să te asculți.", "A quiet space to listen to yourself."),
  approachTitle: t("Cum lucrez", "How I work"),
  // PLACEHOLDER: approach
  approach: [
    t(
      "Nu vin cu rețete. Vin cu întrebări, cu răbdare și cu încrederea că știi deja mai mult decât crezi. Lucrăm împreună, în ritmul tău, cu blândețe și claritate.",
      "I don't bring recipes. I bring questions, patience and the trust that you already know more than you think. We work together, at your pace, with gentleness and clarity.",
    ),
    t(
      "Ședințele sunt pentru momentele în care simți că te-ai pierdut puțin pe drum: o schimbare, o decizie grea, o oboseală care nu trece sau dorința de a te cunoaște mai bine.",
      "Sessions are for the times you feel a little lost along the way: a change, a hard decision, a tiredness that won't lift, or simply the wish to know yourself better.",
    ),
  ],
  // PLACEHOLDER: durations and prices
  formats: [
    {
      id: "online",
      title: t("Online", "Online"),
      line: t("Prin apel video, de oriunde ai fi.", "By video call, wherever you are."),
      detail: t("50 de minute · 250 lei", "50 minutes · 250 lei"),
      placeholder: true,
    },
    {
      id: "fata",
      title: t("Față în față", "In person"),
      line: t("Într-un cadru cald și discret, în București.", "In a warm, private setting in Bucharest."),
      detail: t("60 de minute · 300 lei", "60 minutes · 300 lei"),
      placeholder: true,
    },
  ],
  stepsTitle: t("Cum decurge", "How it goes"),
  // PLACEHOLDER: steps
  steps: [
    { title: t("Îmi scrii", "You write to me"), line: t("Pe WhatsApp sau pe email, câteva rânduri despre ce te aduce aici.", "On WhatsApp or by email, a few lines about what brings you here.") },
    { title: t("O primă discuție", "A first conversation"), line: t("15 minute, fără cost, ca să vedem dacă ne potrivim.", "15 minutes, free of charge, to see if we're a good fit.") },
    { title: t("Ședințele", "The sessions"), line: t("Ne întâlnim online sau față în față, de obicei o dată pe săptămână.", "We meet online or in person, usually once a week.") },
    { title: t("Pașii tăi", "Your own steps"), line: t("Între ședințe, mici exerciții de scris sau de observat, doar dacă îți folosesc.", "Between sessions, small writing or noticing exercises, only if they help.") },
  ],
  faqTitle: t("Întrebări frecvente", "Frequently asked questions"),
  // PLACEHOLDER: FAQ
  faq: [
    {
      q: t("Cum știu dacă consilierea e pentru mine?", "How do I know if counselling is for me?"),
      a: t("Dacă simți nevoia să vorbești cu cineva care te ascultă fără să te judece, e un semn bun. Prima discuție e tocmai pentru a afla asta împreună.", "If you feel the need to talk to someone who listens without judging, that's a good sign. The first conversation is there to find out together."),
    },
    {
      q: t("Cât durează o ședință?", "How long is a session?"),
      a: t("O ședință online durează 50 de minute, iar una față în față 60 de minute.", "An online session lasts 50 minutes and an in-person one 60 minutes."),
    },
    {
      q: t("Cât costă?", "How much does it cost?"),
      a: t("Prima discuție, de 15 minute, este gratuită. Ședințele costă 250 de lei online și 300 de lei față în față.", "The first 15-minute conversation is free. Sessions cost 250 lei online and 300 lei in person."),
    },
    {
      q: t("Cum se desfășoară ședințele online?", "How do online sessions work?"),
      a: t("Pe un apel video, dintr-un loc liniștit în care te simți în siguranță. Îți trimit linkul cu o zi înainte.", "On a video call, from a quiet place where you feel safe. I send you the link the day before."),
    },
    {
      q: t("Ce se întâmplă cu ce îmi împărtășești?", "What happens to what I share?"),
      a: t("Rămâne între noi. Confidențialitatea este baza oricărei ședințe.", "It stays between us. Confidentiality is the ground every session stands on."),
    },
    {
      q: t("Pot reprograma o ședință?", "Can I reschedule a session?"),
      a: t("Da, cu cel puțin 24 de ore înainte, fără niciun cost.", "Yes, at least 24 hours ahead, at no cost."),
    },
  ],
  ctaTitle: t("Primul pas e o conversație.", "The first step is a conversation."),
  whatsappLink: t("Scrie-mi pe WhatsApp", "Message me on WhatsApp"),
};

/* ---------------------------------------------------------------- Cărți */

export type AgeId = "copii" | "adolescenti" | "adulti";
export type BookStatus = "available" | "soon" | "writing";

export type ShelfBook = {
  id: string;
  title: Text;
  line: Text;
  age: AgeId;
  status: BookStatus;
  year?: number;
  /** Real cover image, if there is one */
  cover?: string;
  /** Tint for the painted placeholder cover */
  tint: [string, string, string];
  universe?: UniverseId;
  href?: string;
  placeholder?: boolean;
};

export const booksPage = {
  seriesNote: t("Seria „Magia suntem noi”", "The „Magic Is Us” series"),
  status: {
    available: t("Disponibilă", "Available"),
    soon: t("În curând", "Coming soon"),
    writing: t("În lucru", "In the works"),
  },
  formatsTitle: t("Formate", "Formats"),
  formats: t(
    "Toate cărțile apar tipărite, iar în curând și ca e-book și audiobook, în română și engleză.",
    "Every book comes out in print, and soon as an e-book and audiobook, in Romanian and English.",
  ),
  where: t("Unde găsești cărțile", "Where to find the books"),
};

export const shelf: ShelfBook[] = [
  {
    id: "fluturele",
    title: t("Fluturele dansator de step", "The Tap-Dancing Butterfly"),
    line: t("Un fluture care simte alt ritm decât ceilalți.", "A butterfly who hears a different rhythm."),
    age: "copii",
    status: "available",
    year: 2026,
    cover: "cover-fluturele.webp",
    tint: ["#F8DCEB", "#E58FBF", "#9B3F7A"],
    universe: "fluture",
    href: "carte.html",
  },
  {
    id: "buburuza",
    title: t("Buburuza rotunjoară", "The Roly-Poly Ladybird"),
    line: t("Povestea prinde contur în atelier.", "The story is taking shape in the studio."),
    age: "copii",
    status: "soon",
    tint: ["#FBE1DA", "#EE9B8C", "#A8483C"],
    universe: "buburuza",
  },
  {
    id: "tantar",
    title: t("Țânțarul cu cizme de cauciuc", "The Mosquito in Rubber Boots"),
    line: t("Povestea prinde contur în atelier.", "The story is taking shape in the studio."),
    age: "copii",
    status: "soon",
    tint: ["#DCE9F6", "#97BCE0", "#3F6A98"],
    universe: "tantar",
  },
  {
    id: "musca",
    title: t("Musca rătăcită", "The Wandering Fly"),
    line: t("Povestea prinde contur în atelier.", "The story is taking shape in the studio."),
    age: "copii",
    status: "soon",
    tint: ["#E3EBDA", "#A9BE95", "#56704A"],
    universe: "musca",
  },
  // PLACEHOLDER: teen and adult titles
  {
    id: "vara",
    title: t("Vara în care am crescut", "The Summer I Grew Up"),
    line: t("Un jurnal despre prietenie, curaj și primele alegeri.", "A diary about friendship, courage and first choices."),
    age: "adolescenti",
    status: "writing",
    tint: ["#E9E1F6", "#B9A3E0", "#5C4590"],
    placeholder: true,
  },
  {
    id: "oglinda",
    title: t("Oglinda din pod", "The Mirror in the Attic"),
    line: t("O poveste despre cum ne vedem și cum ne văd ceilalți.", "A story about how we see ourselves and how others see us."),
    age: "adolescenti",
    status: "writing",
    tint: ["#F6E4D6", "#E3B08A", "#8F5A33"],
    placeholder: true,
  },
  {
    id: "intre",
    title: t("Între rațiune și intuiție", "Between Reason and Intuition"),
    line: t("Scrisori despre a te asculta pe tine.", "Letters on listening to yourself."),
    age: "adulti",
    status: "writing",
    tint: ["#DFE7D4", "#A9BE95", "#4B6340"],
    placeholder: true,
  },
  {
    id: "scrisori",
    title: t("Scrisori către mine", "Letters to Myself"),
    line: t("Un caiet de reflecții, de completat încet.", "A book of reflections, to be filled in slowly."),
    age: "adulti",
    status: "writing",
    tint: ["#F6DDE6", "#D99AB4", "#8A3D63"],
    placeholder: true,
  },
];

// Every book has its page; the available Fluture book keeps the plain carte.html as its canonical URL.
for (const b of shelf) b.href = b.id === "fluturele" ? "carte.html" : `carte.html#${b.id}`;

export const bookOf = (u: UniverseId) => shelf.find((b) => b.universe === u)!;

/* ---------------------------------------------------------------- Products (universe keepsakes) */

export type ProductKind = "semn" | "carti" | "poster";
export const productKinds: ProductKind[] = ["semn", "carti", "poster"];

export type Product = {
  id: string;
  universe: UniverseId;
  kind: ProductKind;
  name: Text;
  description: Text[];
  specs: { label: Text; value: Text }[];
  price: string;
  status: "soon";
  placeholder: true;
};

// PLACEHOLDER: product texts, materials, sizes and prices
const kindCopy: Record<ProductKind, { name: Text; description: Text[]; material: Text; size: Text; price: string }> = {
  semn: {
    name: t("Semn de carte", "Bookmark"),
    description: [
      t(
        "Un semn de carte ilustrat cu personajul poveștii, ca să-ți păstrezi locul între pagini și să-ți amintești de el între două seri de citit.",
        "A bookmark illustrated with the story's character, to keep your place between the pages and remember it between two evenings of reading.",
      ),
    ],
    material: t("Carton gros, mat, cu panglică", "Thick matte card with a ribbon"),
    size: t("5 × 18 cm", "5 × 18 cm"),
    price: "15 lei",
  },
  carti: {
    name: t("Cărți de joc", "Playing cards"),
    description: [
      t(
        "Un pachet de cărți cu personajele universului, pentru jocuri în familie și pentru povești inventate împreună, seară de seară.",
        "A deck with the universe's characters, for family games and for stories made up together, evening after evening.",
      ),
    ],
    material: t("Carton plastifiat, 36 de cărți", "Coated card, 36 cards"),
    size: t("6 × 9 cm", "6 × 9 cm"),
    price: "45 lei",
  },
  poster: {
    name: t("Poster ilustrat", "Illustrated poster"),
    description: [
      t(
        "Ilustrația din carte, tipărită pe hârtie de artă, gata să aducă poiana în camera copilului.",
        "The illustration from the book, printed on art paper, ready to bring the meadow into a child's room.",
      ),
    ],
    material: t("Hârtie de artă, 250 g", "Art paper, 250 gsm"),
    size: t("A3 · 30 × 42 cm", "A3 · 30 × 42 cm"),
    price: "70 lei",
  },
};

export const productPage = {
  labels: { material: t("Material", "Material"), size: t("Dimensiuni", "Size"), price: t("Preț", "Price") },
  sameUniverse: t("Din același univers", "From the same universe"),
  pricePending: t("Preț estimativ", "Estimated price"),
};

export const products: Product[] = universes.flatMap((u) =>
  productKinds.map((k) => ({
    id: `${u.id}-${k}`,
    universe: u.id,
    kind: k,
    name: kindCopy[k].name,
    description: kindCopy[k].description,
    specs: [
      { label: productPage.labels.material, value: kindCopy[k].material },
      { label: productPage.labels.size, value: kindCopy[k].size },
    ],
    price: kindCopy[k].price,
    status: "soon" as const,
    placeholder: true as const,
  })),
);

export const productHref = (p: { id: string }) => `produs.html#${p.id}`;

/** A universe's items in order (book, bookmark, cards, poster) → the page each one opens */
export const itemHref = (u: UniverseId, index: number) =>
  index === 0 ? bookOf(u).href! : productHref({ id: `${u}-${productKinds[index - 1]}` });

/* ---------------------------------------------------------------- Carte (book page) */

export const bookPage = {
  back: t("Toate cărțile", "All books"),
  // PLACEHOLDER: age range, pages, format
  meta: [
    { label: t("Vârstă", "Age"), value: t("4–8 ani", "4–8 years"), placeholder: true },
    { label: t("Anul", "Year"), value: t("2026", "2026") },
    { label: t("Pagini", "Pages"), value: t("32", "32"), placeholder: true },
    { label: t("Format", "Format"), value: t("Copertă cartonată, 21 × 28 cm", "Hardcover, 21 × 28 cm"), placeholder: true },
    { label: t("ISBN", "ISBN"), value: t("978-973-0-44382-0", "978-973-0-44382-0") },
  ],
  // PLACEHOLDER: details for books that are not out yet
  placeholderBlurb: t(
    "Povestea prinde contur în atelier. Aici vei găsi despre ce este cartea, pentru cine și ce emoții atinge, imediat ce e gata.",
    "The story is taking shape in the studio. This is where you'll read what the book is about, who it's for and which feelings it touches, as soon as it's ready.",
  ),
  ageRange: { copii: t("4–8 ani", "4–8 years"), adolescenti: t("12–16 ani", "12–16 years"), adulti: t("Adulți", "Adults") },
  toBeAnnounced: t("Se anunță", "To be announced"),
  moreBooks: t("Mai multe cărți", "More books"),
  leaf: t("Răsfoiește", "Leaf through"),
  leafNote: t("Pagini din carte, în curând.", "Pages from the book, coming soon."),
  universe: t("Universul cărții", "The book's universe"),
  series: t("Din aceeași serie", "From the same series"),
};

/* ---------------------------------------------------------------- Artă */

export type ArtKind = "original" | "print" | "ceramica";
export type Availability = "available" | "sold" | "onRequest";

export type Artwork = {
  id: string;
  title: Text;
  kind: ArtKind;
  technique: Text;
  size: string;
  year: number;
  availability: Availability;
  price?: string;
  /** Real image, if there is one */
  src?: string;
  /** Painted placeholder: tints and frame proportion (width / height) */
  wash?: [string, string, string];
  ratio: number;
  placeholder?: boolean;
};

export const artPage = {
  tagline: t("Originale, printuri și ceramică.", "Originals, prints and ceramics."),
  filters: [
    { id: "all" as const, label: t("Toate", "All") },
    { id: "original" as const, label: t("Originale", "Originals") },
    { id: "print" as const, label: t("Printuri", "Prints") },
    { id: "ceramica" as const, label: t("Ceramică", "Ceramics") },
  ],
  kind: {
    original: t("Original", "Original"),
    print: t("Print", "Print"),
    ceramica: t("Ceramică", "Ceramics"),
  },
  availability: {
    available: t("Disponibilă", "Available"),
    sold: t("Vândută", "Sold"),
    onRequest: t("La cerere", "On request"),
  },
  labels: { technique: t("Tehnică", "Technique"), size: t("Dimensiuni", "Size"), year: t("Anul", "Year"), price: t("Preț", "Price") },
  ask: t("Întreabă de această lucrare", "Ask about this piece"),
  close: t("Închide", "Close"),
  commissionTitle: t("Lucrări la comandă", "Commissions"),
  // PLACEHOLDER: commission note
  commission: t(
    "Pictez și la comandă: un portret al copilului tău într-un univers de poveste, o ilustrație pentru o ocazie specială sau o cană pictată pentru cineva drag.",
    "I also paint on commission: a portrait of your child inside a storybook world, an illustration for a special occasion, or a painted mug for someone you love.",
  ),
};

export const artworks: Artwork[] = [
  { id: "poiana", title: t("Poiana fluturelui", "The butterfly's meadow"), kind: "print", technique: t("Print după acuarelă", "Print of a watercolour"), size: "30 × 42 cm", year: 2026, availability: "available", price: "180 lei", src: "cover-fluturele.webp", ratio: 766 / 1120, placeholder: true },
  // PLACEHOLDER: artworks from here on
  { id: "dimineata", title: t("Lumină de dimineață", "Morning light"), kind: "original", technique: t("Acuarelă pe hârtie", "Watercolour on paper"), size: "30 × 40 cm", year: 2025, availability: "available", price: "900 lei", wash: ["#fbe3c9", "#f3b9c9", "#c9b8e6"], ratio: 3 / 4, placeholder: true },
  { id: "cana", title: t("Cană din atelier", "Studio mug"), kind: "ceramica", technique: t("Ceramică pictată manual", "Hand-painted ceramic"), size: "Ø 9 cm", year: 2025, availability: "onRequest", src: "mug.webp", ratio: 1, placeholder: true },
  { id: "lavanda", title: t("Ploaie de lavandă", "Lavender rain"), kind: "original", technique: t("Acuarelă și tuș", "Watercolour and ink"), size: "40 × 30 cm", year: 2025, availability: "sold", wash: ["#e6dcf5", "#b9a3e0", "#7a5fb0"], ratio: 4 / 3, placeholder: true },
  { id: "zbor", title: t("Liniștea dinaintea zborului", "The quiet before flight"), kind: "original", technique: t("Acuarelă pe hârtie", "Watercolour on paper"), size: "24 × 32 cm", year: 2026, availability: "available", price: "750 lei", src: "butterfly.webp", ratio: 4 / 5, placeholder: true },
  { id: "gradina", title: t("Grădina bunicii", "Grandma's garden"), kind: "print", technique: t("Print giclée", "Giclée print"), size: "A3", year: 2025, availability: "available", price: "150 lei", wash: ["#dfe7d4", "#a9be95", "#f6dde6"], ratio: 3 / 4, placeholder: true },
  { id: "nor", title: t("Norul timid", "The shy cloud"), kind: "print", technique: t("Print după acuarelă", "Print of a watercolour"), size: "A4", year: 2026, availability: "available", price: "90 lei", wash: ["#dce9f6", "#97bce0", "#f6dde6"], ratio: 1, placeholder: true },
  { id: "bol", title: t("Bol cu flori de câmp", "Wildflower bowl"), kind: "ceramica", technique: t("Ceramică smălțuită", "Glazed ceramic"), size: "Ø 16 cm", year: 2026, availability: "available", price: "220 lei", wash: ["#f6e4d6", "#e3b08a", "#c9b8e6"], ratio: 1, placeholder: true },
  { id: "apus", title: t("Poiana la apus", "Meadow at dusk"), kind: "original", technique: t("Acuarelă pe hârtie", "Watercolour on paper"), size: "50 × 35 cm", year: 2026, availability: "onRequest", wash: ["#f6dde6", "#e58fbf", "#7a5fb0"], ratio: 10 / 7, placeholder: true },
];

/* ---------------------------------------------------------------- Contact */

export type SubjectId = "carte" | "arta" | "consiliere" | "comunitate" | "altceva";

export const contactPage = {
  tagline: t(
    "Îmi poți scrie despre o carte, o lucrare, o ședință sau o întâlnire.",
    "Write to me about a book, a piece of art, a session or a gathering.",
  ),
  formTitle: t("Trimite un mesaj", "Send a message"),
  fields: {
    name: t("Numele tău", "Your name"),
    email: t("Adresa de email", "Email address"),
    subject: t("Despre ce vrei să vorbim?", "What would you like to talk about?"),
    message: t("Mesajul tău", "Your message"),
    messageHint: t("Câteva rânduri sunt de ajuns.", "A few lines are plenty."),
    consent: t(
      "Am cel puțin 16 ani și sunt de acord ca Ramona să folosească aceste date doar pentru a-mi răspunde.",
      "I am at least 16 and agree that Ramona may use these details only to reply to me.",
    ),
  },
  subjects: [
    { id: "carte" as const, label: t("O carte", "A book") },
    { id: "arta" as const, label: t("Artă", "Art") },
    { id: "consiliere" as const, label: t("Consiliere", "Counselling") },
    { id: "comunitate" as const, label: t("Comunitate", "Community") },
    { id: "altceva" as const, label: t("Altceva", "Something else") },
  ],
  errors: {
    name: t("Scrie-mi cum te numești.", "Tell me your name."),
    email: t("Adresa de email pare incompletă. Verifică dacă are @ și un domeniu.", "That email looks incomplete. Check it has an @ and a domain."),
    message: t("Scrie câteva cuvinte, ca să știu cum te pot ajuta.", "Write a few words so I know how to help."),
    consent: t("Bifează confirmarea, ca să-ți pot răspunde.", "Tick the confirmation so I can reply."),
    summary: t("Mai sunt câteva câmpuri de completat.", "A few fields still need attention."),
  },
  send: t("Trimite mesajul", "Send message"),
  success: {
    title: t("Mulțumesc!", "Thank you!"),
    body: t(
      "Aceasta este o machetă, așa că mesajul nu a fost trimis. În site-ul real, ajunge direct la Ramona.",
      "This is a mockup, so the message was not sent. On the real site it goes straight to Ramona.",
    ),
    again: t("Scrie alt mesaj", "Write another message"),
  },
  otherWays: t("Sau găsește-mă aici", "Or find me here"),
  // PLACEHOLDER: response time
  reply: t("Răspund de obicei în 2–3 zile lucrătoare.", "I usually reply within 2–3 working days."),
};

/* ---------------------------------------------------------------- Comunitate cu sens */

export const community = {
  title: [t("Comunitate", "Community"), t("cu sens", "with meaning")] as const,
  lead: t(
    "Un loc în care poveștile ies din cărți: ne adunăm să citim, să desenăm, să vorbim despre emoții și să facem lucruri bune împreună.",
    "A place where stories step out of the books: we gather to read, draw, talk about feelings and do good things together.",
  ),
  eventsTitle: t("Întâlniri", "Gatherings"),
  eventsLead: t("Ateliere, cercuri de discuție și lecturi, în oraș sau online.", "Workshops, discussion circles and readings, in town or online."),
  join: t("Mă înscriu", "Sign me up"),
  projectsTitle: t("Proiecte cu sens", "Projects with meaning"),
  projectsLead: t("Povești care ajung acolo unde e cea mai mare nevoie de ele.", "Stories that reach the places that need them most."),
  ctaTitle: t("Vreau să aflu primul", "Tell me first"),
  ctaLine: t(
    "Anunț întâlnirile noi pe Instagram. Ai o idee de proiect? Scrie-mi.",
    "I announce new gatherings on Instagram. Have an idea for a project? Write to me.",
  ),
  follow: t("Urmărește pe Instagram", "Follow on Instagram"),
  propose: t("Propune un proiect", "Suggest a project"),
  partnersTitle: t("Parteneri", "Partners"),
  partnersLead: t("Oameni și locuri alături de care poveștile ajung mai departe.", "People and places that help the stories travel further."),
  partnerInvite: t("Vrei să fim parteneri? Scrie-mi", "Want to partner up? Write to me"),
  partners: [
    {
      id: "ava",
      name: "AVA Art & Soul",
      handle: "@ava.art.soul",
      url: "https://www.instagram.com/ava.art.soul/",
      // PLACEHOLDER: description and logo arrive from the client
      line: t(
        "Un spațiu pentru artă și suflet, alături de care creștem întâlnirile comunității.",
        "A space for art and soul, alongside whom the community's gatherings grow.",
      ),
      logo: undefined as string | undefined,
      placeholder: true,
    },
  ],
  // PLACEHOLDER: events
  events: [
    {
      id: "atelier-povesti",
      day: "14",
      month: t("noi.", "Nov"),
      weekday: t("sâmbătă, 11:00", "Saturday, 11:00"),
      title: t("Atelier de povești și acuarelă", "Story and watercolour workshop"),
      audience: t("Pentru copii de 5–8 ani, cu un părinte", "For children aged 5–8, with a parent"),
      place: t("Librărie parteneră, București", "Partner bookshop, Bucharest"),
      kind: t("Atelier", "Workshop"),
      tint: "#f3c9dc",
      placeholder: true,
    },
    {
      id: "cerc-parinti",
      day: "20",
      month: t("noi.", "Nov"),
      weekday: t("joi, 19:00", "Thursday, 19:00"),
      title: t("Cerc de discuție pentru părinți", "Discussion circle for parents"),
      audience: t("Despre emoțiile mari ale copiilor mici", "On the big feelings of small children"),
      place: t("Online", "Online"),
      kind: t("Cerc", "Circle"),
      tint: "#d4e2c6",
      placeholder: true,
    },
    {
      id: "lectura",
      day: "06",
      month: t("dec.", "Dec"),
      weekday: t("sâmbătă, 16:00", "Saturday, 16:00"),
      title: t("Lectură de Moș Nicolae", "St Nicholas reading"),
      audience: t("„Fluturele dansator de step”, citită cu voce tare", "„The Tap-Dancing Butterfly”, read aloud"),
      place: t("Bibliotecă de cartier, București", "Neighbourhood library, Bucharest"),
      kind: t("Lectură", "Reading"),
      tint: "#c8daf0",
      placeholder: true,
    },
    {
      id: "acuarela-adulti",
      day: "17",
      month: t("ian.", "Jan"),
      weekday: t("sâmbătă, 10:00", "Saturday, 10:00"),
      title: t("Acuarelă pentru adulți care „nu știu să deseneze”", "Watercolour for grown-ups who „can't draw”"),
      audience: t("Pentru începători, materiale incluse", "For beginners, materials included"),
      place: t("Atelierul Ramonei", "Ramona's studio"),
      kind: t("Atelier", "Workshop"),
      tint: "#e6dcf5",
      placeholder: true,
    },
  ],
  // PLACEHOLDER: projects
  projects: [
    {
      id: "carte-clasa",
      title: t("O carte pentru fiecare clasă", "A book for every classroom"),
      line: t(
        "Pentru fiecare carte vândută, o carte ajunge într-o școală din mediul rural, împreună cu un ghid pentru învățători.",
        "For every book sold, one goes to a rural school, together with a guide for teachers.",
      ),
      status: t("În pregătire", "In preparation"),
      wash: ["#fbe3c9", "#f3b9c9", "#e6dcf5"] as [string, string, string],
      placeholder: true,
    },
    {
      id: "povesti-spital",
      title: t("Povești în spital", "Stories in hospital"),
      line: t(
        "Lecturi și ateliere de desen pentru copiii internați, alături de voluntari.",
        "Readings and drawing workshops for children in hospital, with volunteers.",
      ),
      status: t("În pregătire", "In preparation"),
      wash: ["#dce9f6", "#97bce0", "#dfe7d4"] as [string, string, string],
      placeholder: true,
    },
    {
      id: "centre-zi",
      title: t("Ateliere în centre de zi", "Workshops in day centres"),
      line: t(
        "Întâlniri lunare despre emoții, prin povești și culoare, pentru copii din centre de zi.",
        "Monthly sessions on feelings, through stories and colour, for children in day centres.",
      ),
      status: t("Idee în lucru", "Idea in progress"),
      wash: ["#dfe7d4", "#a9be95", "#f6dde6"] as [string, string, string],
      placeholder: true,
    },
  ],
};

/* ---------------------------------------------------------------- Programări (booking) */

export type FormatId = "intro" | "online" | "fata";

export const booking = {
  title: t("Programează o ședință", "Book a session"),
  lead: t(
    "Alege formatul, ziua și ora care ți se potrivesc. Confirmarea vine pe email, împreună cu invitația în calendar.",
    "Choose the format, day and time that suit you. The confirmation arrives by email, with a calendar invitation.",
  ),
  cta: t("Programează o ședință", "Book a session"),
  steps: {
    format: t("Formatul", "Format"),
    day: t("Ziua", "Day"),
    time: t("Ora", "Time"),
    details: t("Datele tale", "Your details"),
  },
  // PLACEHOLDER: durations and prices (the same as on the page above)
  formats: [
    { id: "intro" as FormatId, title: t("Primă discuție", "First conversation"), detail: t("15 min · gratuit", "15 min · free"), minutes: 15 },
    { id: "online" as FormatId, title: t("Online", "Online"), detail: t("50 min · 250 lei", "50 min · 250 lei"), minutes: 50 },
    { id: "fata" as FormatId, title: t("Față în față", "In person"), detail: t("60 min · 300 lei", "60 min · 300 lei"), minutes: 60 },
  ],
  timezone: t("Ora României", "Romania time"),
  prev: t("Luna anterioară", "Previous month"),
  next: t("Luna următoare", "Next month"),
  noSlots: t("În ziua asta nu mai sunt ore libere. Alege altă zi.", "No free times left that day. Pick another day."),
  pickDay: t("Alege o zi din calendar.", "Pick a day in the calendar."),
  fields: {
    phone: t("Telefon (opțional)", "Phone (optional)"),
    note: t("Câteva rânduri despre ce te aduce (opțional)", "A few lines about what brings you (optional)"),
  },
  submit: t("Confirmă programarea", "Confirm booking"),
  change: t("Schimbă", "Change"),
  success: {
    title: t("Ne vedem curând!", "See you soon!"),
    body: t(
      "Aceasta este o machetă, așa că programarea nu a fost făcută. În site-ul real primești confirmarea pe email și invitația în calendar.",
      "This is a mockup, so no booking was made. On the real site you get the confirmation by email and a calendar invitation.",
    ),
    again: t("Fă altă programare", "Make another booking"),
  },
  weekdays: { ro: ["L", "Ma", "Mi", "J", "V", "S", "D"], en: ["M", "Tu", "W", "Th", "F", "Sa", "Su"] },
  weekdaysLong: {
    ro: ["luni", "marți", "miercuri", "joi", "vineri", "sâmbătă", "duminică"],
    en: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  months: {
    ro: ["ianuarie", "februarie", "martie", "aprilie", "mai", "iunie", "iulie", "august", "septembrie", "octombrie", "noiembrie", "decembrie"],
    en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  },
};

// PLACEHOLDER availability (Europe/Bucharest), Monday = 0. In the real site this comes from
// Payload (global `availability`) minus Ramona's Google Calendar busy times and existing bookings.
export const availability: Record<number, [number, number][]> = {
  1: [[10, 18]], // Tuesday 10–18
  3: [[12, 20]], // Thursday 12–20
  5: [[10, 13]], // Saturday 10–13
};
