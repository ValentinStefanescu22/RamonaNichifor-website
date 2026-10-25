import type { CollectionConfig } from "payload";
import { revalidateCollection } from "../hooks/revalidate";
import { seoField, slugField } from "../fields";

export const Artworks: CollectionConfig = {
  slug: "artworks",
  labels: { singular: "Lucrare", plural: "Lucrări (artă)" },
  admin: { useAsTitle: "title", defaultColumns: ["title", "kind", "availability"], group: "Conținut" },
  versions: { drafts: true },
  hooks: revalidateCollection(),
  fields: [
    { name: "title", label: "Titlu", type: "text", localized: true, required: true },
    slugField("title"),
    { name: "images", label: "Imagini (prima e principala)", type: "upload", relationTo: "media", hasMany: true, required: true, minRows: 1 },
    {
      name: "kind",
      label: "Tip",
      type: "select",
      required: true,
      defaultValue: "original",
      options: [
        { label: "Original", value: "original" },
        { label: "Print", value: "print" },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "availability",
      label: "Disponibilitate",
      type: "select",
      required: true,
      defaultValue: "preorder",
      options: [
        { label: "Pre-comandă", value: "preorder" },
        { label: "Vândut", value: "sold" },
        { label: "La cerere", value: "onRequest" },
      ],
      admin: { position: "sidebar" },
    },
    { name: "technique", label: "Tehnică", type: "text", localized: true },
    {
      type: "row",
      fields: [
        { name: "size", label: "Dimensiune", type: "text" },
        { name: "year", label: "An", type: "number" },
        { name: "price", label: "Preț (lei, opțional)", type: "number" },
      ],
    },
    { name: "description", label: "Descriere", type: "richText", localized: true },
    seoField,
  ],
};
