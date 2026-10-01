# Ramona Nichifor · website spec

Status: **draft for review** · 2026-09-30 · updated 2026-10-01 (CMS switched from Sanity to Payload)
Related: [PRODUCT.md](../../../PRODUCT.md) (product truth) · [DESIGN.md](../../../DESIGN.md) (design system) · mockups in [`mockups/`](../../../mockups/) (published concepts: https://claude.ai/artifact/ASM9hocLQERfJYaWtY6zYE)

---

## 1. Goal and success criteria

Build Ramona Nichifor's own website: her books and story universes, her art, and her counselling practice. It is bilingual, looks and moves like the approved **Poiana** concept, and she edits it herself.

The site is done when:

1. A first-time visitor on a phone understands who she is within one screen and reaches books, art or counselling in one tap.
2. Searching **"Ramona Nichifor"** on Google returns this site first. It should also rank for her book titles.
3. Ramona can change any text, image, book, artwork or universe in the CMS without help, and see it live within a minute.
4. Romanian is the default and English is complete. Every page has both versions, and the language switch is on every page.
5. Phone Lighthouse scores on key pages: SEO 100, Accessibility ≥ 95, Performance ≥ 90.

## 2. Decisions already made

| Topic | Decision |
|---|---|
| Visual direction | **Concept A · Poiana**, chosen by the client |
| Universuri | Concept C's orbs, pollen and orb opening on a **sky in the Poiana palette**. No meadow background, and no line between the worlds: they drift freely, and the one being looked at grows. Each universe page is tinted in its own colour. |
| Universe detail | Tapping an orb **morphs it into its own page** (`/universuri/[slug]`), so it can be shared and indexed |
| Stack | Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Motion |
| CMS | **Payload 3**, installed inside the Next.js app (admin at `/admin`), Postgres database, images in S3-compatible storage. Chosen over Sanity (2026-10-01) because a shop is likely later and Payload's e-commerce plugin keeps it in the same admin; the software is free and open source (MIT). |
| Languages | RO default at `/`, EN at `/en`; more languages later |
| Shop | None yet. Books link out to eMAG, Amazon, etc. Cart and payments come after her PFA is set up, as a later milestone (M7, §13) on Payload's e-commerce plugin. |
| Copy rule | Never use „Bine ai revenit acasă, puiule!” / "Welcome home, baby" |
| Hosting | **Open.** Decided before launch (see §12) |
| Delivery | Six milestones (M1–M6), each with its own plan, preview link and review stop, plus the shop as M7 later (see §13) |

## 3. Audiences (equal weight on the home page)

1. **Parents, grandparents and gift-givers** buying her children's books. Most arrive from Instagram, Facebook or WhatsApp, on a phone.
2. **Adults looking for personal-development counselling**, online or in person.
3. **Art lovers** interested in her originals and prints.

## 4. Sitemap and URLs

Slugs are localised with next-intl `pathnames`. RO has no prefix; EN lives under `/en`.

| Page | RO | EN |
|---|---|---|
| Home | `/` | `/en` |
| Universes (map of worlds) | `/universuri` | `/en/universes` |
| Universe | `/universuri/fluturele` | `/en/universes/butterfly` |
| Books (by age) | `/carti` | `/en/books` |
| Book | `/carti/fluturele-dansator-de-step` | `/en/books/the-tap-dancing-butterfly` |
| Art gallery | `/arta` | `/en/art` |
| Artwork | `/arta/[slug]` | `/en/art/[slug]` |
| Counselling | `/consiliere` | `/en/counselling` |
| About | `/despre` | `/en/about` |
| Contact | `/contact` | `/en/contact` |
| Privacy | `/confidentialitate` | `/en/privacy` |
| Terms | `/termeni` | `/en/terms` |
| Not found | any unknown URL | same, in EN |
| CMS admin | `/admin` | not indexed, not localised |

Slugs never contain diacritics. A slug change in the CMS creates a 301 redirect from the old one (handled in M5).

## 5. Pages

The visual vocabulary for all pages is DESIGN.md. Each page below lists its purpose, sections, where the content comes from, and the interaction that matters.

### 5.1 Home `/`
Port of the approved Poiana mockup (`mockups/src/poiana/`).
1. **Hero:**
   - her name as the `<h1>` („Ramona” / *„Nichifor”*), the souls tagline, and the roles line
   - the CTA „Intră în poveste”
   - her cover butterfly hovering beside the name
   - the meadow at the bottom, with **three path pills** (Cărți · Artă · Consiliere)
2. **Intro + three paths** (books & universes / art / counselling), equal weight.
3. **Universuri preview:**
   - arched windows, one per universe
   - **the butterfly flies down the page and lands in the Fluture window**
   - each window links to `/universuri/[slug]`
4. **Featured book.** The cover with a 3D tilt on laptop, the blurb, and store buttons.
5. **About teaser.** Arched portrait, intro line, link to `/despre`.
6. **Art teaser.** Three framed pieces, link to `/arta`.
7. **Counselling teaser.** The manifesto „Între rațiune și intuiție…”, two formats, a call to action.
8. **Footer.** Name, tagline, socials, email with a copy button, nav, legal links.

All content comes from Payload: the `site-settings` global, the featured book, the universes, the first artworks, and the `counselling-page` and `about-page` globals.

### 5.2 Universuri `/universuri`
Port of `mockups/src/universuri-poiana/`.
- A Poiana-palette sky with watercolour clouds and drifting pollen.
- The `<h1>` „Universuri”, then „Magia suntem noi” and the series lead.
- A map of worlds: free-floating watercolour orbs, **with no line connecting them**. Each drifts constantly and smoothly on its own slow loop.
- **All worlds are the same size at rest; the world being looked at grows and the others step back.** On laptop that's the one under the mouse, or keyboard focus. On phones nothing grows until the visitor scrolls; then it's the one nearest the middle of the screen, so the page leaves room below the map for the last world to reach the middle. Values are in DESIGN.md (Orb drift, Orb focus).
- Labels show each universe's name and status („Disponibilă” / „În curând”).
- **Tapping an orb morphs it into the hero of the universe page** (§5.3). Shared-element View Transition; plain navigation where unsupported.
- Phone: all four worlds fit on the first screen (already validated in the mockup).

### 5.3 Universe `/universuri/[slug]`
- The sky tinted in the universe colour (`tint`), with pollen in that colour.
- A back pill „← Universuri” and the language switch.
- **Hero orb** (the morph target), the universe name as `<h1>`, the book title, a status chip, and a hook paragraph. An optional longer story in rich text.
- **„În acest univers”**: the book(s) and products (bookmark, cards, poster…), each with an image and a status. Available items link out; „în curând” items are shown honestly.
- Calls to action. If available: store buttons for the book. If „în curând”: „Anunță-mă când apare” (follow on Instagram for now; a newsletter is out of scope).
- **„Alte universuri”**: small orbs linking to the others.
- JSON-LD `BreadcrumbList`, plus `Book` when the universe has a published book.

### 5.4 Books `/carti` and book `/carti/[slug]`
- **List:** a segmented control **Copii · Adolescenți · Adulți** (from concept C, restyled in Poiana), then books as covers with title and year. Empty age groups show a designed „în lucru” state.
- **Book page:**
  - the cover (tilt + shadow), title as `<h1>`, and the subtitle „O poveste pentru copii… o șoaptă pentru adulți”
  - the blurb in rich text, and meta: age group, year, ISBN, formats
  - store links, a link to its universe, and optional sample-page images
- JSON-LD `Book`: name, author → Person, isbn, image, inLanguage, url, sameAs store URLs.

### 5.5 Art `/arta` and artwork `/arta/[slug]`
- **Gallery:** filter chips (Toate · Originale · Printuri · Ceramică) above a masonry of framed works. Captions show title and technique.
- **Artwork page:**
  - images you can swipe on a phone
  - title, technique, size, year
  - availability („disponibil” / „vândut” / „la cerere”) and an optional price
  - **„Întreabă de această lucrare”**, which opens the contact form with the subject filled in
- JSON-LD `VisualArtwork`.

### 5.6 Counselling `/consiliere`
- Hero with the manifesto.
- „Cum lucrăm” (her approach, in rich text).
- Formats: **online** and **in person** (city from the CMS).
- **How a session works.** A real sequence, so numbered steps are justified.
- FAQ as an accordion (JSON-LD `FAQPage`).
- Call to action: the contact form (subject Consiliere) and WhatsApp.
- Price and session length are optional CMS fields, shown only when filled.

### 5.7 About `/despre`
Arched portrait, bio (rich text), roles, manifesto, and links to all her profiles. These are the same links as `sameAs` in the Person JSON-LD. JSON-LD `ProfilePage` → `Person`.

### 5.8 Contact `/contact`
- **Form fields:** name, email, subject (Carte · Artă · Consiliere · Altceva), message, and a GDPR consent checkbox.
- **Anti-spam:** a honeypot, a time trap and rate limiting.
- **States:** inline field validation, a designed success state, and an error state that explains what to do.
- **Other channels:** email as selectable text with a copy button, WhatsApp, Instagram, Facebook.

### 5.9 Legal, 404
- **Privacy and Terms:** content in the CMS. The texts are provided or approved by Ramona; we supply a template, not legal advice.
- **404:** „Pagina asta s-a rătăcit, ca Musca” (a nod to *Musca rătăcită*), with links home and to the universes.

### 5.10 Global chrome
- **Header:** wordmark, nav on laptop, and the RO|EN switch.
- **Phone menu:** a full-screen watercolour sheet with staggered links, opening from the menu button.
- **Floating pill bar:** appears after the hero on long pages.
- **Language switch:** keeps you on the same page in the other language (localised slug), and cross-fades with a View Transition.

## 6. Design system and motion

**DESIGN.md is the single source of truth** for tokens, type, spacing, components and motion. The build maps its tokens into Tailwind v4 `@theme`.

Motion inventory. Every item has a `prefers-reduced-motion` fallback: static or a fade.

| Moment | Where | Notes |
|---|---|---|
| Butterfly flight + landing | Home | Her real cover butterfly, split wings flapping in 3D, follows the scroll along a spline path, then lands in the Fluture window. Loaded after first paint. |
| Rise / paint-bloom entrance | Hero headings | CSS keyframes, so content is visible at rest |
| Parallax meadow + wash | Home hero | Scroll-linked, transform-only |
| Orb drift + glow | Universuri | CSS transform loops on x, y and tilt, each world on its own period; no connecting line |
| Orb focus (grow) | Universuri | Hover or keyboard focus on laptop; nearest mid-screen on phones; 1.22 / 0.9 / 0.7 |
| Pollen | Universuri, universe pages | Canvas, paused off-screen, static under reduced motion |
| **Orb → universe page morph** | Universuri → universe | React `<ViewTransition>` shared element (Next `experimental.viewTransition`). The API is checked at M3 start; plain navigation is the fallback. |
| Language cross-fade | Everywhere | Root View Transition |
| Sheets and menus | Phone | Springs, drag to dismiss where it's a sheet |

## 7. Content model (Payload)

**Localisation:** Payload's built-in localisation, `locales: ["ro", "en"]`, `defaultLocale: "ro"`, `fallback: true`. Text, rich text and slug fields are `localized: true`; numbers, dates, colours and relations are shared across languages. The editor switches RO/EN with the locale picker in the admin. Queries pass `locale` and fall back to RO when an EN field is empty, and a "missing EN" list view filter shows what still needs translating. The admin interface itself is in Romanian (Payload's `ro` translation).

