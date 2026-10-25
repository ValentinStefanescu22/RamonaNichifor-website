import type { GlobalConfig } from "payload";
import { revalidateGlobal } from "../hooks/revalidate";

export const CounsellingPage: GlobalConfig = {
  slug: "counselling-page",
  label: "Pagina Consiliere",
  admin: { group: "Pagini" },
  versions: { drafts: true },
  hooks: revalidateGlobal(),
  fields: [
    { name: "teaserTitle", label: "Titlu (pe Acasă)", type: "text", localized: true, required: true },
    { name: "teaserLead", label: "Text (pe Acasă)", type: "textarea", localized: true, required: true },
    {
      name: "formats",
      label: "Formate",
      type: "array",
      fields: [
        {
          name: "kind",
          label: "Tip",
          type: "select",
          required: true,
          options: [
            { label: "Online", value: "online" },
            { label: "Față în față", value: "inPerson" },
          ],
        },
        { name: "title", label: "Titlu", type: "text", localized: true, required: true },
        { name: "line", label: "Rând", type: "text", localized: true, required: true },
      ],
    },
    { name: "intro", label: "Introducere", type: "richText", localized: true },
    { name: "approach", label: "Cum lucrez", type: "richText", localized: true },
    {
      name: "sessions",
      label: "Ședințe (durată și preț; gol = nu se afișează)",
      type: "array",
      fields: [
        {
          type: "row",
          fields: [
            { name: "minutes", label: "Minute", type: "number", required: true },
            { name: "priceEur", label: "Preț (€)", type: "number" },
          ],
        },
      ],
    },
    {
      name: "steps",
      label: "Cum decurge",
      type: "array",
      fields: [
        { name: "title", label: "Pas", type: "text", localized: true, required: true },
        { name: "text", label: "Text", type: "textarea", localized: true },
      ],
    },
    {
      name: "faq",
      label: "Întrebări frecvente",
      type: "array",
      fields: [
        { name: "question", label: "Întrebare", type: "text", localized: true, required: true },
        { name: "answer", label: "Răspuns", type: "richText", localized: true },
      ],
    },
  ],
};

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "Pagina Despre mine",
  admin: { group: "Pagini" },
  versions: { drafts: true },
  hooks: revalidateGlobal(),
  fields: [
    { name: "portrait", label: "Portret", type: "upload", relationTo: "media" },
    { name: "bio", label: "Povestea mea", type: "richText", localized: true },
    {
      name: "highlights",
      label: "Repere",
      type: "array",
      fields: [{ name: "text", label: "Text", type: "text", localized: true, required: true }],
    },
  ],
};
