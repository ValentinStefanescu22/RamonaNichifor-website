// Copy for the inner pages (Despre, Consiliere, Cărți, Artă, Contact, Comunitate), shaped like
// the future CMS documents. Every visible string is { ro, en }; Romanian is the default.
//
// PLACEHOLDER: everything flagged `placeholder: true` (and every block under a PLACEHOLDER banner)
// is stand-in content so the pages can be designed at real density. Replace it with Ramona's
// real texts, books, artworks, prices and dates; the components need no changes.

import { book, universes, type Text, type UniverseId } from "./content";

const t = (ro: string, en: string): Text => ({ ro, en });

/* ---------------------------------------------------------------- Despre mine */

export const about = {
  title: [t("Despre", "About"), t("mine", "me")] as const,
  /** Her own line under the title */
  role: t(
    "Consilier pentru dezvoltare personală, jurist, autor și ilustrator.",
    "Personal development counsellor, lawyer, author and illustrator.",
  ),
  // Ramona's own text (final, 2026-10-03). Only diacritics were restored; the words are hers.
  // English is a working translation awaiting her approval.
  // The story is set in four movements; `quote` and `questions` are its two display moments.
  story: [
    [
      { text: t(
        "Din copilărie, picturile au fost pentru mine, uși întredeschise, prin care simțeam secole întregi de iubiri, de suferințe, de nevoi de apartenență.",
        "Since childhood, paintings have been, for me, half-open doors through which I felt whole centuries of love, of suffering, of the need to belong.",
      ) },
      { text: t(
        "Stăruiam în fața lor, analizând și căutând, cu admirație și curiozitate, culorile, umbrele, tehnicile prin care erau transmise emoții atât de puternice și de profunde.",
        "I would linger in front of them, studying and searching, with admiration and curiosity, for the colours, the shadows, the techniques that carried such strong and deep feelings.",
      ) },
      { text: t(
        "Mi-ar fi plăcut să rămân în lumea aceea, să învăț să ofer și eu, să… exprim, prin artă, ceea ce simțeam. Am fost însă îndrumată către un liceu cu profil real, cu multă matematică și fizică. Poate din grijă, poate din teama că pasiunea mea nu mi-ar fi putut oferi o viață sigură. Nu privesc astăzi acea alegere ca fiind corectă sau greșită. Știu doar că nu se alinia cu ceea ce simțeam eu atunci.",
        "I would have liked to stay in that world, to learn to give something too, to… express through art what I felt. Instead, I was steered towards a science high school, with a great deal of maths and physics. Perhaps out of care, perhaps out of fear that my passion could not give me a secure life. Today I don't see that choice as right or wrong. I only know it didn't match what I felt back then.",
      ) },
      { text: t("Am urmat drumul propus. Eram un copil.", "I followed the path laid out for me. I was a child."), kind: "quote" as const },
    ],
    [
      { text: t(
        "Dorința de a studia psihologia, câțiva ani mai târziu, a venit firesc, în adolescență, când devenisem confidenta prietenelor mele. Veneau la mine cu situații apăsătoare, cu frici, blocaje, furie sau sentimentul că fuseseră nedreptățite. Găseau un spațiu în care puteau vorbi fără să fie judecate. Le ascultam cu discreție, răbdare și empatie.",
        "The wish to study psychology came naturally a few years later, in my teens, when I had become my friends' confidante. They came to me with heavy situations, with fears, blocks, anger or the feeling they had been wronged. They found a space where they could speak without being judged. I listened with discretion, patience and empathy.",
      ) },
      { text: t(
        "Și acest drum s-a oprit în fața unei temeri ce nu-mi aparținea. Auzisem deja că „pictorii mor de foame”. Acum și psihologia era percepută la fel de nesigură deoarece „rufele se spălau în familie”.",
        "This path, too, stopped in front of a fear that wasn't mine. I had already heard that „painters starve”. Now psychology was seen as just as unsafe, because „dirty laundry was washed at home”.",
      ) },
      { text: t(
        "Așa s-a declanșat în mine justițiarul, salvatorul. Am luat, în felul meu, sabia lui Don Quijote pornind către Facultatea de Drept, înainte să învăț să o ridic și în apărarea mea și ale propriilor alegeri.",
        "That is how the champion of justice, the rescuer, woke up in me. In my own way, I took up Don Quixote's sword and set off for Law School, before I learned to raise it in my own defence and that of my own choices.",
      ) },
    ],
    [
      { text: t(
        "Ca angajat, antreprenor și jurist, am experimentat, am construit, am greșit, am pierdut, am corectat și am început din nou. Unele capitole s-au închis prea brusc, prea dur, înainte să fi înțeles pe deplin ce se întâmplase.",
        "As an employee, an entrepreneur and a lawyer, I experimented, built, got things wrong, lost, corrected and started again. Some chapters closed too suddenly, too harshly, before I had fully understood what had happened.",
      ) },
      { text: t(
        "În mijlocul acestor tumultoase schimbări, am devenit mamă. Maternitatea m-a făcut să privesc altfel natura creatoare.",
        "In the middle of all that upheaval, I became a mother. Motherhood made me see creative nature differently.",
      ) },
      { text: t(
        "Întrebările care mă însoțeau din copilărie au devenit atunci mai stăruitoare.",
        "The questions that had followed me since childhood grew more insistent.",
      ) },
      { text: t(
        "Cine sunt? Cât din ceea ce cred îmi aparține? Ce le ofer fiicelor mele dincolo de lucrurile materiale și ce las, prin alegerile mele, în lumea în care vor crește?",
        "Who am I? How much of what I believe is truly mine? What do I give my daughters beyond material things, and what do I leave, through my choices, in the world they will grow up in?",
      ), kind: "questions" as const },
      { text: t(
        "Am înțeles treptat că unele îndrumări primite încercaseră să mă protejeze de un trecut trăit de altcineva, nu să mă pregătească pentru viitorul meu.",
        "Slowly I understood that some of the guidance I had been given had tried to protect me from a past lived by someone else, not to prepare me for my own future.",
      ) },
      { text: t(
        "Înțelegerea aceasta m-a condus către lucrul interior și către formarea prin care am devenit consilier pentru dezvoltare personală.",
        "That understanding led me to inner work, and to the training through which I became a personal development counsellor.",
      ) },
    ],
    [
      { text: t(
        "Astăzi pictez, scriu și ilustrez. Îmi onorez natura creatoare, trecutul și călătoria.",
        "Today I paint, write and illustrate. I honour my creative nature, my past and the journey.",
      ), kind: "close" as const },
    ],
  ] as { text: Text; kind?: "quote" | "questions" | "close" }[][],
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
        line: t("Acuarele, originale și printuri.", "Watercolours, originals and prints."),
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
      detail: t("Durata și prețul, în curând", "Length and price coming soon"),
      placeholder: true,
    },
    {
      id: "fata",
      title: t("Față în față", "In person"),
      line: t("Într-un cadru cald și discret, în București.", "In a warm, private setting in Bucharest."),
      detail: t("Durata și prețul, în curând", "Length and price coming soon"),
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
      a: t("Durata ședințelor este în lucru și o anunț aici în curând.", "Session lengths are being finalised and will be announced here soon."),
    },
    {
      q: t("Cât costă?", "How much does it cost?"),
      a: t("Prețurile sunt în lucru și le anunț aici în curând.", "Prices are being finalised and will be announced here soon."),
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
export type BookStatus = "published" | "soon" | "writing";

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
  /** A published book's page: its own blurb, facts and a few real pages to leaf through */
  details?: {
    subtitle: Text;
    blurb: Text[];
    pages: number;
    isbn: string;
    leaf: { src: string; label: Text }[];
  };
  placeholder?: boolean;
};

