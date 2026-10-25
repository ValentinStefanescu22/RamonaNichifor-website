import type { Field, GlobalConfig } from "payload";
import { revalidateGlobal } from "../hooks/revalidate";

/** A list of short localized lines (rows of one text field) */
const kindOf = (textarea: boolean) => (textarea ? "textarea" : "text") as "text";
const lines = (name: string, label: string, textarea = false): Field => ({
  name,
  label,
  type: "array",
  fields: [{ name: "text", label: "Text", type: kindOf(textarea), localized: true, required: true }],
});
const text = (name: string, label: string, textarea = false): Field => ({ name, label, type: kindOf(textarea), localized: true });

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
    text("tagline", "Rândul de sub titlu"),
    { name: "intro", label: "Introducere", type: "richText", localized: true },
    { name: "approach", label: "Cum lucrez", type: "richText", localized: true },
    {
      name: "patterns",
      label: "Ce se repetă în viața ta?",
      type: "group",
      fields: [
        text("title", "Titlu"),
        lines("questions", "Întrebări", true),
        lines("reactions", "Reacții"),
        text("thesis", "Ce fac eu", true),
        {
          name: "path",
          label: "Drumul, pas cu pas",
          type: "array",
          fields: [{ name: "label", label: "Pas", type: "text", localized: true, required: true }],
        },
        text("explain", "Invitația", true),
        text("change", "Despre schimbare", true),
        text("closer", "Rândul de final"),
        lines("toward", "Spre ce mergem"),
      ],
    },
    {
      name: "rightForYou",
      label: "Cum știi dacă este pentru tine?",
      type: "group",
      fields: [
        text("title", "Titlu"),
        lines("maybe", "Poți fi…", true),
        lines("body", "Paragrafele", true),
        text("simply", "Rândul scurt"),
        text("here", "Și aici intervin eu"),
        lines("offer", "Ce ofer", true),
        text("close", "Încheierea", true),
      ],
    },
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
    text("ctaTitle", "Titlul de la final"),
  ],
};

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "Pagina Despre mine",
  admin: { group: "Pagini" },
  versions: { drafts: true },
  hooks: revalidateGlobal(),
  fields: [
    { type: "row", fields: [text("titleA", "Titlu, prima parte"), text("titleB", "Titlu, partea cursivă")] },
    text("role", "Rândul de sub titlu"),
    { name: "portrait", label: "Portret", type: "upload", relationTo: "media" },
    { name: "bio", label: "Povestea mea", type: "richText", localized: true },
    {
      name: "story",
      label: "Povestea ei, rând cu rând",
      type: "array",
      admin: { description: "Un rând = o frază. „Pauză înainte” începe o nouă secțiune (patru în total)." },
      fields: [
        {
          name: "kind",
          label: "Tip",
          type: "select",
          enumName: "enum_about_story_kind",
          required: true,
          defaultValue: "beat",
          options: [
            { label: "Frază", value: "beat" },
            { label: "Întrebări", value: "question" },
            { label: "Încheiere", value: "closing" },
          ],
        },
        { name: "breakBefore", label: "Pauză înainte", type: "checkbox" },
        { name: "text", label: "Text", type: "textarea", localized: true, required: true },
      ],
    },
    {
      name: "crafts",
      label: "Trei meșteșuguri",
      type: "group",
      fields: [
        text("title", "Titlu"),
        {
          name: "items",
          label: "Meșteșugurile",
          type: "array",
          fields: [
            { name: "name", label: "Nume", type: "text", localized: true, required: true },
            { name: "line", label: "Un rând", type: "text", localized: true, required: true },
            { name: "href", label: "Către (ex.: /carti)", type: "text", required: true },
            { name: "tint", label: "Culoare (#RRGGBB)", type: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "highlights",
      label: "Repere",
      type: "array",
      fields: [{ name: "text", label: "Text", type: "text", localized: true, required: true }],
    },
  ],
};

export const BooksPage: GlobalConfig = {
  slug: "books-page",
  label: "Pagina Cărți",
  admin: { group: "Pagini" },
  versions: { drafts: true },
  hooks: revalidateGlobal(),
  fields: [
    text("seriesNote", "Seria"),
    {
      name: "author",
      label: "Despre autor",
      type: "group",
      fields: [
        text("title", "Titlu"),
        lines("paragraphs", "Paragrafele", true),
        text("statement", "Rândul de final", true),
        {
          name: "formats",
          label: "Alte formate",
          type: "array",
          fields: [
            { name: "label", label: "Format", type: "text", localized: true, required: true },
            {
              name: "status",
              label: "Stare",
              type: "select",
              enumName: "enum_books_page_format_status",
              required: true,
              defaultValue: "soon",
              options: [
                { label: "În curând", value: "soon" },
                { label: "Planificat", value: "planned" },
              ],
            },
            text("line", "Un rând (opțional)", true),
          ],
        },
      ],
    },
  ],
};

export const CommunityPage: GlobalConfig = {
  slug: "community-page",
  label: "Pagina Comunitate",
  admin: { group: "Pagini" },
  versions: { drafts: true },
  hooks: revalidateGlobal(),
  fields: [
    { type: "row", fields: [text("titleA", "Titlu, prima parte"), text("titleB", "Titlu, partea cursivă")] },
    text("tagline", "Rândul de sub titlu"),
    text("lead", "Începutul", true),
    text("intro", "Introducere", true),
    text("eventsTitle", "Întâlniri, titlu"),
    text("eventsLead", "Întâlniri, text", true),
    text("projectsTitle", "Proiecte, titlu"),
    text("projectsLead", "Proiecte, text", true),
    text("partnersTitle", "Parteneri, titlu"),
    lines("partnersLead", "Parteneri, text", true),
    text("closing", "Încheierea", true),
    text("ctaTitle", "Titlul de la final"),
    text("ctaLine", "Rândul de la final", true),
  ],
};

export const ContactPage: GlobalConfig = {
  slug: "contact-page",
  label: "Pagina Contact",
  admin: { group: "Pagini" },
  versions: { drafts: true },
  hooks: revalidateGlobal(),
  fields: [text("tagline", "Rândul de sub titlu", true)],
};
