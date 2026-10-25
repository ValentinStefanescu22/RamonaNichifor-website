import type { CollectionConfig } from "payload";
import { revalidateCollection } from "../hooks/revalidate";
import { orderField } from "../fields";

export const Events: CollectionConfig = {
  slug: "events",
  labels: { singular: "Întâlnire", plural: "Întâlniri" },
  admin: { useAsTitle: "title", defaultColumns: ["title", "kind", "startsAt", "status"], group: "Comunitate" },
  versions: { drafts: true },
  hooks: revalidateCollection(),
  fields: [
    { name: "title", label: "Titlu", type: "text", localized: true, required: true },
    {
      name: "kind",
      label: "Tip",
      type: "select",
      required: true,
      options: [
        { label: "Atelier de pictură", value: "atelier-pictura" },
        { label: "Lansare de carte", value: "lansare" },
        { label: "Sesiune de autografe", value: "autografe" },
        { label: "Atelier de citit", value: "atelier-citit" },
      ],
    },
    {
      name: "startsAt",
      label: "Data și ora (gol = „Datele, în curând”)",
      type: "date",
      admin: { date: { pickerAppearance: "dayAndTime", timeFormat: "HH:mm" } },
    },
    { name: "place", label: "Locul", type: "text", localized: true },
    { name: "online", label: "Online", type: "checkbox" },
    { name: "audience", label: "Pentru cine", type: "text", localized: true },
    { name: "image", label: "Imagine", type: "upload", relationTo: "media" },
    { name: "signUpNote", label: "Cum te înscrii", type: "textarea", localized: true },
    {
      name: "status",
      label: "Stare",
      type: "select",
      enumName: "enum_events_timing",
      defaultValue: "upcoming",
      options: [
        { label: "Urmează", value: "upcoming" },
        { label: "A avut loc", value: "past" },
      ],
      admin: { position: "sidebar" },
    },
  ],
};

export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "Proiect cu sens", plural: "Proiecte cu sens" },
  admin: { useAsTitle: "title", group: "Comunitate" },
  versions: { drafts: true },
  hooks: revalidateCollection(),
  defaultSort: "order",
  fields: [
    { name: "title", label: "Titlu", type: "text", localized: true, required: true },
    { name: "line", label: "Un rând despre proiect", type: "text", localized: true },
    { name: "image", label: "Imagine", type: "upload", relationTo: "media" },
    {
      name: "status",
      label: "Stare",
      type: "select",
      enumName: "enum_projects_stage",
      defaultValue: "idee",
      options: [
        { label: "Idee", value: "idee" },
        { label: "În pregătire", value: "in-pregatire" },
        { label: "În desfășurare", value: "in-desfasurare" },
        { label: "Încheiat", value: "incheiat" },
      ],
      admin: { position: "sidebar" },
    },
    orderField,
  ],
};

export const Partners: CollectionConfig = {
  slug: "partners",
  labels: { singular: "Partener", plural: "Parteneri" },
  admin: { useAsTitle: "name", group: "Comunitate" },
  versions: { drafts: true },
  hooks: revalidateCollection(),
  defaultSort: "order",
  fields: [
    { name: "name", label: "Nume", type: "text", required: true },
    { name: "handle", label: "Cont (ex.: @nume, opțional)", type: "text" },
    { name: "logo", label: "Logo (opțional)", type: "upload", relationTo: "media" },
    { name: "line", label: "Un rând despre ei", type: "text", localized: true },
    { name: "url", label: "Link", type: "text" },
    orderField,
  ],
};

export const LegalPages: CollectionConfig = {
  slug: "legal-pages",
  labels: { singular: "Pagină legală", plural: "Pagini legale" },
  admin: { useAsTitle: "title", group: "Administrare" },
  versions: { drafts: true },
  hooks: revalidateCollection(),
  fields: [
    {
      name: "kind",
      label: "Pagina",
      type: "select",
      required: true,
      unique: true,
      options: [
        { label: "Confidențialitate", value: "privacy" },
        { label: "Termeni", value: "terms" },
      ],
    },
    { name: "title", label: "Titlu", type: "text", localized: true, required: true },
    { name: "body", label: "Text", type: "richText", localized: true },
    { name: "lastUpdated", label: "Actualizat la", type: "date" },
  ],
};
