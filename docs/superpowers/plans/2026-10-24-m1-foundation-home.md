# Move the project + M1 (Foundation and Acasă) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the repo to `~/code/RamonaNichifor-website`, then build M1: the Next.js foundation and the Acasă page, identical to the approved mockup (artifact v20), RO + EN, with basic SEO, on a Vercel preview link.

**Architecture:** One Next.js 16 App Router app at the repo root (`mockups/` stays as the archive, excluded from build, typecheck and Tailwind scanning). next-intl 4 handles `/` (RO) and `/en` (EN) with localised pathnames for every URL in spec §4. Pages are server components that read typed local data through async getters shaped like the future Payload Local API calls (`getSiteSettings(locale)` …), so M2 only swaps the getter bodies. Motion-heavy parts (Flight, parallax, menu sheet, toggle thumb) are client components; the butterfly flight loads after first paint.

**Tech Stack:** Next.js 16.4.x (Payload 3.92 supports `>=16.3.3 <17`), React 19, TypeScript, Tailwind CSS 4.3, next-intl 4.14, motion 12.x (same major as the mockup, so ported code runs unchanged), next/font, @playwright/test, Lighthouse CLI.

**Spec:** `docs/superpowers/specs/2026-09-30-ramona-site-design.md` (§4, §5.1, §5.10, §6, §8, §9, §10, §11, §13) · `DESIGN.md` · `PRODUCT.md` · reference code `mockups/src/poiana/`, `mockups/src/site/`, `mockups/src/shared/`.

## Context

- The user wants the folder moved into `~/code` (next to `evalkit`), then M1 planned and, after approval, built.
- User decisions (2026-10-24): **5 milestones instead of 7** (quality kept; each still ends with a preview link and an approval stop); **preview hosting: Vercel Hobby (free)**, since there is no shop yet.
- New milestone table (written into spec §2 + §13 and CLAUDE.md in Task 0):
  - **M1** Foundation + Acasă (this plan)
  - **M2** Payload (unchanged scope)
  - **M3** Universuri with the morph + every inner page (old M3 + M4: books, art, counselling, about, community, contact form, legal, 404), each page shipping its own metadata, JSON-LD, OG image and a11y checks as it is built
  - **M4** Booking (old M4b)
  - **M5** Security (Strix), final SEO/a11y/perf audit, real content, hosting decision, domains, launch, Search Console (old M5 + M6)
  - *M7 shop, later (unchanged)*

## Global Constraints