Collections (lists of entries) and globals (single pages):

| Name | Type | Key fields |
|---|---|---|
| `site-settings` | global | name, roles, taglines (souls, whisper), series name + lead, manifesto (3 lines, each with an emphasised word), contacts (email, WhatsApp, Instagram, Facebook, other profile URLs for `sameAs`), default SEO (title pattern, description, share image), portrait |
| `universes` | collection | name, slug, character, **tint** (3 colours), orb art (image *or* built-in line drawing), hook, story (rich text), status (available / soon), order, books → `books`, products → `products`, SEO |
| `books` | collection | title, slug, subtitle, age group (copii / adolescenti / adulti), cover, blurb (rich text), year, ISBN, formats, store links [{store, url}], universe → `universes`, sample pages[], status, SEO |
| `products` | collection | name, kind (semn de carte / cărți de joc / poster / altul), universe → `universes`, images[], status, optional external link |
| `artworks` | collection | title, slug, images[] (**alt required**), kind (original / print / ceramică), technique, size, year, availability, optional price, description |
| `counselling-page` | global | intro, approach, formats (online / in person + city), steps[], FAQ[], optional price and duration, CTA copy |
| `about-page` | global | bio (rich text), portrait, highlights |
| `legal-pages` | collection | kind (privacy / terms), rich text, last-updated date |
| `media` | upload collection | the image file, alt text (localised, **required**), focal point and crop; Payload generates the resized versions on upload |
| `users` | auth collection | Ramona's (and the developer's) admin login; `maxLoginAttempts` + `lockTime` against password guessing |

