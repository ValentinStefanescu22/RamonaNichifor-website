# M3 · Universuri and every inner page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Parallel tasks work on disjoint files, each in its own APFS clone (`cp -c -R` of the repo under `~/code/.rn-work/<task>`), with its own database (`createdb -T ramona ramona_<task>`) and its own `PORT`. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every page in spec §4 is real, reads Payload, and matches the approved mockup: Universuri (with the orb → page morph), universe and product pages, Cărți and book pages (Răsfoiește), Artă and artwork pages, Consiliere, Despre, Comunitate, Contact (form that sends email), the legal pages and the 404. Each page has its own metadata, JSON-LD, OG image, sitemap entry and accessibility check.

**Architecture:** This is the same pattern as Acasă in M2:
- The page is a server component. It calls a typed getter in `content/index.ts`, which uses the Payload Local API with the locale and draft mode, and passes plain props to `components/<area>/*`.
- Client components exist only for motion and interaction: orbs, pollen, the reader, filters, the form.
- Long texts written by Ramona live in Payload. UI labels live in `messages/*.json`.
- Pages are static: `generateStaticParams` plus the revalidation that already exists.

**Tech Stack:** Next.js 16.4.3, React 19.3 (Next's compiled canary, which exports `ViewTransition`), Payload 3.92 (Local API, `@payloadcms/richtext-lexical/react`), next-intl 4, motion 12 (`m.*` under LazyMotion), `next/og`. New dependencies: `zod` (made a direct dependency), `resend`, `@axe-core/playwright` (dev).

**Spec:** `docs/superpowers/specs/2026-09-30-ramona-site-design.md`:
- §4 URLs, §5.2–5.9 pages, §5.10 chrome, §6 motion, §7 content model, §8 SEO, §10 a11y, §11 privacy, §13 M3.

Also read: `DESIGN.md`, `PRODUCT.md`, `CLAUDE.md`. The reference implementation is `mockups/src/`:
- `universuri-poiana/App.tsx`, `universuri/{WorldMap,Pollen}.tsx`;
- `pages/*/App.tsx`, `pages/carte/Leaf.tsx`, `pages/produs/Deck.tsx`, `pages/comunitate/Circle.tsx`;
- `site/{Painted,Honeypot,antispam}.tsx`;
- all copy in `shared/content-pages.ts`.

## Context

M2 was approved on 2026-10-25. Pieces already in place:
- Payload runs on Neon and R2; the preview is https://ramona-nichifor-website.vercel.app/ (noindex).
- Acasă reads Payload.
- Every §4 route except the product page exists as a `StubPage`.
- The admin, the seed, the © stamp, Live Preview, revalidation and backups.

Out of scope, waiting for M4: booking (`availability`, `bookings`, the slot engine). In M3 the Consiliere booking section is an honest placeholder (Task 6).

## Global Constraints

- Everything in the M1 and M2 plans' Global Constraints still holds:
  - client rules (CLAUDE.md);
  - no visitor cookies;
  - menu order;
  - no 600 weight;
  - artwork never cropped and stamped;
  - reduced motion honoured;
  - previews noindex;
  - migrations committed.
- **Copy:**
  - Ramona's texts go in exactly as written in `mockups/src/shared/content-pages.ts`; only diacritics and typos are fixed, and anything else is flagged.
  - Unknown values (prices, dates, sizes, titles, store links, product photos) render „În curând” / „Preț în curând” / „Datele, în curând”, or the clean paper placeholder (hairline frame + „Imagine în curând”). Never decorative washes or blobs.
  - The mockup's placeholder artworks (`placeholder: true`, invented titles) are **not** seeded.
  - Only 2 card pairs are shown publicly: Broscuță–Broscoi and Ciripel–Ciripica.
  - „Coperta” in Răsfoiește is the **back cover**.
  - No ceramics in Artă.
  - Never „Bine ai revenit acasă, puiule!”; `npm run check:copy` must pass.
- **URLs:**
  - exactly spec §4;
  - plus the product route, added to `i18n/routing.ts`: `"/universuri/[slug]/[product]": { ro: "/universuri/[slug]/[product]", en: "/universes/[slug]/[product]" }`;
  - slugs never contain diacritics.
- **Titles:**
  - inner pages are titled `„{Page} · Ramona Nichifor”`;
  - each page has a unique description per locale, overridable by the doc's `seo` group when present;
  - every page has a self canonical, hreflang ro/en/x-default and an OG image of 1200×630.
- **JSON-LD per page (spec §5, §8):**
  - `BreadcrumbList` on every inner page;
  - `Book`, `VisualArtwork`, `FAQPage`, `ProfilePage` → `Person`, and `Event` (only for an event with a date);
  - `WebSite` + `Person` stay site-wide.
- **Contact form (spec §5.8):**
  - fields: name, email, subject (Carte · Artă · Consiliere · Comunitate · Altceva), message, and one consent checkbox „Am cel puțin 16 ani și sunt de acord…” linking to the privacy page;
  - protection: honeypot (off-screen, `tabIndex={-1}`, not `display:none`), a time trap of 3 s, Cloudflare Turnstile verified on the server, a server action (Next origin check), zod, 5 messages per 10 min per IP, escaped HTML, Resend;
  - nothing is stored;
  - spam gets the normal success state and is dropped.
- **Env (new):**
  - `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`;
  - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`;
  - all added to `.env.example`, Vercel and `.env.local`. Tests use Turnstile's published test keys and a fake Resend transport (see Task 8).
- **Testing:**
  - every page is checked at 393 (WebKit) and 1024/1180/1440, RO and EN;
  - no horizontal scroll and no console errors (`tests/fixtures.ts`);
  - axe finds no `serious`/`critical` violations;
  - links open at the top and Back restores the position (`tests/routing.spec.ts`).

## Review Focus

1. **Missing content.** An artwork without a price, a book without store links, an empty age group, a product without photos, an event without a date, a universe marked „soon”: each renders its designed „În curând” state and never an empty box or `undefined`. Pinned in Tasks 3, 4, 5 and 7 with seeded and blanked docs.
2. **The language switch on every new dynamic route.** On books, artworks and products, a slug edited in the admin still switches to the right page in the other language. The EN fallback never shows a blank. Pinned in Task 1 (slug pairs) and Task 9 (the routing crawl visits every page).
3. **Narrow screens and long words.** Long Romanian and English titles at 320–393 px: no horizontal scroll and no clipped headings. Artwork stays uncropped at every width, in the gallery, the detail swipe and the reader. Pinned per page task with an at-320 check and the image-ratio assertion.
4. **The contact form under abuse or failure.** Spam (honeypot or under 3 s) gets a success state and sends nothing. Invalid fields show inline errors. The 6th message in 10 minutes is refused with a clear message. A Resend failure shows the error state, and the text the visitor typed survives. `<script>` in the message arrives escaped. Pinned in Task 8.
5. **No View Transition and reduced motion.** In a browser without View Transitions, or with reduced motion, the orb click is plain navigation, the pollen is static and the butterflies in Comunitate rest. All content stays visible without JavaScript. Pinned in Task 3 (forced `startViewTransition = undefined` and `reducedMotion: "reduce"` runs) and Task 7.

---

## File structure

```
i18n/routing.ts                       + product pathname
payload/collections/Products.ts       + images[] alt via media, specs; (slug/status exist)
payload/globals/Pages.ts              counselling-page + about-page extended; + books-page, community-page, contact-page
payload/seed/index.ts                 + page globals, leaf pages, products (bookmarks, cards), events, partners, legal templates
content/pages-data.ts                 NEW: port of mockups/src/shared/content-pages.ts ({ro,en} per text), the seed's source
content/types.ts · content/index.ts   + page types and getters (one per page)
lib/seo.ts                            + pageMetadata(), breadcrumbLd()
lib/og.tsx                            NEW: renderOg() for every opengraph-image.tsx
assets/fonts/fraunces-og.ttf          NEW (satori cannot read woff2), from scripts/fetch-fonts.sh
components/page/                      NEW shared kit: PageHero, PaperPlaceholder, RichText, Painted, BackPill
components/universe/                  WorldMap, OrbArt, Pollen, UniverseHero, UniverseItems, OtherUniverses, Morph
components/books/                     Shelf, AgeTabs, AboutAuthor, BookCover, Leaf (+ Reader)
components/art/                       Gallery, ArtFilters, ArtworkSwipe, Availability
components/counselling/               Formats, Patterns, Path, RightForYou, Steps, Faq, BookingSoon
components/about/                     Portrait, Beat, Crafts, Signature
components/community/                 GatheringCircle, Events, Projects, Partners
components/contact/                   ContactForm, Honeypot
app/[locale]/(site)/**/page.tsx       each StubPage replaced; + universuri/[slug]/[product]/page.tsx
app/[locale]/(site)/**/opengraph-image.tsx
app/actions/contact.ts                NEW server action
app/sitemap.ts                        every page and slug, alternates, lastmod
tests/<area>.spec.ts                  one spec per area; tests/a11y.spec.ts
```

---

### Task 0: Morph spike (in parallel with Task 1, decides Task 3's approach)

**Files:** a scratch branch or clone only. The result is written into this plan, under Task 3's „Morph” line, and into spec §6.

- [ ] **Step 1: Try React `<ViewTransition name={`orb-${slug}`}>`** on a throwaway two-route page: the map orb and the universe hero orb share the name, and navigation goes through next-intl's `Link`. Check whether Next 16.4 needs `experimental.viewTransition` in `next.config.ts`.
- [ ] **Step 2: If the morph does not animate**, try the mockup's approach instead (`mockups/src/universuri-poiana/App.tsx:26-41`): `document.startViewTransition({ update, types: ["morph"] })`, where `update` calls `router.push` and resolves when the destination orb has mounted.
- [ ] **Step 3: Check the result in Chromium and WebKit** (Playwright: screenshots in the middle of the transition), and with `prefers-reduced-motion: reduce`, where the navigation must be instant.
- [ ] **Step 4: Record the decision.** It must keep the global cross-document `@view-transition` (`app/globals.css:88`) for the language switch. Under „Morph”, write one line: which API, the flag, and any limitation.

### Task 1: Content model, seed and getters (serial, everything else builds on it)

**Files:**
- Create: `content/pages-data.ts`, `migrations/<ts>_m3_pages.ts`
- Modify: `payload/globals/Pages.ts`, `payload/collections/Products.ts`, `payload/collections/Community.ts` (if a field is missing), `payload.config.ts` (register the new globals with `revalidateGlobal()` hooks and `versions.drafts`; add them to the Live Preview lists; `publicPath` learns `artworks` → `/arta/[slug]` and `products` → `/universuri/[u]/[slug]`), `payload/seed/index.ts`, `content/types.ts`, `content/index.ts`, `i18n/routing.ts`, `payload-types.ts`
- Test: `tests/unit/content.ts` (run by `payload run`, added to `npm run test:unit`)

**Content model additions** (localized text unless noted; every field the mockup renders, named as in `content-pages.ts`):
- `counselling-page`:
  - `tagline`;
  - `patterns { title, questions[], reactions[], path[] {label}, toward[] }`;
  - `rightForYou { title, maybe[], body[], offer[] }`;
  - the existing `sessions[] {minutes, priceEur}` (shared);
  - the existing `steps`, `faq`;
  - `ctaTitle`.
- `about-page`:
  - `titleA`, `titleB`, `role`;
  - `story[] { kind: "beat" | "question" | "closing", text }`;
  - `crafts { title, items[] { name, line, href (shared), tint (shared) } }`.
- New global `books-page`: `seriesNote`, `author { title, paragraphs[], formats[] { label, status } }`.
- New global `community-page`:
  - `titleA`, `titleB`, `tagline`, `lead`, `intro`;
  - `eventsTitle`, `eventsLead`, `projectsTitle`, `projectsLead`;
  - `partnersTitle`, `partnersLead[]`;
  - `closing`, `ctaTitle`, `ctaLine`.
- New global `contact-page`: `tagline`.
- `products`: `images[]` of uploads; a `gallery` select (`bookmarks` | `cards` | none) that picks the mockup's fan/deck view.

**Interfaces:**
- Produces (in `content/index.ts`; all `(l: Locale)`, all draft-aware; the types go in `content/types.ts`):
  - `getUniverse(l, slug): Promise<UniverseFull | null>`, where `UniverseFull = Universe & { story: RichTextData | null; books: BookCard[]; products: ProductCard[] }`;
  - `getProduct(l, universeSlug, slug): Promise<ProductFull | null>`;
  - `getBooks(l): Promise<BookCard[]>`;
  - `getBook(l, slug): Promise<BookFull | null>`, where `BookFull` adds `pages`, `format`, `formats`, `leafPages: Media[]` and `blurbRich`;
  - `getArtworks(l): Promise<ArtworkFull[]>`, `getArtwork(l, slug): Promise<ArtworkFull | null>`;
  - `getCounselling(l)`, `getAbout(l)`, `getBooksPage(l)`, `getCommunity(l): Promise<CommunityPage & { events; projects; partners }>`, `getContactPage(l)`;
  - `getLegal(l, kind: "privacy" | "terms")`;
  - `getSlugPairs(collection: "universes" | "books" | "artworks" | "products"): Promise<SlugPair[]>`, which generalises the existing `slugPairs`.
- `RichTextData` is the Lexical `SerializedEditorState`, rendered by `components/page/RichText.tsx` (Task 2).

- [ ] **Step 1: Write the failing test** `tests/unit/content.ts`. After the seed it asserts:
  - `getUniverse("ro","fluturele")` has 1 book and 4 products;
  - `getProduct("en","butterfly","bookmark")` has 9 images;
  - `getBook("ro","fluturele-dansator-de-step").leafPages[0].alt` contains „coperta spate”;
  - `getArtworks("ro")` has no title from the mockup placeholder list;
  - `getCounselling("en").patterns.questions.length` equals the mockup count;
  - `getSlugPairs("products")` includes `{ ro: "semn-de-carte", en: "bookmark" }`.
- [ ] **Step 2: Run** `npm run test:unit`. Expected: FAIL (the getters don't exist).
- [ ] **Step 3: Add the fields and globals**, then `npx payload migrate:create m3_pages`, `npx payload migrate` (local) and `npm run generate:types`.
- [ ] **Step 4: Port `content-pages.ts` to `content/pages-data.ts`** (`t(ro,en)` becomes `{ ro, en }`, the text unchanged).
  - Extend the seed, idempotent by slug as in M2.
  - Upload `mockups/public/img/{pages,cards,bookmarks}`: leaf pages, cards and bookmarks are `illustration: true` with `context.skipStamp` (already stamped).
  - Products: the 4 kinds per published universe. Fluturele's semn and cărți have their images; the others get no images and the status „soon”.
  - Also seed: the 4 event kinds without dates, the AVA Art & Soul partner (no logo), and the privacy/terms template texts marked „Text în lucru, de aprobat de Ramona”.
- [ ] **Step 5: Implement the getters** and add the product pathname to `i18n/routing.ts`.
- [ ] **Step 6: Run** `npm run seed && npm run seed && npm run test:unit`. Expected: PASS, with no duplicate docs. Also run `npx playwright test` (the M2 suite stays green).
- [ ] **Step 7: Migrate Neon** (`DATABASE_URI="$DATABASE_URL_UNPOOLED" npx payload migrate`), then seed Neon the same way. Commit.

### Task 2: Shared page kit, SEO and OG (serial after Task 1, before Tasks 3–8)

**Files:**
- Create: `components/page/{PageHero,PaperPlaceholder,RichText,Painted,BackPill}.tsx`, `lib/og.tsx`, `assets/fonts/fraunces-og.ttf`
- Modify: `lib/seo.ts`, `app/sitemap.ts`, `scripts/fetch-fonts.sh`, `components/site/LangSwitch.tsx` (product slugs)
- Test: `tests/seo.spec.ts` (extend), `tests/a11y.spec.ts` (new)

**Interfaces (Produces):**
- `pageMetadata({ locale, path: Pathname, params?, title, description, seo?, ogPath }): Metadata`: title `{title} · Ramona Nichifor`, canonical, alternates (ro/en/x-default) and OG/Twitter pointing at the route's `opengraph-image`. Robots follows `SITE_INDEXABLE`, as in M1.
- `breadcrumbLd(locale, trail: { name: string; path: Href }[]): object`
- `renderOg({ title, kicker?, image?: string, tint?: [string, string, string] }): ImageResponse` at 1200×630, in the Fraunces of `fraunces-og.ttf`, on the paper/sky ground of `scripts/make-og.mjs`. The image is drawn whole (`objectFit: contain`).
- `<RichText data={RichTextData} />` wraps `@payloadcms/richtext-lexical/react`'s `RichText`: paragraphs, bold/italic, lists, h2–h3, and links (internal through next-intl `Link`, external with `rel="noopener"`).
- `<PaperPlaceholder ratio label? />` draws the hairline frame + „Imagine în curând” (`messages`: `ui.imageSoon`).
- `<Painted variant />`: port of `mockups/src/site/Painted.tsx`.
- `<PageHero title titleItalic? lead? />`: the inner-page `<h1>` treatment from `mockups/src/site/Layout.tsx`.
- `<BackPill href label />`
- `LangSwitch` resolves `[product]` through `getSlugPairs("products")`, the same way `[slug]` works today.

- [ ] **Step 1: Write failing tests.**
  - `tests/seo.spec.ts`: for `/despre` and `/en/about`, `<title>` equals „Despre mine · Ramona Nichifor” / „About me · Ramona Nichifor”; the canonical is self; hreflang has 3 links; `og:image` responds 200 `image/png` at 1200×630.
  - `tests/a11y.spec.ts`: for every path in `PAGES` (a list of all §4 pages, shared with Task 9), `new AxeBuilder({ page }).analyze()` returns no violation with impact `serious`/`critical`.
- [ ] **Step 2: Run them.** Expected: FAIL.
- [ ] **Step 3: Implement the kit.**
  - `fetch-fonts.sh` also writes `fraunces-og.ttf`: the roman instance at wght 380, SOFT 100, opsz 144, with the same glyph set.
  - `app/sitemap.ts` lists every static page plus every slug from `getSlugPairs`, with `alternates.languages` and `lastModified` = the doc's `updatedAt`.
  - Add `@axe-core/playwright` as a dev dependency.
- [ ] **Step 4: Run.** Expected: seo PASS; the a11y test passes for the pages that exist (stubs included). Commit.

### Tasks 3–8: the pages (in parallel after Task 2, disjoint files)

Each page task:
- replaces the `StubPage` in its route, adds an `opengraph-image.tsx` per route, and puts its JSON-LD through `components/seo/JsonLd.tsx`;
- puts its UI labels in `messages/{ro,en}.json` under its own key (`universes`, `books`, `art`, `counselling`, `about`, `community`, `contact`). Merge conflicts in the messages files are resolved by key;
- ports the mockup component named next to it, keeping its values (motion numbers come from DESIGN.md);
- in its spec, runs every case below at phone + laptop, RO + EN, plus one run at 320 px wide for no horizontal scroll.

### Task 3: Universuri, universe page, product page, morph

**Files:**
- Create:
  - `components/universe/{WorldMap,OrbArt,Pollen,UniverseHero,UniverseItems,OtherUniverses,Morph}.tsx`
  - `components/product/{Deck,BookmarkFan}.tsx`
  - `app/[locale]/(site)/universuri/[slug]/[product]/{page,opengraph-image}.tsx`
  - `opengraph-image.tsx` for `universuri` and `universuri/[slug]`
  - `tests/universes.spec.ts`
- Modify: `app/[locale]/(site)/universuri/page.tsx`, `universuri/[slug]/page.tsx`
- Port: `mockups/src/universuri-poiana/App.tsx`, `universuri/{WorldMap,Pollen}.tsx`, `pages/produs/{App,Deck}.tsx`.

**Morph:** *(filled in by Task 0)*

- [ ] **Step 1: Write the failing tests** in `tests/universes.spec.ts`:
  - `/universuri`:
    - the `<h1>` is „Universuri”;
    - 4 orbs, each linking to its page, with the labels' status „Disponibilă”/„În curând”;
    - on phone, all 4 orbs fit in the first viewport (`boundingBox().y + height <= viewport.height`);
    - on laptop, a hovered orb has a scale ≈ 1.22 and the others ≤ 0.9 (computed transform);
    - with `reducedMotion: "reduce"`, the pollen canvas doesn't animate (two frames identical).
  - Orb click to `/universuri/fluturele`:
    - the URL changes and the `<h1>` is „Fluturele”;
    - with `document.startViewTransition` deleted by `addInitScript`, the same click still navigates.
  - `/universuri/fluturele`:
    - the back pill goes to `/universuri`;
    - „În acest univers” lists the book + 4 products, each linking to its own page;
    - the „soon” products show the status chip and a paper placeholder;
    - „Alte universuri” has 3 links;
    - the JSON-LD contains `BreadcrumbList` and `Book`;
    - `/universuri/tantarul` (soon) has no `Book`, and the call to action is „Anunță-mă când apare” → Instagram.
  - `/universuri/fluturele/carti-de-joc`:
    - only Broscuță–Broscoi and Ciripel–Ciripica are shown as pairs;
    - every card image keeps its ratio of 63/88 ± 0.01;
    - the „soon” price reads „Preț în curând”, and instead of a buy button the page offers „Anunță-mă” → Instagram.
  - `/en/universes/butterfly/bookmark`: the language switch lands on `/universuri/fluturele/semn-de-carte`.
- [ ] **Step 2: Run** `npx playwright test tests/universes.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement**:
  - the pages, with `generateStaticParams` from `getSlugPairs`;
  - the morph, per Task 0;
  - Pollen and WorldMap as client components loaded after the HTML (`next/dynamic`, `ssr: false` for the canvas, with a static fallback in the SSR HTML);
  - the universe tint drives the sky and pollen colour;
  - metadata via `pageMetadata`, OG via `renderOg({ tint })`.
- [ ] **Step 4: Run the spec.** Expected: PASS. Then `npm run typecheck && npm run check:copy`. Commit.

### Task 4: Cărți and the book page with Răsfoiește

**Files:**
- Create: `components/books/{Shelf,AgeTabs,AboutAuthor,BookCover,Leaf}.tsx`, `opengraph-image.tsx` for `carti` and `carti/[slug]`, `tests/books.spec.ts`
- Modify: `carti/page.tsx`, `carti/[slug]/page.tsx`
- Port: `pages/carti/App.tsx`, `pages/carte/{App,Leaf}.tsx`; reuse `components/poiana/TiltCover.tsx`.

- [ ] **Step 1: Write the failing tests** in `tests/books.spec.ts`:
  - `/carti`:
    - a radiogroup Copii · Adolescenți · Adulți that works with the keyboard (arrows move the selection and focus);
    - Copii lists Fluturele and Buburuza, with covers and years;
    - Adolescenți and Adulți show the designed „în lucru” state;
    - „Despre autor” closes the page, with e-book „în curând” and audiobook „planificată”.
  - `/carti/fluturele-dansator-de-step`:
    - the `<h1>` is the title, followed by the subtitle;
    - meta: age „1–10 ani”, year, pages, format „A4, copertă cartonată lucioasă”, ISBN;
    - with no store links, it shows „În curând · Comenzile online se deschid în curând.”;
    - a link to its universe.
  - Răsfoiește:
    - the first thumbnail is the back cover;
    - a click opens a full-screen reader (`role="dialog"`, focus trapped, Escape closes it and returns focus);
    - arrow keys page through;
    - every page image's rendered ratio equals its natural ratio ± 0.01.
  - The JSON-LD `Book` has `name`, `author.name` „Ramona Nichifor”, `isbn`, `image`, `inLanguage` and `url`.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement.** The age filter is client state over server-rendered lists: all books are in the HTML.
- [ ] **Step 4: Run.** Expected: PASS. Commit.

### Task 5: Artă and the artwork page

**Files:**
- Create: `components/art/{Gallery,ArtFilters,ArtworkSwipe,Availability}.tsx`, `arta/[slug]/opengraph-image.tsx`, `arta/opengraph-image.tsx`, `tests/art.spec.ts`
- Modify: `arta/page.tsx`, `arta/[slug]/page.tsx`
- Port: `pages/arta/App.tsx`. Its `ArtworkSheet` becomes the `/arta/[slug]` page, as spec §5.5 asks.

- [ ] **Step 1: Write the failing tests** in `tests/art.spec.ts`:
  - `/arta`:
    - filter chips Toate · Originale · Printuri (`aria-pressed`) narrow the masonry;
    - captions show the title and technique;
    - every image is uncropped (rendered ratio = natural ratio ± 0.01);
    - when a filter has no works, the „În curând” state shows;
    - the commission section links to `/contact?subiect=arta`.
  - `/arta/<seeded slug>`:
    - title, technique, size, year;
    - availability „Pre-comandă” → `/contact?subiect=arta&lucrare=<title>`, and the form opens with the subject Artă and that title in the message;
    - a price → shown; no price → „Preț în curând”;
    - sold or on request → „Întreabă de această lucrare”;
    - on phone, the images swipe (scroll-snap) and the dots reflect the index;
    - the JSON-LD is `VisualArtwork`.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement.** Swiping uses native CSS scroll-snap (`.snap-row` already exists in `globals.css`), not a library.
- [ ] **Step 4: Run.** Expected: PASS. Commit.

### Task 6: Consiliere (booking flow comes in M4)

**Files:**
- Create: `components/counselling/{Formats,Patterns,Path,RightForYou,Steps,Faq,BookingSoon}.tsx`, `consiliere/opengraph-image.tsx`, `tests/counselling.spec.ts`
- Modify: `consiliere/page.tsx`
- Port: `pages/consiliere/App.tsx`. `Booking.tsx` is **not** ported (M4).

- [ ] **Step 1: Write the failing tests** in `tests/counselling.spec.ts`:
  - the hero has the tagline and the session formats;
  - the primary button „Programează o ședință” glides to `#programare`, and WhatsApp is the secondary link (`https://wa.me/40730775132`);
  - there's no manifesto on the page;
  - the sections appear in order: „Ce se repetă în viața ta?”, „Cum știi dacă este pentru tine?”, „Cum decurge” (an `<ol>`), `#programare`, FAQ;
  - prices 60/90/120 min · 25/40/50 €, from the CMS;
  - `#programare` (`BookingSoon`) says online booking opens soon and offers WhatsApp and the free 15-min phone conversation. There's no calendar and no fake slots;
  - the FAQ accordion: one `<button aria-expanded>` per question, the keyboard toggles it;
  - the JSON-LD `FAQPage` has as many `mainEntity` as questions.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement.** The FAQ uses native `<details>/<summary>` unless the mockup's animation needs more; the answer text stays in the HTML.
- [ ] **Step 4: Run.** Expected: PASS. Commit.

### Task 7: Despre and Comunitate

**Files:**
- Create: `components/about/{Portrait,Beat,Crafts,Signature}.tsx`, `components/community/{GatheringCircle,Events,Projects,Partners}.tsx`, `opengraph-image.tsx` for both, `tests/about-community.spec.ts`
- Modify: `despre/page.tsx`, `comunitate/page.tsx`
- Port: `pages/despre/App.tsx`, `pages/comunitate/{App,Circle}.tsx`.

- [ ] **Step 1: Write the failing tests** in `tests/about-community.spec.ts`:
  - `/despre`:
    - an arched portrait (uncropped ratio inside its arch, as the mockup does);
    - the `<h1>` is „Despre mine”, then the role line;
    - the story's movements are in the order of `about.story`;
    - the Parisienne signature;
    - three crafts linking to `/carti`, `/arta`, `/consiliere`;
    - the profile links equal `site.sameAs`;
    - the JSON-LD `ProfilePage.mainEntity` is the `Person`, with the same `sameAs`.
  - `/comunitate`:
    - the `<h1>` is „Comunitate cu sens”;
    - the gathering circle shows 5+ butterflies inside the arch. Under reduced motion they rest at their perch positions (no transform change between two frames);
    - 4 event kinds, each with „Datele, în curând” and no `Event` JSON-LD;
    - after setting one event's `startsAt` in the admin (REST), that row shows the date, place and „Vreau să particip” → `/contact?subiect=comunitate`, and an `Event` JSON-LD appears. Then it's restored;
    - projects show the large „În curând”;
    - the AVA Art & Soul partner opens Instagram in a new tab (`target="_blank" rel="noopener"`);
    - the close has „Vreau să aflu primul” → Instagram and „Propune un proiect” → `/contact?subiect=comunitate`.
- [ ] **Step 2: Run.** Expected: FAIL.
- [ ] **Step 3: Implement.** The butterflies reuse `components/poiana/Butterfly.tsx`.
- [ ] **Step 4: Run.** Expected: PASS. Commit.

### Task 8: Contact (form + email), legal pages, 404

**Files:**
- Create: `app/actions/contact.ts`, `components/contact/{ContactForm,Honeypot}.tsx`, `lib/rate-limit.ts`, `opengraph-image.tsx` for contact, `tests/contact.spec.ts`, `tests/unit/contact.test.ts`
- Modify: `contact/page.tsx`, `confidentialitate/page.tsx`, `termeni/page.tsx`, `app/[locale]/not-found.tsx` (only if it differs from spec §5.9), `.env.example`, `package.json`
- Port: `pages/contact/App.tsx`, `site/{Honeypot,antispam}.ts`.

**Interfaces:**
- `sendContact(prev: ContactState, form: FormData): Promise<ContactState>`, where `ContactState = { status: "idle" | "sent" | "invalid" | "limited" | "failed"; errors?: Partial<Record<Field, string>>; values?: Partial<Record<Field, string>> }`. It is a server action used with `useActionState`.
- Hidden fields: `startedAt` (ms) and the honeypot `website`.
- `rateLimit(key: string, max = 5, windowMs = 600_000): boolean` (`lib/rate-limit.ts`), an in-memory sliding window keyed by the IP from `headers()` (`x-forwarded-for`, first hop). Mark it `ponytail: per-instance memory, move to Postgres if Strix (M5) shows bypass across instances`.
- The mail transport: `resend.emails.send`. When `process.env.CONTACT_TRANSPORT === "log"` (tests only), it writes the escaped mail to `reports/mail/<ts>.json` instead.

- [ ] **Step 1: Write the failing tests.**
  - `tests/unit/contact.test.ts` (node:test) tests `sendContact` directly:
    - valid input → `sent`, with exactly 1 mail logged; the subject is „[Site] Carte · Name”, the reply-to is the sender, and `<script>` in the message appears as `&lt;script&gt;`;
    - honeypot filled → `sent` and 0 mails;
    - `startedAt` < 3 s ago → `sent` and 0 mails;
    - a bad email or a missing consent → `invalid`, with the field errors in the copy from `contactPage.errors`;
    - a 6th call from the same IP within 10 min → `limited`;
    - the transport throws → `failed`, with `values` echoed back.
  - `tests/contact.spec.ts`:
    - the form fields are labelled; the consent text links to the privacy page;
    - `?subiect=arta&lucrare=X` preselects Artă and prefills the message;
    - submitting empty shows inline errors and focuses the first invalid field;
    - a valid submit (with the Turnstile test site key, which always passes) shows the designed success state;
    - the email is selectable text with a copy button; WhatsApp, Instagram and Facebook links are present;
    - `/confidentialitate` and `/termeni` render their CMS text with `lastUpdated`, and the `<h1>`s are „Confidențialitate”, „Termeni”;
    - `/nu-exista` and `/en/nope` → 404 with „Pagina asta s-a rătăcit, ca Musca” (EN equivalent) and links to home and Universuri.
- [ ] **Step 2: Run** `npm run test:unit` and `npx playwright test tests/contact.spec.ts`. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - Add `zod` and `resend` to the dependencies.
  - Turnstile: load the script only on `/contact`, as the explicit-render invisible widget; the server verifies at `https://challenges.cloudflare.com/turnstile/v0/siteverify`. In tests, use Cloudflare's published test keys (`1x00000000000000000000AA` / `1x0000000000000000000000000000000AA`).
  - The form keeps the visitor's text on `failed`.
- [ ] **Step 4: Run.** Expected: PASS. Commit.

### Task 9: Whole-site verification, preview, STOP

**Files:**
- Modify:
  - `tests/routing.spec.ts`: crawl from every page in `PAGES`, not only `/` and `/en`. The `stubs` list goes;
  - `tests/foundation.spec.ts` / `seo.spec.ts`: the sitemap contains every page in both languages;
  - `CLAUDE.md` „Where things stand”;
  - spec §13 (M3 status) and §6 (the morph decision).

- [ ] **Step 1: Run the full local suite** `npm run typecheck && npm run check:copy && npm run test:unit && npx playwright test`. Expected: 0 failures.
- [ ] **Step 2: Run** `npm run seed` against Neon (idempotent). Then the user commits and pushes; Vercel deploys. Add the new env vars on Vercel (the list is in Global Constraints; the user pastes them, as in M2).
- [ ] **Step 3: Run** `BASE_URL=https://ramona-nichifor-website.vercel.app npx playwright test` (CMS tests with Vercel's `PREVIEW_SECRET`). Expected: 0 failures.
- [ ] **Step 4: Run Lighthouse mobile** on `/universuri`, `/carti/fluturele-dansator-de-step`, `/arta`, `/consiliere` and `/contact`: Accessibility ≥ 95, Best Practices ≥ 95. Performance is recorded, not gated (M5, option A).
- [ ] **Step 5: Validate the JSON-LD** of one page of each type in Google's Rich Results Test (preview URLs). Screenshot the results.
- [ ] **Step 6: The form delivers** a real message from the preview to `CONTACT_TO_EMAIL` (see „Questions for the user”).
- [ ] **Step 7: The user checks the morph on a real phone** (iPhone Safari + Android Chrome): orb → page and back, and with Reduce Motion on.
- [ ] **Step 8: Design pass.** `impeccable` critique/audit and `review-animations` on the new pages at 393 and 1180. Fix only material issues, rerun the suite, and send screenshots.
- [ ] **Step 9: STOP.** Send the preview links per page, the test, Lighthouse and Rich Results evidence and the screenshots, then wait for approval before M4.

## Decisions (user, 2026-10-25)

1. **Execution:** subagent-driven, with the model matched to each task:
   - **Opus:** Task 0 (morph spike), Task 3 (universes + morph), Task 8 (contact form security), and the final whole-branch review;
   - **Sonnet:** Tasks 1, 2, 4, 5, 6 and 7, and the per-task reviewers (Opus reviews Tasks 3 and 8);
   - **Haiku:** nothing (every task needs judgement on the mockup or the copy).
2. **Email:** the `ramonanichifor.com` domain is verified in Resend now. The user adds Resend's DNS records at Namecheap; Claude never signs in to the accounts.
   - Sender: `Site Ramona Nichifor <contact@ramonanichifor.com>`.
   - During development `CONTACT_TO_EMAIL` is the developer's inbox. It switches to Ramona's (`ramona_nichifor@yahoo.com`) only for the Task 9 delivery check, with the user's go-ahead, since that message reaches her.
3. **Turnstile in M3:** yes. The user creates the widget (Cloudflare → Turnstile → Add widget; hostnames `ramona-nichifor-website.vercel.app`, `localhost`, `ramonanichifor.com`) and puts the keys in `.env.local` + Vercel.
4. **Placeholder artworks:** only real works plus the „În curând” state (Global Constraints).
5. **Consiliere booking:** the honest „online booking opens soon” block until M4 (Task 6).
