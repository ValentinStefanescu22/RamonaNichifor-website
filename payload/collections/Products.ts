import type { CollectionConfig } from "payload";
import { revalidateCollection } from "../hooks/revalidate";
import { seoField, slugField, statusSoon } from "../fields";

export const Products: CollectionConfig = {
  slug: "products",
  labels: { singular: "Obiect", plural: "Obiecte" },
  admin: { useAsTitle: "name", defaultColumns: ["name", "kind", "universe", "status"], group: "Conținut" },
  versions: { drafts: true },
  hooks: revalidateCollection(),
  fields: [
    { name: "name", label: "Nume", type: "text", localized: true, required: true },
    slugField("name"),
    {
      name: "kind",
      label: "Tip",
      type: "select",
      required: true,
      options: [
        { label: "Semn de carte", value: "semn-de-carte" },
        { label: "Cărți de joc", value: "carti-de-joc" },
        { label: "Puzzle", value: "puzzle" },
        { label: "Joc de familie", value: "joc-de-familie" },
      ],
    },
    statusSoon("enum_products_release"),
    { name: "universe", label: "Universul", type: "relationship", relationTo: "universes" },
    { name: "images", label: "Imagini", type: "upload", relationTo: "media", hasMany: true },
    { name: "description", label: "Descriere", type: "richText", localized: true },
    {
      name: "specs",
      label: "Detalii",
      type: "array",
      fields: [
        { name: "label", label: "Ce", type: "text", localized: true, required: true },
        { name: "value", label: "Valoare", type: "text", localized: true, required: true },
      ],
    },
    { name: "price", label: "Preț (lei, opțional)", type: "number", admin: { description: "Gol: „Preț în curând”." } },
    { name: "externalLink", label: "Link extern (opțional)", type: "text" },
    seoField,
  ],
};
