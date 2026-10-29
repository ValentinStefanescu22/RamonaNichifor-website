# Ramona Nichifor — website

Website for Ramona Nichifor, a Romanian children's book author, watercolour illustrator and personal development counsellor. Bilingual (Romanian by default, English at `/en`), mobile-first, with a CMS she edits herself.

**Live preview:** https://ramona-nichifor-website.vercel.app/ (not indexed until launch)

## Stack

- **Next.js 16** (App Router, React 19, TypeScript) with **Tailwind CSS v4** and **Motion**
- **Payload CMS 3** in the same app (admin at `/admin`), **PostgreSQL** on Neon, uploads on **Cloudflare R2**
- **next-intl** for RO/EN routing, **Resend** + **Cloudflare Turnstile** for the contact form
- **Playwright** end-to-end tests (phone and laptop sizes, both languages, axe accessibility checks)
- Hosted on **Vercel**; nightly database backups through a GitHub Action

## Highlights

- Every page reads its content from the CMS, with drafts, Live Preview and on-demand revalidation
- Illustrations get a copyright stamp and a size cap automatically on upload
- SEO: per-page metadata, hreflang, canonical URLs, sitemap, generated Open Graph images and JSON-LD (Book, VisualArtwork, FAQPage, Event, ProfilePage)
- Shared-element transitions between the universe map and each universe page, with reduced motion respected
- Contact form protected by a honeypot, a time trap, Turnstile and rate limiting, and nothing is stored

## Run locally

Requires Node 22+ and a local PostgreSQL database.

```bash
npm install
cp .env.example .env.local   # then fill in the values
npx payload migrate
npm run seed                 # sample content and a local admin user
npm run dev                  # http://localhost:3000
```

Tests: `npm run typecheck`, `npm run test:unit`, `npm test`.