- **Rich text:** Payload's Lexical editor, limited to the formatting the design uses (paragraphs, emphasis, links, lists, headings level 2–3).
- **Drafts:** `versions: { drafts: true }` on every content type, so Ramona can save without publishing, and can restore an earlier version.
- **Ready for a shop:** `products`, `books` and `artworks` stay separate collections, so the e-commerce plugin (M7) can make them sellable later without moving her content.
- **Seed:** the typed data in `mockups/src/shared/content.ts` goes in through a Local API script (`payload run`), so the admin starts populated.
- **UI strings:** labels like „Cumpără de pe”, „În curând” and nav items live in next-intl message files (`messages/ro.json`, `messages/en.json`), not in the CMS.

## 8. SEO

**Goal: first result for "Ramona Nichifor".** Today that search returns essentially nothing about her, so there is no competing entity and the goal is very achievable once the site is indexed and tied to her identity. No one can guarantee a ranking.

- **Domain.** `ramonanichifor.com` was registered at Namecheap on 2026-09-16; **confirm it's hers**. `ramonanichifor.ro` appeared free and should be registered too. One is canonical, and the other 301-redirects to it.
- **Rendering.** Every public page is statically generated and revalidated on demand when Ramona publishes. All text is in the HTML, and animations never hide content at rest.
- **Titles and descriptions per locale.**
  - Home: „Ramona Nichifor · Autoare, ilustratoare și consilier pentru dezvoltare personală”.
  - Inner pages: „{Page} · Ramona Nichifor”.
  - Descriptions are unique for each page. Editors can override them in the CMS.
