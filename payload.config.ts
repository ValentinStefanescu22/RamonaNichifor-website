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
import { s3Storage } from "@payloadcms/storage-s3";
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
import { AboutPage, BooksPage, CommunityPage, ContactPage, CounsellingPage } from "./payload/globals/Pages";
import { SiteSettings } from "./payload/globals/SiteSettings";
import { previewPath } from "./payload/livePreviewPath";

const dirname = path.dirname(fileURLToPath(import.meta.url));

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
      globals: ["site-settings", "counselling-page", "about-page", "books-page", "community-page", "contact-page"],
      url: async ({ collectionConfig, globalConfig, data, locale, req }) => {
        // a product lives under its universe; the form usually holds just the universe's id, so look the slug up
        const u = data?.universe;
        const universeSlug =
          collectionConfig?.slug !== "products" || !u
            ? undefined
            : typeof u === "object"
              ? (u as { slug?: string }).slug
              : (await req.payload.findByID({ collection: "universes", id: u as number, locale: locale.code as "ro" | "en", depth: 0, select: { slug: true } }).catch(() => null))?.slug;
        const p = previewPath({ collection: collectionConfig?.slug, global: globalConfig?.slug, slug: data?.slug, kind: data?.kind, universeSlug, locale: locale.code });
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
  globals: [SiteSettings, CounsellingPage, AboutPage, BooksPage, CommunityPage, ContactPage],
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
    // DATABASE_URI (local Postgres in dev) wins; otherwise Neon's pooled DATABASE_URL (Vercel, `neon env pull`)
    pool: { connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL },
    // schema changes ship as committed migrations (migrations/), never auto-pushed
    push: false,
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  graphQL: { disable: true },
  plugins: [
    // Uploads in Cloudflare R2 when S3_BUCKET is set, else on disk in media/. The bucket stays private (backups/ live
    // there too): files are served through /api/media/file/…, so image URLs are the same in both modes.
    s3Storage({
      enabled: Boolean(process.env.S3_BUCKET),
      // same columns (_objectKey) with or without R2, so one migration history fits every environment
      alwaysInsertFields: true,
      collections: { media: true },
      bucket: process.env.S3_BUCKET ?? "",
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: "auto",
        credentials: { accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "", secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "" },
        // R2 rejects the AWS SDK's newer default checksum headers
        requestChecksumCalculation: "WHEN_REQUIRED",
        responseChecksumValidation: "WHEN_REQUIRED",
      },
    }),
  ],
  sharp,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