- Never use „Bine ai revenit acasă, puiule!” / "Welcome home, baby" in any copy, message file or metadata.
- No invented prices, dates, sizes, titles or testimonials; unknowns are „În curând” / „În lucru”. Her texts are copied exactly from `mockups/src/shared/content.ts`.
- Artwork (covers, paintings) is never cropped: real `width`/`height`, `h-auto`, `img.art` guard (no drag, no long-press, hidden in print, no context menu). Decorative cut-outs (butterfly, meadow, wash, scene) are exempt.
- Menu order: Acasă, Despre mine, Consiliere, Cărți, Artă, Universuri, Comunitate, Contact (top bar, floating bar, sheet, footer).
- Tokens, type, motion values: exactly DESIGN.md (front-matter + Motion Vocabulary). Plum ink, never black/grey; plum-tinted shadows only; SOFT 100 on every Fraunces setting, WONK 1 only on accent words.
- Fonts via `next/font/google` (self-hosted at build): Fraunces with `axes: ["SOFT","WONK","opsz"]`, normal + italic; Alegreya Sans 400/500/700 + italic 400/500; Parisienne 400; subsets `latin` + `latin-ext`. **No 600 weight anywhere** (`font-semibold` is banned; use `font-medium` or `font-bold` as DESIGN.md records).
- **No visitor cookies** (spec §11): `localeCookie: false`, `localeDetection: false` (so `/` is always RO, no redirects by Accept-Language).
- Tap targets ≥ 44px (primary 48px); desktop nav links get a 44px hit area.
- Every page opens at its top (also back/forward); only in-page anchors glide.
- `prefers-reduced-motion`: everything at its end state, no flight (butterfly perched, wings open), no parallax, no view transitions.
- Previews are **noindex** (`SITE_INDEXABLE` unset); indexing turns on only at launch (M5).
- Commit only when the user asks (plan "Commit" steps = stage + propose message, run on the user's OK).
- Test matrix for "done": phone 393×852 (iPhone 15) and laptop 1024, 1180 and 1440 wide; RO and EN; no horizontal scroll; no console errors; reduced motion.

## Review Focus

1. **Laptop 1024–1279px** (Ramona's window): 8 nav links + RO|EN + menu button must fit on one line in the top bar and the floating bar, no wrap, no horizontal scroll → test in Task 2 at 1024 and 1180.
2. **Language switch on a non-home URL** keeps the localised slug (`/carti` ↔ `/en/books`, `/universuri/fluturele` ↔ `/en/universes/butterfly`) and lands at the top → test in Task 2.
3. **Anchors vs. scroll-to-top:** „Intră în poveste” → `#universuri` must glide and not be reset by the open-at-top logic; back/forward must land at top → tests in Task 2.
4. **Romanian diacritics** in every used face/weight (Fraunces roman + WONK italic, Alegreya 400/500/700, Parisienne wordmark): ă â î ș ț render, comma-below → Task 1 font test + visual check in Task 6.
5. **Content visible at rest:** with reduced motion, and in the server HTML before JS, the full home text is present and `h1` ends at opacity 1 → tests in Tasks 3 and 6.

---

### Task 0: Move the folder and record the milestone decision

**Files:**
- Move: `~/Desktop/RamonaNichifor-website` → `~/code/RamonaNichifor-website`
- Modify: `graphify-out/.graphify_root`, `.impeccable/hook.cache.json` (absolute paths)
- Modify: `docs/superpowers/specs/2026-09-30-ramona-site-design.md` (§2 Delivery row, §12 preview default → Vercel Hobby, §13 table), `CLAUDE.md` ("Where things stand", "Stack", hosting line)
- Create: `docs/superpowers/plans/2026-10-24-m1-foundation-home.md` (this plan, copied)

- [x] **Step 1:** Confirm nothing runs from the folder (stop preview servers) and `~/code/RamonaNichifor-website` does not exist: `test ! -e ~/code/RamonaNichifor-website && echo free`.
- [x] **Step 2:** `mv ~/Desktop/RamonaNichifor-website ~/code/`
- [x] **Step 3:** Keep Claude's memory for the new path: `cp -R ~/.claude/projects/-Users-valistefanescu-Desktop-RamonaNichifor-website ~/.claude/projects/-Users-valistefanescu-code-RamonaNichifor-website` (old copy left in place).
- [x] **Step 4:** Replace `/Users/valistefanescu/Desktop/RamonaNichifor-website` with `/Users/valistefanescu/code/RamonaNichifor-website` in the two files above. Switch this session's directory to the new path (`change_directory`).
- [x] **Step 5:** Verify: `cd ~/code/RamonaNichifor-website && git status --short` shows the same two pre-existing changes (spec modified, CLAUDE.md untracked) and nothing else; `cd mockups && npm run build` still passes.
- [x] **Step 6:** Write the 5-milestone table (Context above) into spec §2/§13 and CLAUDE.md; set the preview host to Vercel Hobby (free, non-commercial previews; the launch host is still decided in M5). Copy this plan to `docs/superpowers/plans/2026-10-24-m1-foundation-home.md`.

---

### Task 1: Next.js foundation (tokens, fonts, i18n, data layer, primitives, test rig)

Everything later tasks build on. Serial; Tasks 2–5 start after it.

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json` (`exclude: ["mockups", "node_modules"]`), `postcss.config.mjs`, `proxy.ts` (Next 16 name for middleware), `.gitignore` (+ `.next`, `test-results`, `playwright-report`, `.vercel`)
- Create: `app/globals.css`, `app/fonts.ts`, `app/[locale]/layout.tsx`, `app/[locale]/(site)/layout.tsx` (renders `{children}` only; Task 2 fills it), `app/[locale]/(site)/page.tsx`
- Create: `i18n/routing.ts`, `i18n/navigation.ts`, `i18n/request.ts`, `messages/ro.json`, `messages/en.json`
- Create: `content/types.ts`, `content/data.ts`, `content/index.ts`
- Create: `components/ui/{icons,creatures,PillLink,TextLink,StatusChip,BuySoon,CopyEmail,ArtGuard}.tsx`, `components/poiana/Butterfly.tsx`, `components/poiana/PaintDefs.tsx`
- Create (empty section stubs, `return null`, filled by Tasks 3/4): `components/poiana/{Hero,Flight,Paths,UniversesPreview,FeaturedBook,AboutTeaser,ArtTeaser,CounsellingTeaser}.tsx`
- Copy: `mockups/public/img/{wash,meadow,meadow-wide,butterfly-wing-l,butterfly-wing-r,cover-fluturele,cover-buburuza,buburuza-scene,portrait}.webp` → `public/img/`
- Create: `playwright.config.ts`, `tests/foundation.spec.ts`
- Modify: `.claude/launch.json` (add `site-dev`: `npm run dev` on 3000, `site-prod`: `npm run build && npm start` on 3000)

**Interfaces (Produces):**
- `routing` (`i18n/routing.ts`): `defineRouting({ locales: ["ro","en"], defaultLocale: "ro", localePrefix: "as-needed", localeCookie: false, localeDetection: false, pathnames })` with every spec §4 route: `/`, `/universuri`→`/universes`, `/universuri/[slug]`→`/universes/[slug]`, `/carti`→`/books`, `/carti/[slug]`→`/books/[slug]`, `/arta`→`/art`, `/arta/[slug]`→`/art/[slug]`, `/consiliere`→`/counselling`, `/despre`→`/about`, `/comunitate`→`/community`, `/contact`, `/confidentialitate`→`/privacy`, `/termeni`→`/terms`.
- `Link`, `useRouter`, `usePathname`, `getPathname` from `i18n/navigation.ts` (`createNavigation(routing)`).
- `type Locale = "ro" | "en"`; `type Media = { src: string; alt: string; width: number; height: number }`.
- `content/types.ts` (shapes = Payload documents after locale resolution):
  - `SiteSettings { name; roles; rolesShort; souls; whisper; intro; series; seriesLead; manifesto: { before: string; emphasis: string; after: string }[]; contacts: { email; whatsapp: { href; number }; instagram: { href; handle }; facebook: { href; handle } }; sameAs: string[]; portrait: Media; seo: { homeTitle; description } }`
  - `Universe { slug: string; name; bookTitle; hook; status: "available" | "soon"; tint: [string, string, string]; order: number; homeWindow: "meadow" | "scene" | "creature"; scene?: Media; creature?: "buburuza" | "tantar" | "musca" }`
  - `Book { slug; title; subtitle; ageGroup: "copii" | "adolescenti" | "adulti"; cover: Media; blurb: string[]; year: number; isbn: string; storeLinks: { store: string; url: string }[]; universeSlug: string; status: "published" | "soon" | "writing" }`
  - `Artwork { slug; title; technique; kind: "original" | "print"; images: Media[] }`
  - `CounsellingPage { teaserTitle; teaserLead; formats: { kind: "online" | "inPerson"; title; line }[] }`
- `content/index.ts` (`import "server-only"`): `getSiteSettings(locale): Promise<SiteSettings>`, `getUniverses(locale): Promise<Universe[]>` (sorted by `order`), `getFeaturedBook(locale): Promise<Book>`, `getHomeArtworks(locale): Promise<Artwork[]>`, `getCounsellingPage(locale): Promise<CounsellingPage>`.
- `content/data.ts`: the mockup copy from `mockups/src/shared/content.ts` as `{ ro, en }` per localized field; slugs localized: fluturele/butterfly, buburuza/ladybird, tantarul/mosquito, musca/fly (spec gives only the first; the rest follow its pattern — flag to the user). Home "art" = the two covers (766×1120, 758×1120), technique „Ilustrația de copertă”.
- `messages/*.json`: `nav.*`, `ui.*` from `content.ts` (`nav`, `ui`, `mockupNote`), plus `meta.*`, `notFound.*`, `stub.*` keys added by later tasks.
- Primitives ported from `mockups/src/site/Layout.tsx`, `StatusChip.tsx`, `shared/CopyEmail.tsx` with `href` going through `Link` for internal routes: `PillLink({ href, icon, external?, className?, children })`, `TextLink({ href, external?, className?, children })`, `StatusChip({ children })`, `BuySoon({ link?, className? })`, `CopyEmail({ email, className? })`. `ArtGuard` = client component adding the contextmenu guard for `img.art` (from `mount.tsx guardArt`).
- `globals.css`: `@import "tailwindcss" source(none); @source "../app"; @source "../components";` + `mockups/src/poiana/tokens.css` (`@theme` colours, `--font-*` mapped to next/font variables, `--ease-bloom`, keyframes, `.display`, `.paint-edge`, `.arch`, `.shadow-*`, `.snap-row`) + `mockups/src/shared/base.css` (butterfly wings, `img.art`, view-transition root, reduced-motion block). Add `--color-paper-mat: #fffdf9`.
- `[locale]/layout.tsx`: `generateStaticParams` for both locales, `setRequestLocale`, `<html lang={locale}>` with the three font variables, `NextIntlClientProvider`, `MotionConfig reducedMotion="user"`, `PaintDefs`, `ArtGuard`. Unknown locale → `notFound()`.

- [x] **Step 1: Write the failing test** `tests/foundation.spec.ts`:
  - `"/ serves Romanian"`: `page.goto("/")` → `html[lang]` is `ro`, status 200.
  - `"/en serves English"`: `html[lang]` is `en`.
  - `"no visitor cookies"`: after `goto("/")` and `goto("/en")`, `context.cookies()` is `[]`.
  - `"fonts include latin-ext"`: `document.fonts.check('380 1em Fraunces', 'Țânțarului Poveștile ăâîșț')` is true after `document.fonts.ready` (use the next/font family name read from `getComputedStyle(h1).fontFamily`).
  - `"no 600 weight"`: no element has computed `font-weight: 600` (`[...document.querySelectorAll('*')].every(e => getComputedStyle(e).fontWeight !== '600')`).
  - `"banned tagline absent"`: page text of `/` and `/en` contains neither „Bine ai revenit acasă” nor "Welcome home".
  - Playwright config: `webServer: npm run build && npm start`, projects `phone` (`devices["iPhone 15"]`), `laptop-1024` (1024×768), `laptop-1180` (1180×800), `laptop-1440` (1440×900); fail on any `console.error` / `pageerror` via a shared fixture in `tests/fixtures.ts`.
- [x] **Step 2:** Run `npx playwright test tests/foundation.spec.ts` → FAIL (no app).
- [x] **Step 3:** Scaffold everything listed above. Versions: `next@16.4`, `react@19`, `next-intl@4.14`, `motion@^12.43`, `tailwindcss@^4.3`, `@tailwindcss/postcss`, `server-only`; dev: `typescript`, `@types/*`, `@playwright/test`, `lighthouse`. Scripts: `dev`, `build`, `start`, `typecheck` (`tsc --noEmit`), `test` (`playwright test`), `lighthouse` (Task 6), `check:copy` (`! grep -rIn -e "Bine ai revenit acasă" -e "Welcome home" app components content messages`). `next.config.ts`: next-intl plugin, `images.formats: ["image/avif","image/webp"]`.
- [x] **Step 4:** Run `npm run typecheck && npm run check:copy && npx playwright test tests/foundation.spec.ts` → all PASS on all 4 projects.
- [x] **Step 5: Commit** (on the user's OK): `feat(m1): next.js foundation, tokens, fonts, i18n and typed content`.

---

### Task 2: Site chrome, language switch, open-at-top, stub routes, 404

**Files:**
- Create: `components/site/{TopBar,FloatingBar,MenuSheet,MenuButton,Wordmark,SocialLinks,Footer,LangSwitch,ChromeShell,OpenAtTop,StubPage}.tsx`, `lib/menu.ts`
- Modify: `app/[locale]/(site)/layout.tsx` (wrap children in `ChromeShell`)
- Create stub routes (each renders `<StubPage titleKey=…/>`, `robots: noindex`): `app/[locale]/(site)/{universuri,universuri/[slug],carti,carti/[slug],arta,arta/[slug],consiliere,despre,comunitate,contact,confidentialitate,termeni}/page.tsx`; `[slug]` routes use `generateStaticParams` from the getters (universes, the featured book) and `notFound()` otherwise.
- Create: `app/[locale]/not-found.tsx`, `app/[locale]/[...rest]/page.tsx` (calls `notFound()` so unknown URLs get the localized 404)
- Test: `tests/chrome.spec.ts`, `tests/routing.spec.ts`

**Interfaces:**
- Consumes: `routing`, `Link`/`useRouter`/`usePathname` (Task 1), `SiteSettings.contacts`, `CopyEmail`, icons, `messages.nav.*`.
- Produces: `menu: { id: PageId; labelKey: string; href: Pathname }[]` in `lib/menu.ts` (client order); `type PageId = "home" | "universuri" | "carti" | "despre" | "arta" | "consiliere" | "comunitate" | "contact"`; `ChromeShell({ current?: PageId, ground?: "cream" | "sky" | "sage" | "mist" | "petal", children })` — `current` derived from `usePathname()` when omitted; Home uses `ground="cream"`.
- Port 1:1 from `mockups/src/site/Chrome.tsx` + `Footer.tsx` (classes, timings, clip-path circle from the menu button 0.7s bloom, 0.045s stagger, 1.08 item grow, floating bar after 0.85 viewport, blur-in 0.5s). Changes vs the mockup: internal links via `Link`; `font-semibold` → `font-bold` (toggle label is 700 per DESIGN.md); the wordmark is hidden on Home; MenuSheet adds a focus trap (Tab stays inside, focus returns to the menu button on close).
- `LangSwitch`: same pill + `layoutId` thumb (spring bounce 0, 0.35s). On click: `router.replace({ pathname, params }, { locale, scroll: false })` wrapped in `document.startViewTransition` (skipped under reduced motion; `.ready`/`.finished` rejections swallowed). `<html lang>` follows from the server render.
- `OpenAtTop` (client, mounted once in ChromeShell): `history.scrollRestoration = "manual"`; on pathname change and on `pageshow` (persisted) jump with `behavior: "instant"` to top unless the URL has a hash; never yank once the visitor scrolled (port the `moved` guard from `mockups/src/site/mount.tsx`). `html { scroll-behavior: smooth }` stays for anchors.
- `StubPage`: the inner-page opener from `mockups/src/site/Layout.tsx PageOpener` (title from `nav.*`, masked wash, page ground tint per DESIGN.md: petal Cărți/Comunitate, sage Consiliere, lilac Despre, mist Artă/Contact, sky Universuri) + `StatusChip` „În curând” and one line `stub.line` („Pagina aceasta se pregătește.” / "This page is on its way."). Replaced in M3.
- 404: „Pagina asta s-a rătăcit, ca Musca” / EN "This page wandered off, like the Fly" (EN pending Ramona's approval), the Musca creature on its tint, links Acasă + Universuri.

- [x] **Step 1: Write the failing tests.**
  `chrome.spec.ts`:
  - `"menu order"`: top-bar nav (laptop) and sheet (phone) link texts equal `["Acasă","Despre mine","Consiliere","Cărți","Artă","Universuri","Comunitate","Contact"]` on `/`, and the EN equivalents on `/en`.
  - `"desktop nav fits at 1024 and 1180"` (laptop projects): header `getBoundingClientRect().height < 80`, every nav link `height >= 44`, `document.documentElement.scrollWidth <= innerWidth`.
  - `"wordmark hidden on home, shown on /carti"`.
  - `"menu sheet"`: open via button → `role=dialog` visible, `body` overflow hidden, Tab cycles inside, Escape closes and focus returns to the menu button.
  - `"floating bar appears after the hero"`: scroll `0.9 * innerHeight` → floating bar visible with wordmark.
  - `"lang switch keeps the page"`: on `/carti` click EN → URL `/en/books`, `lang=en`, `scrollY === 0`; on `/en/universes/butterfly` click RO → `/universuri/fluturele`.
  - `"copy email"`: click „Copiază” → button reads „Copiat” (grant clipboard permission).
  - `"404"`: `/nu-exista` → status 404, text contains „s-a rătăcit”; `/en/missing` → EN copy, `lang=en`.
  `routing.spec.ts` (port of `mockups/scripts/check-routing.js` without the artifact-host emulation): for `/` and `/en`, scroll to each internal link's position, click it, assert `response.status() < 400`, `scrollY === 0` right after load and 1.2s later; then `page.goBack()` → `scrollY === 0`; the sheet's links the same on phone. Report a fail list; the test asserts it is empty.
- [x] **Step 2:** Run `npx playwright test tests/chrome.spec.ts tests/routing.spec.ts` → FAIL.
- [x] **Step 3:** Implement the files above.
- [x] **Step 4:** Run the two specs on all 4 projects → PASS (0 routing failures).
- [x] **Step 5: Commit** (on OK): `feat(m1): header, floating bar, menu sheet, language switch, footer, stubs and 404`.

---

### Task 3: Acasă top — Hero, butterfly flight, paths, universes preview

Runs in parallel with Tasks 2, 4, 5 (disjoint files).

**Files:**
- Modify (fill stubs): `components/poiana/{Hero,Flight,Paths,UniversesPreview}.tsx`, `components/poiana/HomeFlightZone.tsx` (create: client wrapper owning `landed`, `zoneRef`, `startRef`, `perchRef`, as `mockups/src/poiana/App.tsx` does)
- Modify: `app/[locale]/(site)/page.tsx` only inside the `HomeFlightZone` block
- Test: `tests/home-top.spec.ts`

**Interfaces:**
- Consumes: `SiteSettings`, `Universe[]` (props from the server page), `Butterfly`, icons, `Creature`, `Link`, `messages.ui.*`.
- Produces: `Hero({ site, startRef })`, `Paths({ site })`, `UniversesPreview({ site, universes, perchRef, landed })`, `Flight({ zoneRef, startRef, endRef, onLanded })` (loaded with `next/dynamic(..., { ssr: false })` so it never blocks first paint), `HomeFlightZone({ site, universes })`.
- Port 1:1 from `mockups/src/poiana/{Hero,Flight,Sections(Paths,Universes)}.tsx`: all clamp sizes, parallax (wash 18%, back meadow −10%, meadow −26%, text 22%), entrance delays (0.25/0.37/0.62/0.72/0.84/1.0s), Catmull-Rom path, spring (70/18/0.7), bank ≤28°, handover at 0.992, perch twin, reduced-motion branch. Changes: images through `next/image` (`meadow.webp` / `meadow-wide.webp` via `<picture>`-equivalent: two `Image`s toggled with `lg:hidden` / `hidden lg:block`, `priority` + `sizes="100vw"`; wash `priority`), path chips and windows link to `/carti`, `/arta`, `/consiliere`, `/universuri/[slug]` via `Link`; universe badge `font-semibold` → `font-bold`.

- [x] **Step 1: Write the failing test** `home-top.spec.ts`:
  - `"hero text"`: `h1` text `"Ramona Nichifor"` (RO and EN), tagline = `souls`, roles line present, CTA „Intră în poveste” / "Step into the story".
  - `"server HTML has the content"`: `request.get("/")` body contains „Povești pentru suflete mici și mari”, „Universul Fluturelui”, „Fluturele dansator de step”.
  - `"CTA glides to #universuri"`: click CTA → after 1.5s `#universuri` top within `0..120px` of viewport and URL hash `#universuri` (not reset to 0).
  - `"three path chips"` link to `/carti`, `/arta`, `/consiliere` (`/en/books` … on EN).
  - `"four windows"` in order Fluturelui, Buburuzei, Țânțarului, Muștei, each `href` `/universuri/{fluturele,buburuza,tantarul,musca}`; phone: row scrolls sideways inside itself while `documentElement.scrollWidth <= innerWidth`.
  - `"butterfly lands"` (not reduced): scroll `#universuri` into the middle, wait 2s → the perched butterfly in the Fluture window has opacity 1.
  - `"reduced motion"` (`page.emulateMedia({ reducedMotion: "reduce" })`): no flying butterfly element, the hero perch butterfly and the window butterfly are visible, `h1` computed opacity `"1"` immediately after load.
- [x] **Step 2:** Run → FAIL.
- [x] **Step 3:** Implement.
- [x] **Step 4:** Run on all projects → PASS.
- [x] **Step 5: Commit** (on OK): `feat(m1): home hero, butterfly flight, paths and universes`.

---

### Task 4: Acasă lower sections — featured book, about, art, counselling

Parallel with Tasks 2, 3, 5.

**Files:**
- Modify (fill stubs): `components/poiana/{FeaturedBook,AboutTeaser,ArtTeaser,CounsellingTeaser}.tsx`, create `components/poiana/TiltCover.tsx`
- Test: `tests/home-lower.spec.ts`

**Interfaces:**
- Consumes: `Book`, `SiteSettings`, `Artwork[]`, `CounsellingPage`, `PillLink`, `TextLink`, `BuySoon`, `CopyEmail`, icons.
- Produces: `FeaturedBook({ book, site })`, `AboutTeaser({ site })`, `ArtTeaser({ artworks })`, `CounsellingTeaser({ site, counselling })` — the page (Task 1) already renders them in this order after the flight zone.
- Port 1:1 from `mockups/src/poiana/Sections.tsx` (`Book`, `TiltCover`, `About`, `Art`, `Counselling`). Changes: covers/portrait via `next/image` with real `width`/`height` (`sizes` per breakpoint, `className="art …"` on covers, never `object-cover` on artwork: the cover keeps `aspect-[766/1120]` = its own ratio); book meta line stays **below** the title (spec §13 fix 1); `font-semibold` → `font-bold`; links via `Link` to `/carti/fluturele-dansator-de-step`, `/despre`, `/arta`, `/consiliere`. TiltCover keeps ±7°/±5° on mouse only, −2.5° rest, spring 150/18.

- [x] **Step 1: Write the failing test** `home-lower.spec.ts`:
  - `"book"`: `h2` „Fluturele dansator de step”, subtitle „O poveste pentru copii… o șoaptă pentru adulți”, meta „Pentru copii · 2026 · „Magia suntem noi”” positioned below the `h2` (`meta.top > h2.bottom`), „În curând · Comenzile online se pregătesc.”, `ISBN 978-973-0-44382-0`, no store links.
  - `"art never cropped"`: for every `img.art`, `|naturalWidth/naturalHeight − clientWidth/clientHeight| < 0.01`; right-click on one does not open a context menu (`contextmenu` event `defaultPrevented`).
  - `"manifesto"`: three lines, emphasised words `intuiție`, `imagine`, `simțim` in `em` (EN: `intuition`, `image`, `feel`).
  - `"counselling teaser"`: WhatsApp link `https://wa.me/40730775132` opens in a new tab (`target=_blank`, `rel` includes `noreferrer`); email `ramona_nichifor@yahoo.com` visible.
  - `"EN copy"` on `/en`: "About me", "The Tap-Dancing Butterfly", "See the whole gallery".
- [x] **Step 2:** Run → FAIL.
- [x] **Step 3:** Implement.
- [x] **Step 4:** Run on all projects → PASS.
- [x] **Step 5: Commit** (on OK): `feat(m1): home book, about, art and counselling sections`.

---

### Task 5: SEO basics — metadata, hreflang, JSON-LD, robots, sitemap, OG image

Parallel with Tasks 2–4.

**Files:**
- Create: `lib/seo.ts`, `components/seo/JsonLd.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/[locale]/opengraph-image.tsx`, `public/favicon` set (`app/icon.png` from the butterfly cut-out, `app/apple-icon.png`)
- Modify: `app/[locale]/layout.tsx` (add `generateMetadata` + `<JsonLd>`), `messages/*.json` (`meta.*`)
- Test: `tests/seo.spec.ts`

**Interfaces:**
- Consumes: `getSiteSettings`, `getPathname`, `routing`.
- Produces: `siteUrl(): string` (`process.env.NEXT_PUBLIC_SITE_URL ?? "https://ramonanichifor.com"`), `isIndexable(): boolean` (`process.env.SITE_INDEXABLE === "1"`), `pageMetadata({ locale, pathname, title?, description? }): Metadata` (canonical self URL, `alternates.languages` ro / en / `x-default`→RO, `openGraph` with `locale` `ro_RO`/`en_US`, `twitter: summary_large_image`, `robots: { index: isIndexable(), follow: isIndexable() }`) — M3 pages reuse it; `siteGraph(settings, locale): object` → `@graph` of `WebSite` (`name`, `url`, `inLanguage`) + `Person` (`name`, `url`, `image` = portrait absolute URL, `jobTitle` = the three roles of that locale, `description` = `intro`, `sameAs` = `settings.sameAs`).
- Titles (spec §8): home RO „Ramona Nichifor · Autoare, ilustratoare și consilier pentru dezvoltare personală”, EN "Ramona Nichifor · Author, illustrator and personal development counsellor"; template `"%s · Ramona Nichifor"`. Descriptions: RO from the mockup `index.html` meta, EN its translation.
- `robots.ts`: allow all + sitemap when indexable, `Disallow: /` otherwise. `sitemap.ts`: `/` and `/en` with `alternates.languages` (inner pages join in M3 when they stop being stubs).
- OG image (1200×630): cream→sky wash, the Fluturele cover on the right, „Ramona Nichifor” in Fraunces (a static TTF instance at SOFT 100, committed as `assets/og/Fraunces-Soft.ttf` and read with `fs` in the route — `next/og` cannot use variable axes or next/font files), tagline per locale.

- [x] **Step 1: Write the failing test** `seo.spec.ts`:
  - `"titles"`: `/` title = the RO string above, `/en` = EN string.
  - `"hreflang + canonical"`: `/` has `link[rel=alternate][hreflang=ro|en|x-default]` with absolute URLs (`x-default` → RO), canonical = self.
  - `"json-ld"`: parse `script[type="application/ld+json"]` → `@graph` contains `Person` with `name "Ramona Nichifor"`, `sameAs` including the Instagram and Facebook URLs, and `WebSite`.
  - `"preview is noindex"`: without `SITE_INDEXABLE`, `meta[name=robots]` contains `noindex` and `/robots.txt` contains `Disallow: /`.
  - `"og image"`: `GET /opengraph-image` (RO) and `/en/opengraph-image` → 200, `content-type image/png`.
  - `"sitemap"`: `/sitemap.xml` lists `/` and `/en` with `xhtml:link` alternates.
- [x] **Step 2:** Run → FAIL.
- [x] **Step 3:** Implement.
- [x] **Step 4:** Run → PASS. Also validate the JSON-LD block from the built `/` HTML in Google's Rich Results Test (paste code mode) and Schema.org validator; screenshot the result.
- [x] **Step 5: Commit** (on OK): `feat(m1): metadata, hreflang, Person/WebSite JSON-LD, robots, sitemap, OG image`.

---

### Task 6: Verification, design polish, preview deploy — then STOP

Serial, after Tasks 2–5. Uses the skills `superpowers:verification-before-completion`, `impeccable` (critique + audit + polish), `review-animations`, `mobile-native`, `vercel-react-best-practices`, `playwright-cli`.

**Files:** fixes wherever the checks point; `scripts/lighthouse.mjs` (runs Lighthouse mobile on `/` and `/en`, asserts thresholds, writes `reports/lighthouse/*.html`, gitignored).

- [x] **Step 1:** Full suite: `npm run typecheck && npm run check:copy && npx playwright test` → 0 failures on phone, 1024, 1180, 1440.
- [x] **Step 2: Visual parity with the mockup.** Serve the mockup (`mockups-preview`, 4173) and the site (`site-prod`, 3000); with reduced motion on (static frames) capture full-page screenshots of `/` and `/en` at 393, 1024, 1180, 1440 for both; compare side by side section by section (spacing, type sizes, colours, arches, meadow, footer). Then with motion: record the hero entrance and the flight + landing on phone and laptop and compare with the mockup. Any difference is fixed unless it is one of the three spec §13 fixes.
- [x] **Step 3: Lighthouse** (prod build with `SITE_INDEXABLE=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000`, mobile preset, 3 runs, median): `/` and `/en` → **SEO 100, Accessibility ≥ 95, Performance ≥ 90**, Best Practices ≥ 95; LCP < 2.5s, CLS < 0.05. If LCP is late because the `h1` rises from opacity 0, keep the visual and check that the LCP element is the meadow/heading at its first painted frame; fix by `priority` images and font `display: swap` before touching the animation, and report numbers honestly.
- [x] **Step 4: Design review**: `impeccable` critique + audit against DESIGN.md on the running site (phone + laptop), `review-animations` on Hero/Flight/MenuSheet/LangSwitch, `mobile-native` checks (tap highlight, 100svh, safe areas, no zoom). Apply the material fixes, rerun Step 1.
- [x] **Step 5: Real-device check** of the phone hero, flight and menu in iOS Simulator Safari (393 wide) and Chrome; reduced motion via OS setting.
- [x] **Step 6: Preview on Vercel (Hobby, free).** The user connects once (Vercel → Import the GitHub repo `ValentinStefanescu22/RamonaNichifor-website`, root = repo root, framework Next.js; or `npx vercel login` + `npx vercel link` in a terminal). Then deploy a preview: `npx vercel deploy` (no `--prod`, `SITE_INDEXABLE` unset → noindex). Run `tests/routing.spec.ts` + `tests/seo.spec.ts` against the preview URL (`BASE_URL=<preview> npx playwright test …`) and Lighthouse once on it.
- [x] **Step 7: STOP.** Send the user the preview link, the phone/laptop screenshots (RO + EN), the Lighthouse scores and the test summary. Wait for approval before M2.

---

## Verification (end to end)

- `npm run typecheck && npm run check:copy && npx playwright test` → green on phone (iPhone 15, 393px) and laptop (1024 / 1180 / 1440), RO and EN.
- `node scripts/lighthouse.mjs` → `/` and `/en` mobile: SEO 100, A11y ≥ 95, Perf ≥ 90.
- Side-by-side screenshots + motion recordings vs the mockup (artifact v20) show no unintended differences.
- Vercel preview URL opens, is noindex, routing test reports 0 failures against it.

## Notes for the user (flag, don't decide)

- EN slugs for unpublished universes (ladybird / mosquito / fly) and the 404 EN line are working copy, like the EN book titles.
- Vercel Hobby is fine for previews; whether the launched site (counselling is a paid service) needs Pro or another host is decided in M5.

---

## Outcome (2026-10-25)

Done, with these deviations: the language switch is a full page load (Next 16.4 locale-switch prefetch loop); fonts are local subsets (`assets/fonts`); OG images are static PNGs (`scripts/make-og.mjs`); Lighthouse performance 84–85 accepted until M5 (option A); the Vercel preview (Task 6 Step 6) moved to the end of M2; the iOS Simulator check (Step 5) ran as WebKit iPhone 15 emulation because this Mac has no full Xcode.