- **Structured data (JSON-LD):**
  - site-wide: `WebSite` + `Person` (Ramona: name, image, jobTitle[], description, `sameAs` = all profiles, url)
  - `ProfilePage` for About
  - `Book` for books
  - `VisualArtwork` for artworks
  - `FAQPage` for counselling
  - `BreadcrumbList` for inner pages
  - All validated in Google's Rich Results Test.
- **International:** `hreflang` ro, en and x-default (→ RO), self-referencing canonical URLs, `<html lang>` per locale.
- **Crawling:** `sitemap.xml` with language alternates and lastmod dates from the CMS; `robots.txt`; `/admin` and API routes set to noindex.
- **Social previews:** an Open Graph and Twitter image for every page, generated from the book cover, the portrait or the universe colour, with the page title in Fraunces.
- **Images:** descriptive file names (`ramona-nichifor-portret`) and alt text, served through `next/image` (AVIF/WebP, responsive sizes) from the image storage. The hero image loads first.
- **Identity across the web.** The site links to her Instagram, Facebook, Goodreads, Amazon Author Central, eMAG and publisher pages, and each of those links back. Same name and photo everywhere. This is what earns a Google knowledge panel over time.
- **At launch (M6):**
  - verify the domain in Google Search Console and Bing Webmaster Tools, submit the sitemap and request indexing
  - set up a Google Business Profile if she sees clients in person
  - track the "Ramona Nichifor" query in Search Console
- **Later:** a „Jurnal” journal/blog in the CMS, with articles on children's emotions and personal growth to bring in long-tail searches.

## 9. Architecture

**Stack:**
- Next.js 16 (App Router, React 19), TypeScript
- Tailwind CSS v4, Motion
- next-intl 4 (`localePrefix: "as-needed"`, localised pathnames)
- Payload 3 in the same Next.js app (admin at `/admin`), with `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`, `@payloadcms/storage-s3` (pointed at Cloudflare R2), and Live Preview + draft mode. **Payload pins the Next.js versions it supports**, so at M1 start Next.js is set to the newest version Payload supports, not simply the newest Next.js.
- `next/font` (Fraunces variable with the SOFT/WONK/opsz axes, Alegreya Sans; latin + latin-ext subsets, self-hosted)
- a server action + Resend for the contact form