export const booksPage = {
  seriesNote: t("Seria „Magia suntem noi”", "The „Magic Is Us” series"),
  status: {
    published: t("Apărută", "Out now"),
    soon: t("În curând", "Coming soon"),
    writing: t("În lucru", "In the works"),
  },
  where: t("Unde găsești cărțile", "Where to find the books"),
  // From Ramona's „Despre autor” (2026-10-03); English is a working translation
  author: {
    title: t("Despre autor", "About the author"),
    paragraphs: [
      t(
        "Ramona Nichifor este autor și artist vizual, iar poveștile ei s-au născut la ora de culcare a fiicei sale.",
        "Ramona Nichifor is an author and visual artist, and her stories were born at her daughter's bedtime.",
      ),
      t(
        "Au fost șoptite cu blândețe, seară de seară, pentru a crea o stare de liniște, bucurie și siguranță. Aceste povești au apărut din prezență și iubire, devenind tovarăși tăcuți ai copilăriei, purtători de căldură, speranță și sens.",
        "They were whispered gently, night after night, to create a feeling of calm, joy and safety. These stories grew out of presence and love, and became quiet companions of childhood, carriers of warmth, hope and meaning.",
      ),
      t(
        "Cărțile ei vorbesc cu delicatețe despre emoțiile pe care copiii le simt, dar nu știu întotdeauna să le numească. Ele oferă alinare, acceptare și un sentiment de apartenență, fără lecții sau judecată.",
        "Her books speak gently about the feelings children have but cannot always name. They offer comfort, acceptance and a sense of belonging, without lessons or judgement.",
      ),
      t(
        "Ramona Nichifor creează povești și ilustrații pentru copiii din întreaga lume, dar și pentru adulții care își redescoperă copilul interior.",
        "Ramona Nichifor creates stories and illustrations for children all over the world, and for the grown-ups rediscovering their inner child.",
      ),
    ],
    statement: t("Cărțile ei sunt menite să fie citite cu voce tare, împărtășite și simțite.", "Her books are meant to be read aloud, shared and felt."),
    formats: [
      { name: t("E-book", "E-book"), line: t("În curând, disponibile și ebook.", "Coming soon as e-books too.") },
      {
        name: t("Audiobook", "Audiobook"),
        line: t(
          "Este planificată și o versiune audiobook, care va readuce aceste povești în locul în care s-au născut pentru prima dată: vocea autoarei.",
          "An audiobook is planned too, taking these stories back to where they were first born: the author's voice.",
        ),
      },
    ],
  },
};

