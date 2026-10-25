import type { CollectionConfig } from "payload";
import { revalidateCollection } from "../hooks/revalidate";
import { seoField, slugField } from "../fields";

export const Books: CollectionConfig = {
  slug: "books",
  labels: { singular: "Carte", plural: "Cărți" },
  admin: { useAsTitle: "title", defaultColumns: ["title", "ageGroup", "year", "status"], group: "Conținut" },
  versions: { drafts: true },
  hooks: revalidateCollection(),
  fields: [
    { name: "title", label: "Titlu", type: "text", localized: true, required: true },
    slugField("title"),
    { name: "subtitle", label: "Subtitlu", type: "text", localized: true },
    {
      name: "ageGroup",
      label: "Pentru",
      type: "select",
      required: true,
      defaultValue: "copii",
      options: [
        { label: "Copii", value: "copii" },
        { label: "Adolescenți", value: "adolescenti" },
        { label: "Adulți", value: "adulti" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "status",
      label: "Stare",
      type: "select",
      enumName: "enum_books_release",
      required: true,
      defaultValue: "writing",
      options: [
        { label: "Apărută", value: "published" },
        { label: "În curând", value: "soon" },
        { label: "În lucru", value: "writing" },
      ],
      admin: { position: "sidebar" },
    },
    { name: "cover", label: "Coperta", type: "upload", relationTo: "media", required: true },
    { name: "blurb", label: "Descriere", type: "richText", localized: true },
    {
      type: "row",
      fields: [
        { name: "year", label: "An", type: "number" },
        { name: "pages", label: "Pagini", type: "number" },
        { name: "isbn", label: "ISBN", type: "text" },
      ],
    },
    { name: "format", label: "Format", type: "text", localized: true, admin: { description: "Ex.: A4, copertă cartonată lucioasă" } },
    {
      name: "formats",
      label: "Alte formate",
      type: "array",
      fields: [
        { name: "label", label: "Format (ex.: E-book, Audiobook)", type: "text", required: true },
        {
          name: "status",
          label: "Stare",
          type: "select",
          defaultValue: "soon",
          options: [
            { label: "Disponibil", value: "available" },
            { label: "În curând", value: "soon" },
            { label: "Planificat", value: "planned" },
          ],
        },
      ],
    },
    {
      name: "storeLinks",
      label: "Unde se cumpără",
      type: "array",
      admin: { description: "Gol: pe site apare „Comenzile online se pregătesc.”" },
      fields: [
        { name: "store", label: "Magazin", type: "text", required: true },
        { name: "url", label: "Link", type: "text", required: true },
      ],
    },
    { name: "universe", label: "Universul", type: "relationship", relationTo: "universes" },
    {
      name: "leafPages",
      label: "Răsfoiește (coperta spate, apoi paginile alese)",
      type: "array",
      fields: [
        { name: "image", label: "Pagina", type: "upload", relationTo: "media", required: true },
        { name: "label", label: "Etichetă", type: "text", localized: true },
      ],
    },
    seoField,
  ],
};
