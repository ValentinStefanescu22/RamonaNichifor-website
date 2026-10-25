import type { CollectionConfig } from "payload";
import { revalidateCollection } from "../hooks/revalidate";
import { orderField, seoField, slugField, statusSoon } from "../fields";

const hex = (v: unknown) => (typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v)) || "Culoare în format #RRGGBB";

export const Universes: CollectionConfig = {
  slug: "universes",
  labels: { singular: "Univers", plural: "Universuri" },
  admin: { useAsTitle: "name", defaultColumns: ["name", "status", "order"], group: "Conținut" },
  versions: { drafts: true },
  hooks: revalidateCollection(),
  defaultSort: "order",
  fields: [
    { name: "name", label: "Nume", type: "text", localized: true, required: true },
    slugField("name"),
    { name: "bookTitle", label: "Titlul cărții", type: "text", localized: true, required: true },
    { name: "hook", label: "Fraza de deschidere", type: "textarea", localized: true, required: true },
    { name: "story", label: "Povestea (opțional)", type: "richText", localized: true },
    statusSoon("enum_universes_release"),
    orderField,
    {
      name: "tint",
      label: "Culorile universului",
      type: "group",
      fields: [
        {
          type: "row",
          fields: [
            { name: "light", label: "Deschisă", type: "text", required: true, validate: hex },
            { name: "mid", label: "Mijlocie", type: "text", required: true, validate: hex },
            { name: "deep", label: "Închisă", type: "text", required: true, validate: hex },
          ],
        },
      ],
    },
    {
      name: "homeWindow",
      label: "Fereastra de pe Acasă",
      type: "select",
      required: true,
      defaultValue: "creature",
      options: [
        { label: "Poiana (fluturele aterizează aici)", value: "meadow" },
        { label: "Pictura ei", value: "scene" },
        { label: "Personajul desenat", value: "creature" },
      ],
    },
    {
      name: "scene",
      label: "Pictura pentru fereastră",
      type: "upload",
      relationTo: "media",
      admin: { condition: (_, s) => s?.homeWindow === "scene" },
    },
    {
      name: "creature",
      label: "Personaj desenat (până vin ilustrațiile)",
      type: "select",
      options: [
        { label: "Buburuza", value: "buburuza" },
        { label: "Țânțarul", value: "tantar" },
        { label: "Musca", value: "musca" },
      ],
    },
    { name: "books", label: "Cărți", type: "relationship", relationTo: "books", hasMany: true },
    { name: "products", label: "Obiecte", type: "relationship", relationTo: "products", hasMany: true },
    seoField,
  ],
};