export const shelf: ShelfBook[] = [
  {
    id: "fluturele",
    title: t("Fluturele dansator de step", "The Tap-Dancing Butterfly"),
    line: t("Un fluture care simte alt ritm decât ceilalți.", "A butterfly who hears a different rhythm."),
    age: "copii",
    status: "published",
    year: 2026,
    cover: "cover-fluturele.webp",
    tint: ["#F8DCEB", "#E58FBF", "#9B3F7A"],
    universe: "fluture",
    details: {
      subtitle: book.subtitle,
      blurb: book.blurb,
      pages: 40,
      isbn: "978-973-0-44382-0",
      leaf: [
        { src: "pages/fluturele-coperta-spate.webp", label: t("Coperta spate", "Back cover") },
        { src: "pages/fluturele-p4.webp", label: t("Pagina 4", "Page 4") },
        { src: "pages/fluturele-p9.webp", label: t("Pagina 9", "Page 9") },
      ],
    },
  },
  {
    id: "buburuza",
    title: t("Buburuza rotunjoară", "The Roly-Poly Ladybird"),
    line: t("O buburuză care învață să se iubească așa cum este.", "A ladybird who learns to love herself just as she is."),
    age: "copii",
    status: "published",
    year: 2026,
    cover: "cover-buburuza.webp",
    tint: ["#FBE1DA", "#EE9B8C", "#A8483C"],
    universe: "buburuza",
    // From the back cover; English is a working translation
    details: {
      subtitle: t("O poveste șoptită inimii, acolo unde magia începe cu tine.", "A story whispered to the heart, where the magic begins with you."),
      blurb: [
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
      ],
      pages: 28,
      isbn: "978-973-0-44383-7",
      leaf: [
        { src: "pages/buburuza-coperta-spate.webp", label: t("Coperta spate", "Back cover") },
        { src: "pages/buburuza-p8.webp", label: t("Pagina 8", "Page 8") },
        { src: "pages/buburuza-p12.webp", label: t("Pagina 12", "Page 12") },
      ],
    },
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
  status: "soon";
  placeholder: true;
};

// PLACEHOLDER: product texts, materials and sizes (prices are „în curând”)
const kindCopy: Record<ProductKind, { name: Text; description: Text[]; material: Text; size: Text }> = {
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
  },
};

