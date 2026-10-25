import type { Field, GlobalConfig } from "payload";
import { revalidateGlobal } from "../hooks/revalidate";

const titleLine = (name: string, label: string): Field => ({
  name,
  label,
  type: "group",
  fields: [
    { name: "title", label: "Titlu", type: "text", localized: true, required: true },
    { name: "line", label: "Rând", type: "text", localized: true, required: true },
  ],
});

const link = (name: string, label: string, second: "handle" | "number"): Field => ({
  name,
  label,
  type: "group",
  fields: [
    {
      type: "row",
      fields: [
        { name: "href", label: "Link", type: "text", required: true },
        { name: second, label: second === "handle" ? "Nume afișat" : "Număr afișat", type: "text", required: true },
      ],
    },
  ],
});

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Setările site-ului",
  admin: { group: "Pagini" },
  versions: { drafts: true },
  hooks: revalidateGlobal(),
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Texte",
          fields: [
            { name: "name", label: "Nume", type: "text", required: true, defaultValue: "Ramona Nichifor" },
            { name: "roles", label: "Rolurile", type: "text", localized: true, required: true },
            { name: "rolesShort", label: "Rolurile, pe scurt", type: "text", localized: true, required: true },
            { name: "souls", label: "Motto („Povești pentru suflete mici și mari”)", type: "text", localized: true, required: true },
            { name: "whisper", label: "Subtitlul cărților", type: "text", localized: true, required: true },
            { name: "intro", label: "Fraza de prezentare", type: "textarea", localized: true, required: true },
            { name: "series", label: "Numele seriei", type: "text", localized: true, required: true },
            { name: "seriesLead", label: "Despre serie", type: "textarea", localized: true, required: true },
            {
              name: "manifesto",
              label: "Manifest (trei rânduri, cuvântul evidențiat la mijloc)",
              type: "array",
              maxRows: 3,
              fields: [
                {
                  type: "row",
                  fields: [
                    { name: "before", label: "Început", type: "text", localized: true, required: true },
                    { name: "emphasis", label: "Cuvântul evidențiat", type: "text", localized: true, required: true },
                    { name: "after", label: "Sfârșit", type: "text", localized: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Acasă",
          fields: [
            {
              name: "pillars",
              label: "Cele trei drumuri",
              type: "group",
              fields: [titleLine("books", "Cărți și universuri"), titleLine("art", "Artă"), titleLine("counselling", "Consiliere")],
            },
            {
              name: "artTeaser",
              label: "Secțiunea Artă",
              type: "group",
              fields: [
                { name: "title", label: "Titlu", type: "text", localized: true, required: true },
                { name: "lead", label: "Text", type: "textarea", localized: true, required: true },
              ],
            },
            {
              name: "home",
              label: "Ce apare pe Acasă",
              type: "group",
              fields: [
                { name: "featuredBook", label: "Cartea prezentată", type: "relationship", relationTo: "books" },
                { name: "artworks", label: "Lucrările (cel mult 3)", type: "relationship", relationTo: "artworks", hasMany: true, maxRows: 3 },
              ],
            },
          ],
        },
        {
          label: "Contact",
          fields: [
            { name: "portrait", label: "Portret", type: "upload", relationTo: "media", required: true },
            {
              name: "contacts",
              label: "Contacte",
              type: "group",
              fields: [
                { name: "email", label: "Email", type: "email", required: true },
                link("whatsapp", "WhatsApp", "number"),
                link("instagram", "Instagram", "handle"),
                link("facebook", "Facebook", "handle"),
              ],
            },
            {
              name: "sameAs",
              label: "Toate profilurile ei (pentru Google)",
              type: "array",
              fields: [{ name: "url", label: "Link", type: "text", required: true }],
            },
          ],
        },
        {
          label: "SEO",
          fields: [
            {
              name: "seo",
              label: "Implicit",
              type: "group",
              fields: [
                { name: "description", label: "Descriere în Google", type: "textarea", localized: true },
                { name: "shareImage", label: "Imagine la distribuire", type: "upload", relationTo: "media" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
