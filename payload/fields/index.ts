import type { Field, TextField } from "payload";

/** Plain ASCII slug from any title: „Țânțarul cu cizme” → "tantarul-cu-cizme". Slugs never carry diacritics (spec §4). */
export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** Localized slug: filled from `from` when left empty, always normalized, unique per locale. */
export const slugField = (from: string): TextField => ({
  name: "slug",
  label: "Adresă (slug)",
  type: "text",
  localized: true,
  required: true,
  unique: true,
  index: true,
  admin: { position: "sidebar", description: "Partea din link, fără diacritice. Se completează singură din titlu." },
  hooks: {
    beforeValidate: [({ value, data }) => slugify(String(value || data?.[from] || ""))],
  },
});

/** Per-page SEO overrides; empty fields fall back to the site defaults. */
export const seoField: Field = {
  name: "seo",
  label: "SEO",
  type: "group",
  admin: { description: "Opțional. Gol înseamnă că se folosesc textele paginii." },
  fields: [
    { name: "title", label: "Titlu în Google", type: "text", localized: true },
    { name: "description", label: "Descriere în Google", type: "textarea", localized: true },
    { name: "image", label: "Imagine la distribuire", type: "upload", relationTo: "media" },
  ],
};

export const statusSoon = (enumName: string, name = "status", label = "Stare"): Field => ({
  name,
  label,
  type: "select",
  // drafts already create enum_<collection>_status for `_status`; a named enum avoids the clash
  enumName,
  required: true,
  defaultValue: "soon",
  options: [
    { label: "Disponibil", value: "available" },
    { label: "În curând", value: "soon" },
  ],
  admin: { position: "sidebar" },
});

export const orderField: Field = {
  name: "order",
  label: "Ordine",
  type: "number",
  defaultValue: 0,
  admin: { position: "sidebar", description: "Mai mic apare primul." },
};