export const productPage = {
  labels: { material: t("Material", "Material"), size: t("Dimensiuni", "Size"), price: t("Preț", "Price") },
  sameUniverse: t("Din același univers", "From the same universe"),
  priceSoon: t("Preț în curând", "Price coming soon"),
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
  labels: {
    age: t("Vârstă", "Age"),
    year: t("Anul", "Year"),
    pages: t("Pagini", "Pages"),
    format: t("Format", "Format"),
    isbn: t("ISBN", "ISBN"),
  },
  format: t("A4, copertă cartonată lucioasă", "A4, glossy hardcover"),
  // PLACEHOLDER: details for books that are not out yet
  placeholderBlurb: t(
    "Povestea prinde contur în atelier. Aici vei găsi despre ce este cartea, pentru cine și ce emoții atinge, imediat ce e gata.",
    "The story is taking shape in the studio. This is where you'll read what the book is about, who it's for and which feelings it touches, as soon as it's ready.",
  ),
  ageRange: { copii: t("1–10 ani", "1–10 years"), adolescenti: t("12–16 ani", "12–16 years"), adulti: t("Adulți", "Adults") },
  toBeAnnounced: t("În curând", "Coming soon"),
  moreBooks: t("Mai multe cărți", "More books"),
  leaf: t("Răsfoiește", "Leaf through"),
  leafHint: t("Atinge o pagină ca s-o vezi mare.", "Tap a page to see it large."),
  leafNote: t("Pagini din carte, în curând.", "Pages from the book, coming soon."),
  pageOf: t("din", "of"),
  prev: t("Pagina anterioară", "Previous page"),
  next: t("Pagina următoare", "Next page"),
  universe: t("Universul cărții", "The book's universe"),
  series: t("Din aceeași serie", "From the same series"),
};

/* ---------------------------------------------------------------- Artă */

export type ArtKind = "original" | "print";
export type Availability = "preorder" | "sold" | "onRequest";

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
  tagline: t("Originale și printuri.", "Originals and prints."),
  filters: [
    { id: "all" as const, label: t("Toate", "All") },
    { id: "original" as const, label: t("Originale", "Originals") },
    { id: "print" as const, label: t("Printuri", "Prints") },
  ],
  kind: {
    original: t("Original", "Original"),
    print: t("Print", "Print"),
  },
  availability: {
    preorder: t("Pre-comandă", "Pre-order"),
    sold: t("Vândută", "Sold"),
    onRequest: t("La cerere", "On request"),
  },
  labels: { technique: t("Tehnică", "Technique"), size: t("Dimensiuni", "Size"), year: t("Anul", "Year"), price: t("Preț", "Price") },
  ask: t("Întreabă de această lucrare", "Ask about this piece"),
  preorder: t("Pre-comandă", "Pre-order"),
  preorderNote: t(
    "Plata și livrarea le stabilim împreună. Magazinul online vine în curând.",
    "We arrange payment and delivery together. The online shop is coming soon.",
  ),
  priceSoon: t("Preț în curând", "Price coming soon"),
  close: t("Închide", "Close"),
  commissionTitle: t("Lucrări la comandă", "Commissions"),
  // PLACEHOLDER: commission note
  commission: t(
    "Pictez și la comandă: un portret al copilului tău într-un univers de poveste sau o ilustrație pentru o ocazie specială.",
    "I also paint on commission: a portrait of your child inside a storybook world, or an illustration for a special occasion.",
  ),
};

export const artworks: Artwork[] = [
  { id: "poiana", title: t("Poiana fluturelui", "The butterfly's meadow"), kind: "print", technique: t("Print după acuarelă", "Print of a watercolour"), size: "30 × 42 cm", year: 2026, availability: "preorder", src: "cover-fluturele.webp", ratio: 766 / 1120, placeholder: true },
  // PLACEHOLDER: artworks from here on
  { id: "dimineata", title: t("Lumină de dimineață", "Morning light"), kind: "original", technique: t("Acuarelă pe hârtie", "Watercolour on paper"), size: "30 × 40 cm", year: 2025, availability: "preorder", wash: ["#fbe3c9", "#f3b9c9", "#c9b8e6"], ratio: 3 / 4, placeholder: true },
  { id: "lavanda", title: t("Ploaie de lavandă", "Lavender rain"), kind: "original", technique: t("Acuarelă și tuș", "Watercolour and ink"), size: "40 × 30 cm", year: 2025, availability: "sold", wash: ["#e6dcf5", "#b9a3e0", "#7a5fb0"], ratio: 4 / 3, placeholder: true },
  { id: "zbor", title: t("Liniștea dinaintea zborului", "The quiet before flight"), kind: "original", technique: t("Acuarelă pe hârtie", "Watercolour on paper"), size: "24 × 32 cm", year: 2026, availability: "preorder", src: "butterfly.webp", ratio: 4 / 5, placeholder: true },
  { id: "gradina", title: t("Grădina bunicii", "Grandma's garden"), kind: "print", technique: t("Print giclée", "Giclée print"), size: "A3", year: 2025, availability: "preorder", wash: ["#dfe7d4", "#a9be95", "#f6dde6"], ratio: 3 / 4, placeholder: true },
  { id: "nor", title: t("Norul timid", "The shy cloud"), kind: "print", technique: t("Print după acuarelă", "Print of a watercolour"), size: "A4", year: 2026, availability: "preorder", wash: ["#dce9f6", "#97bce0", "#f6dde6"], ratio: 1, placeholder: true },
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
};