**Folder layout** (repo root; `mockups/` stays as an archive, excluded from the build):
```
app/
  [locale]/(site)/          page routes (home, universuri, carti, arta, consiliere, despre, contact, legal)
  [locale]/(site)/layout.tsx header, footer, language switch, JSON-LD (WebSite + Person)
  (payload)/admin/           Payload admin (noindex)
  (payload)/api/             Payload REST/GraphQL routes (noindex)
  sitemap.ts · robots.ts · opengraph-image.tsx (per route)
components/
  poiana/   Hero, Flight, Butterfly, Meadow, PathPills, ArchWindow, FloatingBar, MenuSheet…
  universe/ WorldMap, OrbArt, Pollen, UniverseHero…
  ui/       LangSwitch, Button, CopyEmail, SegmentedControl, Icons, Creatures…
payload/    collections/, globals/, fields/ (seo, localised slug), hooks/ (revalidate), seed/
payload.config.ts · migrations/
i18n/       routing.ts, request.ts        messages/ ro.json, en.json
```

**Rendering and data:**
- Pages read content through Payload's **Local API** (direct database calls inside the app, no HTTP round trip).
- Pages are static. An `afterChange` hook on each collection and global calls `revalidateTag` when Ramona publishes, so no webhook is needed. Draft mode + Live Preview show unpublished changes next to the editing form.
- Database changes ship as Payload migrations (`payload migrate`), committed in `migrations/`.
- Motion-heavy parts (Flight, Pollen, WorldMap) are client components loaded after the static HTML.

**Data safety:** a nightly `pg_dump` of the database to the R2 bucket (scheduled GitHub Action), kept for 30 days, plus the free database plan's own short restore window. Restoring a backup is tried once before launch.

