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
  // EN is Ramona's own translation (2026-10-14); \n\n marks her paragraph breaks inside a beat
  story: [
    [
      { text: t(
        "Din copilărie, picturile au fost pentru mine, uși întredeschise, prin care simțeam secole întregi de iubiri, de suferințe, de nevoi de apartenență.",
        "Ever since I was a child, paintings have felt like doors left slightly ajar, inviting me to glimpse centuries of love, sorrow, and the timeless human longing to belong.",
      ) },
      { text: t(
        "Stăruiam în fața lor, analizând și căutând, cu admirație și curiozitate, culorile, umbrele, tehnicile prin care erau transmise emoții atât de puternice și de profunde.",
        "I would linger before them, captivated, searching with admiration and curiosity through colors, shadows, and brushstrokes, trying to understand how something so still could hold emotions so powerful, so profoundly alive.",
      ) },
      { text: t(
        "Mi-ar fi plăcut să rămân în lumea aceea, să învăț să ofer și eu, să… exprim, prin artă, ceea ce simțeam. Am fost însă îndrumată către un liceu cu profil real, cu multă matematică și fizică. Poate din grijă, poate din teama că pasiunea mea nu mi-ar fi putut oferi o viață sigură. Nu privesc astăzi acea alegere ca fiind corectă sau greșită. Știu doar că nu se alinia cu ceea ce simțeam eu atunci.",
        "I longed to remain in that world. To learn how to give something of myself, too. To find, through art, a way of expressing what I felt but could not always put into words.\n\nYet life led me elsewhere.\n\nI was guided towards a high school focused on mathematics and physics. Perhaps out of love, perhaps out of fear that my passion would never provide me with a secure future.\n\nLooking back, I no longer see that choice as right or wrong. I simply recognize that it was not aligned with how I felt, or who I was, at the time.",
      ) },
      { text: t("Am urmat drumul propus. Eram un copil.", "I followed the path chosen for me.\n\nI was only a child.") },
    ],
    [
      { text: t(
        "Dorința de a studia psihologia, câțiva ani mai târziu, a venit firesc, în adolescență, când devenisem confidenta prietenelor mele. Veneau la mine cu situații apăsătoare, cu frici, blocaje, furie sau sentimentul că fuseseră nedreptățite. Găseau un spațiu în care puteau vorbi fără să fie judecate. Le ascultam cu discreție, răbdare și empatie.",
        "A few years later, during my teenage years, another calling began to take shape: psychology.\n\nI had naturally become the confidante of my friends. They would come to me carrying their worries, fears, frustrations, anger, or the pain of having been treated unfairly. Sometimes they felt trapped, unable to find a way forward.\n\nWith me, they found a space where they could speak freely, without fear of judgement. And I listened, with patience, discretion, and empathy.",
      ) },
      { text: t(
        "Și acest drum s-a oprit în fața unei temeri ce nu-mi aparținea. Auzisem deja că „pictorii mor de foame”. Acum și psihologia era percepută la fel de nesigură deoarece „rufele se spălau în familie”.",
        "But this path, too, came to a halt before a fear that was never truly mine.\n\nI had already been told that “artists starve.” Now psychology seemed equally uncertain, in a world where “dirty laundry was meant to be washed at home.”",
      ) },
      { text: t(
        "Așa s-a declanșat în mine justițiarul, salvatorul. Am luat, în felul meu, sabia lui Don Quijote pornind către Facultatea de Drept, înainte să învăț să o ridic și în apărarea mea și ale propriilor alegeri.",
        "And so, somewhere within me, the defender of justice awakened. The rescuer. The savior!\n\nIn my own way, I picked up Don Quijote's sword and set off towards law school, ready to defend others, long before I had learned to raise that same sword in defense of myself and my own choices.",
      ) },
    ],
    [
      { text: t(
        "Ca angajat, antreprenor și jurist, am experimentat, am construit, am greșit, am pierdut, am corectat și am început din nou. Unele capitole s-au închis prea brusc, prea dur, înainte să fi înțeles pe deplin ce se întâmplase.",
        "Over the years, as an employee, an entrepreneur, and a legal professional, I explored, built, made mistakes, lost, learned, made amends, and began again.\n\nSome chapters ended brutally, too painfully, before I had even found the time to fully understand what had happened.",
      ) },
      { text: t(
        "În mijlocul acestor tumultoase schimbări, am devenit mamă. Maternitatea m-a făcut să privesc altfel natura creatoare.",
        "And somewhere in the midst of all those turbulent changes, I became a mother.\n\nMotherhood brought a new perspective to my creative nature, and to the meaning of creation itself.",
      ) },
      { text: t(
        "Întrebările care mă însoțeau din copilărie au devenit atunci mai stăruitoare.",
        "The questions that had quietly accompanied me since childhood began to ask for answers with a new insistence.",
      ) },
      { text: t(
        "Cine sunt? Cât din ceea ce cred îmi aparține? Ce le ofer fiicelor mele dincolo de lucrurile materiale și ce las, prin alegerile mele, în lumea în care vor crește?",
        "Who am I? How much of what I believe truly belongs to me? What am I giving my daughters beyond material things? And what am I leaving behind, through my own choices, in the world in which they will grow?",
      ), kind: "questions" as const },
      { text: t(
        "Am înțeles treptat că unele îndrumări primite încercaseră să mă protejeze de un trecut trăit de altcineva, nu să mă pregătească pentru viitorul meu.",
        "Little by little, I came to understand that some of the guidance I had received was never really meant to prepare me for my own future.\n\nIt had been an attempt to protect me from someone else's past and someone else’s fears.",
      ) },
      { text: t(
        "Înțelegerea aceasta m-a condus către lucrul interior și către formarea prin care am devenit consilier pentru dezvoltare personală.",
        "That realization opened the door to a deeper journey within myself, to inner exploration, and eventually to the training through which I became a personal development counsellor.",
      ) },
    ],
    [
      { text: t(
        "Astăzi pictez, scriu și însoțesc oameni în procesul de reconectare cu ei înșiși. Îmi onorez natura creatoare, trecutul și călătoria.",
        "Today, I paint. I write. And I walk alongside others as they find their way back to themselves.\n\nI honor my creative nature, the past that shaped me, and my journey.",
      ), kind: "close" as const },
    ],
  ] as { text: Text; kind?: "questions" | "close" }[][],
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
  // „Ce se repetă în viața ta?” (Ramona, 2026-10-13): her words, diacritics only; EN is her translation
  patterns: {
    title: t("Ce se repetă în viața ta?", "What keeps repeating in your life?"),
    questions: [
      t("Unde te simți blocat?", "Where do you feel stuck?"),
      t("Te simți neputincios? Vinovat?", "Do you feel helpless? Guilty?"),
      t(
        "Ce faci aproape automat atunci când te simți respins, criticat, ignorat sau nesigur?",
        "What do you do almost automatically when you feel rejected, criticized, ignored, or insecure?",
      ),
      t(
        "Ce se întâmplă în relațiile tale atunci când începi să te apropii de cineva?",
        "What happens in your relationships when you start getting close to someone?",
      ),
      t("Ce faci atunci când apare un conflict?", "What do you do when conflict arises?"),
    ],
    reactions: [
      t("Te retragi?", "Do you withdraw?"),
      t("Cauți aprobarea?", "Do you seek approval?"),
      t("Încerci să controlezi?", "Do you try to control things?"),
      t("Eviți?", "Do you avoid confrontation?"),
      t("Te sacrifici?", "Do you sacrifice yourself for others?"),
      t("Îți asumi responsabilitatea pentru tot?", "Do you take responsibility for everything?"),
      t("Îți este greu să spui „nu”?", "Do you find it difficult to say “no”?"),
    ],
    thesis: t(
      "Te ghidez să faci această diferență importantă: ce faci și de ce faci ceea ce faci.",
      "I guide you in understanding this important distinction: what you do and why you do what you do.",
    ),
    path: [
      t("tipare", "patterns"),
      t("nevoi", "needs"),
      t("credințe", "beliefs"),
      t("reacții automate", "automatic reactions"),
      t("conștientizare", "awareness"),
      t("alegere conștientă", "conscious choice"),
    ],
    pathLabel: t("Drumul, pas cu pas", "The path, step by step"),
    explain: t(
      "Hai să îți explic simplu și profesionist ce fac în ședințele de consiliere. Trimite-mi un mesaj.",
      "Let me explain, simply and professionally, what I do during counselling sessions. Send me a message.",
    ),
    change: t(
      "Pentru mine, schimbarea nu înseamnă să te transformi într-o versiune „mai bună” pentru ceilalți.",
      "For me, change does not mean transforming yourself into a “better” version of yourself for others.",
    ),
    closer: t("Înseamnă să te apropii de tine.", "It means getting closer to yourself."),
    toward: [
      t("Să îți înțelegi nevoile.", "Understanding your needs."),
      t("Să îți asculți vocea interioară.", "Listening to your inner voice."),
      t("Să îți recunoști limitele dar și resursele.", "Recognizing your boundaries as well as your strengths."),
      t("Să îți clarifici valorile.", "Clarifying your values."),
      t("Să faci alegeri care au sens pentru tine.", "Making choices that feel right for you."),
    ],
  },
  // „Cum știi dacă este pentru tine?” (Ramona, 2026-10-13): typos fixed only; her EN translation is a little longer
  rightForYou: {
    title: t("Cum știi dacă este pentru tine?", "How do you know if it’s right for you?"),
    maybe: [
      t("Poți fi un lider înnăscut, care nu primește cu ușurință sfaturi.", "You may be a natural-born leader, someone who does not easily take advice."),
      t("Poți fi o persoană timidă, care și-ar dori să primească sfaturi bune.", "You may be shy, someone who longs for a little guidance."),
      t("Poți fi un rebel, care sfidează limitele și autoritatea.", "You may be a rebel, always questioning boundaries and authority."),
      t("Poți fi temător și anxios.", "Or you may be fearful, anxious, unsure of yourself."),
    ],
    body: [
      t(
        "Te poți regăsi în oricare dintre aceste ipostaze sau poți oscila între ele, fiind uneori rebel, alteori temător.",
        "You may recognize yourself in one of these descriptions, or perhaps you move between them—rebellious at times, fearful at others, depending on where life finds you.",
      ),
      t(
        "Indiferent de situație, poate simți nevoia să depășești anumite comportamente ale tale și nu știi de unde să începi.",
        "Whatever your situation, there may be parts of yourself you feel ready to move beyond, patterns you wish to change, yet you may not know where to begin.",
      ),
      t(
        "Nu ai uneltele, cunoașterea sau timpul necesar să cauți, să citești, să aprofundezi. Poate nu ai energia.",
        "Perhaps you do not have the tools, the knowledge, or the time to search, read, and explore things more deeply. Perhaps you simply do not have the energy.",
      ),
      t(
        "Poate nu ai oamenii sau relațiile în care să poți discuta deschis.",
        "Perhaps you do not have the people, or the kind of relationships, in which you can speak openly and be heard.",
      ),
      t(
        "Poate nu ți-ai găsit mediul în care să te simți în siguranță, să explorezi posibilități și variante, în care să vorbești liber, fără să fii judecat, criticat.",
        "Perhaps you have not yet found a space where you feel safe enough to explore possibilities and alternatives, where you can speak freely without the fear of being judged or criticized.",
      ),
      t(
        "Poate simți nevoia să poți lăsa garda jos, masca, rolul. Să poți fi vulnerabil fără să te afli în pericol.",
        "Perhaps you long for a moment when you can let your guard down, take off the mask, and step out of the role you have learned to play. A moment when you can be vulnerable without feeling in danger. A moment when you do not have to prove anything, explain everything, or be anything other than who you are.",
      ),
    ],
    simply: t("Pur și simplu să fii.", "Simply to be."),
    here: t("Și aici intervin eu.", "And this is where I come in."),
    offer: [
      t("Îți creez acest spațiu și îți ofer acest timp.", "I create this space for you. I offer you this time."),
      t(
        "Cunoașterea mea îți va susține propriul proces de autocunoaștere și descoperire, de înțelegere a reacțiilor și comportamentelor tale, de schimbare a celor care nu îți sunt benefice, dacă simți că este necesar, și de atingere a obiectivelor pe care ți le propui și care îți aduc beneficii.",
        "My knowledge is here to support your own process of self-awareness and discovery. To help you understand your reactions and behaviors, recognize the patterns that may no longer serve you, and change them if—and when—you feel ready. Not because you have to become someone else, but because you may wish to feel more at ease with who you are. To move towards the goals you set for yourself, in ways that bring meaning, clarity, and benefit to your life.",
      ),
    ],
    close: t(
      "Iar dacă te regăsești în aceste rânduri și simți nevoia unei persoane care să te asculte în tihnă, cu răbdare, și a unui spațiu în care să te simți în siguranță, în care să ai parte de confidențialitate și să poți parcurge propriul proces de autocunoaștere, sunt aici.",
      "And if you recognize yourself in these words, if you feel the need for someone who will listen to you calmly and patiently, without rushing you or telling you who you should be, perhaps this is a place for you. A space where you can feel safe, where confidentiality is respected, and where you are free to explore your own thoughts, feelings, and possibilities, at your own pace. A space where you can begin to understand yourself a little better. And if this is what you have been looking for, I am here.",
    ),
  },
  // Ramona, 2026-10-13: the same prices online and in person
  prices: [
    { minutes: 60, eur: 25 },
    { minutes: 90, eur: 40 },
    { minutes: 120, eur: 50 },
  ],
  formats: [
    {
      id: "online",
      title: t("Online", "Online"),
      line: t("Prin apel video, de oriunde ai fi.", "By video call, wherever you are."),
    },
    {
      id: "fata",
      title: t("Față în față", "In person"),
      line: t("Într-un cadru cald și discret.", "In a warm, private setting."),
    },
  ],
  stepsTitle: t("Cum decurge", "How it goes"),
  // PLACEHOLDER: steps
  steps: [
    { title: t("Îmi scrii", "You write to me"), line: t("Pe WhatsApp sau pe email, câteva rânduri despre ce te aduce aici.", "On WhatsApp or by email, a few lines about what brings you here.") },
    { title: t("O primă discuție", "A first conversation"), line: t("15 minute, telefonic, fără cost, ca să vedem dacă ne potrivim.", "15 minutes on the phone, free of charge, to see if we're a good fit.") },
    { title: t("Ședințele", "The sessions"), line: t("Ne întâlnim online sau față în față.", "We meet online or in person.") },
    { title: t("Pașii tăi", "Your own steps"), line: t("Îi stabilim împreună, personalizat, în funcție de ritmul și nevoile tale.", "We set them together, tailored to your pace and your needs.") },
  ],
  faqTitle: t("Întrebări frecvente", "Frequently asked questions"),
  // PLACEHOLDER: FAQ
  faq: [
    {
      q: t("Cât durează o ședință?", "How long is a session?"),
      a: t("Ședințele diferă și pot dura între 60 și 120 de minute.", "Sessions vary and can last between 60 and 120 minutes."),
    },
    {
      q: t("Cât costă?", "How much does it cost?"),
      a: t("O ședință de 60 de minute costă 25 €, de 90 de minute 40 €, iar de 120 de minute 50 €. Prima discuție, telefonică, este fără cost.", "A 60-minute session costs €25, a 90-minute one €40 and a 120-minute one €50. The first conversation, by phone, is free."),
    },
    {
      q: t("Cum se desfășoară ședințele online?", "How do online sessions work?"),
      a: t("Pe un apel video, dintr-un loc liniștit în care te simți în siguranță. Când programezi pe site, primești linkul pentru întâlnire. Detaliile despre plată, în curând.", "On a video call, from a quiet place where you feel safe. When you book on the site, you receive the link for the meeting. Payment details coming soon."),
    },
    {
      q: t("Ce se întâmplă cu ce îmi împărtășești?", "What happens to what I share?"),
      a: t("Rămâne între noi. Confidențialitatea este baza oricărei ședințe.", "It stays between us. Confidentiality is the ground every session stands on."),
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
    leaf: { src: string; label: Text; ratio?: string }[];
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
      { name: t("E-book", "E-book"), line: t("În curând", "Coming soon") },
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
        { src: "pages/fluturele-coperta-spate.webp", ratio: "880 / 1300", label: t("Coperta spate", "Back cover") },
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
        { src: "pages/buburuza-coperta-spate.webp", ratio: "880 / 1300", label: t("Coperta spate", "Back cover") },
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

/** Real cover sizes, so a cover is always shown whole (never cropped to a common box) */
export const coverRatio: Record<string, string> = {
  "cover-fluturele.webp": "766 / 1120",
  "cover-buburuza.webp": "758 / 1120",
};

/* ---------------------------------------------------------------- Products (universe keepsakes) */

export type ProductKind = "semn" | "carti" | "puzzle" | "joc";
export const productKinds: ProductKind[] = ["semn", "carti", "puzzle", "joc"];

export type Product = {
  id: string;
  universe: UniverseId;
  kind: ProductKind;
  name: Text;
  description: Text[];
  specs: { label: Text; value: Text }[];
  status: "soon";
  /** true while the texts and visuals are stand-ins */
  placeholder: boolean;
};

const detailsSoon = t("Detalii în curând", "Details coming soon");

// Names are the client's list (2026-10-13). Descriptions are PLACEHOLDER until Ramona sends hers; no invented sizes or materials.
const kindCopy: Record<ProductKind, { name: Text; description: Text[] }> = {
  semn: {
    name: t("Semn de carte", "Bookmark"),
    description: [
      t(
        "Un semn de carte ilustrat cu personajul poveștii, ca să-ți păstrezi locul între pagini și să-ți amintești de el între două seri de citit.",
        "A bookmark illustrated with the story's character, to keep your place between the pages and remember it between two evenings of reading.",
      ),
    ],
  },
  carti: {
    name: t("Cărți de joc", "Playing cards"),
    description: [
      t(
        "Un pachet de cărți cu personajele universului, pentru jocuri în familie, seară de seară.",
        "A deck with the universe's characters, for family games, evening after evening.",
      ),
    ],
  },
  puzzle: {
    name: t("Puzzle", "Puzzle"),
    description: [t("Un puzzle cu ilustrațiile poveștii. Detaliile, în curând.", "A puzzle with the story's illustrations. Details coming soon.")],
  },
  joc: {
    name: t("Joc de familie", "Family game"),
    description: [t("Un joc pentru toată familia, în lumea poveștii. Detaliile, în curând.", "A game for the whole family, set in the story's world. Details coming soon.")],
  },
};

export const productPage = {
  labels: {
    details: t("Detalii", "Details"),
    contents: t("Conținut", "Contents"),
    size: t("Dimensiuni", "Size"),
    players: t("Jucători", "Players"),
    price: t("Preț", "Price"),
  },
  sameUniverse: t("Din același univers", "From the same universe"),
  priceSoon: t("Preț în curând", "Price coming soon"),
};

/* The Fluturele deck (printer file „carti de joc FLUTURELE 88x63 mm”, 2026-10-10): 24 cards.
   Card 1 is the winner, cards 2–23 are 11 consecutive pairs, card 24 holds the rules. */
export const deck = {
  card: (n: number) => `cards/fluturele-${String(n).padStart(2, "0")}.webp`,
  ratio: 63 / 88,
  winner: { n: 1, name: t("Fluturele dansator", "The tap-dancing butterfly") },
  pairs: [
    // only two pairs are shown (Ramona, 2026-10-13): the deck is for buying, not printing
    t("Broscuță și Broscoi", "Little frog and Big frog"),
    t("Ciripel și Ciripica", "Ciripel and Ciripica"),
  ],
  /** names for each card, for alt text and the reader caption (cards 2–23) */
  cardNames: [
    "Broscuță", "Broscoi", "Ciripel", "Ciripica", "Dragonel", "Dragonela", "Fetiță", "Tătic", "Bondărel", "Albinuță",
    "Scenă fluture", "Scenă fetiță", "Flori adăpost", "Flori căsuțe", "Căsuță jucărie", "Căsuță oameni",
    "Concurs TV", "Concurs TV", "Prieteni", "Prietenă", "Cântăreți", "Cântăreți",
  ],
  rulesCard: 24,
  title: t("Perechile", "The pairs"),
  lead: t("Două dintre perechi, ca să vezi cum arată. Atinge o carte ca s-o vezi mare.", "Two of the pairs, so you can see what they look like. Tap a card to see it large."),
  winnerTitle: t("Cartea câștigătoare", "The winning card"),
  winnerLine: t("Cine rămâne cu Fluturele dansator câștigă.", "Whoever is left holding the tap-dancing butterfly wins."),
  rulesTitle: t("Cum se joacă", "How to play"),
  rules: [
    t("maxim 4 jucători cu 1 pachet", "up to 4 players with 1 deck"),
    t("amestecați toate cărțile", "shuffle all the cards"),
    t("împarte câte 4 cărți fiecărui jucător", "deal 4 cards to each player"),
    t("trageți cărți de jos până se termină", "draw from the pile until it runs out"),
    t("continuați să trageți de la coleg", "keep drawing from the player next to you"),
    t("formați perechi de câte 2 cărți", "make pairs of 2 cards"),
    t("perechile le scoateți din joc", "take the pairs out of the game"),
    t("cine rămâne cu FLUTURELE DANSATOR, CÂȘTIGĂ!", "whoever is left with the TAP-DANCING BUTTERFLY WINS!"),
  ],
  packTitle: t("În pachet sunt 24 de cărți", "There are 24 cards in the deck"),
  pack: [
    t("22 de cărți ce formează 11 perechi", "22 cards that make 11 pairs"),
    t("1 carte: Fluturele dansator, câștigătorul", "1 card: the tap-dancing butterfly, the winner"),
    t("1 card cu informații și reguli de joc", "1 card with information and the rules"),
  ],
  rulesCardLabel: t("Cardul cu reguli", "The rules card"),
  prev: t("Cartea anterioară", "Previous card"),
  next: t("Cartea următoare", "Next card"),
  fanLabel: t("Pachetul, ca o mână de cărți", "The deck, held like a hand of cards"),
};

/* The Fluture bookmarks (printer file „MOTTO in RO semne de carte Fluture 13 OCT (6 x 17 cm)”, 2026-10-13):
   nine designs, each with its motto; the blank back is not shown. */
export const bookmarks = {
  src: (n: number) => `bookmarks/fluture-${String(n).padStart(2, "0")}.webp`,
  ratio: "345 / 1036",
  mottos: [
    t("Magia suntem noi!", "We are the magic!"),
    t("Crede în tine! Curaj!", "Believe in yourself! Courage!"),
    t("Crede în tine! Curaj!", "Believe in yourself! Courage!"),
    t("Urmează-ți visul. Fii autentic!", "Follow your dream. Be yourself!"),
    t("Eu cred în tine! Găsim o cale!", "I believe in you! We'll find a way!"),
    t("Totul e posibil! Împreună reușim!", "Anything is possible! Together we can!"),
    t("Împreună reușim!", "Together we can!"),
    t("Împreună reușim!", "Together we can!"),
    t("Împreună reușim!", "Together we can!"),
  ],
  title: t("Toate semnele", "All the bookmarks"),
  lead: t("Nouă modele, fiecare cu gândul lui bun. Atinge un semn ca să-l vezi mare.", "Nine designs, each with its own kind thought. Tap a bookmark to see it large."),
  fanLabel: t("Semnele de carte, în evantai", "The bookmarks, fanned out"),
  prev: t("Semnul anterior", "Previous bookmark"),
  next: t("Semnul următor", "Next bookmark"),
};

export const products: Product[] = universes.flatMap((u) =>
  productKinds.map((k) => {
    const real = u.id === "fluture" && k === "carti";
    const realSemn = u.id === "fluture" && k === "semn";
    return {
      id: `${u.id}-${k}`,
      universe: u.id,
      kind: k,
      name: kindCopy[k].name,
      description: realSemn
        ? [
            t(
              "Nouă semne de carte cu personajele din „Fluturele dansator de step” și câte un gând bun pentru cine citește: „Crede în tine!”, „Totul e posibil!”, „Împreună reușim!”.",
              "Nine bookmarks with the characters of „The Tap-Dancing Butterfly” and a kind thought for whoever reads: „Believe in yourself!”, „Anything is possible!”, „Together we can!”.",
            ),
          ]
        : real
        ? [
            t(
              "Un pachet de 24 de cărți cu personajele din „Fluturele dansator de step”: unsprezece perechi de găsit și o singură carte câștigătoare, Fluturele dansator. Un joc de perechi pentru toată familia.",
              "A deck of 24 cards with the characters of „The Tap-Dancing Butterfly”: eleven pairs to find and a single winning card, the tap-dancing butterfly. A pairs game for the whole family.",
            ),
          ]
        : kindCopy[k].description,
      specs: realSemn
        ? [
            { label: productPage.labels.contents, value: t("9 modele", "9 designs") },
            { label: productPage.labels.size, value: t("6 × 17 cm", "6 × 17 cm") },
          ]
        : real
        ? [
            { label: productPage.labels.contents, value: t("24 de cărți", "24 cards") },
            { label: productPage.labels.size, value: t("88 × 63 mm", "88 × 63 mm") },
            { label: productPage.labels.players, value: t("maxim 4", "up to 4") },
          ]
        : [{ label: productPage.labels.details, value: detailsSoon }],
      status: "soon" as const,
      placeholder: !real && !realSemn,
    };
  }),
);

export const productHref = (p: { id: string }) => `produs.html#${p.id}`;

/** A universe's items in order (book, bookmark, cards, puzzle, family game) → the page each one opens */
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
  commissionCta: t("Comandă o lucrare", "Commission a piece"),
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
  { id: "zbor", title: t("Liniștea dinaintea zborului", "The quiet before flight"), kind: "original", technique: t("Acuarelă pe hârtie", "Watercolour on paper"), size: "24 × 32 cm", year: 2026, availability: "preorder", src: "butterfly.webp", ratio: 447 / 406, placeholder: true },
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
  // Ramona's text (2026-10-13), her words exactly, spread over the page's sections
  tagline: t(
    "Oameni care inspiră. Întâlniri care ne apropie. Experiențe care lasă ceva bun în urmă.",
    "People who inspire. Gatherings that bring us closer. Experiences that leave something good behind.",
  ),
  lead: t(
    "Cred că fiecare om are ceva valoros de dăruit, o poveste de împărtășit sau un dar prin care poate aduce mai mult sens în viața celorlalți.",
    "I believe every person has something valuable to give, a story to share or a gift through which they can bring more meaning into other people's lives.",
  ),
  intro: t(
    "Comunitate cu sens este un spațiu dedicat oamenilor, proiectelor și inițiativelor care aduc împreună arta, educația, creativitatea, dezvoltarea personală și grija pentru suflet. Un loc în care îmi doresc să aduc aproape oameni frumoși, profesioniști pasionați și colaboratori care cred în puterea întâlnirilor autentice și în transformarea pe care o pot aduce experiențele trăite împreună.",
    "Comunitate cu sens is a space for the people, projects and initiatives that bring together art, education, creativity, personal growth and care for the soul. A place where I want to bring close beautiful people, passionate professionals and collaborators who believe in the power of real encounters and in the change that experiences lived together can bring.",
  ),
  eventsTitle: t("Întâlniri", "Gatherings"),
  eventsLead: t(
    "Tot aici voi împărtăși momente din lumea cărților mele: lansări, întâlniri cu cititorii, sesiuni de autografe, vizite în școli și grădinițe, ateliere pentru copii și proiecte desfășurate în cadrul programelor Școala Altfel și Școala Verde. Sunt întâlniri în care poveștile ies din pagini și devin experiențe, dialoguri și amintiri.",
    "Here, too, I will share moments from the world of my books: launches, meetings with readers, signing sessions, visits to schools and kindergartens, workshops for children and projects within the Școala Altfel and Școala Verde programmes. They are gatherings where stories step off the page and become experiences, conversations and memories.",
  ),
  projectsLead: t(
    "Aici vei descoperi oameni și proiecte care merită cunoscute: ateliere de ceramică și terapie prin artă, experiențe de conectare cu natura și animalele, inițiative educaționale pentru copii, activități dedicate dezvoltării personale, precum și alte forme de explorare, învățare și creativitate.",
    "Here you will discover people and projects worth knowing: ceramics workshops and art therapy, experiences of connecting with nature and animals, educational initiatives for children, activities for personal growth, and other ways of exploring, learning and creating.",
  ),
  closing: t(
    "Pentru că o comunitate nu înseamnă doar oameni adunați laolaltă, ci oameni care se întâlnesc în jurul unor valori, care se susțin, se inspiră și contribuie, fiecare în felul său, la o lume mai atentă, mai creativă și mai conectată.",
    "Because a community is not just people gathered together, but people who meet around shared values, who support and inspire one another and contribute, each in their own way, to a more attentive, more creative and more connected world.",
  ),
  welcome: t("Bine ai venit în Comunitate cu sens!", "Welcome to Comunitate cu sens!"),
  join: t("Vreau să particip", "I'd like to come"),
  projectsTitle: t("Proiecte cu sens", "Projects with meaning"),
  ctaTitle: t("Vreau să aflu primul", "Tell me first"),
  ctaLine: t(
    "Anunț întâlnirile noi pe Instagram. Ai o idee de proiect? Scrie-mi.",
    "I announce new gatherings on Instagram. Have an idea for a project? Write to me.",
  ),
  follow: t("Urmărește pe Instagram", "Follow on Instagram"),
  propose: t("Propune un proiect", "Suggest a project"),
  partnersTitle: t("Parteneri", "Partners"),
  partnersLead: [
    t(
      "Îmi doresc ca acest spațiu să crească firesc, odată cu oamenii pe care îi întâlnesc și cu proiectele în care cred. Să fie o punte între cei care creează și cei care caută, între cei care oferă și cei care au nevoie să descopere, să învețe sau pur și simplu să se bucure.",
      "I want this space to grow naturally, along with the people I meet and the projects I believe in. To be a bridge between those who create and those who search, between those who give and those who need to discover, to learn or simply to enjoy.",
    ),
    t(
      "Voi aduce aici poveștile colaboratorilor mei, activitățile lor și locurile în care îi poți descoperi, prin prezentări, fotografii și linkuri către proiectele lor.",
      "I will bring here the stories of my collaborators, their activities and the places where you can find them, through introductions, photographs and links to their projects.",
    ),
  ],
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
  // Sessions run 60–120 min (Ramona, 2026-10-10); prices are „în curând”. `minutes` only drives the demo calendar.
  formats: [
    { id: "intro" as FormatId, title: t("Primă discuție", "First conversation"), detail: t("15 min, telefonic, fără cost", "15 min, by phone, free"), minutes: 15 },
    { id: "online" as FormatId, title: t("Online", "Online"), detail: t("60–120 min", "60–120 min"), minutes: 60 },
    { id: "fata" as FormatId, title: t("Față în față", "In person"), detail: t("60–120 min", "60–120 min"), minutes: 60 },
  ],
  length: t("Durata", "Length"),
  timezone: t("Ora României", "Romania time"),
  prev: t("Luna anterioară", "Previous month"),
  next: t("Luna următoare", "Next month"),
  noSlots: t("În ziua asta nu mai sunt ore libere. Alege altă zi.", "No free times left that day. Pick another day."),
  pickDay: t("Alege o zi din calendar.", "Pick a day in the calendar."),
  fields: {
    phone: t("Telefon (opțional)", "Phone (optional)"),
    phoneCall: t("Telefon (te sun eu)", "Phone (I'll call you)"),
    phoneError: t("Lasă-mi un număr de telefon, ca să te pot suna.", "Leave me a phone number so I can call you."),
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