/* ---------------------------------------------------------------- Comunitate cu sens */

export const community = {
  title: [t("Comunitate", "Community"), t("cu sens", "with meaning")] as const,
  lead: t(
    "Un loc în care poveștile ies din cărți: ne adunăm să citim, să desenăm, să vorbim despre emoții și să facem lucruri bune împreună.",
    "A place where stories step out of the books: we gather to read, draw, talk about feelings and do good things together.",
  ),
  eventsTitle: t("Întâlniri", "Gatherings"),
  eventsLead: t("Ce facem împreună. Anunț fiecare întâlnire pe Instagram.", "What we do together. I announce every gathering on Instagram."),
  join: t("Vreau să particip", "I'd like to come"),
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
      // Description and logo arrive from the client
      line: t("Descriere în curând.", "Description coming soon."),
      logo: undefined as string | undefined,
      placeholder: true,
    },
  ],
  // The kinds of gathering Ramona runs (2026-10-03); dates and places are announced later
  events: [
    {
      id: "pictura",
      title: t("Ateliere de pictură", "Painting workshops"),
      audience: t("Acuarelă pentru copii și pentru adulți", "Watercolour for children and grown-ups"),
      kind: t("Atelier", "Workshop"),
      tint: "#e6dcf5",
    },
    {
      id: "lansari",
      title: t("Lansări de carte", "Book launches"),
      audience: t("Fiecare poveste nouă din „Magia suntem noi”", "Every new story in „The Magic Is Us”"),
      kind: t("Lansare", "Launch"),
      tint: "#f3c9dc",
    },
    {
      id: "autografe",
      title: t("Sesiuni de autografe", "Book signings"),
      audience: t("O dedicație scrisă de mână, pentru cine citește", "A handwritten note for whoever will read it"),
      kind: t("Autografe", "Signing"),
      tint: "#fbe1da",
    },
    {
      id: "citit",
      title: t("Ateliere de citit", "Reading workshops"),
      audience: t("Povești citite cu voce tare, apoi vorbim despre emoții", "Stories read aloud, then we talk about feelings"),
      kind: t("Lectură", "Reading"),
      tint: "#c8daf0",
    },
  ],
  datesSoon: t("Datele, în curând", "Dates coming soon"),
  // PLACEHOLDER: projects
  projects: [
    {
      id: "carte-clasa",
      title: t("O carte pentru fiecare clasă", "A book for every classroom"),
      line: t(
        "Pentru fiecare carte vândută, o carte ajunge într-o școală din mediul rural, împreună cu un ghid pentru învățători.",
        "For every book sold, one goes to a rural school, together with a guide for teachers.",
      ),
      status: t("În lucru", "In the works"),
      wash: ["#fbe3c9", "#f3b9c9", "#e6dcf5"] as [string, string, string],
      placeholder: true,
    },
    {
      id: "centre-zi",
      title: t("Ateliere în centre de zi și orfelinate", "Workshops in day centres and orphanages"),
      line: t(
        "Întâlniri despre emoții, prin povești și culoare, pentru copiii din centre de zi și orfelinate.",
        "Sessions on feelings, through stories and colour, for children in day centres and orphanages.",
      ),
      status: t("În lucru", "In the works"),
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
  // PLACEHOLDER: durations (prices are „în curând”); minutes only drive the demo calendar
  formats: [
    { id: "intro" as FormatId, title: t("Primă discuție", "First conversation"), detail: t("Detalii în curând", "Details coming soon"), minutes: 15 },
    { id: "online" as FormatId, title: t("Online", "Online"), detail: t("Detalii în curând", "Details coming soon"), minutes: 50 },
    { id: "fata" as FormatId, title: t("Față în față", "In person"), detail: t("Detalii în curând", "Details coming soon"), minutes: 60 },
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
