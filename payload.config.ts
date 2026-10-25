import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import {
  BoldFeature,
  HeadingFeature,
  InlineToolbarFeature,
  ItalicFeature,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { ro } from "@payloadcms/translations/languages/ro";
import { buildConfig } from "payload";
import sharp from "sharp";
import { Artworks } from "./payload/collections/Artworks";
import { Books } from "./payload/collections/Books";
import { Events, LegalPages, Partners, Projects } from "./payload/collections/Community";
import { Media } from "./payload/collections/Media";
import { Products } from "./payload/collections/Products";
import { Universes } from "./payload/collections/Universes";
import { Users } from "./payload/collections/Users";
import { AboutPage, CounsellingPage } from "./payload/globals/Pages";
import { SiteSettings } from "./payload/globals/SiteSettings";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** The public page a document shows on, in the admin's current locale (mirrors the next-intl pathnames). */
function publicPath({ collection, slug, locale }: { collection?: string; slug?: unknown; locale: string }) {
  const en = locale === "en";
  const base = { universes: en ? "/en/universes" : "/universuri", books: en ? "/en/books" : "/carti" }[collection ?? ""];
  if (base && typeof slug === "string" && slug) return `${base}/${slug}`;
  return en ? "/en" : "/";
}

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET ?? "",
  serverURL: process.env.NEXT_PUBLIC_SITE_URL,
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
    meta: {
      titleSuffix: " · Ramona Nichifor",
      robots: "noindex, nofollow",
      icons: [{ rel: "icon", type: "image/png", url: "/icon.png" }],
    },
    components: {
      graphics: { Logo: "/payload/admin/Brand#Logo", Icon: "/payload/admin/Brand#Icon" },
    },
    // Live Preview: the page beside the form, in draft mode (app/api/preview). Runs server-side, so the secret stays in the admin.
    livePreview: {
      collections: ["universes", "books", "products", "artworks", "events", "projects", "partners", "legal-pages"],
      globals: ["site-settings", "counselling-page", "about-page"],
      url: ({ collectionConfig, data, locale, req }) => {
        const p = publicPath({ collection: collectionConfig?.slug, slug: data?.slug, locale: locale.code });
        const q = new URLSearchParams({ secret: process.env.PREVIEW_SECRET ?? "", path: p });
        // absolute: the admin posts messages to this URL's origin
        return `${req.origin}/api/preview?${q}`;
      },
      breakpoints: [
        { name: "phone", label: "Telefon", width: 393, height: 852 },
        { name: "laptop", label: "Laptop", width: 1180, height: 800 },
      ],
    },
  },
  // Ramona works in Romanian; the admin speaks only Romanian
  i18n: { supportedLanguages: { ro }, fallbackLanguage: "ro" },
  localization: {
    locales: [
      { code: "ro", label: "Română" },
      { code: "en", label: "English" },
    ],
    defaultLocale: "ro",
    fallback: true,
  },
  collections: [Universes, Books, Products, Artworks, Events, Projects, Partners, LegalPages, Media, Users],
  globals: [SiteSettings, CounsellingPage, AboutPage],
  // only the formatting the design uses: paragraphs, bold/italic, links, lists, h2–h3
  editor: lexicalEditor({
    features: () => [
      ParagraphFeature(),
      HeadingFeature({ enabledHeadingSizes: ["h2", "h3"] }),
      BoldFeature(),
      ItalicFeature(),
      LinkFeature(),
      UnorderedListFeature(),
      OrderedListFeature(),
      InlineToolbarFeature(),
    ],
  }),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URI },
    // schema changes ship as committed migrations (migrations/), never auto-pushed
    push: false,
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  graphQL: { disable: true },
  sharp,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
