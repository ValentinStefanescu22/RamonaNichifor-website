import type { Text } from "../shared/content";
import { art, nav, pillars } from "../shared/content";

const t = (ro: string, en: string): Text => ({ ro, en });

// Journal-only wording (handwritten notes, chapter furniture)
export const words = {
  me: t("eu, între două povești", "me, between two stories"),
  contents: t("Cuprins", "Contents"),
  page: t("pagina", "page"),
  cover: t("prima carte din serie", "the first book in the series"),
  specimens: t("colecția de până acum", "the collection so far"),
  studio: t("din atelier", "from the studio"),
  available: t("disponibil!", "out now!"),
  soon: t("în curând", "coming soon"),
  inWorks: t("în lucru", "in the works"),
  letterOpen: t("Dacă simți că e momentul,", "If it feels like the right time,"),
  signature: "Ramona",
  lastPage: t("ultima pagină, deocamdată", "the last page, for now"),
  forAges: t("Cărți pentru", "Books for"),
};

export type Chapter = { id: string; num: string; title: Text; page: number };

export const chapters: Chapter[] = [
  { id: "carti", num: "I", title: nav.books, page: 2 },
  { id: "universuri", num: "II", title: nav.universes, page: 3 },
  { id: "arta", num: "III", title: art.title, page: 4 },
  { id: "consiliere", num: "IV", title: nav.counselling, page: 5 },
];

export const chapterLines: Record<string, Text> = {
  carti: pillars.books.line,
  universuri: t("Fiecare personaj are o lume a lui.", "Every character has a world of its own."),
  arta: pillars.art.line,
  consiliere: pillars.counselling.line,
};
