// Every page of spec §4, in Romanian and English, with the seeded slugs (npm run seed). Shared by tests/a11y.spec.ts and the
// routing crawl (Task 9). `pending` marks a page that still answers 404 because its task has not built it yet: the page task that
// builds it deletes the flag, and from then on the a11y test demands a 200.
export type PageEntry = { path: string; name: string; pending?: boolean };

const both = (name: string, ro: string, en: string, pending?: boolean): PageEntry[] => [
  { path: ro, name: `${name} (ro)`, pending },
  { path: en, name: `${name} (en)`, pending },
];

export const PAGES: PageEntry[] = [
  ...both("home", "/", "/en"),
  ...both("universes", "/universuri", "/en/universes"),
  ...both("universe", "/universuri/fluturele", "/en/universes/butterfly"),
  ...both("product", "/universuri/fluturele/semn-de-carte", "/en/universes/butterfly/bookmark"),
  ...both("books", "/carti", "/en/books"),
  ...both("book", "/carti/fluturele-dansator-de-step", "/en/books/the-tap-dancing-butterfly"),
  ...both("art", "/arta", "/en/art"),
  ...both("artwork", "/arta/poiana-fluturelui", "/en/art/the-butterflys-meadow"),
  ...both("counselling", "/consiliere", "/en/counselling"),
  ...both("about", "/despre", "/en/about"),
  ...both("community", "/comunitate", "/en/community"),
  ...both("contact", "/contact", "/en/contact"),
  ...both("privacy", "/confidentialitate", "/en/privacy"),
  ...both("terms", "/termeni", "/en/terms"),
];