**Environment variables:**
- `PAYLOAD_SECRET`, `DATABASE_URI`
- `S3_BUCKET`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY` (R2), `NEXT_PUBLIC_MEDIA_URL`
- `RESEND_API_KEY`, `CONTACT_TO_EMAIL`

**Reused from the mockups:**
- `shared/Butterfly.tsx` + the wing CSS
- `shared/creatures.tsx`, `shared/icons.tsx`
- `poiana/*`
- `universuri/{WorldMap,Pollen}.tsx` (`OrbArt`, `tone="day"`)
- `universuri-poiana/App.tsx` (sky, universe page, morph logic)
- `scripts/prepare-images.py` for the cutout assets

## 10. Accessibility and performance

- **Target: WCAG 2.2 AA.**
  - Text contrast ≥ 4.5:1 on watercolour grounds (checked per section).
  - Visible focus, keyboard-operable menus, sheets and the segmented control.
  - Tap targets ≥ 44px; a correct `lang` per locale.
  - Localised alt text; `prefers-reduced-motion` honoured everywhere.
- **Budgets (mid-range phone, 4G):**
  - LCP < 2.5s, CLS < 0.05, INP < 200ms.
  - The butterfly and pollen never block first paint.
  - Images are served through `next/image` in responsive AVIF/WebP.

## 11. Privacy (GDPR)

- No cookies for visitors. The only cookie is the admin login session, which only Ramona (and the developer) gets.
- Analytics is cookie-free, so no consent banner is needed. The tool is chosen with the hosting.
- The contact form sends an email and stores nothing. A consent line links to the privacy page.
- Fonts are self-hosted, so there are no requests to Google Fonts.

## 12. Hosting (open decision, needed before M6)

Payload is free software, but it needs three things to run, and these are what cost money:

1. **The app:** a host for Next.js with server features (ISR/revalidation, server actions, image optimisation) and Node for the Payload admin.
2. **A Postgres database.**
3. **File storage for images.** Cloudflare R2: 10 GB free, no fees for serving files. This is the default in every option below.

| Option | Cost | Notes |
|---|---|---|
| Netlify (free) + Neon (free Postgres) + R2 | €0 | Commercial use allowed. Neon's free database sleeps when idle, so the first admin load after a quiet spell takes a second longer; visitors see static pages and don't notice. Payload on Netlify is less common than on Vercel, so it gets tested at M2. |
| Vercel Pro + Neon + R2 | ~$20/mo | Best Next.js support; Payload's own templates target it. The free Hobby plan doesn't allow commercial sites. |
| Small VPS (e.g. Hetzner) running app + Postgres with Docker | ~€5/mo | No sleeping database or function limits, one bill, full control. The developer handles OS updates, HTTPS and monitoring. |

Payload also has a Cloudflare Workers template (D1 database + R2), but it swaps Postgres for D1, so it is not the default.

**Default for previews (M1–M5): Netlify free + Neon free + R2**, unless Vercel Pro is chosen at M1 start. M1 doesn't use the database yet. Moving hosts later is cheap: the app is host-independent, the database moves with a dump and restore, and R2 stays.

When the shop arrives (M7), payment fees (Stripe, roughly 1.5% + €0.25 per EU card sale) are the same on any host.

## 13. Milestones

Each milestone gets its own implementation plan, is built and verified, and ships to a preview link. **The build then stops for review.**

| # | Scope | Acceptance |
|---|---|---|
| **M1** | Next.js foundation, Tailwind tokens from DESIGN.md, next-intl routing, fonts, shared components; **home page** from typed local data shaped like the CMS; header, footer, menu, language switch; SEO basics (metadata, Person/WebSite JSON-LD) | The home page matches the approved mockup on phone and laptop, RO/EN; Lighthouse phone SEO 100 and Performance ≥ 90 |
| **M2** | Payload in the app: Postgres (Neon) + R2 storage, collections and globals (§7), admin at `/admin` in Romanian, seed import, drafts + Live Preview; the home page reads from Payload; revalidation hooks; nightly backup | Editing text or an image in the admin updates Live Preview immediately and the live page within a minute; a backup restores cleanly |
| **M3** | Universuri + universe pages, with the orb → page morph | The morph works on a real phone (Safari + Chrome); reduced motion falls back cleanly |
| **M4** | Books, art, counselling, about, contact (form + email), legal, 404 | Every page on the preview link in RO and EN; the form delivers to her inbox |
| **M5** | SEO and quality pass: all JSON-LD validated, hreflang, sitemap, OG images, redirects, accessibility audit, performance | Every checklist in §8 and §10 passes |
| **M6** | Real content entered, a short Romanian editing guide, hosting chosen, domains connected, launch, Search Console | Site live on the canonical domain; sitemap submitted; profiles link back |
| *M7 (later)* | *Shop, once her PFA is set up: Payload e-commerce plugin (products, variants, cart, orders), Stripe payments, shipping options, Romanian e-Factura invoices through the SmartBill API, terms of sale and return policy. Specced separately when she's ready.* | *A test order is paid, invoiced through SmartBill and appears in the admin* |

**Fixes carried into M1 from the mockup review** (the DESIGN.md documenter found these; not fixed in the archived mockup):
- **Book section eyebrow.** The line „Pentru copii · 2026 · „Magia suntem noi”” sits above the book title, which the design rules forbid. Move it below the title as a meta line.
- **Missing font weight.** `font-semibold` (600) isn't a weight Alegreya Sans ships, so it renders as 700. Use 500 or 700 explicitly, as DESIGN.md records.
- **Small desktop nav links.** The desktop top-bar links are plain text shorter than 44px; give them a 44px hit area.

## 14. Content checklist for Ramona

- [ ] Original, full-resolution photos (portrait: 2–3 options)
- [ ] Paintings: photos + title, technique, size, year, availability (+ price if public)
- [ ] Bio: a short and a long version
- [ ] Counselling: approach, session length, price (if public), city for in-person sessions, FAQ
- [ ] Book: store links (eMAG, Amazon, …), publisher name, formats, sample pages (optional)
- [ ] Profiles: Instagram, Facebook, Goodreads, Amazon Author Central, other
- [ ] Email for the contact form, and her WhatsApp number
- [ ] Domain: confirm she owns `ramonanichifor.com`; register `.ro`
- [ ] Approval of the English copy and the English working titles of the books
- [ ] Privacy and terms texts (or approval of our template)

## 15. Risks and open questions

- **Hosting** isn't decided (§12). Everything else is independent of it until M6.
- **Self-hosted CMS upkeep.** With Payload, the database, backups and Payload updates are the developer's job, not a vendor's. Mitigated by the nightly backup, a tested restore, and updating Payload at each milestone rather than letting versions pile up.
- **Payload's Next.js support** can lag behind the newest Next.js release; the build uses the newest Next.js that Payload supports (§9).
- **Image quality.** The current photos are about 900px WhatsApp copies; originals are needed before M6.
- **Unreleased universes** use line-drawn stand-ins until her illustrations exist. The CMS supports swapping in an image.
- **View Transitions:** supported in Chromium 125+, Safari 18.2+ and Firefox 144+. Older browsers get plain navigation.
- **English book titles** are working titles until she approves them.

## 16. Out of scope (for now)

Shop, cart and payments (planned as M7; the content model is ready for it) · newsletter · more languages (FR, DE, ES, AR, HI) · journal/blog · booking calendar for sessions.
